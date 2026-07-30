/**
 * Open Trivia Database client.
 *
 * Three things the API forces on us, per `API_ANALYSIS.md`:
 *
 * 1. **One request per IP every 5 seconds.** Every call goes through a single
 *    serialised gate that waits out the remainder of that window, and a
 *    `response_code: 5` still gets a backoff retry on top.
 * 2. **Session tokens expire after 6h of inactivity.** The token is persisted
 *    so a returning player reuses it instead of burning a request on every
 *    mount — which is also what keeps the first quiz load instant.
 * 3. **Text is encoded.** We ask for `encode=base64` and decode as UTF-8; the
 *    default HTML-entity encoding needs a DOM to unescape safely.
 */

const BASE = "https://opentdb.com"
const MIN_REQUEST_INTERVAL_MS = 5000
const TOKEN_KEY = "tq_session_token"
const TOKEN_TS_KEY = "tq_session_token_at"
const TOKEN_MAX_AGE_MS = 5.5 * 60 * 60 * 1000 // refresh before the 6h cutoff

export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "multiple" | "boolean"

export type RawQuestion = {
  type: QuestionType
  difficulty: Difficulty
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export type AnswerOption = { letter: string; text: string }

export type Question = {
  type: QuestionType
  difficulty: Difficulty
  category: string
  question: string
  correct: string
  /** Present for `multiple` only; already shuffled and lettered A-D. */
  options?: AnswerOption[]
}

export type FetchConfig = {
  amount: number
  categoryId: number | "any"
  difficulty: Difficulty | "any"
  type: QuestionType | "any"
}

/** Failures the UI distinguishes between. */
export type TriviaErrorKind = "no-results" | "network" | "api"

export class TriviaError extends Error {
  kind: TriviaErrorKind
  constructor(kind: TriviaErrorKind, message: string) {
    super(message)
    this.kind = kind
    this.name = "TriviaError"
  }
}

// --- request gate -----------------------------------------------------------

let lastRequestAt = 0
/** Serialises callers so two concurrent fetches cannot share one time slot. */
let gate: Promise<unknown> = Promise.resolve()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function waitForSlot() {
  const elapsed = Date.now() - lastRequestAt
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await sleep(MIN_REQUEST_INTERVAL_MS - elapsed)
  }
  lastRequestAt = Date.now()
}

/**
 * Fetch JSON while respecting the rate limit. `response_code: 5` and HTTP 429
 * both mean "too fast" - back off and try again, twice at most.
 */
async function apiGet<T>(path: string, attempt = 0): Promise<T> {
  const run = gate.then(async () => {
    await waitForSlot()
    return fetch(BASE + path, { cache: "no-store" })
  })
  // Keep the chain alive even if this call throws, or later callers deadlock.
  gate = run.catch(() => undefined)

  let res: Response
  try {
    res = await run
  } catch {
    throw new TriviaError("network", "CONNECTION ERROR. CHECK YOUR NETWORK.")
  }

  if (res.status === 429) {
    if (attempt >= 2) {
      throw new TriviaError("api", "TRIVIA DATABASE IS BUSY. TRY AGAIN.")
    }
    await sleep(MIN_REQUEST_INTERVAL_MS * (attempt + 1))
    return apiGet<T>(path, attempt + 1)
  }
  if (!res.ok) {
    throw new TriviaError("api", "COULD NOT LOAD QUESTIONS. TRY AGAIN.")
  }

  let data: T & { response_code?: number }
  try {
    data = (await res.json()) as T & { response_code?: number }
  } catch {
    throw new TriviaError("api", "COULD NOT LOAD QUESTIONS. TRY AGAIN.")
  }

  if (data.response_code === 5) {
    if (attempt >= 2) {
      throw new TriviaError("api", "TRIVIA DATABASE IS BUSY. TRY AGAIN.")
    }
    await sleep(MIN_REQUEST_INTERVAL_MS * (attempt + 1))
    return apiGet<T>(path, attempt + 1)
  }

  return data
}

// --- token ------------------------------------------------------------------

function readStoredToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const at = Number(localStorage.getItem(TOKEN_TS_KEY) || "0")
    if (!token || !at) return null
    if (Date.now() - at > TOKEN_MAX_AGE_MS) return null
    return token
  } catch {
    return null
  }
}

function storeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_TS_KEY, String(Date.now()))
  } catch {
    // Private mode / storage disabled - the token just won't survive a reload.
  }
}

