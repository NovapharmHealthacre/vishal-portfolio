# Tracked-file manifest

Baseline: `main` at `1ae1ff5`
Audit date: 12 July 2026

Every path returned by `git ls-files` at the Phase 0 baseline is classified below.

| Existing path | Classification | Reason and migration action |
|---|---|---|
| `.gitignore` | Rewrite | Expand for a generated static project, test artefacts, environment files and OS metadata. |
| `CNAME` | Keep | Preserve exact production custom domain; move to the static public directory so it survives generation. |
| `FETCH_HEAD` | Remove | Empty Git-internal artefact should never be tracked. |
| `about.html` | Redirect | Replace with a static compatibility page pointing to `/about/`; migrate only verified, public-safe biography content. |
| `companies.html` | Redirect | Replace with compatibility page for `/ventures/`; remove licence, operation, founding-date and India-entity misstatements. |
| `essays.html` | Redirect | Replace with compatibility page for `/thinking/`; editorial cards become collection-driven. |
| `essays/how-to-win-when-odds-are-against-you/index.html` | Migrate | Preserve URL and authorial core; migrate to editorial content, remove unsupported statistics and improve sources/disclaimer. |
| `essays/regulated-industries/comparison_chart.png` | Remove | Contains unsupported comparative figures and is unused; Git history preserves recovery. |
| `essays/regulated-industries/index.html` | Migrate | Preserve URL; migrate to content collection with primary-source review and transparent update date. |
| `essays/what-parallel-import-actually-means/index.html` | Migrate | Preserve URL; migrate to collection and verify all pharmaceutical guidance against current primary sources. |
| `essays/why-i-left-swiggy/index.html` | Migrate | Preserve existing URL; reconcile canonical mismatch and remove “no pharma background” implications. |
| `googlef9cdfdd63c360d56.html` | Keep | Preserve verified Google ownership token byte-for-byte in the public root. Do not disallow it in robots. |
| `images/vishal-headshot.jpg` | Migrate | Retain as source portrait only; strip EXIF, create responsive formats, confirm public-use rights. |
| `index.html` | Rewrite | Replace the monolithic homepage with generated semantic HTML, verified claims, shared layout and progressive canvas enhancement. |
| `profiles.html` | Redirect | Replace with compatibility page for `/facts/`; remove unverified profiles and knowledge-panel manipulation language. |
| `publications.html` | Redirect | Replace with compatibility page for `/media/`; use verified Yakuji publications only. |
| `robots.txt` | Rewrite | Separate search/retrieval/training agents using current official guidance; remove crawl-delay and obsolete rules. |
| `sitemap.xml` | Rewrite | Generate truthful canonical URLs and last-modified dates; remove fake Japanese alternate and priority/changefreq fields. |

## New route disposition

| Canonical route | Source |
|---|---|
| `/` | Rewritten homepage |
| `/about/` | Verified biography and working principles |
| `/ventures/` | Current-status NovaPharm information; India entity withheld pending verification |
| `/thinking/` | Editorial collection index |
| `/essays/[slug]/` | Canonical essay routes; generated `/thinking/[slug]/` compatibility pages consolidate to them |
| `/media/` | Verified Yakuji publication record |
| `/speaking-partnerships/` | Invitation topics, carefully framed as enquiries rather than past claims |
| `/facts/` | Public fact sheet and entity-consistency resource |
| `/contact/` | Direct accessible contact route with no tracking form |
| `/privacy/` | Actual no-cookie/no-form privacy position |
| `/404.html` | GitHub Pages-compatible not-found page |

Optional podcast, timeline, now and press-kit routes are not supported by current evidence and are not included.
