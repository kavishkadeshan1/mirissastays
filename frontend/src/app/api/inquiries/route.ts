import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const {
      stayId,
      guestName,
      guestEmail,
      guestPhone,
      checkinDate,
      checkoutDate,
      guestsCount,
      specialRequests,
      honeypot,
    } = result.data;

    // Honeypot spam defense
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      include: { host: true },
    });

    if (!stay || stay.status !== "published") {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    if (
      !stay.allowBooking ||
      stay.whatsappNumber.replace(/\D/g, "").length < 6
    ) {
      return NextResponse.json(
        { error: "Direct inquiries are not available for this property." },
        { status: 400 },
      );
    }

    const session = await getSession();
    const guestId = session?.userId || null;

    const lead = await prisma.lead.create({
      data: {
        stayId,
        guestId,
        guestName,
        guestEmail,
        guestPhone,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        guestsCount,
        specialRequests: specialRequests || null,
        status: "new",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted directly to the host.",
        leadId: lead.id,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("Inquiries API error:", err);
    return NextResponse.json(
      { error: "Failed to submit booking inquiry." },
      { status: 500 },
    );
  }
}
