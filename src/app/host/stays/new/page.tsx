import prisma from "@/lib/prisma";
import ListingEditor from "@/components/host/ListingEditor";
export const dynamic = "force-dynamic";
export default async function NewStay() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <ListingEditor categories={categories} locations={locations} />;
}
