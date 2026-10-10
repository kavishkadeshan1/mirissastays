"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractEmbedSrc } from "@/lib/map-utils";

interface Stay {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  locationId: number;
  pricePerNight: number | string;
  whatsappNumber: string | null;
  featuredImage: string;
  galleryJson: string | null;
  shortDesc: string;
  fullContent: string;
  amenitiesJson: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  metaDescription: string | null;
  mapEmbed: string | null;
  isFeatured: boolean;
  allowBooking: boolean;
  status: string;
  hostName?: string;
  category?: { name: string };
  location?: { name: string };
}

interface Guide {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  primaryKeyword: string | null;
  tags: string | null;
  authorName: string | null;
  authorRole: string | null;
  authorImage: string | null;
  authorBio: string | null;
  featuredImage: string | null;
  content: string;
  status: string;
  isFeatured: boolean;
  views: number;
  commentCount?: number;
}

interface Comment {
  id: number;
  guideId: number;
  authorName: string;
  authorEmail: string;
  comment: string;
  status: string;
  createdAt: string | Date;
  guideTitle?: string;
  guideSlug?: string;
}

interface PendingHost {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  businessRegNo: string | null;
  createdAt: string | Date;
}

interface Lead {
  id: number;
  stayId: number;
  stayTitle?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkinDate: string | Date;
  checkoutDate: string | Date;
  guestsCount: number;
  createdAt: string | Date;
}

