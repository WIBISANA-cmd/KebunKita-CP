"use client";

import { motion } from "motion/react";
import type { IconName, SocialPlatform } from "@/lib/types";

const ICONS: Record<IconName, string[]> = {
  leaf: ["M5 19C4 10 10 4 20 4c1 10-5 16-14 16", "M4 21c2-6 6-10 11-12"],
  carrot: [
    "M13.5 7.5c2-1 3.7-.7 4.7.3s1.3 2.7.3 4.7c-1.7 3-8.2 7.5-13 9-.6.2-1.1-.3-.9-.9 1.5-4.8 6-11.3 8.9-13.1Z",
    "M16.5 7.5c0-2 .6-3.7 1.8-5",
    "M16.5 7.5c2 0 3.7-.6 5-1.8",
    "M10.5 11.5l2 2",
    "M8 15l1.5 1.5",
  ],
  sack: [
    "M9 3h6l-1.5 3.5c3.2 1.5 5.5 5 5.5 8.5 0 4-2.5 6-7 6s-7-2-7-6c0-3.5 2.3-7 5.5-8.5L9 3Z",
    "M10.5 6.5h3",
    "M9.5 14h5",
  ],
  spice: ["M4 11h16c0 5-3 8-8 8s-8-3-8-8Z", "M13 11l6-7", "M8 21h8"],
  pin: ["M12 21s7-6 7-11.5a7 7 0 0 0-14 0C5 15 12 21 12 21Z", "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  basket: [
    "M4 10h16l-1.6 9a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6L4 10Z",
    "M8 10l3-6",
    "M16 10l-3-6",
    "M10 14v3",
    "M14 14v3",
  ],
  pot: [
    "M5 10h14v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7Z",
    "M3 10h18",
    "M9 10V8.5a3 3 0 0 1 6 0V10",
    "M9 4c0-1 1-1 1-2",
    "M14 4c0-1 1-1 1-2",
  ],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3.5 2"],
  truck: [
    "M2 6h12v11H2V6Z",
    "M14 10h4l4 4v3h-8v-7Z",
    "M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  bag: ["M6 8h12l1 13H5L6 8Z", "M9 8V6a3 3 0 0 1 6 0v2"],
};

const UI_ICONS = {
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  copy: ["M9 9h11v11H9V9Z", "M5 15H4V4h11v1"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  phone: ["M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3C10 21 3 14 3 6a3 3 0 0 1 3-3Z"],
  mail: ["M3 6h18v12H3V6Z", "M3 7l9 7 9-7"],
  star: ["M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.3L12 17l-5.6 3.2 1.2-6.3L3 9.6l6.3-.8L12 3Z"],
  whatsapp: [
    "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z",
    "M9 8.5c-.8.8-.5 2.5 1.2 4.3s3.5 2 4.3 1.2l.5-1-2-1-.7.7c-.8-.3-1.7-1.2-2-2l.7-.7-1-2-1 .5Z",
  ],
} satisfies Record<string, string[]>;

const SOCIAL_ICONS: Record<SocialPlatform, string[]> = {
  instagram: [
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z",
    "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M17.5 6.5h.01",
  ],
  facebook: ["M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"],
  tiktok: ["M14 3v12.5a3.5 3.5 0 1 1-3.5-3.5", "M14 3c.3 3 2.2 5 5 5.3"],
  youtube: ["M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z", "M10 9.5v5l4.5-2.5-4.5-2.5Z"],
  whatsapp: UI_ICONS.whatsapp,
};

type IconProps = { className?: string; strokeWidth?: number };

function Glyph({ paths, className = "size-6", strokeWidth = 1.6 }: IconProps & { paths: string[] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  return <Glyph paths={ICONS[name]} {...props} />;
}

export function UiIcon({ name, ...props }: IconProps & { name: keyof typeof UI_ICONS }) {
  return <Glyph paths={UI_ICONS[name]} {...props} />;
}

export function SocialIcon({ platform, ...props }: IconProps & { platform: SocialPlatform }) {
  return <Glyph paths={SOCIAL_ICONS[platform]} {...props} />;
}

/** Draws the outline on scroll so the icon arrives with its section. */
export function DrawnIcon({ name, className = "size-12", delay = 0 }: { name: IconName; className?: string; delay?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONS[name].map((d, index) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: delay + index * 0.12, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
