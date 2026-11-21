# SEO / AI Search (AIEO) configuration

## Implemented
- Canonical URL without date, language or walking-distance query parameters
- Korean/English metadata and hreflang alternates
- Open Graph and Twitter cards (approved event poster only)
- Schema.org `CollectionPage` on the homepage and `MusicEvent` on published event details
- Dynamic `/sitemap.xml` for upcoming published events, and `/robots.txt` pointing to it
- `/llms.txt` describing coverage, source links and freshness limitations
- Admin pages have noindex; robots policy disallows admin and API paths

## Required Railway environment
Set `PUBLIC_SITE_URL=https://indie-flow-production.up.railway.app` (or your **verified canonical custom domain**). Never set a localhost URL in production. After redeploy verify canonical, sitemap and robots refer to the same HTTPS host.

## Checks
1. `npm ci && npm run build && npm test`
2. `curl -i https://indie-flow-production.up.railway.app/robots.txt`
3. `curl -i https://indie-flow-production.up.railway.app/sitemap.xml`
4. `curl -i https://indie-flow-production.up.railway.app/llms.txt`
5. Inspect homepage and event detail HTML: title, description, canonical, hreflang, OG/Twitter and JSON-LD. Validate event markup using Google Rich Results Test and Schema.org Validator.
6. Confirm admin/login pages have noindex and no unpublished events appear in sitemap.
7. Submit the canonical sitemap URL to Google Search Console and Bing Webmaster Tools. Request indexing only after public content is available.
8. Ensure `/sitemap.xml` does not return 500 if database credentials are missing. A production DB is required.

## Important
- Search engines decide indexing; metadata and `llms.txt` do not guarantee indexing, rich results or inclusion in AI answers.
- Google does not require `llms.txt`; this file is a supplementary factual discovery document.
- The dynamic sitemap includes upcoming shows only. Historical shows are intentionally excluded.
- Hreflang query variants share a canonical path; search engines may choose one language variant. Separate `/en/` URLs are a future option if bilingual indexing becomes important.
- Do not claim tickets are in stock or shows are sold out unless verified at source.
