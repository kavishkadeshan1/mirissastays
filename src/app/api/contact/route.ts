import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    // Anti-spam honeypot
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: "Message sent" });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Message sent successfully. Our team will get back to you shortly.",
      contactId: contact.id,
    });
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send contact message." },
      { status: 500 },
    );
  }
}
