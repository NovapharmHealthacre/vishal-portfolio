# URL preservation and redirect map

GitHub Pages does not support arbitrary origin-level HTTP redirects. Existing valuable paths therefore receive generated static compatibility pages containing a canonical tag, `noindex,follow`, a short explanation and a direct link. Direct `index.html` forms are physical-file aliases: `/index.html` is the indexable homepage document, and `/essays/<slug>/index.html` is the indexable canonical article document; each declares its clean directory URL as canonical. Where the old URL is already a canonical essay directory route, it remains a first-class rendered page.

| Existing URL | Canonical destination | Method | Notes |
|---|---|---|---|
| `/index.html` | `/` | Same homepage document | Preserve direct links; this indexable file is served for both URLs and declares `/` as canonical. |
| `/about.html` | `/about/` | Compatibility HTML | No client-only redirect required. |
| `/companies.html` | `/ventures/` | Compatibility HTML | Remove unsupported company copy. |
| `/essays.html` | `/thinking/` | Compatibility HTML | Editorial index replacement. |
| `/publications.html` | `/media/` | Compatibility HTML | Verified publications only. |
| `/profiles.html` | `/facts/` | Compatibility HTML | Replaces manipulation-oriented profile wall. |
| `/essays/how-to-win-when-odds-are-against-you/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/regulated-industries/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/what-parallel-import-actually-means/` | Same path | First-class canonical page | Preserve indexed route. |
| `/essays/why-i-left-swiggy/` | Same path | First-class canonical page | Correct current canonical mismatch. |
| `/essays/from-swiggy-to-mhra/` | `/essays/why-i-left-swiggy/` | Compatibility HTML | Existing declared canonical is preserved as an alternate entry path, then consolidated. |
| `/thinking/how-to-win-when-odds-are-against-you/` | `/essays/how-to-win-when-odds-are-against-you/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/regulated-industries/` | `/essays/regulated-industries/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/what-parallel-import-actually-means/` | `/essays/what-parallel-import-actually-means/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/thinking/why-i-left-swiggy/` | `/essays/why-i-left-swiggy/` | Compatibility HTML | Collection-style alias generated for route consistency. |
| `/#about` | `/about/` | Home anchor retained plus visible link | Existing fragment continues to land meaningfully. |
| `/#companies` | `/ventures/` | Home section ID retained | Preserve old anchor semantics. |
| `/#essays` | `/thinking/` | Home section ID retained | Preserve old anchor semantics. |
| `/#invest` | `/speaking-partnerships/` | Home section ID retained | New wording removes unsupported investment/advisory claims. |
| `/#contact` | `/contact/` | Home section ID retained | Preserve contact entry point. |

Direct `/essays/<slug>/index.html` requests use the same files as their canonical directory URLs. They are not separately generated `noindex` pages; their canonical tags consolidate to `/essays/<slug>/`.

## Future host migration

If production later moves to Cloudflare Pages, Netlify or another owner-approved host, replace compatibility HTML with permanent 301 redirects while retaining the same canonical destinations. Do not migrate hosting or DNS as part of this branch.
