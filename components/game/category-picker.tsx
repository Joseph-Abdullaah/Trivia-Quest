"use client"

import {
  ACCENT_SHADOW,
  CATEGORIES,
  TILE_ACCENTS,
  type Category,
} from "@/lib/game/constants"
import { Button } from "@/components/ui/button"
import { ScreenHeader } from "@/components/game/screen-header"

type PickerCategory = Category | { id: "any"; name: string }

const ANY_CATEGORY: PickerCategory = { id: "any", name: "Any Category" }

/** Fill applied to the currently selected tile, per accent. */
const ACCENT_FILL: Record<string, string> = {
  destructive: "bg-destructive",
  grape: "bg-grape",
  primary: "bg-primary",
  teal: "bg-teal",
  bubblegum: "bg-bubblegum",
  cobalt: "bg-cobalt",
}

export function CategoryPicker({
  selectedId,
  onBack,
  onSelect,
}: {
  selectedId: number | "any"
  onBack: () => void
  onSelect: (category: PickerCategory) => void
}) {
  const tiles: PickerCategory[] = [ANY_CATEGORY, ...CATEGORIES]

  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title="SELECT CATEGORY" onBack={onBack} />

      <div className="grid max-h-[60vh] grid-cols-2 gap-2.5 overflow-y-auto p-0.5">
        {tiles.map((category, index) => {
          const accent = TILE_ACCENTS[index % TILE_ACCENTS.length]
          const selected = category.id === selectedId
          return (
            <Button
              key={String(category.id)}
              variant="outline"
              onClick={() => onSelect(category)}
              aria-pressed={selected}
              className={`h-auto rounded-[14px] border-[2.5px] px-2 py-4 text-center font-sans text-[13px] whitespace-normal ${
                ACCENT_SHADOW[accent]
              } ${selected ? `${ACCENT_FILL[accent]} text-on-accent` : "bg-card"}`}
            >
              {category.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
