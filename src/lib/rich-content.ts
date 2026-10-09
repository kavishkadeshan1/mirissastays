import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Legacy listings contain both editor HTML and Markdown. Render both safely. */
export function renderRichContent(value: string): string {
  const input = value.replace(/\r\n/g, "\n").replace(/^\uFEFF/, "");
  const html = marked.parse(input, { async: false, gfm: true, breaks: true });
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["scope", "colspan"],
      td: ["colspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      img: (_tag, attrs) => ({
        tagName: "img",
        attribs: { ...attrs, loading: "lazy" },
      }),
      a: (_tag, attrs) => ({
        tagName: "a",
        attribs: { ...attrs, rel: "noopener noreferrer" },
      }),
    },
  });
}
