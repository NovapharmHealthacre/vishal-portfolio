# Search, entity and AI-discoverability plan

Research date: 12 July 2026

## Scope and promise boundary

The objective is an accurate, crawlable and internally consistent public entity foundation. The implementation cannot guarantee rankings, citations, Knowledge Graph inclusion or a Knowledge Panel.

The official OpenAI developer-docs connector was unavailable and could not be installed because the managed sandbox prohibited writing to `~/.codex/config.toml`. The fallback review used OpenAI's current official crawler overview directly. Other technical decisions use primary Google, Bing, Schema.org and provider documentation.

## Canonical entity identity

- Preferred professional name: Vishal Chakravarty
- Canonical personal origin: `https://vishal.novapharmhealthcare.com`
- Person identifier: `https://vishal.novapharmhealthcare.com/#person`
- Website identifier: `https://vishal.novapharmhealthcare.com/#website`
- Canonical company name: NovaPharm Healthcare Ltd
- Company number: 16716501
- Company identifier: `https://vishal.novapharmhealthcare.com/ventures/#novapharm-healthcare`
- Company domain: `https://novapharmhealthcare.com/`
- Verified profile for `sameAs`: `https://www.linkedin.com/in/vishal-chakravarty`
- Verified publication evidence: Yakuji Nippo article URLs

Nationality, residence, Wikipedia, conflicting Wikidata QIDs, Crunchbase, GitHub, X, Instagram and YouTube are omitted.

## URL policy

- HTTPS-only canonical origin.
- Lowercase trailing-slash canonical routes.
- Generated physical `index.html` files for GitHub Pages.
- Legacy `.html` and generated `/thinking/<slug>/` aliases remain accessible through static compatibility pages. Direct `index.html` forms are physical-file aliases that remain indexable while canonicalising to their clean directory URLs.
- Canonical tags are emitted in original HTML, never added client-side.
- No fake `hreflang`; English is the only site language.

## Page metadata

Every canonical page receives:

- one unique, descriptive title;
- one unique meta description;
- one H1;
- canonical URL;
- Open Graph title, description, URL, type and image;
- Twitter summary-large-image metadata without an unverified account handle;
- visible last-reviewed or modified date on factual/editorial pages;
- `robots` set to `index,follow,max-image-preview:large` unless a compatibility page is deliberately `noindex,follow`.

## Structured-data graph

JSON-LD is generated centrally and limited to visible content.

| Page | Types |
|---|---|
| All canonical pages | `WebPage` subtype where useful, reference to `WebSite` |
| `/` | `WebSite`, `Person` summary |
| `/about/` | `ProfilePage` with `Person` as `mainEntity`, `ImageObject` |
| `/ventures/` | `Organization`, `BreadcrumbList` |
| `/thinking/` | `Blog`, `CollectionPage`, `BreadcrumbList` |
| Essay | `WebPage`, `BlogPosting`, typed `Person` author reference, `BreadcrumbList`, `ImageObject` |
| `/media/` | `CollectionPage`, `BreadcrumbList`; publication links stay visible |
| `/facts/` | `WebPage`, `Person`, `Organization`, `BreadcrumbList` |
| Utility pages | `WebPage` or `ContactPage` plus `BreadcrumbList` |

Rules:

- A single stable `@id` per entity.
- No manually repeated divergent Person blocks.
- No `FAQPage` unless an actual visible Q&A page exists and Google eligibility guidance supports the use case.
- No `ScholarlyArticle` for essays.
- No nationality, residence, ratings, awards, reviews, customers, licences, projected values or hidden text.
- `sameAs` includes only verified identity profiles, not articles or registries.
- Structured-data snapshots are tested for private/unsupported properties.

## Visible entity evidence

The facts page will expose:

- 40- and 100-word biographies;
- preferred professional name and current role;
- company name, number, incorporation date and current registration status;
- explicit distinction between registration, regulated permission and roadmap;
- verified LinkedIn and company domain;
- Yakuji publication links;
- last-reviewed date and correction contact.

No hidden SEO biography is used.

## Sitemap and feeds

