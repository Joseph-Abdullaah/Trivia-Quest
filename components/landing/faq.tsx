import { FAQS } from "@/lib/landing-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-[800px] scroll-mt-24 px-6 pt-5 pb-[90px]"
    >
      <h2 className="text-center font-head text-[clamp(1.75rem,4vw,2.125rem)] font-bold">
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <p className="mt-3 text-center text-[17px] text-muted-foreground">
        Everything you need to know before you play.
      </p>

      {/* The design opens the first question by default and allows one at a time. */}
      <Accordion
        multiple={false}
        defaultValue={[FAQS[0].q]}
        className="mt-10 gap-3"
      >
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.q}
            value={faq.q}
            className="rounded-[14px] border-[2.5px] bg-card shadow-md"
          >
            <AccordionTrigger className="px-5 py-[18px] text-[15px] font-bold">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 text-sm leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
