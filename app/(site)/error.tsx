"use client";

export default function SiteError({ reset }: { reset: () => void }) {
  return (
    <section className="wrap grid min-h-[70dvh] content-center justify-items-start gap-4 pt-28">
      <h1 className="section-heading text-forest">Halaman gagal dimuat</h1>
      <p className="text-lg text-slate">Terjadi gangguan saat menampilkan halaman ini. Coba muat ulang sebentar lagi.</p>
      <button
        type="button"
        onClick={reset}
        className="lime-button min-h-12 rounded-full px-7 font-semibold text-forest transition hover:brightness-110 active:brightness-95"
      >
        Muat Ulang
      </button>
    </section>
  );
}
