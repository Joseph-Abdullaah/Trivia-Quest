"use client"

import * as React from "react"

import { useTriviaGame } from "@/hooks/use-trivia-game"
import { Spinner } from "@/components/ui/spinner"
import { CategoryPicker } from "@/components/game/category-picker"
import { CustomConfig } from "@/components/game/custom-config"
import { HomeScreen } from "@/components/game/home-screen"
import { LoadingScreen } from "@/components/game/loading-screen"
import { ModeSelect } from "@/components/game/mode-select"
import { NameSetup } from "@/components/game/name-setup"
import { QuestionScreen } from "@/components/game/question-screen"
import { ResultsScreen } from "@/components/game/results-screen"
import { SettingsScreen } from "@/components/game/settings-screen"

/** Typing a name shouldn't trigger the arcade shortcuts. */
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  )
}

export function GameShell() {
  const game = useTriviaGame()
  const {
    hydrated,
    screen,
    quiz,
    config,
    answer,
    activateFiftyFifty,
    skipQuestion,
    continueNow,
    selectMode,
    go,
    goHome,
    playAgain,
    newGame,
  } = game

  // Keyboard shortcuts, per screen.
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      const key = event.key.toLowerCase()

      if (screen === "home") {
        if (key === "1") selectMode("quick")
        if (key === "2") go("modes")
        if (key === "3") go("settings")
        return
      }

      if (screen === "question" && quiz) {
        if (quiz.feedback) {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            continueNow()
          }
          return
        }
        const question = quiz.questions[quiz.index]
        if (question.type === "boolean") {
          if (key === "t" || key === "1") answer("True")
          if (key === "f" || key === "2") answer("False")
        } else {
          const letter = {
            a: "A",
            b: "B",
            c: "C",
            d: "D",
            1: "A",
            2: "B",
            3: "C",
            4: "D",
          }[key]
          if (letter && !quiz.hiddenLetters.includes(letter)) {
            const option = question.options?.find((o) => o.letter === letter)
            if (option) answer(option.text)
          }
        }
        if (key === "l") activateFiftyFifty()
        if (key === "s") skipQuestion()
        return
      }

      if (screen === "results") {
        if (key === "r") playAgain()
        if (key === "n") newGame()
        if (key === "h") goHome()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    screen,
    quiz,
    answer,
    continueNow,
    go,
    goHome,
    newGame,
    playAgain,
    selectMode,
    activateFiftyFifty,
    skipQuestion,
  ])

  // Nothing persisted is readable on the server, so hold the first paint
  // rather than flashing the name prompt at a returning player.
  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-10 text-grape" />
      </div>
    )
  }

  return (
    <div
      data-animations={game.settings.animations ? "on" : "off"}
      className="flex min-h-svh w-full justify-center px-4 py-7"
    >
      <div className="relative flex w-full max-w-[460px] flex-col min-[900px]:max-w-[560px]">
        {screen === "setup" ? (
          <NameSetup
            initialName={game.playerName}
            onConfirm={game.confirmName}
          />
        ) : null}

        {screen === "home" ? (
          <HomeScreen
            playerName={game.playerName}
            highScore={game.highScore}
            onQuickPlay={() => selectMode("quick")}
            onModes={() => go("modes")}
            onSettings={() => go("settings")}
          />
        ) : null}

        {screen === "modes" ? (
          <ModeSelect
            dailyLocked={game.dailyLocked}
            onBack={game.goBack}
            onSelect={selectMode}
          />
        ) : null}

        {screen === "config" ? (
          <CustomConfig
            config={config}
            availability={game.availability}
            onBack={game.goBack}
            onChange={(patch) =>
              game.setConfig((current) => ({ ...current, ...patch }))
            }
            onPickCategory={game.openCategoryPicker}
            onStart={() => void game.startQuiz(config)}
          />
        ) : null}

        {screen === "category" ? (
          <CategoryPicker
            selectedId={config.categoryId}
            onBack={game.goBack}
            onSelect={game.selectCategory}
          />
        ) : null}

        {screen === "loading" ? (
          <LoadingScreen
            config={config}
            error={game.loadError}
            onRetry={game.retryLoad}
            onHome={goHome}
          />
        ) : null}

        {screen === "question" && quiz ? (
          <QuestionScreen
            quiz={quiz}
            onAnswer={answer}
            onFiftyFifty={activateFiftyFifty}
            onSkip={skipQuestion}
            onContinue={continueNow}
            onQuit={game.quitToHome}
          />
        ) : null}

        {screen === "results" && quiz && game.runSummary ? (
          <ResultsScreen
            quiz={quiz}
            config={config}
            highScore={game.highScore}
            summary={game.runSummary}
            onPlayAgain={playAgain}
            onNewGame={newGame}
            onHome={game.quitToHome}
          />
        ) : null}

        {screen === "settings" ? (
          <SettingsScreen
            playerName={game.playerName}
            settings={game.settings}
            onBack={game.goBack}
            onRename={game.renamePlayer}
            onSettingsChange={game.updateSettings}
            onResetHighScore={game.resetHighScore}
            onResetAll={game.resetAllData}
          />
        ) : null}

        {game.toast ? (
          <div
            role="status"
            className="fixed bottom-7 left-1/2 z-50 max-w-[88vw] -translate-x-1/2 rounded-[14px] border-2 border-border bg-secondary px-5 py-3.5 text-center text-sm font-bold text-secondary-foreground shadow-lg"
          >
            {game.toast}
          </div>
        ) : null}
      </div>
    </div>
  )
}
