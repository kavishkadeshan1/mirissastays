import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, any> = {};
  let databaseAvailable = true;

  try {
    const raw = await prisma.$queryRaw`SELECT 1 as is_connected`;
    diagnostics.rawConnection = raw;
  } catch (e: any) {
    diagnostics.rawConnectionError = e.message;
    databaseAvailable = false;
  }

  try {
    const guideColumns: any = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'guides' AND TABLE_SCHEMA = DATABASE()
    `;
    diagnostics.guideColumns = guideColumns.map((c: any) => c.COLUMN_NAME);
  } catch (e: any) {
    diagnostics.guideColumnsError = e.message;
  }

  try {
    const stayColumns: any = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'stays' AND TABLE_SCHEMA = DATABASE()
    `;
    diagnostics.stayColumns = stayColumns.map((c: any) => c.COLUMN_NAME);
  } catch (e: any) {
    diagnostics.stayColumnsError = e.message;
  }

  try {
    const testGuide = await prisma.guide.findMany({
      where: { status: "published" },
      take: 3,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    diagnostics.guideFindManySuccess = true;
    diagnostics.guidesSample = testGuide.map((g) => g.title);
  } catch (e: any) {
    diagnostics.guideFindManyError = e.message;
  }

  try {
    const testStays = await prisma.stay.findMany({
      where: { status: "published" },
      take: 6,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { category: true, location: true },
    });
    diagnostics.stayFindManySuccess = true;
    diagnostics.staysCount = testStays.length;
    diagnostics.sampleStay = testStays[0]?.title || null;
  } catch (e: any) {
    diagnostics.stayFindManyError = e.message;
  }

  diagnostics.ok = databaseAvailable && diagnostics.stayFindManySuccess === true;

  return NextResponse.json(diagnostics, {
    status: diagnostics.ok ? 200 : 503,
  });
}
