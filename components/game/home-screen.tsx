"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatScore } from "@/lib/game/scoring"

export function HomeScreen({
  playerName,
  highScore,
  onQuickPlay,
  onModes,
  onSettings,
}: {
  playerName: string
  highScore: number
  onQuickPlay: () => void
  onModes: () => void
  onSettings: () => void
}) {
  const items = [
    {
      label: "QUICK PLAY",
      glyph: "▶",
      onClick: onQuickPlay,
      className:
        "bg-success text-success-foreground hover:bg-success/90 animate-[tq-pulse_2s_ease-in-out_infinite]",
    },
    {
      label: "GAME MODES",
      glyph: "◈",
      onClick: onModes,
      className: "bg-card hover:bg-muted",
    },
    {
      label: "SETTINGS",
      glyph: "⚙",
      onClick: onSettings,
      className: "bg-card hover:bg-muted",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 font-head text-xs font-bold">
        <Badge
          variant="outline"
          className="h-auto max-w-[45%] truncate rounded-[10px] bg-card px-3 py-1.5 shadow"
        >
          {playerName}
        </Badge>
        <Badge className="h-auto rounded-[10px] px-3 py-1.5 shadow">
          HIGH SCORE {formatScore(highScore)}
        </Badge>
      </div>

      <div className="px-0 pt-6 pb-1.5 text-center">
        <h1 className="inline-block animate-[tq-pulse_2.4s_ease-in-out_infinite] font-head text-[38px] leading-none font-bold tracking-[-1px] min-[900px]:text-[46px]">
          TRIVIA
          <br />
          QUEST
        </h1>
      </div>

      <div className="flex flex-col gap-3.5">
        {items.map((item) => (
          <Button
            key={item.label}
            variant="outline"
            onClick={item.onClick}
            className={`justify-start rounded-[14px] border-[3px] px-[18px] py-4 text-sm shadow-lg min-[900px]:text-base ${item.className}`}
          >
            <span aria-hidden className="mr-3 text-xl">
              {item.glyph}
            </span>
            {item.label}
          </Button>
        ))}
      </div>

      <p className="animate-[tq-blink_1.6s_ease-in-out_infinite] pt-2 text-center font-head text-[10px] tracking-widest text-muted-foreground">
        INSERT COIN TO CONTINUE
      </p>
    </div>
  )
}
