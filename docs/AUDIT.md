# Phase 0 audit

Audit date: 12 July 2026
Repository baseline: `1ae1ff5c43123f2c3f5be78f0e37da144f460f06`
Production origin: `https://vishal.novapharmhealthcare.com`
Working branch: `rebuild/world-class-portfolio`

## Executive finding

The repository is a small, hand-authored static website deployed directly from the root of `main` on GitHub Pages. It contains valuable first-person writing and one authentic founder portrait, but its public claims, entity data, mobile navigation, image metadata and publishing workflow are not release-safe.

The highest-risk defect is factual rather than visual: the site currently presents planned or unverified regulated capabilities as achieved. It describes NovaPharm as an MHRA-compliant or licensed wholesaler, implies GDP infrastructure and NHS service, uses a wrong 2024 founding date, links unsupported identity profiles, and publishes hidden FAQ/schema copy that repeats those claims. Those statements must not survive the rebuild.

## Repository location and preservation

- Actual checkout located by remote: `/Users/vishalchakravarty/Documents/Novapharm InfoTech/vishal-portfolio-main`.
- `origin`: `https://github.com/NovapharmHealthacre/vishal-portfolio.git` for fetch and push.
- Original checkout was clean: `main...origin/main`, no untracked files, ignored `.DS_Store` only.
- Local `main`, locally recorded `origin/main`, and the GitHub connector all identify `1ae1ff5` as the remote default-branch head.
- The current task workspace was an unrelated, unborn repository and was not modified.
- Because the source checkout is outside the session's writable roots, a history-preserving working copy was made at `vishal-portfolio-rebuild` inside the authorised workspace.
- No stash or patch was necessary because there was no uncommitted work.

## Commands inspected

The audit included:

```text
git status --short --branch
git branch --show-current
git remote -v
git log --oneline --decorate -30
git ls-files
git ls-files --others --exclude-standard
git ls-files --others --ignored --exclude-standard
git branch -avv
git worktree list --porcelain
git log --all --name-status
git count-objects -vH
```

Shell access to GitHub and DNS was blocked by the managed network sandbox. The GitHub connector independently verified the remote head. GitHub CLI is installed, but its stored `NovapharmHealthacre` token is invalid.

## Deployment and drift

### Current architecture

- Hosting is consistent with GitHub Pages using `main` and the repository root.
- Evidence: root `CNAME`, no active deployment workflow, no build configuration, the `github.io` project URL redirecting to the custom domain, and production homepage copy matching `index.html` at `1ae1ff5`.
- A historical Azure Static Web Apps workflow was introduced at `f5b6788` on 1 January 2026 and removed at `ffa3b02` on 10 February 2026.
- `CNAME` was added at `750502b` on 10 February 2026.
- Exact GitHub Pages Settings UI state and DNS records could not be read under the sandbox. No DNS change was attempted.

### Why production looked different from older local copies

Multiple non-Git copies exist in Documents and OneDrive. They are stale exports and lack the full Git checkout. The authoritative checkout and remote `main` match at `1ae1ff5`; production matches that March 2026 rebuild, not the older exports. The apparent drift is therefore local-copy drift, not an unexplained production deployment.

### Preserved release assets

- Custom domain: `vishal.novapharmhealthcare.com`
- Google verification file: `googlef9cdfdd63c360d56.html`
- Existing essay URLs
- Existing root HTML URLs, to be preserved through static compatibility pages

## Tracked-file inventory

- 18 tracked paths, of which 10 are content pages, 4 are essay pages, 2 are image assets, and 2 are crawler/domain configuration files.
- `FETCH_HEAD` is incorrectly tracked and empty.
- No package manifest, lockfile, tests, shared component system, source content model, or active workflow exists.
- Details and disposition for every tracked path are in `docs/FILE_MANIFEST.md`.

## Content and claim audit

### Confirmed public facts

