"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { UiIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePage, ProductCategory } from "@/lib/types";
import { CategoryDialog } from "./category-dialog";

function CategoryCard({
  category,
  index,
  onOpen,
}: {
  category: ProductCategory;
  index: number;
  onOpen: (category: ProductCategory) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], reduced ? [1, 1] : [1.22, 1]);

  return (
    <Reveal delay={index * 0.12}>
      <button type="button" onClick={() => onOpen(category)} aria-haspopup="dialog" className="group block w-full rounded-[3rem] text-left">
        <div ref={frame} className="relative aspect-[418/350] overflow-hidden rounded-[3rem] transition-transform duration-500 ease-soft group-hover:-translate-y-1.5 lg:rounded-[3.75rem]">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image
              src={category.image.src}
              alt={category.image.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
              style={{ objectPosition: category.image.position }}
            />
          </motion.div>
        </div>
        <span className="mt-5 flex items-center justify-between gap-4 px-3 lg:px-5">
          <span>
            <span className="block text-xl font-semibold text-forest lg:text-2xl">{category.title}</span>
            <span className="body-copy mt-1 block text-slate">{category.summary}</span>
          </span>
          <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-pine/40 text-pine transition duration-300 ease-soft group-hover:border-pine group-hover:bg-pine group-hover:text-white group-active:scale-95">
            <UiIcon name="arrow" className="size-5" strokeWidth={2} />
          </span>
        </span>
      </button>
    </Reveal>
  );
}

export function Products({
  products,
  categories,
  directions,
}: {
  products: HomePage["products"];
  categories: ProductCategory[];
  directions: string;
}) {
  const [selected, setSelected] = useState<ProductCategory | null>(null);

  return (
    <section id="produk" className="pb-16 pt-20 lg:pb-20 lg:pt-24">
      <div className="wrap">
        <SectionHeading heading={products.heading} subheading={products.subheading} />
      </div>

      {categories.length > 0 ? (
        <div className="wrap-wide mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} onOpen={setSelected} />
          ))}
        </div>
      ) : (
        <p className="wrap mt-10 text-lg text-slate">
          Daftar produk belum tersedia.{" "}
          <a href={directions} target="_blank" rel="noopener noreferrer" className="font-semibold text-pine underline">
            Datang langsung ke toko
          </a>{" "}
          untuk melihat barang yang ada.
        </p>
      )}

      <CategoryDialog category={selected} directions={directions} onClose={() => setSelected(null)} />
    </section>
  );
}
