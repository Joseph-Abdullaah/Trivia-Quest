"use client"

import type { QuizState } from "@/lib/game/quiz"
import type { QuizConfig } from "@/hooks/use-trivia-game"
import { DIFFICULTY_LABELS } from "@/lib/game/constants"
import { formatScore } from "@/lib/game/scoring"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-[19px] font-bold">{value}</dd>
    </div>
  )
}

export function ResultsScreen({
  quiz,
  config,
  highScore,
  summary,
  onPlayAgain,
  onNewGame,
  onHome,
}: {
  quiz: QuizState
  config: QuizConfig
  highScore: number
  summary: { prevBest: number; isNewHigh: boolean }
  onPlayAgain: () => void
  onNewGame: () => void
  onHome: () => void
}) {
  const answered = quiz.correct + quiz.wrong
  const accuracy =
    answered > 0 ? Math.round((quiz.correct / answered) * 100) : 0

  // Survival is scored by how deep you got, not by a fixed question count.
  const primary =
    quiz.mode === "survival"
      ? { label: "MADE IT TO", value: `Q ${quiz.index + 1}` }
      : { label: "CORRECT", value: `${quiz.correct} / ${answered}` }

  const actions = [
    {
      label: "▶ PLAY AGAIN",
      onClick: onPlayAgain,
      className: "bg-success text-success-foreground hover:bg-success/90",
    },
    {
      label: "◈ NEW GAME",
      onClick: onNewGame,
      className: "bg-cobalt text-on-accent hover:bg-cobalt/90",
    },
    {
      label: "⌂ HOME",
      onClick: onHome,
      className: "bg-card hover:bg-muted",
    },
  ]

  return (
    <div className="flex flex-col items-center gap-5 pt-5 text-center">
      <h1
        className={cn(
          "font-head text-[28px] font-bold min-[900px]:text-[34px]",
          summary.isNewHigh ? "text-primary" : "text-destructive"
        )}
      >
        {summary.isNewHigh ? "★ NEW RECORD ★" : "GAME OVER"}
      </h1>

      <Card className="w-full rounded-[20px] border-[3px] shadow-xl [--card-spacing:24px]">
        <CardContent className="flex flex-col gap-4">
          <p className="font-head text-[11px] tracking-widest text-muted-foreground">
            SCORE
          </p>
          <p className="font-head text-[38px] font-bold text-primary min-[900px]:text-[46px]">
            {formatScore(quiz.score)}
          </p>

          <Separator className="bg-muted" />

          <dl className="grid grid-cols-3 gap-2">
            <Stat label={primary.label} value={primary.value} />
            <Stat label="ACCURACY" value={`${accuracy}%`} />
            <Stat label="BEST COMBO" value={`x${quiz.bestCombo}`} />
          </dl>

          <Separator className="bg-muted" />

          <p className="text-[13px] text-muted-foreground">
            {summary.isNewHigh
              ? `PREVIOUS BEST: ${formatScore(summary.prevBest)}`
              : `HIGH SCORE STILL UNBEATEN: ${formatScore(highScore)}`}
          </p>
          <p className="text-[11px] text-muted-foreground">
            MODE: {quiz.mode.toUpperCase()} •{" "}
            {config.categoryName.toUpperCase()} •{" "}
            {DIFFICULTY_LABELS[config.difficulty]}
          </p>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="lg"
            onClick={action.onClick}
            className={`rounded-[14px] border-[3px] py-4 shadow-lg ${action.className}`}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
