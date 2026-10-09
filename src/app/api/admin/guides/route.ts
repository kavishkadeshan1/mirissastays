import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const title = body.title?.trim() || "Untitled Travel Guide";
    let slug = body.slug ? slugify(body.slug) : slugify(title);
    if (!slug) slug = `guide-${Date.now()}`;

    // Ensure slug uniqueness
    const existing = await prisma.guide.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const guide = await prisma.guide.create({
      data: {
        title,
        slug,
        metaTitle: body.metaTitle?.trim() || title,
        metaDescription: body.metaDescription?.trim() || "",
        primaryKeyword: body.primaryKeyword?.trim() || "",
        tags: body.tags?.trim() || "",
        authorName: body.authorName?.trim() || "Kavishka Deshan",
        authorRole: body.authorRole?.trim() || "Mirissa Native & Surf Guide",
        authorImage:
          body.authorImage?.trim() || "https://kavishkadeshan.me/profile1.jpg",
        authorBio:
          body.authorBio?.trim() ||
          "Lifelong southern province local, surf enthusiast, and contributing editor at MirissaStays.",
        featuredImage:
          body.featuredImage?.trim() ||
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        content: body.content?.trim() || "<p>Guide content coming soon.</p>",
        status: body.status === "draft" ? "draft" : "published",
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ success: true, guide });
  } catch (err: unknown) {
    console.error("Create guide error:", err);
    return NextResponse.json(
      { error: "Failed to create travel guide" },
      { status: 500 },
    );
  }
}

// Update homepage featured 4 guides
export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const selectedIds: number[] = Array.isArray(body.featuredGuideIds)
      ? body.featuredGuideIds.slice(0, 4).map(Number)
      : [];

    // Reset all to unfeatured
    await prisma.guide.updateMany({
      data: { isFeatured: false },
    });

    if (selectedIds.length > 0) {
      await prisma.guide.updateMany({
        where: { id: { in: selectedIds } },
        data: { isFeatured: true },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Homepage featured articles saved successfully (up to 4 articles displayed).",
    });
  } catch (err: unknown) {
    console.error("Update homepage guides error:", err);
    return NextResponse.json(
      { error: "Failed to update homepage articles" },
      { status: 500 },
    );
  }
}
