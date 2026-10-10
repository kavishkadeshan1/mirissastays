"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, Check } from "lucide-react";
import Photo from "@/components/ui/Photo";
type Option = { id: number; name: string };
export interface ListingData {
  id?: number;
  title: string;
  categoryId: number;
  locationId: number;
  pricePerNight: number;
  currency: string;
  featuredImage: string;
  gallery: string[];
  address: string;
  mapEmbed?: string;
  whatsappNumber: string;
  shortDesc: string;
  fullContent: string;
  amenities: string[];
}
export default function ListingEditor({
  initial,
  categories,
  locations,
}: {
  initial?: ListingData;
  categories: Option[];
  locations: Option[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ListingData>(
    initial || {
      title: "",
      categoryId: categories[0]?.id || 0,
      locationId: locations[0]?.id || 0,
      pricePerNight: 0,
      currency: "USD",
      featuredImage: "",
      gallery: [],
      address: "",
      mapEmbed: "",
      whatsappNumber: "",
      shortDesc: "",
      fullContent: "",
      amenities: [],
    },
  );
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function update<K extends keyof ListingData>(key: K, value: ListingData[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }
  const steps = [
    "The basics",
    "Photos & comforts",
    "Rates & contact",
    "Review",
  ];
  function go(next: number) {
    if (next > step && !form.current?.reportValidity()) return;
    setError("");
    setStep(next);
    document.getElementById("editor-title")?.focus();
  }
  async function upload(
    e: React.ChangeEvent<HTMLInputElement>,
    gallery = false,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "stays");
      const r = await fetch("/api/upload", { method: "POST", body });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed.");
      setData((p) =>
        gallery
          ? { ...p, gallery: [...p.gallery, j.url] }
          : { ...p, featuredImage: j.url },
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      go(step + 1);
      return;
    }
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch(
        initial?.id ? "/api/host/stays/" + initial.id : "/api/host/stays",
        {
          method: initial?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not save this listing.");
      router.push("/host");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this listing.");
    } finally {
      setBusy(false);
    }
  }
  const amenities = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Swimming Pool",
    "Ocean View",
    "Kitchen",
    "Breakfast Included",
    "Free Parking",
    "Clean Linen",
  ];
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/host"
        className="inline-flex gap-2 items-center text-sm mb-7"
      >
        <ArrowLeft size={16} />
        My properties
      </Link>
      <p className="eyebrow">Your place on the coast</p>
      <h1 className="text-3xl mt-3 mb-6">
        {initial
          ? "Give your listing a little attention."
          : "Let’s introduce your place."}
      </h1>
      <nav className="editor-steps" aria-label="Listing steps">
        {steps.map((s, i) => (
          <button
            type="button"
            key={s}
            aria-current={step === i ? "step" : undefined}
            disabled={busy || uploading || i > step + 1}
            onClick={() => go(i)}
          >
            {i + 1}. {s}
          </button>
        ))}
      </nav>
      <form ref={form} onSubmit={save} className="editor-section">
        <h2 id="editor-title" tabIndex={-1}>
          {steps[step]}
        </h2>
        <p>
          {
            [
              "Start with the details travelers need to find your property.",
              "Show what makes your place special. Only select amenities you provide.",
              "Help guests understand your rates and how to reach you.",
              "Take one last look. New listings are saved for our team to review.",
            ][step]
          }
        </p>
        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}
        {step === 0 && (
          <>
            <label className="field">
              Property name
              <input
                required
                minLength={3}
                maxLength={200}
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </label>
            <div className="field-row">
              <label className="field">
                Stay type
                <select
                  value={data.categoryId}
                  onChange={(e) => update("categoryId", Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Destination
                <select
                  value={data.locationId}
                  onChange={(e) => update("locationId", Number(e.target.value))}
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field">
              Property address
              <input
                required
                minLength={5}
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </label>
            <label className="field">
              Google Maps embed code or share link
              <textarea
                rows={2}
                placeholder='Paste Google Maps iframe (<iframe src="..."></iframe>) or Google Maps URL'
                value={data.mapEmbed || ""}
                onChange={(e) => update("mapEmbed", e.target.value)}
              />
              <span className="text-xs text-slate-500">
                Optional: Paste an embed code or Google Maps URL. If left empty, a map is automatically generated from your address.
              </span>
            </label>
            <label className="field">
              A short introduction
              <textarea
                required
                minLength={10}
                maxLength={255}
                rows={3}
                value={data.shortDesc}
                onChange={(e) => update("shortDesc", e.target.value)}
              />
            </label>
            <label className="field">
              Tell guests more
              <textarea
                required
                minLength={20}
                rows={7}
                value={data.fullContent}
                onChange={(e) => update("fullContent", e.target.value)}
              />
              <span className="text-xs text-slate-500">
                Describe the rooms, surroundings and what to expect. Existing
                HTML formatting is preserved.
              </span>
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <label className="field">
              Cover photo URL
              <input
                required
                value={data.featuredImage}
                onChange={(e) => update("featuredImage", e.target.value)}
                placeholder="/uploads/stays/… or https://…"
              />
            </label>
            <label className="btn btn-secondary cursor-pointer">
              <Upload size={16} />
              {uploading ? "Uploading…" : "Upload cover photo"}
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                onChange={(e) => upload(e)}
              />
            </label>
            {data.featuredImage && (
              <div className="editor-photo">
                <Photo
                  src={data.featuredImage}
                  alt="Property cover preview"
                  sizes="700px"
                />
              </div>
            )}
            <h3 className="font-semibold mt-7 mb-4">More photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {data.gallery.map((url, i) => (
                <div key={i}>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Photo
                      src={url}
                      alt={"Gallery photo " + (i + 1)}
                      sizes="200px"
                    />
                  </div>
                  <button
                    className="text-sm underline py-3"
                    type="button"
                    onClick={() =>
                      update(
                        "gallery",
                        data.gallery.filter((_, n) => n !== i),
                      )
                    }
                  >
                    Remove photo {i + 1}
                  </button>
                </div>
              ))}
            </div>
            <label className="btn btn-secondary my-5 cursor-pointer">
              <Upload size={16} />
              Add gallery photo
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                onChange={(e) => upload(e, true)}
              />
            </label>
            <h3 className="font-semibold my-5">Amenities</h3>
            <div className="editor-amenities">
              {Array.from(new Set([...amenities, ...data.amenities])).map(
                (a) => (
                  <label key={a}>
                    <input
                      type="checkbox"
                      checked={data.amenities.includes(a)}
                      onChange={(e) =>
                        update(
                          "amenities",
                          e.target.checked
                            ? [...data.amenities, a]
                            : data.amenities.filter((v) => v !== a),
                        )
                      }
                    />
                    {a}
                  </label>
                ),
              )}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="field-row">
              <label className="field">
                Starting price / night
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={data.pricePerNight}
                  onChange={(e) =>
                    update("pricePerNight", Number(e.target.value))
                  }
                />
              </label>
              <label className="field">
                Currency
                <select
                  value={data.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  {Array.from(
                    new Set(["USD", "LKR", "EUR", "GBP", data.currency]),
                  ).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Use 0 when guests should request a quote. Confirm the final rate
              with each guest.
            </p>
            <label className="field">
              Host WhatsApp number
              <input
                required
                type="tel"
                minLength={6}
                maxLength={30}
                value={data.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+94…"
              />
            </label>
            <p className="text-sm text-slate-500">
              This number appears in the listing’s host contact options.
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <div className="editor-photo">
              <Photo src={data.featuredImage} alt={data.title} sizes="700px" />
            </div>
            <h3 className="text-2xl font-semibold my-4">{data.title}</h3>
            <p>
              {categories.find((c) => c.id === data.categoryId)?.name} ·{" "}
              {locations.find((l) => l.id === data.locationId)?.name}
            </p>
            <p className="text-slate-600 my-4">{data.shortDesc}</p>
            <dl className="grid grid-cols-2 gap-4 text-sm border-y border-slate-200 py-5 my-5">
              <dt>Starting rate</dt>
              <dd>
                {data.pricePerNight > 0
                  ? data.currency + " " + data.pricePerNight
                  : "Request a quote"}
              </dd>
              <dt>Contact</dt>
              <dd>{data.whatsappNumber}</dd>
              <dt>Address</dt>
              <dd>{data.address}</dd>
              <dt>Photos</dt>
              <dd>{1 + data.gallery.length}</dd>
            </dl>
            <p className="text-sm text-slate-500">
              {data.amenities.join(" · ") || "No amenities selected."}
            </p>
          </>
        )}
        <div className="editor-actions">
          <button
            className="btn btn-secondary"
            type="button"
            disabled={step === 0 || busy || uploading}
            onClick={() => go(step - 1)}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={
              busy || uploading || !categories.length || !locations.length
            }
          >
            {busy
              ? "Saving…"
              : step === 3
                ? initial
                  ? "Save changes"
                  : "Submit for review"
                : "Continue"}
            {step === 3 ? <Check size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}
