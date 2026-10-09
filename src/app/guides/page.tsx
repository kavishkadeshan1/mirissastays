import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import Photo from "@/components/ui/Photo";
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Mirissa Travel Guides, Tips & South Coast Journal | MirissaStays",
  description:
    "Discover local travel guides, insider tips, surf spots, secret beaches, and whale watching itineraries for Mirissa, Weligama, and Sri Lanka's south coast.",
  canonical: "/guides",
  keywords: [
    "Mirissa travel guide",
    "Mirissa things to do",
    "whale watching Mirissa tips",
    "Weligama surf guide",
    "Coconut Tree Hill guide",
    "Secret Beach Mirissa",
    "Sri Lanka south coast travel journal",
  ],
});

export const dynamic = "force-dynamic";

export default async function Guides() {
  const guides = await prisma.guide.findMany({
    where: { status: "published" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  const [lead, ...rest] = guides;

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Travel Journal", url: "/guides" },
  ]);
  const guidesList = generateItemListSchema(
    "Mirissa & South Coast Travel Guides",
    guides.map((g) => ({
      name: g.title,
      url: `/guides/${g.slug}`,
      image: g.featuredImage,
      description: g.metaDescription,
    })),
  );

  return (
    <div className="container-wide pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [breadcrumbs, guidesList],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="page-intro">
        <p className="eyebrow">Notes from the coast</p>
        <h1>
          Good stories.
          <br />
          <em>Even better adventures.</em>
        </h1>
        <p>
          Places to wander, things to know, and a little local perspective for
          your time on the south coast.
        </p>
      </div>
      {lead ? (
        <>
          <article className="journal-lead">
            <Link href={"/guides/" + lead.slug} className="journal-lead-photo">
              <Photo
                src={lead.featuredImage}
                alt={lead.title}
                priority
                sizes="(max-width:700px) 100vw, 55vw"
              />
            </Link>
            <div>
              <p className="eyebrow">The editor’s pick</p>
              <h2>
                <Link href={"/guides/" + lead.slug}>{lead.title}</Link>
              </h2>
              <p>{lead.metaDescription}</p>
              <p className="journal-byline">
                {lead.authorName || "MirissaStays editorial"} ·{" "}
                {formatDate(lead.createdAt)}
              </p>
              <Link className="text-link" href={"/guides/" + lead.slug}>
                Read the story <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
          <div className="section-heading mt-16">
            <h2>More from the journal.</h2>
          </div>
          <div className="guide-grid">
            {rest.map((g) => (
              <article className="guide-card" key={g.id}>
                <Link className="guide-image" href={"/guides/" + g.slug}>
                  <Photo src={g.featuredImage} alt={g.title} />
                </Link>
                <p className="eyebrow">{formatDate(g.createdAt)}</p>
                <h3>
                  <Link href={"/guides/" + g.slug}>{g.title}</Link>
                </h3>
                <p>{g.metaDescription}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h2>Stories are on their way.</h2>
          <p>Explore a stay while we put together the next edition.</p>
          <Link href="/stays" className="btn btn-primary">
            Find a stay
          </Link>
        </div>
      )}
    </div>
  );
}
