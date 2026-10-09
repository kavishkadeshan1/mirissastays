# MirissaStays: full UI/UX redesign plan

Prepared 9 October 2026. Status: implementation brief; application files and production have not been changed.

## Recommendation

Build a coastal editorial identity around real Southern Sri Lankan places and straightforward accommodation discovery. Use warm ivory, deep ocean green, generous photography, expressive serif headings, and simple sans-serif controls. All interface surfaces must be solid: no glassmorphism, frosted panels, backdrop blur, or translucent navigation.

The primary journey is **discover an area → compare stays → understand the property → contact the host or continue to a booking partner**. The secondary journey is **read useful local advice → discover a relevant stay**. Hosts need an equally clear path from registration to a published listing and responding to inquiries.

## Evidence and scope

Reviewed the local route inventory, shared layouts, homepage, listing/search code, property cards/gallery/inquiry components, authentication, supporting pages, guide templates, host/admin structure, schema, and routing configuration. Sampled the live homepage, About page, guide index, and a property link in a browser. The live site and local Next.js implementation differ. Authenticated screens were reviewed in source, not through a logged-in session. This is a design and implementation audit, not a completed performance benchmark or comprehensive live functional test.

### Findings to prioritize

| Priority | Observation | Redesign implication |
| --- | --- | --- |
| P0 | The live homepage link to `/stay/the-spice-house-mirissa` returned HTTP 500 during review. | Diagnose the PHP application/server logs and restore the detail journey before launch. This observation does not establish that all properties fail or identify the cause. |
| P0 | Production exposes `.php` navigation; the workspace also contains Next.js routes and PHP equivalents. | Decide the deployment target before implementation. Redesigning only `src/` will not update a PHP deployment. |
| P1 | The live hero appeared as a large dark block; the coastline image did not load in this inspection. | Verify image delivery, use an owned/licensed local hero asset, and design a deliberate fallback. Recheck on normal devices before calling this a universal failure. |
| P1 | The homepage emphasizes direct booking, while many featured cards offer only “Guide & Photos.” | Explain the directory's mixed listing types and show the appropriate action on each property. |
| P1 | Local card, results, and detail code substitutes 5.0 ratings and sometimes one review; the schema also supplies these defaults. | Display ratings only when supported by records and a known source; otherwise omit the rating or show “Not yet reviewed.” Review existing default data before migration. |
| P1 | Local cards/detail/inquiry UI hardcodes `$` despite a currency field. | Use one currency formatter and explicit currency labels; never imply conversion without exchange-rate support. |
| P1 | Local search accepts minimum/maximum price parameters but exposes no price inputs; results have no pagination. | Surface useful filters, validate query values, preserve filter state, and add pagination as inventory grows. |
| P1 | The local login links to `/forgot-password`, but matching Next.js recovery pages are absent. The email starts with an admin address. | Complete recovery, start fields empty, and restore the intended destination after login. PHP recovery pages already exist and need parity mapping. |
| P1 | The host layout redirects pending hosts to `/host/pending`, which inherits the same layout. | Test and fix the potential repeated redirect before redesigning approval onboarding. |
| P2 | Heavy bold type, many small uppercase labels, repeated rounded cards, and generic marketing copy dominate. | Create a more distinctive hierarchy and make important facts easier to scan. |
| P2 | Root layout includes public navigation/footer around all routes; host pages add another main landmark. | Give public, authentication, host, and admin areas appropriate shells with one main landmark per page. |
| P2 | Some forms lack explicit label associations; mobile menu/lightbox need a complete focus audit; global reduced-motion styling is absent. | Build accessible interaction primitives and verify keyboard, screen-reader, and motion behavior. |
| P2 | Admin property modal includes `backdrop-blur-sm`; hero has a translucent search surround. | Remove blur and decorative translucent panels across every surface, including dashboards. |

Evidence locations: `src/components/home/HeroSection.tsx`, `src/components/stays/StayCard.tsx`, `src/components/stays/InquiryForm.tsx`, `src/components/stays/StayGallery.tsx`, `src/app/stays/page.tsx`, `src/app/stay/[slug]/page.tsx`, `src/app/login/page.tsx`, `src/app/host/layout.tsx`, `src/app/layout.tsx`, `src/app/admin/stays/page.tsx`, `prisma/schema.prisma`, and `.htaccess`.

## Visual design specification

