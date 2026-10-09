import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | MirissaStays",
  description:
    "Terms and conditions governing the use of MirissaStays for travelers and property hosts.",
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <div className="legal-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-8">
        Terms of Service
      </h1>

      <div className="prose max-w-none text-slate-700 leading-relaxed space-y-6">
        <p className="text-sm text-slate-400">Last updated: October 2026</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and using MirissaStays.com, you agree to comply with and
          be bound by these Terms of Service. If you do not agree with these
          terms, please do not use the website.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          2. Role of MirissaStays
        </h2>
        <p>
          MirissaStays serves as a curated discovery and advertising directory
          connecting independent property hosts in Sri Lanka with travelers. We
          are not a travel agency, nor do we operate the properties listed on
          the site. Direct bookings, payment transfers, and check-in terms are
          arranged directly between the traveler and the respective property
          owner.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          3. Accuracy of Listing Information
        </h2>
        <p>
          While we manually verify listings during onboarding, property hosts
          are solely responsible for keeping their rates, amenities, photos, and
          policies up to date. MirissaStays does not warrant or guarantee
          continuous availability or specific prices.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          4. Host Obligations
        </h2>
        <p>
          Property hosts must provide accurate information, hold any necessary
          local licenses to operate accommodation in Sri Lanka, and respond
          politely and professionally to guest inquiries. Listings found to
          violate safety, accuracy, or local regulations will be immediately
          suspended.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          5. Governing Law
        </h2>
        <p>
          These Terms of Service are governed by and construed in accordance
          with the laws of the Democratic Socialist Republic of Sri Lanka.
        </p>
      </div>
    </div>
  );
}
