import { StayItem } from "@/types";
export function presentStay(s: any): StayItem {
  return {
    ...s,
    pricePerNight: Number(s.pricePerNight),
    rating: Number(s.rating) || 0,
    reviewCount: s.reviewCount || 0,
    latitude: s.latitude == null ? null : Number(s.latitude),
    longitude: s.longitude == null ? null : Number(s.longitude),
    currency: s.currency || "USD",
  };
}
export function stringList(value: unknown): string[] {
  try {
    let v = typeof value === "string" ? JSON.parse(value) : value;
    if (typeof v === "string") v = JSON.parse(v);
    return Array.isArray(v)
      ? v.filter((s): s is string => typeof s === "string" && !!s.trim())
      : [];
  } catch {
    return [];
  }
}
export function safeExternalUrl(value: string | null | undefined) {
  try {
    const u = new URL(value || "");
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

export function bookingPartnerUrl(value: string | null | undefined) {
  const url = safeExternalUrl(value);
  if (!url) return null;
  const host = new URL(url).hostname;
  return /(^|\.)google\.[a-z.]+$|(^|\.)goo\.gl$|(^|\.)share\.google$/.test(host)
    ? null
    : url;
}
