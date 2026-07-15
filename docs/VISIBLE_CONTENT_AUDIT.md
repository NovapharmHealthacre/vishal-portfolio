# Visible content audit

Reviewed: 15 July 2026

Scope: every visitor-facing route, shared layout, essay, metadata surface, feed and compatibility page in the Vishal Chakravarty portfolio.

## Audit standard

Public copy was assessed for five failure modes:

1. generic founder language that could belong to any portfolio;
2. defensive language that foregrounded missing permissions or capabilities;
3. machine-facing language exposed to ordinary visitors;
4. repeated fact-checking language that weakened the founder narrative;
5. claims that exceeded the approved fact ledger.

Technical controls remain in structured data, `facts.json`, `llms.txt`, crawler policy, tests and internal documentation. They are no longer used as the public brand voice.

## Route findings

| Route | Existing purpose | Principal problem | Action |
|---|---|---|---|
| `/` | Founder landing page | Registry proof, status labels and generic operating aphorisms dominated the founder thesis | Rewrite |
| `/about/` | Founder biography | Publicly catalogued limitations, disputed title handling and absent capabilities | Rewrite |
| `/ventures/` | NovaPharm profile | Structured primarily around disclaimers and what the company had not yet claimed | Rewrite and expand |
| `/thinking/` | Essay index | Machine/editorial process language was more prominent than the subject authority | Rewrite |
| `/media/` | Publication record | Defensive language about limited press coverage and an unpublished fourth instalment | Rewrite and expand |
| `/speaking-partnerships/` | Enquiry page | Repeatedly denied speaking history, advisory roles and partnerships | Rewrite |
| `/facts/` | Public profile | Exposed word-count labels, machine-readable records and unsupported-profile exclusions | Humanise and relabel as Profile |
| `/contact/` | Direct email | Generic headline and unnecessary response/advice disclaimers | Rewrite |
| `/privacy/` | Privacy notice | Accurate but unnecessarily legalistic in places | Simplify |
| Compatibility routes | Preserve indexed addresses | Previous content identity could remain visible | Replace with neutral noindex route |
| `404.html` | Error recovery | Abstract route language | Simplify |

## Shared component findings

### Navigation

`Facts` sounded like a machine or due-diligence destination. It is now labelled `Profile` while preserving `/facts/`.

### Footer

The lines “Build the useful thing. Earn the right to scale it.” and “Independent founder platform · No tracking” were generic and implementation-led. The footer now reinforces Vishal’s name, executive role and pharmaceutical focus.

### Homepage proof strip

Company number, incorporation date and review date were useful records but weak first-impression material. The strip now presents the three principal areas of work: market access, manufacturing and technology transfer, and specialist medicines and supply.

### Article aside

The prominent recurring legal disclaimer made every essay feel defensive. It has been replaced by a subject-oriented founder-analysis note; relevant articles retain a short editorial note at the end.

## Retired phrases

The public build is prohibited from displaying:

- Regulatory boundary
- Status before spectacle
- Evidence before assertion
- Proof belongs beside the claim
- Verified founder profile
- Entity record
- Public-safe record
- Not an operating claim
- What is deliberately absent
- Machine-readable fact record
- 40-word biography
- 100-word biography
- Invitations, not invented credentials
- The Story Was Too Simple
- correction-diary language tied to the previous founder narrative

## Claims retained carefully

The rewrite continues to state only supported facts:

- Vishal Chakravarty is Founder & CEO of NovaPharm Healthcare Ltd.
- NovaPharm Healthcare Ltd is an active UK-registered company incorporated in 2025.
- Vishal’s pharmaceutical experience includes work with SyriMed between 2020 and 2025.
- Three Yakuji Nippo instalments are published in English and Japanese.
- The company is building around product strategy, market access, manufacturing partnerships, licensing pathways and supply.

No new customer, licence, product approval, revenue, investor, award, education, partnership or deployed-technology claim was introduced.

## Final editorial direction

The visible website now answers four human questions:

1. Who is Vishal?
2. What pharmaceutical company is he building?
3. What does he understand about the route from product to market?
4. Which writing and conversations demonstrate that perspective?

The internal architecture continues to answer machine and governance questions without making those controls the visitor experience.
