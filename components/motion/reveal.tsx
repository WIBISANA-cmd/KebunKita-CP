"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useEntranceReady } from "./entrance";

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, amount: 0.25 } as const;

const EFFECTS = {
  rise: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0 } },
  pop: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  wipe: {
    hidden: { clipPath: "inset(50% 0% 50% 0% round 9999px)" },
    visible: { clipPath: "inset(0% 0% 0% 0% round 9999px)" },
  },
} satisfies Record<string, Variants>;

export function Reveal({
  effect = "rise",
  delay = 0,
  duration = 0.9,
  className,
  children,
}: {
  effect?: keyof typeof EFFECTS;
  delay?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
}) {
  const ready = useEntranceReady();

  // The outer element keeps its full box: a fully clipped target never registers as in view.
  return (
    <motion.div initial="hidden" whileInView={ready ? "visible" : undefined} viewport={VIEWPORT} className={className}>
      <motion.div variants={EFFECTS[effect]} transition={{ duration, delay, ease: EASE_SOFT }} className="h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AccentBar({ className = "" }: { className?: string }) {
  const ready = useEntranceReady();

  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={ready ? { scaleX: 1 } : undefined}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_SOFT }}
      className={`lime-button block h-1.5 w-[4.6rem] origin-left rounded-full ${className}`}
    />
  );
}

const LINE: Variants = {
  hidden: { y: "108%" },
  visible: (index: number) => ({
    y: "0%",
    transition: { duration: 1, delay: index * 0.12, ease: EASE_SOFT },
  }),
};

/** Splits on line breaks from the CMS and lifts each line out of its own mask. */
export function LineReveal({
  text,
  as = "h2",
  id,
  className,
}: {
  text: string;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const ready = useEntranceReady();

  return (
    <Heading
      id={id}
      initial="hidden"
      whileInView={ready ? "visible" : undefined}
      viewport={{ once: true, amount: 0.4 }}
      className={className}
    >
      {text.split("\n").map((line, index) => (
        <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span custom={index} variants={LINE} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </Heading>
  );
}