function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_TS_KEY)
  } catch {
    // ignored
  }
}

async function requestToken(): Promise<string | null> {
  try {
    const data = await apiGet<{ token?: string }>(
      "/api_token.php?command=request"
    )
    if (data.token) {
      storeToken(data.token)
      return data.token
    }
  } catch {
    // A token is an optimisation, not a requirement - play without it.
  }
  return null
}

async function resetToken(token: string): Promise<string | null> {
  try {
    await apiGet("/api_token.php?command=reset&token=" + token)
    storeToken(token)
    return token
  } catch {
    return null
  }
}

/** Returns a usable token, minting one only when there isn't a fresh one. */
export async function getToken(): Promise<string | null> {
  return readStoredToken() ?? (await requestToken())
}

// --- decoding ---------------------------------------------------------------

/** OpenTDB base64 holds UTF-8 bytes, so `atob` alone mangles non-ASCII. */
function decodeBase64(value: string): string {
  try {
    const binary = atob(value)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return value
  }
}

function shuffle<T>(input: readonly T[]): T[] {
  const a = input.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

const LETTERS = ["A", "B", "C", "D"]

function normalise(raw: RawQuestion): Question {
  const type = decodeBase64(raw.type) as QuestionType
  const correct = decodeBase64(raw.correct_answer)
  const base = {
    type,
    difficulty: decodeBase64(raw.difficulty) as Difficulty,
    category: decodeBase64(raw.category),
    question: decodeBase64(raw.question),
    correct,
  }
  if (type !== "multiple") return base
  const options = shuffle([
    correct,
    ...raw.incorrect_answers.map(decodeBase64),
  ]).map((text, i) => ({ letter: LETTERS[i], text }))
  return { ...base, options }
}

// --- public API -------------------------------------------------------------

function buildQuestionPath(config: FetchConfig, token: string | null) {
  const params = new URLSearchParams({
    amount: String(config.amount),
    encode: "base64",
  })
  if (config.categoryId !== "any") {
    params.set("category", String(config.categoryId))
  }
  if (config.difficulty !== "any") params.set("difficulty", config.difficulty)
  if (config.type !== "any") params.set("type", config.type)
  if (token) params.set("token", token)
  return "/api.php?" + params.toString()
}

type QuestionsResponse = { response_code: number; results?: RawQuestion[] }

/**
 * Fetch and normalise a quiz's worth of questions.
 *
 * Codes 3 (token not found) and 4 (token exhausted) are recovered from once by
 * minting or resetting the token; a second failure surfaces to the caller.
 */
export async function fetchQuestions(
  config: FetchConfig,
  isRetry = false
): Promise<Question[]> {
  const token = await getToken()
  const data = await apiGet<QuestionsResponse>(buildQuestionPath(config, token))

  if (data.response_code === 3 || data.response_code === 4) {
    if (isRetry) {
      throw new TriviaError("api", "COULD NOT LOAD QUESTIONS. TRY AGAIN.")
    }
    if (data.response_code === 4 && token) {
      await resetToken(token)
    } else {
      clearStoredToken()
      await requestToken()
    }
    return fetchQuestions(config, true)
  }

  if (data.response_code === 1) {
    throw new TriviaError(
      "no-results",
      "NOT ENOUGH QUESTIONS FOR THESE FILTERS"
    )
  }
  if (data.response_code !== 0 || !data.results?.length) {
    throw new TriviaError("api", "COULD NOT LOAD QUESTIONS. TRY AGAIN.")
  }

  return data.results.map(normalise)
}

type CountResponse = {
  category_question_count?: {
    total_question_count?: number
    total_easy_question_count?: number
    total_medium_question_count?: number
    total_hard_question_count?: number
  }
}

/** How many questions exist for a category at a given difficulty. */
export async function fetchCategoryCount(
  categoryId: number,
  difficulty: Difficulty | "any"
): Promise<number> {
  const data = await apiGet<CountResponse>(
    "/api_count.php?category=" + categoryId
  )
  const counts = data.category_question_count ?? {}
  const value =
    difficulty === "any"
      ? counts.total_question_count
      : counts[
          ("total_" + difficulty + "_question_count") as keyof typeof counts
        ]
  if (typeof value !== "number") {
    throw new TriviaError("api", "COULD NOT CHECK AVAILABILITY")
  }
  return value
}
