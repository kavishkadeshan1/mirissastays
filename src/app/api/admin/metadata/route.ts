import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.location.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return NextResponse.json({ categories, locations });
}
