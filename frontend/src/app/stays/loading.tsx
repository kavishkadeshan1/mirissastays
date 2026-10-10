export default function Loading() {
  return (
    <div
      className="container-wide section-space"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-5 w-36 bg-slate-200 rounded mb-8" />
      <div className="h-16 w-3/4 bg-slate-200 rounded mb-10" />
      <div className="stay-grid">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
            <div className="h-5 bg-slate-200 rounded mt-5 w-2/3" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading your next destination…</span>
    </div>
  );
}
