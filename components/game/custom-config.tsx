"use client"

import { ChevronDownIcon } from "lucide-react"

import type { Difficulty, QuestionType } from "@/lib/opentdb"
import {
  COUNT_OPTIONS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  QUESTION_TYPES,
  TYPE_LABELS,
} from "@/lib/game/constants"
import type { Availability, QuizConfig } from "@/hooks/use-trivia-game"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScreenHeader } from "@/components/game/screen-header"

/** Chip styling shared by the three option rows; `activeClass` sets the fill. */
function chipClass(activeClass: string) {
  return cn(
    "h-auto rounded-xl border-[2.5px] border-border bg-card px-4 py-2.5 font-sans text-[13px] font-bold opacity-70 shadow transition-all",
    "hover:bg-card hover:opacity-100",
    "aria-pressed:opacity-100 data-[pressed]:opacity-100",
    activeClass
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-head text-[11px] font-bold tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

const AVAILABILITY_TONE: Record<string, string> = {
  any: "text-success",
  ok: "text-success",
  checking: "text-muted-foreground",
  low: "text-destructive",
  error: "text-destructive",
}

function availabilityMessage(availability: Availability): string {
  switch (availability.status) {
    case "any":
      return "ANY CATEGORY — QUESTIONS AVAILABLE"
    case "checking":
      return "CHECKING AVAILABILITY..."
    case "ok":
      return `${availability.count} QUESTIONS AVAILABLE`
    case "low":
      return `ONLY ${availability.count} AVAILABLE — LOWER YOUR COUNT`
    case "error":
      return "COULD NOT CHECK AVAILABILITY"
    default:
      return ""
  }
}

export function CustomConfig({
  config,
  availability,
  onBack,
  onChange,
  onPickCategory,
  onStart,
}: {
  config: QuizConfig
  availability: Availability
  onBack: () => void
  onChange: (patch: Partial<QuizConfig>) => void
  onPickCategory: () => void
  onStart: () => void
}) {
  const blocked = availability.status === "low"

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader
        title="CUSTOM QUIZ"
        onBack={onBack}
        titleClassName="text-grape"
      />

      <Card className="rounded-[18px] border-[3px] shadow-lg [--card-spacing:20px]">
        <CardContent className="flex flex-col gap-5">
          <Field label="CATEGORY">
            <Button
              variant="outline"
              onClick={onPickCategory}
              className="h-auto justify-between rounded-xl border-[2.5px] bg-accent/40 px-3.5 py-3 font-sans text-base shadow-none"
            >
              <span className="truncate">{config.categoryName}</span>
              <ChevronDownIcon className="size-4 shrink-0" />
            </Button>
          </Field>

          <Field label="DIFFICULTY">
            <ToggleGroup
              className="w-full flex-wrap"
              value={[config.difficulty]}
              onValueChange={(value) => {
                const next = value[0] as Difficulty | "any" | undefined
                if (next) onChange({ difficulty: next })
              }}
            >
              {DIFFICULTIES.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  className={chipClass(
                    "data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
                  )}
                >
                  {DIFFICULTY_LABELS[option]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <Field label="TYPE">
            <ToggleGroup
              className="w-full flex-wrap"
              value={[config.type]}
              onValueChange={(value) => {
                const next = value[0] as QuestionType | "any" | undefined
                if (next) onChange({ type: next })
              }}
            >
              {QUESTION_TYPES.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  className={chipClass(
                    "data-[pressed]:bg-cobalt data-[pressed]:text-on-accent"
                  )}
                >
                  {TYPE_LABELS[option]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <Field label="QUESTIONS">
            <ToggleGroup
              className="w-full flex-wrap"
              value={[String(config.count)]}
              onValueChange={(value) => {
                const next = value[0]
                if (next) onChange({ count: Number(next) })
              }}
            >
              {COUNT_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={String(option)}
                  className={chipClass(
                    "data-[pressed]:bg-grape data-[pressed]:text-on-accent"
                  )}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <p
            aria-live="polite"
            className={cn(
              "rounded-xl border-[2.5px] border-dashed border-border px-3.5 py-3 text-sm font-bold",
              AVAILABILITY_TONE[availability.status]
            )}
          >
            {availabilityMessage(availability)}
          </p>
        </CardContent>
      </Card>

      <Button
        size="lg"
        disabled={blocked}
        onClick={onStart}
        className="w-full rounded-[14px] border-[3px] bg-success py-4 text-success-foreground shadow-lg hover:bg-success/90"
      >
        ▶ START QUIZ
      </Button>
    </div>
  )
}
