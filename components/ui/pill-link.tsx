import type { ReactNode } from "react";
import { UiIcon } from "./icons";

export function PillLink({
  href,
  children,
  size = "md",
  showArrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: "sm" | "md";
  showArrow?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http");
  const sizing =
    size === "sm"
      ? "min-h-11 px-5 text-sm lg:min-h-[3.25rem] lg:px-7 lg:text-base"
      : "min-h-14 px-8 text-base lg:min-h-[4.5rem] lg:px-10 lg:text-lg";

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`lime-button group inline-flex items-center justify-center gap-3 rounded-full font-semibold text-forest transition duration-300 ease-soft hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 ${sizing} ${className}`}
    >
      {children}
      {showArrow && (
        <UiIcon name="arrow" className="size-5 transition-transform duration-300 ease-soft group-hover:translate-x-1" strokeWidth={2} />
      )}
    </a>
  );
}
