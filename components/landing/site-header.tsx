import Link from "next/link"

import { NAV_LINKS, PLAY_HREF } from "@/lib/landing-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-background">
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Badge className="size-9 rounded-xl px-0 text-sm shadow">TQ</Badge>
          <span className="font-head text-lg font-bold">TRIVIA QUEST</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "px-0 font-sans text-sm font-bold hover:text-destructive"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={PLAY_HREF}
          className={cn(
            buttonVariants({ variant: "destructive", size: "sm" }),
            "rounded-xl border-[2.5px] px-[18px] py-2.5 text-[13px] shadow"
          )}
        >
          PLAY NOW →
        </Link>
      </div>
    </header>
  )
}