- Companies House identifies NOVAPHARM HEALTHCARE LTD, company number 16716501, as an active private limited company incorporated on 15 September 2025.
- Current Companies House SIC entries are 21100 and 46460. SIC codes describe a filing category, not proof of regulatory authorisation or current operations.
- Companies House and public Yakuji Nippo author pages support Vishal Chakravarty as Founder & CEO.
- Yakuji Nippo has published three instalments of Vishal's UK-EU market-access series in English and Japanese as of the audit date.
- The Yakuji author profile and verified first-party LinkedIn search result use `novapharmhealthcare.com` and the `.com` email.
- Authoritative non-public evidence, which is not retained in this repository, places Vishal's pharmaceutical work with SyriMed in 2020-2025, so a “no pharmaceutical background” origin story is contradicted.

### Claims that fail the publication threshold

- No NovaPharm entry was found in the official MHRA public authorisation search. No current public evidence supports a wholesale-authorisation or operational wholesale-supply claim.
- No evidence proves NovaPharm currently supplies NHS trusts, pharmacies or wholesalers.
- No evidence proves current GDP certification, deployed B2B technology, AI forecasting, blockchain traceability, automated adverse-event integration, operational revenue, customer count, jobs or break-even.
- No evidence proves the current legal or operational status of the proposed Polar Speed relationship.
- “Investor”, “advisor”, “host”, podcast, speaking and board-engagement claims are unsupported as current identity labels.
- Existing Wikipedia URL returned no verified matching article. Existing Wikidata `Q130325741` conflicts with the public result `Q137660690`; neither is suitable as independent evidence, and no Wikidata link will be published pending owner confirmation and cleanup.
- Existing GitHub, Instagram, YouTube, X and Crunchbase URLs were not established as owned, current profiles of this Vishal and are excluded from `sameAs`.

See `docs/FACT_LEDGER.md` for the controlled claim list.

## Private research boundary

Authoritative private research was reviewed outside the repository and was not copied into the working tree. It is used only to reject or narrow stronger public claims. The repository does not record private legal or administrative outcomes, personal identifiers, supporting evidence, financial evidence, signatures or confidential commercial detail.

Owner-supplied plans and projections are strategy inputs, not proof that planned products, partnerships, licences or systems exist.

## Link audit

### Internal

- Existing page-to-page links generally resolve within the static repository.
- The Swiggy essay is physically located at `/essays/why-i-left-swiggy/` but declares `/essays/from-swiggy-to-mhra/` as canonical, producing a canonical/URL mismatch.
- Some essay links omit trailing slashes inconsistently.
- Legacy `.html` pages are indexed and must remain functional.
- There is no 404 page.

### External

- The site mixes `novapharmhealthcare.co.uk`, `novapharmhealthcare.com`, `.co.uk` and `.com` email addresses.
- Unsupported or mismatched profile links include Wikipedia, two different Wikidata entities, Crunchbase, GitHub, Instagram, YouTube and X.
- LinkedIn slugs vary between `vishalchakravarty` and `vishal-chakravarty`; public evidence supports the hyphenated form.
- Existing essays rely partly on secondary market-statistics and startup blogs. Pharmaceutical factual assertions must be reviewed against primary MHRA, GOV.UK, NHS, NICE or EMA sources before republication.

The release recheck on 13 July 2026 directly reached Companies House, all six Yakuji pages and all five GOV.UK sources. LinkedIn identity was confirmed through its current indexed result. The NovaPharm domain was corroborated by Yakuji and LinkedIn but its direct fetch was rejected by the managed web client's URL-safety layer. See `docs/EXTERNAL_LINK_AUDIT.md`; repeat those two ordinary-browser checks before production.

## Image audit

| Asset | Dimensions | Format | Current purpose | Finding | Disposition |
|---|---:|---|---|---|---|
| `images/vishal-headshot.jpg` | 1796×1749 | JPEG, sRGB | Founder portrait and social metadata | Authentic-looking supplied photograph; includes Canon model, editing-software and timestamp EXIF; near-square but not responsive; licensing/owner consent should be confirmed. | Preserve privately, strip metadata, create responsive AVIF/WebP/JPEG variants; use as portrait only. |
| `essays/regulated-industries/comparison_chart.png` | 2400×1600 | PNG RGBA | Regulatory comparison figure | Large raster with unsupported cost/time assertions; current essay does not render it as an `<img>`. | Remove from the branch; Git history preserves the original if a fully sourced replacement is later justified. |

