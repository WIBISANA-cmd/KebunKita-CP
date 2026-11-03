"use client";

import { motion } from "motion/react";
import { Parallax } from "@/components/motion/parallax";
import { EASE_SOFT, Reveal } from "@/components/motion/reveal";
import { DrawnIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePage } from "@/lib/types";

export function Steps({ steps }: { steps: HomePage["steps"] }) {
  return (
    <section id="cara-belanja" className="relative overflow-hidden pb-20 pt-12 lg:pt-16">
      <Parallax distance={50} className="absolute inset-x-0 top-0 -z-10">
        <svg aria-hidden="true" viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-64 w-full lg:h-80">
          <path d="M0 40C260 120 420 10 720 70s460 110 720-10v200c-300 70-500 10-740 30S200 320 0 240Z" fill="#e7f7e8" fillOpacity="0.7" />
        </svg>
      </Parallax>

      <div className="wrap">
        <SectionHeading heading={steps.heading} subheading={steps.subheading} />

        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-0">
          {steps.items.map((step, index) => (
            <li key={step.title} className="relative flex items-start gap-6 lg:px-6 lg:first:pl-0 lg:last:pr-0">
              {index > 0 && (
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: index * 0.2, ease: EASE_SOFT }}
                  className="absolute inset-y-2 left-0 hidden w-px origin-top bg-forest/15 lg:block"
                />
              )}
              <Reveal effect="pop" delay={index * 0.2} className="shrink-0">
                <span className="grid size-24 place-items-center rounded-full bg-mint text-pine lg:size-[8.5rem]">
                  <DrawnIcon name={step.icon} delay={0.2 + index * 0.2} className="size-11 lg:size-16" />
                </span>
              </Reveal>
              <Reveal effect="right" delay={0.1 + index * 0.2}>
                <p className="font-medium text-slate" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight lg:text-[1.75rem]">{step.title}</h3>
                <p className="body-copy mt-2 text-slate">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
