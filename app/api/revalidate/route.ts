import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_CACHE_TAG } from "@/lib/content";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET belum diisi" }, { status: 500 });
  }

  const { isValidSignature } = await parseBody(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Tanda tangan webhook tidak valid" }, { status: 401 });
  }

  revalidateTag(CONTENT_CACHE_TAG, "max");
  return NextResponse.json({ revalidated: true });
}
