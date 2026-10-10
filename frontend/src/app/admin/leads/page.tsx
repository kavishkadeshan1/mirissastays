"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LeadItem {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkinDate: string;
  checkoutDate: string;
  guestsCount: number;
  specialRequests: string | null;
  status: string;
  createdAt: string;
  stay: {
    title: string;
    slug: string;
  };
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads-list");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads(
          leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry record?"))
      return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(leads.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Booking Inquiries
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review incoming guest requests, update booking pipeline, and contact
          travelers directly.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Received</th>
                <th className="p-4">Property</th>
                <th className="p-4">Guest Contact</th>
                <th className="p-4">Stay Dates</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No inquiries recorded yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      <Link
                        href={`/stay/${lead.stay.slug}`}
                        target="_blank"
                        className="hover:text-brand-600 inline-flex items-center gap-1"
                      >
                        <span>{lead.stay.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        {lead.guestName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`mailto:${lead.guestEmail}`}
                          className="text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{lead.guestEmail}</span>
                        </a>
                      </div>
                      <div className="mt-0.5">
                        <a
                          href={`https://wa.me/${lead.guestPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{lead.guestPhone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {formatDate(lead.checkinDate)} →{" "}
                        {formatDate(lead.checkoutDate)}
                      </div>
                    </td>
                    <td className="p-4">{lead.guestsCount} Guests</td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className={`text-xs font-bold uppercase rounded-xl px-2.5 py-1 border border-slate-200 focus:outline-none cursor-pointer ${
                          lead.status === "new"
                            ? "bg-blue-50 text-blue-700"
                            : lead.status === "contacted"
                              ? "bg-amber-50 text-amber-700"
                              : lead.status === "booked"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
