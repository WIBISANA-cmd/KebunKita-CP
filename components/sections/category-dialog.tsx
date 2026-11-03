"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EASE_SOFT } from "@/components/motion/reveal";
import { useLenis } from "@/components/motion/smooth-scroll";
import { UiIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import type { ProductCategory } from "@/lib/types";

export function CategoryDialog({
  category,
  directions,
  onClose,
}: {
  category: ProductCategory | null;
  directions: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const [shown, setShown] = useState(category);

  // The last category stays rendered so the native close does not flash an empty dialog.
  if (category && category !== shown) setShown(category);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (category && !element.open) {
      element.showModal();
      lenis?.stop();
    } else if (!category && element.open) {
      element.close();
    }
  }, [category, lenis]);

  function handleClose() {
    lenis?.start();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      aria-labelledby="kategori-judul"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
      className="m-auto max-h-[88dvh] w-[min(100%-2rem,44rem)] overflow-y-auto rounded-[2.5rem] bg-white p-0 text-forest shadow-[0_40px_100px_rgb(0_30_32/0.45)]"
    >
      {shown && (
        <motion.div
          key={shown.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_SOFT }}
        >
          <div className="relative h-44 sm:h-56">
            <Image
              src={shown.image.src}
              alt={shown.image.alt}
              fill
              sizes="(min-width: 768px) 44rem, 100vw"
              className="object-cover"
              style={{ objectPosition: shown.image.position }}
            />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Tutup daftar produk"
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white text-forest transition hover:bg-spark active:scale-95"
            >
              <UiIcon name="close" className="size-5" strokeWidth={2} />
            </button>
          </div>

          <div className="p-7 sm:p-10">
            <h3 id="kategori-judul" className="text-3xl font-semibold tracking-tight">
              {shown.title}
            </h3>
            <p className="mt-2 text-slate">{shown.summary}</p>

            {shown.items.length > 0 ? (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {shown.items.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.04, ease: EASE_SOFT }}
                    className="rounded-2xl bg-mint px-4 py-3"
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.note && <span className="block text-sm text-slate">{item.note}</span>}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl bg-mint px-4 py-3">
                Daftar barang untuk kategori ini belum diisi. Silakan tanyakan langsung di toko.
              </p>
            )}

            {shown.note && <p className="mt-4 text-sm leading-relaxed text-slate">{shown.note}</p>}

            <PillLink href={directions} size="sm" className="mt-6">
              Rute ke Toko
            </PillLink>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}
