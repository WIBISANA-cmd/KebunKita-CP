"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Leaf } from "@/components/motion/leaf";
import { Parallax } from "@/components/motion/parallax";
import { AccentBar, LineReveal, Reveal } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/pill-link";
import type { HomePage, SiteImage } from "@/lib/types";

function BandPhoto({ image, distance, className }: { image: SiteImage; distance: number; className?: string }) {
  return (
    <Parallax distance={distance} className={className}>
      <Reveal effect="wipe" duration={1.3}>
        <div className="capsule relative aspect-[320/520] rounded-[8.5rem]! bg-white/10">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="object-cover"
            style={{ objectPosition: image.position }}
          />
        </div>
      </Reveal>
    </Parallax>
  );
}

export function PhotoBand({ band }: { band: HomePage["band"] }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const limeX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <section ref={section} aria-labelledby="band-heading" className="wrap-wide relative mt-4">
      <Leaf rotate={-20} distance={70} className="-left-1 -top-6 z-10 hidden h-20 w-14 lg:block" />
      <Leaf rotate={50} blur={2} distance={110} className="-right-2 top-[42%] z-10 hidden h-32 w-24 lg:block" />

      <div className="band-surface relative isolate overflow-hidden rounded-[3.5rem] text-white lg:rounded-[8rem]">
        <motion.svg
          aria-hidden="true"
          style={{ x: limeX }}
          viewBox="0 0 700 650"
          preserveAspectRatio="none"
          className="absolute -right-[8%] inset-y-0 -z-10 hidden h-full w-[62%] lg:block"
        >
          <path d="M210 0C110 90 90 190 170 290c70 90 40 240-60 360h590V0Z" fill="#aee749" />
        </motion.svg>

        <div className="grid items-center gap-10 px-6 py-14 sm:px-12 lg:grid-cols-[1fr_auto] lg:gap-14 lg:py-20 lg:pl-[7.5rem] lg:pr-[5.5rem]">
          <div>
            <AccentBar className="mb-6" />
            <LineReveal id="band-heading" text={band.heading} className="section-heading" />
            <Reveal delay={0.2}>
              <p className="lead mt-5 max-w-md">{band.body}</p>
            </Reveal>
            <Reveal delay={0.35} className="mt-8">
              <PillLink href="#lokasi">{band.ctaLabel}</PillLink>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:w-[43rem] lg:gap-12">
            <BandPhoto image={band.imageA} distance={34} />
            <BandPhoto image={band.imageB} distance={-34} className="mt-8 lg:mt-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
