import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const result = z
      .object({
        token: z.string().regex(/^[a-f0-9]{64}$/),
        password: z.string().min(8).max(128),
      })
      .safeParse(await req.json());
    if (!result.success)
      return NextResponse.json(
        {
          error:
            "Use a valid reset link and a password of at least 8 characters.",
        },
        { status: 400 },
      );
    const token = createHash("sha256").update(result.data.token).digest("hex");
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });
    if (!user)
      return NextResponse.json(
        {
          error:
            "This link has expired or has already been used. Please request a new one.",
        },
        { status: 400 },
      );
    const passwordHash = await hashPassword(result.data.password);
    const updated = await prisma.user.updateMany({
      where: {
        id: user.id,
        resetToken: token,
        resetExpires: { gt: new Date() },
      },
      data: { passwordHash, resetToken: null, resetExpires: null },
    });
    if (!updated.count)
      return NextResponse.json(
        { error: "This link is no longer valid. Request a new one." },
        { status: 400 },
      );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to reset your password. Please try again." },
      { status: 500 },
    );
  }
}
