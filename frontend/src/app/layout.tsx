import type { Metadata } from "next";
import "./globals.css";
import "./coastal.css";
import "./editorial.css";
import SiteShell from "@/components/layout/SiteShell";
import {
  constructMetadata,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = constructMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [orgSchema, websiteSchema],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
