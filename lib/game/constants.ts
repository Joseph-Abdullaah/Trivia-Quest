import type { Difficulty, QuestionType } from "@/lib/opentdb"

export type Category = { id: number; name: string }

/**
 * The 24 OpenTDB categories, with the "Entertainment:" / "Science:" prefixes
 * dropped so the tiles stay readable at two columns.
 */
export const CATEGORIES: Category[] = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Books" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 13, name: "Musicals & Theatres" },
  { id: 14, name: "Television" },
  { id: 15, name: "Video Games" },
  { id: 16, name: "Board Games" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Computers" },
  { id: 19, name: "Mathematics" },
  { id: 20, name: "Mythology" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 23, name: "History" },
  { id: 24, name: "Politics" },
  { id: 25, name: "Art" },
  { id: 26, name: "Celebrities" },
  { id: 27, name: "Animals" },
  { id: 28, name: "Vehicles" },
  { id: 29, name: "Comics" },
  { id: 30, name: "Gadgets" },
  { id: 31, name: "Anime & Manga" },
  { id: 32, name: "Cartoons" },
]

export type ModeKey =
  "quick" | "custom" | "time" | "survival" | "daily" | "blitz"

export type ModeDef = {
  key: ModeKey
  label: string
  desc: string
  glyph: string
  /** Tailwind colour token for the card's offset shadow. */
  accent: string
}

export const MODES: ModeDef[] = [
  {
    key: "quick",
    label: "QUICK PLAY",
    desc: "10 random questions",
    glyph: "▶",
    accent: "success",
  },
  {
    key: "custom",
    label: "CUSTOM QUIZ",
    desc: "Your rules, your game",
    glyph: "◈",
    accent: "grape",
  },
  {
    key: "time",
    label: "TIME ATTACK",
    desc: "15 seconds per question",
    glyph: "⏱",
    accent: "primary",
  },
  {
    key: "survival",
    label: "SURVIVAL",
    desc: "3 lives, don't lose them",
    glyph: "♥",
    accent: "destructive",
  },
  {
    key: "daily",
    label: "DAILY CHALLENGE",
    desc: "One shot per day",
    glyph: "◆",
    accent: "teal",
  },
  {
    key: "blitz",
    label: "CATEGORY BLITZ",
    desc: "20 questions, one topic",
    glyph: "⚡",
    accent: "bubblegum",
  },
]

/** Offset-shadow class per accent. Written out so Tailwind can see them. */
export const ACCENT_SHADOW: Record<string, string> = {
  success: "shadow-[5px_5px_0_0_var(--success)]",
  grape: "shadow-[5px_5px_0_0_var(--grape)]",
  primary: "shadow-[5px_5px_0_0_var(--primary)]",
  destructive: "shadow-[5px_5px_0_0_var(--destructive)]",
  teal: "shadow-[5px_5px_0_0_var(--teal)]",
  bubblegum: "shadow-[5px_5px_0_0_var(--bubblegum)]",
  cobalt: "shadow-[5px_5px_0_0_var(--cobalt)]",
}

/** Cycled across the category tiles so the grid reads as a colour field. */
export const TILE_ACCENTS = [
  "destructive",
  "grape",
  "primary",
  "teal",
  "bubblegum",
  "cobalt",
] as const

export const DIFFICULTIES: (Difficulty | "any")[] = [
  "any",
  "easy",
  "medium",
  "hard",
]

export const DIFFICULTY_LABELS: Record<Difficulty | "any", string> = {
  any: "ANY",
  easy: "EASY",
  medium: "MEDIUM",
  hard: "HARD",
}

export const QUESTION_TYPES: (QuestionType | "any")[] = [
  "any",
  "multiple",
  "boolean",
]

export const TYPE_LABELS: Record<QuestionType | "any", string> = {
  any: "MIXED",
  multiple: "MULTIPLE",
  boolean: "TRUE / FALSE",
}

export const COUNT_OPTIONS = [5, 10, 15, 20, 25, 50]

export const TIME_ATTACK_SECONDS = 15
export const SURVIVAL_LIVES = 3
/** Survival pulls a deep pool; the run ends on lives, not on length. */
export const SURVIVAL_POOL = 50
export const BLITZ_COUNT = 20

export const STORAGE_KEYS = {
  name: "tq_player_name",
  highScore: "tq_high_score",
  settings: "tq_settings",
  dailyPlayed: "tq_daily_played_date",
} as const
