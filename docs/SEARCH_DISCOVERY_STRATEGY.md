# Search, answer-engine and generative-discovery strategy

Reviewed: 3 October 2026

## Goal

Make the Vishal Chakravarty founder platform easy for people, search engines and answer systems to discover, understand, cite and navigate without adding search-engine-first copy or unsupported claims.

## Principles

1. **People-first content first.** Search metadata describes the visible page; it does not invent a second story for crawlers.
2. **One canonical entity graph.** Vishal, the personal website, the About profile page and NovaPharm Healthcare use stable, non-competing identifiers.
3. **Static semantic output.** Primary content, titles, descriptions, internal links and structured data are present in generated HTML before JavaScript.
4. **Source-bounded answers.** Concise machine-readable answers point back to canonical public pages and do not infer private or unverified facts.
5. **No fake freshness.** Sitemap `lastmod` values change only when a canonical page has a material content, metadata or structured-data update.
6. **Performance is marketing.** The site remains dependency-light, system-font based and progressively enhanced.

## Technical SEO

Every indexable page must have:

- one descriptive `<title>`;
- one meta description;
- one absolute HTTPS canonical URL;
- `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
- an explicit Googlebot equivalent;
- `en-GB` and `x-default` language alternates;
- one H1;
- crawlable internal navigation;
- descriptive Open Graph and Twitter metadata;
- no horizontal overflow at 320px;
- no broken images or internal links.

The sitemap contains canonical pages and essays only. Compatibility pages and the 404 page remain outside the sitemap and use `noindex,follow`.

## Breadcrumbs

Internal pages use visible breadcrumbs and a matching `BreadcrumbList` JSON-LD node. The page node references the breadcrumb node through a stable `#breadcrumb` identifier.

Breadcrumbs describe the normal user path rather than mechanically reproducing every URL segment.

## Entity graph

Canonical identifiers:

- Person: `https://vishal.novapharmhealthcare.com/#person`
- Personal WebSite: `https://vishal.novapharmhealthcare.com/#website`
- ProfilePage: `https://vishal.novapharmhealthcare.com/about/#profile`
- NovaPharm Organization: `https://novapharmhealthcare.com/#organization`

The Person node contains the approved executive designation, founder biography, canonical portrait, areas of work, LinkedIn identity URL and a `worksFor` relationship to NovaPharm.

The About page is the canonical `ProfilePage`. The Facts page is a normal `WebPage` so two competing profile entities are not created.

## Article discovery

Each essay has:

- a stable `/essays/<slug>/` URL;
- visible author, published date and updated date;
- `BlogPosting` JSON-LD;
- canonical Person author and publisher references;
- 1200×630 social image metadata;
- Open Graph published, modified and author metadata;
- related internal links and source links where the subject requires them.

## AEO

There is no separate hidden “answer-engine page.” Answerability is built into visible content and public machine-readable records.

The About page contains a concise human-readable profile snapshot. `facts.json` contains source-linked direct answers for the core identity questions:

- Who is Vishal Chakravarty?
- What is NovaPharm Healthcare?
- What does Vishal Chakravarty work on?

These records supplement, rather than replace, the canonical HTML.

## GEO / AI discovery

`llms.txt` is a supplemental discovery aid, not an authority override. It provides canonical entity identifiers, direct answers, primary page routes and a source hierarchy.

Crawler policy deliberately separates search discovery from model-training preferences. Search-oriented crawlers are allowed where documented, while selected model-development crawlers are declined.

The authoritative sources remain canonical HTML, structured data, official public registers and publisher-hosted records.

## Google indexing

The repository includes the existing Google site-verification file and publishes a canonical XML sitemap.

Code can make a page eligible and easy to crawl, but it cannot force Google to index or rank a URL. After a material release, use Google Search Console URL Inspection and sitemap reporting to confirm Googlebot access, rendered HTML, canonical selection and indexing status.

Do not use the deprecated anonymous sitemap-ping endpoint and do not manufacture backlinks or doorway pages.

## Digital-marketing foundations

The site is designed around three conversion paths:

- understand Vishal → About / Profile;
- evaluate expertise → Thinking / Media;
- start a relevant conversation → Speaking / Contact.

Social sharing is supported through Open Graph, profile metadata, article dates and large-image cards.

The site intentionally has no advertising pixels, analytics trackers, third-party fonts or non-essential cookies. If analytics or paid-media attribution is introduced later, the privacy notice and consent requirements must be reviewed before deployment.

## Release gates

A release does not merge unless automated checks cover:

- content contracts and claims governance;
- canonical metadata and schema;
- internal links and routes;
- crawler policy and sitemap integrity;
- visible-content boundaries;
- static accessibility;
- complete CSS/JS performance budgets;
- security;
- Chromium, Firefox and WebKit at desktop, mobile and 320px;
- reduced-motion and no-JavaScript fallbacks;
- Axe WCAG checks;
- Lighthouse performance, accessibility, best practices and SEO.

Production is then smoke-tested on the custom domain after GitHub Pages publishes the release.
