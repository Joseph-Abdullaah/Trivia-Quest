import type { Metadata } from "next"

import { GameShell } from "@/components/game/game-shell"

export const metadata: Metadata = {
  title: "Play — Trivia Quest",
  description:
    "Six game modes, 24 categories, and an unlimited question bank from the Open Trivia Database.",
}

export default function PlayPage() {
  return <GameShell />
}
