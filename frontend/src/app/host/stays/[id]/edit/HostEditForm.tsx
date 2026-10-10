"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, AlertCircle } from "lucide-react";

interface StayEditData {
  id: number;
  title: string;
  categoryId: number;
  locationId: number;
  pricePerNight: number;
  featuredImage: string;
  address: string;
  mapEmbed?: string | null;
  whatsappNumber: string;
  shortDesc: string;
  fullContent: string;
  amenities: string[];
}

export default function HostEditForm({
  stay,
  categories,
  locations,
}: {
  stay: StayEditData;
  categories: { id: number; name: string }[];
  locations: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(stay);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableAmenities = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Clean Linen",
    "Swimming Pool",
    "Ocean View",
    "Kitchen",
    "Breakfast Included",
    "Free Parking",
  ];

  const handleToggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
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
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/host/stays/${stay.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update property");
      }

      router.push("/host");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error saving property");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Property Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Category *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: Number(e.target.value) })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Destination *
          </label>
          <select
            value={formData.locationId}
            onChange={(e) =>
              setFormData({ ...formData, locationId: Number(e.target.value) })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Starting Rate ($ USD / night) *
          </label>
          <input
            type="number"
            required
            min={0}
            value={formData.pricePerNight}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerNight: Number(e.target.value),
              })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            WhatsApp Phone Number *
          </label>
          <input
            type="text"
            required
            value={formData.whatsappNumber}
            onChange={(e) =>
              setFormData({ ...formData, whatsappNumber: e.target.value })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Featured Photo *
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            required
            value={formData.featuredImage}
            onChange={(e) =>
              setFormData({ ...formData, featuredImage: e.target.value })
            }
            className="flex-1 text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl inline-flex items-center gap-1.5 transition-colors">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
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
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Address *
        </label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {availableAmenities.map((amenity) => (
            <button
              type="button"
              key={amenity}
              onClick={() => handleToggleAmenity(amenity)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                formData.amenities.includes(amenity)
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Short Summary *
        </label>
        <textarea
          rows={2}
          required
          value={formData.shortDesc}
          onChange={(e) =>
            setFormData({ ...formData, shortDesc: e.target.value })
          }
          className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Full Description *
        </label>
        <textarea
          rows={5}
          required
          value={formData.fullContent}
          onChange={(e) =>
            setFormData({ ...formData, fullContent: e.target.value })
          }
          className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y"
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <Link
          href="/host"
          className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
        >
          {submitting ? "Saving..." : "Update Listing"}
        </button>
      </div>
    </form>
  );
}
