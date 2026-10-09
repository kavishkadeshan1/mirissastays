import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const baseSlug = body.slug ? slugify(body.slug) : slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.stay.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const stay = await prisma.stay.create({
      data: {
        hostId: admin.id,
        title,
        slug: uniqueSlug,
        categoryId: Number(body.categoryId),
        locationId: Number(body.locationId),
        metaDescription: body.metaDescription || title,
        shortDesc: body.shortDesc || title,
        fullContent: body.fullContent || title,
        pricePerNight: Number(body.pricePerNight || 0),
        currency: body.currency || "USD",
        featuredImage: body.featuredImage || "/social-share.jpg",
        galleryJson:
          typeof body.galleryJson === "string"
            ? body.galleryJson
            : JSON.stringify(body.galleryJson || []),
        amenitiesJson:
          typeof body.amenitiesJson === "string"
            ? body.amenitiesJson
            : JSON.stringify(body.amenitiesJson || []),
        address: body.address || "Mirissa, Sri Lanka",
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        mapEmbed: body.mapEmbed || null,
        whatsappNumber: body.whatsappNumber || "+94760224529",
        allowBooking: Boolean(body.allowBooking),
        status: body.status || "published",
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ success: true, stay });
  } catch (err: unknown) {
    console.error("Create stay error:", err);
    return NextResponse.json(
      { error: "Failed to create stay" },
      { status: 500 },
    );
  }
}
