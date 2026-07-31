import type { Metadata } from "next"
import { DM_Sans, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-head",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Trivia Quest — Trivia night. Any time. Any topic.",
  description:
    "Six game modes, 24 categories, and an unlimited question bank. No ads, no accounts, no leaderboards to feel bad about — just you chasing your own high score.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", spaceGrotesk.variable, dmSans.variable)}
    >
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
