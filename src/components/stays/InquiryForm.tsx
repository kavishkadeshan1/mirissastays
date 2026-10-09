"use client";
import { useState } from "react";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import { sanitizeWhatsApp } from "@/lib/utils";
interface Props {
  stayId: number;
  stayTitle: string;
  whatsappNumber?: string;
  pricePerNight?: number;
  currency?: string;
}
export default function InquiryForm({
  stayId,
  stayTitle,
  whatsappNumber,
}: Props) {
  const [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false),
    [error, setError] = useState("");
  const [checkin, setCheckin] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          stayId,
          guestsCount: Number(data.guestsCount),
        }),
      });
      const result = await r.json();
      if (!r.ok)
        throw new Error(
          result.error || "Your inquiry could not be sent. Please try again.",
        );
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status" tabIndex={-1}>
        <CheckCircle className="mb-3 text-brand-600" />
        <h3 className="font-semibold mb-2">Your inquiry is received.</h3>
        <p>
          Your request for {stayTitle} is saved in the host’s inbox. Your dates
          and price still need confirmation.
        </p>
        {whatsappNumber && (
          <a
            className="btn btn-primary"
            href={
              "https://wa.me/" +
              sanitizeWhatsApp(whatsappNumber) +
              "?text=" +
              encodeURIComponent(
                "Hi, I sent an inquiry for " + stayTitle + " on MirissaStays.",
              )
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow up on WhatsApp <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    );
  return (
    <form className="inquiry-form" onSubmit={submit} aria-busy={busy}>
      {error && (
        <div role="alert" className="form-alert">
          {error}
        </div>
      )}
      <div className="field-row">
        <label className="field">
          Check-in
          <input
            name="checkinDate"
            type="date"
            min={today}
            required
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </label>
        <label className="field">
          Check-out
          <input
            name="checkoutDate"
            type="date"
            min={checkin || today}
            required
          />
        </label>
      </div>
      <label className="field">
        Guests
        <select name="guestsCount" defaultValue="2">
          {Array.from({ length: 16 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i === 0 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Your name
        <input
          name="guestName"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
        />
      </label>
      <label className="field">
        Email address
        <input
          name="guestEmail"
          autoComplete="email"
          type="email"
          required
          maxLength={150}
        />
      </label>
      <label className="field">
        Phone / WhatsApp
        <input
          name="guestPhone"
          autoComplete="tel"
          type="tel"
          placeholder="+94…"
          required
          minLength={6}
          maxLength={30}
        />
      </label>
      <label className="field">
        Anything else? <span className="sr-only">Optional</span>
        <textarea
          name="specialRequests"
          rows={3}
          maxLength={1000}
          placeholder="Arrival time, room preferences… (optional)"
        />
      </label>
      <input
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending your inquiry…" : "Send inquiry"}{" "}
        <ArrowUpRight size={16} />
      </button>
      <p className="form-note">
        No payment is taken here. The host confirms availability and the final
        rate.
      </p>
    </form>
  );
}
