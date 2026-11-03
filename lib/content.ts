import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { client, draftClient } from "@/sanity/lib/client";
import { siteContentQuery } from "@/sanity/lib/queries";
import { fallbackContent } from "./fallback-content";
import { mapSanityContent, type SanityContentResult } from "./map-sanity-content";
import type { SiteContent } from "./types";

export const CONTENT_CACHE_TAG = "sanity-content";

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_CACHE_TAG);

  const { isEnabled: isDraft } = await draftMode();
  const source = (isDraft && draftClient) || client;

  if (!source) {
    cacheLife("max");
    return fallbackContent;
  }

  try {
    const result = await source.fetch<SanityContentResult>(siteContentQuery);
    cacheLife("max");
    return mapSanityContent(result);
  } catch (error) {
    // A short lifetime lets the site recover by itself once Sanity is reachable again.
    console.error("Gagal mengambil konten Sanity, memakai konten bawaan.", error);
    cacheLife("minutes");
    return fallbackContent;
  }
}
