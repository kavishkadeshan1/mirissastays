import Link from "next/link";
import { Mail, MessageSquare, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, sanitizeWhatsApp } from "@/lib/utils";
export const dynamic = "force-dynamic";

export default async function HostLeads({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const statuses = ["new", "contacted", "booked", "cancelled"];
  const status = statuses.includes((await searchParams).status || "")
    ? (await searchParams).status
    : undefined;
  const leads = await prisma.lead.findMany({
    where: { stay: { hostId: user.id }, ...(status ? { status } : {}) },
    include: { stay: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Your conversations</p>
        <h1 className="text-4xl mt-3 mb-3">Guest inquiries</h1>
        <p className="text-slate-600">
          Review travel plans and contact guests to confirm availability.
        </p>
      </header>
      <nav className="filter-chips mb-7" aria-label="Filter inquiries">
        <Link href="/host/leads" aria-current={!status ? "page" : undefined}>
          All inquiries
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={"/host/leads?status=" + s}
            aria-current={status === s ? "page" : undefined}
            className="capitalize"
          >
            {s}
          </Link>
        ))}
      </nav>
      {!leads.length ? (
        <div className="empty-state">
          <MessageSquare className="mx-auto mb-4" />
          <h2>No inquiries here yet.</h2>
          <p>Guest requests for your properties will appear in this inbox.</p>
          <Link className="btn btn-secondary" href="/host">
            Your properties
          </Link>
        </div>
      ) : (
        <div className="inbox-grid">
          {leads.map((lead) => (
            <article key={lead.id} className="inbox-card">
              <div className="flex items-center justify-between gap-3">
                <span className="inbox-status">{lead.status}</span>
                <time
                  className="text-xs text-slate-500"
                  dateTime={lead.createdAt.toISOString()}
                >
                  {formatDate(lead.createdAt)}
                </time>
              </div>
              <h2>{lead.guestName}</h2>
              <Link className="text-link" href={"/stay/" + lead.stay.slug}>
                {lead.stay.title}
                <ArrowUpRight size={15} />
              </Link>
              <dl>
                <div>
                  <dt>ARRIVAL</dt>
                  <dd>{formatDate(lead.checkinDate)}</dd>
                </div>
                <div>
                  <dt>DEPARTURE</dt>
                  <dd>{formatDate(lead.checkoutDate)}</dd>
                </div>
                <div>
                  <dt>GUESTS</dt>
                  <dd>{lead.guestsCount ?? 2}</dd>
                </div>
                <div>
                  <dt>EMAIL</dt>
                  <dd>{lead.guestEmail}</dd>
                </div>
              </dl>
              {lead.specialRequests && (
                <p className="text-sm text-slate-600 mb-6 whitespace-pre-wrap">
                  {lead.specialRequests}
                </p>
              )}
              <div className="inbox-actions">
                {sanitizeWhatsApp(lead.guestPhone).length > 5 && (
                  <a
                    className="btn btn-primary"
                    href={"https://wa.me/" + sanitizeWhatsApp(lead.guestPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp <ArrowUpRight size={15} />
                  </a>
                )}
                <a
                  className="btn btn-secondary"
                  href={
                    "mailto:" +
                    encodeURIComponent(lead.guestEmail) +
                    "?subject=" +
                    encodeURIComponent("Your inquiry for " + lead.stay.title)
                  }
                >
                  <Mail size={15} />
                  Email guest
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
      {leads.length === 100 && (
        <p className="text-sm text-slate-500 mt-5">
          Showing the latest 100 inquiries. Choose a status to narrow the list.
        </p>
      )}
    </div>
  );
}
