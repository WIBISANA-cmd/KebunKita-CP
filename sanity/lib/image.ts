import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { SiteImage } from "@/lib/types";

const builder = createImageUrlBuilder({ projectId, dataset });

const MAX_WIDTH = 2000;

export type SanityImageResult = {
  alt?: string | null;
  asset?: {
    _ref?: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } } | null;
  } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};

export function toSiteImage(image: SanityImageResult | null | undefined): SiteImage | undefined {
  const dimensions = image?.asset?.metadata?.dimensions;
  if (!image?.asset?._ref || !dimensions) return undefined;

  const width = Math.min(dimensions.width, MAX_WIDTH);
  const source = {
    asset: { _ref: image.asset._ref },
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };

  return {
    src: builder.image(source).width(width).auto("format").url(),
    alt: image.alt ?? "",
    width,
    height: Math.round((width * dimensions.height) / dimensions.width),
    position: image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : undefined,
    blurDataURL: image.asset.metadata?.lqip,
  };
}
