import type { Difficulty } from "@/lib/opentdb"
import { CATEGORIES } from "@/lib/game/constants"

/** Harder questions are worth more. */
const BASE_POINTS: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
}

/** Answer inside 5s for the full bonus, inside 10s for half. */
function speedBonus(elapsedSeconds: number): number {
  if (elapsedSeconds < 5) return 50
  if (elapsedSeconds < 10) return 25
  return 0
}

/**
 * Multiplier for the streak *entering* this question: a third consecutive
 * correct answer doubles, a second adds half.
 */
function comboMultiplier(streak: number): number {
  if (streak >= 3) return 2
  if (streak >= 2) return 1.5
  return 1
}

export function pointsFor(
  difficulty: Difficulty,
  elapsedSeconds: number,
  streak: number
): number {
  const base = BASE_POINTS[difficulty] ?? BASE_POINTS.medium
  return Math.round(
    (base + speedBonus(elapsedSeconds)) * comboMultiplier(streak)
  )
}

/** Arcade score display: `001,850`. */
export function formatScore(value: number): string {
  const clamped = Math.max(0, Math.min(999999, Math.round(value)))
  const padded = String(clamped).padStart(6, "0")
  return padded.slice(0, 3) + "," + padded.slice(3)
}

/** Local calendar date, used to lock the daily challenge to one run. */
export function todayKey(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

/**
 * Everyone playing on the same calendar day gets the same category and
 * difficulty — that is what makes it a shared "daily" challenge.
 */
export function dailyChallengeConfig() {
  const d = new Date()
  const seed = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()
  const category = CATEGORIES[seed % CATEGORIES.length]
  const difficulty = (["easy", "medium", "hard"] as const)[seed % 3]
  return { category, difficulty }
}
