import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { fallbackContent } from "../lib/fallback-content";
import type { SiteImage } from "../lib/types";

const client = getCliClient({ apiVersion: "2026-10-01" });

async function uploadImage(image: SiteImage) {
  const file = path.join(process.cwd(), "public", image.src);
  const asset = await client.assets.upload("image", createReadStream(file), {
    filename: path.basename(file),
  });
  return { _type: "imageWithAlt", alt: image.alt, asset: { _type: "reference", _ref: asset._id } };
}

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, index) => ({ ...item, _key: `${prefix}${index}` }));

async function seed() {
  const { settings, home, services, categories } = fallbackContent;
  const transaction = client.transaction();

  transaction.createOrReplace({
    ...settings,
    _id: "siteSettings",
    _type: "siteSettings",
    ogImage: settings.ogImage ? await uploadImage(settings.ogImage) : undefined,
    openingHours: [],
    socials: [],
  });

  transaction.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    hero: { ...home.hero, image: await uploadImage(home.hero.image) },
    intro: { ...home.intro, image: await uploadImage(home.intro.image) },
    band: {
      ...home.band,
      imageA: await uploadImage(home.band.imageA),
      imageB: await uploadImage(home.band.imageB),
    },
    products: home.products,
    steps: { ...home.steps, items: withKeys(home.steps.items, "step") },
    reviews: home.reviews,
    location: home.location,
    faq: home.faq,
    cta: { ...home.cta, image: await uploadImage(home.cta.image) },
  });

  for (const [index, { id, ...service }] of services.entries()) {
    transaction.createOrReplace({ ...service, _id: `service-${id}`, _type: "service", order: (index + 1) * 10 });
  }

  for (const [index, { id, image, items, ...category }] of categories.entries()) {
    transaction.createOrReplace({
      ...category,
      _id: `category-${id}`,
      _type: "productCategory",
      image: await uploadImage(image),
      items: withKeys(items, "item"),
      order: (index + 1) * 10,
    });
  }

  await transaction.commit();
  console.log("Konten awal berhasil dimasukkan ke Sanity.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
