import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [guides, comments] = await Promise.all([
      prisma.guide.findMany({
        orderBy: [{ isFeatured: "desc" }, { views: "desc" }],
      }),
      prisma.guideComment.findMany({
        orderBy: { createdAt: "desc" },
        include: { guide: { select: { title: true, slug: true } } },
      }),
    ]);

    return NextResponse.json({ guides, comments });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
