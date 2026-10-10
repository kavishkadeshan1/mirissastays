"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const workspace = p.startsWith("/admin") || p.startsWith("/host");
  const auth = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].includes(p);
  return (
    <div
      className={
        workspace ? "workspace-shell" : auth ? "auth-shell" : "public-shell"
      }
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {!workspace && <Navbar />}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {!workspace && !auth && <Footer />}
    </div>
  );
}
