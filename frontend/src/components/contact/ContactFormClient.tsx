"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ContactFormClient() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Please try again.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-form-panel">
      {sent ? (
        <div className="form-success" role="status">
          <h2 className="text-3xl mb-4">Thank you for reaching out.</h2>
          <p>Your message has been received. Our team will review it.</p>
          <button
            onClick={() => setSent(false)}
            className="btn btn-secondary mt-6"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={submit} aria-busy={busy}>
          <h2 className="text-3xl mb-7">Leave us a note.</h2>
          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}
          <label className="field">
            Your name
            <input
              name="name"
              required
              autoComplete="name"
              minLength={2}
              maxLength={150}
            />
          </label>
          <label className="field">
            Email address
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={150}
            />
          </label>
          <label className="field">
            What’s it about?
            <select name="subject" required>
              <option value="">Choose a topic</option>
              <option>Travel question</option>
              <option>Listing my property</option>
              <option>Help with my account</option>
              <option>Partnership or feedback</option>
            </select>
          </label>
          <label className="field">
            Your message
            <textarea
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={3000}
            />
          </label>
          <input
            name="honeypot"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Sending…" : "Send your message"}
            <ArrowUpRight size={16} />
          </button>
          <p className="form-note">
            We use these details to respond to your message.{" "}
            <Link href="/privacy" className="underline">
              Privacy policy
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
