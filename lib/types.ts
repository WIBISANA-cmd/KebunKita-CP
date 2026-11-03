export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  blurDataURL?: string;
};

export type IconName =
  | "leaf"
  | "carrot"
  | "sack"
  | "spice"
  | "pin"
  | "basket"
  | "pot"
  | "clock"
  | "truck"
  | "bag";

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "youtube" | "whatsapp";

export type SocialLink = { platform: SocialPlatform; url: string };

/** Day follows `Date.getDay()`: 0 is Sunday. */
export type OpeningHours = {
  day: number;
  closed?: boolean;
  opens?: string;
  closes?: string;
};

export type Settings = {
  storeName: string;
  tagline: string;
  description: string;
  logo?: SiteImage;
  phone?: string;
  whatsapp?: string;
  email?: string;
  addressLine: string;
  addressNote?: string;
  locality: string;
  region: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  mapsUrl: string;
  openingHours: OpeningHours[];
  hoursNote?: string;
  rating?: number;
  reviewCount?: number;
  socials: SocialLink[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: SiteImage;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  icon: IconName;
  target: "produk" | "cara-belanja" | "lokasi";
};

export type ProductItem = { name: string; note?: string };

export type ProductCategory = {
  id: string;
  title: string;
  summary: string;
  image: SiteImage;
  items: ProductItem[];
  note?: string;
};

export type Step = { title: string; body: string; icon: IconName };

export type Review = {
  id: string;
  author: string;
  text: string;
  rating?: number;
  url?: string;
};

export type Faq = { id: string; question: string; answer: string };

export type HomePage = {
  hero: { heading: string; subheading: string; ctaLabel: string; image: SiteImage };
  intro: { heading: string; subheading: string; image: SiteImage };
  band: { heading: string; body: string; ctaLabel: string; imageA: SiteImage; imageB: SiteImage };
  products: { heading: string; subheading: string };
  steps: { heading: string; subheading: string; items: Step[] };
  reviews: { heading: string; subheading: string };
  location: { heading: string; subheading: string };
  faq: { heading: string; subheading: string };
  cta: { heading: string; body: string; ctaLabel: string; image: SiteImage };
};

export type SiteContent = {
  settings: Settings;
  home: HomePage;
  services: Service[];
  categories: ProductCategory[];
  reviews: Review[];
  faqs: Faq[];
};
