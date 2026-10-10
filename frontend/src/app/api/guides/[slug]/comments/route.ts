import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const body = await req.json();
    const result = commentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid comment data" },
        { status: 400 },
      );
    }

    const { guideId, authorName, authorEmail, comment, honeypot } = result.data;

    // Honeypot spam defense
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: "Comment received" });
    }

    const newComment = await prisma.guideComment.create({
      data: {
        guideId,
        authorName,
        authorEmail,
        comment,
        status: "approved",
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: newComment.id,
        guideId: newComment.guideId,
        authorName: newComment.authorName,
        authorEmail: newComment.authorEmail,
        comment: newComment.comment,
        status: newComment.status,
        createdAt: newComment.createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error("Guide comment error:", err);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 },
    );
  }
}
