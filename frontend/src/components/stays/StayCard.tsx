import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { StayItem } from "@/types";
import { formatPrice, sanitizeWhatsApp } from "@/lib/utils";
import Photo from "@/components/ui/Photo";
import { stayMedia } from "@/lib/stay-media";
import { bookingPartnerUrl } from "@/lib/presentation";
export default function StayCard({ stay }: { stay: StayItem }) {
  const direct =
    stay.allowBooking && sanitizeWhatsApp(stay.whatsappNumber).length > 5;
  return (
    <article className="stay-card">
      <Link
        href={`/stay/${stay.slug}`}
        className="stay-card-photo"
        aria-label={`View ${stay.title}`}
      >
        <Photo src={stayMedia(stay).featuredImage} alt={stay.title} />
        <span className="photo-tag">
          {stay.category?.name || "Coastal stay"}
        </span>
        <span className="card-arrow">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="stay-card-copy">
        <p className="card-location">
          <MapPin size={13} />
          {stay.location?.name || "South coast"}
        </p>
        <h3>
          <Link href={`/stay/${stay.slug}`}>{stay.title}</Link>
        </h3>
        <p className="card-description">{stay.shortDesc}</p>
        <div className="card-bottom">
          <Link
            href={`/stay/${stay.slug}`}
            className="explore-btn inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Explore this place</span>
            <ArrowUpRight size={14} />
          </Link>
          <span className="listing-mode">
            {direct
              ? "Direct inquiry"
              : bookingPartnerUrl(stay.affiliateUrl) || stayMedia(stay).sourcePage
                ? "Partner link"
                : "Local guide"}
          </span>
        </div>
      </div>
    </article>
  );
}
