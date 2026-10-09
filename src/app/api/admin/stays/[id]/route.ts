import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);
    const body = await req.json();

    const stay = await prisma.stay.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    });

    return NextResponse.json({ success: true, stay });
  } catch (err: unknown) {
    console.error("Stay PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update stay" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);

    await prisma.stay.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Stay deleted successfully",
    });
  } catch (err: unknown) {
    console.error("Stay DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete stay" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);
    const body = await req.json();

    const stay = await prisma.stay.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        categoryId: Number(body.categoryId),
        locationId: Number(body.locationId),
        metaDescription: body.metaDescription,
        shortDesc: body.shortDesc,
        fullContent: body.fullContent,
        pricePerNight: Number(body.pricePerNight),
        currency: body.currency || "USD",
        featuredImage: body.featuredImage,
        galleryJson:
          typeof body.galleryJson === "string"
            ? body.galleryJson
            : JSON.stringify(body.galleryJson || []),
        amenitiesJson:
          typeof body.amenitiesJson === "string"
            ? body.amenitiesJson
            : JSON.stringify(body.amenitiesJson || []),
        address: body.address,
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        mapEmbed: body.mapEmbed || null,
        whatsappNumber: body.whatsappNumber,
        allowBooking: Boolean(body.allowBooking),
        status: body.status || "published",
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ success: true, stay });
  } catch (err: unknown) {
    console.error("Stay PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update stay" },
      { status: 500 },
    );
  }
}
