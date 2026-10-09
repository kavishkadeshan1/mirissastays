import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import FaqAccordion from "@/components/home/FaqAccordion";
import { defaultFaqs, hostFaqs } from "@/lib/faqs";
import {
  constructMetadata,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Frequently Asked Questions (FAQ) | MirissaStays",
  description:
    "Everything you need to know about booking accommodations in Mirissa, Weligama, and Southern Sri Lanka including direct inquiries and booking partner links.",
  canonical: "/faq",
});

export default function FaqPage() {
  const faqSchema = generateFaqSchema([...defaultFaqs, ...hostFaqs]);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [faqSchema, breadcrumbs],
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Find answers to common questions about accommodations, direct
            bookings, neighborhoods, and hosting in Mirissa.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            For Travelers & Guests
          </h2>
          <FaqAccordion faqs={defaultFaqs} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 mb-6">
            For Property Owners & Hosts
          </h2>
          <FaqAccordion faqs={hostFaqs} />
        </div>

        <div className="mt-16 p-8 bg-sand-100 rounded-3xl border border-sand-200 text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Our local team in Mirissa is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </>
  );
}
