# Vishal Chakravarty — founder platform

A static, content-first professional platform for Vishal Chakravarty, Chief Executive Officer of NovaPharm Healthcare Ltd and the company’s founder.

The core build and runtime are deliberately dependency-free. They use Node.js standard-library modules, Markdown content, generated semantic HTML, CSS and modern browser JavaScript. The visual system uses an original Apple/OpenAI-inspired design language and a first-party canvas-based Nova field hero; it does not ship copied proprietary code, templates, assets or font files. Full release QA additionally requires externally supplied Playwright/browser, axe and Lighthouse tooling as documented in `docs/QA_PLAN.md`.

## Requirements

- Node.js 22 or later
- npm 10 or later

## Local setup

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`.

## Production build

```bash
npm run check
npm run build
npm run preview
```

The deployable site is generated in `dist/`.

## Browser release harness

Browser QA is intentionally outside the zero-dependency core. In the approved release environment, provide an absolute Playwright module path and installed Chromium, Firefox and WebKit binaries:

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run test:browser
```

`npm run test:visual` invokes the same harness and writes review screenshots under ignored `artifacts/screenshots/`; it is not a pixel-diff service. Axe, Lighthouse, VoiceOver and manual visual/keyboard review remain separate release gates.

## Publishing an essay

1. Add a Markdown file to `src/content/thinking/` using the front-matter contract in `docs/CONTENT_PUBLISHING.md`.
2. Use a stable `/essays/<slug>/` canonical path.
3. Add primary sources for factual pharmaceutical material.
4. Update `docs/FACT_LEDGER.md` if the essay introduces a material founder or company claim.
5. Run `npm run check`.

## Important source boundaries

- Public-safe entity data lives in `src/data/entity.mjs`.
- Claim governance lives in `docs/FACT_LEDGER.md`.
- Private strategic, legal, administrative, financial and personal documents must never be copied into this repository or `public/`.
- `dist/` is generated and ignored; never hand-edit it.

## Deployment

The canonical origin is `https://vishal.novapharmhealthcare.com`. `public/CNAME` is copied into the generated release, and the Pages workflow deploys `dist/` and verifies the custom domain after publication. See:

- `docs/DEPLOYMENT.md`
- `docs/ROLLBACK.md`
- `docs/NEEDS_APPROVAL.md`

## Front-end architecture

For this website, the production languages remain semantic HTML, modern CSS and JavaScript/ECMAScript modules. That choice matches the core web technologies Apple’s WebKit team recommends developers understand deeply and keeps the site fast, crawlable and progressively enhanced. Native Apple application technologies such as Swift, SwiftUI and UIKit are not used in a browser build; they are relevant if this portfolio later becomes a native iOS or macOS app.
