"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container-wide section-space">
      <div className="empty-state">
        <p className="eyebrow justify-center mb-5">A small detour</p>
        <h2>We couldn’t load this page.</h2>
        <p>
          Please try again in a moment. Your next coastal escape is still out
          there.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button className="btn btn-primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
