"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_SOFT } from "@/components/motion/reveal";
import { UiIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { PillLink } from "@/components/ui/pill-link";
import { directionsUrl, NAV_ITEMS } from "@/lib/store-links";
import type { Settings } from "@/lib/types";

const SCROLLED_AFTER = 48;

function useActiveSection() {
  const [active, setActive] = useState(NAV_ITEMS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const { id } of NAV_ITEMS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

export function SiteHeader({ settings }: { settings: Settings }) {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > SCROLLED_AFTER));

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow] duration-500 ease-soft ${
        solid ? "bg-forest/95 shadow-[0_10px_30px_rgb(0_40_42/0.25)]" : "bg-transparent"
      }`}
    >
      <div className={`wrap flex items-center justify-between transition-[height] duration-500 ease-soft ${solid ? "h-[4.5rem]" : "h-[5.5rem] lg:h-[6.5rem]"}`}>
        <a href="#beranda" aria-label={`${settings.storeName}, ke atas halaman`} className="min-h-11 content-center">
          <Logo settings={settings} />
        </a>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-12 lg:flex">
          <ul className="flex items-center gap-11">
            {NAV_ITEMS.map(({ href, id, label }) => (
              <li key={id} className="relative">
                <a
                  href={href}
                  aria-current={active === id ? "true" : undefined}
                  className="inline-block py-3 font-medium transition-opacity hover:opacity-75 active:opacity-60"
                >
                  {label}
                </a>
                {active === id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-0 bottom-1.5 h-0.5 rounded-full bg-spark" />
                )}
              </li>
            ))}
          </ul>
          <PillLink href={directionsUrl(settings)} size="sm" showArrow={false}>
            Rute ke Toko
          </PillLink>
        </nav>

        <button
          ref={menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu-seluler"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:bg-white/10 active:bg-white/20 lg:hidden"
        >
          <UiIcon name={menuOpen ? "close" : "menu"} className="size-5" strokeWidth={2} />
          {menuOpen ? "Tutup" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-seluler"
            aria-label="Navigasi seluler"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="wrap flex flex-col gap-1 pb-6 pt-2">
              {NAV_ITEMS.map(({ href, id, label }) => (
                <li key={id}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === id ? "true" : undefined}
                    className={`flex min-h-12 items-center text-lg font-medium ${active === id ? "text-spark" : ""}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="mt-3">
                <PillLink href={directionsUrl(settings)} size="sm" showArrow={false} className="w-full">
                  Rute ke Toko
                </PillLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
