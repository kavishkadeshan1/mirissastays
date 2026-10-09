import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const email = body.email?.trim()?.toLowerCase();
    const password = body.password?.trim();
    const confirmPassword = body.confirmPassword?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email cannot be empty" },
        { status: 400 },
      );
    }

    // Check if email already used by someone else
    const existing = await prisma.user.findFirst({
      where: {
        email,
        id: { not: admin.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "That email is already taken by another account" },
        { status: 400 },
      );
    }

    let passwordHash: string | undefined = undefined;
    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: "Passwords do not match" },
          { status: 400 },
        );
      }
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 400 },
        );
      }
      passwordHash = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id: admin.id },
      data: {
        email,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin account settings updated successfully",
      user: {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
      },
    });
  } catch (err: unknown) {
    console.error("Account settings error:", err);
    return NextResponse.json(
      { error: "Failed to update account settings" },
      { status: 500 },
    );
  }
}
