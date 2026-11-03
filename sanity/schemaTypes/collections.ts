import { defineField, defineType } from "sanity";
import { ICON_OPTIONS } from "./objects";

const orderField = defineField({
  name: "order",
  title: "Urutan",
  type: "number",
  description: "Angka kecil tampil lebih dulu.",
  initialValue: 10,
});

const orderings = [
  { title: "Urutan tampil", name: "orderAsc", by: [{ field: "order", direction: "asc" as const }] },
];

export const service = defineType({
  name: "service",
  title: "Layanan",
  type: "document",
  orderings,
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "text",
      rows: 2,
      description: "Tekan Enter untuk memulai baris baru.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      options: { list: ICON_OPTIONS },
      initialValue: "leaf",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "target",
      title: "Tombol panah menuju",
      type: "string",
      options: {
        list: [
          { title: "Bagian Produk", value: "produk" },
          { title: "Bagian Cara Belanja", value: "cara-belanja" },
          { title: "Bagian Lokasi", value: "lokasi" },
        ],
      },
      initialValue: "produk",
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});

export const productCategory = defineType({
  name: "productCategory",
  title: "Kategori Produk",
  type: "document",
  orderings,
  fields: [
    defineField({ name: "title", title: "Nama kategori", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "summary",
      title: "Ringkasan",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({ name: "image", title: "Foto", type: "imageWithAlt", validation: (rule) => rule.required() }),
    defineField({
      name: "items",
      title: "Daftar barang",
      type: "array",
      of: [{ type: "productItem" }],
      description: "Tampil saat pengunjung membuka kategori.",
    }),
    defineField({
      name: "note",
      title: "Catatan daftar",
      type: "string",
      description: "Hapus catatan contoh setelah daftar barang sesuai stok toko.",
    }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});

export const review = defineType({
  name: "review",
  title: "Ulasan Pelanggan",
  type: "document",
  description: "Hanya untuk ulasan asli, misalnya yang disalin dari Google Maps.",
  orderings,
  fields: [
    defineField({ name: "author", title: "Nama pengulas", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "text", title: "Isi ulasan", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({
      name: "rating",
      title: "Bintang",
      type: "number",
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({ name: "url", title: "Tautan ulasan", type: "url" }),
    orderField,
  ],
  preview: { select: { title: "author", subtitle: "text" } },
});

export const faq = defineType({
  name: "faq",
  title: "Pertanyaan Umum",
  type: "document",
  orderings,
  fields: [
    defineField({ name: "question", title: "Pertanyaan", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", title: "Jawaban", type: "text", rows: 4, validation: (rule) => rule.required() }),
    orderField,
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});
