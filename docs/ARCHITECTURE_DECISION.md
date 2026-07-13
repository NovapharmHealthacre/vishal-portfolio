# Architecture decision record

Decision date: 12 July 2026
Status: Accepted for rebuild branch

## Decision

Build a content-first, dependency-free static site generator using the Node.js standard library, Markdown content files, typed-by-contract central data modules, reusable HTML components, and a small progressive-enhancement layer.

This is an explicit alternative to Astro 7, the current major Astro release at audit time. The decision does not depend on a fast-changing patch number.

## Why this is the stronger choice for this repository

The audit identified concrete constraints and benefits:

1. The active production host is GitHub Pages serving a small static site from one branch. No server runtime, CMS, database or React interactivity is needed.
2. The content corpus is small: a founder profile, a ventures status page, a fact sheet, several utility pages and four essays.
3. The security requirement favours a minimal dependency and software-supply-chain surface.
4. The managed implementation environment cannot resolve the npm registry. Astro cannot be installed or validated here, while a Node-standard-library build can be created and statically validated here. Browser, axe and Lighthouse release gates still require the documented release environment.
5. A zero-dependency build remains reproducible from a clean clone, commits a lockfile, runs on Node 22+, and avoids framework churn for a site expected to change mainly through content.
6. The essential requirements—central layouts, content collections, generated static HTML, feeds, sitemap, schema, redirects, tests and isolated visual enhancement—do not require a framework runtime.

The decision is not an argument against Astro. If the editorial corpus or contributor count grows materially, Astro remains the preferred migration target because it provides mature content loaders, image integration and ecosystem tooling.

## Architecture

```text
src/data/entity.mjs              verified public entity source
src/data/site.mjs                navigation, metadata and route definitions
src/content/thinking/*.md        essay collection with validated front matter
src/content/pages/*.md           maintainable page copy where appropriate
src/components/*.mjs             pure render functions for shared HTML
src/styles/*.css                 tokenised global and page styles
src/scripts/*.js                 tiny browser enhancements only
scripts/build.mjs                deterministic static generator
scripts/validate-content.mjs     front-matter, page and entity contracts
scripts/check-*.mjs              links, schema, claims, routes, security and budgets
public/                          preserved and source assets copied verbatim
dist/                            generated deployment output, never hand edited
```

Core content is rendered to complete HTML during `npm run build`. Browser JavaScript is limited to the mobile menu and optional visual lattice.

## Content collection contract

Each essay front matter includes:

- `title`
- `description`
- `summary`
- `author`
- `published`
- `modified`
- `category`
- `canonicalPath`
- `legacyPaths`
- `socialImage`
- `sources`
- `related`
- `public`

The build validates required keys, ISO dates, route uniqueness, source URLs and canonical consistency before emitting HTML. Homepage and thinking index selections are generated from the collection, so publishing an essay does not require manual homepage editing.

## Entity and claim architecture

`src/data/entity.mjs` is the machine-consumable equivalent of the fact ledger. It contains only public-safe facts and approved wording. Templates import entities and schema builders from that module; page authors do not hand-author Person or Organization JSON-LD.

A build-time denylist checks rendered output for private or forbidden claim patterns. It is a guardrail, not a substitute for editorial review.

## Static URL policy

- Canonical routes use trailing slashes.
- GitHub Pages receives physical `index.html` files inside route directories.
- Legacy `.html` pages remain as accessible static compatibility pages with a canonical target and immediate human-readable link. Direct `index.html` forms are the same indexable files as their clean directory routes, not separately generated compatibility pages. JavaScript redirects are not required.
- Existing essay directory paths remain live; canonical content lives at stable chosen routes with compatibility output where necessary.
- `404.html` is generated at the output root.

## Visual enhancement

The hero includes semantic HTML and a CSS poster by default. A small, lazy-loaded deterministic canvas module projects a regulated supply-chain lattice in three dimensions using a 2D canvas. This avoids a Three.js dependency and WebGL/GPU cost while preserving spatial depth.

The module:

- loads after critical content;
- never owns text or links;
- stops when the document is hidden;
- respects `prefers-reduced-motion`;
- is disabled on narrow or data-saving devices;
- is disabled on low-memory or low-concurrency devices;
- renders at capped pixel density and frame rate;
- falls back silently to the static poster.

## Styling and fonts

- No remote font request.
- Editorial serif stack: `Iowan Old Style`, `Baskerville`, `Times New Roman`, serif.
- Interface sans stack: `Arial`, `Helvetica Neue`, `Helvetica`, sans-serif.
- Monospace labels use the system monospace stack.
- All tokens live in one CSS file; no per-page copied style blocks.

## Security model

- No secrets or environment variables are needed.
- No form backend, cookies or analytics are shipped.
- No arbitrary HTML is accepted from Markdown.
- Markdown is escaped before a small allowlisted renderer converts supported syntax.
- External links receive `rel="noopener noreferrer"` where a new tab is used.
- A restrictive meta Content Security Policy is generated; GitHub Pages cannot set all desired response headers.

## Deployment impact

GitHub Pages must switch its source from branch-root publishing to GitHub Actions. The workflow builds `dist/` and deploys it with the official Pages actions. `public/CNAME` and the Google verification file are copied into `dist/`.

This changes deployment configuration but not DNS or domain ownership. Production must not be switched until the owner approves the PR and checklist.

## Trade-offs

| Choice | Benefit | Cost / mitigation |
|---|---|---|
| No Astro | Buildable and statically testable without registry access; minimal dependencies | Bespoke generator; browser/Lighthouse gates run in the release environment |
| No React | Near-zero client JavaScript | Complex app interactions would require later architecture review |
| No CMS | No cost, auth or attack surface | Publishing uses Markdown and Git; documented workflow provided |
| System fonts | Fast, private and licence-safe | Typography varies slightly by OS; fallbacks are carefully calibrated |
| GitHub Pages | Existing domain and zero migration risk | Limited headers/redirects; static compatibility pages and meta CSP used |

## Migration path to Astro

The content, entity data, routes and styles are framework-neutral. A future Astro migration can map:

- `src/content/thinking` → Astro content collection
- component render functions → `.astro` components
- route definitions → `src/pages`
- public assets → unchanged
- entity/schema functions → TypeScript modules

No published URL needs to change.
