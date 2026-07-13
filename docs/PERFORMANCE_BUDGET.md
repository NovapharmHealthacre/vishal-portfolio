# Performance budget

Last reviewed: 12 July 2026

## Objective

Keep the founder platform immediate, stable and usable on ordinary mobile hardware while preserving an optional cinematic enhancement. The semantic page must never wait for canvas, analytics, remote fonts or client-side rendering.

These are release budgets, not measured results. Record actual production-build measurements in the pull request; do not claim a target was achieved without evidence.

## Experience targets

| Metric | Release target | Regression boundary |
|---|---:|---:|
| Lighthouse Performance | 95 or higher where feasible | Below 90 blocks release unless documented and approved |
| Lighthouse Accessibility | 100 target | Any serious/critical automated issue blocks release |
| Lighthouse Best Practices | 95 or higher | Below 90 blocks release |
| Lighthouse SEO | 100 | Missing canonical/indexability issue blocks release |
| Largest Contentful Paint | under 2.5 s | 2.5 s or worse requires remediation/exception |
| Interaction to Next Paint | under 200 ms | 200 ms or worse requires remediation/exception |
| Cumulative Layout Shift | under 0.1 | 0.1 or worse blocks release |

Core Web Vitals are ultimately field metrics. Laboratory results are release diagnostics, not a promise of real-user performance.

## Transfer and complexity budgets

Budgets apply to the production build over a cold cache. Compressed figures refer to Brotli or gzip delivery where the host supports it.

| Resource | Budget |
|---|---:|
| Initial critical JavaScript | 15 KB compressed or less |
| All first-party JavaScript on homepage, including optional canvas | 35 KB compressed or less |
| Critical/global CSS | 20 KB compressed or less |
| Homepage HTML | 35 KB compressed or less |
| LCP image | 180 KB AVIF target; 280 KB fallback maximum |
| Initial homepage transfer before lazy enhancement | 500 KB or less |
| Initial request count | 20 or fewer |
| Remote font requests | 0 |
| Third-party runtime requests | 0 |
| Hydrated framework runtime | 0 |
| Main-thread long task | none over 50 ms during initial load target |
| DOM nodes per content page | 1,200 or fewer target |

An editorial page may exceed the HTML budget when long-form content genuinely requires it, but its initial CSS, JavaScript and above-the-fold media budgets do not change.

## Image rules

- Every content image has intrinsic width and height or a reserved aspect ratio.
- Generate AVIF and WebP with a fallback and a correct `srcset`/`sizes` policy.
- Do not preload non-LCP images.
- Do not use the full-resolution founder source as the LCP asset.
- Social images are not loaded into the page merely because they appear in metadata.
- Strip EXIF from public derivatives.
- Lazy-load below-the-fold images and decode asynchronously where appropriate.

## Canvas and motion budget

The regulated-systems lattice is progressive enhancement:

- load only after critical content and LCP resources;
- render no critical text or links;
- use a static CSS poster before and without JavaScript;
- disable on narrow screens, `prefers-reduced-motion`, data-saving connections or unsupported contexts;
- cap device pixel ratio at 1.5 and animation at approximately 25 frames per second;
- stop when off-screen or when the document is hidden;
- keep the small per-frame working set bounded and avoid unbounded node/particle growth;
- fail silently to the poster after an initialization error.

The enhancement is the first feature removed or simplified when it threatens LCP, INP, battery life or thermal stability.

## Measurement procedure

1. Create a clean production build with `npm ci && npm run build`.
2. Serve `dist/` through the documented preview server; do not benchmark source files.
3. Test the homepage, about, ventures, thinking index and the longest essay.
4. Run mobile Lighthouse with a cold cache at least three times and report the median.
5. Run one desktop pass to catch layout-specific issues.
6. Test a representative slow mobile network, reduced motion, JavaScript disabled and canvas unavailable.
7. Inspect bundle/file sizes and request waterfalls.
8. Save machine-readable reports as CI artifacts or review evidence, not inside `dist/`.

The aggregate `npm run check` enforces deterministic size checks. Lighthouse is an external production gate until a locked browser toolchain is added to CI; when added, severe-regression boundaries should fail CI and reports should be retained for review.

## Pull-request evidence template

```text
Commit:
Environment and browser:
Pages tested:
Lighthouse mobile medians (P/A/BP/SEO):
LCP / INP proxy / CLS:
Initial transfer / requests:
CSS / initial JS / total JS:
LCP asset and size:
Third-party requests:
Exceptions and owner:
```

Do not compare scores produced with different throttling, cache state or build mode as if they were equivalent.

## Exception process

An exception must identify the route, measured value, target, user impact, reason, mitigation, owner and review date. Visual ambition alone is not a sufficient exception. No exception may allow invisible core content, layout instability, inaccessible controls or continuous high CPU/GPU use.

## Regression priorities

Fix in this order:

1. render-blocking or missing core content;
2. LCP image and layout shift;
3. long tasks and navigation responsiveness;
4. unnecessary JavaScript or hydration;
5. image over-delivery;
6. canvas/motion cost;
7. non-critical polish.
