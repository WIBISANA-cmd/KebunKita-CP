"use client";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Faq, HomePage } from "@/lib/types";

export function FaqSection({ copy, faqs }: { copy: HomePage["faq"]; faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-label={copy.heading} className="pb-20 pt-4">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading heading={copy.heading} subheading={copy.subheading} />
        <ul className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <li key={faq.id}>
              <Reveal delay={index * 0.08}>
                <details className="group rounded-[2rem] bg-mint px-7 open:bg-mint/70">
                  <summary className="flex min-h-14 items-center justify-between gap-4 py-4 font-semibold marker:content-none">
                    {faq.question}
                    <span aria-hidden="true" className="text-2xl leading-none text-pine transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-6 leading-relaxed text-slate">{faq.answer}</p>
                </details>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
