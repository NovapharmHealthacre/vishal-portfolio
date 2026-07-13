# Search Console and webmaster setup

Last reviewed: 12 July 2026
Canonical origin: `https://vishal.novapharmhealthcare.com/`

## Objective

Preserve verified ownership, submit truthful discovery files and monitor the migration without promising rankings, AI citations, Knowledge Graph inclusion or a Knowledge Panel.

This setup is owner-controlled. Do not create a DNS verification record, alter the registrar, fabricate a Bing token, remove indexed URLs, or connect analytics without separate approval.

## Preserve current Google verification

The audited repository contains `googlef9cdfdd63c360d56.html`. Preserve it byte-for-byte at the public output root.

Before release:

```sh
npm run build
test -f public/googlef9cdfdd63c360d56.html
test -f dist/googlef9cdfdd63c360d56.html
cmp public/googlef9cdfdd63c360d56.html dist/googlef9cdfdd63c360d56.html
shasum -a 256 public/googlef9cdfdd63c360d56.html dist/googlef9cdfdd63c360d56.html
```

`robots.txt` must not disallow this file. The file proves control only to the relevant Google property; it is not an identity or regulatory credential.

## Google Search Console release checklist

1. Sign in through the owner's existing Google account and open the existing property if one is present.
2. Prefer the existing URL-prefix property for `https://vishal.novapharmhealthcare.com/`. Creating a domain property requires a DNS change and is outside this release unless separately approved.
3. Confirm ownership still verifies through the preserved HTML file.
4. Inspect the live homepage and the canonical routes `/about/`, `/ventures/`, `/thinking/`, `/media/` and `/facts/`.
5. Confirm Google-selected canonical agrees with the declared canonical after recrawl. Do not treat a temporary mismatch immediately after migration as proof of failure.
6. Submit exactly `https://vishal.novapharmhealthcare.com/sitemap.xml`.
7. Check that the sitemap contains canonical public URLs only, with truthful `lastmod` values and no `priority`, `changefreq`, compatibility pages, drafts or private paths.
8. Use URL Inspection to request indexing for the homepage and a small number of materially changed canonical pages. Do not repeatedly request indexing for the whole site.
9. Monitor Page indexing, HTTPS, Core Web Vitals and structured-data reports after deployment.
10. Record the property, submission date and reviewer privately; do not commit account identifiers or screenshots containing private account data.

## Migration handling

- Keep every generated compatibility route in `docs/REDIRECT_MAP.md` reachable and marked `noindex,follow` with a visible canonical destination link. Direct `index.html` forms are the documented exception because they are the same indexable files as their clean directory routes and canonicalise to those clean URLs.
- Preserve the four existing essay directories as first-class routes.
- Correct `/essays/why-i-left-swiggy/` to self-canonicalise and retain `/essays/from-swiggy-to-mhra/` only as a compatibility entry path.
- Do not use Search Console removals for ordinary URL migration. Removal tools are temporary and are reserved for urgent privacy/legal cases.
- Do not submit `/rss.xml`, `/feed.json`, `/facts.json` or `/llms.txt` as sitemaps.

## Structured-data verification

Before and after production deployment:

1. Run the repository's structured-data and canonical tests through `npm run check`.
2. Inspect rendered HTML, not only source modules.
3. Test representative live pages with Google's Rich Results Test where their types are supported.
4. Validate the JSON-LD graph manually against visible copy and Schema.org.
5. Confirm stable `#person`, `#website` and organisation identifiers.
6. Confirm `sameAs` contains only the verified LinkedIn URL.
7. Confirm schema contains no nationality, residence, licence, customer, revenue, rating, award, review, unsupported profile or hidden FAQ claim.

Absence of a rich result is not a release defect when the page is ineligible for one. Valid schema is an entity-consistency aid, not a ranking guarantee.

## Bing Webmaster Tools

After the Google migration is stable:

1. Use the owner's existing Bing Webmaster Tools account or create access through an owner-approved account.
2. Import the verified Search Console property if Bing offers that route, or use an owner-approved HTML/meta verification method.
3. Do not invent or commit a Bing verification value.
4. Submit the same canonical `/sitemap.xml`.
5. Inspect representative canonical routes and monitor crawl/index reports.

Any DNS-based verification remains a separate owner-approved DNS change.

## Entity-consistency checks

Quarterly, and after any material company or role change:

- recheck Companies House registration facts;
- recheck current MHRA public records before any regulatory-status wording changes;
- verify the company domain, public email and LinkedIn URL;
- verify Yakuji publication count and live URLs;
- reconcile visible facts, `src/data/entity.mjs`, JSON-LD, `facts.json`, bios and metadata;
- update the “last reviewed” date only when evidence was actually checked;
- record unresolved contradictions in `docs/NEEDS_APPROVAL.md` rather than guessing.

Do not create or edit Wikipedia/Wikidata solely for search visibility, and do not use self-controlled pages as independent proof.

## Monitoring cadence

| Timing | Review |
|---|---|
| Release day | Ownership file, sitemap fetch, canonical routes, HTTPS and obvious crawl blocks |
| 48–72 hours | Indexing/canonical processing, sitemap discovery and new crawl errors |
| 2–4 weeks | Page indexing trends, duplicate/canonical reports, Core Web Vitals and structured data |
| Quarterly | Fact ledger, entity consistency, primary-source links and stale content |
| After material change | Rebuild, resubmit sitemap if needed, inspect affected URLs |

GitHub Pages provides limited origin log visibility. Search Console and Bing reports are delayed diagnostic signals, not real-time monitoring.

## Privacy and access

- Grant the lowest necessary Search Console/Webmaster role.
- Remove access for people who no longer need it.
- Keep recovery methods and account identifiers outside the repository.
- Do not add Google Analytics merely to validate Search Console.
- Do not add a cookie banner when the site still ships no non-essential cookies or tracking.