| Element | Proposed treatment |
| --- | --- |
| Main background | Warm ivory `#F7F4EE` |
| Cards and forms | Solid white `#FFFFFF` |
| Primary text | Deep ink `#182D29` |
| Primary actions | Ocean green `#155E52`, white labels |
| Secondary text | Muted green-gray `#596660` |
| Dividers | Warm neutral `#DDD8CE`; stronger borders where needed for control recognition |
| Accent | Terracotta `#B54F35`, used sparingly for editorial details |
| Secondary section fill | Pale sand `#ECE5D8` |
| Typography | Proposed pairing: Fraunces for selected display headings; Manrope for body, navigation, forms, and dashboards. Validate font delivery/licensing during build; provide resilient fallbacks. |
| Type sizes | Body 16–18px; article 18px; labels generally 14px; mobile hero 38–46px; desktop hero 60–76px with responsive limits |
| Layout | Approximately 1240px content maximum; 20px mobile gutters; consistent 4/8px spacing rhythm |
| Corners | 10–16px on cards and controls; pills reserved for chips/statuses |
| Depth | Thin borders and restrained shadows; no blur, glow, or floating translucent panels |
| Motion | Brief 150–220ms feedback for controls; reduced-motion support; no scroll hijacking or autoplay hero carousel |
| Photography | Actual coastline, rooms, pools, and hosts; consistent crops and natural color. Never use generated imagery to represent a real property. |

Preserve the recognizable MirissaStays name and existing logo initially; improve logo sizing and placement after inspecting the original asset. Check all final foreground/background combinations for contrast rather than treating this palette as already certified.

