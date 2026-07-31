"use client"

import * as React from "react"

import {
  fetchCategoryCount,
  fetchQuestions,
  TriviaError,
  type Difficulty,
  type QuestionType,
} from "@/lib/opentdb"
import {
  BLITZ_COUNT,
  CATEGORIES,
  STORAGE_KEYS,
  SURVIVAL_POOL,
  type Category,
  type ModeKey,
} from "@/lib/game/constants"
import {
  createQuiz,
  pickFiftyFiftyLetters,
  quizReducer,
  type QuizState,
} from "@/lib/game/quiz"
import { dailyChallengeConfig, todayKey } from "@/lib/game/scoring"

export type Screen =
  | "setup"
  | "home"
  | "modes"
  | "config"
  | "category"
  | "loading"
  | "question"
  | "results"
  | "settings"

export type QuizConfig = {
  mode: ModeKey
  categoryId: number | "any"
  categoryName: string
  difficulty: Difficulty | "any"
  type: QuestionType | "any"
  count: number
}

export type Availability =
  | { status: "idle" | "checking" | "any" }
  | { status: "ok" | "low"; count: number }
  | { status: "error" }

export type Settings = { sound: boolean; animations: boolean }

const DEFAULT_CONFIG: QuizConfig = {
  mode: "custom",
  categoryId: "any",
  categoryName: "Any Category",
  difficulty: "any",
  type: "any",
  count: 10,
}

/** How long the correct/wrong panel stays up before advancing. */
const FEEDBACK_MS = 1600

