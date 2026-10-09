"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Star,
  CheckCircle,
  Eye,
  Trash2,
  ExternalLink,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StayAdmin {
  id: number;
  title: string;
  slug: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  status: string;
  isFeatured: boolean;
  featuredImage: string;
  category: { name: string; id: number };
  location: { name: string; id: number };
  host: { fullName: string };
}

export default function AdminStaysPage() {
  const [stays, setStays] = useState<StayAdmin[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // New Stay Form State
  const [formData, setFormData] = useState({
    title: "",
    categoryId: 1,
    locationId: 1,
    pricePerNight: 50,
    metaDescription: "",
    shortDesc: "",
    fullContent: "",
    featuredImage: "",
    address: "Mirissa Beach Road, Mirissa",
    whatsappNumber: "+94760224529",
    allowBooking: true,
    isFeatured: false,
    status: "published",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const [staysRes, metaRes] = await Promise.all([
        fetch("/api/admin/stays-list"),
        fetch("/api/admin/metadata"),
      ]);

      if (staysRes.ok) {
        const data = await staysRes.json();
        setStays(data.stays || []);
      }
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setCategories(metaData.categories || []);
        setLocations(metaData.locations || []);
        if (metaData.categories?.[0])
          setFormData((prev) => ({
            ...prev,
            categoryId: metaData.categories[0].id,
          }));
        if (metaData.locations?.[0])
          setFormData((prev) => ({
            ...prev,
            locationId: metaData.locations[0].id,
          }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/stays/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStays(
          stays.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/stays/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      if (res.ok) {
        setStays(
          stays.map((s) =>
            s.id === id ? { ...s, isFeatured: !currentFeatured } : s,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`))
      return;
    try {
      const res = await fetch(`/api/admin/stays/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStays(stays.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "stays");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData({ ...formData, featuredImage: data.url });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateStay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchStays();
      } else {
        alert(data.error || "Failed to create stay");
      }
    } catch {
      alert("Error submitting property");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStays = stays.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Accommodations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage properties, rates, featured badges, and publish status.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Total: {filteredStays.length} properties
        </span>
      </div>

      {/* Stays Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Starting Rate</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading accommodations...
                  </td>
                </tr>
              ) : filteredStays.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No properties match your search.
                  </td>
                </tr>
              ) : (
                filteredStays.map((stay) => (
                  <tr
                    key={stay.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={stay.featuredImage || "/social-share.jpg"}
                            alt={stay.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {stay.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            /{stay.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{stay.category?.name || "Stay"}</td>
                    <td className="p-4">{stay.location?.name || "Mirissa"}</td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatPrice(stay.pricePerNight, stay.currency)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{Number(stay.rating).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          handleToggleFeatured(stay.id, stay.isFeatured)
                        }
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${
                          stay.isFeatured
                            ? "bg-brand-100 text-brand-700"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {stay.isFeatured ? "★ Featured" : "Normal"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(stay.id, stay.status)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${
                          stay.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {stay.status}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/stay/${stay.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(stay.id, stay.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Add New Property
                </h3>
                <p className="text-xs text-slate-500">
                  Create a verified stay listing
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStay} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Garden Beach Villa"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Destination *
                  </label>
                  <select
                    value={formData.locationId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationId: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Price per Night ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerNight: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Featured Photo *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Image URL or upload file"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featuredImage: e.target.value,
                      })
                    }
                    className="flex-1 text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="One sentence summary for search cards"
                  value={formData.shortDesc}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDesc: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Description (HTML or Text) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed property highlights, rooms, amenities, location tips..."
                  value={formData.fullContent}
                  onChange={(e) =>
                    setFormData({ ...formData, fullContent: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-bold text-slate-700">
                    Mark as Featured Stay
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {submitting ? "Saving..." : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
