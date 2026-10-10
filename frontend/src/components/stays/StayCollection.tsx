import Link from "next/link";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import StayCard from "./StayCard";
import SearchFilters from "./SearchFilters";
import { presentStay } from "@/lib/presentation";
import DestinationMapSection from "@/components/maps/DestinationMapSection";
import { getDestinationMapEmbed } from "@/lib/map-utils";
export type Filters = Record<string, string | undefined>;
export default async function StayCollection({
  filters = {},
  title = "A place for every kind of escape.",
  intro = "Beachside mornings, tucked-away villas and easygoing guesthouses. Find a stay that feels like you.",
  eyebrow = "Stay a little longer",
  locationEmbed,
}: {
  filters?: Filters;
  title?: string;
  intro?: string;
  eyebrow?: string;
  locationEmbed?: { name: string; slug: string };
}) {
  filters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => typeof v === "string"),
  );
  const min = Number(filters.minPrice),
    max = Number(filters.maxPrice);
  const hasMin = !!filters.minPrice && Number.isFinite(min) && min >= 0,
    hasMax = !!filters.maxPrice && Number.isFinite(max) && max >= 0;
  const priced = hasMin || hasMax || filters.sort?.startsWith("price_");
  const currency = ["USD", "LKR", "EUR", "GBP"].includes(filters.currency || "")
    ? filters.currency!
    : "USD";
  const where: Prisma.StayWhereInput = {
    status: "published",
    ...(filters.location ? { location: { slug: filters.location } } : {}),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q } },
            { shortDesc: { contains: filters.q } },
            { address: { contains: filters.q } },
          ],
        }
      : {}),
    ...(priced
      ? {
          currency,
          pricePerNight: {
            gt: 0,
            ...(hasMin ? { gte: min } : {}),
            ...(hasMax ? { lte: max } : {}),
          },
        }
      : {}),
  };
  const orderBy: Prisma.StayOrderByWithRelationInput[] =
    filters.sort === "price_asc"
      ? [{ pricePerNight: "asc" }]
      : filters.sort === "price_desc"
        ? [{ pricePerNight: "desc" }]
        : filters.sort === "newest"
          ? [{ createdAt: "desc" }]
          : [{ isFeatured: "desc" }, { createdAt: "desc" }];
  const [locations, categories, count] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.stay.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(count / 12));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number(filters.page) || 1)),
  );
  const stays = await prisma.stay.findMany({
    where,
    orderBy,
    take: 12,
    skip: (page - 1) * 12,
    include: { category: true, location: true },
  });
  const url = (change: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    Object.entries({ ...filters, ...change }).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return "/stays?" + p.toString();
  };
  const active = Object.entries(filters).filter(
    ([k, v]) =>
      v && ["location", "category", "q", "minPrice", "maxPrice"].includes(k),
  );
  const destination =
    locationEmbed ||
    (filters.location
      ? locations.find((l) => l.slug === filters.location)
      : null);
  return (
    <div className="container-wide pb-16">
      <div className="page-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="search-layout">
        <SearchFilters
          locations={locations}
          categories={categories}
          values={filters}
        />
        <div>
          <div className="results-toolbar">
            <span>
              {count} {count === 1 ? "place" : "places"} to make your own
            </span>
            <span>Explore the south coast</span>
          </div>
          {active.length > 0 && (
            <div className="filter-chips">
              {active.map(([k, v]) => (
                <Link
                  key={k}
                  href={url({ [k]: undefined, page: undefined })}
                  aria-label={"Remove " + k + " filter"}
                >
                  {k === "minPrice"
                    ? "From "
                    : k === "maxPrice"
                      ? "Up to "
                      : ""}
                  {v}
                  <span aria-hidden="true">×</span>
                </Link>
              ))}
            </div>
          )}
          {destination && (
            <DestinationMapSection
              locationName={destination.name}
              locationSlug={destination.slug}
              embedUrl={getDestinationMapEmbed(destination.slug)}
              placesCount={count}
            />
          )}
          {stays.length ? (
            <div className="stay-grid">
              {stays.map((s) => (
                <StayCard key={s.id} stay={presentStay(s)} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Let’s widen the search.</h2>
              <p>
                No stays match these filters. Try another area or a more
                flexible budget.
              </p>
              <Link href="/stays" className="btn btn-primary">
                Explore all stays
              </Link>
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="Results pages">
              {page > 1 && (
                <Link
                  className="btn btn-secondary"
                  href={url({ page: String(page - 1) })}
                >
                  Previous
                </Link>
              )}
              <span>
                Page {page} of {pages}
              </span>
              {page < pages && (
                <Link
                  className="btn btn-secondary"
                  href={url({ page: String(page + 1) })}
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
