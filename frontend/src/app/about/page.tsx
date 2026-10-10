import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, MessageCircle, Waves } from "lucide-react";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About MirissaStays | Our Story & South Coast Mission",
  description:
    "Learn about MirissaStays, our mission to support local hospitality, and how we help travelers discover verified stays, villas, and stories along Sri Lanka's south coast.",
  canonical: "/about",
  keywords: [
    "About MirissaStays",
    "Mirissa hospitality",
    "Sri Lanka south coast tourism",
    "local guesthouses Mirissa",
    "authentic Sri Lanka travel",
  ],
});

export default function About() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Our Story", url: "/about" },
  ]);
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About MirissaStays",
    url: "https://mirissastays.com/about",
    description:
      "MirissaStays brings together places to stay and stories from Sri Lanka’s southern coast.",
  };

  return (
    <div className="container-wide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [aboutSchema, breadcrumbs],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="story-hero">
        <div>
          <p className="eyebrow">Hello from the south coast</p>
          <h1>
            Travel a little slower.
            <br />
            <em>Feel a little closer.</em>
          </h1>
          <p>
            We believe the best part of a trip is feeling connected to a place.
            Its people. Its everyday rhythms. That little spot you wish you’d
            found sooner.
          </p>
          <p>
            MirissaStays brings together places to stay and stories from Sri
            Lanka’s southern coast, so you can start your own adventure with a
            little local knowledge.
          </p>
        </div>
        <div className="story-photo">
          <Image
            src="/social-share.jpg"
            alt="Palms and ocean at Coconut Tree Hill"
            fill
            sizes="(max-width:700px) 100vw, 45vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <section className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What brings us here</p>
            <h2>Local places. Human connections.</h2>
          </div>
        </div>
        <div className="values-grid">
          {[
            [
              Compass,
              "A sense of place",
              "Discover the different personalities of Mirissa, Weligama and the towns along the coast.",
            ],
            [
              MessageCircle,
              "A personal conversation",
              "Participating hosts welcome direct inquiries. Ask about the details that matter to your stay.",
            ],
            [
              Waves,
              "Room for your own journey",
              "From a simple guesthouse to a coastal villa, explore at your pace and choose what suits you.",
            ],
          ].map(([Icon, title, desc]) => {
            const I = Icon as typeof Compass;
            return (
              <div key={String(title)}>
                <I size={24} />
                <h3>{String(title)}</h3>
                <p>{String(desc)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="story-note">
        <p className="eyebrow">A note on how it works</p>
        <h2>Clear from the beginning.</h2>
        <p>
          We’re a discovery platform. Some properties accept direct inquiries;
          others link to booking partners or appear as informational guides.
          Each listing explains its available options. Hosts and booking
          providers confirm availability, final rates and arrangements.
        </p>
        <p>
          Some outbound links are affiliate links. We may receive a commission
          when you book through them, at no extra cost to you.
        </p>
        <Link className="btn btn-primary" href="/stays">
          Find your next stay <ArrowUpRight size={16} />
        </Link>
      </section>
      <section className="section-space section-heading">
        <div>
          <p className="eyebrow">For people who call this place home</p>
          <h2>Have a place to share?</h2>
          <p>Introduce your property to travelers exploring the south coast.</p>
        </div>
        <Link className="btn btn-secondary" href="/register?type=host">
          List your place <ArrowUpRight size={16} />
        </Link>
      </section>
    </div>
  );
}
