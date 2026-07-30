"use client"

import { ACCENT_SHADOW, MODES, type ModeKey } from "@/lib/game/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScreenHeader } from "@/components/game/screen-header"

export function ModeSelect({
  dailyLocked,
  onBack,
  onSelect,
}: {
  dailyLocked: boolean
  onBack: () => void
  onSelect: (mode: ModeKey) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title="GAME MODES" onBack={onBack} />

      <div className="grid grid-cols-2 gap-3.5">
        {MODES.map((mode) => {
          const locked = mode.key === "daily" && dailyLocked
          return (
            <Button
              key={mode.key}
              variant="outline"
              onClick={() => onSelect(mode.key)}
              aria-disabled={locked}
              className={`h-auto min-h-[132px] flex-col items-start justify-start gap-0 rounded-2xl border-[2.5px] bg-card p-4 text-left whitespace-normal ${
                ACCENT_SHADOW[mode.accent]
              } ${locked ? "opacity-60" : ""}`}
            >
              <span aria-hidden className="text-[26px] leading-none">
                {mode.glyph}
              </span>
              <span className="mt-2 font-head text-[12.5px] font-bold tracking-wide">
                {mode.label}
              </span>
              <span className="mt-1 text-[13px] leading-snug font-normal text-muted-foreground">
                {mode.desc}
              </span>
              {locked ? (
                <Badge
                  variant="ghost"
                  className="mt-2 h-auto px-0 text-[11px] text-destructive"
                >
                  DONE FOR TODAY
                </Badge>
              ) : null}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
