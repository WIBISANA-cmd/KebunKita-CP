import Image from "next/image";
import type { Settings } from "@/lib/types";

export function Logo({ settings, className = "" }: { settings: Settings; className?: string }) {
  const { logo, storeName } = settings;

  if (logo) {
    return <Image src={logo.src} alt={storeName} width={logo.width} height={logo.height} className={`h-10 w-auto ${className}`} />;
  }

  // Temporary mark until the owner uploads a real logo in Sanity.
  return (
    <span className={`inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight lg:gap-3 lg:text-2xl ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="size-9 lg:size-11" fill="none" stroke="currentColor" strokeWidth="2.4">
        <circle cx="20" cy="20" r="17.5" />
        <path d="M11 28c-1-10 6-17 17-17 1 11-6 18-17 17Z" strokeLinejoin="round" />
        <path d="M9 31c4-7 8-11 13-14" strokeLinecap="round" />
      </svg>
      {storeName}
    </span>
  );
}
