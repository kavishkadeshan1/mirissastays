import StayCollection, { Filters } from "@/components/stays/StayCollection";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Hotels, Luxury Beach Villas & Stays in Mirissa | MirissaStays",
  description:
    "Browse verified beachfront villas, boutique hotels, surf resorts, and cozy guesthouses across Mirissa, Weligama, Thalaramba, and Madiha.",
  canonical: "/stays",
  keywords: [
    "Mirissa hotels",
    "Mirissa beach villas",
    "places to stay in Mirissa",
    "hotels in Mirissa Sri Lanka",
    "Weligama surf accommodation",
    "Thalaramba villas",
    "budget guesthouses Mirissa",
  ],
});

export const dynamic = "force-dynamic";

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Stays", url: "/stays" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <StayCollection filters={await searchParams} />
    </>
  );
}
