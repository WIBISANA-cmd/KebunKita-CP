# Kebun Kita

Company profile website for Kebun Kita, a vegetable and grocery store in Ngaglik, Sleman, Indonesia. The site text is in Indonesian, and the content is managed in Sanity.

## Tech stack

- [Next.js 16](https://nextjs.org) with the App Router, React 19, and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- [Sanity](https://www.sanity.io) as the CMS, with the Studio embedded at `/studio`
- [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering) for animation and smooth scrolling

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sanity is optional for local work: without a project ID, the site uses the built-in content from `lib/fallback-content.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Fill Sanity with the initial content |

## Environment variables

Copy `.env.example` to `.env.local`, then fill in what you need. All of them are optional for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID. Leave empty to use the built-in content |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, `production` by default |
| `SANITY_API_READ_TOKEN` | Viewer token for draft previews |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the Sanity webhook |
| `NEXT_PUBLIC_SITE_URL` | Production domain, used for metadata, the sitemap, and structured data |

## Connecting Sanity

1. Create a project at https://www.sanity.io/manage and copy its project ID.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
3. Log in and add the initial content:

   ```bash
   npx sanity login
   npm run seed
   ```

4. In the API tab of your Sanity project, add `http://localhost:3000` and your production domain as CORS origins, with **Allow credentials** turned on.
5. Open http://localhost:3000/studio.

### Managing content

The Studio menus are in Indonesian:

| Menu | What it manages |
| --- | --- |
| Pengaturan Toko | Store name, logo, contact details, address, coordinates, opening hours, rating, social media, SEO |
| Halaman Beranda | Headings, text, buttons, and photos for each section |
| Layanan | Service cards and their link targets |
| Kategori Produk | Product categories, photos, item lists, and notes |
| Ulasan Pelanggan | Customer reviews |
| Pertanyaan Umum | Frequently asked questions |

Sections with no content are hidden from the site. The Presentation tab previews drafts before they are published, which requires `SANITY_API_READ_TOKEN`.

### Updating the site after publishing

Content is cached with no expiry, so Sanity has to tell the site when something changes. In your Sanity project, go to API > Webhooks and create a webhook:

- **URL:** `https://your-domain/api/revalidate`
- **Dataset:** `production`
- **Trigger:** Create, Update, Delete
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

## Deployment

The site ships as a Docker image built from `Dockerfile` (Next.js standalone output, port 3000, health check at `/api/health`). See [DEPLOYMENT.md](DEPLOYMENT.md) for the full VPS setup with Dokploy, plus a plain Docker Compose option.

`NEXT_PUBLIC_*` variables are inlined at build time, so pass them as build arguments and rebuild after changing them.

## Project structure

```text
app/(site)/       Website pages and layout
app/studio/       Embedded Sanity Studio
app/api/          Revalidation webhook and draft mode
components/       layout, motion, sections, and ui components
lib/              Types, built-in content, data fetching, opening hours
sanity/           Schemas, queries, and client
scripts/seed.ts   Initial content for Sanity
public/images/    Stock photos, with sources in CREDITS.md
DESIGN.md         Design direction and the reasons behind it
```

## Preloader and carrot cursor

Both are added in `app/(site)/layout.tsx`, so they do not appear in the Studio.

- **Preloader** (`components/motion/preloader.tsx`): the percentage follows the fonts, the hero image, and the page load, with a 6-second limit. Visitors can skip it by pulling or tapping the carrot. Return visits in the same browser tab session are shorter.
- **Carrot cursor** (`components/motion/carrot-cursor.tsx`): appears on devices with a mouse only. Touch devices keep their normal behavior.

Decorative motion follows the visitor's `prefers-reduced-motion` setting.

## Before launch

The store data below is still missing, and none of it should be guessed. Only the store name, coordinates, and Google Maps link are verified so far.

- [ ] Connect the Sanity project and set up the webhook
- [ ] Add the full address, phone or WhatsApp number, and opening hours
- [ ] Add the rating and review count from Google Maps
- [ ] Upload the real logo, which replaces the temporary leaf mark
- [ ] Replace the stock photos with real photos of the store
- [ ] Update the product lists to match real stock, then remove the sample notes
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain
