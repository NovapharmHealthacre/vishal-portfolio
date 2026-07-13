# Quality assurance and release-gate plan

Plan date: 13 July 2026
Applies to: `release/post-merge-hardening`, based on merged main `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a`
Production origin: `https://vishal.novapharmhealthcare.com`

## Release rule

A release candidate passes only when every automated gate and every applicable manual gate below has been run against the same source tree and recorded in `docs/POST_MERGE_RELEASE_REPORT.md`. A skipped test is a failure unless the reason, risk, owner and retest condition are recorded in `docs/NEEDS_APPROVAL.md`.

Privacy, unsupported-claim, canonical, broken-route and serious accessibility failures cannot be waived for production. The build must not deploy automatically from this branch.

## Required command contract

Before release, `package.json` must expose the following non-interactive commands. Individual scripts may share implementation, but each named gate must remain callable in CI and locally.

| Command | Required result |
|---|---|
| `npm ci` | Recreates the declared toolchain from the committed lockfile without modifying it. |
| `npm run format:check` | No formatting drift. |
| `npm run lint` | No lint errors or warnings promoted by project policy. |
| `npm run typecheck` | Front-matter, page-content and central entity contracts pass. The current JavaScript architecture has syntax checks, not a separate static type checker. |
| `npm test` | Renderer, content-parser, date, escaping and schema-builder unit tests pass. |
| `npm run build` | Produces a fresh `dist/` with exit code 0. |
| `npm run test:links` | Internal links, assets and fragments pass against `dist/`. |
| `npm run test:schema` | JSON-LD, metadata, sitemap and feeds pass against `dist/`. |
| `npm run test:claims` | The rendered `dist/` claim/privacy denylist passes. Ledger-to-source reconciliation remains a human release review. |
| `npm run test:routes` | Required canonical and compatibility outputs pass. |
| `npm run test:browser` | Playwright route, interaction, no-JavaScript and fallback tests pass. |
| `npm run test:a11y` | Static semantic, landmark, image, form-label and contrast preflight passes. This is not axe. |
| `npm run test:visual` | Runs the Playwright browser harness and captures the required desktop/mobile route screenshots when browser binaries are available. Human review remains required. |
| Lighthouse (external release gate) | Run current Lighthouse against the production preview and retain JSON/HTML evidence. No local command is claimed until the tool is installed and locked. |
| Axe (external release gate) | Run current axe-core through Playwright against the required routes and retain machine-readable evidence. The static preflight does not replace this gate. |
| `npm run check` | Runs formatting, lint, content contracts, build, unit, link, schema, claim, route, static accessibility, deterministic performance and security checks. |

CI must use Node 22 or the exact version declared by the project. The release record must include `node --version`, the package-lock hash, Git commit and operating system. The final Mac browser, axe and Lighthouse evidence is recorded in `docs/POST_MERGE_RELEASE_REPORT.md`; A-017 in `docs/NEEDS_APPROVAL.md` records its disposition.

## Test environments

Automated browser coverage:

- Chromium desktop at 1440 x 1000.
- Chromium mobile at 390 x 844 with touch enabled.
- Firefox desktop at 1440 x 1000.
- WebKit desktop at 1440 x 1000.
- WebKit mobile at 390 x 844.
- Chromium with JavaScript disabled at 390 x 844 and 1440 x 1000.
- Chromium and WebKit with `prefers-reduced-motion: reduce`.
- Chromium with canvas context creation forced to fail.

Responsive inspection widths are 320, 360, 390, 768, 1024, 1280, 1440 and 1920 CSS pixels. Test 320 x 568 and 844 x 390 explicitly for small-screen and landscape stress.

## Route inventory

### Canonical HTML routes

All must return `200`, contain complete server-rendered content, declare one self-referencing HTTPS canonical with the trailing-slash policy, and remain usable without JavaScript.

- `/`
- `/about/`
- `/ventures/`
- `/thinking/`
- `/media/`
- `/speaking-partnerships/`
- `/facts/`
- `/contact/`
- `/privacy/`
- `/essays/how-to-win-when-odds-are-against-you/`
- `/essays/regulated-industries/`
- `/essays/what-parallel-import-actually-means/`
- `/essays/why-i-left-swiggy/`

### Compatibility routes

GitHub Pages cannot provide arbitrary origin redirects. Each route below must return `200`, contain `noindex,follow`, declare only the listed canonical destination, and include a normal HTML link to that destination. It must not duplicate the old unsupported copy.

Direct `index.html` forms are not in this table because they are the same indexable files as their clean directory routes: `/index.html` declares `/` as canonical, and each `/essays/<slug>/index.html` declares `/essays/<slug>/` as canonical.

| Compatibility route | Canonical destination |
|---|---|
| `/about.html` | `/about/` |
| `/companies.html` | `/ventures/` |
| `/essays.html` | `/thinking/` |
| `/publications.html` | `/media/` |
| `/profiles.html` | `/facts/` |
| `/essays/from-swiggy-to-mhra/` | `/essays/why-i-left-swiggy/` |
| `/thinking/how-to-win-when-odds-are-against-you/` | `/essays/how-to-win-when-odds-are-against-you/` |
| `/thinking/regulated-industries/` | `/essays/regulated-industries/` |
| `/thinking/what-parallel-import-actually-means/` | `/essays/what-parallel-import-actually-means/` |
| `/thinking/why-i-left-swiggy/` | `/essays/why-i-left-swiggy/` |

The homepage must retain meaningful `about`, `companies`, `essays`, `invest` and `contact` fragment targets or an immediately visible canonical-page link associated with each target.

### Non-HTML public outputs

These files must exist, be non-empty, use the production origin and contain no private or unsupported claim:

- `/sitemap.xml`
- `/rss.xml`
- `/feed.json`
- `/facts.json`
- `/robots.txt`
- `/llms.txt`
- `/CNAME`
- `/googlef9cdfdd63c360d56.html`

`CNAME` must contain only `vishal.novapharmhealthcare.com`. The Google verification file must be byte-for-byte preserved from the audited source.

### Not-found behaviour

- `dist/404.html` must exist with a unique title, one H1, navigation and a useful link home.
- A request to a random path on the actual Pages preview must return HTTP `404` while rendering the custom page.
- A direct request to `/404.html` may return `200`; it must be `noindex` and must not be listed in the sitemap.
- The page must work with JavaScript disabled and must not use a client-side redirect.

## Static build and route gates

The aggregate static checks must fail when any of the following is true:

1. A required route or asset is absent, empty or emitted outside its expected path.
2. A canonical route has zero or more than one H1, title, meta description or canonical element.
3. A canonical is off-origin, mixed-case, non-HTTPS, missing its trailing slash, or disagrees with the route.
4. A canonical route contains `noindex`; a compatibility route lacks `noindex,follow`.
5. Two indexable pages share a title or meta description.
6. `<html lang>` is not `en-GB` or the chosen single site-wide English code.
7. Any local link, image, stylesheet, script, feed reference or fragment target is broken.
8. A canonical page relies on client-side rendering for its H1, proposition, facts, essay body, byline, dates, navigation or contact route.
9. An image lacks dimensions, has an empty source, causes a broken request, or lacks a purposeful `alt` value unless it is correctly marked decorative.

The build must be deterministic: two clean builds from the same commit must produce identical file lists and byte-identical text outputs. Content-derived timestamps may not use the wall-clock build time.

## Link gates

### Internal links

The static crawler must normalise query strings and fragments, resolve directory routes to `index.html`, and test every local reference from HTML, XML, JSON and CSS. It must verify fragment IDs on their destination pages. Zero broken internal links are allowed.

Every compatibility page must link to its canonical destination. Every essay must link back to `/thinking/`; visible breadcrumbs must match any `BreadcrumbList` schema.

### External links

Before a production release, run an HTTP audit from a network-enabled environment:

- Accept `200-399` after at most five redirects.
- Retry `429` and transient `5xx` twice with backoff, then record as unresolved.
- Fail permanent `4xx`, redirect loops, malformed URLs, mixed-content URLs and destinations that resolve to a different person or organisation.
- Validate `mailto:` syntax without sending mail.
- Record the checked date and final URL for LinkedIn, NovaPharm, Companies House, Yakuji Nippo and every pharmaceutical primary source.

An external-link timeout may be documented for review, but an identity `sameAs`, company domain or factual citation cannot ship unresolved.

## No-JavaScript gates

With JavaScript disabled at desktop and mobile widths:

- All canonical routes show their H1 and complete essential prose.
- Primary navigation is visible and keyboard-operable. A collapsed mobile control that cannot open without JavaScript is a failure; provide a native or explicit no-script navigation path.
- All essays, citations, dates, status labels, facts and contact details remain readable.
- The hero poster remains visible and the canvas contributes no required information.
- Compatibility-page links and the 404 recovery route work.
- No element remains hidden because an animation or enhancement class was never initialised.
- There is no blank loading state, fake loader or layout that waits for JavaScript.

## Responsive and interaction gates

At every inspection width:

- `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`.
- Text and controls do not overlap, clip or render outside the viewport.
- Navigation is available; the mobile menu reports accurate `aria-expanded` and `aria-controls` state.
- `Escape` closes the mobile menu and returns focus to its trigger. Focus does not become trapped behind an open menu.
- Tab order follows reading order; the skip link moves focus to main content.
- Interactive targets aim for 44 x 44 CSS pixels and never violate WCAG 2.2 target-size minimums without a permitted exception.
- Images preserve aspect ratio and do not cause layout shift.
- Long titles, URLs and 200% text zoom do not create horizontal scrolling.
- At 400% browser zoom on a 1280-pixel viewport, content reflows to a usable single-column reading experience.
- A browser console error, uncaught exception, CSP violation, failed first-party request or hydration-style error does not occur on any canonical route.

Chromium visual baselines are required for `/`, `/about/`, `/ventures/`, `/thinking/`, one essay, `/facts/`, `/contact/` and `/404.html` at 390 x 844 and 1440 x 1000. Pixel changes above `0.5%` require an intentional baseline update and human review. Firefox and WebKit receive functional and manual visual checks rather than cross-engine pixel comparison.

## Reduced-motion gates

With `prefers-reduced-motion: reduce`:

- No canvas animation loop starts.
- CSS smooth scrolling, parallax, entrance animation and decorative looping animation are disabled.
- Menu state changes are immediate or use a non-motion opacity change no longer than 100 ms.
- Content is never hidden pending an intersection or scroll event.
- Reading progress and hover effects do not flash or oscillate.
- Browser trace shows no repeating `requestAnimationFrame` activity after the page settles.

## Canvas and WebGL failure gates

The accepted architecture uses an optional 2D canvas rather than WebGL, but failure handling must cover both future and current implementations.

1. Before enhancement loads, semantic hero HTML and a high-quality CSS/static poster are visible.
2. The canvas is `aria-hidden="true"`, not focusable, contains no text-only information and never intercepts links or pointer access to content.
3. Stub `HTMLCanvasElement.prototype.getContext` to return `null`: the page must show the poster, log no uncaught error and preserve layout.
4. Abort the enhancement-module network request: the same fallback must remain.
5. Emulate reduced motion, `Save-Data: on`, a narrow viewport and low hardware concurrency separately: animation must not start in any disabled case.
6. Send `visibilitychange` with the document hidden: animation scheduling must stop; it may resume only when visible.
7. Canvas must load after critical HTML/styles and the LCP resource. It may not block the headline, navigation or portrait.
8. Device-pixel ratio and frame rate must be capped; the enhancement must not run continuously when off-screen.
9. If a future WebGL implementation replaces the 2D canvas, context-loss and `webglcontextlost` tests become mandatory before merge.

## Accessibility gates

### Automated axe gate

Run axe on every canonical route plus `/404.html` in Chromium desktop and mobile, and on the homepage/mobile menu in WebKit.

- Include WCAG 2.0 A/AA, 2.1 A/AA and 2.2 AA tags plus best-practice reporting.
- Fail any critical or serious violation.
- Fail any WCAG A/AA violation at any impact level.
- Moderate/minor best-practice findings must be reviewed and recorded; they are not silently ignored.
- Test both closed and open mobile-menu states.

### Manual accessibility gate

- Keyboard-only pass in Chromium, Firefox and WebKit: skip link, navigation, menu, all links, mail link and 404 recovery.
- Visible focus is never obscured by sticky UI.
- Landmark order is header, navigation, main and footer; headings form a logical outline.
- Colour contrast meets 4.5:1 for normal text, 3:1 for large text and 3:1 for meaningful non-text UI.
- Status is not conveyed by colour alone.
- Portrait and editorial images have useful alt text; texture, canvas and rules are decorative.
- VoiceOver with Safari reads the page title, landmarks, H1, menu state, status labels, article metadata and link purposes sensibly.
- Content remains usable at 200% text zoom and 400% page zoom.
- No auto-playing audio, flashing content, time limit or pointer-only action exists.

## Claim and privacy gates

`docs/FACT_LEDGER.md` and `src/data/entity.mjs` are the editorial control plane. See `docs/CLAIM_AUDIT_SUMMARY.md` for the current disposition.

The complete release control set is:

1. Every material entity value in central data carries a valid claim ID.
2. `PRIVATE_DO_NOT_PUBLISH`, `UNSUPPORTED_REMOVE` and unapproved `NEEDS_OWNER_APPROVAL` claim IDs cannot be selected by a public page, schema builder, feed or machine-readable file.
3. `PLANNED` and `IN_PROGRESS` claims have an adjacent visible status label wherever used.
4. Schema is never broader than visible prose.
5. Rendered output contains no wording that claims NovaPharm is MHRA licensed/approved, GDP certified, supplying the NHS, revenue-generating, operating deployed AI/blockchain/pharmacovigilance systems, or in an operational Polar Speed relationship.
6. Rendered output contains no unsupported `UK-based founder`, nationality, investor, advisor, host, award, expert, visionary, thought-leader or Wikipedia/Wikidata assertion.
7. Generic high-risk patterns such as `passport`, `date of birth`, `visa`, `immigration`, `right to work`, residential-address wording, private-phone patterns and private financial forecasts fail the build unless an explicit public-safe content exception exists. No actual private value is stored in the repository denylist.
8. No `.docx`, private `.pdf`, source-document filename, extracted source text, signature or source-of-funds material exists in tracked files, `public/`, `dist/`, source maps or test snapshots.
9. Public image derivatives contain no EXIF location, camera serial, authoring or timestamp metadata.
10. Only the verified LinkedIn URL enters Person `sameAs`; publication articles and company registries are not mislabelled as `sameAs`.

The current static automation directly enforces rendered denylist/privacy patterns, output file exclusions, portrait metadata, `sameAs` snapshots and semantic schema/output checks. Claim-ID selection, adjacent-status judgement and sentence-level ledger reconciliation remain mandatory human review until a stronger source-binding validator is implemented. A static pass must not be represented as automated approval of items 1–4.

Manual claim review must compare every visible page, metadata block, JSON-LD object, `facts.json`, feed, social card text and `llms.txt` against the ledger. Search matches for regulated terms such as MHRA, GDP, NHS, licence, partner, AI, blockchain, operational, customer and revenue require sentence-level review rather than a blind allowlist.

## Structured-data and metadata gates

- Every JSON-LD script parses as JSON and contains an allowed Schema.org type for that route.
- Stable IDs are exactly `/#person`, `/#website` and `/ventures/#novapharm-healthcare` on their canonical origins.
- `/about/` uses `ProfilePage` with the Person as `mainEntity`; essays use `BlogPosting`; visible breadcrumbs match `BreadcrumbList`.
- No `FAQPage`, `ScholarlyArticle`, nationality, residence, rating, award, customer, licence, revenue or projected-value property is emitted.
- Person and Organization names, URLs, dates and `sameAs` values agree across all pages.
- Article `datePublished` and `dateModified` equal content metadata and visible dates; author resolves to the stable Person ID.
- Open Graph URL equals the canonical. Social images exist, are at least 1200 x 630 where intended, have declared dimensions and are not broken.
- Validate applicable pages in Schema.org Validator and Google Rich Results Test against the final public preview; save result links or screenshots in the release record.

## Sitemap, feed and crawler gates

### Sitemap

- Valid XML with production-origin absolute URLs only.
- Every indexable canonical HTML route appears exactly once.
- Compatibility pages, `404.html`, utility JSON/XML files and noindex pages do not appear.
- Every `<loc>` maps to a built page with a self-canonical and eventual production `200`.
- `<lastmod>` exactly matches an approved content `modified` or factual review date.
- No `priority` or `changefreq` elements.

### Feeds

- RSS and JSON Feed parse successfully and contain every public essay exactly once in reverse publication order.
- Item URLs and IDs are canonical and stable; dates are ISO-valid; summaries contain no unsafe raw HTML.
- Feed claims, author identity and source links match the rendered essay.

### Robots

The parser/snapshot test must enforce this intent:

