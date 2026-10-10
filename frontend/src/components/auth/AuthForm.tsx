"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
export default function AuthForm({
  mode,
  token = "",
}: {
  mode: "login" | "register" | "forgot" | "reset";
  token?: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [show, setShow] = useState(false),
    [role, setRole] = useState("host");
  const titles = {
    login: "Welcome back.",
    register: "A new chapter starts here.",
    forgot: "Let’s get you back in.",
    reset: "A fresh start.",
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(e.currentTarget));
    if (mode === "reset" && values.password !== values.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const route =
        mode === "forgot"
          ? "forgot-password"
          : mode === "reset"
            ? "reset-password"
            : mode;
      const r = await fetch("/api/auth/" + route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role, token }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Please try again.");
      if (mode === "forgot")
        setSuccess(
          "If an account matches that email, a reset link will arrive shortly. Please check your spam folder too.",
        );
      else if (mode === "reset")
        setSuccess("Your password has been updated. You can now sign in.");
      else if (d.pendingApproval)
        setSuccess(
          "Your host registration has been received. Our team will review your details before activating your account.",
        );
      else {
        const callback = new URLSearchParams(window.location.search).get(
          "callbackUrl",
        );
        const safe =
          callback &&
          callback.startsWith("/") &&
          !callback.startsWith("//") &&
          !callback.includes("\\")
            ? callback
            : null;
        window.location.assign(
          safe ||
            (d.user?.role === "admin"
              ? "/admin"
              : d.user?.role === "host"
                ? "/host"
                : "/"),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <aside className="auth-story">
        <p className="eyebrow">Your coast. Your story.</p>
        <h2>
          Good places.
          <br />
          New beginnings.
        </h2>
        <p>
          Find your next escape, or share a little piece of the south coast with
          someone new.
        </p>
        <Link href="/stays" className="text-link">
          Explore the coast <ArrowUpRight size={16} />
        </Link>
      </aside>
      <div className="auth-panel">
        <p className="eyebrow">
          {mode === "register"
            ? "Join MirissaStays"
            : mode === "login"
              ? "Make yourself at home"
              : "Account recovery"}
        </p>
        <h1>{titles[mode]}</h1>
        {success ? (
          <div className="form-success" role="status">
            <p>{success}</p>
            <Link className="btn btn-primary mt-5" href="/login">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} aria-busy={busy}>
            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}
            {mode === "register" && (
              <>
                <fieldset className="mb-6">
                  <legend className="text-sm mb-3">I’m here as a</legend>
                  <div className="role-choice">
                    {[
                      ["host", "Property host"],
                      ["guest", "Traveler"],
                    ].map(([v, n]) => (
                      <label key={v}>
                        <input
                          type="radio"
                          checked={role === v}
                          onChange={() => setRole(v)}
                          name="role"
                          value={v}
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  Full name
                  <input
                    name="fullName"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                  />
                </label>
              </>
            )}
            {mode !== "reset" && (
              <label className="field">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={150}
                />
              </label>
            )}
            {mode === "register" && (
              <label className="field">
                Phone / WhatsApp
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength={6}
                  maxLength={30}
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label className="field">
                {mode === "reset" ? "New password" : "Password"}
                <span className="password-field">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    required
                    minLength={mode === "login" ? 6 : 8}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {mode !== "login" && (
                  <span className="text-xs text-slate-500">
                    Use at least 8 characters.
                  </span>
                )}
              </label>
            )}
            {mode === "reset" && (
              <label className="field">
                Confirm new password
                <input
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>
            )}
            {mode === "register" && role === "host" && (
              <label className="field">
                Business registration number (optional)
                <input name="businessRegNo" maxLength={100} />
              </label>
            )}
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-sm underline block text-right mb-6"
              >
                Forgot password?
              </Link>
            )}
            {mode === "forgot" && (
              <p className="text-sm text-slate-500 mb-6">
                Enter your account email and we’ll send a link to reset your
                password.
              </p>
            )}
            <button
              className="btn btn-primary w-full"
              disabled={busy || (mode === "reset" && !token)}
            >
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : mode === "register"
                    ? "Create account"
                    : mode === "forgot"
                      ? "Send reset link"
                      : "Update password"}
              <ArrowUpRight size={16} />
            </button>
            {mode === "reset" && !token && (
              <p role="alert" className="form-alert mt-4">
                This reset link is incomplete. Please request a new one.
              </p>
            )}
            {mode === "register" && (
              <p className="form-note">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </form>
        )}
        <p className="auth-bottom">
          {mode === "login" ? (
            <>
              New here? <Link href="/register">Create an account</Link>
            </>
          ) : mode === "register" ? (
            <>
              Already have an account? <Link href="/login">Sign in</Link>
            </>
          ) : (
            <Link href="/login">Back to sign in</Link>
          )}
        </p>
      </div>
    </div>
  );
}