- Generate `/sitemap.xml` from canonical public routes and public essay metadata.
- Emit `lastmod` only from verified content `modified` dates.
- Do not emit `priority` or `changefreq`.
- Generate RSS 2.0 at `/rss.xml` and JSON Feed at `/feed.json`.
- Verify every sitemap/feed URL exists in `dist/` and is canonical.
- Preserve the Google verification file at the output root.

## Robots and crawler policy

Policy objective: permit ordinary search indexing and AI search/retrieval while opting out of known model-training crawlers where providers offer separate agents.

| Agent | Purpose according to official provider | Policy |
|---|---|---|
| `Googlebot` | Google Search indexing | Allow |
| `Bingbot` | Bing Search indexing | Allow |
| `Google-Extended` | Gemini training/grounding control token, separate from Google Search | Disallow |
| `OAI-SearchBot` | OpenAI search discovery/surfacing | Allow |
| `ChatGPT-User` | User-requested retrieval | Allow |
| `GPTBot` | Potential model training | Disallow |
| `Claude-SearchBot` | Anthropic search result quality | Allow |
| `Claude-User` | User-requested retrieval | Allow |
| `ClaudeBot` | Content potentially contributing to model training | Disallow |
| `PerplexityBot` | Perplexity search index; provider states not foundation-model training | Allow |
| `Perplexity-User` | User-requested retrieval; provider says it generally ignores robots | Allow as an explicit preference |
| `CCBot` | Common Crawl collection | Disallow as owner training-data preference |

Do not add `Crawl-delay` for Googlebot/Bingbot. The generic group remains `Allow: /`; specific groups carry their full rules because some crawlers ignore the generic group once a more specific match exists.

`robots.txt` is not a privacy or access-control mechanism. No confidential file may enter `public/` or `dist/`.

## AI-oriented supplemental files

- `/facts.json`: stable, public-safe facts derived from central entity data.
- `/llms.txt`: concise navigation to canonical public pages and factual-source policy.
- No `/llms-full.txt` initially; duplicating the full corpus adds drift risk without a standard benefit.
- These files contain no private source extracts, hidden claims or special crawler-only content.

## Internal linking

- Navigation uses real anchors and canonical paths.
- Home links to evidence-bearing facts, ventures and media pages.
- Essays link terms such as PLPI to visible explanatory passages and authoritative primary sources.
- Related essays are generated from metadata.
- Breadcrumbs are visible wherever `BreadcrumbList` is emitted.
- Legacy compatibility pages contain a human-readable canonical destination link.

## Editorial trust for pharmaceutical content

- Prefer MHRA, GOV.UK, NHS, NICE and EMA sources.
- State publication and modification dates.
- Explicit byline and editorial disclaimer.
- No patient-specific advice.
- Do not describe a commercial process as regulatory guidance.
- Remove outdated market-size numbers unless their primary methodology is available and relevant.

## Search Console and Bing

- Preserve the current Google verification file exactly.
- After approved deployment, inspect canonical routes, submit `/sitemap.xml` and monitor structured-data/crawl reports.
- Bing verification should use DNS or an owner-approved meta/file method; no new token is fabricated.
- See `docs/SEARCH_CONSOLE_SETUP.md` for the release checklist.

## Knowledge entity consistency work

1. Use one role description across personal site, company site and verified LinkedIn.
2. Correct company incorporation date everywhere under owner control.
3. Remove unsupported MHRA, NHS, deployed-technology and residence wording.
4. Resolve duplicate/conflicting Wikidata items through normal source-based community processes, not as a ranking tactic.
5. Do not create Wikipedia or circular references.
6. Use a consistent owner-approved headshot once rights and crop are confirmed.
7. Review the fact ledger quarterly.

## Primary technical sources

- Google ProfilePage structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google robots controls: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google crawler tokens, including Google-Extended: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Bing robots guidance: https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec
- Bing sitemap guidance: https://www.bing.com/webmasters/help/Sitemaps-3b5cf6ed
- Schema.org Person: https://schema.org/Person
- Schema.org ProfilePage: https://schema.org/ProfilePage
- Schema.org BlogPosting: https://schema.org/BlogPosting
- OpenAI crawler overview: https://developers.openai.com/api/docs/bots
- Anthropic crawler policy: https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity crawler policy: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
