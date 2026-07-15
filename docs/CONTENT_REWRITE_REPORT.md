# Founder authority content rewrite report

Date: 15 July 2026
Base commit: `721497d9e889cc4b65ec5583b2e1b0df59a3b1b7`
Branch: `content/founder-authority-rewrite`
Status: implementation complete; hosted validation pending

## Objective

Move internal fact-governance language out of the visitor experience and replace it with a confident, specific pharmaceutical founder narrative while preserving the existing visual system, entity graph, structured data, crawler policy and deployment architecture.

## Public language removed

The rewrite removes or hides public uses of:

- Regulatory boundary
- Status before spectacle
- Evidence before assertion
- Proof belongs beside the claim
- Verified founder profile
- Entity record
- Public-safe record
- Not an operating claim
- What is deliberately absent
- The company does not present itself
- Machine-readable fact record
- 40-word biography
- 100-word biography
- unsupported-profile exclusion lists
- Invitations, not invented credentials
- The Story Was Too Simple
- correction-diary language about the previous founder narrative
- generic footer lines about earning the right to scale
- implementation-led footer language about tracking

The factual controls remain in the fact ledger, generated data, schema and tests.

## Page-by-page outcome

### Homepage

Before: registry facts, status labels and abstract operating aphorisms dominated the first impression.

After:

- hero identifies Vishal as Founder & CEO and a pharmaceutical entrepreneur;
- proposition states the NovaPharm market-access, specialist-medicine and supply ambition;
- proof strip presents areas of work rather than company metadata;
- founder thesis explains the gap between product approval and market access;
- three principles are specific to approval, supply and commercial execution;
- NovaPharm section explains the work positively;
- record section presents Companies House, Yakuji Nippo and the founder profile without machine language;
- closing invitation names market access, manufacturing, supply and cross-border growth.

### About

The page now follows:

1. why pharmaceuticals;
2. work before NovaPharm;
3. why NovaPharm exists;
4. what Vishal is building;
5. how he operates;
6. writing and public thinking;
7. current focus and conversation routes.

It no longer publishes disputed-title handling, missing permissions, absent customers or undeployed systems.

### Ventures

The NovaPharm page now covers:

- company overview;
- why NovaPharm exists;
- market access and product strategy;
- licensing pathways;
- manufacturing and technology transfer;
- sourcing and supply architecture;
- commercialisation and channel development;
- digital operating infrastructure;
- complete route from product to patient access;
- geographic direction;
- founder role;
- related thinking;
- discreet company record.

### Thinking

The index now presents pharmaceutical strategy and founder execution. Process language about writing for machines has been removed.

### Media

The page now includes:

- featured Yakuji Nippo series;
- article date, subject, abstract and bilingual links;
- publication themes;
- selected independent essays;
- founder biography;
- media and editorial topics;
- direct enquiry route.

The unpublished fourth instalment is absent from the public page.

### Profile

The route remains `/facts/` for continuity, but the navigation label is `Profile`.

Visible content now includes:

- at-a-glance identity;
- one polished biography;
- professional focus;
- NovaPharm summary;
- selected publications and essays;
- speaking topics;
- official links;
- contact.

The `facts.json` endpoint remains available technically but is no longer promoted in the interface.

### Speaking and partnerships

The page now describes available themes and formats directly: market access, post-Brexit strategy, CMO/CDMO selection, technology transfer, supply, specialist medicines and founder execution.

### Contact and footer

The contact page is direct and professional. The footer now reinforces Vishal’s name, executive role and pharmaceutical focus.

## Essay retirement and route map

Retired public source:

- `src/content/thinking/why-i-left-swiggy.md` is retained as `public: false` archive material.

New canonical founder essay:

- `/essays/why-i-chose-to-build-in-pharmaceuticals/`

Previous routes resolve through neutral `noindex,follow` compatibility pages:

- `/essays/why-i-left-swiggy/`
- `/essays/from-swiggy-to-mhra/`
- `/essays/why-i-left-swiggy/index.html`

The old title, summary and correction narrative are not emitted into public HTML, feeds, sitemap or structured data.

## Existing essay changes

