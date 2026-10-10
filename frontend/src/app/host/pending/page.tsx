import React from "react";
import Link from "next/link";
import { Clock, Home, Mail } from "lucide-react";

export default function HostPendingPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Host Account Pending Verification
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Your host registration is currently being verified by the MirissaStays
          editorial team. Once approved, you will have access to create and
          manage property listings, receive WhatsApp inquiries, and manage your
          availability.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href="mailto:admin@mirissastays.com"
            className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
