import Link from "next/link";
import { Waves, ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-top">
          <div>
            <p className="eyebrow">A slower kind of getaway</p>
            <h2>The coast is calling.</h2>
            <Link href="/stays" className="footer-explore">
              Find your next stay <ArrowUpRight />
            </Link>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/stays">All stays</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/guides">Travel journal</Link>
            <Link href="/faq">Good to know</Link>
          </div>
          <div>
            <h3>Stay connected</h3>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/register?type=host">List your place</Link>
            <Link href="/login">Host sign in</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="wordmark">
            <Waves />
            <span>mirissastays.</span>
          </Link>
          <span>© {new Date().getFullYear()} MirissaStays</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
        <p className="affiliate-note">
          Some property links are affiliate links. We may earn a commission if
          you book through them, at no extra cost to you. Direct inquiries are
          confirmed by the host.
        </p>
      </div>
    </footer>
  );
}
