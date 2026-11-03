"use client";

import { AccentBar, LineReveal, Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  heading,
  subheading,
  className = "",
}: {
  heading: string;
  subheading?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <AccentBar className="mb-5" />
      <LineReveal text={heading} className="section-heading text-forest" />
      {subheading && (
        <Reveal delay={0.2}>
          <p className="lead mt-4 max-w-2xl text-slate">{subheading}</p>
        </Reveal>
      )}
    </header>
  );
}
