import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { listingSchema } from "@/lib/listing-validation";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.status !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt((await params).id, 10);
    const existing = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    // Strict ownership verification: only owner or admin can edit!
    if (existing.hostId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to edit this property" },
        { status: 403 },
      );
    }

    const result = listingSchema.safeParse(await req.json());
    if (!result.success)
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    const body = result.data;

    const stay = await prisma.stay.update({
      where: { id },
      data: {
        title: body.title,
        categoryId: Number(body.categoryId),
        locationId: Number(body.locationId),
        pricePerNight: Number(body.pricePerNight),
        currency: body.currency,
        galleryJson: JSON.stringify(body.gallery),
        featuredImage: body.featuredImage,
        address: body.address,
        mapEmbed: body.mapEmbed !== undefined ? (body.mapEmbed || null) : undefined,
        whatsappNumber: body.whatsappNumber,
        shortDesc: body.shortDesc,
        fullContent: body.fullContent,
        amenitiesJson: JSON.stringify(body.amenities || []),
      },
    });

    return NextResponse.json({ success: true, stay });
  } catch (err: unknown) {
    console.error("Host stay update error:", err);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.status !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt((await params).id, 10);
    const existing = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    if (existing.hostId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to delete this property" },
        { status: 403 },
      );
    }

    await prisma.stay.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Listing deleted" });
  } catch (err: unknown) {
    console.error("Host stay delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 },
    );
  }
}
