import type { Metadata } from "next";
import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./studio";

export const metadata: Metadata = {
  title: "Kebun Kita Studio",
  robots: { index: false },
};

export default function StudioPage() {
  if (isSanityConfigured) return <Studio />;

  return (
    <main style={{ fontFamily: "var(--font-jakarta), sans-serif", margin: "15vh auto", maxWidth: 560, padding: 24 }}>
      <h1>Sanity Studio belum terhubung</h1>
      <p style={{ lineHeight: 1.6 }}>
        Isi <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> di file <code>.env.local</code>, lalu jalankan ulang server.
        Langkah lengkapnya ada di <code>README.md</code>.
      </p>
    </main>
  );
}
