import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, any> = {};

  try {
    const raw = await prisma.$queryRaw`SELECT 1 as is_connected`;
    diagnostics.rawConnection = raw;
  } catch (e: any) {
    diagnostics.rawConnectionError = e.message;
  }

  try {
    diagnostics.categoriesCount = await prisma.category.count();
  } catch (e: any) {
    diagnostics.categoriesError = e.message;
  }

  try {
    diagnostics.locationsCount = await prisma.location.count();
  } catch (e: any) {
    diagnostics.locationsError = e.message;
  }

  try {
    diagnostics.guidesCount = await prisma.guide.count();
  } catch (e: any) {
    diagnostics.guidesError = e.message;
  }

  try {
    const stays = await prisma.stay.findMany({
      where: { status: "published" },
      take: 2,
      include: { category: true, location: true },
    });
    diagnostics.staysCount = stays.length;
    diagnostics.sampleStay = stays[0]?.title || null;
  } catch (e: any) {
    diagnostics.staysError = e.message;
  }

  return NextResponse.json(diagnostics);
}
