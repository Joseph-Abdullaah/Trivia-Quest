/**
 * Landing page copy, lifted from the Trivia Quest Landing design source.
 *
 * Accent colours live here as Tailwind class strings rather than hex so the
 * sections stay on the theme tokens defined in `app/globals.css`.
 */

export type Step = {
  n: string
  title: string
  desc: string
  /** Colour of the rule running down the left of the step. */
  rule: string
}

export const STEPS: Step[] = [
  {
    n: "1",
    title: "PICK A NAME",
    desc: "No email, no password — just an arcade-style name stored on your device.",
    rule: "bg-success",
  },
  {
    n: "2",
    title: "CHOOSE YOUR MODE",
    desc: "Quick Play to jump straight in, or configure category, difficulty and count yourself.",
    rule: "bg-grape",
  },
  {
    n: "3",
    title: "CHASE YOUR HIGH SCORE",
    desc: "Answer fast, stack combos, and try to beat your own personal best.",
    rule: "bg-primary",
  },
]

export type GameMode = {
  key: string
  label: string
  desc: string
  glyph: string
  accent: string
  /** Column span inside the 12-column mosaic, from tablet up. */
  span: string
}

export const GAME_MODES: GameMode[] = [
  {
    key: "quick",
    label: "QUICK PLAY",
    desc: "10 random questions, any category or difficulty — the fastest way in.",
    glyph: "▶",
    accent: "bg-success",
    span: "md:col-span-8",
  },
  {
    key: "custom",
    label: "CUSTOM QUIZ",
    desc: "Pick category, difficulty, type and count.",
    glyph: "◈",
    accent: "bg-grape",
    span: "md:col-span-4",
  },
  {
    key: "time",
    label: "TIME ATTACK",
    desc: "15 seconds a question.",
    glyph: "⏱",
    accent: "bg-primary",
    span: "md:col-span-6 lg:col-span-3",
  },
  {
    key: "survival",
    label: "SURVIVAL",
    desc: "Three lives, don't lose them.",
    glyph: "♥",
    accent: "bg-destructive",
    span: "md:col-span-6 lg:col-span-3",
  },
  {
    key: "daily",
    label: "DAILY CHALLENGE",
    desc: "One shot per day.",
    glyph: "◆",
    accent: "bg-teal",
    span: "md:col-span-6 lg:col-span-3",
  },
  {
    key: "blitz",
    label: "CATEGORY BLITZ",
    desc: "20 questions, one topic.",
    glyph: "⚡",
    accent: "bg-bubblegum",
    span: "md:col-span-6 lg:col-span-3",
  },
]

export const CHIP_CATEGORIES = [
  "SCIENCE",
  "HISTORY",
  "FILM",
  "SPORTS",
  "GEOGRAPHY",
  "ANIME",
]

export type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  accent: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Survival mode got me. I lost track of time trying to beat my own streak of 12.",
    name: "Jordan M.",
    role: "Trivia enthusiast",
    initials: "JM",
    accent: "bg-success",
  },
  {
    quote:
      "No sign-up, no leaderboard pressure — just fast rounds on my lunch break.",
    name: "Priya S.",
    role: "Daily player",
    initials: "PS",
    accent: "bg-grape",
  },
  {
    quote:
      "Category Blitz on Film is brutal in the best way. Finally something for my niche knowledge.",
    name: "Alex R.",
    role: "Movie buff",
    initials: "AR",
    accent: "bg-primary",
  },
  {
    quote:
      "The combo multiplier actually made me play faster instead of overthinking every question.",
    name: "Sam K.",
    role: "Casual gamer",
    initials: "SK",
    accent: "bg-bubblegum",
  },
]

export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: "Do I need to create an account?",
    a: "No. Just enter a play name on first launch — it's saved to your device, nothing is sent anywhere.",
  },
  {
    q: "Where do the questions come from?",
    a: "The Open Trivia Database, across 24 categories. We use session tokens so you rarely see the same question twice in a row.",
  },
  {
    q: "Is there a leaderboard or multiplayer?",
    a: "No — Trivia Quest is intentionally single-player. It's about beating your own high score, not competing with strangers.",
  },
  {
    q: "Is it really free?",
    a: "Completely. No ads, no paywalls, no in-app purchases — v1 is fully local and free to play.",
  },
  {
    q: "Can I play on my phone?",
    a: "Yes, the whole game is responsive and works on phone, tablet, and desktop.",
  },
]

export const TICKER_ITEMS = [
  "24 CATEGORIES",
  "6 GAME MODES",
  "SESSION-SAFE, NO REPEATS",
  "ZERO ADS",
  "POWERED BY OPENTDB",
]

export const NAV_LINKS = [
  { href: "#modes", label: "GAME MODES" },
  { href: "#features", label: "FEATURES" },
  { href: "#reviews", label: "REVIEWS" },
  { href: "#faq", label: "FAQ" },
]

/** Where the "play" CTAs point. The game itself is a separate route. */
export const PLAY_HREF = "/play"
