# SEO branch file-change summary

Reviewed: 14 July 2026
Base commit: `cd3d2ad09c63bb6bf4b9fb002aed4e784880b76f`
Branch: `seo/post-launch-authority`

## Runtime and generated-output sources

- `src/data/entity.mjs` — canonical Person, personal WebSite, ProfilePage and corporate Organization identifiers; approved job title and entity contract.
- `src/data/site.mjs` — material route modification dates and metadata source.
- `src/lib/schema.mjs` — coherent Personal, WebSite, ProfilePage, Organization, Blog and BlogPosting graph.
- `scripts/build.mjs` — truthful sitemap dates and public facts schema version 2.
- `public/robots.txt` — documented search/retrieval/training crawler policy.
- `public/llms.txt` — supplemental entity navigation with canonical identifiers.
- `package.json` — adds the SEO-authority release gate.

## Tests and release controls

- `scripts/check-routes.mjs`
- `scripts/check-schema.mjs`
- `scripts/check-seo-authority.mjs`
- `tests/unit/entity.test.mjs`
- `tests/unit/output.test.mjs`

These validate canonical identities, publisher/author relationships, public facts, sitemap URLs and material dates, crawler policy, no tracking, no private office documents and no legacy competing company identifier.

## Governance and technical records

- `docs/FACT_LEDGER.md`
- `docs/POST_LAUNCH_SEO_SUMMARY.md`
- `docs/SEO_SOURCE_REGISTER.md`
- `docs/TECHNICAL_SEO_AUDIT.md`
- `docs/BEFORE_AFTER_VALIDATION.md`
- `docs/ACCEPTANCE_REPORT.md`
- `docs/PERFORMANCE_ACCESSIBILITY_REGRESSION.md`
- `docs/UNVERIFIABLE_ITEMS.md`
- `docs/REMAINING_OWNER_ACTIONS.md`
- `docs/DELIVERABLES_INDEX.md`
- `docs/ACTIONS_RUNTIME_AUDIT.md`

## Entity and structured-data records

- `docs/ENTITY_REGISTER.md`
- `docs/CROSS_SITE_ENTITY_CONTRACT.md`
- `docs/COMPANY_SITE_HANDOFF.md`
- `docs/STRUCTURED_DATA_REGISTER.md`
- `docs/STRUCTURED_DATA_VALIDATION.md`
- `docs/EXTERNAL_ENTITY_CONSISTENCY.md`
- `docs/KNOWLEDGE_PANEL_READINESS.md`

## Crawl, metadata and search-management records

- `docs/SEARCH_VISIBILITY_BASELINE.md`
- `docs/METADATA_REGISTER.md`
- `docs/URL_INDEXABILITY_REGISTER.md`
- `docs/CRAWLER_POLICY_REGISTER.md`
- `docs/SITEMAP_AND_FEEDS_REPORT.md`
- `docs/INDEXNOW_DECISION.md`
- `docs/SEARCH_CONSOLE_AND_BING_ACTIONS.md`
- `docs/SEO_MONITORING_PLAN.md`

## Editorial and authority records

- `docs/CONTENT_AUTHORITY_STRATEGY.md`
- `docs/EDITORIAL_CALENDAR_90_DAYS.md`
- `docs/CONTENT_ROADMAP_12_MONTHS.md`
- `docs/EXISTING_ESSAY_AUDIT.md`
- `docs/EDITORIAL_POLICY.md`
- `docs/INTERNAL_LINKING_MAP.md`
- `docs/OFFSITE_AUTHORITY_PLAN.md`
- `docs/LINKEDIN_DISTRIBUTION_SYSTEM.md`
- `docs/BACKLINK_AND_MENTION_BASELINE.md`
- `docs/MEASUREMENT_SPECIFICATION.md`

## Deliberately unchanged

- CSS and visual components
- founder portrait and social images
- browser JavaScript and canvas animation
- article body text and article modification dates
- DNS, GitHub Pages configuration and production deployment
- Google verification file and CNAME
- no-tracking privacy position

## Separate maintenance scope

Workflow runtime upgrades are not part of this branch. They are isolated in draft PR #4 on `maintenance/actions-runtime`.
