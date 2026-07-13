# Post-merge release report

- Report date: 13 July 2026
- Repository: `NovapharmHealthacre/vishal-portfolio`
- Merged main commit: `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a`
- Previously tested PR candidate: `6384fbead98adc5a9f7609dbe0813015080e6a55`
- Audited hardening implementation: `ec72e061e8a316476d805fe7eed28dee021daefb`
- Hardening branch: `release/post-merge-hardening`
- Production state: **NOT DEPLOYED BY THIS TASK**
- Release recommendation: **DEPLOY through the owner-controlled sequence below**

## Executive summary

The squash-merged main tree is byte-for-byte identical to the previously tested PR candidate. Release hardening found and corrected four narrow rendered/technical defects: decorative mobile overflow, 320-pixel venture-title overflow, two text-contrast failures and a Content Security Policy rule that blocked Lighthouse's same-origin robots audit. Owner-approved identity, employment and privacy wording was also centralised and regression-tested.

The final implementation passes the complete deterministic suite, three browser engines, 29-route desktop/mobile coverage, tablet coverage, no-JavaScript and progressive-enhancement fallbacks, axe, keyboard/reflow checks and four Lighthouse runs. No private research document or unsupported positive operating claim is present in `dist`.

The site is ready for a controlled deployment, but production remains unchanged. GitHub Pages still publishes legacy `main/(root)`, its custom-domain setting is empty and merging a PR to `main` can deploy without a human environment approval gate. The owner must explicitly authorise and coordinate the Pages switch and hardening merge.

## Main and candidate tree comparison

Both commits resolve to Git tree `1c470fb57101c656ecd3d422e8b10dd2f07a986b`:

- candidate `6384fbead98adc5a9f7609dbe0813015080e6a55`;
- merged main `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a`.

`git diff --stat` and the full `git diff` between them are empty. The different commit identifiers are solely the expected effect of GitHub's squash merge; no unexplained source drift exists.

## Owner approvals recorded

The owner explicitly approved these items on 13 July 2026:

- **A-001:** permission to publish, crop, optimise and transform the selected founder portrait on the personal website and social cards;
- **A-002:** `vishal@novapharmhealthcare.com` as the preferred public contact inbox;
- **A-005:** “His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.” No title or stronger relationship label is approved;
- **A-019:** the minimal no-form/no-analytics/no-tracking email-enquiry privacy position, without undocumented retention, deletion, legal-basis, non-disclosure or non-sharing promises.

No other disputed regulatory, customer, financial, immigration, technology-deployment or partnership claim was approved.

Ordinary-browser identity check A-018 also passed for `https://novapharmhealthcare.com/` and `https://www.linkedin.com/in/vishal-chakravarty`. It confirms those URLs only; it does not approve location, regulatory or operating claims.

## Corrections made on the hardening branch

1. Removed the negative mobile lattice inset that created horizontal overflow at 390 pixels.
2. Changed the single-column venture track to `minmax(0, 1fr)` and applied a mobile title clamp/safe wrap. Reflow now reports exactly 320/320 pixels in Chromium, Firefox and WebKit at the 400% equivalent.
3. Increased the dark evidence-section number contrast and changed the light editorial-policy eyebrow to oxblood. Axe now reports zero violations in all three engines.
4. Changed CSP `connect-src 'none'` to `connect-src 'self'`. External connections remain blocked, while standards/audit tooling can read same-origin `/robots.txt`. A regression test locks this boundary.
5. Applied exact A-005 wording, the approved A-019 privacy flow and the approved `.com` inbox across visible copy and central entity data.
6. Added regression tests for public-safe facts, P-008 historical classification, privacy wording, the approved inbox and CSP.
7. Updated QA viewports, post-merge deployment instructions, rollback sequencing, approval records and stale pre-merge documentation.

## Deterministic build and artifact audit

Environment:

- Node.js `v26.4.0`;
- macOS `26.5.2` build `25F84`;
- package-lock SHA-256 `8dbbff1cff8ab76a6ec530079389f282f122738e36514e9fc69b902c7770fd80`;
- clean `npm ci`: one package audited, zero vulnerabilities.

Final results:

