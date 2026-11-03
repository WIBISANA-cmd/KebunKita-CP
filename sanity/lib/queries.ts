import { defineQuery } from "next-sanity";

const IMAGE = `{ alt, crop, hotspot, asset { _ref, "metadata": @->metadata { lqip, dimensions { width, height } } } }`;

export const siteContentQuery = defineQuery(`{
  "settings": *[_id == "siteSettings"][0] {
    storeName, tagline, description, "logo": logo ${IMAGE},
    phone, whatsapp, email,
    addressLine, addressNote, locality, region, postalCode, latitude, longitude, mapsUrl,
    openingHours[] { day, closed, opens, closes }, hoursNote,
    rating, reviewCount,
    socials[] { platform, url },
    seoTitle, seoDescription, "ogImage": ogImage ${IMAGE}
  },
  "home": *[_id == "homePage"][0] {
    hero { heading, subheading, ctaLabel, "image": image ${IMAGE} },
    intro { heading, subheading, "image": image ${IMAGE} },
    band { heading, body, ctaLabel, "imageA": imageA ${IMAGE}, "imageB": imageB ${IMAGE} },
    products { heading, subheading },
    steps { heading, subheading, items[] { title, body, icon } },
    reviews { heading, subheading },
    location { heading, subheading },
    faq { heading, subheading },
    cta { heading, body, ctaLabel, "image": image ${IMAGE} }
  },
  "services": *[_type == "service"] | order(order asc) { "id": _id, title, summary, icon, target },
  "categories": *[_type == "productCategory"] | order(order asc) {
    "id": _id, title, summary, "image": image ${IMAGE}, items[] { name, note }, note
  },
  "reviews": *[_type == "review"] | order(order asc) { "id": _id, author, text, rating, url },
  "faqs": *[_type == "faq"] | order(order asc) { "id": _id, question, answer }
}`);
