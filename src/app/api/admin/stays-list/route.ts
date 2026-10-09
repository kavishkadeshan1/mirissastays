import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const stays = await prisma.stay.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        host: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ stays });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
