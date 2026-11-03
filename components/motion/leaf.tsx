"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";
import { useScrollParallax } from "./parallax";

const SHAPES = {
  broad: {
    outline: "M60 4C22 26 6 66 14 112c3 17 14 30 28 38 4-13 12-27 22-38 26-30 42-68 28-104C82 6 71 2 60 4Z",
    vein: "M42 150C52 104 68 62 88 12",
  },
  slim: {
    outline: "M74 3C38 18 16 54 14 100c-1 18 4 34 14 48 8-16 21-30 36-44 24-23 34-58 18-98-2-4-5-5-8-3Z",
    vein: "M28 148C42 100 58 58 78 10",
  },
};

export function Leaf({
  shape = "broad",
  className,
  rotate = 0,
  blur = 0,
  distance = 80,
  pointer,
  depth = 0,
}: {
  shape?: keyof typeof SHAPES;
  className?: string;
  rotate?: number;
  blur?: number;
  distance?: number;
  pointer?: { x: MotionValue<number>; y: MotionValue<number> };
  depth?: number;
}) {
  const gradientId = useId();
  const { ref, y, progress } = useScrollParallax<HTMLDivElement>(distance);
  const spin = useTransform(progress, [0, 1], [rotate - 16, rotate + 16]);
  const zero = useTransform(progress, () => 0);
  const driftX = useTransform(pointer?.x ?? zero, (value) => value * depth);
  const driftY = useTransform(pointer?.y ?? zero, (value) => value * depth);
  const { outline, vein } = SHAPES[shape];

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ y, rotate: spin, filter: blur ? `blur(${blur}px)` : undefined }}
      className={`pointer-events-none absolute ${className}`}
    >
      <motion.svg viewBox="0 0 110 156" style={{ x: driftX, y: driftY }} className="block h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0.15" y1="1" x2="0.85" y2="0">
            <stop offset="0" stopColor="#1f7a3f" />
            <stop offset="0.55" stopColor="#4fae3f" />
            <stop offset="1" stopColor="#b9ea5c" />
          </linearGradient>
        </defs>
        <path d={outline} fill={`url(#${gradientId})`} />
        <path d={vein} fill="none" stroke="#d8f59a" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}
