import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL ?? "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const stays = await prisma.stay.findMany({
      where: { status: "published" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { category: true, location: true },
    });

    return NextResponse.json({ stays }, { headers: corsHeaders });
  } catch (error) {
    console.error("Backend stays query failed", error);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503, headers: corsHeaders },
    );
  }
}
