import React from "react";
import prisma from "@/lib/prisma";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    include: { _count: { select: { stays: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Destinations & Locations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Southern Sri Lanka coastal regions, hubs, and active listings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Destination</th>
                <th className="p-4">Slug</th>
                <th className="p-4">SEO Landing Title</th>
                <th className="p-4">Active Accommodations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {locations.map((loc) => (
                <tr
                  key={loc.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 font-bold text-slate-900 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>{loc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{loc.slug}</td>
                  <td className="p-4 text-slate-600 max-w-sm">
                    {loc.metaTitle || "—"}
                  </td>
                  <td className="p-4 font-bold text-brand-600">
                    {loc._count.stays}{" "}
                    {loc._count.stays === 1 ? "Stay" : "Stays"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
