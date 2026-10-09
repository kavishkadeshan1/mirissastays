import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MapPin, Check, ArrowUpRight, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import StayGallery from "@/components/stays/StayGallery";
import InquiryForm from "@/components/stays/InquiryForm";
import StayCard from "@/components/stays/StayCard";
import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateLodgingSchema,
} from "@/lib/seo";
import { formatPrice, sanitizeWhatsApp } from "@/lib/utils";
import { presentStay, stringList, safeExternalUrl } from "@/lib/presentation";
import { stayMedia } from "@/lib/stay-media";
import { renderRichContent } from "@/lib/rich-content";
import { bookingPartnerUrl } from "@/lib/presentation";
import EmbeddedMap from "@/components/maps/EmbeddedMap";
import {
  resolveStayMapEmbed,
  generateExternalMapUrl,
  generateDirectionsUrl,
} from "@/lib/map-utils";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await prisma.stay.findUnique({
    where: { slug },
    include: { location: true, category: true },
  });
  if (!s || s.status !== "published") notFound();
  const media = stayMedia(s);
  const locationName = s.location?.name || "Mirissa";
  const categoryName = s.category?.name || "Stay";
  const metaDesc =
    s.metaDescription ||
    `Discover ${s.title}, a verified ${categoryName.toLowerCase()} in ${locationName}, Sri Lanka. Explore amenities, guest reviews, location map, and booking details.`;

  return constructMetadata({
    title: `${s.title} - ${categoryName} in ${locationName}, Sri Lanka`,
    description: metaDesc,
    image: media.featuredImage,
    canonical: "/stay/" + slug,
    keywords: [
      s.title,
      `${s.title} Mirissa`,
      `${categoryName} ${locationName}`,
      `hotels in ${locationName}`,
      `places to stay in ${locationName}`,
      "Mirissa accommodation",
    ],
  });
}
export default async function Stay({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if ((await params).slug === "sandy-cocunut-guest")
    redirect("/stay/sandy-coconut-guest");
  const stay = await prisma.stay.findUnique({
    where: { slug: (await params).slug },
    include: {
      category: true,
      location: true,
      host: { select: { fullName: true } },
      reviews: {
        where: { status: "approved" },
        take: 20,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!stay || stay.status !== "published") notFound();
  const phone = sanitizeWhatsApp(stay.whatsappNumber);
  const direct = stay.allowBooking && phone.length > 5;
  const external = safeExternalUrl(stay.affiliateUrl);
  const isMap =
    external &&
    /google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(external);
  const media = stayMedia(stay);
  const partner = bookingPartnerUrl(stay.affiliateUrl) || media.sourcePage;
  const isAffiliate = !!partner && new URL(partner).searchParams.has('aid');
  const onBooking = !!partner && /(^|\.)booking\.com$/.test(new URL(partner).hostname);
  const amenities = stringList(stay.amenitiesJson);
  const related = await prisma.stay.findMany({
    where: {
      status: "published",
      id: { not: stay.id },
      OR: [{ locationId: stay.locationId }, { categoryId: stay.categoryId }],
    },
    take: 3,
    include: { category: true, location: true },
  });
  const reviewSummary = await prisma.review.aggregate({
    where: { stayId: stay.id, status: "approved" },
    _avg: { rating: true },
    _count: { id: true },
  });
  const rating = Number(reviewSummary._avg.rating) || 0;
  const embedUrl = resolveStayMapEmbed(stay);
  const map = generateExternalMapUrl(stay);
  const directionsUrl = generateDirectionsUrl(stay);
  const price = formatPrice(Number(stay.pricePerNight), stay.currency || "USD");
  const crumbs = generateBreadcrumbSchema([
    { name: "Stays", url: "/stays" },
    { name: stay.location.name, url: "/location/" + stay.location.slug },
    { name: stay.title, url: "/stay/" + stay.slug },
  ]);
  const lodgingSchema = generateLodgingSchema({
    title: stay.title,
    slug: stay.slug,
    description: stay.metaDescription || stay.shortDesc || "",
    photos: [media.featuredImage, ...stringList(media.galleryJson)],
    address: stay.address,
    locationName: stay.location.name,
    categoryName: stay.category.name,
    price: Number(stay.pricePerNight) || undefined,
    currency: stay.currency || "USD",
    rating,
    reviewCount: reviewSummary._count.id,
    amenities,
    whatsappNumber: stay.whatsappNumber || undefined,
    latitude: stay.latitude ? Number(stay.latitude) : null,
    longitude: stay.longitude ? Number(stay.longitude) : null,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [lodgingSchema, crumbs],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container-wide">
        <header className="property-heading">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/stays">All stays</Link>
            <span>/</span>
            <Link href={"/location/" + stay.location.slug}>
              {stay.location.name}
            </Link>
            <span>/</span>
            <span>{stay.category.name}</span>
          </nav>
          <p className="eyebrow">
            {stay.category.name} · {stay.location.name}
          </p>
          <h1>{stay.title}</h1>
          <div className="property-meta">
            <span className="inline-flex gap-2 items-center">
              <MapPin size={15} />
              {stay.address}
            </span>
            {reviewSummary._count.id > 0 && (
              <a href="#reviews" className="inline-flex gap-1 items-center">
                <Star size={14} />
                {rating.toFixed(1)} · {reviewSummary._count.id} reviews
              </a>
            )}
            <span>
              {direct
                ? "Connect directly with the host"
                : partner
                  ? "Explore with a booking partner"
                  : "Property guide"}
            </span>
          </div>
        </header>
        <StayGallery
          featuredImage={media.featuredImage}
          galleryJson={media.galleryJson}
          title={stay.title}
        />
        <div className="property-layout">
          <div className="property-sections">
            <nav className="property-tabs" aria-label="Property sections">
              <a href="#overview">Overview</a>
              <a href="#amenities">Amenities</a>
              <a href="#location">Location</a>
              {reviewSummary._count.id > 0 && <a href="#reviews">Reviews</a>}
            </nav>
            <section id="overview">
              <h2>A little about this place.</h2>
              <p className="text-lg text-slate-600 mb-6">{stay.shortDesc}</p>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: renderRichContent(stay.fullContent),
                }}
              />
            </section>
            <section id="amenities">
              <p className="eyebrow mb-3">The details that matter</p>
              <h2>Make yourself comfortable.</h2>
              {amenities.length ? (
                <div className="amenity-list">
                  {amenities.map((a) => (
                    <span key={a}>
                      <Check />
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p>
                  Ask the property for current amenities and room facilities.
                </p>
              )}
            </section>
            <section id="location">
              <p className="eyebrow mb-3">Your surroundings</p>
              <h2>Find your bearings.</h2>
              <p className="text-slate-600 mb-6">{stay.address}</p>
              <EmbeddedMap
                title={stay.title}
                address={stay.address}
                embedUrl={embedUrl}
                mapUrl={map}
                directionsUrl={directionsUrl}
                badge={`${stay.location.name} · Verified Location`}
              />
            </section>
            {stay.reviews.length > 0 && (
              <section id="reviews">
                <h2>Notes from guests.</h2>
                {stay.reviews.map((r) => (
                  <article
                    key={r.id}
                    className="py-5 border-b border-slate-200"
                  >
                    <div className="flex justify-between mb-3">
                      <strong>{r.guestName}</strong>
                      <span>{Number(r.rating).toFixed(1)} / 5</span>
                    </div>
                    <p className="text-slate-600">{r.comment}</p>
                  </article>
                ))}
              </section>
            )}
          </div>
          <aside className="contact-panel" id="contact-host">
            <p className="eyebrow">
              {direct
                ? "Your next chapter starts here"
                : partner
                  ? "Plan your visit"
                  : "Get to know this place"}
            </p>
            <h2>
              {direct
                ? "Stay a little longer."
                : partner
                  ? "Explore this place."
                  : "A place worth exploring."}
            </h2>
            <div className="property-price !text-base !font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Explore this place</span>
            </div>
            {direct ? (
              <>
                <p className="mt-3">
                  Ask {stay.host.fullName} about your dates and the final rate.
                </p>
                <a
                  href={
                    "https://wa.me/" +
                    phone +
                    "?text=" +
                    encodeURIComponent(
                      "Hi, I found " +
                        stay.title +
                        " on MirissaStays. Could you help me with availability?",
                    )
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Message on WhatsApp <ArrowUpRight size={16} />
                </a>
                <details className="mt-6 group" open>
                  <summary className="text-sm cursor-pointer border-t border-slate-200 pt-5">
                    Or send an inquiry
                  </summary>
                  <InquiryForm
                    stayId={stay.id}
                    stayTitle={stay.title}
                    whatsappNumber={phone}
                  />
                </details>
              </>
            ) : partner ? (
              <>
                <p className="mt-4">
                  See availability and the final price on the booking provider’s
                  website.
                </p>
                <a
                  href={partner}
                  className="btn btn-primary"
                  target="_blank"
                  rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                >
                  {onBooking ? 'View on Booking.com' : 'Visit booking partner'} <ArrowUpRight size={16} />
                </a>
                {isAffiliate && <p className="form-note">
                  Affiliate link: we may earn a commission at no extra cost to
                  you.
                </p>}
              </>
            ) : (
              <>
                <p className="mt-4">
                  This is an informational property guide. Direct inquiries are
                  not available for this listing.
                </p>
                <Link
                  href={"/stays?location=" + stay.location.slug}
                  className="btn btn-primary"
                >
                  Explore nearby stays <ArrowUpRight size={16} />
                </Link>
              </>
            )}
          </aside>
        </div>
        {related.length > 0 && (
          <section className="section-space">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Keep exploring</p>
                <h2>More places to call your own.</h2>
              </div>
            </div>
            <div className="stay-grid">
              {related.map((s) => (
                <StayCard stay={presentStay(s)} key={s.id} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="mobile-contact-bar">
        <span className="font-semibold text-emerald-900">
          Explore this place
        </span>
        <a className="btn btn-primary" href="#contact-host">
          {direct
            ? "Contact host"
            : partner
              ? "See booking options"
              : "Explore options"}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </>
  );
}
