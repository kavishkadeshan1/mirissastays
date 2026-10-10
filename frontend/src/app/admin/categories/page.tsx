import React from "react";
import prisma from "@/lib/prisma";
import { FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { stays: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Stay Categories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review accommodation classifications and SEO landing pages.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">SEO Title</th>
                <th className="p-4">Active Properties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 font-bold text-slate-900 text-sm">
                    {c.name}
                  </td>
                  <td className="p-4 font-mono text-slate-500">{c.slug}</td>
                  <td className="p-4 text-slate-600 max-w-sm">
                    {c.metaTitle || "—"}
                  </td>
                  <td className="p-4 font-bold text-brand-600">
                    {c._count.stays}{" "}
                    {c._count.stays === 1 ? "Property" : "Properties"}
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