export function useTriviaGame() {
  // Everything persisted starts empty so server and first client render match;
  // the real values arrive in the mount effect below.
  const [hydrated, setHydrated] = React.useState(false)
  const [rawScreen, setScreen] = React.useState<Screen>("setup")
  const [, setStack] = React.useState<Screen[]>([])
  const [playerName, setPlayerName] = React.useState("")
  const [highScore, setHighScore] = React.useState(0)

  // Mirror of `highScore` for callbacks that must not re-create themselves.
  const highScoreRef = React.useRef(0)
  React.useEffect(() => {
    highScoreRef.current = highScore
  }, [highScore])
  const [settings, setSettings] = React.useState<Settings>({
    sound: true,
    animations: true,
  })
  const [dailyPlayedDate, setDailyPlayedDate] = React.useState<string | null>(
    null
  )

  const [config, setConfig] = React.useState<QuizConfig>(DEFAULT_CONFIG)
  const [availability, setAvailability] = React.useState<Availability>({
    status: "any",
  })
  const [categoryReturnTo, setCategoryReturnTo] = React.useState<
    "config" | "blitz"
  >("config")

  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)
  const [quiz, dispatch] = React.useReducer(
    quizReducer,
    null as QuizState | null
  )

  // --- persistence ----------------------------------------------------------

  // Reading the saved profile is a one-time sync from an external store that
  // is unavailable during SSR. The `hydrated` gate below means nothing renders
  // from these values until they have landed, so no cascade is possible.
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    try {
      const name = localStorage.getItem(STORAGE_KEYS.name)
      const hs = parseInt(
        localStorage.getItem(STORAGE_KEYS.highScore) || "0",
        10
      )
      const rawSettings = localStorage.getItem(STORAGE_KEYS.settings)
      const daily = localStorage.getItem(STORAGE_KEYS.dailyPlayed)
      if (name) setPlayerName(name)
      if (!Number.isNaN(hs)) setHighScore(hs)
      if (rawSettings) setSettings(JSON.parse(rawSettings) as Settings)
      if (daily) setDailyPlayedDate(daily)
      setScreen(name ? "home" : "setup")
    } catch {
      setScreen("setup")
    }
    setHydrated(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = React.useCallback(
    (patch: {
      name?: string
      highScore?: number
      settings?: Settings
      dailyPlayed?: string
    }) => {
      try {
        if (patch.name !== undefined) {
          localStorage.setItem(STORAGE_KEYS.name, patch.name)
        }
        if (patch.highScore !== undefined) {
          localStorage.setItem(STORAGE_KEYS.highScore, String(patch.highScore))
        }
        if (patch.settings !== undefined) {
          localStorage.setItem(
            STORAGE_KEYS.settings,
            JSON.stringify(patch.settings)
          )
        }
        if (patch.dailyPlayed !== undefined) {
          localStorage.setItem(STORAGE_KEYS.dailyPlayed, patch.dailyPlayed)
        }
      } catch {
        // Storage unavailable — the session still plays, it just won't persist.
      }
    },
    []
  )

  // --- navigation -----------------------------------------------------------

  // Lets `go` read the current screen without re-creating itself each change.
  const screenRef = React.useRef(rawScreen)
  React.useEffect(() => {
    screenRef.current = rawScreen
  }, [rawScreen])

  const go = React.useCallback((next: Screen) => {
    setStack((s) => [...s, screenRef.current])
    setScreen(next)
  }, [])

  const goBack = React.useCallback(() => {
    setStack((s) => {
      const copy = s.slice()
      const prev = copy.pop()
      setScreen(prev ?? "home")
      return copy
    })
  }, [])

  const goHome = React.useCallback(() => {
    setScreen("home")
    setStack([])
  }, [])

  const showToast = React.useCallback((message: string) => {
    setToast(message)
  }, [])

  React.useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(id)
  }, [toast])

  // --- quiz lifecycle -------------------------------------------------------

  /** Guards against a stale in-flight fetch resolving over a newer one. */
  const loadIdRef = React.useRef(0)

  const startQuiz = React.useCallback(async (next: QuizConfig) => {
    const loadId = ++loadIdRef.current
    setConfig(next)
    setLoadError(null)
    setScreen("loading")
    setStack([])
    try {
      const questions = await fetchQuestions({
        amount: next.count,
        categoryId: next.categoryId,
        difficulty: next.difficulty,
        type: next.type,
      })
      if (loadId !== loadIdRef.current) return
      dispatch({
        type: "reset",
        quiz: createQuiz(
          next.mode,
          questions,
          Date.now(),
          highScoreRef.current
        ),
      })
      setScreen("question")
    } catch (error) {
      if (loadId !== loadIdRef.current) return
      setLoadError(
        error instanceof TriviaError
          ? error.message
          : "COULD NOT LOAD QUESTIONS. TRY AGAIN."
      )
    }
  }, [])

  const selectMode = React.useCallback(
    (key: ModeKey) => {
      if (key === "daily" && dailyPlayedDate === todayKey()) {
        showToast("TODAY'S CHALLENGE IS DONE. COME BACK TOMORROW!")
        return
      }
      if (key === "custom") {
        setConfig({ ...DEFAULT_CONFIG, mode: "custom" })
        setAvailability({ status: "any" })
        go("config")
        return
      }
      if (key === "blitz") {
        setCategoryReturnTo("blitz")
        go("category")
        return
      }
      if (key === "quick") {
        void startQuiz({ ...DEFAULT_CONFIG, mode: "quick" })
        return
      }
      if (key === "time") {
        void startQuiz({ ...DEFAULT_CONFIG, mode: "time" })
        return
      }
      if (key === "survival") {
        void startQuiz({
          ...DEFAULT_CONFIG,
          mode: "survival",
          count: SURVIVAL_POOL,
        })
        return
      }
      const { category, difficulty } = dailyChallengeConfig()
      void startQuiz({
        mode: "daily",
        categoryId: category.id,
        categoryName: category.name,
        difficulty,
        type: "multiple",
        count: 10,
      })
    },
    [dailyPlayedDate, go, showToast, startQuiz]
  )

  const selectCategory = React.useCallback(
    (category: Category | { id: "any"; name: string }) => {
      if (categoryReturnTo === "blitz") {
        void startQuiz({
          mode: "blitz",
          categoryId: category.id,
          categoryName: category.name,
          difficulty: "any",
          type: "any",
          count: BLITZ_COUNT,
        })
        return
      }
      setConfig((c) => ({
        ...c,
        categoryId: category.id,
        categoryName: category.name,
      }))
      goBack()
    },
    [categoryReturnTo, goBack, startQuiz]
  )

  const openCategoryPicker = React.useCallback(() => {
    setCategoryReturnTo("config")
    go("category")
  }, [go])

  // --- availability ---------------------------------------------------------

  // Debounced so rattling through difficulty chips doesn't queue up requests
  // behind the API's 5-second gate. Every state write happens in the timeout
  // or the promise callbacks, never in the effect body.
  React.useEffect(() => {
    if (rawScreen !== "config" || config.categoryId === "any") return
    let cancelled = false
    const id = setTimeout(() => {
      if (cancelled) return
      setAvailability({ status: "checking" })
      fetchCategoryCount(config.categoryId as number, config.difficulty)
        .then((count) => {
          if (cancelled) return
          setAvailability({
            status: count >= config.count ? "ok" : "low",
            count,
          })
        })
        .catch(() => {
          if (!cancelled) setAvailability({ status: "error" })
        })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [rawScreen, config.categoryId, config.difficulty, config.count])

  // "Any category" always has questions, so it's derived rather than fetched.
  const effectiveAvailability: Availability =
    config.categoryId === "any" ? { status: "any" } : availability

  // --- timers ---------------------------------------------------------------

  // Pulled out as primitives so the effects below key off what actually
  // matters. Depending on the whole `quiz` object would tear down and rebuild
  // the countdown interval on every tick.
  const quizMode = quiz?.mode
  const quizIndex = quiz?.index
  const quizAnswered = quiz?.isAnswered ?? false
  const quizEnded = quiz?.ended ?? false

  // Time Attack countdown. Restarts when the question changes, not per tick.
  // Reaching zero is graded inside the reducer, so there is no follow-up here.
  React.useEffect(() => {
    if (quizMode !== "time" || quizAnswered || quizEnded) return
    const id = setInterval(
      () => dispatch({ type: "tick", now: Date.now() }),
      1000
    )
    return () => clearInterval(id)
  }, [quizMode, quizIndex, quizAnswered, quizEnded])

  // Hold the feedback panel, then move on.
  React.useEffect(() => {
    if (!quizAnswered || quizEnded) return
    const id = setTimeout(
      () => dispatch({ type: "next", now: Date.now() }),
      FEEDBACK_MS
    )
    return () => clearTimeout(id)
  }, [quizAnswered, quizIndex, quizEnded])

  // --- results --------------------------------------------------------------

  // Both of these are derived rather than stored: a finished run *is* the
  // results screen, and its score already counts towards the displayed best.
  // That keeps every state write in an event handler instead of an effect.
  const screen: Screen = quizEnded ? "results" : rawScreen
  const runSummary = quiz?.ended
    ? {
        prevBest: quiz.highScoreAtStart,
        isNewHigh: quiz.score > quiz.highScoreAtStart,
      }
    : null
  const bestScore = Math.max(highScore, quiz?.ended ? quiz.score : 0)
  const dailyLocked =
    dailyPlayedDate === todayKey() ||
    (quiz?.ended === true && quiz.mode === "daily")

  // Writing the run's outcome to storage is a genuine external-system sync;
  // React state catches up when the player leaves the results screen.
  React.useEffect(() => {
    if (!quiz?.ended) return
    if (quiz.score > quiz.highScoreAtStart) {
      persist({ highScore: quiz.score })
    }
    if (quiz.mode === "daily") {
      persist({ dailyPlayed: todayKey() })
    }
  }, [quiz?.ended, quiz?.score, quiz?.mode, quiz, persist])

  /** Fold a finished run's results back into the persisted profile. */
  const commitRun = React.useCallback(() => {
    setHighScore((current) => Math.max(current, quiz?.ended ? quiz.score : 0))
    if (quiz?.ended && quiz.mode === "daily") setDailyPlayedDate(todayKey())
  }, [quiz])

  // --- actions --------------------------------------------------------------

  const answer = React.useCallback((value: string | null) => {
    dispatch({ type: "answer", value, now: Date.now() })
  }, [])

  const activateFiftyFifty = React.useCallback(() => {
    if (!quiz || quiz.isAnswered || quiz.fiftyUsed) return
    const question = quiz.questions[quiz.index]
    if (question.type !== "multiple") return
    dispatch({ type: "fifty", hide: pickFiftyFiftyLetters(question) })
  }, [quiz])

  const skipQuestion = React.useCallback(() => {
    if (!quiz || quiz.isAnswered || quiz.skipUsed) return
    dispatch({ type: "skip" })
    dispatch({ type: "next", now: Date.now() })
  }, [quiz])

  const continueNow = React.useCallback(() => {
    if (!quiz || !quiz.isAnswered) return
    dispatch({ type: "next", now: Date.now() })
  }, [quiz])

  const quitToHome = React.useCallback(() => {
    loadIdRef.current++
    commitRun()
    dispatch({ type: "clear" })
    goHome()
  }, [commitRun, goHome])

  const playAgain = React.useCallback(() => {
    commitRun()
    void startQuiz(config)
  }, [commitRun, config, startQuiz])

  const newGame = React.useCallback(() => {
    commitRun()
    dispatch({ type: "clear" })
    setScreen("modes")
    setStack(["home"])
  }, [commitRun])

  const confirmName = React.useCallback(
    (raw: string) => {
      const name = raw.trim() || "PLAYER 1"
      setPlayerName(name)
      persist({ name })
      setScreen("home")
      setStack([])
    },
    [persist]
  )

  /** Rename from Settings — unlike the setup screen, this stays put. */
  const renamePlayer = React.useCallback(
    (raw: string) => {
      const name = raw.trim()
      if (!name) return
      setPlayerName(name)
      persist({ name })
    },
    [persist]
  )

  const updateSettings = React.useCallback(
    (patch: Partial<Settings>) => {
      setSettings((s) => {
        const next = { ...s, ...patch }
        persist({ settings: next })
        return next
      })
    },
    [persist]
  )

  const resetHighScore = React.useCallback(() => {
    setHighScore(0)
    persist({ highScore: 0 })
  }, [persist])

  const resetAllData = React.useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.name)
      localStorage.removeItem(STORAGE_KEYS.highScore)
      localStorage.removeItem(STORAGE_KEYS.dailyPlayed)
      localStorage.removeItem(STORAGE_KEYS.settings)
    } catch {
      // ignored
    }
    setPlayerName("")
    setHighScore(0)
    setDailyPlayedDate(null)
    dispatch({ type: "clear" })
    setScreen("setup")
    setStack([])
  }, [])

  const retryLoad = React.useCallback(() => {
    void startQuiz(config)
  }, [config, startQuiz])

  return {
    hydrated,
    screen,
    playerName,
    highScore: bestScore,
    settings,
    dailyLocked,
    config,
    setConfig,
    availability: effectiveAvailability,
    categories: CATEGORIES,
    quiz,
    runSummary,
    loadError,
    toast,
    // actions
    goBack,
    goHome,
    go,
    selectMode,
    selectCategory,
    openCategoryPicker,
    startQuiz,
    retryLoad,
    answer,
    activateFiftyFifty,
    skipQuestion,
    continueNow,
    quitToHome,
    playAgain,
    newGame,
    confirmName,
    renamePlayer,
    updateSettings,
    resetHighScore,
    resetAllData,
  }
}
