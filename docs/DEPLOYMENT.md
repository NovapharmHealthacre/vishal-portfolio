# Deployment runbook

Last reviewed: 12 July 2026
Production origin: `https://vishal.novapharmhealthcare.com/`
Target host: GitHub Pages through GitHub Actions

## Release boundary

This runbook prepares and deploys the generated `dist/` directory. It does not authorise a production release, DNS change, registrar change, hosting migration, merge to `main`, or use of a paid service.

Production deployment requires the owner to approve the pull request, the release window and the GitHub Pages source switch recorded as A-015 in `docs/NEEDS_APPROVAL.md`. The existing `CNAME` and Google verification file must be preserved.

## Current and target states

| State | Pages source | Published content |
|---|---|---|
| Phase 0 baseline | `main` / repository root | Hand-authored static files at commit `1ae1ff5` |
| Rebuild target | GitHub Actions | Generated `dist/` artifact |

The migration changes the Pages publishing mechanism, not the production hostname. Do not edit DNS during this release.

## Required repository contract

- Node.js 22 or newer, with the committed `.node-version` used where supported.
- A committed lockfile and reproducible `npm ci` install.
- `npm run build` creates a fresh `dist/` and never edits source content.
- `npm run check` runs the deterministic static aggregate; browser, axe, Lighthouse and manual release evidence remain separate gates.
- `npm run preview` serves the production build locally without exposing it publicly.
- `public/CNAME` is copied to `dist/CNAME` unchanged.
- `public/googlef9cdfdd63c360d56.html` is copied to the output root unchanged.
- The deployment workflow uploads only `dist/`, never the repository root or private research documents.

If the implemented script names differ, update this runbook and `README.md` in the same pull request before release.

## Owner-controlled prerequisites

1. Review every item under “Required before production approval” in `docs/NEEDS_APPROVAL.md`.
2. Confirm the founder portrait may be published and transformed, or release without it.
3. Confirm `vishal@novapharmhealthcare.com` is the intended public inbox, or remove the address pending confirmation.
4. Confirm the owner can review and merge through GitHub; re-authenticate the CLI only if command-line access is needed. Never paste or commit a token.
5. Confirm the repository Settings → Pages page still represents the audited production site.
6. Confirm Actions are enabled and the `github-pages` environment is available.
7. Choose a monitored deployment window and identify who can perform the rollback.

## Local release candidate

Run from the repository root on the release branch:

```sh
node --version
npm ci
npm run check
npm run build
npm run preview
```

The preview command is long-running. In another terminal, inspect the routes in the validation table below. Stop the preview with `Ctrl-C` when finished.

Then inspect the artifact itself:

```sh
test -f dist/index.html
test -f dist/404.html
test -f dist/CNAME
test -f dist/googlef9cdfdd63c360d56.html
test -f dist/sitemap.xml
test -f dist/robots.txt
test -f dist/rss.xml
test -f dist/feed.json
test -f dist/facts.json
cmp public/CNAME dist/CNAME
cmp public/googlef9cdfdd63c360d56.html dist/googlef9cdfdd63c360d56.html
```

`dist/CNAME` must contain only `vishal.novapharmhealthcare.com`. Generated output must contain no DOCX/PDF research inputs, environment files, Git metadata, source maps with private content, or owner-only evidence.

## Required pre-merge evidence

Attach or link the following in the draft pull request:

- clean build output and aggregate test output;
- changed-file summary;
- desktop and mobile screenshots;
- accessibility and keyboard-test results;
- Lighthouse results and any documented exception;
- internal-link, canonical, sitemap, structured-data and broken-image results;
- artifact file listing or manifest;
- claim-audit summary, including every changed `PLANNED` or `IN_PROGRESS` statement;
- confirmation that `CNAME` and the Google verification file are present in `dist/`;
- exact commit SHA proposed for production.

Do not merge while a release-blocking check, owner approval or claim classification remains unresolved.

