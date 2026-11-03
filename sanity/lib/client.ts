import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// The CDN is off because cached pages are refreshed by the Sanity webhook,
// which must read the document it was just told about.
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

const readToken = process.env.SANITY_API_READ_TOKEN;

export const draftClient = readToken ? client?.withConfig({ token: readToken, perspective: "drafts" }) : undefined;
