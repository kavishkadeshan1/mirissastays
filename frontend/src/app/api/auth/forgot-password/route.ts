import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import prisma from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = z.string().email().max(150).safeParse(body.email);
    if (!result.success)
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL;
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM || !appUrl)
      return NextResponse.json(
        {
          error:
            "Password recovery is temporarily unavailable. Please contact our team.",
        },
        { status: 503 },
      );
    const response = () => NextResponse.json({ success: true });
    const user = await prisma.user.findUnique({
      where: { email: result.data.trim().toLowerCase() },
    });
    if (
      !user ||
      (user.resetExpires &&
        user.resetExpires.getTime() > Date.now() + 50 * 60 * 1000)
    )
      return response();
    const raw = randomBytes(32).toString("hex");
    const token = createHash("sha256").update(raw).digest("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const url = new URL("/reset-password", appUrl);
    url.searchParams.set("token", raw);
    const mail = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      ...(process.env.SMTP_USER
        ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
        : {}),
    });
    try {
      await mail.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: "Reset your MirissaStays password",
        text:
          "Use this link within one hour to reset your password:\n\n" +
          url.href +
          "\n\nIf you did not request this, you can ignore this email.",
      });
    } catch {
      await prisma.user.updateMany({
        where: { id: user.id, resetToken: token },
        data: { resetToken: null, resetExpires: null },
      });
      console.error("Password recovery delivery failed");
    }
    return response();
  } catch {
    return NextResponse.json(
      { error: "Recovery is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
