"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Eased pointer position across the window, from -0.5 to 0.5 on each axis. */
export function usePointerDrift() {
  const x = useSpring(0, { stiffness: 50, damping: 18 });
  const y = useSpring(0, { stiffness: 50, damping: 18 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover)").matches) return;

    function track(event: PointerEvent) {
      x.set(event.clientX / window.innerWidth - 0.5);
      y.set(event.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener("pointermove", track, { passive: true });
    return () => window.removeEventListener("pointermove", track);
  }, [reduced, x, y]);

  return { x, y };
}

/** Moves an element by `distance` px either side of its resting spot while it crosses the viewport. */
export function useScrollParallax<T extends HTMLElement>(distance: number) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = reduced ? [0, 0] : [distance, -distance];
  const y = useTransform(scrollYProgress, [0, 1], range);
  return { ref, y, progress: scrollYProgress };
}

export function Parallax({
  distance = 60,
  className,
  children,
}: {
  distance?: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, y } = useScrollParallax<HTMLDivElement>(distance);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
