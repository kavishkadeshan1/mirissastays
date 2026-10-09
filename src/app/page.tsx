import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Compass, Waves, MessageCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import StayCard from "@/components/stays/StayCard";
import Photo from "@/components/ui/Photo";
import FaqAccordion from "@/components/home/FaqAccordion";
import { defaultFaqs } from "@/lib/faqs";
import { presentStay } from "@/lib/presentation";
import {
  constructMetadata,
  generateFaqSchema,
  generateItemListSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Mirissa Hotels, Luxury Beach Villas & Stays in Mirissa Sri Lanka",
  description:
    "Find the best hotels, beachfront villas, and coastal guesthouses in Mirissa, Weligama, and Thalaramba, Sri Lanka. Explore verified local places to stay with map directions and direct host inquiries.",
  canonical: "/",
  keywords: [
    "Mirissa hotels",
    "Mirissa beach villas",
    "hotels in Mirissa Sri Lanka",
    "best places to stay in Mirissa",
    "luxury villas Mirissa",
    "Weligama hotels",
    "Thalaramba guesthouses",
    "Sri Lanka south coast accommodation",
    "Mirissa boutique hotels",
  ],
});

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const legacy = new URLSearchParams();
  for (const key of [
    "location",
    "category",
    "q",
    "minPrice",
    "maxPrice",
    "sort",
  ]) {
    const value = (await searchParams)[key];
    if (typeof value === "string" && value) legacy.set(key, value);
  }
  if (legacy.size) redirect("/stays?" + legacy.toString());
  let categories: any[] = [];
  let locations: any[] = [];
  let stays: any[] = [];
  let guides: any[] = [];

  try {
    [categories, locations, stays, guides] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.location.findMany({ orderBy: { name: "asc" } }),
      prisma.stay.findMany({
        where: { status: "published" },
        take: 6,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        include: { category: true, location: true },
      }),
      prisma.guide.findMany({
        where: { status: "published" },
        take: 3,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
    ]);
  } catch (error) {
    console.error("HomePage database query error:", error);
  }

  const faqSchema = generateFaqSchema(defaultFaqs);
  const staysItemList = generateItemListSchema(
    "Featured Places to Stay in Mirissa & South Coast",
    stays.map((s) => ({
      name: s.title,
      url: `/stay/${s.slug}`,
      image: s.featuredImage || undefined,
      description: s.metaDescription || s.shortDesc || undefined,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [faqSchema, staysItemList],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection locations={locations} categories={categories} />
      <div className="coast-ribbon">
        <span>
          <Compass />
          Rooted in local knowledge
        </span>
        <span>
          <Waves />
          Made for the south coast
        </span>
        <span>
          <MessageCircle />A more personal connection
        </span>
      </div>
      <section className="container-wide section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Good places, great memories</p>
            <h2>Somewhere you’ll love to stay.</h2>
          </div>
          <Link href="/stays" className="text-link">
            Explore all stays <ArrowUpRight size={17} />
          </Link>
        </div>
        {stays.length ? (
          <div className="stay-grid">
            {stays.map((s) => (
              <StayCard key={s.id} stay={presentStay(s)} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>A new collection is on its way.</h2>
            <p>Come back soon for places to stay along the coast.</p>
          </div>
        )}
      </section>
      <section className="area-section section-space" id="destinations">
        <div className="container-wide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">One coastline. Many ways to stay.</p>
              <h2>Find your little corner.</h2>
            </div>
            <Link href="/destinations" className="text-link">
              All destinations <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="area-grid">
            {[
              [
                "mirissa",
                "Mirissa",
                "Beach days, coconut palms and a little bit of everything.",
              ],
              [
                "weligama",
                "Weligama",
                "Easy mornings and a town that moves to the rhythm of the surf.",
              ],
              [
                "thalaramba",
                "Thalaramba",
                "A quieter stretch of coast, just beyond the bustle.",
              ],
            ].map(([slug, name, desc], i) => (
              <Link href={`/location/${slug}`} className="area-tile" key={slug}>
                <span>0{i + 1} / SOUTHERN SRI LANKA</span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-wide section-space">
        <div className="how-section">
          <div>
            <p className="eyebrow">A stay, made personal</p>
            <h2>
              A little local knowledge
              <br />
              <em>goes a long way.</em>
            </h2>
          </div>
          <div className="how-steps">
            {[
              [
                "Find your kind of place",
                "Explore hotels, villas and guesthouses, with photos and practical details to help you choose.",
              ],
              [
                "Choose how to connect",
                "Contact participating hosts directly, or follow a clearly marked link to a booking partner.",
              ],
              [
                "Make your plans together",
                "Confirm dates, the final price and arrangements with your host or booking provider.",
              ],
            ].map(([title, desc], i) => (
              <div className="how-step" key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {guides.length > 0 && (
        <section className="container-wide section-space !pt-0">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the coast</p>
              <h2>Go a little beyond the guidebook.</h2>
            </div>
            <Link href="/guides" className="text-link">
              Read the journal <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="guide-grid">
            {guides.map((g) => (
              <article key={g.id} className="guide-card">
                <Link className="guide-image" href={`/guides/${g.slug}`}>
                  <Photo src={g.featuredImage} alt={g.title} />
                </Link>
                <p className="eyebrow">The local journal</p>
                <h3>
                  <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                </h3>
                <p>{g.metaDescription}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="container-wide section-space faq-section">
        <div>
          <p className="eyebrow">Before you arrive</p>
          <h2>
            A few good
            <br />
            things to know.
          </h2>
          <p>Your questions, answered.</p>
          <Link href="/faq" className="text-link mt-6">
            More travel questions <ArrowUpRight size={17} />
          </Link>
        </div>
        <FaqAccordion faqs={defaultFaqs} />
      </section>
    </>
  );
}
