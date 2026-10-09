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

    const comment = await prisma.guideComment.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err: unknown) {
    console.error("Comment PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update comment" },
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

    await prisma.guideComment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (err: unknown) {
    console.error("Comment DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
