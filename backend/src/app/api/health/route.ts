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
    await prisma.$queryRaw`SELECT 1`;
    const [stays, publishedStays] = await Promise.all([
      prisma.stay.count(),
      prisma.stay.count({ where: { status: "published" } }),
    ]);

    return NextResponse.json({ ok: true, database: "connected", stays, publishedStays }, { headers: corsHeaders });
  } catch (error) {
    console.error("Backend database health check failed", error);
    return NextResponse.json(
      { ok: false, database: "unavailable", message: "Database connection failed" },
      { status: 503, headers: corsHeaders },
    );
  }
}