- `npm run check`: passed;
- 13/13 unit tests passed;
- four essays and seven page-content files validated;
- 25 HTML files passed internal-link and structured-data checks;
- 39 canonical, compatibility and machine-readable routes passed;
- claims, static accessibility, deterministic performance and security gates passed;
- 51 build artifacts generated from four essays;
- two clean builds produced identical aggregate SHA-256 `52684b85bccaa65e2c970a2a7214b0364bfd55c02958b01b80aef6c48967fbd5`.

Artifact assertions:

- `dist/CNAME` is exactly `vishal.novapharmhealthcare.com`;
- the Google verification file is present with the exact verification payload;
- `robots.txt` contains the deliberate crawler policy and canonical sitemap line;
- `sitemap.xml` contains the intended 13 canonical URLs;
- `facts.json` contains five facts, all `publicSafe: true`, and only the verified LinkedIn URL in `sameAs`;
- no DOC, DOCX, PDF, XLS or XLSX research file exists in `dist`;
- no private evidence value exists in the generated site. The phrase “private financial information” appears only in visible prose stating that such material is not publicly available;
- no unsupported positive MHRA, NHS, GDP, investor, adviser, podcast, revenue, customer, Polar Speed or deployed-technology claim passed the rendered-output claim gate. Relevant terms remain only in sourced analysis or explicit “not claimed” safeguards.

## Browser and interaction evidence

Evidence environment: Playwright `1.61.1`, axe-core `4.12.1`, Chromium 149, Firefox 151 and WebKit/Safari 26.5.

- Total failures: **0**.
- Per engine: 30 desktop checks (29 declared routes plus unknown-path 404), 29 mobile checks and 13 tablet routes.
- Desktop viewport: 1440 × 1000.
- Mobile viewport: 390 × 844.
- Tablet viewport: 768 × 1024.
- All canonical pages, every essay, `/404.html`, legacy `.html` pages, legacy essay routes and direct `index.html` forms passed.
- Unknown-path request returned HTTP 404 with the custom not-found page.
- All tested pages reported no horizontal overflow, broken first-party image or console failure.
- JavaScript-disabled essential content passed on all 29 routes.
- Reduced motion suppressed the lattice module request.
- Canvas-unavailable mode retained the static poster.
- Skip link, visible focus, mobile-menu open/Escape/focus return and keyboard navigation passed.
- Safari/WebKit's standard Option+Tab navigation convention passed.
- 200% and 400% standards-equivalent reflow passed at 640 and 320 CSS pixels.
- Chromium slow-network profile (150 ms latency, 1.6 Mbps down, 600 Kbps up) passed.
- Fourteen browser-level internal links passed with zero broken destinations.
- Founder portrait loading, `object-fit: cover` crop and the 1200 × 630 social card passed.
- Autonomous lattice frames differed, proving that the progressive canvas enhancement animates without requiring hover.

Native Safari 26.5.2 WebDriver was attempted twice. Safari's “Allow remote automation” setting is disabled, and enabling it requires the owner's macOS password; no credential was requested or captured. This is not treated as a release defect because the matching WebKit 26.5 engine completed the full functional, responsive, accessibility and visual matrix.

Ignored local evidence:

- `artifacts/release-qa/browser-qa.json`;
- `artifacts/release-qa/screenshots/`;
- `artifacts/release-qa/lighthouse/final/`;
- `artifacts/release-qa/native-safari/native-safari.json`.

## Accessibility results

Axe ran against 14 representative pages in each of Chromium, Firefox and WebKit: 42 page-engine audits and **zero violations**. Static semantic checks also passed across 24 pages. Keyboard, skip-link, focus visibility, mobile menu, image, no-JavaScript, reduced-motion and 200%/400%-reflow checks passed.

## Lighthouse results

All final Lighthouse runs used a local HTTPS preview of the production build. The robots audit scored 1 in every run.

| Pass | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile cold 1 | 99 | 100 | 100 | 100 | 1.801 s | 0.032 | 0 ms |
| Mobile cold 2 | 99 | 100 | 100 | 100 | 1.801 s | 0.032 | 0 ms |
| Mobile cold 3 | 99 | 100 | 100 | 100 | 1.801 s | 0.032 | 0 ms |
| Desktop | 100 | 100 | 100 | 100 | 0.483 s | 0 | 0 ms |

INP is not produced by this lab Lighthouse run; TBT was 0 ms in every pass. The browser interaction suite found no long-task or interaction failure.