## GitHub Pages workflow contract

The workflow should live at `.github/workflows/deploy-pages.yml` and use the official Pages actions. Its security-sensitive properties are:

- trigger on approved pushes to `main`, plus a manual `workflow_dispatch` recovery path;
- `contents: read`, `pages: write`, and `id-token: write` permissions only;
- a single `pages` concurrency group;
- checkout, Node setup, `npm ci`, checks and production build before upload;
- `actions/configure-pages`, `actions/upload-pages-artifact` with `path: dist`, and `actions/deploy-pages`;
- the protected `github-pages` environment and deployment URL output;
- no repository secrets, cloud tokens, analytics identifiers or external deploy service.

Actions should be pinned and updated deliberately. A Pages artifact must never be created from the repository root.

## First production switch

The initial switch must be coordinated because serving the rebuild source root directly would be incorrect.

1. Freeze changes to `main` for the release window.
2. Record the current production state and baseline commit `1ae1ff5`.
3. Confirm the approved pull request's head SHA and passing checks.
4. In Settings → Pages, the owner selects **GitHub Actions** as the build and deployment source. Do not change the custom domain.
5. Merge the approved rebuild pull request into `main` without force-pushing.
6. Watch the `Deploy production site` workflow. If the push did not start it, use the documented manual dispatch on `main`.
7. Record the workflow run URL, deployed commit SHA and GitHub Pages environment URL.
8. Complete production validation before ending the release window.

If the owner cannot coordinate the source switch and merge, stop. Do not merge a generator-only source tree while Pages still publishes `main/(root)`.

## Production validation

Check response status, canonical URL, visible copy, navigation, images and mobile layout for at least:

| Purpose | URL |
|---|---|
| Home | `/` |
| Canonical founder profile | `/about/` |
| Venture status | `/ventures/` |
| Editorial index | `/thinking/` |
| Media evidence | `/media/` |
| Public facts | `/facts/` |
| Contact | `/contact/` |
| Privacy | `/privacy/` |
| Legacy compatibility | `/about.html`, `/companies.html`, `/essays.html`, `/publications.html`, `/profiles.html` |
| Preserved essays | each route listed in `docs/REDIRECT_MAP.md` |
| Not found | a deliberately nonexistent URL |
| Machine files | `/robots.txt`, `/sitemap.xml`, `/rss.xml`, `/feed.json`, `/facts.json`, `/llms.txt` |
| Ownership | `/googlef9cdfdd63c360d56.html` |

Also verify:

- HTTP resolves to HTTPS;
- the custom hostname remains `vishal.novapharmhealthcare.com`;
- no page shows an unsupported licence, customer, regulatory, location or deployed-technology claim;
- core content and navigation remain usable with JavaScript disabled;
- reduced motion and WebGL/canvas failure preserve the static experience;
- there are no console errors, missing assets, duplicate H1s or duplicate canonicals;
- sitemap URLs return the expected public page and compatibility pages remain `noindex,follow`.

## Release record

Record the following in the pull request or release issue, not in public page content:

- deployment date and responsible owner;
- source and merge commit SHAs;
- workflow run and deployment URLs;
- Pages source setting used;
- test and Lighthouse summaries;
- approvals or omissions applied;
- known exceptions;
- rollback decision-maker and baseline.

## Failed deployment

- If the Actions build fails, production should not be considered updated. Fix through a new commit and pull request; do not bypass checks.
- If Pages reports an artifact or environment error, confirm the workflow uploads `dist/`, has minimal Pages permissions and targets the `github-pages` environment.
- If the custom domain is missing from the deployment, stop and restore `dist/CNAME`; do not compensate with a DNS change.
- If verification or compatibility files are missing, redeploy a corrected artifact before submitting sitemaps or requesting indexing.
- If production is materially unsafe or unusable, follow `docs/ROLLBACK.md` immediately.
