/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/stay.php",
        has: [{ type: "query", key: "slug", value: "(?<slug>[^/]+)" }],
        destination: "/stay/:slug",
        permanent: true,
      },
      {
        source: "/guide.php",
        has: [{ type: "query", key: "slug", value: "(?<slug>[^/]+)" }],
        destination: "/guides/:slug",
        permanent: true,
      },
      {
        source: "/category.php",
        has: [{ type: "query", key: "slug", value: "(?<slug>[^/]+)" }],
        destination: "/category/:slug",
        permanent: true,
      },
      {
        source: "/location.php",
        has: [{ type: "query", key: "slug", value: "(?<slug>[^/]+)" }],
        destination: "/location/:slug",
        permanent: true,
      },
      ...[
        "stays",
        "guides",
        "about",
        "contact",
        "faq",
        "privacy",
        "terms",
        "cookies",
        "login",
        "register",
        "forgot-password",
        "reset-password",
      ].map((page) => ({
        source: `/${page}.php`,
        destination: `/${page}`,
        permanent: true,
      })),
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/sitemap.php", destination: "/sitemap.xml", permanent: true },
      { source: "/guide/:slug", destination: "/guides/:slug", permanent: true },
      { source: "/places", destination: "/stays", permanent: true },
      { source: "/host/dashboard.php", destination: "/host", permanent: true },
      {
        source: "/admin/dashboard.php",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "d28lgmef6a1iew.cloudfront.net" },
      { protocol: "https", hostname: "kavishkadeshan.me" },
      { protocol: "https", hostname: "mirissastays.com" },
    ],
  },
};

export default nextConfig;
