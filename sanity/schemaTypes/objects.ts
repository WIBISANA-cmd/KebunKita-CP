import { defineField, defineType } from "sanity";

export const ICON_OPTIONS = [
  { title: "Daun", value: "leaf" },
  { title: "Wortel", value: "carrot" },
  { title: "Karung sembako", value: "sack" },
  { title: "Bumbu", value: "spice" },
  { title: "Penanda lokasi", value: "pin" },
  { title: "Keranjang", value: "basket" },
  { title: "Panci", value: "pot" },
  { title: "Jam", value: "clock" },
  { title: "Antar", value: "truck" },
  { title: "Tas belanja", value: "bag" },
];

export const DAY_OPTIONS = [
  { title: "Senin", value: 1 },
  { title: "Selasa", value: 2 },
  { title: "Rabu", value: 3 },
  { title: "Kamis", value: 4 },
  { title: "Jumat", value: 5 },
  { title: "Sabtu", value: 6 },
  { title: "Minggu", value: 0 },
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Gambar",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Teks alternatif",
      type: "string",
      description: "Jelaskan isi foto untuk pembaca layar dan mesin pencari.",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const openingHours = defineType({
  name: "openingHours",
  title: "Jam buka",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Hari",
      type: "number",
      options: { list: DAY_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "closed", title: "Tutup hari ini", type: "boolean", initialValue: false }),
    defineField({
      name: "opens",
      title: "Buka",
      type: "string",
      description: "Format 24 jam, contoh 07:00.",
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (rule) => rule.regex(TIME_PATTERN, { name: "jam" }),
    }),
    defineField({
      name: "closes",
      title: "Tutup",
      type: "string",
      description: "Format 24 jam, contoh 17:00.",
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (rule) => rule.regex(TIME_PATTERN, { name: "jam" }),
    }),
  ],
  preview: {
    select: { day: "day", closed: "closed", opens: "opens", closes: "closes" },
    prepare: ({ day, closed, opens, closes }) => ({
      title: DAY_OPTIONS.find((option) => option.value === day)?.title ?? "Pilih hari",
      subtitle: closed ? "Tutup" : `${opens ?? "?"} sampai ${closes ?? "?"}`,
    }),
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Media sosial",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "TikTok", value: "tiktok" },
          { title: "YouTube", value: "youtube" },
          { title: "WhatsApp", value: "whatsapp" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Tautan",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

export const step = defineType({
  name: "step",
  title: "Langkah",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Judul", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Keterangan", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      options: { list: ICON_OPTIONS },
      initialValue: "basket",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});

export const productItem = defineType({
  name: "productItem",
  title: "Barang",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Nama barang", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "note",
      title: "Catatan",
      type: "string",
      description: "Opsional, misalnya ukuran atau kemasan.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "note" } },
});
