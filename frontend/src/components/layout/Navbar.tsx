"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, Waves } from "lucide-react";
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ role: string; fullName: string } | null>(
    null,
  );
  useEffect(() => {
    setOpen(false);
    let active = true;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active) setUser(d?.user || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    ["Stays", "/stays"],
    ["Destinations", "/destinations"],
    ["Travel journal", "/guides"],
    ["Our story", "/about"],
  ];
  async function logout() {
    const r = await fetch("/api/auth/logout", { method: "POST" });
    if (r.ok) {
      setUser(null);
      window.location.assign("/");
    }
  }
  return (
    <header className="site-header">
      <div className="container-wide nav-row">
        <Link href="/" className="wordmark" aria-label="MirissaStays home">
          <Waves strokeWidth={1.5} />
          <span>
            mirissa<span className="wordmark-light">stays</span>
            <i>.</i>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="desktop-actions">
          {user ? (
            <>
              <Link
                href={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "host"
                      ? "/host"
                      : "/stays"
                }
              >
                My account
              </Link>
              <button onClick={logout} className="text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link className="btn btn-primary" href="/register?type=host">
                List your place <ArrowUpRight size={15} />
              </Link>
            </>
          )}
        </div>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([name, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link href="/contact">Contact us</Link>
          {user ? (
            <>
              <Link href={user.role === "admin" ? "/admin" : "/host"}>
                My account
              </Link>
              <button onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link href="/register?type=host">List your place</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
