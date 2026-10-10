import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.errors[0]?.message || "Invalid registration data",
        },
        { status: 400 },
      );
    }

    const { fullName, email, phone, password, role, businessRegNo } =
      result.data;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    // Hosts start as pending awaiting admin verification; guests start as active
    const status = role === "host" ? "pending" : "active";

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        passwordHash,
        role,
        status,
        businessRegNo: businessRegNo?.trim() || null,
      },
    });

    // If host is pending approval, don't auto-login into host portal
    if (status === "pending") {
      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message:
          "Your host registration was submitted successfully. Our administrators will review your property credentials and activate your account.",
      });
    }

    // Auto-login for active guests
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      pendingApproval: false,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("Register route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
