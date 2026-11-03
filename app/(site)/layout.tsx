import type { Metadata } from "next";
import { Suspense } from "react";
import { DraftTools } from "@/components/layout/draft-tools";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CarrotCursor } from "@/components/motion/carrot-cursor";
import { Preloader } from "@/components/motion/preloader";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getSiteContent } from "@/lib/content";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  const { seoTitle, seoDescription, ogImage } = settings;

  return {
    metadataBase: new URL(siteUrl),
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      locale: "id_ID",
      type: "website",
      images: ogImage ? [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteContent();

  return (
    <SmoothScroll>
      <Preloader settings={settings}>
        <a
          href="#isi"
          className="fixed left-4 top-[-4rem] z-50 rounded-full bg-spark px-5 py-3 font-semibold text-forest focus:top-4"
        >
          Lompat ke isi
        </a>
        <SiteHeader settings={settings} />
        <main id="isi" className="overflow-x-clip">
          {children}
        </main>
        <SiteFooter settings={settings} />
        <Suspense fallback={null}>
          <DraftTools />
        </Suspense>
      </Preloader>
      <CarrotCursor />
    </SmoothScroll>
  );
}
