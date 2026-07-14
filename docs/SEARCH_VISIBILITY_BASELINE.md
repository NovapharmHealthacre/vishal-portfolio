# Search visibility baseline

Audit date: 14 July 2026
Production origin: `https://vishal.novapharmhealthcare.com/`

## Method

The audit used public web search queries and an independent web retrieval client. It did not use private Search Console or Bing Webmaster data and therefore cannot determine exact Google or Bing indexing status.

Queries tested:

- Vishal Chakravarty
- Vishal Chakravarty NovaPharm
- Vishal Chakravarty pharmaceutical
- Founder of NovaPharm Healthcare
- vishal.novapharmhealthcare.com
- site:vishal.novapharmhealthcare.com
- NovaPharm Healthcare Ltd Vishal Chakravarty

## Findings

1. The available public search interface returned no reliable indexed-result set for the exact branded queries during this audit. This is not proof that Google or Bing has no indexed URLs; owner-console data is required.
2. An independent retrieval client returned a stale legacy representation of the homepage rather than the reviewed production build. The retrieved copy included old navigation and unsupported MHRA, NHS, operational, investor and adviser wording.
3. The release record supplied by the owner states that the live homepage is byte-identical to the reviewed generated build and that all production routes passed. The stale retrieval is therefore recorded as a cache/index lag signal, not automatically treated as a deployment failure.
4. No reliable Knowledge Panel was surfaced through the available search interface.
5. No exact-match independent profile beyond the already verified LinkedIn and Yakuji publication URLs was approved for `sameAs`.

## Risk

Until search engines recrawl the new HTML, old titles, descriptions or unsupported legacy text may remain visible in snippets, caches or AI retrieval systems. This is a reputation and accuracy risk even though the source website has been corrected.

## Required owner verification

Use Google Search Console URL Inspection and Bing URL Inspection for:

- `/`
- `/about/`
- `/ventures/`
- `/thinking/`
- `/facts/`

For each URL record:

- indexed URL;
- last crawl time;
- user-declared canonical;
- Google-selected canonical;
- rendered screenshot/HTML;
- whether the old page copy is still indexed;
- request-indexing result.

## Remediation sequence

1. Confirm the production HTML in an ordinary browser and with `curl` from the owner’s environment.
2. Submit the canonical sitemap in Google Search Console and Bing Webmaster Tools.
3. Inspect and request indexing for the priority pages.
4. Monitor legacy `.html` URLs and old essay aliases until their noindex/canonical signals are processed.
5. Do not repeatedly request indexing or change dates merely to appear fresh.
6. Do not reintroduce old keywords to match stale snippets.

## Knowledge Panel baseline

No Knowledge Panel is confirmed. Google creates panels automatically from multiple sources; schema and entity consistency improve clarity but cannot guarantee creation.

## Next review

Weekly for four weeks after this SEO PR is eventually merged, then monthly until old snippets and cached content disappear.
