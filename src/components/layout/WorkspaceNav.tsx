"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, ArrowUpRight } from "lucide-react";
export default function WorkspaceNav({ kind }: { kind: "admin" | "host" }) {
  const p = usePathname();
  const links =
    kind === "host"
      ? [
          ["Overview", "/host"],
          ["Add a place", "/host/stays/new"],
          ["Inquiries", "/host/leads"],
        ]
      : [
          ["Overview", "/admin"],
          ["Properties", "/admin/stays"],
          ["Journal", "/admin/guides"],
          ["People", "/admin/users"],
          ["Inquiries", "/admin/leads"],
          ["Categories", "/admin/categories"],
          ["Destinations", "/admin/locations"],
          ["Settings", "/admin/settings"],
        ];
  return (
    <header className="workspace-nav">
      <Link className="wordmark" href="/">
        <Waves />
        <span>mirissastays.</span>
      </Link>
      <span className="text-xs uppercase tracking-widest">
        {kind === "host" ? "Host workspace" : "Admin workspace"}
      </span>
      <Link href="/" className="text-xs inline-flex gap-2">
        View website <ArrowUpRight size={14} />
      </Link>
      <nav aria-label={kind + " navigation"}>
        {links.map(([n, h]) => (
          <Link href={h} key={h} aria-current={p === h ? "page" : undefined}>
            {n}
          </Link>
        ))}
      </nav>
    </header>
  );
}
