"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
type Option = { name: string; slug: string };
export default function SearchFilters({
  locations,
  categories,
  values,
}: {
  locations: Option[];
  categories: Option[];
  values: Record<string, string | undefined>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-secondary mobile-filter-toggle"
        aria-expanded={open}
        aria-controls="stay-filters"
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal size={16} />
        Filter & sort
      </button>
      <form
        id="stay-filters"
        action="/stays"
        className={"filter-panel " + (open ? "is-open" : "")}
      >
        <p className="filter-title">Make yourself at home.</p>
        <label htmlFor="query">Name or landmark</label>
        <input
          id="query"
          name="q"
          defaultValue={values.q}
          placeholder="What’s on your mind?"
        />
        <label htmlFor="destination">Destination</label>
        <select
          id="destination"
          name="location"
          defaultValue={values.location || ""}
        >
          <option value="">All destinations</option>
          {locations.map((l) => (
            <option value={l.slug} key={l.slug}>
              {l.name}
            </option>
          ))}
        </select>
        <label htmlFor="stay-type">Stay type</label>
        <select
          id="stay-type"
          name="category"
          defaultValue={values.category || ""}
        >
          <option value="">All types</option>
          {categories.map((c) => (
            <option value={c.slug} key={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <label htmlFor="sort">Sort by</label>
        <select id="sort" name="sort" defaultValue={values.sort || "featured"}>
          <option value="featured">Our selection</option>
          <option value="newest">Recently added</option>
        </select>
        <button className="btn btn-primary mt-4" type="submit">
          Show stays
        </button>
        <Link href="/stays" className="filter-reset">
          Clear all filters
        </Link>
      </form>
    </>
  );
}
