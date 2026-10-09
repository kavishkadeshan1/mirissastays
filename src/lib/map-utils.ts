/**
 * Map resolution and embedding utilities for MirissaStays
 * Converts Google Maps iframe snippets, share links, coordinates, or destination names
 * into clean, reliable, responsive embedded map URLs with no API key dependency.
 */

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export const DESTINATION_COORDINATES: Record<
  string,
  { lat: number; lng: number; name: string; query: string; zoom: number }
> = {
  mirissa: {
    lat: 5.9482,
    lng: 80.4578,
    name: "Mirissa",
    query: "Mirissa Beach, Mirissa, Sri Lanka",
    zoom: 14,
  },
  weligama: {
    lat: 5.9734,
    lng: 80.4288,
    name: "Weligama",
    query: "Weligama Bay, Weligama, Sri Lanka",
    zoom: 14,
  },
  madiha: {
    lat: 5.9344,
    lng: 80.5108,
    name: "Madiha",
    query: "Madiha Beach, Madiha, Sri Lanka",
    zoom: 14,
  },
  midigama: {
    lat: 5.9765,
    lng: 80.4077,
    name: "Midigama",
    query: "Midigama Beach, Midigama, Sri Lanka",
    zoom: 14,
  },
  thalaramba: {
    lat: 5.9372,
    lng: 80.4725,
    name: "Thalaramba",
    query: "Thalaramba, Mirissa, Sri Lanka",
    zoom: 15,
  },
  kamburugamuwa: {
    lat: 5.9421,
    lng: 80.4994,
    name: "Kamburugamuwa",
    query: "Kamburugamuwa Beach, Sri Lanka",
    zoom: 14,
  },
};

/**
 * Extracts iframe src or validates raw URL from an embed string
 */
export function extractEmbedSrc(embedCodeOrUrl: string | null | undefined): string | null {
  if (!embedCodeOrUrl) return null;
  const trimmed = embedCodeOrUrl.trim();
  if (!trimmed) return null;

  // If HTML iframe markup was pasted, extract the src attribute
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1].trim();
  }

  // If already a valid http(s) URL
  if (/^https?:\/\//i.test(trimmed)) {
    // If it's a regular Google Maps link, convert to embed if needed
    if (trimmed.includes("output=embed") || trimmed.includes("/maps/embed")) {
      return trimmed;
    }
    // Check for query / coordinates in google maps link
    const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=en&z=16&output=embed`;
    }
    const qMatch = trimmed.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      return `https://maps.google.com/maps?q=${qMatch[1]}&hl=en&z=16&output=embed`;
    }
    return trimmed;
  }

  return null;
}

/**
 * Resolves an embedded Google Map URL for any stay/place
 */
export function resolveStayMapEmbed(stay: {
  mapEmbed?: string | null;
  latitude?: number | string | { toString(): string } | null;
  longitude?: number | string | { toString(): string } | null;
  title?: string;
  address?: string;
}): string {
  // 1. Try explicit mapEmbed field (iframe or url)
  const extracted = extractEmbedSrc(stay.mapEmbed);
  if (extracted) {
    return extracted;
  }

  // 2. Try latitude and longitude coordinates
  const lat = stay.latitude != null ? String(stay.latitude).trim() : null;
  const lng = stay.longitude != null ? String(stay.longitude).trim() : null;
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;
  }

  // 3. Fallback to title + address search
  const queryParts = [stay.title, stay.address, "Sri Lanka"].filter(Boolean).join(", ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(queryParts)}&hl=en&z=15&output=embed`;
}

/**
 * Resolves an embedded Google Map URL for a destination/region
 */
export function getDestinationMapEmbed(slugOrName: string): string {
  const key = (slugOrName || "").toLowerCase().trim();
  const dest = DESTINATION_COORDINATES[key];
  if (dest) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(dest.query)}&hl=en&z=${dest.zoom}&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(slugOrName + ", Sri Lanka")}&hl=en&z=14&output=embed`;
}

/**
 * Generates external Google Maps view URL
 */
export function generateExternalMapUrl(stay: {
  latitude?: number | string | { toString(): string } | null;
  longitude?: number | string | { toString(): string } | null;
  title?: string;
  address?: string;
}): string {
  const lat = stay.latitude != null ? String(stay.latitude).trim() : null;
  const lng = stay.longitude != null ? String(stay.longitude).trim() : null;
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const query = [stay.title, stay.address].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generates Google Maps turn-by-turn directions URL
 */
export function generateDirectionsUrl(stay: {
  latitude?: number | string | { toString(): string } | null;
  longitude?: number | string | { toString(): string } | null;
  title?: string;
  address?: string;
}): string {
  const lat = stay.latitude != null ? String(stay.latitude).trim() : null;
  const lng = stay.longitude != null ? String(stay.longitude).trim() : null;
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  const query = [stay.title, stay.address].filter(Boolean).join(" ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
