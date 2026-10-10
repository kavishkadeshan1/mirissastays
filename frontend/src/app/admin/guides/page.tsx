"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  Check,
  Trash2,
  ShieldAlert,
  Eye,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GuideItem {
  id: number;
  title: string;
  slug: string;
  views: number;
  status: string;
  isFeatured: boolean;
  authorName: string | null;
  createdAt: string;
}

interface CommentItem {
  id: number;
  guideId: number;
  authorName: string;
  authorEmail: string;
  comment: string;
  status: string;
  createdAt: string;
  guide: { title: string; slug: string };
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/guides-list");
      if (res.ok) {
        const data = await res.json();
        setGuides(data.guides || []);
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommentStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* Travel Guides */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Travel Guides & Editorial
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage local articles, photography guides, and reader views.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Guide Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">View Article</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {guides.map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900">
                      <div>{g.title}</div>
                      <div className="text-[11px] text-slate-400">
                        /{g.slug}
                      </div>
                    </td>
                    <td className="p-4">{g.authorName || "Kavishka Deshan"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{g.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          g.isFeatured
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {g.isFeatured ? "Featured" : "Normal"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase bg-emerald-100 text-emerald-700">
                        {g.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/guides/${g.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-bold"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reader Comments Moderation */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reader Comments Moderation ({comments.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Approve or filter community responses to travel guides.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Guide</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {comments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No reader comments submitted yet.
                    </td>
                  </tr>
                ) : (
                  comments.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {c.authorName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.authorEmail}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {c.guide?.title || "Guide"}
                      </td>
                      <td className="p-4 max-w-xs text-slate-600 leading-relaxed">
                        {c.comment}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            c.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : c.status === "spam"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleCommentStatus(c.id, "approved")
                              }
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve comment"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {c.status !== "spam" && (
                            <button
                              onClick={() => handleCommentStatus(c.id, "spam")}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Mark as spam"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete comment"
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
      </div>
    </div>
  );
}
