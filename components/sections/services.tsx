"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Leaf } from "@/components/motion/leaf";
import { Parallax, useScrollParallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { DrawnIcon, UiIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePage, Service } from "@/lib/types";

const CARD_TONES = [
  {
    surface: "card-surface text-white",
    summary: "text-white",
    icon: "text-spark",
    button: "bg-white text-forest hover:bg-spark",
  },
  {
    surface: "bg-white text-forest shadow-[0_24px_60px_rgb(0_58_60/0.1)]",
    summary: "text-slate",
    icon: "text-pine",
    button: "bg-pine text-white hover:bg-forest",
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const tone = CARD_TONES[index % CARD_TONES.length];

  return (
    <Reveal effect="rise" delay={0.15 + index * 0.15}>
      <TiltCard className={`flex h-full min-h-[21rem] flex-col rounded-[3.5rem] p-10 lg:min-h-[30rem] lg:rounded-[5.5rem] lg:p-14 ${tone.surface}`}>
        <DrawnIcon name={service.icon} delay={0.3} className={`size-16 ${tone.icon}`} />
        <h3 className="mt-5 whitespace-pre-line text-[1.75rem] font-semibold leading-tight tracking-tight lg:text-[2.3rem]">
          {service.title}
        </h3>
        <p className={`body-copy mt-3 mb-6 ${tone.summary}`}>{service.summary}</p>
        <a
          href={`#${service.target}`}
          aria-label={`Lihat ${service.title.replace("\n", " ")}`}
          className={`mt-auto grid size-14 place-items-center rounded-full transition duration-300 ease-soft hover:scale-105 active:scale-95 ${tone.button}`}
        >
          <UiIcon name="arrow" className="size-6" strokeWidth={2} />
        </a>
      </TiltCard>
    </Reveal>
  );
}

export function Services({ intro, services }: { intro: HomePage["intro"]; services: Service[] }) {
  const { ref: backdropRef, y: backdropY } = useScrollParallax<HTMLDivElement>(40);

  return (
    <section id="layanan" className="relative z-20 pb-16 pt-6 lg:-mt-12 lg:pb-28 lg:pt-0">
      <Leaf rotate={-30} blur={1} distance={60} className="left-[3%] top-[22%] hidden h-20 w-14 lg:block" />
      <Leaf shape="slim" rotate={40} blur={1} distance={100} className="right-[16%] top-[6%] hidden h-24 w-[4.5rem] md:block" />
      <Leaf rotate={60} blur={5} distance={150} className="left-[2%] top-[70%] hidden h-52 w-40 lg:block" />
      <Leaf shape="slim" rotate={30} distance={80} className="right-[6%] top-[38%] hidden h-14 w-10 lg:block" />

      <div className="wrap">
        <SectionHeading heading={intro.heading} subheading={intro.subheading} />

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[315fr_340fr_340fr] lg:gap-14">
          <motion.div
            ref={backdropRef}
            style={{ y: backdropY }}
            aria-hidden="true"
            className="pointer-events-none absolute -left-[3.5rem] -top-8 hidden h-[calc(100%+3.5rem)] w-[62%] lg:block"
          >
            <div className="band-surface absolute inset-y-0 left-0 w-[80%] rounded-[9rem]" />
            <div className="absolute -bottom-6 right-0 aspect-square w-[62%] rounded-full bg-[linear-gradient(135deg,#206444_0%,#6db74f_55%,#afe54f_100%)]" />
          </motion.div>

          <Reveal effect="wipe" duration={1.3} className="relative sm:col-span-2 lg:col-span-1">
            <div className="capsule relative mx-auto aspect-[315/500] w-[min(70vw,19.7rem)] lg:w-full">
              <Parallax distance={24} className="absolute -inset-y-[6%] inset-x-0">
                <Image
                  src={intro.image.src}
                  alt={intro.image.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 70vw"
                  className="object-cover"
                  style={{ objectPosition: intro.image.position }}
                />
              </Parallax>
            </div>
          </Reveal>

          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