- Allow ordinary indexing by Googlebot and Bingbot.
- Allow OAI-SearchBot and ChatGPT-User; disallow GPTBot.
- Allow Claude-SearchBot and Claude-User; disallow ClaudeBot.
- Allow PerplexityBot and Perplexity-User.
- Disallow Google-Extended and CCBot.
- Include the canonical sitemap URL.
- Include no `Crawl-delay` for Googlebot or Bingbot.
- Never treat `robots.txt` as protection for private files.

## Editorial and essay gates

Every essay must have validated title, description, summary, author, published date, modified date, category, reading time, canonical path, social image, sources, related items and public status.

- One explicit byline and visible publication/update dates.
- General-information editorial disclaimer; no patient-specific advice.
- Pharmaceutical factual claims cite current primary MHRA, GOV.UK, NHS, NICE, EMA or equivalent sources.
- Analysis/opinion is distinguishable from factual guidance.
- Related and previous/next links resolve and do not create self-links.
- Adding an essay automatically updates `/thinking/`, feeds, sitemap and related-content logic without a homepage code edit.
- Legacy essay URLs retain their agreed canonical behaviour.

## Security and privacy gates

- Secret scan of tracked changes and generated output finds no credentials, tokens, private keys, connection strings or high-entropy secrets.
- No analytics, advertising pixel, remote font, cookie, local-storage tracking or third-party runtime request ships.
- The privacy page accurately describes the real data flow: direct links/mail only unless implementation changes.
- No contact form exists unless a separately approved backend, validation, spam control and privacy notice are completed.
- Markdown rendering escapes arbitrary HTML and unsafe URL schemes.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- CSP contains no `unsafe-eval`, blocks object/embed content and limits network origins to those actually required.
- Generated pages contain no inline event-handler attributes or `javascript:` URLs.
- Source maps, debug dumps, directory listings and temporary files are absent from `dist/`.

## Performance gates

Run Lighthouse against a production server for three cold-cache mobile runs and three desktop runs. Use the median for score thresholds; no individual run may show a functional error.

| Metric | Release gate |
|---|---:|
| Mobile Lighthouse Performance | Median >= 95; no run below 90 |
| Accessibility | 100 |
| Best Practices | >= 95 |
| SEO | 100 |
| Mobile LCP | <= 2.5 s |
| CLS | <= 0.10 |
| Interaction response for menu/basic controls | <= 200 ms under test throttling |
| Initial critical JavaScript, Brotli | <= 15 KB |
| All homepage JavaScript, Brotli | <= 35 KB |
| Global CSS, Brotli | <= 20 KB |
| Mobile LCP image | <= 180 KB AVIF; <= 280 KB fallback |
| Initial mobile transfer before lazy enhancement | <= 500 KB |

There must be no render-blocking third-party request, unnecessary preload, layout shift from fonts/images, long main-thread task above 50 ms during initial content rendering, or animation activity after the canvas is off-screen/hidden.

## Manual content and visual gate

The reviewer must confirm:

- The site reads as a custom founder platform, not a SaaS, agency or pharmaceutical catalogue template.
- Visual hierarchy, crop quality, spacing and contrast are polished on representative desktop/mobile screenshots.
- Motion has narrative purpose and does not obscure content.
- The founder portrait is authentic; no synthetic representation is present.
- Portrait rights, public email deliverability and conservative SyriMed wording have owner confirmation before production.
- Current-status labels are conspicuous and understandable without reading a disclaimer.
- No claim becomes stronger in a title, metadata, social card, schema or machine-readable endpoint than in visible prose.
- No production DNS, Pages source, domain ownership or account setting is changed during QA.

## Release evidence

`docs/QA_RESULTS.md` must record, for the release commit:

1. Exact commit and environment versions.
2. Full command list and exit codes.
3. Build file count and bundle-size report.
4. Route/link/schema/sitemap/feed summaries.
5. Axe results and manual keyboard/screen-reader notes.
6. Lighthouse JSON/HTML locations and score table.
7. Desktop/mobile screenshot locations.
8. Claim scan result and human claim-review sign-off.
9. Open approvals, external-link exceptions and their release effect.
10. Preview URL, if authorised, plus HTTP evidence for canonical and 404 behaviour.

Production approval requires an exact owner action: review the draft pull request, confirm the three owner-controlled content items above, and then follow `docs/DEPLOYMENT.md`. No test result authorises an automatic merge or deployment.
