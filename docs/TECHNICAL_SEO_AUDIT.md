# Technical SEO audit

Audit date: 14 July 2026
Branch: `seo/post-launch-authority`

## Executive finding

The production architecture is fundamentally strong: complete static HTML, small client-side enhancement, central metadata, canonical routes, no tracking and a generated sitemap. The material post-launch defect was entity ownership rather than crawlability: NovaPharm’s Organization identifier was previously anchored to the personal domain. This branch moves it to the corporate domain and adds regression tests.

## Canonical and route architecture

- Canonical origin: `https://vishal.novapharmhealthcare.com`
- Canonical pages use trailing slashes.
- Root remains `/`.
- Essays use `/essays/<slug>/`.
- `/thinking/<slug>/` and legacy `.html` paths are compatibility pages with `noindex,follow` and canonical links to their destination.
- The 404 page is `noindex,follow`.
- Internal navigation points directly to canonical URLs.
- Generated sitemap excludes compatibility pages, redirects and the 404 page.

## Rendering

- Principal content is generated as semantic HTML.
- The portrait has responsive AVIF, WebP and JPEG sources with explicit dimensions.
- The canvas lattice is decorative and has a static fallback.
- Navigation, headings, facts and essay content do not depend on JavaScript.
- No hidden FAQ, keyword layer or AI-only page exists.

## Metadata

- Each canonical HTML page has one title, description, canonical and robots directive.
- Canonicals are absolute HTTPS URLs.
- Canonical paths are lowercase.
- Open Graph and Twitter image alternatives are required by tests.
- Titles and descriptions are deduplicated for indexable pages.
- Material route dates are now defined individually rather than assigning one global verification date to every page.

## Structured data

- Personal WebSite publisher: Vishal Person.
- Canonical ProfilePage: `/about/#profile`.
- Canonical Person: root `#person`.
- Canonical NovaPharm Organization: corporate-domain `#organization`.
- Articles and Blog are authored and published by Vishal on the personal platform.
- Ventures and Facts may reference the company entity without claiming the personal site is its canonical website.

## Sitemap and feeds

- Sitemap is generated from canonical route and article sources.
- `lastmod` uses material route/article dates.
- No `priority` or `changefreq` is emitted.
- RSS and JSON Feed use canonical essay URLs and Vishal as author.
- `llms.txt` is explicitly supplemental.

## Crawler access

- Googlebot and Bingbot allowed.
- OAI-SearchBot, Claude-SearchBot and PerplexityBot allowed.
- GPTBot, ClaudeBot and Google-Extended remain independently declined.
- User-triggered agents are documented separately because robots behaviour differs.
- Rendering assets are not blocked.

## Privacy and security

- No analytics, advertising or session-replay scripts.
- No contact form or non-essential cookies.
- Same-origin Content Security Policy.
- No private office documents or research evidence in the build.
- Existing Google verification file and CNAME remain preserved.

## Automated controls

The release suite now checks:

- canonical metadata and structured data;
- one H1 per page;
- canonical entity ownership;
- no old personal-domain company identifier;
- public facts entity IDs;
- sitemap inclusion and exact `lastmod` values;
- robots policy;
- supplemental llms declaration;
- absence of tracking domains;
- absence of private document extensions;
- links, routes, claims, accessibility, performance and security.

## Remaining external gates

These require owner or public-tool access after an approved merge:

- Google URL Inspection;
- Google Rich Results Test on deployed URLs;
- Schema.org Validator on deployed URLs;
- Bing URL Inspection;
- confirmation that stale legacy snippets have disappeared;
- real-user Core Web Vitals once sufficient traffic exists.

## Release recommendation

Technical changes should remain in draft until hosted CI passes and the complete documentation set is reviewed. No production or DNS action is required during development.
