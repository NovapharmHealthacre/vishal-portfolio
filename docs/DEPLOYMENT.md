# Deployment runbook

Last reviewed: 13 July 2026
Production origin: `https://vishal.novapharmhealthcare.com/`
Target host: GitHub Pages through GitHub Actions

## Release boundary

This runbook prepares and deploys the generated `dist/` directory. It does not authorise a production release, DNS change, registrar change, hosting migration, merge to `main`, or use of a paid service.

The rebuild source was squash-merged as `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a`, but Pages still publishes `main/(root)`. Production deployment now requires the owner to approve the hardening pull request, the release window, the GitHub Pages source switch and the custom-domain setting recorded as A-015 in `docs/NEEDS_APPROVAL.md`. The generated `CNAME` and Google verification file must be preserved.

## Current and target states

| State | Pages source | Published content |
|---|---|---|
| Post-merge state audited 13 July 2026 | Legacy `main/(root)` | Branch-root Jekyll artifact from merged source; this superseded the successful `dist` deployment and the custom domain is not configured in Pages |
| Approved release target | GitHub Actions | Reviewed hardening commit's generated `dist/` artifact at `vishal.novapharmhealthcare.com` |

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
2. Confirm recorded approvals A-001, A-002, A-005 and A-019 still match the release candidate; they were owner-approved on 13 July 2026.
3. Recheck the public inbox only for deliverability during the monitored release window; do not send a message during build validation.
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

The workflow lives at `.github/workflows/deploy-pages.yml` and uses the official Pages actions. Its security-sensitive properties are:

- trigger on approved pushes to `main`, plus a manual `workflow_dispatch` recovery path;
- `contents: read`, `pages: write`, and `id-token: write` permissions only;
- a single `pages` concurrency group;
- checkout, Node setup, `npm ci`, checks and production build before upload;
- `actions/configure-pages`, `actions/upload-pages-artifact` with `path: dist`, and `actions/deploy-pages`;
- the protected `github-pages` environment and deployment URL output;
- no repository secrets, cloud tokens, analytics identifiers or external deploy service.

The audited `github-pages` environment permits only `main`, but has no required reviewer or wait timer and permits administrator bypass. Therefore a merge to `main` is the effective production authorisation once Pages is set to GitHub Actions; keep the hardening PR unmerged until the owner explicitly authorises deployment.

Actions should be pinned and updated deliberately. A Pages artifact must never be created from the repository root.

## Post-merge production switch

The initial switch must be coordinated because serving the rebuild source root directly would be incorrect.

1. Freeze changes to `main` for the release window and record the active legacy Pages deployment.
2. Confirm the hardening pull request's exact head SHA, passing checks, release evidence and the owner's explicit production authorisation.
3. In Settings → Pages, change Source from **Deploy from a branch** to **GitHub Actions**.
4. Save `vishal.novapharmhealthcare.com` as the custom domain. Do not edit DNS; the existing CNAME record is already correct.
5. Retain or enable HTTPS enforcement when GitHub makes the control available.
6. Merge only the approved hardening pull request into `main`, without force-pushing. The push will automatically run `Deploy production site`.
7. If the merge push did not start the workflow, manually dispatch `Deploy production site` on `main`. Do not dispatch it pre-emptively.
8. Confirm the successful deployment uses the reviewed `dist` artifact and that no later dynamic legacy Pages deployment supersedes it.
9. Record the workflow run URL, deployment URL and deployed commit SHA, then complete production validation before ending the release window.

If the owner cannot coordinate the source switch and hardening merge, stop. Because no environment reviewer blocks `main`, do not merge the hardening PR while Pages still publishes `main/(root)` or before production is expressly authorised.

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
