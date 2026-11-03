import type { SiteContent, SiteImage } from "./types";

const photo = (file: string, alt: string, width: number, height: number): SiteImage => ({
  src: `/images/${file}`,
  alt,
  width,
  height,
});

const CATALOG_NOTE =
  "Daftar ini contoh umum. Stok sebenarnya bisa berbeda, jadi tanyakan langsung di toko.";

// Shown until Sanity holds content. Only the name, coordinates, and Maps link are
// verified store data: phone, hours, rating, and reviews stay empty until the owner
// fills them in, and the UI hides whatever is missing.
export const fallbackContent: SiteContent = {
  settings: {
    storeName: "Kebun Kita",
    tagline: "Toko sayur dan sembako di Ngaglik.",
    description:
      "Kebun Kita adalah toko sayur dan sembako untuk kebutuhan dapur sehari-hari di Ngaglik, Sleman.",
    addressLine: "Sekitar Jalan Amarta, Ngaglik",
    addressNote: "Patokan area dari titik Google Maps. Gunakan tombol rute untuk lokasi tepatnya.",
    locality: "Sleman",
    region: "Daerah Istimewa Yogyakarta",
    postalCode: "55581",
    latitude: -7.720474,
    longitude: 110.4021547,
    mapsUrl: "https://maps.app.goo.gl/2DCiykTNX7mAtjFe6",
    openingHours: [],
    socials: [],
    seoTitle: "Kebun Kita | Toko Sayur dan Sembako di Ngaglik, Sleman",
    seoDescription:
      "Kebun Kita menjual sayur dan sembako untuk kebutuhan dapur sehari-hari. Lihat produk dan rute ke toko di Ngaglik, Sleman.",
    ogImage: photo("og-kebun-kita.jpg", "Rak penuh sayuran hijau", 1200, 630),
  },
  home: {
    hero: {
      heading: "Kebun\nKita",
      subheading: "Sayur dan sembako untuk kebutuhan dapur sehari-hari di Ngaglik, Sleman.",
      ctaLabel: "Lihat Produk",
      image: photo("hero-sayur.jpg", "Aneka sayuran segar tersusun rapat", 800, 1620),
    },
    intro: {
      heading: "Belanja dapur,\ndekat dari rumah",
      subheading: "Sayur dan sembako ada di satu toko, jadi belanja dapur cukup sekali jalan.",
      image: photo("layanan-sayur.jpg", "Keranjang berisi brokoli, kacang panjang, dan timun", 660, 1040),
    },
    band: {
      heading: "Dapur selalu\nsiap masak",
      body: "Sayur untuk dimasak hari ini dan sembako untuk stok di rumah bisa dibeli dalam satu kali mampir.",
      ctaLabel: "Cek Lokasi Toko",
      imageA: photo("band-pasar.jpg", "Suasana belanja sayur di pasar", 680, 1100),
      imageB: photo("band-telur.jpg", "Dua tangan memegang mangkuk berisi telur", 680, 1100),
    },
    products: {
      heading: "Produk Kami",
      subheading: "Pilih kategori untuk melihat contoh barang yang bisa Anda cari di toko.",
    },
    steps: {
      heading: "Cara Belanja",
      subheading: "Dari rumah ke dapur, begini alurnya.",
      items: [
        {
          title: "Datang",
          body: "Buka rute di Google Maps dan mampir ke toko kami di Ngaglik.",
          icon: "pin",
        },
        {
          title: "Pilih",
          body: "Pilih sendiri sayur dan sembako yang Anda butuhkan di rak.",
          icon: "basket",
        },
        {
          title: "Masak",
          body: "Bawa pulang belanjaan, lalu dapur siap dipakai.",
          icon: "pot",
        },
      ],
    },
    reviews: {
      heading: "Kata Pelanggan",
      subheading: "Ulasan dari pelanggan Kebun Kita di Google Maps.",
    },
    location: {
      heading: "Kunjungi Toko",
      subheading: "Kebun Kita ada di Ngaglik, Sleman. Buka peta untuk rute dari lokasi Anda.",
    },
    faq: {
      heading: "Pertanyaan Umum",
      subheading: "Hal yang paling sering ditanyakan pelanggan.",
    },
    cta: {
      heading: "Saatnya isi dapur Anda",
      body: "Buka petunjuk arah dan temukan Kebun Kita di Ngaglik, Sleman.",
      ctaLabel: "Buka Google Maps",
      image: photo("cta-bayam.jpg", "Seikat bayam segar", 1200, 900),
    },
  },
  services: [
    {
      id: "sayur",
      title: "Sayur\nSegar",
      summary: "Sayuran untuk masakan harian, dari tumisan sampai sayur berkuah.",
      icon: "carrot",
      target: "produk",
    },
    {
      id: "sembako",
      title: "Sembako\nHarian",
      summary: "Beras, minyak, gula, dan telur untuk stok dapur di rumah.",
      icon: "sack",
      target: "produk",
    },
  ],
  categories: [
    {
      id: "sayur",
      title: "Sayur Segar",
      summary: "Untuk tumisan, sayur berkuah, dan lalapan.",
      image: photo("produk-sayur.jpg", "Rak toko berisi paprika, timun, dan sayuran lain", 900, 750),
      items: ["Bayam", "Kangkung", "Sawi", "Wortel", "Tomat", "Kol", "Buncis", "Timun"].map((name) => ({ name })),
      note: CATALOG_NOTE,
    },
    {
      id: "bumbu",
      title: "Bumbu Dapur",
      summary: "Bumbu segar dan kering untuk masakan rumah.",
      image: photo("produk-bumbu.jpg", "Aneka rempah dan bumbu dapur di atas meja kayu", 900, 750),
      items: ["Bawang merah", "Bawang putih", "Cabai", "Kunyit", "Jahe", "Lengkuas", "Merica", "Ketumbar"].map(
        (name) => ({ name }),
      ),
      note: CATALOG_NOTE,
    },
    {
      id: "sembako",
      title: "Sembako",
      summary: "Bahan pokok untuk stok di rumah.",
      image: photo("produk-sembako.jpg", "Tumpukan butir beras", 900, 750),
      items: ["Beras", "Minyak goreng", "Gula", "Telur", "Tepung terigu", "Garam", "Mi instan", "Kecap"].map(
        (name) => ({ name }),
      ),
      note: CATALOG_NOTE,
    },
  ],
  reviews: [],
  faqs: [],
};
