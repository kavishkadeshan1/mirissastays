import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);
    const body = await req.json();

    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: body.title?.trim() || "Untitled Travel Guide",
        slug: body.slug?.trim(),
        metaTitle: body.metaTitle?.trim() || "",
        metaDescription: body.metaDescription?.trim() || "",
        primaryKeyword: body.primaryKeyword?.trim() || "",
        tags: body.tags?.trim() || "",
        authorName: body.authorName?.trim() || "Kavishka Deshan",
        authorRole: body.authorRole?.trim() || "Mirissa Native & Surf Guide",
        authorImage:
          body.authorImage?.trim() || "https://kavishkadeshan.me/profile1.jpg",
        authorBio: body.authorBio?.trim() || "",
        featuredImage: body.featuredImage?.trim() || "",
        content: body.content?.trim() || "",
        status: body.status === "draft" ? "draft" : "published",
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ success: true, guide });
  } catch (err: unknown) {
    console.error("Update guide error:", err);
    return NextResponse.json(
      { error: "Failed to update travel guide" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);
    const body = await req.json();

    const guide = await prisma.guide.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isFeatured !== undefined && {
          isFeatured: Boolean(body.isFeatured),
        }),
      },
    });

    return NextResponse.json({ success: true, guide });
  } catch (err: unknown) {
    console.error("Patch guide error:", err);
    return NextResponse.json(
      { error: "Failed to update guide status" },
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

    await prisma.guide.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Guide deleted successfully",
    });
  } catch (err: unknown) {
    console.error("Delete guide error:", err);
    return NextResponse.json(
      { error: "Failed to delete guide" },
      { status: 500 },
    );
  }
}
