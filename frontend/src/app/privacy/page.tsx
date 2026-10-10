import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | MirissaStays",
  description:
    "Privacy Policy for MirissaStays. Learn how we collect, use, and protect your data, and read about our cookie and advertising compliance.",
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="legal-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-8">
        Privacy Policy
      </h1>

      <div className="prose max-w-none text-slate-700 leading-relaxed space-y-6">
        <p className="text-sm text-slate-400">Last updated: October 2026</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          1. Introduction
        </h2>
        <p>
          Welcome to MirissaStays.com (&quot;MirissaStays&quot;, &quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are
          committed to protecting your personal data. This privacy policy
          explains how we collect, store, and process your personal data when
          you visit our website and discover accommodations across Mirissa and
          Southern Sri Lanka.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          2. The Data We Collect
        </h2>
        <p>
          We may collect, use, and store different kinds of personal
          information:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Identity Data:</strong> First name, last name, or similar
            identifier.
          </li>
          <li>
            <strong>Contact Data:</strong> Email address, phone/WhatsApp number.
          </li>
          <li>
            <strong>Booking Inquiries:</strong> Desired check-in/out dates,
            guest count, and notes forwarded directly to property hosts.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type and
            version, time zone setting, operating system, and platform.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our properties, search queries, and editorial guides.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          3. Direct Booking Architecture
        </h2>
        <p>
          MirissaStays operates as a curated discovery directory. When you
          submit an inquiry form or click a WhatsApp contact link, your contact
          details and stay requests are transmitted directly to the authorized
          host of the property. We do not sell your personal information to
          third-party data brokers.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          4. Cookies & Analytics
        </h2>
        <p>
          We use cookies and similar technologies to enhance navigation, analyze
          site performance, and serve relevant advertising. You can configure
          your browser to reject cookies; however, certain interactive features
          of the website may not operate as intended.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          5. Contact Information
        </h2>
        <p>
          If you have any questions regarding this Privacy Policy or wish to
          exercise your data protection rights, please contact our Data
          Protection team at:
          <br />
          <a
            href="mailto:admin@mirissastays.com"
            className="text-brand-600 font-bold hover:underline"
          >
            admin@mirissastays.com
          </a>
        </p>
      </div>
    </div>
  );
}
