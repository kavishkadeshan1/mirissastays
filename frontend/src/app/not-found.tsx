import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-wide section-space">
      <div className="empty-state">
        <p className="eyebrow justify-center mb-5">
          404 · A little off the beaten path
        </p>
        <h1 className="text-5xl mb-5">Let’s find your way back.</h1>
        <p>This page may have moved, or this place is no longer listed.</p>
        <Link className="btn btn-primary" href="/stays">
          Explore places to stay
        </Link>
      </div>
    </div>
  );
}
