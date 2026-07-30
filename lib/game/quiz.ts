import type { Question } from "@/lib/opentdb"
import {
  SURVIVAL_LIVES,
  TIME_ATTACK_SECONDS,
  type ModeKey,
} from "@/lib/game/constants"
import { pointsFor } from "@/lib/game/scoring"

export type Feedback = {
  isCorrect: boolean
  points: number
  /** Streak *including* this answer — what the player sees celebrated. */
  comboAtAnswer: number
}

export type QuizState = {
  mode: ModeKey
  questions: Question[]
  index: number
  score: number
  correct: number
  wrong: number
  /** Consecutive correct answers so far. */
  combo: number
  bestCombo: number
  /** Survival only; `null` in every other mode. */
  lives: number | null
  /** Time Attack only; `null` in every other mode. */
  timeLeft: number | null
  fiftyUsed: boolean
  skipUsed: boolean
  /** Letters removed by 50/50 for the current question. */
  hiddenLetters: string[]
  selected: string | null
  isAnswered: boolean
  feedback: Feedback | null
  questionStartedAt: number
  ended: boolean
  /**
   * The high score as it stood when this run began. Snapshotted here so the
   * results screen can report "previous best" from pure state.
   */
  highScoreAtStart: number
}

export type QuizAction =
  | { type: "reset"; quiz: QuizState }
  | { type: "clear" }
  | { type: "answer"; value: string | null; now: number }
  | { type: "tick"; now: number }
  | { type: "next"; now: number }
  | { type: "fifty"; hide: string[] }
  | { type: "skip" }
  | { type: "end" }

export function createQuiz(
  mode: ModeKey,
  questions: Question[],
  now: number,
  highScoreAtStart: number
): QuizState {
  return {
    mode,
    questions,
    index: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    combo: 0,
    bestCombo: 0,
    lives: mode === "survival" ? SURVIVAL_LIVES : null,
    timeLeft: mode === "time" ? TIME_ATTACK_SECONDS : null,
    fiftyUsed: false,
    skipUsed: false,
    hiddenLetters: [],
    selected: null,
    isAnswered: false,
    feedback: null,
    questionStartedAt: now,
    ended: false,
    highScoreAtStart,
  }
}

/** True once the run should stop — out of lives, or out of questions. */
function shouldEnd(state: QuizState): boolean {
  if (state.mode === "survival" && state.lives !== null && state.lives <= 0) {
    return true
  }
  return state.index + 1 >= state.questions.length
}

/**
 * Grade the current question. `value` is `null` when the Time Attack clock ran
 * out — that counts as wrong, same as picking the wrong option.
 */
function grade(state: QuizState, value: string | null, now: number): QuizState {
  const question = state.questions[state.index]
  const isCorrect = value !== null && value === question.correct
  const elapsed = (now - state.questionStartedAt) / 1000
  // The multiplier comes from the streak *entering* this question, while the
  // celebrated number includes it — a 3rd correct answer shows x3 at 1.5x.
  const points = isCorrect
    ? pointsFor(question.difficulty, elapsed, state.combo)
    : 0
  const combo = isCorrect ? state.combo + 1 : 0
  return {
    ...state,
    isAnswered: true,
    selected: value,
    score: state.score + points,
    correct: state.correct + (isCorrect ? 1 : 0),
    wrong: state.wrong + (isCorrect ? 0 : 1),
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    lives:
      state.mode === "survival" && !isCorrect && state.lives !== null
        ? state.lives - 1
        : state.lives,
    feedback: { isCorrect, points, comboAtAnswer: combo },
  }
}

export function quizReducer(
  state: QuizState | null,
  action: QuizAction
): QuizState | null {
  if (action.type === "reset") return action.quiz
  if (action.type === "clear") return null
  if (!state) return state

  switch (action.type) {
    case "answer": {
      if (state.isAnswered || state.ended) return state
      return grade(state, action.value, action.now)
    }

    case "tick": {
      if (state.isAnswered || state.ended || state.timeLeft === null) {
        return state
      }
      const timeLeft = Math.max(0, state.timeLeft - 1)
      // Hitting zero grades the question here rather than in a follow-up
      // effect, so the clock and the verdict land in the same render.
      if (timeLeft === 0) {
        return { ...grade(state, null, action.now), timeLeft: 0 }
      }
      return { ...state, timeLeft }
    }

    case "next": {
      if (state.ended) return state
      if (shouldEnd(state)) return { ...state, ended: true }
      return {
        ...state,
        index: state.index + 1,
        selected: null,
        isAnswered: false,
        feedback: null,
        hiddenLetters: [],
        timeLeft: state.mode === "time" ? TIME_ATTACK_SECONDS : null,
        questionStartedAt: action.now,
      }
    }

    case "fifty": {
      if (state.isAnswered || state.fiftyUsed) return state
      return { ...state, fiftyUsed: true, hiddenLetters: action.hide }
    }

    case "skip": {
      if (state.isAnswered || state.skipUsed) return state
      return { ...state, skipUsed: true }
    }

    case "end":
      return state.ended ? state : { ...state, ended: true }

    default:
      return state
  }
}

/** The two wrong letters 50/50 removes, chosen at random. */
export function pickFiftyFiftyLetters(question: Question): string[] {
  if (question.type !== "multiple" || !question.options) return []
  const wrong = question.options
    .filter((o) => o.text !== question.correct)
    .map((o) => o.letter)
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = wrong[i]
    wrong[i] = wrong[j]
    wrong[j] = tmp
  }
  return wrong.slice(0, 2)
}
