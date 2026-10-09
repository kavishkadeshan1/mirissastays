import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/seo";
import EmbeddedMap from "@/components/maps/EmbeddedMap";
import { getDestinationMapEmbed } from "@/lib/map-utils";

export const metadata = constructMetadata({
  title: "Destinations in Southern Sri Lanka | Mirissa, Weligama & Coast",
  description:
    "Discover the best coastal destinations in southern Sri Lanka. Compare Mirissa, Weligama, Thalaramba, Kamburugamuwa, and Madiha to find your ideal stay.",
  canonical: "/destinations",
  keywords: [
    "Mirissa destinations",
    "Sri Lanka south coast places",
    "Weligama bay",
    "Thalaramba beach",
    "Madiha surf beach",
    "Kamburugamuwa",
    "where to stay in southern Sri Lanka",
  ],
});

export const dynamic = "force-dynamic";

export default async function Destinations() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { stays: { where: { status: "published" } } } },
    },
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
  ]);
  const destinationsList = generateItemListSchema(
    "South Coast Sri Lanka Destinations",
    locations.map((l) => ({
      name: l.name,
      url: `/location/${l.slug}`,
      description: `Explore verified stays and beaches in ${l.name}, Sri Lanka`,
    })),
  );

  return (
    <div className="container-wide pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [breadcrumbs, destinationsList],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="page-intro">
        <p className="eyebrow">Follow the coastline</p>
        <h1>
          Different places.
          <br />
          <em>The same ocean.</em>
        </h1>
        <p>
          Find your own rhythm in the towns and quieter corners of southern Sri
          Lanka.
        </p>
      </div>
      <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-10">
        <Image
          src="/social-share.jpg"
          alt="Palm trees overlooking the south coast of Sri Lanka"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="area-grid">
        {locations.map((l, i) => (
          <Link key={l.id} className="area-tile" href={"/location/" + l.slug}>
            <span>
              {String(i + 1).padStart(2, "0")} / {l._count.stays} PLACES TO STAY
            </span>
            <h3>{l.name}</h3>
            <p>Discover stays and make your own plans in {l.name}.</p>
            <ArrowUpRight />
          </Link>
        ))}
      </div>
      <div className="mt-16">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow">Interactive coastline</p>
            <h2>Follow the coast on the map.</h2>
            <p>
              Navigate between Mirissa Bay, Weligama, Midigama surf breaks, and
              the serene beaches of Madiha, Thalaramba, and Kamburugamuwa.
            </p>
          </div>
        </div>
        <EmbeddedMap
          title="South Coast Sri Lanka Destinations"
          address="Mirissa, Weligama, Midigama & Madiha, Southern Province, Sri Lanka"
          embedUrl={getDestinationMapEmbed("mirissa")}
          mapUrl="https://www.google.com/maps/search/?api=1&query=Mirissa,+Southern+Province,+Sri+Lanka"
          directionsUrl="https://www.google.com/maps/dir/?api=1&destination=Mirissa,+Southern+Province,+Sri+Lanka"
          badge="Southern Province Coast"
          heightClass="h-[400px] md:h-[480px]"
        />
      </div>
    </div>
  );
}
