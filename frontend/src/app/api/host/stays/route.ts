import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { listingSchema } from "@/lib/listing-validation";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (
      !user ||
      (user.role !== "host" && user.role !== "admin") ||
      user.status !== "active"
    ) {
      return NextResponse.json({ error: "Unauthorized host" }, { status: 401 });
    }

    const result = listingSchema.safeParse(await req.json());
    if (!result.success)
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    const body = result.data;
    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        { error: "Property title is required" },
        { status: 400 },
      );
    }

    const baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.stay.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // New host listing always starts in draft status pending admin review
    const stay = await prisma.stay.create({
      data: {
        hostId: user.id,
        title,
        slug: uniqueSlug,
        categoryId: Number(body.categoryId),
        locationId: Number(body.locationId),
        metaDescription: body.shortDesc.slice(0, 255),
        shortDesc: body.shortDesc || title,
        fullContent: body.fullContent || title,
        pricePerNight: Number(body.pricePerNight || 0),
        currency: body.currency,
        featuredImage: body.featuredImage || "/social-share.jpg",
        galleryJson: JSON.stringify(body.gallery || [body.featuredImage]),
        amenitiesJson: JSON.stringify(body.amenities || []),
        address: body.address || "Mirissa, Sri Lanka",
        whatsappNumber: body.whatsappNumber,
        allowBooking: true,
        status: "draft", // Stricly draft until admin approval
        isFeatured: false,
        rating: null,
        reviewCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Listing submitted for review",
      stay,
    });
  } catch (err: unknown) {
    console.error("Host create stay error:", err);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