The HTML references 12 missing essay social/hero image files (`*-og.jpg`, `*-twitter.jpg`, and hero JPGs). These cause broken social previews. No synthetic founder imagery will be generated.

## Analytics and third parties

- No active Google Analytics tag is present in the current tracked HTML despite historical commit messaging and dormant `dns-prefetch` references.
- A Plausible script exists only inside an HTML comment and is inactive.
- Google Fonts is loaded on every content page, adding a render-blocking third-party dependency and privacy/performance surface.
- No cookie banner is warranted because no non-essential cookies or tracking will ship.
- The rebuild will use system/open-source local font fallbacks and no third-party runtime scripts.

## SEO and structured-data audit

- Positive: canonical tags, titles, descriptions, `lang`, basic sitemap and Google verification exist.
- Critical: schema is manually duplicated across pages and contradicts visible/current evidence.
- Critical: hidden FAQ microdata is used as SEO text and repeats unsupported claims.
- Critical: `nationality` is wrong in current Person schema and unnecessary.
- Critical: Organization schema uses a 2024 founding date instead of 15 September 2025.
- Critical: `sameAs` contains unverified and incorrect profiles.
- `ScholarlyArticle` is inappropriate for self-authored editorial work.
- Japanese `hreflang` points to English content and must be removed.
- Sitemap uses unhelpful `priority` and `changefreq`, and its `lastmod` values are hand-authored rather than generated from content dates.
- `robots.txt` blocks the Google verification file, adds unsupported `Crawl-delay` rules for Googlebot, and uses an obsolete Anthropic agent while failing to distinguish AI search from training.

## Accessibility and resilient-navigation audit

- Existing pages generally have one H1 and semantic text in server-delivered HTML.
- No skip link is present.
- At widths below 900px/768px, primary navigation is hidden with no replacement mobile menu. This is a release-blocking accessibility and usability failure.
- No `aria-expanded`/`aria-controls` mobile-navigation implementation exists.
- Focus treatment is inconsistent and colour tokens were not tested against WCAG 2.2 AA.
- Many decorative emoji are used as visual icons.
- There is no reduced-motion policy because the current site has little motion.
- The no-JavaScript reading experience is currently viable; the rebuild must preserve that quality.

## Performance audit

- The current site has minimal JavaScript, but every page duplicates 40-70 KB of inline HTML/CSS and multiple JSON-LD blocks.
- The remote font dependency and oversized JPEG are the primary critical-path costs.
- Missing social imagery, duplicated inline CSS and uncompressed source images indicate no asset pipeline.
- No build-time performance budget or Lighthouse CI exists.

## Security and privacy audit

- No current secrets were found.
- Historical Azure workflow contains GitHub secret references but no literal secret values in Git history.
- The founder portrait exposes avoidable EXIF metadata.
- Existing public copy exposes unnecessary location assertions and full-name variants.
- Contact uses direct `mailto:` and no server-side form, so there is no form-data processor to secure.
- No CSP or security header mechanism exists on GitHub Pages; a conservative meta CSP is possible, while stronger response headers would require a different host.

## Phase 0 release decision

Proceed with a full content and architecture rebuild on the isolated branch. Keep the custom domain, verification file, verified founder portrait and valuable essay URLs. Remove duplicated hand-coded pages, unsupported entity claims, hidden FAQ schema, external runtime tracking, broken profile links and tracked `FETCH_HEAD`.

No production deployment, DNS mutation, merge or deletion of the original checkout is authorised by this audit.

## Primary external evidence

- Companies House: https://find-and-update.company-information.service.gov.uk/company/16716501
- MHRA register: https://cms.mhra.gov.uk/
- Yakuji Nippo first instalment and author profile: https://www.yakuji.co.jp/entry129530.html
- Production homepage: https://vishal.novapharmhealthcare.com/
- Repository: https://github.com/NovapharmHealthacre/vishal-portfolio
