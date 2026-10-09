import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbInfo = await prisma.$queryRaw`SELECT DATABASE() as current_database, USER() as current_user`;
    let tables: any = [];
    try {
      tables = await prisma.$queryRaw`SHOW TABLES`;
    } catch {}

    let staysCount = 0;
    try {
      staysCount = await prisma.stay.count();
    } catch (e: any) {
      return NextResponse.json({
        success: false,
        status: "connected_but_tables_missing",
        message: "Connected to MySQL, but tables are missing. Please import mirissastays_final.sql in phpMyAdmin.",
        dbInfo,
        tables,
        error: e.message,
      });
    }

    return NextResponse.json({
      success: true,
      status: "connected_and_tables_ready",
      dbInfo,
      tablesCount: Array.isArray(tables) ? tables.length : 0,
      staysCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: "connection_failed",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
