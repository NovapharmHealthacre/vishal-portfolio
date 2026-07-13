# Security and privacy guide

Last reviewed: 12 July 2026

## Security posture

The site is a generated static publication with no server runtime, database, account system, contact-form processor, analytics or non-essential cookies. Its principal risks are content/privacy disclosure, supply-chain compromise, unsafe generated HTML, over-broad deployment permissions and inaccurate regulated-market claims.

Security controls do not make unsupported claims safe. The fact ledger and owner-approval boundary remain mandatory.

## Data classification

### Public-safe only after review

- approved founder and company wording from `docs/FACT_LEDGER.md`;
- verified public registry facts;
- approved original essays and cited public sources;
- verified profile/publication URLs;
- licensed, metadata-stripped public imagery.

### Never publish through this project

- passport, birth date, residential address, private phone or signatures;
- private legal, administrative, residence or work-status evidence;
- source-of-funds material, contracts, investment evidence or private forecasts;
- supplier databases, pricing systems, algorithms, model details, smart-contract logic, sourcing methods or regulatory templates;
- unapproved team, customer, supplier or partner identities;
- source DOCX/PDF research documents.

`robots.txt`, `noindex` and unlinked URLs are not access controls. Prohibited material must never enter the repository, Actions artifact or `dist/`.

## Secrets

- The current architecture requires no runtime secret or environment variable.
- Never commit tokens, private keys, passwords, analytics credentials or verification values not already deliberately public.
- `.env` files remain ignored. `.env.example`, if retained, contains names/placeholders only.
- GitHub Pages uses the workflow-provided `GITHUB_TOKEN` and OIDC with minimal permissions; no cloud deployment token is required.
- The historical Azure workflow references a secret name but the audit found no literal secret value.
- If a secret is exposed, rotate it at the provider immediately. Removing it from the latest commit is not sufficient.

Do not ask the owner to paste credentials into an issue, pull request, chat transcript or repository file.

## Build and dependency controls

- Use the declared Node 22+ version and committed lockfile.
- Install with `npm ci`, not an unrecorded global package set.
- Keep the production generator dependency-free unless a reviewed need justifies a change.
- Review lockfile and workflow changes as security-sensitive.
- Use official GitHub Pages actions with minimal permissions and deliberate version updates.
- Build on GitHub-hosted runners unless an owner-approved threat assessment changes that decision.
- Upload only `dist/`; never upload the repository root.
- Generated output must be reproducible from a clean clone.

## Generated HTML controls

- Escape Markdown and data before applying the small allowlisted renderer.
- Do not permit arbitrary raw HTML, inline event handlers, `javascript:` URLs or unvalidated embeds.
- Validate all outbound URL schemes; public content should use `https:`, relative URLs or deliberate `mailto:` links.
- Add `rel="noopener noreferrer"` when opening an external link in a new tab.
- Keep critical content in server-generated semantic HTML.
- Generate JSON-LD with safe serialisation rather than string concatenation.
- Validate that structured data is no broader than visible, public-safe copy.

## Content Security Policy

GitHub Pages cannot configure the full desired response-header set. The generated pages may use a restrictive meta CSP for directives supported in a meta element, built around:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
script-src 'self';
style-src 'self';
img-src 'self' data:;
font-src 'self';
connect-src 'none';
frame-src 'none';
form-action 'none';
upgrade-insecure-requests
```

Do not add `'unsafe-inline'` casually. If implementation constraints require a CSP exception, document the exact source and remove it when possible.

`frame-ancestors` and several reporting/header protections are not enforced through meta CSP. A future owner-approved host can add response headers such as CSP with `frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and HSTS after testing. Do not claim GitHub Pages sends headers that were not verified.

## GitHub Actions permissions

The Pages workflow requires only:

```text
contents: read
pages: write
id-token: write
```

Use the protected `github-pages` environment and a single deployment concurrency group. Do not grant repository write, pull-request write, packages, issues or broad organisation permissions to the deploy job.

## Privacy posture

- No analytics or advertising scripts ship.
- No non-essential cookies ship; therefore no cosmetic cookie banner is needed.
- Contact is a direct `mailto:` link and verified LinkedIn link; the site does not receive form submissions.
- The privacy page must describe actual collection, including normal GitHub Pages/network logs without pretending the site owner controls GitHub's retention.
- Public portrait derivatives must have unnecessary EXIF removed and rights confirmed before release.
- Do not use hidden tracking parameters in contact or external links.

Adding analytics, a form provider, CAPTCHA, embedded media, a CMS or a paid service requires a new privacy/security review and, where applicable, owner approval.

## Release security checks

Before deployment:

1. Run `npm ci`, `npm run check` and `npm run build` from a clean clone or equivalent clean tree.
2. Review every changed workflow, lockfile, generator, Markdown renderer and central entity-data line.
3. Confirm `dist/` contains no private source document, environment file, Git path, editor backup or unexpected archive.
4. Run the forbidden-claim/private-pattern scanner against rendered output.
5. Confirm no secret-like values or private URLs appear in source, history added by the branch, logs or source maps.
6. Confirm public files are limited to intended routes/assets and the preserved ownership/CNAME files.
7. Confirm external links use secure schemes and new-tab protection.
8. Confirm CSP and no-JavaScript behaviour on representative pages.
9. Confirm the workflow artifact path is exactly `dist/`.
10. Record exceptions in the pull request; do not silently weaken a control.

Useful artifact inspection commands include:

```sh
find dist -type f -print | sort
find dist -type f \( -name '*.docx' -o -name '*.pdf' -o -name '.env*' -o -name '*.key' -o -name '*.pem' \) -print
```

The second command must return no files unless a specific public PDF was separately approved, licensed and reviewed. No such PDF is approved in the Phase 0 baseline.

## Vulnerability reporting and incident response

Use a private GitHub Security Advisory if enabled, or contact the owner through an already verified private channel. Do not open a public issue containing an exploit, credential, personal data or confidential document.

For an incident:

1. contain the public deployment using `docs/ROLLBACK.md`;
2. rotate exposed credentials at their providers;
3. preserve private evidence and timestamps;
4. assess repository history, Actions artifacts, caches and indexes;
5. notify affected owners through appropriate private/legal channels;
6. add a regression test and document the resolution.

History rewriting, cache-removal requests, legal notices and user notifications require owner and specialist judgement; do not improvise them as ordinary Git cleanup.
