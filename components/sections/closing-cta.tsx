"use client";

import Image from "next/image";
import { Leaf } from "@/components/motion/leaf";
import { Parallax } from "@/components/motion/parallax";
import { AccentBar, LineReveal, Reveal } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/pill-link";
import type { HomePage } from "@/lib/types";

export function ClosingCta({ cta, mapsUrl }: { cta: HomePage["cta"]; mapsUrl: string }) {
  return (
    <section aria-label="Ajakan berkunjung" className="wrap-wide relative pt-8">
      <Leaf rotate={-40} blur={1} distance={70} className="-left-1 -top-2 z-20 hidden h-28 w-20 lg:block" />
      <Leaf shape="slim" rotate={30} blur={2} distance={100} className="-right-1 bottom-4 z-20 hidden h-32 w-24 lg:block" />

      <div className="cta-surface relative isolate min-h-[26rem] overflow-hidden rounded-[3.5rem] text-white lg:min-h-[25rem] lg:rounded-[8rem]">
        <Parallax
          distance={36}
          className="absolute -z-10 hidden lg:block lg:inset-y-[-20%] lg:right-0 lg:w-[40%] [mask-image:linear-gradient(90deg,transparent_0%,#000_38%)]"
        >
          <Image
            src={cta.image.src}
            alt={cta.image.alt}
            fill
            sizes="46vw"
            className="object-cover"
            style={{ objectPosition: cta.image.position }}
          />
        </Parallax>

        <div className="px-7 py-14 sm:px-14 lg:max-w-[60%] lg:py-20 lg:pl-[7.5rem] lg:pr-0">
          <AccentBar className="mb-6" />
          <LineReveal text={cta.heading} className="section-heading" />
          <Reveal delay={0.2}>
            <p className="lead mt-4 max-w-[30rem]">{cta.body}</p>
          </Reveal>
          <Reveal delay={0.35} className="mt-8">
            <PillLink href={mapsUrl}>{cta.ctaLabel}</PillLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
