type Stay = {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  featuredImage: string;
  pricePerNight: string | number;
  currency: string;
  location?: { name: string } | null;
};

async function getStays(): Promise<Stay[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/stays`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { stays?: Stay[] };
    return data.stays ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const stays = await getStays();

  return (
    <main>
      <nav><strong>mirissastays.</strong><span>South coast stays</span></nav>
      <section className="hero">
        <p className="eyebrow">Good places, great memories</p>
        <h1>Somewhere you’ll love to stay.</h1>
        <p>Explore verified places across Mirissa, Weligama and the south coast.</p>
      </section>
      <section className="collection">
        <h2>Places to stay</h2>
        {stays.length === 0 ? (
          <div className="empty"><h3>Places are temporarily unavailable.</h3><p>Check that the backend database is connected.</p></div>
        ) : (
          <div className="grid">{stays.map((stay) => (
            <article className="card" key={stay.id}>
              <img src={stay.featuredImage} alt={stay.title} />
              <div><p className="eyebrow">{stay.location?.name ?? "South coast"}</p><h3>{stay.title}</h3><p>{stay.shortDesc}</p><strong>{stay.currency} {String(stay.pricePerNight)} / night</strong></div>
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
