# Post-launch SEO test results

Evidence date: 14 July 2026
Base commit: `cd3d2ad09c63bb6bf4b9fb002aed4e784880b76f`
Branch: `seo/post-launch-authority`

## Hosted release checks

### Diagnostic gate run

GitHub Actions run `29358026677` executed every release gate as a separately named step after a stale route-contract expectation was corrected.

Passed:

- locked installation;
- formatting;
- JavaScript syntax/lint;
- content and entity contracts;
- production build;
- unit tests;
- local links/assets/fragments;
- structured data;
- claim and privacy denylist;
- route inventory and public facts version 2;
- post-launch SEO authority controls;
- static accessibility preflight;
- deterministic performance budget;
- security guardrails.

The earlier failure was not waived. `scripts/check-routes.mjs` still expected `facts.json` schema version 1 after the intentional entity-contract upgrade to version 2. The route test now validates version 2 and its canonical Person and Organization identifiers.

### Restored combined workflow run

After diagnosis, `.github/workflows/ci.yml` was restored to its standard `npm run check` workflow. GitHub Actions run `29358076802` completed successfully on commit `c7e55b412866e72ae2b1dcbd99ed6927b59ae492`.

The final documentation commits must also receive a successful combined workflow before merge review is complete.

## Visible-output testing decision

No CSS, layout, portrait, browser JavaScript or canvas code changed. This phase alters metadata, structured data, facts JSON, sitemap dates, crawler comments, supplemental text and documentation. Therefore no new screenshot baseline is required unless the final combined checks or rendered-source review identifies an unexpected visible change.

The production release browser baselines remain:

- Chromium, Firefox and WebKit route matrix passed;
- axe reported zero violations;
- mobile Lighthouse 99/100/100/100;
- desktop Lighthouse 100/100/100/100;
- mobile LCP approximately 1.8 seconds;
- mobile CLS approximately 0.032;
- TBT 0.

## Separate maintenance evidence

Draft Actions-runtime PR #4 passed its hosted Quality checks run `29357507065`. That result does not authorise merging or production deployment.

## Release boundary

No branch in this phase has been merged or deployed. DNS and GitHub Pages settings remain unchanged.
