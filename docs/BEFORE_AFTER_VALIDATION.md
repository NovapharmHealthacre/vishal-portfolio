# Before-and-after validation

Baseline main: `cd3d2ad09c63bb6bf4b9fb002aed4e784880b76f`
SEO branch: `seo/post-launch-authority`
Reviewed: 14 July 2026

## Entity architecture

| Area | Before | After |
|---|---|---|
| Person | Canonical personal-domain `#person` | Preserved |
| Personal WebSite | Generated root `#website` | Explicit central `site.id`; publisher remains Vishal |
| ProfilePage | Personal About profile | Explicit canonical `person.profileId` and material review date |
| NovaPharm Organization | Personal-domain `/ventures/#novapharm-healthcare` | Corporate-domain `https://novapharmhealthcare.com/#organization` |
| Person jobTitle | `Founder & CEO` | `Chief Executive Officer`; founder relationship represented separately |
| Personal essays publisher | Vishal | Explicitly tested and preserved |
| facts.json | Schema version 1; no entity-id contract | Schema version 2 with canonical Person, WebSite, ProfilePage and corporate identifiers |

## Freshness and sitemap

| Area | Before | After |
|---|---|---|
| Static `lastmod` | One global verification date for every canonical page | Route-specific material dates |
| Sitemap safeguards | Generated canonical pages and essays | Exact URL/date regression comparison; rejects aliases, 404, priority and changefreq |
| Article dates | Front matter | Preserved; no cosmetic freshness changes |

## Crawler policy

| Area | Before | After |
|---|---|---|
| Search versus training | Already separated | Preserved and documented with official-purpose comments |
| User-triggered agents | Allowed without limitation note | Explicit note that robots behaviour may differ |
| Review date | 12 July 2026 | 14 July 2026 |
| Register | General SEO plan only | Dedicated crawler-policy register |

## Supplemental AI file

| Area | Before | After |
|---|---|---|
| llms.txt | Canonical navigation and facts | Adds canonical entity IDs and explicit supplemental-only limitation |

## Automated quality gates

Before, schema checks validated page types, privacy exclusions and metadata. After, the suite additionally enforces:

- cross-site entity ownership;
- personal publisher/author relationships;
- no legacy company identifier;
- public facts entity IDs;
- exact sitemap route/date source matching;
- crawler policy;
- absence of common tracking domains;
- absence of private office-document types in `dist`;
- supplemental llms declaration.

## Editorial and authority system

Before, the repository contained strong release, facts and publishing documentation. After, it also contains dedicated post-launch registers for search visibility, metadata, indexability, structured data, crawlers, Search Console/Bing, Knowledge Panel readiness, external consistency, content authority, editorial planning, internal links, LinkedIn distribution, off-site authority, measurement and monitoring.

## Unchanged by design

- visual identity;
- architecture and generator;
- DNS and GitHub Pages settings;
- production website;
- article body text and publication dates;
- Google verification file;
- privacy/no-tracking position;
- unsupported-claim exclusions.

Final validation depends on hosted CI and external Search Console/Bing tools. Nothing in this branch is merged or deployed automatically.