- `How to Win When the Odds Are Against You` became `Building When the Starting Position Is Uneven`, focused on asymmetric markets, expertise, partner value, capital sequencing and long-cycle entrepreneurship.
- `Building in Regulated Industries` became `Building a Pharmaceutical Company in a Regulated Market`, focused on product selection, manufacturing, hand-offs, documentation, technology and founder execution.
- `What Parallel Import Actually Means` became `UK Parallel Import Licensing: What the Route Actually Requires`, with an answer-led opening, clearer operating map and stronger commercial screen.

## New public cornerstone essays

1. Why I Chose to Build in Pharmaceuticals
2. Regulatory Approval Is Not Market Access
3. The Route to Market Is Designed Before Launch
4. Supply Resilience Begins Before the First Purchase Order
5. Choosing a CMO for Regulated Markets
6. Technology Transfer Starts Before the Formula Moves
7. Why Minimum Batch Size Can Decide a Product’s Future

All use the actual publication date, direct answers, descriptive headings, internal links, article schema, feeds, sitemap inclusion and official primary sources where relevant.

## Complete private editorial drafts

1. Post-Brexit Pharmaceutical Market Entry: One Region, Multiple Systems
2. Product Selection Is a Capital Allocation Decision
3. What a Digital Pharmaceutical Platform Should Actually Solve
4. The Commercial Case for Specialist Medicines
5. Building Credibility Before Scale

These remain `public: false` and are excluded from HTML, feeds, sitemap and schema until a later editorial decision.

## SEO targets

| Essay | Primary search theme | Answer opportunity |
|---|---|---|
| Why I Chose to Build in Pharmaceuticals | pharmaceutical founder / NovaPharm founder | Why Vishal founded a pharmaceutical company |
| Regulatory Approval Is Not Market Access | pharmaceutical market access | Difference between approval and access |
| Route to Market | pharmaceutical commercialisation | When route-to-market planning begins |
| Supply Resilience | pharmaceutical supply-chain resilience | How resilience is designed before ordering |
| Choosing a CMO | pharmaceutical CMO selection | Criteria for selecting a CMO/CDMO |
| Technology Transfer | pharmaceutical technology transfer | What a complete transfer requires |
| Minimum Batch Size | pharmaceutical batch economics | Why batch size affects viability |
| UK Parallel Import | UK parallel import licence | What the PLPI route requires |
| Regulated Market | building a pharmaceutical company | How regulation changes founder execution |
| Uneven Starting Position | pharmaceutical entrepreneurship | How a constrained founder builds leverage |

## GEO and AEO implementation

- opening paragraphs answer the central question directly;
- founder, company and article authorship remain unambiguous;
- titles and descriptions are topic-specific;
- terminology is stable across pages;
- official primary sources support technical claims;
- articles contain concise frameworks and quotable conclusions;
- internal links connect founder, venture and technical authority;
- machine-facing implementation language is absent from visible copy;
- `facts.json`, JSON-LD, `llms.txt`, feeds and sitemap remain available behind the interface.

## Structured data and machine assets

Preserved identifiers:

- Person: `https://vishal.novapharmhealthcare.com/#person`
- WebSite: `https://vishal.novapharmhealthcare.com/#website`
- ProfilePage: `https://vishal.novapharmhealthcare.com/about/#profile`
- NovaPharm Organization: `https://novapharmhealthcare.com/#organization`
- NovaPharm WebSite: `https://novapharmhealthcare.com/#website`

Entity descriptions, `knowsAbout`, page metadata and article records now match the revised visible content.

## New regression gate

`scripts/check-visible-content.mjs` scans public HTML, RSS and JSON Feed for prohibited defensive or machine-facing phrases, duplicate summaries, generic motivational titles, excessive defensive vocabulary and visible promotion of `facts.json`.

The gate is included in `npm run check` as `test:visible-content`.

## Visual scope

No colour, typography, portrait, canvas, responsive breakpoint or animation system was redesigned. Component changes are limited to copy, navigation label, hidden machine link and content organisation.

## Validation

Required before merge:

- `npm ci`
- `npm run check`
- hosted GitHub Actions
- rendered desktop and mobile review
- browser, accessibility and Lighthouse regression where the environment permits

Final results will be added after the exact PR head completes hosted validation.

## Owner approvals

No new unsupported achievement or confidential fact was introduced. The public essays and page copy are ready for owner editorial review. Private draft essays require a later publication decision only.
