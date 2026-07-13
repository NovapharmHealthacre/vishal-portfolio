# Quality-assurance results

Evidence date: 13 July 2026
Candidate branch: `rebuild/world-class-portfolio`
Baseline: `1ae1ff5c43123f2c3f5be78f0e37da144f460f06`
Production origin: `https://vishal.novapharmhealthcare.com/`
Release decision: **NOT READY FOR PRODUCTION**

The static production candidate is internally consistent and reproducible. Production remains blocked by owner-controlled content approvals, Pages-source coordination, ordinary-browser identity/domain verification and the browser/axe/Lighthouse/screenshot matrix described below.

## Environment

| Item | Value |
|---|---|
| Host | macOS 26.5.2 (25F84), arm64, managed Codex workspace |
| Node used for local evidence | `v26.4.0` |
| Declared/CI Node floor | Node 22 (`.node-version` and `engines.node >=22`) |
| npm | `11.17.0` |
| Runtime dependencies | 0 |
| Build output | `dist/` (generated and ignored) |

The final local commit SHA is recorded in the completion handoff because adding this evidence file necessarily changes the commit that contains it. Lockfile SHA-256: `8dbbff1cff8ab76a6ec530079389f282f122738e36514e9fc69b902c7770fd80`.

## Deterministic command evidence

`npm ci` completed from the committed lockfile, audited one package and reported zero vulnerabilities. `npm run check` exited 0 on 13 July 2026 with the following results:

| Gate | Result | Evidence summary |
|---|---|---|
| Formatting | PASS | Formatting hygiene checks passed. |
| JavaScript syntax | PASS | 27 modules checked. |
| Content/entity contracts | PASS | 4 essays, 7 prose pages and central entity data validated. This is not a separate JavaScript/TypeScript static type checker. |
| Production build | PASS | 51 files generated from 4 essays. |
| Unit tests | PASS | 9 passed, 0 failed/skipped. |
| Internal links/assets/fragments | PASS | 25 HTML files checked, including `srcset`, CSS and machine-readable local links. |
| Metadata and JSON-LD | PASS | Canonical metadata and semantic schema validated across 25 HTML files. |
| Claim/privacy denylist | PASS | Rendered-output claim and privacy checks passed. Ledger-to-source reconciliation remains a human release review. |
| Routes | PASS | 39 canonical, legacy and machine-readable routes verified. |
| Static accessibility preflight | PASS | 24 pages checked; five core text pairs meet at least 4.5:1. This is not axe or manual WCAG certification. |
| Deterministic performance budget | PASS | All declared transfer, image, DOM, CSS and JavaScript limits passed. |
| Security guardrails | PASS | 87 tracked/current files and 51 build artifacts checked. |

## Deterministic performance evidence

| Resource | Measured Brotli/on-disk value | Budget |
|---|---:|---:|
| Critical JavaScript | 0.5 KB | 15 KB |
| All homepage JavaScript | 2.2 KB | 35 KB |
| Global CSS | 6.3 KB | 20 KB |
| Homepage HTML | 3.5 KB | 35 KB |
| LCP portrait AVIF | 7.6 KB | 180 KB |
| LCP portrait JPEG fallback | 34.7 KB | 280 KB |
| Initial homepage transfer estimate | 17.9 KB | 500 KB |
| Homepage DOM estimate | 229 nodes | 1,200 nodes |
| First-party page assets on disk | 43.9 KB across 3 files | Informational |

These are build-time diagnostics, not measured Core Web Vitals or Lighthouse scores.

## Reproducibility and security

- Two clean builds from the same source tree produced the same 51-file output and aggregate SHA-256: `8e5055d67450e577527e44d016f912ede9b1f6b6f83e881be9ac5aec7f28dd2e`.
- `npm ci` required no third-party packages beyond the root lockfile entry.
- A historical patch scan found no common credential or private-key signatures.
- No DOCX/PDF research input, private evidence, environment file, source map, analytics runtime or remote font exists in `dist/`.
- The founder source portrait was recompressed without camera, device or timestamp metadata; public derivatives are metadata-stripped and covered by an automated test.
- GitHub Actions use exact commit pins, least-privilege Pages permissions and a main-only deployment condition.

