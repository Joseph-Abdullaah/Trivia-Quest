import { ArrowLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ScreenHeader({
  title,
  onBack,
  titleClassName,
}: {
  title: string
  onBack: () => void
  titleClassName?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        aria-label="Go back"
        className="size-10 shrink-0 rounded-[10px] border-[2.5px] bg-card shadow"
      >
        <ArrowLeftIcon className="size-[18px]" />
      </Button>
      <h1 className={cn("font-head text-lg font-bold", titleClassName)}>
        {title}
      </h1>
    </div>
  )
}
