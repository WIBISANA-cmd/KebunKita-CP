import { directionsUrl } from "./store-links";
import type { Settings } from "./types";

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function storeJsonLd(settings: Settings) {
  const { storeName, description, phone, addressLine, locality, region, postalCode, latitude, longitude } = settings;
  const { openingHours, rating, reviewCount, mapsUrl, socials, email } = settings;

  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: storeName,
    description,
    telephone: phone,
    email,
    hasMap: mapsUrl,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: socials.length > 0 ? socials.map(({ url }) => url) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLine,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: "ID",
    },
    geo: { "@type": "GeoCoordinates", latitude, longitude },
    potentialAction: { "@type": "ViewAction", target: directionsUrl(settings) },
    openingHoursSpecification: openingHours
      .filter(({ closed, opens, closes }) => !closed && opens && closes)
      .map(({ day, opens, closes }) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[day],
        opens,
        closes,
      })),
    aggregateRating:
      rating && reviewCount
        ? { "@type": "AggregateRating", ratingValue: rating, reviewCount }
        : undefined,
  };
}
