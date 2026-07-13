# Claim audit summary

Audit date: 12 July 2026
Control source: `docs/FACT_LEDGER.md`
Public-data implementation target: `src/data/entity.mjs`

## Decision

The rebuild may publish a narrow founder identity, verified company-registration facts, one verified professional profile and verified publication evidence. It may describe selected business concepts only as plans or roadmap work. It must not publish immigration, private personal/financial data, unverified regulated status, customers, operational partnerships, deployed technology, prestige labels or ambiguous identity profiles.

Owner-supplied private research is not retained in this repository. It is not a public asset and does not prove that projected capabilities or outcomes exist.

## Ledger snapshot

The ledger contains 40 material claims.

| Status | Count | Release treatment |
|---|---:|---|
| `VERIFIED_CURRENT` | 14 | May be published using approved wording and central data. |
| `VERIFIED_HISTORICAL` | 1 | May be published conservatively, without an invented role or title. |
| `IN_PROGRESS` | 1 | May be published only with precise current count/status and visible labelling. |
| `PLANNED` | 5 | May be published only as roadmap/plan language with an adjacent label. |
| `PROJECTION` | 0 | None approved for publication. |
| `PRIVATE_DO_NOT_PUBLISH` | 4 | Exclude from source, metadata, schema, feeds, social assets and `dist/`. |
| `UNSUPPORTED_REMOVE` | 10 | Remove from all outputs. |
| `NEEDS_OWNER_APPROVAL` | 5 | Omit unless the ledger is updated with dated evidence and approval. |

Release grouping:

- 15 verified current/historical claims are eligible for conservative publication.
- 6 in-progress/planned claims are conditional and must carry visible status language.
- 19 private, unsupported or unapproved claims must remain absent.

## Approved public entity foundation

| Claim IDs | Approved fact or wording boundary | Main uses |
|---|---|---|
| P-001, P-002 | `Vishal Chakravarty` and `Founder & CEO, NovaPharm Healthcare Ltd`. | Home, about, facts, metadata, Person schema |
| P-008 | `His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.` No title or confidential responsibility. | About, facts, carefully revised essay note |
| P-011 | Availability for selected future speaking and partnership conversations. This is not evidence of past engagements. | Speaking/partnerships, contact |
| P-012 | Verified LinkedIn URL only. | Footer, contact, Person `sameAs` |
| C-001 to C-004 | NovaPharm legal name, company number, active UK registration and incorporation on 15 September 2025. | Ventures, facts, Organization schema |
| C-005 | Companies House records SIC codes 21100 and 46460. The statement must explain that SIC filing is not authorisation or proof of operations. | Facts only |
| C-006, C-007 | `.com` company domain and public founder email. Email deliverability remains an owner release check. | Ventures, facts, contact |
| M-001 | Verified Yakuji Nippo contributor role with restrained description. | Home, about, media |
| E-001, E-002 | Canonical personal origin and the approved founder/operator role description. | All shared metadata and entity copy |

## Conditional public claims

| Claim IDs | Required wording/status | Prohibited escalation |
|---|---|---|
| M-002 | `Three instalments of a planned four-part series are published in English and Japanese.` Label/current date must remain visible. | Do not say the four-part series is complete until a fourth publisher URL exists. |
| C-011 | `Its current plan focuses on oncology and specialty-medicine access.` | Do not imply a launched portfolio, stocked products, customers or supply capability. |
| C-012 | `A digital B2B workflow is part of the company's product roadmap.` | Do not say platform, portal or marketplace is live or in customer use. |
| C-013 | `Forecasting support is being explored as part of the roadmap.` | No deployed AI, performance percentage, model, data or algorithm claim. |
| C-014 | `Traceability tooling is being explored as part of the roadmap.` | No deployed blockchain, anti-counterfeiting result or architecture detail. |
| C-015 | Omit automated adverse-event integration until operating evidence and regulatory review exist. | No pharmacovigilance integration or automated safety capability. |

Although C-015 is classified `PLANNED`, its approved wording is omission. The public data source must not expose it.

## Corrections and removals

| Existing or proposed claim | Decision | Safe replacement |
|---|---|---|
| UK nationality | Remove; contradicted and unnecessary. | Omit nationality. |
| Correct nationality value | Private; do not publish merely to correct the old schema. | Omit nationality. |
| UK-based founder or UK residence | Unverified, time-sensitive and unnecessary. | `Founder of a UK-registered company.` |
| Company founded in 2024 | Incorrect. | `Incorporated on 15 September 2025.` |
| `.co.uk` domain or founder email | Inconsistent with verified evidence. | Use verified `.com` values only; owner confirms inbox before production. |
| No pharmaceutical background before NovaPharm | Contradicted by 2020-2025 source evidence. | Use the approved conservative SyriMed sentence; no title. |
| MHRA-licensed/approved wholesaler or PLPI holder | No official authorisation evidence. | Explicitly separate company registration from regulatory permission. |
| GDP-certified infrastructure | No certificate evidence. | `Developing a compliance-led operating model`; permissions and qualified parties remain prerequisites. |
| Serving NHS trusts, pharmacies or wholesalers | No customer or contract evidence. | Omit. |
| Operational Polar Speed relationship | Non-public evidence is insufficient and contradictory. | Omit name/status pending current signed evidence and permission. |
| India subsidiary/entity | Names and legal relationship conflict. | Omit pending verified registration and relationship. |
| Current proposed executives/advisers | Source documents use proposed/future wording. | Omit pending appointment evidence and consent. |
| Deployed B2B, AI, blockchain or adverse-event systems | Plans are not operational evidence. | Use only the conditional roadmap wording above; omit adverse-event integration. |
| Revenue, investment, jobs, margins, customers or break-even | Private projections, not achievements. | Omit. |
| Investor, advisor or podcast host | No verified current activity. | Omit. |
| Expert, visionary, thought leader, leading, first or unique | Unsupported prestige/competitive claims. | Use the approved founder/operator description. |
| Wikipedia/Wikidata identity | No reliable matching article; conflicting QIDs. | Omit. |
| GitHub, X, Instagram, YouTube or Crunchbase identity | Ownership not established. | Omit until individually verified. |
| Fully published four-part Yakuji series | Only three instalments verified at audit date. | Use the exact in-progress sentence. |