This direction selectively applies 2026 ideas: distinctive visual identity, concise copy, and summaries before detail. These are editorial choices for this business, not a claim that every travel website should follow one trend. [Webflow's 2026 design review](https://webflow.com/blog/web-design-trends-2026).

## Information architecture

Public navigation: **Stays · Destinations · Travel Guides · About**. Keep **List your property** as the host action and Sign in as a quieter utility. Make Contact accessible from the menu and footer. Destination navigation should include all actual locations, not just the current three header links.

Keep existing property and guide slugs. Preserve useful destination/category landing pages. Map old PHP and query-string URLs deliberately if migrating; redirects must retain location/category context and use a consistent trailing-slash policy.

## Page-by-page implementation

| Page or area | Proposed experience | Completion condition |
| --- | --- | --- |
| Homepage `/` | Desktop split hero: short message/search on ivory at left, coastline photography at right. Mobile stacks naturally. Follow with area selection, 4–6 selected stays, how direct inquiries work, local guides, and a compact FAQ. | First useful action appears early; visitors can reach a property without navigating the entire homepage. |
| Browse `/stays` | Results count, readable destination/type/price filters, clear sorting, applied filter chips, reset, empty states, and pagination. Desktop sidebar; mobile filter sheet with Apply and Clear. | URLs reproduce the search; Back restores context; invalid query values do not break the page. |
| Destination `/location/[slug]` | Short place introduction, genuine area photo, local highlights, relevant listings, and practical guides. | Area-specific content helps a visitor choose; no large block of generic SEO prose before listings. |
| Category `/category/[slug]` | Brief category explanation, destination refinement, price filters, and the shared listing grid. | Category and destination selections remain consistent with browse results. |
| Property `/stay/[slug]` | Gallery, title/location, honest review summary, concise key facts, amenities, description, location, host/booking method, and related stays. | One clear primary action matches the listing's capabilities; no unsupported booking promises. |
| Guide index `/guides` | One editorial lead article and a readable index with useful topics; add search/topic filters only when tags and content volume support them. | Visitors find practical advice without repeated “most viewed/latest” content crowding the screen. |
| Guide detail `/guides/[slug]` | Readable article column, author credentials, reliable update date, summary, contents navigation, useful maps, contextual stays, related reading, comments. | Headings and contents links work; mobile tables do not break the page; recommendations are relevant. |
| About `/about` | Real founder/team story, local photos, how listings are reviewed, business model and affiliate explanation. | Trust claims reflect documented processes; avoid invented counts, awards, or guarantees. |
| Contact `/contact` | Clear traveler/host support options, concise form, visible labels, inline errors, and honest success confirmation. | Users retain input on failure and know whether a message was accepted. |
| FAQ `/faq` | Traveler and host questions grouped clearly; accessible accordions and a support route. | Keyboard operation and expanded state work; key booking facts match property pages. |
| Login/register | Simple solid panel; clearer host onboarding; empty defaults, password visibility control, useful validation and role-specific success. | Guest inquiry remains usable without forced registration; login returns users to an authorized intended route. |
| Password recovery | Bring PHP recovery functionality into parity if Next.js is selected; include request, expired/invalid link, and completion states. | Full recovery works end to end without exposing whether an email is registered. |
| Host pending | Clear approval state, submitted details, next steps, and support contact. | Page is reachable by pending hosts without a redirect loop; no invented review-time promise. |
| Host home `/host` | Listings with status and next action, new inquiry count, clear Add property action. | Counts use real data; status vocabulary matches backend behavior. |
| Host create/edit | Shared staged editor: basics, location, photos, amenities, price/contact, preview. Preserve progress with explicit drafts if persistence supports them. | Both create/edit cover the same fields; image upload failures are recoverable; existing data survives editing. |
| Host inquiries `/host/leads` | Inbox with property/date context, status filtering, readable contact actions; mobile cards where tables are too wide. | Status changes and contact actions use the correct guest/property; no fabricated booking revenue. |
| Admin overview and listings | Dedicated navigation, real operational counts, consistent searchable tables, property preview and editing. | Existing moderation capabilities remain available; actions show success/error and relevant confirmations. |
| Admin guides/comments | Shared editor, preview, publishing status, author fields, moderation tools. | Preview and published rendering agree; no loss of current SEO fields or comment controls. |
| Admin users/leads | Clear approval queues and inquiry status management with readable detail panels. | Roles and server authorization remain enforced; destructive actions are clearly distinguished. |
| Admin categories/locations/settings | Consistent management forms and feedback. | Existing values load correctly, changes persist, validation is visible. |
| Terms/privacy/cookies | Calm reading layout with contents links for long pages and meaningful update dates. | Existing policy meaning is preserved; content matches the actual product. |
| 404/loading/error states | Branded recovery links, helpful retry states, appropriately sized skeletons. | Missing content never looks like a successful empty page; errors offer a practical next action. |

### Homepage concept

Proposed H1: **“Find your place on Sri Lanka's south coast.”**

Supporting text: “Explore local stays in Mirissa, Weligama and beyond. Find the right place, then choose how to get in touch.”

Search: **Destination · Stay type · Explore stays**. Keep detailed budget filtering on the results page. Do not add a date availability search until real inventory/availability exists; dates currently belong to inquiries.

Suggested sequence: header → split hero/search → choose an area → selected stays → how host inquiries work → local travel guides → FAQ → compact footer.

### Property cards and conversion

Use a consistent card with a 4:3 image, property name, destination, type, a small number of factual amenities, price/currency when available, and “View stay.” Avoid duplicating a large description on every card. Keep whole-card links and secondary controls semantically separate.

Represent three modes explicitly:

1. **Direct inquiry:** “Contact host” or “Ask about availability”; WhatsApp plus an inquiry form. A price is indicative unless the host confirms it.
2. **External booking:** name the partner, explain that the link opens another site, and place an affiliate disclosure near the action where applicable.
3. **Information only:** “Explore this property” with photos/location and suitable alternatives. Do not imply that an inquiry or booking is possible.

On desktop, provide one solid sticky action panel, removing the current nested duplicate price/form container. On mobile, use a compact bottom action bar with price or “Request a quote,” and ensure it never hides controls or focused content. Inquiry success must say the request was received and availability is not confirmed. Preserve entered dates/contact details after errors. Only claim host notification if the notification mechanism actually succeeded.

## Shared implementation structure

Build reusable buttons, fields, select controls, chips, status badges, alerts, dialogs, sheets, accordions, pagination, empty states, and loading states. Product components should include `StayCard`, `StayGrid`, `SearchFilters`, `PriceDisplay`, `PropertyGallery`, `HostContactPanel`, `GuideCard`, `ArticleLayout`, `ListingEditor`, and `DataTable`.

Centralize tokens and formatters. Reuse listing/search logic across stays, destinations, and categories. Keep a consistent distinction between public editorial pages and operational dashboards. If Next.js is selected, use route/layout organization that separates their shells without changing public URLs; retain server rendering for content where practical and client behavior for genuine interactions.

The installed Next.js package reports **14.2.35**; `package.json` declares `^14.2.15`. The AGENTS.md documentation path `node_modules/next/dist/docs/` is absent in this install. Before writing application code, recheck the installed framework and consult matching official documentation when the required bundled guides are unavailable. Do not introduce newer-version APIs from memory or combine an unplanned major upgrade with the visual redesign.

## Data dependencies and scope boundaries

**Possible with existing data:** destination/category filtering, budget controls, honest price formatting, photo galleries, amenity presentation, inquiries, listing modes derived consistently from current fields, host/admin improvements.

**Needs explicit data work:** reliable rating provenance and aggregate counts; verification evidence/date; structured guest capacity/bedrooms/bathrooms; guide update dates; robust listing-mode fields; host draft persistence if absent. Add these only with migrations, validation, admin editing, and populated real records. Never backfill invented facts.

**Later enhancements:** map search after coordinates are audited; saved stays with clear persistence behavior; multilingual content; real availability or online payment as separately scoped product projects. An AI concierge, 3D hero, and elaborate animation are unnecessary for this launch.

## Build order and effort

Estimates are planning ranges for one developer with usable assets and access; deployment investigation, missing content, and migrations can extend them.

| Phase | Work | Estimate | Exit criterion |
| --- | --- | --- | --- |
| 0 | Confirm serving stack/hosting, investigate live property error, map URLs/data, establish staging and baseline | 1–2 days | One implementation target and working representative routes |
| 1 | Tokens, typography, shells, primitives; build homepage and property template at mobile/desktop sizes | 2–3 days | A concrete end-to-end visual direction with accessible core controls |
| 2 | Search, filters, cards, categories, destinations, gallery, direct/partner/information modes, inquiry behavior | 3–5 days | Complete guest discovery-to-contact journey |
| 3 | Guides, About, Contact, FAQ, auth/recovery, legal and recovery states | 2–4 days | All public page families covered |
| 4 | Host onboarding, listing editor/inquiries, admin navigation and management screens | 3–5 days | Host/admin workflows retain feature parity |
| 5 | Responsive/accessibility checks, measured performance, SEO redirects, staging review, release and rollback verification | 2–3 days | Launch criteria below satisfied |

Indicative total: **13–22 working days**, subject to Phase 0. Prioritize a complete search → property → inquiry slice before polishing secondary sections.

Deployment recommendation: if supported Node hosting and the Next.js migration are intended, use the existing Next.js app after achieving PHP feature/URL parity. If cPanel PHP hosting remains the target, implement this same design in the PHP templates and compiled CSS. Choose one primary implementation, with a documented cutover and rollback, instead of maintaining two redesigned products.

## Acceptance criteria

- Every mapped public route, old bookmarked URL, property mode, and authenticated workflow is checked on staging. Resolve the observed property error and missing recovery destination.
- Mobile/tablet/desktop coverage at 360, 390, 768, 1024, and 1440px, plus real iOS Safari and Android Chrome where available. No clipped navigation, page-level horizontal overflow, or obstructed form controls.
- WCAG 2.2 AA target: logical headings/landmarks, explicit labels, meaningful errors, keyboard operation, visible focus, dialog focus containment/return, reduced motion, and tested contrast. Use 44px touch controls as a practical design target; WCAG's minimum target-size criterion is 24px with defined exceptions. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Performance targets at the 75th percentile: LCP ≤2.5 seconds, INP ≤200ms, CLS ≤0.1. These are targets, not current measured scores. Use responsive images, reserve dimensions, prioritize the hero, lazy-load below-fold media/maps, and avoid unnecessary JavaScript. [Core Web Vitals](https://web.dev/articles/vitals).
- Filters have understandable labels, useful values, and visible applied state; empty results explain how to recover. [NN/g filter guidance](https://www.nngroup.com/articles/filter-categories-values/).
- No decorative backdrop blur or frosted UI remains. Scrims for dialogs may dim the page without blur; dialog content stays opaque.
- Ratings, verification claims, prices, fees, affiliate links, and availability language match the actual records and service. Structured data must follow the same rules as visible content.
- Test inquiry validation, invalid date ranges, duplicate submissions, failed sends, recovery, pending-host access, listing edits/uploads, authorization, and moderation. Use test accounts/data, not real guest messages.
- Check existing tests and TypeScript/build for a Next.js release, or PHP/template checks for a PHP release. Keep slugs, canonical URLs, metadata, sitemap entries, and redirect mappings consistent.

## Measurement after launch

Capture a baseline before release. Measure search → property views, property → host/partner clicks, inquiry starts → successful submissions, no-result searches, and host onboarding completion. A WhatsApp or partner click is an outbound action, not a confirmed booking. Keep personal form data out of analytics. Compare device-specific results over a meaningful period, accounting for traffic and seasonality; set improvement targets after baseline data exists.
