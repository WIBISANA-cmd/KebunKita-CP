"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Carrot, Crumbs } from "@/components/ui/carrot";

const INTERACTIVE = "a[href], button:not(:disabled), summary, label[for]";
const BLINK_AFTER_MS = 1400;
const LEAN = { stiffness: 260, damping: 18 };
const LEAF_SWING = { stiffness: 220, damping: 7 };
const EYES = { stiffness: 300, damping: 24 };

type Burst = { id: number; x: number; y: number };

export function CarrotCursor() {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [overTarget, setOverTarget] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  // The tip follows the pointer exactly; only the rotation and leaves lag, so aiming stays precise.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const blink = useMotionValue(1);
  const speedX = useVelocity(x);
  const speedY = useVelocity(y);
  const motionOn = reduced ? 0 : 1;
  const lean = useSpring(useTransform(speedX, [-1600, 1600], [-14 * motionOn, 14 * motionOn]), LEAN);
  const sway = useSpring(useTransform(speedX, [-1600, 1600], [30 * motionOn, -30 * motionOn]), LEAF_SWING);
  const lookX = useSpring(useTransform(speedX, [-1200, 1200], [-3 * motionOn, 3 * motionOn]), EYES);
  const lookY = useSpring(useTransform(speedY, [-1200, 1200], [-3 * motionOn, 3 * motionOn]), EYES);

  useEffect(() => {
    const element = layer.current;
    if (!element || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = document.documentElement;
    let restTimer: number | undefined;

    // A modal dialog joins the top layer above the cursor, so the cursor has to rejoin after it.
    function raise() {
      if (!element || !("popover" in element)) return;
      if (element.matches(":popover-open")) element.hidePopover();
      element.showPopover();
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      // The native arrow stays until the first move, because the position is unknown before that.
      root.classList.add("carrot-cursor");
      setShown(true);

      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(() => animate(blink, [1, 0.1, 1], { duration: 0.26 }), BLINK_AFTER_MS);
    }

    function over(event: PointerEvent) {
      setOverTarget(event.target instanceof Element && event.target.closest(INTERACTIVE) !== null);
    }

    function press(event: PointerEvent) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      setPressed(true);
      if (!reduced) setBursts((list) => [...list, { id: event.timeStamp, x: event.clientX, y: event.clientY }]);
    }

    function release() {
      setPressed(false);
    }

    // Covers leaving the window and entering the map iframe, where this page stops receiving events.
    function leave(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Element) || event.relatedTarget.tagName === "IFRAME") setShown(false);
    }

    raise();
    const dialogs = new MutationObserver(raise);
    dialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });

    return () => {
      dialogs.disconnect();
      window.clearTimeout(restTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      root.classList.remove("carrot-cursor");
    };
  }, [blink, reduced, x, y]);

  const scale = !shown ? 0 : pressed ? 0.82 : overTarget ? 1.2 : 1;

  return (
    <div
      ref={layer}
      popover="manual"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0"
    >
      {bursts.map((burst) => (
        <span key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
          <Crumbs spread={0.5} onDone={() => setBursts((list) => list.filter((item) => item.id !== burst.id))} />
        </span>
      ))}

      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 480, damping: 20 }}
          style={{ rotate: lean, originX: 0, originY: 0 }}
        >
          <Carrot pose="pointer" happy={overTarget} blink={blink} lookX={lookX} lookY={lookY} sway={sway} className="size-13" />
        </motion.div>
      </motion.div>
    </div>
  );
}
