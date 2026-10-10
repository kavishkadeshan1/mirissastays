import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirissastays.com";
const SITE_NAME = "Mirissa Stays";
const DEFAULT_TITLE =
  "Mirissa Hotels, Luxury Villas & Stays in Mirissa Sri Lanka | MirissaStays";
const DEFAULT_DESCRIPTION =
  "Discover the best hotels in Mirissa, luxury beachfront villas, and coastal guesthouses in Mirissa, Weligama & Thalaramba. Explore property details, contact participating hosts, and discover local travel guides.";

const DEFAULT_KEYWORDS = [
  "Mirissa hotels",
  "villas in Mirissa",
  "places to stay in Mirissa Sri Lanka",
  "hotels in Mirissa Sri Lanka",
  "Weligama hotels",
  "Mirissa beachfront villa",
  "guesthouses in Mirissa",
  "Sri Lanka south coast stays",
  "Coconut Tree Hill Mirissa",
  "surf stays Weligama",
  "whale watching Mirissa accommodation",
  "luxury villas Mirissa",
];

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/social-share.jpg",
  canonical,
  noIndex = false,
  type = "website",
  keywords,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const fullTitle = title
    ? title.includes(" | ")
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;
  const fullImage = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`
    : SITE_URL;
  const pageKeywords = keywords && keywords.length
    ? [...keywords, ...DEFAULT_KEYWORDS]
    : DEFAULT_KEYWORDS;

  return {
    title: fullTitle,
    description,
    keywords: pageKeywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
      site: "@MirissaStays",
      creator: "@MirissaStays",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
        { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
        { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    category: "Travel & Hospitality",
    authors: [{ name: "MirissaStays Team", url: SITE_URL }],
    creator: "MirissaStays",
    publisher: "MirissaStays",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "MirissaStays",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/social-share.jpg`,
    description:
      "Connecting travelers with authentic, verified hotels, villas, and guesthouses in Mirissa, Weligama, and Thalaramba, Sri Lanka.",
    areaServed: [
      "Mirissa",
      "Weligama",
      "Thalaramba",
      "Kamburugamuwa",
      "Madiha",
      "Southern Province, Sri Lanka",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mirissa",
      addressRegion: "Southern Province",
      addressCountry: "LK",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "MirissaStays",
    description:
      "Directory for premier hotels, villas, and stays in Mirissa, Sri Lanka",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/stays?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

export function generateLodgingSchema({
  title,
  slug,
  description,
  photos,
  address,
  locationName,
  categoryName,
  price,
  currency = "USD",
  rating = 0,
  reviewCount = 0,
  amenities = [],
  whatsappNumber,
  latitude,
  longitude,
}: {
  title: string;
  slug: string;
  description: string;
  photos: string[];
  address: string;
  locationName: string;
  categoryName: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  amenities?: string[];
  whatsappNumber?: string;
  latitude?: number | null;
  longitude?: number | null;
}) {
  let schemaType = "LodgingBusiness";
  if (/resort/i.test(categoryName)) schemaType = "Resort";
  else if (/hostel/i.test(categoryName)) schemaType = "Hostel";
  else if (/guesthouse|bed & breakfast/i.test(categoryName))
    schemaType = "BedAndBreakfast";
  else if (/hotel|villa/i.test(categoryName)) schemaType = "Hotel";

  const photoUrls = photos.length
    ? photos.map((p) =>
        p.startsWith("http")
          ? p
          : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`,
      )
    : [`${SITE_URL}/social-share.jpg`];

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${SITE_URL}/stay/${slug}#lodging`,
    name: title,
    description: description || `Experience ${title} located in ${locationName}, Sri Lanka.`,
    image: photoUrls,
    url: `${SITE_URL}/stay/${slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address || `${locationName}, Southern Province`,
      addressLocality: locationName,
      addressRegion: "Southern Province",
      addressCountry: "LK",
    },
    ...(reviewCount > 0 && rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toFixed(1),
            reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(price && price > 0 ? { priceRange: `${currency} ${Math.round(price)}` } : {}),
    ...(whatsappNumber ? { telephone: whatsappNumber } : {}),
    ...(latitude && longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
          hasMap: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        }
      : {}),
    amenityFeature: amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
  };
}

export function generateItemListSchema(
  name: string,
  items: { name: string; url: string; image?: string; description?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
      ...(item.image
        ? {
            image: item.image.startsWith("http")
              ? item.image
              : `${SITE_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`,
          }
        : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function generateTouristDestinationSchema({
  name,
  slug,
  description,
  image,
}: {
  name: string;
  slug: string;
  description: string;
  image?: string;
}) {
  const fullImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : `${SITE_URL}/social-share.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${SITE_URL}/location/${slug}#destination`,
    name,
    description,
    url: `${SITE_URL}/location/${slug}`,
    image: fullImage,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Southern Province, Sri Lanka",
    },
  };
}

export function generateArticleSchema({
  title,
  slug,
  description,
  image,
  datePublished,
  authorName = "Kavishka Deshan",
}: {
  title: string;
  slug: string;
  description: string;
  image: string;
  datePublished: string;
  authorName?: string;
}) {
  const fullImage = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/guides/${slug}#article`,
    headline: title,
    image: [fullImage],
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${slug}`,
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "MirissaStays Editorial",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    description,
  };
}

export function generateFaqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