## External-link evidence

Direct web checks reached Companies House, all six Yakuji Nippo article pages and all five GOV.UK essay sources. The exact LinkedIn identity was corroborated by its current indexed result. The company `.com` domain was corroborated by Yakuji and LinkedIn but could not be directly fetched by the managed web client; see `docs/EXTERNAL_LINK_AUDIT.md` and A-018.

## Blocked release gates

| Gate | Status | Reason and exact next action |
|---|---|---|
| Playwright Chromium/Firefox/WebKit | BLOCKED | `npm run test:browser` exited 1 because the preview listener failed with `listen EPERM 127.0.0.1:4399`; installed browser executables are also unavailable. Extend/execute the complete matrix in `docs/QA_PLAN.md` in a browser-enabled environment. |
| Desktop/mobile page screenshots | BLOCKED | They are produced by the same browser harness. Run `npm run test:visual`, retain the route images and complete human review. |
| Axe WCAG 2.2 AA automation | BLOCKED | axe-core is unavailable and a browser cannot launch. Install and lock the release toolchain, then run the route matrix in `docs/QA_PLAN.md`. |
| Lighthouse/Core Web Vitals lab evidence | BLOCKED | Lighthouse/browser runtime is unavailable and loopback preview binding is rejected with `EPERM`. Run three cold-cache mobile passes plus desktop against the exact preview commit. |
| Keyboard, VoiceOver and Safari review | BLOCKED | Requires interactive macOS browser testing. Complete the manual checklist in `docs/QA_PLAN.md`. |
| Live HTTP 404/canonical validation | BLOCKED | Requires an authorised preview or production-like host. Validate the deployed preview before merge. |
| Schema.org Validator / Google Rich Results Test | NOT RUN | Requires an accessible preview URL. Save the final validation evidence before merge. |
| GitHub Actions / Pages workflow | PENDING | The review branch was published through the authenticated GitHub connector after local evidence was recorded. Use the draft PR checks as the authoritative hosted result; the production deploy job remains main-only. |

The Playwright harness is now configured for all canonical essays and compatibility routes, exact desktop/mobile screenshot viewports, per-route console/request/image checks, skip-link and menu focus, desktop/mobile no-JavaScript passes, nine responsive viewports, reduced motion, Save-Data, low memory, low concurrency, narrow screens, canvas failure and lattice-module failure. This configuration has only passed JavaScript syntax validation here. It still requires execution plus axe, Lighthouse, VoiceOver, full keyboard traversal, 200%/400% zoom, slow-network testing, visibility/off-screen pause checks and a human-reviewed visual baseline. `test:visual` invokes the same screenshot harness; it does not calculate a pixel diff.

No site screenshots were produced, `artifacts/browser-results.json` contains an empty array, and no local or remote preview URL exists.

## Claim audit result

The ledger contains 40 claims: 14 `VERIFIED_CURRENT`, 1 `VERIFIED_HISTORICAL`, 1 `IN_PROGRESS`, 5 `PLANNED`, 4 `PRIVATE_DO_NOT_PUBLISH`, 10 `UNSUPPORTED_REMOVE` and 5 `NEEDS_OWNER_APPROVAL`. The candidate publishes only the verified set and carefully labelled selected roadmap/in-progress wording. The other 19 claims remain absent.

Production content approval still requires A-001 (portrait rights), A-002 (public inbox) and A-005 (conservative SyriMed wording). All other disputed/private claims are omitted and are not release blockers unless someone proposes adding them.

## Release decision

The code and static artifact are ready for browser QA, not production deployment. The owner must:

1. confirm A-001, A-002 and A-005;
2. complete A-017 and A-018 against the exact candidate commit;
3. review the draft PR and coordinate the Pages source switch (A-015);
4. merge and deploy only after every production gate is recorded as passed.