## Private exclusion boundary

The following must not be committed, rendered, logged in snapshots or copied into public/machine-readable files:

- Full legal-name expansion beyond the approved professional name.
- Birth, passport, residential-address, private-phone and signature information.
- Nationality absent a separate necessity and approval decision.
- Private legal, administrative, residence or work-status information.
- Source-of-funds material, investment evidence, contracts and financial forecasts.
- Private team contact details and unconfirmed appointments.
- Confidential supplier, pricing, regulatory, algorithm, model, smart-contract, sourcing and platform methodology.
- Any private source file, its filename in public output, or extracted passage.

`robots.txt` is not a privacy control. None of this material may enter `public/` or `dist/`.

## Page-level claim matrix

| Route/output | Claims allowed | Required checks |
|---|---|---|
| `/` | P-001, P-002, E-002, selected verified media and visibly labelled C-011/C-012/C-013/C-014 if used | Hero proposition contains no regulated achievement; venture status is adjacent; evidence links are real. |
| `/about/` | P-001, P-002, P-008, M-001, E-002 | No invented title, residence, nationality, prestige label or private chronology. |
| `/ventures/` | C-001 to C-006 plus labelled C-011 to C-014 | Registration is explicitly distinguished from licence/operations; C-008 to C-010 and C-015 to C-019 do not leak. |
| `/thinking/` and essays | Approved identity, editorial metadata and source-backed analysis | No patient advice; primary pharmaceutical sources; opinions distinguished from facts; no stale company claims. |
| `/media/` | M-001 and exact M-002 count/status | Publisher URLs resolve; no fabricated press, speaking or podcast entries. |
| `/speaking-partnerships/` | P-011 only | Invitation topics are future-facing; no claimed engagement history, investor or advisor identity. |
| `/facts/` | Verified public identity/company facts and precise media status | Visible caveats, last-reviewed date and correction contact; no hidden SEO copy. |
| `/contact/` | C-007 and P-012 | Owner confirms email deliverability; only verified profile link. |
| `/privacy/` | Actual site data practices only | No claim that a form, analytics or cookie system exists when it does not. |
| JSON-LD | Narrow subset of visible verified facts | No broader claim, unverified `sameAs`, nationality, residence, licence, customer or projected value. |
| `facts.json`, feeds, `llms.txt`, social metadata | Approved visible wording only | No crawler-only biography, private-source excerpt or status escalation. |

## Automated claim gate

The release validator must fail when:

1. A material central entity value lacks a ledger claim ID.
2. A selected claim has status `PRIVATE_DO_NOT_PUBLISH`, `UNSUPPORTED_REMOVE` or unapproved `NEEDS_OWNER_APPROVAL`.
3. A `PLANNED` or `IN_PROGRESS` value is rendered without its required label and approved wording.
4. JSON-LD, feed, social metadata or machine-readable facts contain a claim absent from visible prose.
5. Regulated-status combinations imply NovaPharm is licensed, approved, certified, supplying customers/NHS, operational or revenue-generating.
6. Unverified identity/profile URLs enter navigation or `sameAs`.
7. Generic private-data terms/patterns or private document formats appear in tracked/public/generated files.

Automated matching is a guardrail, not editorial approval. Every match for MHRA, GDP, NHS, licence, partner, platform, AI, blockchain, customer, revenue, founder location or professional label requires sentence-level human review.

## Owner-controlled release items

The owner recorded the following approvals on 13 July 2026; see `docs/NEEDS_APPROVAL.md` and `docs/POST_MERGE_RELEASE_REPORT.md`:

1. Portrait ownership/licence and transformation consent (A-001).
2. Confirmation that the `.com` email is the preferred public inbox (A-002).
3. The exact conservative 2020-2025 SyriMed wording, with no invented title (A-005).
4. The minimal no-form/no-tracking email-enquiry privacy position, without undocumented processing promises (A-019).

The unresolved India entity, Polar Speed status, social profiles, Wikidata, current location, longer biography, event/media history, MHRA status, customers and deployed technology are not release blockers because they are omitted. They become blockers only if someone proposes adding them.

## Final claim sign-off

The claim reviewer must record against the release commit:

- All 40 ledger entries accounted for.
- Any of the 15 verified claims used only in their approved form.
- Each of the 6 conditional claims either visibly labelled or omitted.
- All 19 excluded claims absent from HTML, metadata, schema, assets, feeds and machine-readable files.
- No confidential source document or extract in Git or `dist/`.
- Current publication count, company registration facts, official URLs and regulatory-register status rechecked close to release.
- Any changed evidence updates both `docs/FACT_LEDGER.md` and `src/data/entity.mjs` before copy or schema changes.
