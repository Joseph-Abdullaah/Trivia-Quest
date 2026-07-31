import { TICKER_ITEMS } from "@/lib/landing-data"

export function Ticker() {
  return (
    <div className="bg-secondary px-6 py-5 text-secondary-foreground">
      <div className="mx-auto flex max-w-[1160px] flex-wrap justify-around gap-4 text-center font-head text-sm font-bold tracking-wide">
        {TICKER_ITEMS.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  )
}
