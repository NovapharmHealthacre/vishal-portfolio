# URL indexability register

Reviewed: 14 July 2026

## Canonical indexable routes

| Route group | URLs | Expected status | Robots | Canonical |
|---|---|---:|---|---|
| Founder pages | `/`, `/about/`, `/ventures/`, `/thinking/`, `/media/`, `/speaking-partnerships/`, `/facts/`, `/contact/`, `/privacy/` | 200 | `index,follow,max-image-preview:large` | Self-canonical |
| Essays | `/essays/how-to-win-when-odds-are-against-you/`, `/essays/regulated-industries/`, `/essays/what-parallel-import-actually-means/`, `/essays/why-i-left-swiggy/` | 200 | `index,follow,max-image-preview:large` | Self-canonical |

## Compatibility routes

| Route | Destination | Expected status on GitHub Pages | Robots | Canonical |
|---|---|---:|---|---|
| `/about.html` | `/about/` | 200 compatibility page | `noindex,follow` | Destination |
| `/companies.html` | `/ventures/` | 200 compatibility page | `noindex,follow` | Destination |
| `/essays.html` | `/thinking/` | 200 compatibility page | `noindex,follow` | Destination |
| `/publications.html` | `/media/` | 200 compatibility page | `noindex,follow` | Destination |
| `/profiles.html` | `/facts/` | 200 compatibility page | `noindex,follow` | Destination |
| `/thinking/<essay-slug>/` | Corresponding `/essays/<slug>/` | 200 compatibility page | `noindex,follow` | Destination |
| `/essays/from-swiggy-to-mhra/` | `/essays/why-i-left-swiggy/` | 200 compatibility page | `noindex,follow` | Destination |

GitHub Pages cannot emit arbitrary origin-level 301 responses for every legacy path in this architecture. Compatibility pages preserve users and links while sending noindex and canonical signals. They are excluded from the sitemap.

## Utility and machine-readable routes

| URL | Indexing intent | Notes |
|---|---|---|
| `/404.html` | Noindex | Custom error document; unknown URLs should return the host’s 404 status. |
| `/sitemap.xml` | Machine discovery | Canonical public routes only. |
| `/robots.txt` | Machine policy | Search and training crawler choices documented separately. |
| `/rss.xml` | Feed | Canonical essays. |
| `/feed.json` | Feed | Canonical essays. |
| `/facts.json` | Public entity data | Public-safe facts only. |
| `/llms.txt` | Supplemental | Not a canonical or Google ranking mechanism. |
| `/manifest.webmanifest` | Application metadata | Not a content page. |
| `/googlef9cdfdd63c360d56.html` | Ownership verification | Must remain reachable and unchanged. |
| `/CNAME` | Deployment artifact | Generated for GitHub Pages; not linked as content. |

## Duplicate controls

- Canonical paths are lowercase.
- Canonical pages use trailing slashes except root and file endpoints.
- Sitemap excludes compatibility and utility HTML.
- Query-string URLs are not linked internally; canonicals ignore diagnostic parameters.
- The default GitHub Pages hostname should redirect to the custom domain.
- `www` behaviour is controlled by DNS/host configuration and must not be changed in this PR.

## Monitoring

Search Console and Bing should be reviewed for indexed compatibility routes, alternate canonicals, soft 404s and any legacy HTML still appearing in branded results.
