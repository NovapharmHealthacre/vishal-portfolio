# Owner approvals and unresolved evidence

Owner approvals A-001, A-002, A-005 and A-019 were recorded on 13 July 2026 from the owner's explicit post-merge release instruction. Every other disputed, regulatory, customer, financial, immigration, technology-deployment or partnership claim remains unapproved and omitted.

## Required before production approval

### A-001 — Founder portrait rights

- Status: **APPROVED — 13 July 2026**.
- Owner statement: Vishal confirms that he owns or has permission to publish, crop, optimise and transform the selected founder portrait on his personal website and social cards.
- Release effect: The existing optimised derivatives and social cards may be published. This approval does not grant third-party press-kit redistribution rights beyond the website unless separately stated.

### A-002 — Contact email deliverability

- Status: **APPROVED — 13 July 2026**.
- Owner statement: `vishal@novapharmhealthcare.com` is the correct preferred public contact inbox.
- Release effect: The `.com` address may remain on the contact, privacy and footer surfaces. Delivery still requires a release-window smoke test; no alternate address is inferred.

### A-003 — Current India entity

- Issue: Source material alternates among “NovaPharm InfoTech”, “NovaPharm InfoTech & Research” and “Novapharm Innovation Technology” without a verified legal relationship.
- Needed: Current registration extract, exact legal/trading name, jurisdiction, company number and whether it is a subsidiary, associate, separate company or brand.
- Current action: Omit the entity from the public ventures page.

### A-004 — Polar Speed relationship

- Issue: Non-public evidence is insufficient and contradictory about the current relationship.
- Needed: Current signed evidence, accurate status wording and permission to name the counterparty.
- Current action: Omit the name and operational claim.

### A-005 — Pharmaceutical employment wording

- Status: **APPROVED — 13 July 2026**.
- Approved wording: “His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.”
- Release effect: Use that sentence without a job title, confidential responsibility or stronger employment/legal relationship claim.

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

- Status: **AUTHENTICATED — 13 July 2026**.
- Evidence: GitHub CLI 2.87.3 reports an active keychain session for `NovapharmHealthacre` with repository and workflow access. No token value was printed, requested or stored in the repository.
- Release effect: The reviewed hardening branch may be pushed and a draft PR may be opened. Authentication does not authorise merging or deployment.

### A-015 — GitHub Pages source switch

- Issue: Post-merge audit confirms Pages still uses legacy `main/(root)`. The intended `dist` workflow succeeded, but a later legacy Jekyll deployment superseded it.
- Needed: After every release gate passes and deployment is explicitly authorised, select **GitHub Actions** in repository Pages settings and save `vishal.novapharmhealthcare.com` as the custom domain. Existing DNS is already correct and must not be changed.
- Current action: Leave settings unchanged. Keep the hardening PR unmerged because a merge to `main` will automatically run the production workflow.

### A-016 — DNS and hosting

- No DNS, registrar ownership or hosting migration is authorised.
- Current action: Preserve `CNAME`; keep GitHub Pages-compatible build.

### A-017 — Browser, axe, Lighthouse and screenshot evidence

- Status: **PASSED — 13 July 2026**.
- Evidence: Playwright 1.61.1 completed Chromium 149, Firefox 151 and WebKit/Safari 26.5 with zero failures and 73 uniquely named screenshots. Per engine, 30 desktop checks, 29 mobile checks, 13 tablet routes, 14 axe pages, no-JavaScript, reduced-motion, canvas-unavailable, keyboard, focus, skip-link, mobile-menu and 200%/400%-reflow checks passed. Axe reported zero violations.
- Lighthouse: Three mobile cold-cache runs scored 99 Performance and 100 Accessibility, Best Practices and SEO; desktop scored 100 in all four categories. Mobile LCP was approximately 1.80 seconds, CLS 0.032 and TBT 0; desktop LCP was 0.48 seconds, CLS 0 and TBT 0.
- Safari note: Native Safari 26.5.2 WebDriver was attempted, but “Allow remote automation” is disabled and enabling it requires the owner's macOS password, which was neither requested nor captured. The matching WebKit 26.5 engine completed the full matrix.
- Evidence location: ignored local `artifacts/release-qa/`; the durable summary is `docs/POST_MERGE_RELEASE_REPORT.md`.
- Retest condition: Repeat after any source, style, asset, dependency or deployment-origin change.

### A-018 — Ordinary-browser check of the official company domain

- Status: **PASSED — 13 July 2026**.
- Evidence: An ordinary browser opened `https://novapharmhealthcare.com/` with the title “NovaPharm Healthcare | UK Pharmaceutical Distribution Strategy”, NovaPharm branding and company number 16716501. It also opened `https://www.linkedin.com/in/vishal-chakravarty` with the title “Vishal Chakravarty - Novapharm Healthcare | LinkedIn” and a current-company link to NovaPharm Healthcare.
- Release effect: Retain those exact company and LinkedIn URLs. No additional profile, location, regulatory or operational claim is approved by this identity check.
- Retest condition: Before merge and again in the production validation window.

### A-019 — Inbox privacy handling

- Status: **APPROVED — 13 July 2026**.
- Approved position: The website has no contact form, analytics or tracking. Email enquiries are sent through the visitor's email provider and processed through the owner's business email provider for reading, responding to and managing the enquiry.
- Boundary: Do not promise a specific retention period, automatic deletion, legal basis, non-disclosure or non-sharing policy unless those processes are implemented and documented.
- Retest condition: Review before adding analytics, a form, CRM, newsletter or another processor, and whenever the real inbox workflow changes.

## Explicitly not approvable through this file alone

Passport details, birth date, residential address, private phone, signatures, immigration/application status, source-of-funds evidence, investment contracts, private financial projections and confidential methodologies remain `PRIVATE_DO_NOT_PUBLISH` even if technically available in local source documents. A separate legal/privacy decision would be required to change that boundary.
