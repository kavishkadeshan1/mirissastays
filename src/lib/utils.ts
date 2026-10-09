import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string | null | undefined,
  currency = "USD",
): string {
  if (price === null || price === undefined) return "Request a quote";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (!Number.isFinite(num) || num <= 0) return "Request a quote";
  const code = /^[A-Z]{3}$/.test(currency || "") ? currency : "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${code} ${Math.round(num).toLocaleString("en-US")}`;
  }
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function sanitizeWhatsApp(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}
