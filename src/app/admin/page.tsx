import React from "react";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [stays, guides, comments, pendingHosts, leads, categories, locations] =
    await Promise.all([
      prisma.stay.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          location: { select: { name: true } },
          host: { select: { fullName: true } },
        },
      }),
      prisma.guide.findMany({
        orderBy: [{ views: "desc" }, { id: "desc" }],
        include: {
          _count: { select: { comments: true } },
        },
      }),
      prisma.guideComment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          guide: { select: { title: true, slug: true } },
        },
      }),
      prisma.user.findMany({
        where: { role: "host", status: "pending" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          stay: { select: { title: true } },
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.location.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);

  const formattedStays = stays.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    categoryId: s.categoryId,
    locationId: s.locationId,
    pricePerNight: Number(s.pricePerNight),
    whatsappNumber: s.whatsappNumber,
    featuredImage: s.featuredImage,
    galleryJson: s.galleryJson,
    shortDesc: s.shortDesc,
    fullContent: s.fullContent,
    amenitiesJson: s.amenitiesJson,
    address: s.address,
    latitude: s.latitude ? Number(s.latitude) : null,
    longitude: s.longitude ? Number(s.longitude) : null,
    metaDescription: s.metaDescription,
    mapEmbed: s.mapEmbed,
    isFeatured: Boolean(s.isFeatured),
    allowBooking: Boolean(s.allowBooking),
    status: s.status,
    hostName: s.host?.fullName || "Verified Host",
    category: s.category ? { name: s.category.name } : undefined,
    location: s.location ? { name: s.location.name } : undefined,
  }));

  const formattedGuides = guides.map((g) => ({
    id: g.id,
    title: g.title,
    slug: g.slug,
    metaTitle: g.metaTitle,
    metaDescription: g.metaDescription,
    primaryKeyword: g.primaryKeyword,
    tags: g.tags,
    authorName: g.authorName,
    authorRole: g.authorRole,
    authorImage: g.authorImage,
    authorBio: g.authorBio,
    featuredImage: g.featuredImage,
    content: g.content,
    status: g.status,
    isFeatured: Boolean(g.isFeatured),
    views: g.views || 0,
    commentCount: g._count?.comments || 0,
  }));

  const formattedComments = comments.map((c) => ({
    id: c.id,
    guideId: c.guideId,
    authorName: c.authorName,
    authorEmail: c.authorEmail,
    comment: c.comment,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    guideTitle: c.guide?.title,
    guideSlug: c.guide?.slug,
  }));

  const formattedHosts = pendingHosts.map((h) => ({
    id: h.id,
    fullName: h.fullName,
    email: h.email,
    phone: h.phone,
    businessRegNo: h.businessRegNo,
    createdAt: h.createdAt.toISOString(),
  }));

  const formattedLeads = leads.map((l) => ({
    id: l.id,
    stayId: l.stayId,
    stayTitle: l.stay?.title,
    guestName: l.guestName,
    guestEmail: l.guestEmail,
    guestPhone: l.guestPhone,
    checkinDate: l.checkinDate,
    checkoutDate: l.checkoutDate,
    guestsCount: l.guestsCount ?? 2,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialStays={formattedStays}
      initialGuides={formattedGuides}
      initialComments={formattedComments}
      initialPendingHosts={formattedHosts}
      initialLeads={formattedLeads}
      categories={categories}
      locations={locations}
      currentUser={{ email: admin.email, fullName: admin.fullName }}
    />
  );
}
