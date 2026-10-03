# URL preservation and redirect map

GitHub Pages does not support arbitrary origin-level HTTP redirects. Retired paths therefore receive generated static compatibility pages containing a destination canonical, `noindex,follow`, a zero-delay HTML refresh redirect, a short explanation and a direct fallback link. Direct `index.html` forms are physical-file aliases: `/index.html` is the indexable homepage document, and `/essays/<slug>/index.html` is the indexable canonical article document; each declares its clean directory URL as canonical. Where the old URL is already a canonical essay directory route, it remains a first-class rendered page.

| Existing URL | Canonical destination | Method | Notes |
|---|---|---|---|
| `/index.html` | `/` | Same homepage document | Preserve direct links; this indexable file is served for both URLs and declares `/` as canonical. |
| `/about.html` | `/about/` | Compatibility HTML redirect | Destination canonical + `noindex,follow` + zero-delay refresh + fallback link. |
| `/companies.html` | `/ventures/` | Compatibility HTML redirect | Remove unsupported company copy and consolidate to the canonical route. |
| `/essays.html` | `/thinking/` | Compatibility HTML redirect | Editorial index replacement. |
| `/publications.html` | `/media/` | Compatibility HTML redirect | Verified publications only. |
| `/profiles.html` | `/facts/` | Compatibility HTML redirect | Consolidates to the canonical founder profile/facts route. |
| `/essays/how-to-win-when-odds-are-against-you/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/regulated-industries/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/what-parallel-import-actually-means/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/why-i-left-swiggy/` | `/essays/why-i-chose-to-build-in-pharmaceuticals/` | Compatibility HTML redirect | Retired legacy founder-story URL consolidated to the current pharmaceutical founder-origin essay. |
| `/essays/from-swiggy-to-mhra/` | `/essays/why-i-chose-to-build-in-pharmaceuticals/` | Compatibility HTML redirect | Retired alias consolidated directly to the current founder-origin essay. |
| `/thinking/how-to-win-when-odds-are-against-you/` | `/essays/how-to-win-when-odds-are-against-you/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/regulated-industries/` | `/essays/regulated-industries/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/what-parallel-import-actually-means/` | `/essays/what-parallel-import-actually-means/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/why-i-left-swiggy/` | `/essays/why-i-chose-to-build-in-pharmaceuticals/` | Compatibility HTML redirect | Retired collection-style alias consolidated to the current founder-origin essay. |
| `/gallery/` | `/about/` | Compatibility HTML redirect | Retired Gallery/Ask-Vishal route; excluded from sitemap and canonical navigation. |
| `/#about` | `/about/` | Home anchor retained plus visible link | Existing fragment continues to land meaningfully. |
| `/#companies` | `/ventures/` | Home section ID retained | Preserve old anchor semantics. |
| `/#essays` | `/thinking/` | Home section ID retained | Preserve old anchor semantics. |
| `/#invest` | `/speaking-partnerships/` | Home section ID retained | New wording removes unsupported investment/advisory claims. |
| `/#contact` | `/contact/` | Home section ID retained | Preserve contact entry point. |

Direct `/essays/<slug>/index.html` requests use the same files as their canonical directory URLs. They are not separately generated `noindex` pages; their canonical tags consolidate to `/essays/<slug>/`.

## Future host migration

If production later moves to Cloudflare Pages, Netlify or another owner-approved host, replace compatibility HTML with permanent 301 redirects while retaining the same canonical destinations. Do not migrate hosting or DNS as part of this branch.
