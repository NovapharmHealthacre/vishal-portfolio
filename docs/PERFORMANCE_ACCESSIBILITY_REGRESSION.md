# Performance and accessibility regression

Baseline release reviewed: 13 July 2026
SEO review: 14 July 2026

## Production baselines

- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100
- Desktop Lighthouse: 100/100/100/100
- Mobile LCP: approximately 1.8 seconds
- Mobile CLS: approximately 0.032
- TBT: 0
- Cross-engine axe: zero reported violations

These values are release evidence, not permanent guarantees or field Core Web Vitals.

## SEO-branch impact

The branch changes entity data, JSON-LD, facts JSON, sitemap dates, crawler comments, supplemental text, tests and documentation. It does not change CSS, visual components, images, canvas code, navigation or article body content.

Expected visual impact: none.

Expected transfer impact: negligible metadata/facts text only.

## Required gates

At minimum:

```bash
npm ci
npm run check
npm run build
```

Hosted CI must pass before review.

Because generated HTML and schema change, validate representative pages in rendered source. Full screenshot regeneration is unnecessary unless a test or browser review shows visible output changed.

## Regression thresholds

- Performance ≥95
- Accessibility 100 or no serious violations
- Best Practices ≥95
- SEO 100
- LCP <2.5 seconds
- CLS <0.1
- no new blocking third-party requests
- no analytics or tracking scripts
- no mobile overflow
- no keyboard, reduced-motion or no-JavaScript regression

## Browser retest triggers

Run Chromium, Firefox, WebKit, axe, mobile/desktop screenshots and Lighthouse when:

- layout or CSS changes;
- images or fonts change;
- browser JavaScript changes;
- CSP changes;
- new forms or third-party services are added;
- hosted CI or static checks indicate unexpected HTML output.

## Field monitoring

Use Search Console Core Web Vitals when enough real-user data exists. Lab results and deterministic size budgets remain release controls, not substitutes for field data.
