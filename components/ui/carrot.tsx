"use client";

import { motion, type MotionValue } from "motion/react";
import { useId } from "react";

const POSES = {
  upright: { viewBox: "0 0 100 170", angle: 0 },
  // The tip lands on the top-left corner of the viewBox so it can act as the cursor's hot spot.
  pointer: { viewBox: "-9 26 124 124", angle: 135 },
};

const OUTLINE = { stroke: "#003a3c", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function Carrot({
  pose = "upright",
  happy = false,
  lookX,
  lookY,
  sway,
  blink,
  className = "",
}: {
  pose?: keyof typeof POSES;
  happy?: boolean;
  lookX?: MotionValue<number>;
  lookY?: MotionValue<number>;
  sway?: MotionValue<number>;
  blink?: MotionValue<number>;
  className?: string;
}) {
  const id = useId();
  const { viewBox, angle } = POSES[pose];

  return (
    <svg aria-hidden="true" viewBox={viewBox} className={`block overflow-visible ${className}`}>
      <defs>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor="#ffb45a" />
          <stop offset="0.55" stopColor="var(--color-carrot)" />
          <stop offset="1" stopColor="#e2641c" />
        </linearGradient>
        <linearGradient id={`${id}leaf`} x1="0.2" y1="1" x2="0.8" y2="0">
          <stop offset="0" stopColor="#1f7a3f" />
          <stop offset="0.55" stopColor="#4fae3f" />
          <stop offset="1" stopColor="#b9ea5c" />
        </linearGradient>
      </defs>

      <g transform={`rotate(${angle} 50 85)`}>
        <motion.g style={{ rotate: sway, originX: "50%", originY: "100%" }}>
          <g className="carrot-leaves" fill={`url(#${id}leaf)`} {...OUTLINE}>
            <path d="M50 52C34 48 15 38 13 16c20-3 35 13 37 36Z" />
            <path d="M50 52c16-4 35-14 37-36-20-3-35 13-37 36Z" />
            <path d="M50 52C36 38 32 16 50 3c18 13 14 35 0 49Z" />
          </g>
        </motion.g>

        <path
          d="M50 167c-7-8-24-57-28-83-4-24 8-38 28-38s32 14 28 38c-4 26-21 75-28 83Z"
          fill={`url(#${id}body)`}
          {...OUTLINE}
        />
        <path d="M30 95c1 7 3 13 5 19" fill="none" stroke="#ffd9a3" strokeWidth="4" strokeLinecap="round" />
        <path d="M74 100c-6 3-10 3-14 2M34 118c5 3 9 3 13 2M63 134c-3 2-6 2-8 1" fill="none" stroke="#c9520f" strokeWidth="2.6" strokeLinecap="round" />

        {/* Stays level when the body is rotated, so the cursor never looks upside down. */}
        <g transform={`rotate(${-angle} 50 74)`}>
          <ellipse cx="32" cy="84" rx="4.6" ry="3" fill="#ff6b4a" fillOpacity="0.55" />
          <ellipse cx="68" cy="84" rx="4.6" ry="3" fill="#ff6b4a" fillOpacity="0.55" />

          {happy ? (
            <>
              <path d="M29 72c3-7 13-7 16 0M55 72c3-7 13-7 16 0" fill="none" {...OUTLINE} />
              <path d="M38 83c0 16 24 16 24 0Z" fill="#7a1f12" {...OUTLINE} strokeWidth={2.6} />
              <path d="M44 91c3-3 9-3 12 0-2 3-10 3-12 0Z" fill="#ff8a65" />
            </>
          ) : (
            <>
              <motion.g style={{ scaleY: blink, originX: "50%", originY: "50%" }}>
                <circle cx="37" cy="70" r="8.5" fill="#fff" stroke="#003a3c" strokeWidth="2.6" />
                <circle cx="63" cy="70" r="8.5" fill="#fff" stroke="#003a3c" strokeWidth="2.6" />
                <motion.g style={{ x: lookX, y: lookY }} fill="#003a3c">
                  <circle cx="37" cy="70" r="4.4" />
                  <circle cx="63" cy="70" r="4.4" />
                  <circle cx="35.4" cy="68.2" r="1.5" fill="#fff" />
                  <circle cx="61.4" cy="68.2" r="1.5" fill="#fff" />
                </motion.g>
              </motion.g>
              <path d="M42 85c3 5 13 5 16 0" fill="none" {...OUTLINE} strokeWidth={2.8} />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

const BITS = [
  { x: -64, y: -82, size: 11, color: "var(--color-spark)" },
  { x: -32, y: -118, size: 8, color: "var(--color-carrot)" },
  { x: 8, y: -128, size: 10, color: "var(--color-lime)" },
  { x: 42, y: -98, size: 8, color: "var(--color-carrot)" },
  { x: 74, y: -70, size: 11, color: "var(--color-spark)" },
  { x: -88, y: -44, size: 7, color: "var(--color-lime)" },
  { x: 92, y: -38, size: 7, color: "var(--color-lime)" },
];

/** A one-shot spray of leaf bits from the parent's origin. */
export function Crumbs({ spread = 1, onDone }: { spread?: number; onDone?: () => void }) {
  return BITS.map(({ x, y, size, color }, index) => (
    <motion.span
      key={`${x}${y}`}
      aria-hidden="true"
      initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
      animate={{
        x: x * spread,
        y: [0, y * spread, (y + 70) * spread],
        rotate: x * 4,
        scale: 0.5,
        opacity: [1, 1, 0],
      }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      onAnimationComplete={index === 0 ? onDone : undefined}
      style={{ width: size * Math.max(spread, 0.7), height: size * Math.max(spread, 0.7), background: color }}
      className="absolute left-0 top-0 rounded-[70%_12%]"
    />
  ));
}
