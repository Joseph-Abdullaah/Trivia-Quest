"use client"

import * as React from "react"

import type { Settings } from "@/hooks/use-trivia-game"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ScreenHeader } from "@/components/game/screen-header"

/**
 * The registry Switch is square by default; the design calls for a pill with a
 * round white knob that turns green when on.
 */
const SWITCH_CLASS = cn(
  // The registry sizes the track through `data-[size=...]` variants, which
  // out-specify plain utilities — hence the important markers here.
  "h-7! w-13! rounded-full! border-[2.5px] bg-muted! p-0.5 data-checked:bg-success!",
  // The knob is positioned with flex, as in the design, so the registry's
  // translate-based travel is zeroed out.
  "justify-start data-checked:justify-end",
  "[&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:rounded-full",
  "[&_[data-slot=switch-thumb]]:border-2 [&_[data-slot=switch-thumb]]:bg-card!",
  "[&_[data-slot=switch-thumb]]:translate-x-0!"
)

/**
 * Destructive actions arm on the first press and fire on the second, with the
 * arming lapsing after a few seconds — no modal, as in the design.
 */
function useArmedAction(onConfirm: () => void) {
  const [armed, setArmed] = React.useState(false)

  React.useEffect(() => {
    if (!armed) return
    const id = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(id)
  }, [armed])

  const trigger = React.useCallback(() => {
    if (armed) {
      setArmed(false)
      onConfirm()
      return
    }
    setArmed(true)
  }, [armed, onConfirm])

  return { armed, trigger }
}

export function SettingsScreen({
  playerName,
  settings,
  onBack,
  onRename,
  onSettingsChange,
  onResetHighScore,
  onResetAll,
}: {
  playerName: string
  settings: Settings
  onBack: () => void
  onRename: (name: string) => void
  onSettingsChange: (patch: Partial<Settings>) => void
  onResetHighScore: () => void
  onResetAll: () => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(playerName)

  const resetScore = useArmedAction(onResetHighScore)
  const resetAll = useArmedAction(onResetAll)

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title="SETTINGS" onBack={onBack} />

      <Card className="rounded-[18px] border-[3px] shadow-lg [--card-spacing:20px]">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="settings-name"
              className="text-[11px] font-bold tracking-widest text-muted-foreground"
            >
              PLAYER NAME
            </Label>
            {editing ? (
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  onRename(draft.trim() || playerName)
                  setEditing(false)
                }}
              >
                <Input
                  id="settings-name"
                  value={draft}
                  maxLength={20}
                  autoComplete="off"
                  onChange={(event) => setDraft(event.target.value)}
                  className="h-auto flex-1 rounded-[10px] border-[2.5px] px-3 py-2.5 text-base font-bold shadow-none"
                />
                <Button
                  type="submit"
                  className="rounded-[10px] border-[2.5px] bg-success text-success-foreground shadow-none hover:bg-success/90"
                >
                  SAVE
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-lg font-bold">{playerName}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setDraft(playerName)
                    setEditing(true)
                  }}
                  className="shrink-0 rounded-[10px] border-[2.5px] bg-cobalt text-on-accent shadow-none hover:bg-cobalt/90"
                >
                  CHANGE
                </Button>
              </div>
            )}
          </div>

          <Separator className="h-0.5 bg-muted" />

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="sound" className="text-sm font-bold">
              SOUND FX
            </Label>
            <Switch
              id="sound"
              checked={settings.sound}
              onCheckedChange={(checked) =>
                onSettingsChange({ sound: checked })
              }
              className={SWITCH_CLASS}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="animations" className="text-sm font-bold">
              ANIMATIONS
            </Label>
            <Switch
              id="animations"
              checked={settings.animations}
              onCheckedChange={(checked) =>
                onSettingsChange({ animations: checked })
              }
              className={SWITCH_CLASS}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-bold tracking-widest text-destructive">
          DANGER ZONE
        </p>
        <Button
          variant="outline"
          onClick={resetScore.trigger}
          className="rounded-xl border-[2.5px] border-destructive py-3 text-destructive shadow-none hover:bg-destructive/10"
        >
          {resetScore.armed ? "TAP AGAIN TO CONFIRM" : "RESET HIGH SCORE"}
        </Button>
        <Button
          variant="destructive"
          onClick={resetAll.trigger}
          className="rounded-xl border-[2.5px] py-3 shadow-md"
        >
          {resetAll.armed ? "TAP AGAIN TO CONFIRM" : "RESET ALL DATA"}
        </Button>
      </div>
    </div>
  )
}
