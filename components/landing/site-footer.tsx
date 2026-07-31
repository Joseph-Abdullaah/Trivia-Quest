import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS = [
  { href: "#modes", label: "Game Modes" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
]

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-border px-6 pt-12 pb-7">
      <div className="mx-auto flex max-w-[1160px] flex-wrap justify-between gap-8">
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2.5">
            <Badge className="size-[30px] rounded-lg px-0 text-xs shadow">
              TQ
            </Badge>
            <span className="font-head text-base font-bold">TRIVIA QUEST</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            A retro-styled trivia game with six modes and 24 categories. No
            accounts, no leaderboards, no ads.
          </p>
        </div>

        <nav>
          <h2 className="mb-3 font-head text-[13px] font-bold">PLAY</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-destructive">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-9 max-w-[1160px]">
        <Separator className="bg-muted" />
        <p className="pt-5 text-xs text-muted-foreground">
          © 2026 Trivia Quest. Powered by Open Trivia DB.
        </p>
      </div>
    </footer>
  )
}
