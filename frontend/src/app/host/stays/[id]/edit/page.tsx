import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ListingEditor from "@/components/host/ListingEditor";
import { stringList } from "@/lib/presentation";
export const dynamic = "force-dynamic";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const stay = await prisma.stay.findUnique({ where: { id } });
  if (!stay) notFound();
  if (stay.hostId !== user.id && user.role !== "admin") redirect("/host");
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <ListingEditor
      categories={categories}
      locations={locations}
      initial={{
        id: stay.id,
        title: stay.title,
        categoryId: stay.categoryId,
        locationId: stay.locationId,
        pricePerNight: Number(stay.pricePerNight),
        currency: stay.currency || "USD",
        featuredImage: stay.featuredImage,
        gallery: stringList(stay.galleryJson).filter(
          (p) => p !== stay.featuredImage,
        ),
        address: stay.address,
        mapEmbed: stay.mapEmbed || "",
        whatsappNumber: stay.whatsappNumber,
        shortDesc: stay.shortDesc,
        fullContent: stay.fullContent,
        amenities: stringList(stay.amenitiesJson),
      }}
    />
  );
}
