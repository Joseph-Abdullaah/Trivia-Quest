import Link from "next/link"

import { PLAY_HREF, STEPS } from "@/lib/landing-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const ANSWERS = [
  { label: "A · Ag", correct: false },
  { label: "B · Au ✓", correct: true },
  { label: "C · Fe", correct: false },
  { label: "D · Gd", correct: false },
]

const PREVIEW_STATS = [
  { value: "24", label: "CATEGORIES", accent: "bg-grape" },
  { value: "6", label: "MODES", accent: "bg-teal" },
]

export function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 px-6 py-[90px] lg:grid-cols-2"
    >
      <div>
        <Badge
          variant="secondary"
          className="h-auto rounded-full px-4 py-[7px] font-sans text-[11px] font-bold tracking-widest shadow-none"
        >
          HOW IT WORKS
        </Badge>

        <h2 className="mt-4 font-head text-[clamp(1.75rem,4vw,2.125rem)] font-bold">
          THREE TAPS TO TRIVIA
        </h2>

        <ol className="mt-7 flex flex-col gap-5.5">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-3.5">
              <Separator
                orientation="vertical"
                className={`w-1 rounded-sm ${step.rule}`}
              />
              <div>
                <h3 className="font-head text-base font-bold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href={PLAY_HREF}
          className={cn(buttonVariants(), "mt-7 rounded-xl border-[2.5px]")}
        >
          PLAY NOW →
        </Link>
      </div>

      {/* Illustrative snapshot of a round in progress. */}
      <div aria-hidden>
        <Card className="rounded-[18px] border-[2.5px] p-1.5 shadow-[8px_8px_0_0_var(--primary)]">
          <CardHeader className="flex flex-row items-center justify-between gap-4 font-head text-xs font-bold">
            <Badge className="h-auto rounded-lg px-2.5 py-[5px] shadow-none">
              SCORE 001,850
            </Badge>
            <span>Q 03 / 10</span>
          </CardHeader>

          <CardContent className="space-y-4">
            <Progress
              value={30}
              className="[&_[data-slot=progress-indicator]]:bg-success [&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-track]]:rounded-sm [&_[data-slot=progress-track]]:border-[1.5px] [&_[data-slot=progress-track]]:bg-muted"
            />

            <p className="text-base font-medium">
              What is the chemical symbol for the element gold?
            </p>

            <div className="grid grid-cols-2 gap-2">
              {ANSWERS.map((answer) => (
                <Button
                  key={answer.label}
                  variant="outline"
                  size="sm"
                  tabIndex={-1}
                  className={
                    answer.correct
                      ? "justify-start rounded-[10px] border-success bg-success/15 font-sans text-[13px] shadow-none"
                      : "justify-start rounded-[10px] font-sans text-[13px] shadow-none"
                  }
                >
                  {answer.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-3">
          {PREVIEW_STATS.map((stat) => (
            <Card
              key={stat.label}
              size="sm"
              className={`flex-1 rounded-xl border-[2.5px] text-center text-on-accent shadow-none ${stat.accent}`}
            >
              <CardContent>
                <div className="font-head text-xl font-bold">{stat.value}</div>
                <div className="text-xs font-bold">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