## Screenshot and visual review

Seventy-three uniquely named screenshots were retained under the ignored artifact directory, including every requested Chromium desktop/mobile route, tablet references, Firefox and WebKit home references, focus states, two lattice frames and the social card.

The rendered platform achieves the intended premium editorial direction: deep ink, warm ivory, restrained oxblood, large serif typography, strong negative space and an authentic founder portrait. The visual review found no generic SaaS-card treatment, awkward crop, collision, undersized mobile text, weak mobile navigation or excessive animation/noise.

The canvas lattice is not Three.js/WebGL 3D, but it creates sufficient restrained depth, is deterministic, lazy/progressive and disappears correctly under reduced-motion, narrow-device and failure conditions. A Three.js replacement would add cost without a demonstrated narrative or visual benefit and is not recommended.

## GitHub Pages and deployment drift

Read-only Pages audit on 13 July 2026 found:

- Pages API `build_type`: `legacy`;
- publishing source: branch `main`, path `/`;
- custom domain: `null`;
- HTTPS enforcement: `true`;
- active custom 404: `false`;
- `github-pages` environment exists and permits only `main` through a custom branch policy;
- the environment has no required reviewer or wait timer, so merging to `main` is the effective production authorisation.

Both post-squash workflows succeeded:

- intended [Deploy production site run 29229940360](https://github.com/NovapharmHealthacre/vishal-portfolio/actions/runs/29229940360), deployment `5420342818`, completed at 06:46:14Z and became inactive;
- later legacy [pages build and deployment run 29229939864](https://github.com/NovapharmHealthacre/vishal-portfolio/actions/runs/29229939864), deployment `5420344279`, completed at 06:46:27Z and remained active.

The legacy dynamic deployment ran later and superseded the correct `dist` deployment. The default Pages URL serves that legacy branch-root/Jekyll artifact. The custom domain currently returns GitHub Pages 404, which is consistent with the audited empty Pages custom-domain setting. An old site seen locally may be cached; it is not evidence that the new Actions artifact is live.

The DNS CNAME already points to GitHub Pages and must not be changed.

## Exact owner-controlled deployment action

After reviewing and explicitly authorising the release:

1. Freeze `main` for the release window and record the active legacy deployment.
2. Open Repository Settings → Pages.
3. Change Source from **Deploy from a branch** to **GitHub Actions**.
4. Save `vishal.novapharmhealthcare.com` as the custom domain.
5. Retain or enable HTTPS enforcement when GitHub makes the control available.
6. Confirm the hardening PR head and checks, then merge that PR into `main`. Do not force-push.
7. Watch `Deploy production site`; the merge push should trigger it automatically. Manually dispatch on `main` only if the merge did not trigger a run.
8. Confirm the deployed artifact is `dist` and that no later dynamic legacy deployment supersedes it.
9. Validate the production hostname, canonical and legacy routes, custom 404, verification file, sitemap, robots, images, keyboard behaviour and mobile layout.

No setting, DNS record, branch merge or deployment was changed during this hardening task.

## Rollback

For a small post-release defect, create a rollback branch from current `main`, revert the bad hardening/release commit through a reviewed PR and allow the Actions workflow to deploy the revert. Never reset or force-push.

For an unsafe first migration with no known-good Actions deployment, use the owner-authorised emergency sequence in `docs/ROLLBACK.md`: revert the hardening change first, then revert normal squash commit `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a`, verify the protected root baseline and its CNAME/verification files, merge the reviewed rollback and switch Pages back to `main/(root)`. Preserve the custom domain and DNS.

## Remaining operational gaps

- The release is not live until the owner changes the Pages source/custom-domain setting and merges the approved PR.
- Native Safari automation remains disabled by an owner-controlled Safari setting; the equivalent WebKit 26.5 suite passed.
- Public-inbox delivery should be smoke-tested during the monitored release window without publishing an alternate address.
- All unapproved India-entity, Polar Speed, MHRA, customer, supplier, revenue, investment, immigration, location, podcast, adviser/investor and deployed-technology claims remain omitted.

## Final decision

**DEPLOY — recommended through the controlled owner sequence above.** The candidate has real browser evidence and meets the release gates. This recommendation is not deployment authorisation: the draft PR must remain unmerged and Pages/DNS must remain unchanged until the owner explicitly authorises the production window.
