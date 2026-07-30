"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NameSetup({
  initialName,
  onConfirm,
}: {
  initialName: string
  onConfirm: (name: string) => void
}) {
  const [name, setName] = React.useState(initialName)

  return (
    <form
      className="flex flex-col items-center gap-7 pt-15"
      onSubmit={(event) => {
        event.preventDefault()
        onConfirm(name)
      }}
    >
      <h1 className="text-center font-head text-[34px] font-bold tracking-tight min-[900px]:text-[41px]">
        TRIVIA QUEST
      </h1>

      <Card className="w-full rounded-[20px] border-[3px] shadow-xl [--card-spacing:26px]">
        <CardContent className="flex flex-col gap-4">
          <Label
            htmlFor="player-name"
            className="font-head text-[13px] font-bold tracking-widest text-grape"
          >
            WHO&apos;S PLAYING?
          </Label>
          <Input
            id="player-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Player 1"
            maxLength={20}
            autoComplete="off"
            className="h-auto rounded-none border-0 border-b-[3px] bg-transparent px-1 py-2 font-head text-[22px] font-bold shadow-none"
          />
          <Button
            type="submit"
            size="lg"
            className="rounded-[14px] border-[3px] bg-success text-success-foreground shadow-lg hover:bg-success/90"
          >
            ENTER THE ARENA →
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
