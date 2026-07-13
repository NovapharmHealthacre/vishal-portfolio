# Content publishing guide

Last reviewed: 12 July 2026

## Publishing rule

Publish only material that is useful, public-safe, sourceable and consistent with `docs/FACT_LEDGER.md` and `src/data/entity.mjs`. Owner-supplied private research is not public copy or proof of current capability and must not be retained in this repository.

Every change must preserve the distinction between:

- a verified current fact;
- verified historical experience;
- work in progress;
- a labelled roadmap intention;
- a projection;
- private, unsupported or owner-unapproved material.

If a proposed sentence would change that classification, update the fact ledger and evidence first. Do not solve uncertainty with more persuasive wording.

## Editorial voice

- Use British English.
- Write in first person for founder perspective and third person for factual/press copy.
- Prefer short, concrete sentences and explain acronyms on first use.
- Keep company registration, regulatory permission, personal experience and company capability separate.
- Avoid prestige labels such as “expert”, “visionary”, “thought leader” or “world-leading” without strong independent evidence.
- Never present planned technology, partnerships, customers, revenue or regulated activity as operational.

## Where content lives

| Content | Source |
|---|---|
| Public entity and organisation facts | `src/data/entity.mjs` |
| Navigation, route metadata and site settings | `src/data/site.mjs` |
| Essays | `src/content/thinking/*.md` |
| Maintainable prose pages | `src/content/pages/*.md` |
| Shared rendering | `src/components/` |
| Public static files | `public/` |
| Generated output | `dist/` — never edit by hand |

Changing an essay must not require editing homepage cards manually; indexes, feeds, related links, sitemap and article schema are generated from metadata.

## Essay metadata contract

Each essay requires:

- `title`
- `description`
- `summary`
- `author`
- `published`
- `modified`
- `category`
- `canonicalPath`
- `legacyPaths`
- `socialImage`
- `sources`
- `related`
- `public`

Copy the front matter of a current validated essay rather than inventing new keys. Values shown below illustrate the contract; follow the parser syntax used by the repository:

```text
---
title: "A precise, descriptive title"
description: "A unique search description that accurately reflects the essay."
summary: "A short editorial summary used by generated indexes."
author: "Vishal Chakravarty"
published: "2026-07-12"
modified: "2026-07-12"
category: "Regulated markets"
canonicalPath: "/essays/example-slug/"
legacyPaths: []
socialImage: "/images/social/example-slug.jpg"
sources: [{"label":"GOV.UK primary source", "url":"https://www.gov.uk/example-primary-source"}]
related: []
public: false
---
```

Use lowercase, stable, descriptive slugs with trailing-slash canonicals. Dates are ISO `YYYY-MM-DD`. `modified` changes only after a substantive review or correction, not for whitespace or styling. Start new work as non-public where the build supports drafts.

## Pharmaceutical editorial checklist

Before publishing or materially updating a healthcare essay:

1. Identify every factual, clinical, regulatory, market-size and timeline assertion.
2. Prefer current MHRA, GOV.UK, NHS, NICE and EMA primary sources.
3. Distinguish the author's analysis from what a source establishes.
4. Check that linked guidance is current for the jurisdiction and date discussed.
5. Remove patient-specific advice and avoid implying that editorial content is professional regulatory or medical advice.
6. Add a visible general-information disclaimer.
7. Display author, published date and last-reviewed/modified date.
8. Check units, currencies, dates, geographical scope and definitions.
9. Remove statistics whose primary methodology cannot be verified.
10. Have high-risk regulatory wording reviewed by an appropriate subject-matter owner before production.

Do not treat a secondary blog, market forecast or the company's plan as evidence of a regulatory fact.

## Claim-control checklist

- Use approved wording from the fact ledger wherever a material claim already exists.
- Place `PLANNED` or `IN_PROGRESS` status beside the visible claim.
- Exclude all `PRIVATE_DO_NOT_PUBLISH`, `UNSUPPORTED_REMOVE` and unapproved `NEEDS_OWNER_APPROVAL` material.
- Do not publish nationality, residence, passport/birth/address data, private phone numbers, signatures, immigration information, investment evidence, financial projections or confidential methodology.
- Do not name a proposed partner, customer, supplier, team member or India entity without the required current evidence and permission.
- Do not broaden structured data beyond visible text.

## Images and downloads

- Record provenance, owner/licence, permitted use, alt text and crop before adding an image.
- Never generate a synthetic likeness of Vishal without explicit approval.
- Strip avoidable EXIF and location metadata from public derivatives.
- Generate responsive AVIF and WebP with an appropriate fallback and explicit dimensions.
- Write alt text for the image's purpose; use empty alt text for decoration.
- Do not put text-only meaning inside an image.
- Do not add source DOCX/PDF evidence, contracts, private supporting documents or private research to `public/`.
- Press-kit downloads remain withheld until portrait rights and approved assets are recorded.

## Local publishing workflow

1. Update local `main` without discarding uncommitted work.
2. Create a focused content branch.
3. Add or edit the Markdown/data source, not generated HTML.
4. Update sources, related entries and social image as needed.
5. If a material fact changed, update `docs/FACT_LEDGER.md`, `src/data/entity.mjs` and the last-reviewed date together.
6. Run:

```sh
npm ci
npm run check
npm run build
npm run preview
```

7. Review the complete page on desktop and mobile, with keyboard-only navigation, reduced motion and JavaScript disabled for essential content.
8. Inspect its title, description, canonical, visible breadcrumbs, JSON-LD, sitemap entry, feed entry, sources, previous/next links and related essays.
9. Open a pull request with source evidence and a concise claim-change summary.
10. Publish only after editorial, evidence and release checks pass.

## Corrections and withdrawals

For a correction:

- change the source content and `modified` date;
- state a visible correction note when the change is material;
- update facts/schema/feed data consistently;
- retain the stable URL;
- rebuild and validate all references to the claim.

For outdated or unsafe content, prefer a transparent withdrawal/archive notice at the stable URL over an unexplained deletion. Preserve useful inbound links and use the route policy in `docs/REDIRECT_MAP.md`. Urgent privacy/legal removals require owner action and may also require search-cache handling.

## Recurring review

Review factual pages quarterly and immediately after a material company, regulatory, role or publication change. A sustainable essay cadence is one primary-source-backed article every four to six weeks; quality and evidence take priority over volume.
