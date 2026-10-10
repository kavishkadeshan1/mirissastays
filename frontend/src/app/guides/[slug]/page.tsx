import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Photo from "@/components/ui/Photo";
import StayCard from "@/components/stays/StayCard";
import GuideCommentSection from "@/components/guides/GuideCommentSection";
import {
  constructMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { presentStay } from "@/lib/presentation";
import { renderRichContent } from "@/lib/rich-content";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = await prisma.guide.findUnique({
    where: { slug },
  });
  if (!g || g.status !== "published") notFound();
  return constructMetadata({
    title: g.metaTitle || `${g.title} | South Coast Journal`,
    description: g.metaDescription,
    image: g.featuredImage,
    canonical: "/guides/" + slug,
    type: "article",
    keywords: [
      g.title,
      "Mirissa travel tips",
      "Sri Lanka south coast guide",
      "things to do in Mirissa",
      "Mirissa travel journal",
    ],
  });
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = await prisma.guide.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!g || g.status !== "published") notFound();
  const stays = await prisma.stay.findMany({
    where: { status: "published" },
    take: 3,
    orderBy: { isFeatured: "desc" },
    include: { category: true, location: true },
  });
  const contents: { id: string; text: string }[] = [];
  let index = 0;
  const content = renderRichContent(g.content).replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_, attrs, text) => {
      const id = "section-" + ++index;
      contents.push({ id, text: text.replace(/<[^>]*>/g, "") });
      return (
        "<h2" +
        attrs.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "") +
        ' id="' +
        id +
        '">' +
        text +
        "</h2>"
      );
    },
  );
  const schema = generateArticleSchema({
    title: g.title,
    slug: g.slug,
    description: g.metaDescription,
    image: g.featuredImage,
    datePublished: g.createdAt.toISOString(),
    authorName: g.authorName || "MirissaStays editorial",
  });
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Travel Journal", url: "/guides" },
    { name: g.title, url: `/guides/${g.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [schema, breadcrumbs],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container-wide">
        <header className="article-header">
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/guides">Travel journal</Link>
          </nav>
          <p className="eyebrow">The south coast journal</p>
          <h1>{g.title}</h1>
          <p className="article-deck">{g.metaDescription}</p>
          <div className="article-author">
            <span>
              {g.authorName || "MirissaStays editorial"}
              {g.authorRole ? " · " + g.authorRole : ""}
            </span>
            <span>
              {formatDate(g.createdAt)} ·{" "}
              {Math.max(
                1,
                Math.ceil(
                  g.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 220,
                ),
              )}{" "}
              min read
            </span>
          </div>
        </header>
        <div className="article-cover">
          <Photo src={g.featuredImage} alt={g.title} priority sizes="100vw" />
        </div>
        <div className="article-layout">
          <aside className="article-toc">
            <p className="eyebrow mb-5">In this story</p>
            {contents.length ? (
              contents.map((c) => (
                <a href={"#" + c.id} key={c.id}>
                  {c.text}
                </a>
              ))
            ) : (
              <p className="text-sm">Local notes for your next trip.</p>
            )}
            <Link className="text-link mt-8" href="/stays">
              Find a place to stay ↗
            </Link>
          </aside>
          <div>
            <article
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="author-note">
              <p className="eyebrow">Behind the story</p>
              <h3>{g.authorName || "MirissaStays editorial"}</h3>
              {g.authorBio && <p>{g.authorBio}</p>}
            </div>
            <GuideCommentSection
              guideId={g.id}
              guideSlug={g.slug}
              initialComments={g.comments}
            />
          </div>
        </div>
        {stays.length > 0 && (
          <section className="section-space">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Make a trip of it</p>
                <h2>Stay a little closer.</h2>
              </div>
            </div>
            <div className="stay-grid">
              {stays.map((s) => (
                <StayCard key={s.id} stay={presentStay(s)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
