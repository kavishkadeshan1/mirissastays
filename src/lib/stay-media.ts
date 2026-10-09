import media from "@/data/property-media.json";

interface CachedMedia {
  originalFeaturedImage?: string;
  photos: { src: string; original: string }[];
  stockPhoto: boolean;
  sourcePage: string | null;
}

export function stayMedia(stay: {
  slug: string;
  featuredImage: string;
  galleryJson: string | null;
}) {
  const cached = (media as Record<string, CachedMedia>)[stay.slug];
  // A later upload must take precedence over the migration's cached photos.
  if (
    !cached?.photos.length ||
    cached.originalFeaturedImage !== stay.featuredImage
  ) {
    return {
      featuredImage: stay.featuredImage,
      galleryJson: stay.galleryJson,
      illustrative: false,
      sourcePage: null,
    };
  }
  return {
    featuredImage: cached.photos[0].src,
    galleryJson: JSON.stringify(
      cached.photos.slice(1).map((photo) => photo.src),
    ),
    illustrative: cached.stockPhoto,
    sourcePage: cached.sourcePage,
  };
}
