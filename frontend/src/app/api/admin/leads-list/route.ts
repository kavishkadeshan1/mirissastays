import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        stay: { select: { title: true, slug: true } },
      },
    });

    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
