import { toSiteImage, type SanityImageResult } from "@/sanity/lib/image";
import { fallbackContent } from "./fallback-content";
import type { HomePage, ProductCategory, Settings, SiteContent, SiteImage } from "./types";

type Raw = Record<string, unknown> | null | undefined;

export type SanityContentResult = {
  settings: Raw;
  home: Record<string, Raw> | null;
  services: SiteContent["services"] | null;
  categories: (Omit<ProductCategory, "image"> & { image: SanityImageResult })[] | null;
  reviews: SiteContent["reviews"] | null;
  faqs: SiteContent["faqs"] | null;
};

/** Drops the nulls GROQ returns for unset fields so they cannot overwrite defaults. */
function defined<T extends object>(value: Raw): Partial<T> {
  return Object.fromEntries(Object.entries(value ?? {}).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>;
}

function withImages<T extends object>(base: T, raw: Raw, imageKeys: string[]): T {
  const next: Record<string, unknown> = { ...base, ...defined<T>(raw) };
  for (const key of imageKeys) {
    next[key] = toSiteImage(raw?.[key] as SanityImageResult) ?? (base as Record<string, unknown>)[key];
  }
  return next as T;
}

function mapSettings(raw: Raw): Settings {
  const base = fallbackContent.settings;
  const settings = withImages(base, raw, ["ogImage"]);
  return {
    ...settings,
    logo: toSiteImage(raw?.logo as SanityImageResult),
    openingHours: (raw?.openingHours as Settings["openingHours"]) ?? [],
    socials: (raw?.socials as Settings["socials"]) ?? [],
  };
}

function mapHome(raw: Record<string, Raw> | null): HomePage {
  const base = fallbackContent.home;
  return {
    hero: withImages(base.hero, raw?.hero, ["image"]),
    intro: withImages(base.intro, raw?.intro, ["image"]),
    band: withImages(base.band, raw?.band, ["imageA", "imageB"]),
    products: { ...base.products, ...defined(raw?.products) },
    steps: { ...base.steps, ...defined(raw?.steps) },
    reviews: { ...base.reviews, ...defined(raw?.reviews) },
    location: { ...base.location, ...defined(raw?.location) },
    faq: { ...base.faq, ...defined(raw?.faq) },
    cta: withImages(base.cta, raw?.cta, ["image"]),
  };
}

function mapCategories(raw: SanityContentResult["categories"]): ProductCategory[] {
  const categories = (raw ?? []).flatMap((category) => {
    const image: SiteImage | undefined = toSiteImage(category.image);
    return image ? [{ ...category, image, items: category.items ?? [] }] : [];
  });
  return categories.length > 0 ? categories : fallbackContent.categories;
}

export function mapSanityContent(raw: SanityContentResult): SiteContent {
  // A dataset without the settings document has not been seeded yet.
  if (!raw.settings) return fallbackContent;

  return {
    settings: mapSettings(raw.settings),
    home: mapHome(raw.home),
    services: raw.services?.length ? raw.services : fallbackContent.services,
    categories: mapCategories(raw.categories),
    reviews: raw.reviews ?? [],
    faqs: raw.faqs ?? [],
  };
}
