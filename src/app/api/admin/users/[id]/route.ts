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

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.role !== undefined && { role: body.role }),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    console.error("User PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
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

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err: unknown) {
    console.error("User DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
