import { z } from "zod";

export const inquirySchema = z
  .object({
    stayId: z.number().int().positive(),
    guestName: z.string().min(2, "Name must be at least 2 characters").max(120),
    guestEmail: z.string().email("Invalid email address").max(150),
    guestPhone: z
      .string()
      .min(6, "Valid phone/WhatsApp number is required")
      .max(30),
    checkinDate: z.string().min(1, "Check-in date is required"),
    checkoutDate: z.string().min(1, "Check-out date is required"),
    guestsCount: z.coerce.number().int().min(1).max(30).default(2),
    specialRequests: z.string().max(1000).optional().nullable(),
    honeypot: z.string().max(0, "Bot detected").optional(),
  })
  .superRefine((data, ctx) => {
    const validDate = (s: string) =>
      /^\d{4}-\d{2}-\d{2}$/.test(s) &&
      !Number.isNaN(Date.parse(s)) &&
      new Date(s).toISOString().slice(0, 10) === s;
    if (!validDate(data.checkinDate) || !validDate(data.checkoutDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkinDate"],
        message: "Enter valid check-in and check-out dates.",
      });
      return;
    }
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (data.checkinDate < today)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkinDate"],
        message: "Check-in cannot be in the past.",
      });
    if (data.checkoutDate <= data.checkinDate)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkoutDate"],
        message: "Check-out must be after check-in.",
      });
  });

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),
  email: z.string().email("Invalid email address").max(150),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(255),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(3000),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const commentSchema = z.object({
  guideId: z.number().int().positive(),
  authorName: z.string().min(2, "Name must be at least 2 characters").max(100),
  authorEmail: z.string().email("Invalid email address").max(150),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(2000),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Please enter a valid email address").max(150),
  phone: z.string().min(6, "Phone number is required").max(30),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["guest", "host"]).default("guest"),
  businessRegNo: z.string().max(100).optional().nullable(),
});

export const stayFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).optional(),
  categoryId: z.coerce.number().int().positive(),
  locationId: z.coerce.number().int().positive(),
  metaDescription: z.string().min(10).max(255),
  shortDesc: z.string().min(10),
  fullContent: z.string().min(20),
  pricePerNight: z.coerce.number().min(0),
  currency: z.string().default("USD"),
  featuredImage: z.string().min(1, "Featured image is required"),
  galleryJson: z.string().optional().default("[]"),
  amenitiesJson: z.string().optional().default("[]"),
  address: z.string().min(5, "Address is required"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  mapEmbed: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  allowBooking: z.boolean().default(true),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
});
