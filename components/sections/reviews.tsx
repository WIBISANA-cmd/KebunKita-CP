"use client";

import { Reveal } from "@/components/motion/reveal";
import { UiIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePage, Review, Settings } from "@/lib/types";

function RatingSummary({ settings }: { settings: Settings }) {
  const { rating, reviewCount, mapsUrl } = settings;
  if (!rating) return null;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-mint px-5 font-semibold text-forest transition-colors hover:bg-lime active:bg-spark"
    >
      <UiIcon name="star" className="size-5 fill-current" />
      {rating.toLocaleString("id-ID")}
      {reviewCount ? ` dari ${reviewCount.toLocaleString("id-ID")} ulasan di Google Maps` : " di Google Maps"}
    </a>
  );
}

export function Reviews({
  copy,
  reviews,
  settings,
}: {
  copy: HomePage["reviews"];
  reviews: Review[];
  settings: Settings;
}) {
  if (reviews.length === 0 && !settings.rating) return null;

  return (
    <section aria-label={copy.heading} className="pb-24 pt-6">
      <div className="wrap">
        <SectionHeading heading={copy.heading} subheading={copy.subheading} />
        <RatingSummary settings={settings} />

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li key={review.id}>
              <Reveal delay={index * 0.1} className="h-full">
                <figure className="flex h-full flex-col rounded-[2.5rem] bg-mint p-8">
                  {review.rating && (
                    <p className="flex gap-0.5 text-pine" aria-label={`${review.rating} dari 5 bintang`}>
                      {Array.from({ length: review.rating }, (_, star) => (
                        <UiIcon key={star} name="star" className="size-4 fill-current" />
                      ))}
                    </p>
                  )}
                  <blockquote className="mt-3 flex-1 leading-relaxed">{review.text}</blockquote>
                  <figcaption className="mt-4 font-semibold">
                    {review.url ? (
                      <a href={review.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        {review.author}
                      </a>
                    ) : (
                      review.author
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
