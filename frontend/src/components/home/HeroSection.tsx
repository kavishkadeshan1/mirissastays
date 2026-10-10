import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, ArrowRight } from "lucide-react";
interface Option {
  name: string;
  slug: string;
}
export default function HeroSection({
  locations,
  categories,
}: {
  locations: Option[];
  categories: Option[];
}) {
  return (
    <section className="coast-hero container-wide">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-sun">✳</span> A little closer to local life
        </p>
        <h1>
          Find your place
          <br />
          on the <em>south coast.</em>
        </h1>
        <p className="hero-description">
          Slow mornings. Salt in the air. Somewhere that feels like you.
          Discover stays and local stories from Sri Lanka’s southern shores.
        </p>
        <form action="/stays" className="hero-search">
          <div>
            <label htmlFor="hero-location">Where to?</label>
            <select id="hero-location" name="location">
              <option value="">Anywhere on the coast</option>
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hero-category">Your kind of stay</label>
            <select id="hero-category" name="category">
              <option value="">All stays</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            aria-label="Explore stays"
          >
            <ArrowRight size={22} />
            <span className="mobile-search-label">Explore stays</span>
          </button>
        </form>
        <div className="hero-footnote">
          <span>Local places. Your own pace.</span>
          <Link href="/about">
            Get to know us <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <figure className="hero-photo">
        <Image
          src="/social-share.jpg"
          alt="Coconut palms above the turquoise sea at Coconut Tree Hill, Mirissa"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 50vw"
          className="object-cover"
        />
        <figcaption>
          <MapPin size={15} />
          <span>Coconut Tree Hill, Mirissa</span>
        </figcaption>
        <div className="hero-stamp" aria-hidden="true">
          SOUTH COAST
          <br />
          <span>✳</span>
          <br />
          SRI LANKA
        </div>
      </figure>
    </section>
  );
}
