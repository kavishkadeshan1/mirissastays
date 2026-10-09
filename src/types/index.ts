export interface StayItem {
  id: number;
  hostId: number;
  categoryId: number;
  locationId: number;
  title: string;
  slug: string;
  metaDescription: string;
  shortDesc: string;
  fullContent: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  featuredImage: string;
  galleryJson: string | null;
  amenitiesJson: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  mapEmbed: string | null;
  affiliateUrl: string | null;
  whatsappNumber: string;
  allowBooking: boolean;
  status: string;
  isFeatured: boolean;
  createdAt: Date | string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  location?: {
    id: number;
    name: string;
    slug: string;
  };
  host?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface GuideItem {
  id: number;
  title: string;
  metaTitle: string | null;
  slug: string;
  metaDescription: string;
  primaryKeyword: string | null;
  tags: string | null;
  authorName: string | null;
  authorRole: string | null;
  authorImage: string | null;
  authorBio: string | null;
  featuredImage: string;
  content: string;
  views: number;
  isFeatured: boolean;
  status: string;
  createdAt: Date | string;
  comments?: GuideCommentItem[];
}

export interface GuideCommentItem {
  id: number;
  guideId: number;
  authorName: string;
  authorEmail: string;
  comment: string;
  status: string;
  createdAt: Date | string;
}

export interface LocationItem {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  _count?: {
    stays: number;
  };
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  _count?: {
    stays: number;
  };
}