interface Category {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface AdminDashboardClientProps {
  initialStays: Stay[];
  initialGuides: Guide[];
  initialComments: Comment[];
  initialPendingHosts: PendingHost[];
  initialLeads: Lead[];
  categories: Category[];
  locations: Location[];
  currentUser: { email: string; fullName: string };
}

const AVAILABLE_AMENITIES = [
  "Free Wi-Fi",
  "Air Conditioning",
  "Clean Linen",
  "Swimming Pool",
  "Ocean View",
  "Kitchen",
  "Breakfast Included",
  "Free Parking",
];

const DEFAULT_AUTHOR_AVATAR = "https://kavishkadeshan.me/profile1.jpg";

export default function AdminDashboardClient({
  initialStays,
  initialGuides,
  initialComments,
  initialPendingHosts,
  initialLeads,
  categories,
  locations,
  currentUser,
}: AdminDashboardClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "listings" | "guides" | "comments" | "hosts" | "leads" | "settings"
  >("listings");

  const [stays, setStays] = useState<Stay[]>(initialStays);
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [pendingHosts, setPendingHosts] =
    useState<PendingHost[]>(initialPendingHosts);
  const [leads] = useState<Lead[]>(initialLeads);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Selected guides for homepage
  const [featuredGuideIds, setFeaturedGuideIds] = useState<number[]>(
    guides.filter((g) => g.isFeatured).map((g) => g.id),
  );

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    email: currentUser.email,
    password: "",
    confirmPassword: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Stay Modal State
  const [isStayModalOpen, setIsStayModalOpen] = useState(false);
  const [stayFormData, setStayFormData] = useState({
    id: 0,
    title: "",
    categoryId: categories[0]?.id || 1,
    locationId: locations[0]?.id || 1,
    pricePerNight: "0.00",
    whatsappNumber: "",
    allowBooking: true,
    featuredImage: "",
    galleryImages: [] as string[],
    newGalleryUrls: "",
    shortDesc: "",
    fullContent: "",
    amenities: [] as string[],
    address: "",
    latitude: "",
    longitude: "",
    metaDescription: "",
    mapEmbed: "",
    isFeatured: false,
  });
  const [staySaving, setStaySaving] = useState(false);

  // Guide Modal State
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideFormData, setGuideFormData] = useState({
    id: 0,
    title: "",
    slug: "",
    metaTitle: "",
    primaryKeyword: "",
    tags: "",
    metaDescription: "",
    authorName: "Kavishka Deshan",
    authorRole: "Mirissa Native & Surf Guide",
    authorImage: DEFAULT_AUTHOR_AVATAR,
    authorBio:
      "Lifelong southern province local, surf enthusiast, and contributing editor at MirissaStays. Kavishka lives right in Mirissa and provides hands-on local recommendations on top stays, coastal excursions, and authentic Sri Lankan experiences.",
    featuredImage: "",
    status: "published",
    isFeatured: false,
    content: "",
  });
  const [guideSaving, setGuideSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalArticleViews = guides.reduce((acc, g) => acc + (g.views || 0), 0);

  // Stay Actions
  const handleToggleStayFeatured = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/stays/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        setStays((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isFeatured: !current } : s)),
        );
        showToast("Featured status updated successfully.");
      }
    } catch {
      showToast("Failed to update featured status", "error");
    }
  };

  const handleToggleStayStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/stays/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStays((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
        );
        showToast(`Listing status updated to ${newStatus}.`);
      }
    } catch {
      showToast("Failed to update listing status", "error");
    }
  };

  const openEditStayModal = (stay: Stay) => {
    let galleryArr: string[] = [];
    if (stay.galleryJson) {
      try {
        galleryArr = JSON.parse(stay.galleryJson);
      } catch {}
    }

    let amenitiesArr: string[] = [];
    if (stay.amenitiesJson) {
      try {
        amenitiesArr = JSON.parse(stay.amenitiesJson);
      } catch {}
    }

    setStayFormData({
      id: stay.id,
      title: stay.title,
      categoryId: stay.categoryId,
      locationId: stay.locationId,
      pricePerNight: String(stay.pricePerNight),
      whatsappNumber: stay.whatsappNumber || "",
      allowBooking: stay.allowBooking !== false,
      featuredImage: stay.featuredImage,
      galleryImages: galleryArr,
      newGalleryUrls: "",
      shortDesc: stay.shortDesc,
      fullContent: stay.fullContent,
      amenities: amenitiesArr,
      address: stay.address,
      latitude: stay.latitude ? String(stay.latitude) : "",
      longitude: stay.longitude ? String(stay.longitude) : "",
      metaDescription: stay.metaDescription || "",
      mapEmbed: stay.mapEmbed || "",
      isFeatured: Boolean(stay.isFeatured),
    });
    setIsStayModalOpen(true);
  };

  const handleUploadFile = async (file: File, folder: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  const handleSaveStay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaySaving(true);
    try {
      let finalGallery = [...stayFormData.galleryImages];
      if (stayFormData.newGalleryUrls.trim()) {
        const splitUrls = stayFormData.newGalleryUrls
          .split(/[\r\n,]+/)
          .map((u) => u.trim())
          .filter((u) => u && !finalGallery.includes(u));
        finalGallery = [...finalGallery, ...splitUrls];
      }

      const payload = {
        title: stayFormData.title,
        categoryId: stayFormData.categoryId,
        locationId: stayFormData.locationId,
        pricePerNight: parseFloat(stayFormData.pricePerNight) || 0,
        whatsappNumber: stayFormData.whatsappNumber,
        allowBooking: stayFormData.allowBooking,
        featuredImage: stayFormData.featuredImage,
        galleryJson: finalGallery,
        shortDesc: stayFormData.shortDesc,
        fullContent: stayFormData.fullContent,
        amenitiesJson: stayFormData.amenities,
        address: stayFormData.address,
        latitude: stayFormData.latitude
          ? parseFloat(stayFormData.latitude)
          : null,
        longitude: stayFormData.longitude
          ? parseFloat(stayFormData.longitude)
          : null,
        metaDescription: stayFormData.metaDescription,
        mapEmbed: stayFormData.mapEmbed,
        isFeatured: stayFormData.isFeatured,
      };

      const res = await fetch(`/api/admin/stays/${stayFormData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save property");
      const data = await res.json();

      setStays((prev) =>
        prev.map((s) =>
          s.id === stayFormData.id ? { ...s, ...data.stay } : s,
        ),
      );
      setIsStayModalOpen(false);
      showToast("Property and settings updated successfully.");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setStaySaving(false);
    }
  };

  // Guide Actions
  const handleToggleGuideFeatured = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        setGuides((prev) =>
          prev.map((g) => (g.id === id ? { ...g, isFeatured: !current } : g)),
        );
        setFeaturedGuideIds((prev) =>
          !current ? [...prev, id] : prev.filter((gid) => gid !== id),
        );
        showToast("Homepage featured status updated for article.");
      }
    } catch {
      showToast("Failed to toggle guide status", "error");
    }
  };

  const handleToggleGuideStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setGuides((prev) =>
          prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g)),
        );
        showToast(`Guide status updated to ${newStatus}.`);
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteGuide = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuides((prev) => prev.filter((g) => g.id !== id));
        showToast("Guide deleted successfully.");
      }
    } catch {
      showToast("Failed to delete guide", "error");
    }
  };

  const handleSaveHomepageSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/guides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredGuideIds }),
      });
      if (res.ok) {
        setGuides((prev) =>
          prev.map((g) => ({
            ...g,
            isFeatured: featuredGuideIds.includes(g.id),
          })),
        );
        showToast(
          "Homepage featured articles saved successfully (up to 4 articles displayed).",
        );
      }
    } catch {
      showToast("Failed to save homepage selection", "error");
    }
  };

  const openNewGuideModal = () => {
    setGuideFormData({
      id: 0,
      title: "",
      slug: "",
      metaTitle: "",
      primaryKeyword: "",
      tags: "",
      metaDescription: "",
      authorName: "Kavishka Deshan",
      authorRole: "Mirissa Native & Surf Guide",
      authorImage: DEFAULT_AUTHOR_AVATAR,
      authorBio:
        "Lifelong southern province local, surf enthusiast, and contributing editor at MirissaStays. Kavishka lives right in Mirissa and provides hands-on local recommendations on top stays, coastal excursions, and authentic Sri Lankan experiences.",
      featuredImage: "",
      status: "published",
      isFeatured: false,
      content: "",
    });
    setIsGuideModalOpen(true);
  };

  const openEditGuideModal = (g: Guide) => {
    setGuideFormData({
      id: g.id,
      title: g.title,
      slug: g.slug,
      metaTitle: g.metaTitle || "",
      primaryKeyword: g.primaryKeyword || "",
      tags: g.tags || "",
      metaDescription: g.metaDescription || "",
      authorName: g.authorName || "Kavishka Deshan",
      authorRole: g.authorRole || "Mirissa Native & Surf Guide",
      authorImage: g.authorImage || DEFAULT_AUTHOR_AVATAR,
      authorBio: g.authorBio || "",
      featuredImage: g.featuredImage || "",
      status: g.status || "published",
      isFeatured: Boolean(g.isFeatured),
      content: g.content || "",
    });
    setIsGuideModalOpen(true);
  };

  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuideSaving(true);
    try {
      const url = guideFormData.id
        ? `/api/admin/guides/${guideFormData.id}`
        : "/api/admin/guides";
      const method = guideFormData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guideFormData),
      });

      if (!res.ok) throw new Error("Failed to save guide");
      const data = await res.json();

      if (guideFormData.id) {
        setGuides((prev) =>
          prev.map((g) =>
            g.id === guideFormData.id ? { ...g, ...data.guide } : g,
          ),
        );
        showToast("Travel guide updated successfully.");
      } else {
        setGuides((prev) => [data.guide, ...prev]);
        showToast("Travel guide created successfully.");
      }
      setIsGuideModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setGuideSaving(false);
    }
  };

  const insertGuideTag = (startTag: string, endTag: string) => {
    const textarea = document.getElementById(
      "guide-content-area",
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = startTag + (selected || "Your text here") + endTag;
    const updated =
      text.substring(0, start) + replacement + text.substring(end);
    setGuideFormData({ ...guideFormData, content: updated });
  };

  // Comment Actions
  const handleToggleCommentStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
        showToast(`Comment status updated to ${newStatus}.`);
      }
    } catch {
      showToast("Failed to update comment status", "error");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this reader comment?")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        showToast("Reader comment deleted successfully.");
      }
    } catch {
      showToast("Failed to delete comment", "error");
    }
  };

  // Host Actions
  const handleHostAction = async (
    id: number,
    action: "active" | "suspended",
  ) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        setPendingHosts((prev) => prev.filter((h) => h.id !== id));
        showToast(
          action === "active"
            ? "Host approved successfully."
            : "Host rejected/suspended.",
        );
      }
    } catch {
      showToast("Failed to process host action", "error");
    }
  };

  // Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      showToast("Account settings updated successfully.");
      setSettingsForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Error updating settings",
        "error",
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 transition-all ${
            toastType === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toastType === "success" ? "✓" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Control Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage verified property listings, host verification, booking
            inquiries, SEO travel articles, and reader comments.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openNewGuideModal}
            className="bg-brand-600 hover:bg-brand-900 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center gap-1 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write New Guide
          </button>
          <Link
            href="/"
            target="_blank"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors text-sm inline-flex items-center gap-1"
          >
            View Site &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Stats Cards (AdSense & Engagement Insights) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Properties
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stays.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Active & Draft stays
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Articles
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {guides.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Published guides
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Article Views
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-1.5">
            <span>🔥</span> {totalArticleViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Live reader views
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reader Comments
          </div>
          <div className="text-2xl font-extrabold text-brand-600 mt-1 flex items-center gap-1.5">
            <span>💬</span> {comments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            User discussions (UGC)
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-slate-200">
        <nav
          className="-mb-px flex space-x-8 overflow-x-auto"
          aria-label="Tabs"
        >
          <button
            onClick={() => setActiveTab("listings")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "listings"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Property Listings</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "listings"
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {stays.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("guides")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "guides"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Travel Guides</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {guides.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "comments"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Reader Comments</span>
            <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
              {comments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("hosts")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "hosts"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Pending Hosts</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingHosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "leads"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Direct Inquiries</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>Account Settings</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: Listings Moderation */}
      {activeTab === "listings" && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Property & Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Pricing
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Gallery Photos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Featured
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {stays.map((stay) => {
                  let gPhotos: string[] = [];
                  try {
                    if (stay.galleryJson)
                      gPhotos = JSON.parse(stay.galleryJson);
                  } catch {}

                  return (
                    <tr
                      key={stay.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stay.featuredImage}
                            alt=""
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              <Link
                                href={`/stay/${stay.slug}`}
                                target="_blank"
                                className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                              >
                                {stay.title}
                                <svg
                                  className="w-3.5 h-3.5 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </Link>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {stay.hostName || "Host"} • {stay.address}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        ${Number(stay.pricePerNight).toFixed(2)}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          / night
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          <svg
                            className="w-3.5 h-3.5 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {gPhotos.length + 1} photos
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStayFeatured(stay.id, stay.isFeatured)
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            stay.isFeatured
                              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Click to toggle featured status"
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${stay.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>
                            {stay.isFeatured ? "Featured" : "Standard"}
                          </span>
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={stay.status}
                          onChange={(e) =>
                            handleToggleStayStatus(stay.id, e.target.value)
                          }
                          className="text-xs font-bold border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500 bg-slate-50 py-1 pl-2 pr-6 cursor-pointer"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <button
                          type="button"
                          onClick={() => openEditStayModal(stay)}
                          className="text-brand-700 hover:text-brand-900 font-bold bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-md border border-brand-200 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          Edit & Gallery
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {stays.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500 text-sm"
                    >
                      No properties found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Travel Guides & SEO Articles */}
      {activeTab === "guides" && (
        <div className="space-y-6">
          {/* Homepage Featured Articles Selector Card */}
          <div className="bg-gradient-to-r from-brand-50 via-sky-50 to-indigo-50 p-5 rounded-xl border border-brand-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏠</span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Homepage Featured Articles
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs ${
                      featuredGuideIds.length === 4
                        ? "bg-emerald-600"
                        : "bg-brand-600"
                    }`}
                  >
                    {featuredGuideIds.length} / 4 Selected
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Select exactly up to 4 travel articles to showcase in the
                  featured travel section on the MirissaStays Homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveHomepageSelection}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Homepage Selection
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {guides.map((g) => {
                const isSelected = featuredGuideIds.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-sm"
                        : "bg-white/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (featuredGuideIds.length < 4) {
                            setFeaturedGuideIds([...featuredGuideIds, g.id]);
                          } else {
                            showToast(
                              "You can only select up to 4 articles for the homepage",
                              "error",
                            );
                          }
                        } else {
                          setFeaturedGuideIds(
                            featuredGuideIds.filter((id) => id !== g.id),
                          );
                        }
                      }}
                      className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {g.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {Number(g.views).toLocaleString()} views
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            On Home
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* All Guides Table */}
          <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  All Travel Guides & Articles
                </h3>
                <p className="text-xs text-slate-500">
                  Edit titles, flat SEO slugs, keywords, authors, featured
                  status, and content.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewGuideModal}
                className="bg-brand-600 hover:bg-brand-900 text-white font-bold py-2 px-3.5 rounded-md text-xs transition-colors shadow-sm inline-flex items-center gap-1 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Article
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Article Title & Live URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Homepage (Max 4)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Views
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Comments
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {guides.map((guide) => (
                    <tr
                      key={guide.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={guide.featuredImage || "/placeholder.jpg"}
                            alt=""
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-slate-200"
                          />
                          <div className="max-w-md">
                            <div className="text-sm font-bold text-slate-900">
                              <Link
                                href={`/guides/${guide.slug}`}
                                target="_blank"
                                className="hover:text-brand-600 transition-colors"
                              >
                                {guide.title}
                              </Link>
                            </div>
                            <div className="text-xs font-mono text-slate-500 mt-0.5">
                              /guides/{guide.slug}/
                            </div>
                            {guide.metaTitle && (
                              <div className="text-xs text-slate-600 italic mt-0.5 truncate">
                                Meta: &quot;{guide.metaTitle}&quot;
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={guide.authorImage || DEFAULT_AUTHOR_AVATAR}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {guide.authorName || "Ruwan Jayasuriya"}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {guide.authorRole || "Editorial"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleGuideFeatured(
                              guide.id,
                              guide.isFeatured,
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            guide.isFeatured
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                          }`}
                          title="Toggle display on homepage"
                        >
                          <span>
                            {guide.isFeatured ? "⭐ On Home" : "☆ Not on Home"}
                          </span>
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                          <svg
                            className="w-3.5 h-3.5 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {Number(guide.views).toLocaleString()} views
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                          <svg
                            className="w-3.5 h-3.5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {guide.commentCount || 0} comments
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={guide.status}
                          onChange={(e) =>
                            handleToggleGuideStatus(guide.id, e.target.value)
                          }
                          className="text-xs font-bold border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500 bg-slate-50 py-1 pl-2 pr-6 cursor-pointer"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditGuideModal(guide)}
                          className="text-brand-700 hover:text-brand-900 font-bold bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-md border border-brand-200 transition-colors text-xs cursor-pointer"
                        >
                          Edit SEO & Content
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-red-700 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md border border-red-200 transition-colors text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {guides.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-slate-500 text-sm"
                      >
                        No articles created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reader Comments Moderation */}
      {activeTab === "comments" && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">
              Reader Comments Moderation
            </h3>
            <p className="text-xs text-slate-500">
              Review, approve, or delete comments submitted by website visitors
              on travel guides.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Commenter & Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Comment Body
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Article Guide
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {comments.map((c) => {
                  const initial = (c.authorName || "A").charAt(0).toUpperCase();
                  const dateStr = new Date(c.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {c.authorName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {c.authorEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-700 leading-relaxed max-w-md line-clamp-3">
                          {c.comment}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/guides/${c.guideSlug || "guide"}#comments`}
                          target="_blank"
                          className="text-xs font-bold text-brand-600 hover:text-brand-900 hover:underline max-w-xs truncate block"
                        >
                          {c.guideTitle || "View Article"}
                        </Link>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {dateStr}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleToggleCommentStatus(c.id, e.target.value)
                          }
                          className="text-xs font-bold border-slate-300 rounded focus:ring-brand-500 focus:border-brand-500 bg-slate-50 py-1 pl-2 pr-6 cursor-pointer"
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="spam">Spam</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-red-700 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md border border-red-200 transition-colors text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {comments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500 text-sm"
                    >
                      No reader comments submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Pending Hosts */}
      {activeTab === "hosts" && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
          {pendingHosts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No pending hosts to approve.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {pendingHosts.map((host) => {
                const regDate = new Date(host.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );
                return (
                  <li
                    key={host.id}
                    className="p-4 sm:px-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-brand-600 truncate">
                          {host.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {host.email} | {host.phone || "No phone"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-bold text-slate-700">
                            BR/NIC:
                          </span>{" "}
                          {host.businessRegNo || "Not provided"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Registered: {regDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleHostAction(host.id, "active")}
                          className="bg-green-100 text-green-800 px-3.5 py-1.5 rounded-md text-sm font-bold hover:bg-green-200 transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHostAction(host.id, "suspended")}
                          className="bg-red-100 text-red-800 px-3.5 py-1.5 rounded-md text-sm font-bold hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Tab 5: Direct Inquiries */}
      {activeTab === "leads" && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Guest Info
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Dates & Party
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {leads.map((lead) => {
                  const leadDate = new Date(lead.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  );
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {leadDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        {lead.stayTitle || "Property Inquiry"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="font-bold text-slate-900">
                          {lead.guestName}
                        </div>
                        <div>{lead.guestEmail}</div>
                        <div>{lead.guestPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {String(lead.checkinDate)} to{" "}
                        {String(lead.checkoutDate)}
                        <br />
                        <span className="font-semibold text-slate-800">
                          {lead.guestsCount} Guests
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-slate-500 text-sm"
                    >
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Account Settings */}
      {activeTab === "settings" && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">
              Admin Account Settings
            </h3>
            <p className="text-xs text-slate-500">
              Update your login email address and change your password.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveSettings} className="max-w-md space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Login Email Address
                </label>
                <input
                  type="email"
                  required
                  value={settingsForm.email}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-4">
                  Change Password (leave blank to keep current password)
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={settingsForm.password}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          password: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={settingsForm.confirmPassword}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="w-full bg-brand-600 hover:bg-brand-900 text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors text-sm disabled:opacity-60 cursor-pointer"
                >
                  {settingsLoading ? "Saving..." : "Save Account Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Admin Edit Property & Multi-Image Gallery */}
      {isStayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all my-8 max-w-3xl w-full border border-slate-200">
            <form onSubmit={handleSaveStay}>
              <div className="bg-white px-6 pt-6 pb-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-5">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Edit Property & Gallery
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsStayModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Listing Title
                      </label>
                      <input
                        type="text"
                        required
                        value={stayFormData.title}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={stayFormData.categoryId}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            categoryId: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border bg-white text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Location
                      </label>
                      <select
                        value={stayFormData.locationId}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            locationId: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border bg-white text-sm"
                      >
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Price per Night ($ USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={stayFormData.pricePerNight}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            pricePerNight: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        WhatsApp Direct Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="+94754361265"
                        value={stayFormData.whatsappNumber}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={stayFormData.allowBooking}
                          onChange={(e) =>
                            setStayFormData({
                              ...stayFormData,
                              allowBooking: e.target.checked,
                            })
                          }
                          className="mt-0.5 h-5 w-5 rounded border-emerald-400 text-brand-dark focus:ring-brand-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              Enable Direct Booking & WhatsApp Inquiries
                            </span>
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                              Direct Inquiries
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Uncheck this box for{" "}
                            <strong>Showcase Hotels & Verified Sights</strong>{" "}
                            (e.g. The Nine Mirissa, Mirissa Hills, Asaya Sands,
                            Paradise Beach Club). When unchecked, WhatsApp
                            number and price are optional, booking forms are
                            disabled, and visitors browse verified photos,
                            Google reviews, and Google Maps directions.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Featured Main Cover Image */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                      Featured Main Cover Image
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={stayFormData.featuredImage}
                          onChange={(e) =>
                            setStayFormData({
                              ...stayFormData,
                              featuredImage: e.target.value,
                            })
                          }
                          className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Or Upload From Computer
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              try {
                                const url = await handleUploadFile(
                                  e.target.files[0],
                                  "stays",
                                );
                                setStayFormData({
                                  ...stayFormData,
                                  featuredImage: url,
                                });
                                showToast("Cover image uploaded");
                              } catch {
                                showToast("Upload failed", "error");
                              }
                            }
                          }}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Gallery Manager */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          Photo Gallery (Multi-Image Support)
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Add multiple pictures to showcase the rooms, pool, and
                          views in the Airbnb-style mosaic grid.
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[11px] font-bold text-slate-600 mb-2">
                        Current Gallery Images (Click X to remove):
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {stayFormData.galleryImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-md overflow-hidden bg-slate-100 border border-slate-200 h-16"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setStayFormData({
                                  ...stayFormData,
                                  galleryImages:
                                    stayFormData.galleryImages.filter(
                                      (_, i) => i !== idx,
                                    ),
                                });
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        {stayFormData.galleryImages.length === 0 && (
                          <p className="text-xs text-slate-400 italic col-span-4">
                            No additional gallery photos yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Add Image Links (One URL per line or comma-separated):
                        </label>
                        <textarea
                          rows={3}
                          placeholder="https://...&#10;https://..."
                          value={stayFormData.newGalleryUrls}
                          onChange={(e) =>
                            setStayFormData({
                              ...stayFormData,
                              newGalleryUrls: e.target.value,
                            })
                          }
                          className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Upload Multiple Photos:
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files) {
                              const uploadedUrls: string[] = [];
                              for (let i = 0; i < e.target.files.length; i++) {
                                try {
                                  const url = await handleUploadFile(
                                    e.target.files[i],
                                    "stays",
                                  );
                                  uploadedUrls.push(url);
                                } catch {}
                              }
                              setStayFormData((prev) => ({
                                ...prev,
                                galleryImages: [
                                  ...prev.galleryImages,
                                  ...uploadedUrls,
                                ],
                              }));
                              showToast(
                                `Uploaded ${uploadedUrls.length} photos`,
                              );
                            }
                          }}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-brand-600 file:text-white hover:file:bg-brand-900 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Select one or more JPG, PNG, or WebP files.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Short Description (Card Teaser)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={stayFormData.shortDesc}
                      onChange={(e) =>
                        setStayFormData({
                          ...stayFormData,
                          shortDesc: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Content (Listing Details)
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={stayFormData.fullContent}
                      onChange={(e) =>
                        setStayFormData({
                          ...stayFormData,
                          fullContent: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {AVAILABLE_AMENITIES.map((amenity) => {
                        const checked =
                          stayFormData.amenities.includes(amenity);
                        return (
                          <label
                            key={amenity}
                            className="inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStayFormData({
                                    ...stayFormData,
                                    amenities: [
                                      ...stayFormData.amenities,
                                      amenity,
                                    ],
                                  });
                                } else {
                                  setStayFormData({
                                    ...stayFormData,
                                    amenities: stayFormData.amenities.filter(
                                      (a) => a !== amenity,
                                    ),
                                  });
                                }
                              }}
                              className="h-4 w-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                            />
                            <span className="ml-2 text-xs text-slate-700">
                              {amenity}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-200 pt-4">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={stayFormData.address}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            address: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5.9383"
                        value={stayFormData.latitude}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            latitude: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 80.4774"
                        value={stayFormData.longitude}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            longitude: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Meta Description (SEO)
                      </label>
                      <input
                        type="text"
                        required
                        value={stayFormData.metaDescription}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            metaDescription: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Google Maps Embed Code or Share Link
                      </label>
                      <textarea
                        rows={2}
                        placeholder='Paste Google Maps embed code (<iframe src="..."></iframe>) or Google Maps URL'
                        value={stayFormData.mapEmbed}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            mapEmbed: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Paste iframe code directly from Google Maps (Share
                        &rarr; Embed a map) OR use Latitude & Longitude above.
                        100% free with no API key needed.
                      </p>
                      {(() => {
                        const embedSrc =
                          extractEmbedSrc(stayFormData.mapEmbed) ||
                          (stayFormData.latitude && stayFormData.longitude
                            ? `https://maps.google.com/maps?q=${stayFormData.latitude},${stayFormData.longitude}&hl=en&z=16&output=embed`
                            : null);
                        if (!embedSrc) return null;
                        return (
                          <div className="mt-2.5 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                            <div className="px-2.5 py-1 bg-slate-100 text-[11px] font-semibold text-slate-600 border-b border-slate-200 flex items-center justify-between">
                              <span>Live Map Preview</span>
                              <span className="text-[10px] text-emerald-700 font-bold uppercase">Ready</span>
                            </div>
                            <iframe
                              src={embedSrc}
                              title="Map preview"
                              className="w-full h-44 border-0"
                              loading="lazy"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 mt-5">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={stayFormData.isFeatured}
                        onChange={(e) =>
                          setStayFormData({
                            ...stayFormData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="mt-0.5 h-5 w-5 rounded border-amber-400 text-brand-dark focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            Featured Property
                          </span>
                          <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            Featured
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Tick this box to display the &quot;Featured&quot;
                          badge on property cards and pin this listing to the
                          top of search results.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={staySaving}
                  className="inline-flex justify-center rounded-lg shadow-sm px-5 py-2.5 bg-brand-600 text-sm font-bold text-white hover:bg-brand-900 focus:outline-none transition-colors cursor-pointer disabled:opacity-60"
                >
                  {staySaving ? "Saving..." : "Save Property & Gallery"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsStayModalOpen(false)}
                  className="inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-5 py-2.5 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: WordPress-Style Travel Guide Add / Edit Modal */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all my-8 max-w-4xl w-full border border-slate-200">
            <form onSubmit={handleSaveGuide}>
              <div className="bg-white px-6 pt-6 pb-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {guideFormData.id
                        ? `Edit Travel Guide: ${guideFormData.title}`
                        : "Write New Travel Guide"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      WordPress-style SEO article editor with tags, primary
                      keywords, and flat URLs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Guide Title (H1)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Coconut Tree Hill"
                        value={guideFormData.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newSlug = !guideFormData.id
                            ? val
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)+/g, "")
                            : guideFormData.slug;
                          setGuideFormData({
                            ...guideFormData,
                            title: val,
                            slug: newSlug,
                          });
                        }}
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Permanent SEO Slug (Flat Path)
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-mono">
                          /guides/
                        </span>
                        <input
                          type="text"
                          placeholder="coconut-tree-hill-mirissa"
                          value={guideFormData.slug}
                          onChange={(e) =>
                            setGuideFormData({
                              ...guideFormData,
                              slug: e.target.value,
                            })
                          }
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 text-xs font-mono focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO & Metadata Optimizer Block */}
                  <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-200">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-900 mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-brand-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      SEO & Metadata Optimizer
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[11px] font-bold text-slate-700">
                            Recommended Meta Title (Under 60 chars):
                          </label>
                          <span
                            className={`text-[10px] font-bold ${
                              guideFormData.metaTitle.length > 60
                                ? "text-red-500"
                                : "text-slate-400"
                            }`}
                          >
                            {guideFormData.metaTitle.length} / 60
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Coconut Tree Hill Mirissa: Photo Spots & Best Time to Visit"
                          value={guideFormData.metaTitle}
                          onChange={(e) =>
                            setGuideFormData({
                              ...guideFormData,
                              metaTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Target Primary Keyword:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. coconut tree hill mirissa"
                            value={guideFormData.primaryKeyword}
                            onChange={(e) =>
                              setGuideFormData({
                                ...guideFormData,
                                primaryKeyword: e.target.value,
                              })
                            }
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Secondary / Long-Tail Keywords (Tags):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. coconut tree hill sunrise, photo spots, how to get there"
                            value={guideFormData.tags}
                            onChange={(e) =>
                              setGuideFormData({
                                ...guideFormData,
                                tags: e.target.value,
                              })
                            }
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                          />
                          <span className="text-[10px] text-slate-400">
                            Separate keywords with commas.
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Meta Description (150-160 chars recommended):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Search snippet summarizing the article..."
                          value={guideFormData.metaDescription}
                          onChange={(e) =>
                            setGuideFormData({
                              ...guideFormData,
                              metaDescription: e.target.value,
                            })
                          }
                          className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Article Writer & Profile Photo */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-brand-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Article Writer & Profile Photo
                    </h4>

                    <div className="flex flex-col sm:flex-row gap-4 items-start mb-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <img
                          src={
                            guideFormData.authorImage || DEFAULT_AUTHOR_AVATAR
                          }
                          alt="Author Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-brand-600 shadow-sm bg-white"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Photo Preview
                        </span>
                      </div>

                      <div className="flex-grow w-full space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Writer Full Name:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Kavishka Deshan"
                              value={guideFormData.authorName}
                              onChange={(e) =>
                                setGuideFormData({
                                  ...guideFormData,
                                  authorName: e.target.value,
                                })
                              }
                              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Writer Title / Specialty:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Mirissa Native & Surf Guide"
                              value={guideFormData.authorRole}
                              onChange={(e) =>
                                setGuideFormData({
                                  ...guideFormData,
                                  authorRole: e.target.value,
                                })
                              }
                              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Writer Photo URL:
                            </label>
                            <input
                              type="url"
                              placeholder="https://kavishkadeshan.me/profile1.jpg"
                              value={guideFormData.authorImage}
                              onChange={(e) =>
                                setGuideFormData({
                                  ...guideFormData,
                                  authorImage: e.target.value,
                                })
                              }
                              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Or Upload Profile Picture:
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  try {
                                    const url = await handleUploadFile(
                                      e.target.files[0],
                                      "authors",
                                    );
                                    setGuideFormData({
                                      ...guideFormData,
                                      authorImage: url,
                                    });
                                    showToast("Author photo uploaded");
                                  } catch {
                                    showToast("Upload failed", "error");
                                  }
                                }
                              }}
                              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-brand-50 file:text-brand-700 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Writer Bio (Shown at bottom of article & in schema):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Local background, insider experience, recommendations..."
                        value={guideFormData.authorBio}
                        onChange={(e) =>
                          setGuideFormData({
                            ...guideFormData,
                            authorBio: e.target.value,
                          })
                        }
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                      />
                    </div>
                  </div>

                  {/* Imagery, Status & Homepage Feature */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={guideFormData.featuredImage}
                        onChange={(e) =>
                          setGuideFormData({
                            ...guideFormData,
                            featuredImage: e.target.value,
                          })
                        }
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Or Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            try {
                              const url = await handleUploadFile(
                                e.target.files[0],
                                "guides",
                              );
                              setGuideFormData({
                                ...guideFormData,
                                featuredImage: url,
                              });
                              showToast("Cover image uploaded");
                            } catch {
                              showToast("Upload failed", "error");
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-brand-50 file:text-brand-700 cursor-pointer"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Publication Status
                      </label>
                      <select
                        value={guideFormData.status}
                        onChange={(e) =>
                          setGuideFormData({
                            ...guideFormData,
                            status: e.target.value,
                          })
                        }
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border bg-white text-xs font-semibold"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1 flex items-center pt-3 sm:pt-4">
                      <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={guideFormData.isFeatured}
                          onChange={(e) =>
                            setGuideFormData({
                              ...guideFormData,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                        />
                        <span>⭐ Feature on Home (Top 4)</span>
                      </label>
                    </div>
                  </div>

                  {/* Rich Article Body Content */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Article Content (HTML formatting allowed)
                      </label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => insertGuideTag("<h2>", "</h2>")}
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertGuideTag("<h3>", "</h3>")}
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertGuideTag("<strong>", "</strong>")
                          }
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                        >
                          Bold
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertGuideTag("<ul>\n<li>", "</li>\n</ul>")
                          }
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 hover:bg-slate-300 rounded text-slate-700 cursor-pointer"
                        >
                          List
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="guide-content-area"
                      rows={12}
                      placeholder="Write article content here..."
                      value={guideFormData.content}
                      onChange={(e) =>
                        setGuideFormData({
                          ...guideFormData,
                          content: e.target.value,
                        })
                      }
                      className="w-full font-mono text-xs rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 border leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={guideSaving}
                  className="inline-flex justify-center rounded-lg shadow-sm px-5 py-2.5 bg-brand-600 text-sm font-bold text-white hover:bg-brand-900 focus:outline-none transition-colors cursor-pointer disabled:opacity-60"
                >
                  {guideSaving ? "Saving..." : "Save & Publish Guide"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(false)}
                  className="inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-5 py-2.5 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
