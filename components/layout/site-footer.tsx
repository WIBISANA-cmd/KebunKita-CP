import { SocialIcon, UiIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { NAV_ITEMS, whatsappUrl } from "@/lib/store-links";
import type { Settings, SocialPlatform } from "@/lib/types";

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

const CIRCLE_LINK =
  "grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/25 active:bg-white/35";

export function SiteFooter({ settings }: { settings: Settings }) {
  const { tagline, whatsapp, mapsUrl, socials } = settings;

  return (
    <footer className="relative -mt-px">
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-16 w-full md:h-24">
        <path d="M0 62C210 8 420 6 640 52s500 62 800-20v88H0Z" fill="#003a3c" />
      </svg>
      <div className="-mt-px bg-forest pb-10 pt-6 text-white">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo settings={settings} />
            <p className="mt-2 text-sm text-white/80">{tagline}</p>
          </div>

          <nav aria-label="Navigasi footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-1">
              {NAV_ITEMS.map(({ href, id, label }) => (
                <li key={id}>
                  <a href={href} className="inline-block py-3 font-medium transition-opacity hover:opacity-75 active:opacity-60">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex gap-3">
            {whatsapp && (
              <li>
                <a href={whatsappUrl(whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={CIRCLE_LINK}>
                  <UiIcon name="whatsapp" className="size-5" />
                </a>
              </li>
            )}
            {socials.map(({ platform, url }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[platform]} className={CIRCLE_LINK}>
                  <SocialIcon platform={platform} className="size-5" />
                </a>
              </li>
            ))}
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Maps" className={CIRCLE_LINK}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="size-5">
                  <path d="M12 21s7-6 7-11.5a7 7 0 0 0-14 0C5 15 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
