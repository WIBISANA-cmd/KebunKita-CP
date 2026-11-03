import { defineField, defineType } from "sanity";

const HEADING_HELP = "Tekan Enter untuk memulai baris baru pada judul.";

const headingField = (name = "heading") =>
  defineField({
    name,
    title: "Judul",
    type: "text",
    rows: 2,
    description: HEADING_HELP,
    validation: (rule) => rule.required(),
  });

const subheadingField = defineField({
  name: "subheading",
  title: "Subjudul",
  type: "text",
  rows: 2,
});

const ctaField = defineField({
  name: "ctaLabel",
  title: "Teks tombol",
  type: "string",
  validation: (rule) => rule.required(),
});

const imageField = (name: string, title: string) =>
  defineField({ name, title, type: "imageWithAlt", validation: (rule) => rule.required() });

export const homePage = defineType({
  name: "homePage",
  title: "Halaman Beranda",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Layanan" },
    { name: "band", title: "Banner Foto" },
    { name: "products", title: "Produk" },
    { name: "steps", title: "Cara Belanja" },
    { name: "reviews", title: "Ulasan" },
    { name: "location", title: "Lokasi" },
    { name: "faq", title: "Pertanyaan" },
    { name: "cta", title: "Ajakan Akhir" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      options: { collapsible: false },
      fields: [headingField(), subheadingField, ctaField, imageField("image", "Foto kapsul")],
    }),
    defineField({
      name: "intro",
      title: "Layanan",
      type: "object",
      group: "intro",
      options: { collapsible: false },
      description: "Kartu layanan diatur di menu Layanan.",
      fields: [headingField(), subheadingField, imageField("image", "Foto kapsul")],
    }),
    defineField({
      name: "band",
      title: "Banner Foto",
      type: "object",
      group: "band",
      options: { collapsible: false },
      fields: [
        headingField(),
        defineField({ name: "body", title: "Isi", type: "text", rows: 3 }),
        ctaField,
        imageField("imageA", "Foto kapsul kiri"),
        imageField("imageB", "Foto kapsul kanan"),
      ],
    }),
    defineField({
      name: "products",
      title: "Produk",
      type: "object",
      group: "products",
      options: { collapsible: false },
      description: "Kategori dan daftar barang diatur di menu Kategori Produk.",
      fields: [headingField(), subheadingField],
    }),
    defineField({
      name: "steps",
      title: "Cara Belanja",
      type: "object",
      group: "steps",
      options: { collapsible: false },
      fields: [
        headingField(),
        subheadingField,
        defineField({
          name: "items",
          title: "Langkah",
          type: "array",
          of: [{ type: "step" }],
          validation: (rule) => rule.min(1).max(6),
        }),
      ],
    }),
    defineField({
      name: "reviews",
      title: "Ulasan",
      type: "object",
      group: "reviews",
      options: { collapsible: false },
      description: "Bagian ini tampil setelah ada ulasan asli di menu Ulasan Pelanggan.",
      fields: [headingField(), subheadingField],
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "object",
      group: "location",
      options: { collapsible: false },
      description: "Alamat dan jam buka diambil dari Pengaturan Toko.",
      fields: [headingField(), subheadingField],
    }),
    defineField({
      name: "faq",
      title: "Pertanyaan",
      type: "object",
      group: "faq",
      options: { collapsible: false },
      description: "Bagian ini tampil setelah ada isi di menu Pertanyaan Umum.",
      fields: [headingField(), subheadingField],
    }),
    defineField({
      name: "cta",
      title: "Ajakan Akhir",
      type: "object",
      group: "cta",
      options: { collapsible: false },
      fields: [
        headingField(),
        defineField({ name: "body", title: "Isi", type: "text", rows: 2 }),
        ctaField,
        imageField("image", "Foto"),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Halaman Beranda" }) },
});
