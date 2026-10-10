import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);
    const body = await req.json();

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, lead });
  } catch (err: unknown) {
    console.error("Lead PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const id = parseInt((await params).id, 10);

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch (err: unknown) {
    console.error("Lead DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 },
    );
  }
}
