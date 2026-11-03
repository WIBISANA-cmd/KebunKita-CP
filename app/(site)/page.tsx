import { ClosingCta } from "@/components/sections/closing-cta";
import { FaqSection } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Location } from "@/components/sections/location";
import { PhotoBand } from "@/components/sections/photo-band";
import { Products } from "@/components/sections/products";
import { Reviews } from "@/components/sections/reviews";
import { Services } from "@/components/sections/services";
import { Steps } from "@/components/sections/steps";
import { getSiteContent } from "@/lib/content";
import { storeJsonLd } from "@/lib/json-ld";
import { directionsUrl } from "@/lib/store-links";

export default async function HomePage() {
  const { settings, home, services, categories, reviews, faqs } = await getSiteContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd(settings)).replace(/</g, "\\u003c") }}
      />
      <Hero hero={home.hero} />
      <Services intro={home.intro} services={services} />
      <PhotoBand band={home.band} />
      <Products products={home.products} categories={categories} directions={directionsUrl(settings)} />
      <Steps steps={home.steps} />
      <Reviews copy={home.reviews} reviews={reviews} settings={settings} />
      <Location copy={home.location} settings={settings} />
      <FaqSection copy={home.faq} faqs={faqs} />
      <ClosingCta cta={home.cta} mapsUrl={settings.mapsUrl} />
    </>
  );
}
