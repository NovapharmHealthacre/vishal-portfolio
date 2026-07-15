# Search Console and Bing owner actions

Reviewed: 14 July 2026

No passwords, authentication codes or private tokens should be placed in this repository or shared in chat.

## Google Search Console

| Step | Screen / field | Value | Secret? | Action |
|---|---|---|---|---|
| 1 | Property selector | Domain property for `novapharmhealthcare.com` where available; retain the existing URL-prefix property for `https://vishal.novapharmhealthcare.com/` | DNS verification value may be sensitive operationally | Confirm ownership. Do not remove the existing HTML verification file. |
| 2 | Sitemaps → Add a new sitemap | `sitemap.xml` | No | Submit and record status/date. |
| 3 | URL Inspection | Homepage | No | Test live URL, compare rendered HTML, request indexing once if needed. |
| 4 | URL Inspection | `/about/` | No | Confirm declared and selected canonical, ProfilePage HTML and portrait. |
| 5 | URL Inspection | `/thinking/` and one essay | No | Confirm article content and BlogPosting markup. |
| 6 | URL Inspection | `/facts/` | No | Confirm new facts/entity identifiers after merge. |
| 7 | Page Indexing | All known pages | No | Review indexed, crawled-not-indexed, duplicate and soft-404 reports. |
| 8 | Core Web Vitals | Mobile and desktop | No | Record field data when enough traffic exists. |
| 9 | HTTPS | Property report | No | Confirm no HTTP or certificate issue. |
| 10 | Security & Manual Actions | Both reports | No | Confirm no issue; investigate immediately if present. |
| 11 | Performance | Queries and Pages | No | Track branded queries, country, device, page impressions and clicks. |
| 12 | Images | Search performance filter where available | No | Track portrait and article-image discovery. |

Priority URL Inspection list:

- `https://vishal.novapharmhealthcare.com/`
- `https://vishal.novapharmhealthcare.com/about/`
- `https://vishal.novapharmhealthcare.com/ventures/`
- `https://vishal.novapharmhealthcare.com/thinking/`
- `https://vishal.novapharmhealthcare.com/facts/`

For stale legacy results, inspect the old URL and its canonical destination. Do not use temporary removals as a substitute for correct noindex/canonical processing unless a harmful snippet needs urgent temporary suppression.

## Bing Webmaster Tools

| Step | Screen / field | Value | Secret? | Action |
|---|---|---|---|---|
| 1 | Add site / import | `https://vishal.novapharmhealthcare.com/` | Verification credential may be private | Verify directly or import from Search Console if the owner chooses. |
| 2 | Sitemaps | Full sitemap URL | No | Submit and record crawl status. |
| 3 | URL Inspection | Priority routes listed above | No | Request indexing only where needed. |
| 4 | Site Explorer | Canonical and legacy folders | No | Review discovered, indexed and error URLs. |
| 5 | Search Performance | Branded queries and pages | No | Record impressions, clicks and ranking ranges without promising positions. |
| 6 | Backlinks | Referring pages/domains | No | Export legitimate mentions; reject link-scheme thinking. |
| 7 | Crawl Control / reports | Default unless evidence requires change | No | Do not artificially maximise crawl volume. |
| 8 | IndexNow | Not configured | No | Revisit only under `INDEXNOW_DECISION.md` triggers. |

## Evidence record

Store dates, screenshots and result summaries outside the public build. Do not commit private account IDs, verification secrets or personal search data.
