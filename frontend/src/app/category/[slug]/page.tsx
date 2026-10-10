import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import StayCollection, { Filters } from "@/components/stays/StayCollection";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await prisma.category.findUnique({
    where: { slug },
  });
  if (!c) notFound();
  const title =
    c.metaTitle ||
    `Best ${c.name} in Mirissa & Sri Lanka South Coast | MirissaStays`;
  const description =
    c.metaDescription ||
    `Explore handpicked ${c.name.toLowerCase()} in Mirissa, Weligama, and Thalaramba. Compare amenities, view location maps, and make direct host inquiries.`;

  return constructMetadata({
    title,
    description,
    canonical: "/category/" + slug,
    keywords: [
      `${c.name} in Mirissa`,
      `Mirissa ${c.name.toLowerCase()}`,
      `best ${c.name.toLowerCase()} Sri Lanka south coast`,
      `${c.name.toLowerCase()} Weligama`,
      "places to stay in Mirissa",
    ],
  });
}

export default async function Category({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Filters>;
}) {
  const { slug } = await params;
  const c = await prisma.category.findUnique({
    where: { slug },
  });
  if (!c) notFound();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Stays", url: "/stays" },
    { name: c.name, url: `/category/${c.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <StayCollection
        filters={{ ...(await searchParams), category: c.slug }}
        title={c.name + " stays, your way."}
        eyebrow="A space that suits you"
        intro={
          c.metaDescription ||
          "Find your kind of coastal stay. Choose an area and explore the details."
        }
      />
    </>
  );
}
