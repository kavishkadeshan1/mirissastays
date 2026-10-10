import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Cookie Policy | MirissaStays",
  description:
    "Learn about the cookies and tracking technologies used on MirissaStays.com.",
  canonical: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="legal-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-8">
        Cookie Policy
      </h1>

      <div className="prose max-w-none text-slate-700 leading-relaxed space-y-6">
        <p className="text-sm text-slate-400">Last updated: October 2026</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          What Are Cookies?
        </h2>
        <p>
          Cookies are small text files stored on your computer or mobile device
          when you visit a website. They allow the website to remember your
          actions and preferences over time.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          How We Use Cookies
        </h2>
        <p>MirissaStays uses cookies for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Essential Session Cookies:</strong> Required to keep you
            authenticated in the Admin or Host portals.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> To measure page views, popular
            search keywords, and site speed.
          </li>
          <li>
            <strong>Preferences:</strong> To remember your search filters and
            display options.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Managing Your Cookies
        </h2>
        <p>
          You can adjust your browser settings to decline or delete cookies at
          any time. For questions, reach out to us at{" "}
          <a
            href="mailto:admin@mirissastays.com"
            className="text-brand-600 font-bold hover:underline"
          >
            admin@mirissastays.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
