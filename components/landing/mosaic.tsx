import { cn } from "@/lib/utils"

/**
 * The shared mosaic shell: a 12-column grid whose 3px gaps show the black
 * backing through, so the tiles read as one bordered slab rather than as
 * separate cards. Tiles inside drop their own border, radius and shadow.
 */
export function Mosaic({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-12 grid grid-cols-1 gap-[3px] overflow-hidden rounded-[20px] border-[3px] border-border bg-border text-left shadow-xl md:grid-cols-12",
        className
      )}
      {...props}
    />
  )
}

/** Class set that strips a Card back to a flat mosaic tile. */
export const mosaicTile =
  "col-span-1 rounded-none border-0 shadow-none gap-3.5 [--card-spacing:26px]"
