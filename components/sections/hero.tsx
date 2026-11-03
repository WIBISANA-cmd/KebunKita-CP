"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useEntranceReady } from "@/components/motion/entrance";
import { Leaf } from "@/components/motion/leaf";
import { usePointerDrift } from "@/components/motion/parallax";
import { AccentBar, EASE_SOFT, LineReveal, Reveal } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/pill-link";
import type { HomePage } from "@/lib/types";

export function Hero({ hero }: { hero: HomePage["hero"] }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const ready = useEntranceReady();
  const pointer = usePointerDrift();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });

  const shift = (distance: number) => (reduced ? 0 : distance);
  const textY = useTransform(scrollYProgress, [0, 1], [0, shift(180)]);
  const capsuleY = useTransform(scrollYProgress, [0, 1], [0, shift(90)]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const swooshY = useTransform(scrollYProgress, [0, 1], [0, shift(-120)]);
  const limeY = useTransform(scrollYProgress, [0, 1], [0, shift(-60)]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, shift(70)]);

  return (
    <section
      ref={section}
      id="beranda"
      className="hero-surface relative isolate overflow-hidden pb-40 pt-32 text-white sm:pb-52 lg:min-h-[min(78vw,70rem)] lg:pb-0 lg:pt-0"
    >
      <motion.svg
        aria-hidden="true"
        style={{ y: swooshY }}
        viewBox="0 0 1440 1130"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-8%] -z-10 h-[108%] w-full"
      >
        <defs>
          <linearGradient id="hero-swoosh" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0" stopColor="#3f8f4b" />
            <stop offset="1" stopColor="#9ad653" />
          </linearGradient>
        </defs>
        <path d="M0 720C170 700 300 790 430 860s250 150 430 180v200H0Z" fill="url(#hero-swoosh)" />
      </motion.svg>

      <motion.svg
        aria-hidden="true"
        style={{ y: limeY }}
        viewBox="0 0 1440 1130"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-4%] -z-10 h-[104%] w-full"
      >
        <path d="M760 1200c200-150 420-190 680-400v400Z" fill="#a6de50" fillOpacity="0.75" />
      </motion.svg>

      <div className="wrap relative grid items-center gap-12 lg:min-h-[min(78vw,70rem)] lg:grid-cols-[1fr_auto]">
        <motion.div style={{ y: textY }} className="lg:pb-[14%]">
          <AccentBar className="mb-6" />
          <LineReveal as="h1" text={hero.heading} className="display-heading" />
          <Reveal delay={0.35}>
            <p className="lead mt-5 max-w-[30rem]">{hero.subheading}</p>
          </Reveal>
          <Reveal delay={0.5} className="mt-8">
            <PillLink href="#produk">{hero.ctaLabel}</PillLink>
          </Reveal>
        </motion.div>

        <motion.div style={{ y: capsuleY }} className="justify-self-center lg:mr-[5.4vw] lg:justify-self-end lg:pt-[6.2vw]">
          <motion.div
            initial={{ clipPath: "inset(50% 0% 50% 0% round 9999px)" }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 9999px)" } : undefined}
            transition={{ duration: 1.5, delay: 0.15, ease: EASE_SOFT }}
            className="capsule relative aspect-[452/915] w-[min(68vw,18rem)] sm:w-80 lg:w-[clamp(20rem,31.4vw,28.25rem)]"
          >
            <motion.div style={{ y: photoY }} className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(min-width: 1024px) 32vw, 70vw"
                className="object-cover"
                style={{ objectPosition: hero.image.position }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <Leaf pointer={pointer} depth={34} rotate={18} distance={70} className="left-[39%] top-[69%] hidden h-24 w-[4.25rem] lg:block" />
      <Leaf pointer={pointer} depth={60} rotate={40} blur={3} distance={120} className="right-[2%] top-[45%] h-28 w-20" />
      <Leaf pointer={pointer} depth={46} shape="slim" rotate={70} blur={1.5} distance={90} className="right-[3%] top-[68%] hidden h-32 w-24 sm:block" />

      <motion.svg
        aria-hidden="true"
        style={{ y: waveY }}
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-1px] z-10 h-24 w-full sm:h-40 lg:h-[22%]"
      >
        <path d="M0 110C170 40 330 60 480 120c170 68 280 110 480 104 170-5 330-52 480-88v240H0Z" fill="#fff" />
      </motion.svg>
    </section>
  );
}
