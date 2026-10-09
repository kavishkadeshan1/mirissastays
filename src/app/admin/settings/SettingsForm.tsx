"use client";

import React, { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [formData, setFormData] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Top Header Announcement Banner
        </label>
        <input
          type="text"
          value={formData.site_announcement || ""}
          onChange={(e) =>
            setFormData({ ...formData, site_announcement: e.target.value })
          }
          className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Helpline Phone / WhatsApp
          </label>
          <input
            type="text"
            value={formData.helpline_phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, helpline_phone: e.target.value })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Admin Support Email
          </label>
          <input
            type="email"
            value={formData.admin_email || ""}
            onChange={(e) =>
              setFormData({ ...formData, admin_email: e.target.value })
            }
            className="w-full text-sm font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Hero Slider JSON Configuration
        </label>
        <textarea
          rows={6}
          value={formData.hero_slides || ""}
          onChange={(e) =>
            setFormData({ ...formData, hero_slides: e.target.value })
          }
          className="w-full font-mono text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Array of objects containing image, title, and subtitle.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm transition-colors"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? "Saving..." : "Save Settings"}</span>
      </button>
    </form>
  );
}
