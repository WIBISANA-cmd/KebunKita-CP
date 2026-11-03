import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Pengaturan Toko")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Pengaturan Toko")),
      S.listItem()
        .title("Halaman Beranda")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage").title("Halaman Beranda")),
      S.divider(),
      S.documentTypeListItem("service").title("Layanan"),
      S.documentTypeListItem("productCategory").title("Kategori Produk"),
      S.documentTypeListItem("review").title("Ulasan Pelanggan"),
      S.documentTypeListItem("faq").title("Pertanyaan Umum"),
    ]);
