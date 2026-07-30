"use client"

import { XIcon } from "lucide-react"

import type { QuizState } from "@/lib/game/quiz"
import { formatScore } from "@/lib/game/scoring"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

/** Colour of the Time Attack countdown as it runs down. */
function timerTone(seconds: number) {
  if (seconds <= 5) return "text-destructive"
  if (seconds <= 10) return "text-primary"
  return "text-success"
}

function hudCenter(quiz: QuizState) {
  if (quiz.mode === "time") {
    const seconds = quiz.timeLeft ?? 0
    return { text: `${seconds}s`, tone: timerTone(seconds) }
  }
  if (quiz.mode === "survival") {
    return { text: `Q ${quiz.index + 1}`, tone: "text-foreground" }
  }
  return {
    text: `Q ${quiz.index + 1} / ${quiz.questions.length}`,
    tone: "text-foreground",
  }
}

/** Border/fill for an answer once the question has been graded. */
function answerState(
  isAnswered: boolean,
  isCorrectAnswer: boolean,
  isSelected: boolean
) {
  if (!isAnswered) return { className: "bg-card border-border", mark: "" }
  if (isCorrectAnswer) {
    return { className: "border-success bg-success/15", mark: "✓" }
  }
  if (isSelected) {
    return { className: "border-destructive bg-destructive/15", mark: "✗" }
  }
  return { className: "bg-card border-border opacity-60", mark: "" }
}

