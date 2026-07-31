import Link from "next/link"

import { PLAY_HREF } from "@/lib/landing-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

const STATS = [
  { value: "24", label: "CATEGORIES" },
  { value: "6", label: "GAME MODES" },
  { value: "∞", label: "QUESTIONS" },
]

export function Hero() {
  return (
    <section className="relative mx-auto max-w-[1160px] px-6 pt-20 pb-15 text-center">
      {/* Drifting confetti. Purely decorative, hidden from assistive tech. */}
      <div aria-hidden className="pointer-events-none hidden md:block">
        <div className="absolute top-10 left-[2%] size-[46px] animate-[tq-float_5s_ease-in-out_infinite] rounded-xl border-[2.5px] border-border bg-teal [--tq-rotate:18deg]" />
        <div className="absolute top-40 right-[4%] size-10 animate-[tq-float_4.5s_ease-in-out_0.5s_infinite] rounded-full border-[2.5px] border-border bg-grape" />
        <div className="absolute bottom-2.5 left-[10%] animate-[tq-float_6s_ease-in-out_1s_infinite] text-[34px] text-primary [-webkit-text-stroke:2px_var(--border)]">
          ★
        </div>
      </div>

      <Badge
        variant="outline"
        className="mb-7 h-auto rounded-full bg-card px-[18px] py-2 font-sans text-xs font-bold tracking-wide shadow"
      >
        ★ 100% FREE — NO SIGN-UP REQUIRED
      </Badge>

      <h1 className="font-head text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.08] font-bold tracking-[-1px]">
        TRIVIA NIGHT.
        <br />
        ANY TIME. ANY TOPIC.
      </h1>

      <p className="mx-auto mt-6 max-w-[520px] text-lg leading-relaxed text-muted-foreground">
        Six game modes, 24 categories, and an unlimited question bank. No ads,
        no accounts, no leaderboards to feel bad about — just you chasing your
        own high score.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3.5">
        <Link
          href={PLAY_HREF}
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-[14px] border-[3px] bg-success text-success-foreground shadow-lg hover:bg-success/90"
          )}
        >
          ▶ PLAY NOW
        </Link>
        <Link
          href="#modes"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-[14px] border-[3px] bg-card shadow-lg"
          )}
        >
          SEE GAME MODES
        </Link>
      </div>

      <dl className="mt-14 flex flex-wrap justify-center gap-10">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dd className="font-head text-3xl font-bold">{stat.value}</dd>
            <dt className="text-[13px] font-bold text-muted-foreground">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
