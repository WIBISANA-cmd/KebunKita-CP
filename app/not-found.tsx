import Link from "next/link";
import { CarrotCursor } from "@/components/motion/carrot-cursor";
import "./globals.css";

export default function NotFound() {
  return (
    <main className="wrap grid min-h-dvh content-center justify-items-start gap-4">
      <h1 className="section-heading text-forest">Halaman tidak ditemukan</h1>
      <p className="text-lg text-slate">Alamat ini tidak ada di website Kebun Kita.</p>
      <Link
        href="/"
        className="lime-button inline-flex min-h-12 items-center rounded-full px-7 font-semibold text-forest transition hover:brightness-110 active:brightness-95"
      >
        Kembali ke Beranda
      </Link>
      <CarrotCursor />
    </main>
  );
}
