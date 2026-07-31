import Link from "next/link"

import { PLAY_HREF } from "@/lib/landing-data"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CtaBanner() {
  return (
    <section className="mx-auto mb-[90px] max-w-[1160px] px-6">
      <Card className="rounded-3xl border-[3px] bg-primary text-center text-on-accent shadow-xl [--card-spacing:56px]">
        <CardContent>
          <h2 className="font-head text-[clamp(1.5rem,4vw,1.875rem)] font-bold">
            THINK YOU KNOW IT ALL?
          </h2>
          <p className="mx-auto mt-2.5 max-w-[420px] text-base">
            Free forever, no account needed. Pick a name and start your first
            quiz in seconds.
          </p>
          <Link
            href={PLAY_HREF}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "mt-6 rounded-[14px] border-[3px] shadow-[5px_5px_0_0_var(--destructive)] hover:shadow-[3px_3px_0_0_var(--destructive)] active:shadow-none"
            )}
          >
            START PLAYING →
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}
