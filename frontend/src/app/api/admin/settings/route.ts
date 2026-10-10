import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === "string") {
        await prisma.setting.upsert({
          where: { keyName: key },
          update: { valueText: val },
          create: { keyName: key, valueText: val },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings save error:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
