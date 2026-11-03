import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { draftClient } from "@/sanity/lib/client";

const unavailable = async () => new Response("Pratinjau draf butuh SANITY_API_READ_TOKEN", { status: 404 });

export const GET = draftClient ? defineEnableDraftMode({ client: draftClient }).GET : unavailable;
