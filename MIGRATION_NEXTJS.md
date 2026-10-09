# MirissaStays redesign and migration

The redesign runs in the Next.js application in `src/`. The PHP application is preserved for rollback. Do not upload the repository wholesale into a PHP public directory: it contains development scripts and environment files.

## Content and photos

- Seven properties were archived at the owner's request. Their original statuses are saved in `reports/archived-stays-before-redesign.json`. They remain in the database for administration but are excluded from public listings and sitemap entries.
- Run `node scripts/archive-unverified-stays.cjs` against the migrated database to apply the same explicit exclusion. It is idempotent. Do not run the seed script against existing production data.
- Published property photos are stored in `public/uploads/property-media/`. Ship this folder with the application.
- `src/data/property-media.json` records each original URL and its local replacement. Five properties use their existing Booking.com CDN photos. Four use their existing property photos from Google/the property's CDN because Booking.com presented a bot-verification barrier. Their matching Booking.com pages are recorded as references, not as the source of those photos.
- The media override only applies while the original featured image is unchanged. Uploading a new cover from the host/admin editor takes precedence.
- Legacy HTML and Markdown descriptions share a sanitized renderer with headings, lists, tables and paragraph spacing.

## Hosting requirements

Use a persistent Node.js service with Node 20.9+ (Node 24 LTS recommended), MySQL connectivity and HTTPS. This application is not a static export. Standard PHP-only cPanel hosting cannot run it without Node application support.

Keep `public/uploads` on persistent storage. The current upload endpoint writes there; an ephemeral/serverless deployment needs an object-storage adapter before accepting uploads. Back up both MySQL and uploads.

Required environment variables, configured through the hosting secret manager:

```text
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
JWT_SECRET=<a long randomly generated secret>
NEXT_PUBLIC_SITE_URL=https://mirissastays.com
APP_URL=https://mirissastays.com
SMTP_HOST=<mail service host>
SMTP_PORT=587
SMTP_USER=<mail service username>
SMTP_PASS=<mail service password>
SMTP_FROM=<verified sender address>
```

Mail variables are required for password-reset emails. Missing mail configuration returns a visible service-unavailable message rather than claiming that an email was sent. Contact messages and stay inquiries are stored in the database; they do not constitute confirmed bookings.

## Stage and verify

1. Back up the live database and uploads. Import a copy into staging with a separate database user. Keep staging blocked from search indexing at the host/reverse proxy.
2. Install dependencies with `npm ci`, then run `npm run db:generate`. The redesign reuses the existing schema. Do not run `db:push` or `db:seed` without separately reviewing database changes.
3. Copy the current uploads and new property-media assets. Apply the seven-property archive script once against staging.
4. Run `npm test`, `npm run check`, and `npm run build`. Start the built server with `npm start`.
5. Run `node scripts/smoke-redesign.cjs` against staging using `SMOKE_BASE_URL`. It checks public pages, property photos, filters, redirects, archived-property exclusions and invalid API input without creating leads or sending messages.
6. Manually verify host/admin sign-in, one approved test listing upload, a test inquiry, and password reset with a dedicated test mailbox. Confirm gallery and currency survive editing. Remove only test records you created.
7. Verify the final hostname, sitemap, HTTPS cookies, persistent uploads and mail delivery before switching production traffic.

## Cutover and rollback

The migration includes permanent redirects for common PHP pages and query-based property/guide links. Verify the actual live server's rewrite rules and access logs for additional legacy URLs before cutover. Query filters on the old homepage redirect to `/stays`.

Freeze content editing briefly, sync the final database/uploads, apply the archive script, and point the domain's reverse proxy at the Node service. Keep the old PHP release and a database backup until the new release is stable. To roll back, restore routing to the PHP release and reconcile content added during the cutover window.

## Attracting and retaining visitors

The redesign improves readable property pages, internal links, mobile navigation, clear booking actions, canonical URLs, structured data and crawlable destination pages. These changes do not guarantee traffic growth. After launch, connect Search Console, submit `/sitemap.xml`, and measure search impressions, listing visits and completed inquiries. Prioritize accurate original photos and useful destination articles over adding more unverified listings.

Review external rates, facilities and historical review claims in existing descriptions before launch; they are editorial content, not live availability or live Booking.com ratings.
