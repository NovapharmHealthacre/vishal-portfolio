# Owner approvals and unresolved evidence

The build continues autonomously with conservative omissions. Items below are not blockers for a safe preview, but they must not be published as affirmative facts without the named approval/evidence.

## Required before production approval

### A-001 — Founder portrait rights

- Issue: The repository contains an authentic portrait, but the site has no explicit rights/consent record.
- Needed: Confirm Vishal owns or is licensed to publish and transform the photograph on the personal site, facts page and social cards.
- Current action: Optimised derivatives may be created in the branch; press-kit download remains withheld.

### A-002 — Contact email deliverability

- Issue: The public Yakuji author profile supports `vishal@novapharmhealthcare.com`, but deliverability cannot be tested safely.
- Needed: Owner confirms it is the preferred public inbox.
- Current action: Use the independently published `.com` address and record this release check.

### A-003 — Current India entity

- Issue: Source material alternates among “NovaPharm InfoTech”, “NovaPharm InfoTech & Research” and “Novapharm Innovation Technology” without a verified legal relationship.
- Needed: Current registration extract, exact legal/trading name, jurisdiction, company number and whether it is a subsidiary, associate, separate company or brand.
- Current action: Omit the entity from the public ventures page.

### A-004 — Polar Speed relationship

- Issue: Non-public evidence is insufficient and contradictory about the current relationship.
- Needed: Current signed evidence, accurate status wording and permission to name the counterparty.
- Current action: Omit the name and operational claim.

### A-005 — Pharmaceutical employment wording

- Issue: Authoritative private evidence supports work with SyriMed from 2020 to 2025 but does not support a public title or more specific relationship label.
- Needed: Owner confirms the relationship and preferred public wording, ideally with employment evidence.
- Current action: Use only “work with SyriMed between 2020 and 2025” and no title.

## Optional identity approvals

### A-006 — Official profiles

- Needed: Owner confirms exact current URLs for X, Instagram, YouTube, GitHub and Crunchbase.
- Current action: Exclude all except verified LinkedIn from links and `sameAs`.

### A-007 — Wikidata conflict

- Issue: Existing site uses `Q130325741`; current public search finds `Q137660690`, which contains unsupported labels and circular sources.
- Needed: Owner identifies any item they control or recognise, then follows Wikidata sourcing/community rules to correct or merge it.
- Current action: Exclude Wikidata. Do not create or edit Wikipedia as an SEO tactic.

### A-008 — Current residence/location wording

- Needed: Explicit approval only if location is genuinely useful. Evidence must be current.
- Current action: Use “founder of a UK-registered company”, never “UK-based founder”.

### A-009 — Longer professional biography

- Needed: Approved chronology, roles, education and milestones with source evidence.
- Current action: Publish the conservative 40- and 100-word bios only.

### A-010 — Speaking, podcast, investor and advisor history

- Needed: Public event pages, programme listings, episode URLs, investment records or board/engagement evidence.
- Current action: Present speaking and partnerships only as future enquiry topics; omit investor/advisor/host labels.

## Regulatory approvals

### A-011 — MHRA status

- Issue: No NovaPharm public authorisation was found, and no current public operating evidence supports this claim.
- Needed: Current official MHRA record and authorisation number before any “licensed”, “authorised”, “GDP compliant/certified”, wholesale-supply or PLPI-holder wording.
- Current action: Explicitly separate company registration from regulatory permission and publish no licence claim.

### A-012 — NHS, customer and supplier relationships

- Needed: Current contract or authoritative public evidence plus counterparty naming permission.
- Current action: No customer logos, NHS-service claim, supplier count or operational distribution claim.

### A-013 — Technology deployment

- Needed: Operational evidence and legal/regulatory review for B2B platform, AI forecasting, blockchain traceability or pharmacovigilance integrations.
- Current action: Use high-level `Roadmap` labels only where useful; publish no architecture or methodology.

## Release and account approvals

### A-014 — GitHub authentication

- Issue: GitHub CLI is installed but its stored `NovapharmHealthacre` token is invalid.
- Needed: Owner re-authenticates with `gh auth login -h github.com`, or pushes the branch through their normal Git client.
- Current action: Build, test and commit locally. Do not request or store a token.

### A-015 — GitHub Pages source switch

- Issue: The rebuild requires GitHub Actions to publish `dist/` rather than serving source files directly from `main/(root)`.
- Needed: Owner reviews the draft PR, then selects GitHub Actions in repository Pages settings during an approved deployment window.
- Current action: Provide workflow and rollback instructions; do not change production settings.

### A-016 — DNS and hosting

- No DNS, registrar ownership or hosting migration is authorised.
- Current action: Preserve `CNAME`; keep GitHub Pages-compatible build.

### A-017 — Browser, axe, Lighthouse and screenshot evidence

- Issue: The managed build environment has no installed browser binaries, cannot download them, and rejects local loopback listeners. The in-app browser also blocks local `file:` pages. Playwright route/interaction tests, axe, Lighthouse and representative page screenshots therefore could not be completed here.
- Needed: Run the documented browser matrix in a network-enabled release environment against the exact candidate commit; retain desktop/mobile screenshots, axe output, Lighthouse JSON/HTML and manual keyboard/Safari notes.
- Current action: Deterministic static gates pass, but production release remains blocked. Do not treat the static accessibility or size checks as substitutes for browser evidence.
- Owner: Release owner or engineer running the approved preview environment.
- Retest condition: Before merge; repeat after any source, style, asset or dependency change. Target date is the owner-selected release window.

### A-018 — Ordinary-browser check of the official company domain

- Issue: The `.com` company domain is independently corroborated by Yakuji Nippo and the verified LinkedIn result, but the managed web client's URL-safety layer rejected a direct fetch. LinkedIn also needs a final ordinary-browser identity check.
- Needed: Open `https://novapharmhealthcare.com/` and `https://www.linkedin.com/in/vishal-chakravarty` in an ordinary browser, confirm the correct company/person identity and record the final URLs/status before release.
- Current action: Retain the corroborated `.com` link in the candidate, but do not release until this direct check and the public-inbox check in A-002 are complete.
- Owner: Vishal or the NovaPharm domain administrator.
- Retest condition: Before merge and again in the production validation window.

### A-019 — Inbox privacy handling

- Issue: The static site can describe its own no-form/no-tracking mechanics, but it cannot prove how external email or LinkedIn enquiries are retained, disclosed or deleted.
- Needed: Owner approves an operational privacy position before adding retention, legal-basis, non-sale or disclosure commitments to the public notice.
- Current action: The candidate notice is limited to verified website mechanics and sends no sensitive-data handling promise.
- Owner: Vishal or the designated privacy owner.
- Retest condition: Before production and before any analytics, form, CRM, newsletter or additional processor is introduced.

## Explicitly not approvable through this file alone

Passport details, birth date, residential address, private phone, signatures, immigration/application status, source-of-funds evidence, investment contracts, private financial projections and confidential methodologies remain `PRIVATE_DO_NOT_PUBLISH` even if technically available in local source documents. A separate legal/privacy decision would be required to change that boundary.
