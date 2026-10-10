import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import StayCollection, { Filters } from "@/components/stays/StayCollection";
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateTouristDestinationSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = await prisma.location.findUnique({
    where: { slug },
  });
  if (!l) notFound();
  const title = l.metaTitle || `Hotels & Beach Stays in ${l.name}, Sri Lanka`;
  const description =
    l.metaDescription ||
    `Explore hotels, beachfront villas, and coastal guesthouses in ${l.name}, Sri Lanka. Compare places to stay, check Google Map directions, and make direct inquiries.`;

  return constructMetadata({
    title,
    description,
    canonical: "/location/" + slug,
    keywords: [
      `${l.name} hotels`,
      `stays in ${l.name}`,
      `places to stay in ${l.name}`,
      `villas in ${l.name} Sri Lanka`,
      `${l.name} accommodation`,
      "Sri Lanka south coast",
    ],
  });
}

export default async function Location({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Filters>;
}) {
  const { slug } = await params;
  const l = await prisma.location.findUnique({
    where: { slug },
  });
  if (!l) notFound();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
    { name: l.name, url: `/location/${l.slug}` },
  ]);
  const destSchema = generateTouristDestinationSchema({
    name: l.name,
    slug: l.slug,
    description:
      l.metaDescription ||
      `Coastal destination in southern Sri Lanka featuring top hotels, villas, and guesthouses.`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [destSchema, breadcrumbs],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <StayCollection
        filters={{ ...(await searchParams), location: l.slug }}
        title={"Find your place in " + l.name + "."}
        eyebrow="Your corner of the coast"
        intro={
          l.metaDescription ||
          "Explore local places to stay, compare the details and plan your next coastal escape."
        }
        locationEmbed={{ name: l.name, slug: l.slug }}
      />
    </>
  );
}
