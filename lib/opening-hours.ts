import type { OpeningHours } from "./types";

export const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export type StoreStatus = {
  isOpen: boolean;
  label: string;
};

export function sortByWeek(hours: OpeningHours[]) {
  return [...hours].sort((a, b) => WEEK_ORDER.indexOf(a.day) - WEEK_ORDER.indexOf(b.day));
}

export function formatHours(entry: OpeningHours) {
  if (entry.closed || !entry.opens || !entry.closes) return "Tutup";
  return `${entry.opens} sampai ${entry.closes} WIB`;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** The store runs on WIB, so visitors in other time zones still see the right status. */
function jakartaNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  return { day, minutes: Number(value("hour")) * 60 + Number(value("minute")) };
}

function nextOpening(hours: OpeningHours[], fromDay: number) {
  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (fromDay + offset) % 7;
    const entry = hours.find((item) => item.day === day);
    if (entry && !entry.closed && entry.opens) return `${DAY_NAMES[day]} ${entry.opens} WIB`;
  }
  return null;
}

export function getStoreStatus(hours: OpeningHours[], now: Date): StoreStatus | null {
  if (hours.length === 0) return null;

  const { day, minutes } = jakartaNow(now);
  const today = hours.find((item) => item.day === day);

  if (today && !today.closed && today.opens && today.closes) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: `Buka sekarang, tutup ${today.closes} WIB` };
    }
    if (minutes < opens) return { isOpen: false, label: `Tutup, buka ${today.opens} WIB` };
  }

  const next = nextOpening(hours, day);
  return { isOpen: false, label: next ? `Tutup, buka ${next}` : "Tutup" };
}
