import { CHIP_CATEGORIES } from "@/lib/landing-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mosaic, mosaicTile } from "@/components/landing/mosaic"

/** Small white pill used for the inline score / lifeline / verdict chips. */
function Chip({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Badge
      variant="outline"
      className={`h-auto rounded-[10px] border-[2.5px] bg-on-accent-surface px-3.5 py-2 font-sans text-[13px] font-bold text-on-accent shadow-none ${className ?? ""}`}
    >
      {children}
    </Badge>
  )
}

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-[1160px] scroll-mt-24 px-6 pt-5 pb-[90px] text-center"
    >
      <h2 className="font-head text-[clamp(1.75rem,4vw,2.125rem)] font-bold">
        BUILT TO FEEL LIKE AN ARCADE CABINET
      </h2>
      <p className="mt-3 text-[17px] text-muted-foreground">
        Real scoring mechanics, not just a percentage at the end.
      </p>

      <Mosaic>
        <Card
          className={`${mosaicTile} bg-primary text-on-accent md:col-span-8`}
        >
          <CardHeader>
            <CardTitle className="font-head text-lg font-bold">
              COMBO MULTIPLIERS
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-[420px] text-sm leading-relaxed">
            Chain correct answers to multiply your points, plus speed bonuses
            for fast fingers.
          </CardContent>
          <CardContent className="flex flex-wrap gap-2.5">
            <Chip className="font-head">SCORE 001,850</Chip>
            <Chip className="bg-success! font-head">COMBO x3!</Chip>
          </CardContent>
        </Card>

        <Card className={`${mosaicTile} bg-grape text-on-accent md:col-span-4`}>
          <CardHeader>
            <CardTitle className="font-head text-lg font-bold">
              TWO LIFELINES A GAME
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            Cut two wrong answers with 50/50, or skip the question entirely —
            once each, per game.
          </CardContent>
          <CardContent className="flex flex-wrap gap-2">
            <Chip className="px-3 py-[7px] text-xs">50 / 50</Chip>
            <Chip className="px-3 py-[7px] text-xs">SKIP →</Chip>
          </CardContent>
        </Card>

        <Card
          className={`${mosaicTile} bg-teal text-on-accent md:col-span-6 lg:col-span-4`}
        >
          <CardHeader>
            <CardTitle className="font-head text-lg font-bold">
              24 CATEGORIES
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            Session tokens mean the same question won&apos;t repeat.
          </CardContent>
          <CardContent className="flex flex-wrap gap-1.5">
            {CHIP_CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="h-auto rounded-lg bg-on-accent-surface px-2.5 py-1 font-sans text-[11px] font-bold text-on-accent shadow-none"
              >
                {category}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card
          className={`${mosaicTile} bg-bubblegum text-on-accent md:col-span-6 lg:col-span-8`}
        >
          <CardHeader>
            <CardTitle className="font-head text-lg font-bold">
              FEEDBACK THAT FEELS GOOD
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-[420px] text-sm leading-relaxed">
            Instant correct/wrong reveals with the right answer shown every time
            — no guessing what you missed.
          </CardContent>
          <CardContent className="flex flex-wrap gap-2.5">
            <Chip className="border-success">✓ CORRECT!</Chip>
            <Chip className="border-destructive">✗ WRONG!</Chip>
          </CardContent>
        </Card>
      </Mosaic>
    </section>
  )
}
