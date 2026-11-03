"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Carrot, Crumbs } from "@/components/ui/carrot";
import { Logo } from "@/components/ui/logo";
import type { Settings } from "@/lib/types";
import { EntranceContext } from "./entrance";
import { usePointerDrift } from "./parallax";
import { useLenis } from "./smooth-scroll";

type Phase = "loading" | "harvest" | "lifting" | "gone";

const FIRST_VISIT_MS = 1400;
const RETURN_VISIT_MS = 400;
const TIMEOUT_MS = 6000;
const HARVEST_MS = 520;
const VISITED_KEY = "kebun-kita-visited";

const CURTAIN_EASE = [0.7, 0, 0.2, 1] as const;

function hasVisited() {
  try {
    return sessionStorage.getItem(VISITED_KEY) !== null;
  } catch {
    return false;
  }
}

function rememberVisit() {
  try {
    sessionStorage.setItem(VISITED_KEY, "1");
  } catch {
    // Storage can be blocked; the visitor just sees the full animation again.
  }
}

/** What the first screen actually depends on, so the percentage reports real loading. */
function firstScreenAssets() {
  const hero = document.querySelector<HTMLImageElement>('img[fetchpriority="high"]');
  const pageLoaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

  return [document.fonts.ready, pageLoaded, hero?.decode() ?? Promise.resolve()];
}

function PreloaderScreen({ settings, onReveal }: { settings: Settings; onReveal: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const pointer = usePointerDrift();
  const pace = useRef({ settled: 0, total: 1, minimum: FIRST_VISIT_MS });

  const goal = useMotionValue(0);
  const progress = useSpring(goal, { stiffness: 120, damping: 22 });
  // The spring can pass its target slightly, so the label is capped separately.
  const percent = useTransform(progress, (value) => `${Math.round(Math.min(value, 1) * 100)}%`);
  const rise = useTransform(progress, [0, 1], ["68%", "16%"]);

  const pull = useMotionValue(0);
  const stretch = useTransform(pull, [-120, 0], [1.14, 1]);
  const lookX = useTransform(pointer.x, [-0.5, 0.5], [-3, 3]);
  const lookY = useTransform(pointer.y, [-0.5, 0.5], [-3, 3]);
  const sway = useTransform(pointer.x, [-0.5, 0.5], [-14, 14]);

  const covering = phase === "loading" || phase === "harvest";
  const harvested = phase !== "loading";
  const lifting = phase === "lifting";

  function harvest() {
    goal.set(1);
    setPhase((current) => (current === "loading" ? "harvest" : current));
  }

  useEffect(() => {
    const assets = firstScreenAssets();
    const current = { settled: 0, total: assets.length, minimum: hasVisited() ? RETURN_VISIT_MS : FIRST_VISIT_MS };
    pace.current = current;

    for (const asset of assets) {
      // `decode()` rejects on a broken image, which must not hold the page back.
      // Counting on `current` keeps Strict Mode's discarded run from adding to the live total.
      asset.catch(() => undefined).finally(() => (current.settled += 1));
    }
  }, []);

  useAnimationFrame((elapsed) => {
    if (phase !== "loading") return;
    const { settled, total, minimum } = pace.current;
    const loaded = elapsed >= TIMEOUT_MS ? 1 : settled / total;
    goal.set(Math.min(loaded, reduced ? 1 : elapsed / minimum));
  });

  useMotionValueEvent(progress, "change", (value) => {
    if (value >= 0.99) harvest();
  });

  useEffect(() => {
    if (!covering) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [lenis, covering]);

  useEffect(() => {
    if (phase === "lifting") onReveal();
    if (phase !== "harvest") return;

    rememberVisit();
    const timer = window.setTimeout(() => setPhase("lifting"), reduced ? 0 : HARVEST_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reduced, onReveal]);

  if (phase === "gone") return null;

  return (
    <motion.div
      id="preloader"
      role="status"
      aria-label="Menyiapkan halaman"
      animate={lifting ? (reduced ? { opacity: 0 } : { y: "-126%" }) : undefined}
      transition={{ duration: reduced ? 0.25 : 1, ease: CURTAIN_EASE }}
      onAnimationComplete={() => {
        if (lifting) setPhase("gone");
      }}
      className="hero-surface fixed inset-0 z-[100] text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div aria-hidden="true" className="wrap flex h-[5.5rem] items-center lg:h-[6.5rem]">
          <Logo settings={settings} />
        </div>

        <svg aria-hidden="true" viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42dvh] w-full">
          <path d="M0 70C260 130 470 40 760 44s480 70 680 10v346H0Z" className="fill-pine" />
        </svg>

        <div className="absolute inset-x-0 bottom-[33dvh] flex justify-center">
          <motion.div style={{ y: rise }}>
            <motion.div
              animate={harvested && !reduced ? { y: "-40%", rotate: [0, -7, 5, 0] } : undefined}
              transition={{ y: { type: "spring", stiffness: 240, damping: 13 }, rotate: { duration: 0.5 } }}
            >
              <motion.button
                type="button"
                aria-label="Lewati layar pembuka"
                onClick={harvest}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.4, bottom: 0.04 }}
                whileHover={{ rotate: 3 }}
                whileTap={{ scaleX: 1.07 }}
                style={{ y: pull, scaleY: stretch, originY: 1 }}
                className="block aspect-[100/170] h-[min(46dvh,22rem)] touch-none rounded-[2rem]"
              >
                <Carrot happy={harvested} lookX={lookX} lookY={lookY} sway={sway} className="size-full" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        <svg aria-hidden="true" viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[34dvh] w-full">
          <path d="M0 110C300 34 520 0 720 0s430 40 720 120v280H0Z" className="fill-lime" />
        </svg>

        {harvested && !reduced && (
          <div className="absolute bottom-[33dvh] left-1/2">
            <Crumbs spread={1.5} />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex h-[28dvh] flex-col items-center justify-center gap-1 px-6 text-center text-forest">
          <p className="text-lg font-semibold sm:text-xl">
            {harvested ? "Siap dipanen" : "Menyiapkan kebun"}{" "}
            <motion.span aria-hidden="true" className="tabular-nums">
              {percent}
            </motion.span>
          </p>
          <p aria-hidden="true" className={`text-sm font-medium transition-opacity duration-300 ${harvested ? "opacity-0" : "opacity-80"}`}>
            Tarik atau ketuk wortelnya untuk langsung masuk
          </p>
        </div>
      </div>

      {/* The lime ground trails the curtain as a wave, so the lift ends on the site's wave motif. */}
      <svg aria-hidden="true" viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute inset-x-0 top-[calc(100%-1px)] h-[22dvh] w-full">
        <path d="M0 0H1440V136C1270 172 1130 219 960 224 760 230 650 188 480 120 330 60 170 40 0 110Z" className="fill-lime" />
      </svg>
    </motion.div>
  );
}

export function Preloader({ settings, children }: { settings: Settings; children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <EntranceContext.Provider value={revealed}>
      <PreloaderScreen settings={settings} onReveal={() => setRevealed(true)} />
      {children}
    </EntranceContext.Provider>
  );
}
