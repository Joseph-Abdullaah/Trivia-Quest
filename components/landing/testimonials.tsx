import { TESTIMONIALS } from "@/lib/landing-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const [spotlight, ...rest] = TESTIMONIALS

export function Testimonials() {
  return (
    <section
      id="reviews"
      className="mx-auto max-w-[1160px] scroll-mt-24 px-6 pt-5 pb-[90px] text-center"
    >
      <h2 className="font-head text-[clamp(1.75rem,4vw,2.125rem)] font-bold">
        WHAT PLAYERS ARE SAYING
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-5 text-left lg:grid-cols-2">
        <Card className="rounded-[18px] border-[2.5px] bg-primary text-on-accent shadow-xl [--card-spacing:32px]">
          <CardContent>
            <div aria-hidden className="text-xl tracking-[2px]">
              ★★★★★
            </div>
            <blockquote className="mt-4 text-[22px] leading-relaxed font-medium">
              &ldquo;{spotlight.quote}&rdquo;
            </blockquote>
          </CardContent>
          <CardFooter className="gap-2.5 border-t-0 bg-transparent pt-0">
            <Avatar className="bg-on-accent-surface">
              <AvatarFallback className="bg-on-accent-surface text-[13px] text-on-accent">
                {spotlight.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-bold">{spotlight.name}</div>
              <div className="text-xs">{spotlight.role}</div>
            </div>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-3.5">
          {rest.map((testimonial) => (
            <Card
              key={testimonial.name}
              size="sm"
              className="flex flex-row items-start gap-3 rounded-[14px] border-[2.5px] px-[18px] shadow-md"
            >
              <Avatar size="sm" className={testimonial.accent}>
                <AvatarFallback
                  className={`text-[11px] text-on-accent ${testimonial.accent}`}
                >
                  {testimonial.initials}
                </AvatarFallback>
              </Avatar>
              <CardContent className="px-0">
                <blockquote className="text-[13px] leading-relaxed">
                  {testimonial.quote}
                </blockquote>
                <div className="mt-1.5 text-xs font-bold">
                  {testimonial.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {testimonial.role}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
