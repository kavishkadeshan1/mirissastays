import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import EmbeddedMap from "@/components/maps/EmbeddedMap";
import ContactFormClient from "@/components/contact/ContactFormClient";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contact Us | MirissaStays South Coast Support & Host Inquiries",
  description:
    "Get in touch with the MirissaStays team. Contact us for traveler assistance, host property listing inquiries, local recommendations, and partnerships.",
  canonical: "/contact",
  keywords: [
    "Contact MirissaStays",
    "Mirissa hotel contact",
    "list property Mirissa",
    "Sri Lanka travel support",
    "Mirissa guesthouse inquiries",
  ],
});

export default function Contact() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MirissaStays",
    url: "https://mirissastays.com/contact",
    description:
      "Get in touch with the MirissaStays team for bookings, local guidance, and property listings.",
    mainEntity: {
      "@type": "Organization",
      name: "MirissaStays",
      url: "https://mirissastays.com",
      email: "admin@mirissastays.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mirissa",
        addressRegion: "Southern Province",
        addressCountry: "LK",
      },
    },
  };

  return (
    <div className="container-wide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [contactSchema, breadcrumbs],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="page-intro">
        <p className="eyebrow">A conversation starts here</p>
        <h1>
          Let’s talk about
          <br />
          <em>your next chapter.</em>
        </h1>
        <p>
          A question about the coast, a place to share, or an idea to explore
          together. We’d like to hear from you.
        </p>
      </div>
      <div className="contact-layout section-space !pt-4">
        <div>
          <h2 className="text-3xl mb-6">A little help, along the way.</h2>
          <div className="contact-detail">
            <Mail size={20} />
            <div>
              <h3>Email us</h3>
              <a href="mailto:admin@mirissastays.com">admin@mirissastays.com</a>
            </div>
          </div>
          <div className="contact-detail">
            <MapPin size={20} />
            <div>
              <h3>Our corner of the world</h3>
              <p>
                Mirissa, Southern Province
                <br />
                Sri Lanka
              </p>
            </div>
          </div>
          <div className="mt-6 mb-4">
            <EmbeddedMap
              title="Mirissa, Southern Province"
              address="Mirissa, Southern Province, Sri Lanka"
              embedUrl="https://maps.google.com/maps?q=Mirissa,+Southern+Province,+Sri+Lanka&hl=en&z=15&output=embed"
              mapUrl="https://www.google.com/maps/search/?api=1&query=Mirissa,+Southern+Province,+Sri+Lanka"
              directionsUrl="https://www.google.com/maps/dir/?api=1&destination=Mirissa,+Southern+Province,+Sri+Lanka"
              badge="Southern Province"
              heightClass="h-[250px]"
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 mt-10">
            <p className="eyebrow mb-3">Asking about a property?</p>
            <p className="text-sm text-slate-600 mb-5">
              For dates, room details and rates, use the contact or booking
              options on that property’s page.
            </p>
            <Link href="/stays" className="text-link">
              Find your stay <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <ContactFormClient />
      </div>
    </div>
  );
}
