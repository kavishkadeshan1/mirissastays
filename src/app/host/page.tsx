import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Home,
  MessageSquare,
  Star,
  ExternalLink,
  Edit3,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HostDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const stays = await prisma.stay.findMany({
    where: { hostId: user.id },
    include: {
      category: { select: { name: true } },
      location: { select: { name: true } },
      leads: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInquiries = stays.reduce((acc, s) => acc + s.leads.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Host Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your accommodations and direct guest communications.
          </p>
        </div>
        <Link
          href="/host/stays/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Property</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Properties
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stays.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Listed under your account
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Inquiries
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalInquiries}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Direct guest inquiries received
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Published
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stays.filter((s) => s.status === "published").length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Active and visible to travelers
          </div>
        </div>
      </div>

      {/* Stays List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Properties</h2>
        </div>

        {stays.length === 0 ? (
          <div className="p-12 text-center">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">
              No accommodations listed yet
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
              Add your villa, guesthouse, or hotel to start receiving direct
              WhatsApp guest inquiries.
            </p>
            <Link
              href="/host/stays/new"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Add Your First Stay
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stays.map((stay) => (
              <div
                key={stay.id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={stay.featuredImage || "/social-share.jpg"}
                      alt={stay.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {stay.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {stay.category.name} • {stay.location.name} • Starting at{" "}
                      {formatPrice(
                        Number(stay.pricePerNight),
                        stay.currency || "USD",
                      )}{" "}
                      / night
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          stay.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {stay.status === "published"
                          ? "Published"
                          : "Pending Admin Approval"}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {stay.leads.length} inquiries received
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {stay.status === "published" && (
                    <Link
                      href={`/stay/${stay.slug}`}
                      target="_blank"
                      className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      title="View live page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/host/stays/${stay.id}/edit`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
