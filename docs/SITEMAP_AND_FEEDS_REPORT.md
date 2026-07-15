# Sitemap and feeds report

Reviewed: 14 July 2026

## Sitemap

`/sitemap.xml` is generated from `canonicalRoutes`, per-route material dates and public essay front matter.

Expected content:

- nine canonical founder pages;
- four canonical essays;
- absolute HTTPS URLs;
- one truthful `lastmod` per URL.

Excluded:

- compatibility `.html` pages;
- `/thinking/<slug>/` aliases;
- the old Swiggy route alias;
- 404;
- redirects/noindex pages;
- feeds, verification files and machine-only assets;
- private or untracked documents.

The generator does not emit `priority` or `changefreq`. A regression check compares every sitemap URL and date with the source-of-truth records.

## Material dates

Static route dates are held in `src/data/site.mjs`. Essay dates are held in article front matter. Dates must change only when the page’s factual, editorial or entity content materially changes.

## Image sitemap decision

No separate image sitemap is added. The site is small, the important portrait and social images are discoverable in rendered HTML and structured data, and an additional sitemap would add maintenance without a clear discovery benefit. Reassess if the site develops a substantial original image library.

## Sitemap index decision

A sitemap index is unnecessary at the current scale.

## RSS

`/rss.xml` contains public canonical essays with:

- title;
- canonical URL and GUID;
- publication date;
- author;
- category;
- summary;
- rendered article content and source section.

## JSON Feed

`/feed.json` follows JSON Feed 1.1 and contains equivalent canonical article records, language, author and reading-time metadata.

## llms.txt

`/llms.txt` is maintained as a supplemental navigation aid. It declares canonical entity identifiers and links to canonical HTML, feeds and `facts.json`. It is not presented as a Google ranking or indexing mechanism.

## Submission

Submit `https://vishal.novapharmhealthcare.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Submission supports discovery but does not guarantee indexing.
