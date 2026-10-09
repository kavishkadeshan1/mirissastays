import { z } from "zod";
export const listingSchema = z.object({
  title: z.string().trim().min(3).max(200),
  categoryId: z.coerce.number().int().positive(),
  locationId: z.coerce.number().int().positive(),
  pricePerNight: z.coerce.number().min(0).max(99999999),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .default("USD"),
  featuredImage: z
    .string()
    .min(1)
    .max(255)
    .refine(
      (v) => v.startsWith("/uploads/") || /^https?:\/\//.test(v),
      "Use an uploaded photo or a full image URL.",
    ),
  gallery: z
    .array(
      z
        .string()
        .max(1000)
        .refine(
          (v) => v.startsWith("/uploads/") || /^https?:\/\//.test(v),
          "Use an uploaded photo or a full image URL.",
        ),
    )
    .max(30)
    .default([]),
  address: z.string().min(5).max(255),
  mapEmbed: z.string().max(3000).optional().nullable(),
  whatsappNumber: z.string().min(6).max(30),
  shortDesc: z.string().min(10).max(10000),
  fullContent: z.string().min(20).max(100000),
  amenities: z.array(z.string().max(100)).max(50).default([]),
});
