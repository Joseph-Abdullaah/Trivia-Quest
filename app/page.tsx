import { CtaBanner } from "@/components/landing/cta-banner"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { GameModes } from "@/components/landing/game-modes"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { Testimonials } from "@/components/landing/testimonials"
import { Ticker } from "@/components/landing/ticker"

export default function Page() {
  return (
    <div className="w-full overflow-x-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <GameModes />
        <Features />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  )
}
