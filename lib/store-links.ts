import type { Settings } from "./types";

export const NAV_ITEMS = [
  { href: "#beranda", id: "beranda", label: "Beranda" },
  { href: "#layanan", id: "layanan", label: "Layanan" },
  { href: "#produk", id: "produk", label: "Produk" },
  { href: "#lokasi", id: "lokasi", label: "Lokasi" },
];

export function directionsUrl({ latitude, longitude }: Pick<Settings, "latitude" | "longitude">) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export function mapEmbedUrl({ storeName, latitude, longitude }: Pick<Settings, "storeName" | "latitude" | "longitude">) {
  const query = encodeURIComponent(`${storeName}@${latitude},${longitude}`);
  return `https://www.google.com/maps?q=${query}&z=17&hl=id&output=embed`;
}

export function fullAddress({ addressLine, locality, region, postalCode }: Settings) {
  return [addressLine, locality, region, postalCode].filter(Boolean).join(", ");
}

export function whatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}
