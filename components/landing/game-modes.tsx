import { GAME_MODES } from "@/lib/landing-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mosaic, mosaicTile } from "@/components/landing/mosaic"

export function GameModes() {
  return (
    <section
      id="modes"
      className="mx-auto max-w-[1160px] scroll-mt-24 px-6 pt-5 pb-[90px] text-center"
    >
      <h2 className="font-head text-[clamp(1.75rem,4vw,2.125rem)] font-bold">
        SIX WAYS TO PLAY
      </h2>
      <p className="mt-3 text-[17px] text-muted-foreground">
        Same question bank, six very different rule sets.
      </p>

      <Mosaic>
        {GAME_MODES.map((mode) => (
          <Card
            key={mode.key}
            className={`${mosaicTile} ${mode.span} ${mode.accent} relative min-h-[150px] text-on-accent`}
          >
            <CardHeader className="gap-3.5">
              <span
                aria-hidden
                className="flex size-[38px] items-center justify-center rounded-[10px] border-[2.5px] border-border bg-on-accent-surface text-lg"
              >
                {mode.glyph}
              </span>
              <CardTitle className="font-head text-base font-bold">
                {mode.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-w-[320px] text-sm leading-snug">
              {mode.desc}
            </CardContent>
            <span
              aria-hidden
              className="absolute right-5 bottom-4 font-bold tracking-[2px]"
            >
              •••
            </span>
          </Card>
        ))}
      </Mosaic>
    </section>
  )
}