function FeedbackPanel({
  quiz,
  onContinue,
}: {
  quiz: QuizState
  onContinue: () => void
}) {
  const feedback = quiz.feedback
  if (!feedback) return null
  const question = quiz.questions[quiz.index]
  const { isCorrect } = feedback

  return (
    // Click-anywhere-to-continue, matching the design. It's a live region
    // rather than a dialog because it auto-dismisses and traps nothing.
    <div
      role="status"
      aria-live="assertive"
      onClick={onContinue}
      className="absolute -inset-3.5 z-20 flex items-center justify-center rounded-[20px] bg-foreground/55 p-4"
    >
      <Card
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "w-full max-w-[340px] rounded-[20px] border-[3px] text-center shadow-xl [--card-spacing:24px]",
          isCorrect
            ? "animate-[tq-pop_0.25s_ease] border-success"
            : "animate-[tq-shake_0.3s_ease] border-destructive"
        )}
      >
        <CardContent className="flex flex-col items-center">
          <span aria-hidden className="text-[44px] leading-none">
            {isCorrect ? "✓" : "✗"}
          </span>
          <p
            className={cn(
              "mt-2.5 font-head text-xl font-bold",
              isCorrect ? "text-success" : "text-destructive"
            )}
          >
            {isCorrect ? "CORRECT!" : "WRONG!"}
          </p>
          <p className="mt-2.5 text-2xl font-bold text-primary">
            +{feedback.points} PTS
          </p>
          {isCorrect && feedback.comboAtAnswer >= 2 ? (
            <p className="mt-1.5 font-head text-[11px] font-bold text-primary">
              COMBO x{feedback.comboAtAnswer}!
            </p>
          ) : null}
          {!isCorrect ? (
            <>
              <p className="mt-2.5 text-sm text-muted-foreground">
                CORRECT ANSWER
              </p>
              <p className="mt-0.5 text-[17px] font-bold text-success">
                {question.correct}
              </p>
            </>
          ) : null}
          <p className="mt-4 font-head text-xs text-muted-foreground">
            TOTAL {formatScore(quiz.score)}
          </p>
          <p className="mt-3.5 animate-[tq-blink_1.2s_ease-in-out_infinite] text-[11px] text-muted-foreground">
            TAP TO CONTINUE
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function QuestionScreen({
  quiz,
  onAnswer,
  onFiftyFifty,
  onSkip,
  onContinue,
  onQuit,
}: {
  quiz: QuizState
  onAnswer: (value: string) => void
  onFiftyFifty: () => void
  onSkip: () => void
  onContinue: () => void
  onQuit: () => void
}) {
  const question = quiz.questions[quiz.index]
  const center = hudCenter(quiz)
  const progress = Math.round((quiz.index / quiz.questions.length) * 100)
  const isMultiple = question.type === "multiple"

  const visibleOptions = (question.options ?? []).filter(
    (option) => !quiz.hiddenLetters.includes(option.letter)
  )

  const fiftyDisabled = !isMultiple || quiz.fiftyUsed || quiz.isAnswered
  const skipDisabled = quiz.skipUsed || quiz.isAnswered

  return (
    <div className="relative flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3 font-head text-xs font-bold">
        <Badge className="h-auto rounded-[10px] px-2.5 py-1.5 shadow">
          {formatScore(quiz.score)}
        </Badge>
        <span className={center.tone} aria-live="polite">
          {center.text}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onQuit}
          aria-label="Quit quiz"
          className="size-[34px] shrink-0 rounded-[9px] border-[2.5px] bg-card shadow-sm"
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>

      <Progress
        value={progress}
        aria-label="Quiz progress"
        className="[&_[data-slot=progress-indicator]]:bg-success [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:rounded-md [&_[data-slot=progress-track]]:bg-muted"
      />

      {quiz.mode === "survival" && quiz.lives !== null ? (
        <p
          className="flex gap-1.5 text-xl"
          aria-label={`${quiz.lives} lives left`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className={i < quiz.lives! ? "opacity-100" : "opacity-20"}
            >
              ♥
            </span>
          ))}
        </p>
      ) : null}

      <Card className="rounded-[18px] border-[3px] shadow-lg [--card-spacing:20px]">
        <CardHeader className="flex flex-row items-center justify-between gap-3 font-head text-[11px] font-bold tracking-wide">
          <span className="truncate text-grape">
            {question.category.toUpperCase()}
          </span>
          <Badge
            variant="outline"
            className="h-auto shrink-0 rounded-lg bg-bubblegum/25 px-2 py-0.5 font-sans text-[11px] shadow-none"
          >
            {question.difficulty.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent>
          <h2 className="text-[22px] leading-snug font-medium min-[900px]:text-[26px]">
            {question.question}
          </h2>
        </CardContent>
      </Card>

      {isMultiple ? (
        <div className="grid grid-cols-2 gap-2.5">
          {visibleOptions.map((option) => {
            const state = answerState(
              quiz.isAnswered,
              option.text === question.correct,
              quiz.selected === option.text
            )
            return (
              <Button
                key={option.letter}
                variant="outline"
                disabled={quiz.isAnswered}
                onClick={() => onAnswer(option.text)}
                className={cn(
                  "h-auto min-h-[70px] flex-col items-start justify-start gap-1 rounded-[14px] border-[2.5px] p-3.5 text-left whitespace-normal shadow-none disabled:opacity-100",
                  state.className
                )}
              >
                <span className="font-head text-[11px] font-bold opacity-60">
                  {option.letter} {state.mark}
                </span>
                <span className="text-base font-medium">{option.text}</span>
              </Button>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "TRUE", glyph: "✓", value: "True" },
            { label: "FALSE", glyph: "✗", value: "False" },
          ].map((option) => {
            const state = answerState(
              quiz.isAnswered,
              option.value === question.correct,
              quiz.selected === option.value
            )
            return (
              <Button
                key={option.value}
                variant="outline"
                disabled={quiz.isAnswered}
                onClick={() => onAnswer(option.value)}
                className={cn(
                  "h-auto flex-col gap-1.5 rounded-[14px] border-[2.5px] px-2.5 py-6 shadow-none disabled:opacity-100",
                  state.className
                )}
              >
                <span aria-hidden className="text-[28px] leading-none">
                  {option.glyph}
                </span>
                <span className="font-head text-base font-bold">
                  {option.label} {state.mark}
                </span>
              </Button>
            )
          })}
        </div>
      )}

      {quiz.combo >= 2 && !quiz.isAnswered ? (
        <p className="animate-[tq-pop_0.3s_ease] text-center font-head text-[13px] font-bold text-primary">
          COMBO x{quiz.combo}!
        </p>
      ) : null}

      <div className="flex justify-between gap-2.5">
        <Button
          variant="outline"
          disabled={fiftyDisabled}
          onClick={onFiftyFifty}
          className="flex-1 rounded-xl border-[2.5px] bg-primary text-primary-foreground shadow hover:bg-primary-hover disabled:bg-muted disabled:opacity-40"
        >
          50 / 50
        </Button>
        <Button
          variant="outline"
          disabled={skipDisabled}
          onClick={onSkip}
          className="flex-1 rounded-xl border-[2.5px] bg-cobalt text-on-accent shadow hover:bg-cobalt/90 disabled:bg-muted disabled:opacity-40"
        >
          SKIP →
        </Button>
      </div>

      {quiz.feedback ? (
        <FeedbackPanel quiz={quiz} onContinue={onContinue} />
      ) : null}
    </div>
  )
}
