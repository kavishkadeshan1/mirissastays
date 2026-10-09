"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { GuideCommentItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface GuideCommentSectionProps {
  guideId: number;
  guideSlug: string;
  initialComments: GuideCommentItem[];
}

export default function GuideCommentSection({
  guideId,
  guideSlug,
  initialComments,
}: GuideCommentSectionProps) {
  const [comments, setComments] = useState<GuideCommentItem[]>(initialComments);
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    comment: "",
    honeypot: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/guides/${guideSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guideId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post comment.");
      }

      setSuccess(true);
      if (data.comment) {
        setComments([data.comment, ...comments]);
      }
      setFormData({
        authorName: "",
        authorEmail: "",
        comment: "",
        honeypot: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while posting your comment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="comments" className="mt-16 pt-12 border-t border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Reader Discussion ({comments.length})
          </h3>
          <p className="text-xs text-slate-500">
            Share your travel experiences and questions
          </p>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12">
        <h4 className="text-base font-extrabold text-slate-900 mb-2">
          Leave a Comment
        </h4>
        <p className="text-xs text-slate-500 mb-5">
          Your email address will not be published.
        </p>

        {success && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Thank you for sharing! Your comment has been posted.</span>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="website_url"
            value={formData.honeypot}
            onChange={(e) =>
              setFormData({ ...formData, honeypot: e.target.value })
            }
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={formData.authorEmail}
                onChange={(e) =>
                  setFormData({ ...formData, authorEmail: e.target.value })
                }
                className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Thoughts or Question *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write your advice, recommendation, or experience..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            {loading ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-slate-400 italic">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                    {c.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      {c.authorName}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-13">
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
