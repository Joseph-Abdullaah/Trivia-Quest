"use client"

import { TriangleAlertIcon } from "lucide-react"

import { DIFFICULTY_LABELS } from "@/lib/game/constants"
import type { QuizConfig } from "@/hooks/use-trivia-game"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function LoadingScreen({
  config,
  error,
  onRetry,
  onHome,
}: {
  config: QuizConfig
  error: string | null
  onRetry: () => void
  onHome: () => void
}) {
  const summary = `${config.categoryName} • ${
    DIFFICULTY_LABELS[config.difficulty]
  } • ${config.count} QUESTIONS`

  if (error) {
    return (
      <div
        role="alert"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center"
      >
        <TriangleAlertIcon className="size-10 text-destructive" />
        <p className="font-head text-lg font-bold text-destructive">{error}</p>
        <Button
          onClick={onRetry}
          className="rounded-[14px] border-[3px] shadow-lg"
        >
          RETRY
        </Button>
        <Button variant="link" size="sm" onClick={onHome}>
          back to home
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <Spinner className="size-14 text-grape" />
      <p className="font-head text-[15px] font-bold" aria-live="polite">
        ACCESSING TRIVIA DATABASE...
      </p>
      <p className="text-sm text-muted-foreground">{summary}</p>
    </div>
  )
}
