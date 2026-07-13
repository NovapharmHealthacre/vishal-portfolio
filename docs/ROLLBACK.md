# Rollback runbook

Last reviewed: 13 July 2026
Protected baseline: `1ae1ff5c43123f2c3f5be78f0e37da144f460f06`

## Purpose

Restore the last known safe site without rewriting history, changing DNS, losing the custom domain, or deleting release evidence. A rollback is an operational recovery action, not permission to reintroduce claims later classified as unsafe.

## Rollback triggers

Rollback is appropriate when production has a material failure that cannot be corrected safely within the release window, including:

- blank or inaccessible core routes;
- broken mobile navigation or keyboard access;
- missing `CNAME`, verification file or critical assets;
- widespread 404s or incorrect canonicals;
- confidential/private material in the artifact;
- an unsupported regulatory, financial, visa, customer or partnership claim;
- a severe security defect;
- a serious accessibility regression;
- a deployment that cannot be tied to the reviewed commit.

For exposed private data or credentials, begin incident containment as well as rollback. Removing a page does not invalidate caches or rotate a secret.

## Before every release

Record:

- the current production commit and Pages source setting;
- the last known good workflow run and artifact, if one exists;
- the release merge SHA;
- the exact custom domain;
- screenshots of critical routes;
- the person authorised to change Pages settings.

Never rely on an expiring Actions artifact as the only rollback copy. Git history and a reproducible build are the recovery source of truth.

## Choose the rollback path

### Path A — Routine Actions release

Use this after at least one known-good GitHub Actions release exists and the workflow remains on `main`.

1. Identify the first bad commit and the last known good commit.
2. Create a rollback branch from current `main`.
3. Revert the bad commit or merge commit; do not reset or force-push.
4. Run the full local release checks and inspect `dist/`.
5. Open an expedited pull request containing only the rollback.
6. Merge after owner/release approval.
7. Confirm the Pages workflow deploys the revert commit.
8. Perform the production validation in `docs/DEPLOYMENT.md`.

Example for a normal commit:

```sh
git switch main
git pull --ff-only
git switch -c rollback/portfolio-YYYYMMDD-HHMM
git revert <bad-commit-sha>
npm ci
npm run check
npm run build
```

For a merge commit, first confirm parent ordering, then use `git revert -m 1 <merge-sha>`. Do not guess the mainline parent.

### Path B — First migration back to branch-root Pages

Use this when the first GitHub Actions deployment is unsafe and there is no earlier known-good Actions release.

This is an owner-authorised emergency procedure only; it is not authorised by the post-merge hardening task itself.

1. Record the current `main`, the hardening release commit or merge, the active deployment and the owner's rollback authorisation.
2. Create a rollback branch from current `main`; never reset or force-push.
3. Revert the post-merge hardening change first if it has been merged. If it is a squash/normal commit, use a normal `git revert`; if it is a merge commit, inspect its parents before choosing `-m 1`.
4. Revert squash commit `a577f3a85f9f9839d5fda1dd2b8be5bdf374c40a` with a normal `git revert`—it is not a merge commit, so do not use `-m`.
5. Resolve any conflict conservatively and run the full checks. Verify the resulting root tree restores the protected baseline site and contains its homepage, legacy pages, preserved essays, `robots.txt`, `sitemap.xml`, `CNAME` and Google verification file before switching the publishing source.
6. Open and merge the reviewed rollback PR without force.
7. In Settings → Pages, the owner selects **Deploy from a branch**, branch `main`, folder `/(root)`.
8. Save or preserve `vishal.novapharmhealthcare.com` as the custom domain, keep HTTPS enforcement and do not edit DNS.
9. Wait for the legacy Pages deployment, then validate production.

The original static baseline contains known content-quality issues. Path B is an emergency availability restoration only. Reapply the safe claim removals in a follow-up release as soon as practical.

## Emergency private-content response

If a public artifact includes private documents, credentials, passport/birth/address data, immigration material, signatures or private financial evidence:

1. Roll back or replace the public deployment immediately.
2. Preserve a private incident record; do not paste the exposed material into a public issue.
3. Invalidate or rotate any exposed credential through its provider.
4. Assess Git history, Actions artifacts, caches and search indexing separately.
5. Request history rewriting, cache removal or legal/privacy action only with owner and appropriate specialist approval.

Do not use `git reset --hard`, `git clean`, forced pushes or ad-hoc deletion as incident response.

## Validation after rollback

Confirm:

- production serves the intended rollback commit;
- HTTPS and the custom domain still work;
- `/CNAME` is not the validation target—the repository/output file is; the visible site origin must remain correct;
- the Google verification path remains available;
- primary and legacy routes return useful HTML;
- sitemap and robots policy match the restored version;
- no private artifact remains linked or discoverable from the site;
- Search Console is not asked to index the failed release;
- the incident and follow-up owner are recorded.

## Roll-forward preference

When the defect is small, fully understood and no sensitive data is exposed, a narrowly scoped fix and new Actions deployment may be safer than reverting a large release. The fix still requires the same checks and claim controls. “Roll forward” is not permission to bypass owner approval or keep production in a partially broken state.

## Prohibited rollback actions

- Do not change DNS, registrar ownership or the production hostname.
- Do not force-push or rewrite shared branch history.
- Do not delete the original checkout or release evidence.
- Do not deploy an unreviewed local `dist/` from a personal machine.
- Do not restore unsupported claims merely because they existed at the baseline.
- Do not disable security, accessibility or claim-validation checks to make a deployment pass.

## Post-rollback review

Within the next working cycle, document the trigger, impact, timeline, deployed SHAs, recovery path, verification evidence and preventive action. Add a regression test when practical before attempting the release again.
