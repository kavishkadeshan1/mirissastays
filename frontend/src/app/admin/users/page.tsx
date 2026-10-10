"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  businessRegNo: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users-list");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveHost = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Users & Host Approvals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review host verification requests, manage permissions, and supervise
          platform accounts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4">Business Reg No</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        {user.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ID #{user.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800">{user.email}</div>
                      <div className="text-slate-400 text-[11px]">
                        {user.phone || "No phone"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "host"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-[11px]">
                      {user.businessRegNo || "—"}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "pending" && (
                          <button
                            onClick={() => handleApproveHost(user.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Host</span>
                          </button>
                        )}
                        {user.status !== "pending" && user.role !== "admin" && (
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                            className="text-slate-500 hover:text-slate-800 font-bold px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            {user.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDelete(user.id, user.fullName)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
  );
}
