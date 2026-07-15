# Structured data register

Reviewed: 14 July 2026

## Canonical nodes

| Node | `@id` | Primary page | Purpose |
|---|---|---|---|
| Person | `https://vishal.novapharmhealthcare.com/#person` | `/about/` | Vishal’s verified professional identity |
| Personal WebSite | `https://vishal.novapharmhealthcare.com/#website` | `/` | Personal founder platform |
| ProfilePage | `https://vishal.novapharmhealthcare.com/about/#profile` | `/about/` | Canonical profile page whose main entity is Vishal |
| NovaPharm Organization | `https://novapharmhealthcare.com/#organization` | Corporate domain; referenced on `/ventures/` | Corporate entity without a competing personal-domain identity |
| NovaPharm WebSite | `https://novapharmhealthcare.com/#website` | Corporate domain | Reserved cross-site website identifier |
| Personal Blog | `https://vishal.novapharmhealthcare.com/thinking/#blog` | `/thinking/` | Collection of Vishal’s essays |

## Page graph

| Page | Top-level types | Relationships |
|---|---|---|
| `/` | WebSite, Person, WebPage | WebSite publisher → Person; WebPage mainEntity → Person |
| `/about/` | ProfilePage, Person, BreadcrumbList | ProfilePage mainEntity → Person; Person worksFor → Organization |
| `/ventures/` | WebPage, Organization, BreadcrumbList | WebPage mainEntity → Organization; Organization founder → Person |
| `/thinking/` | CollectionPage, Blog, BreadcrumbList | Blog author/publisher → Person; blogPost → canonical BlogPosting nodes |
| Essays | WebPage, BlogPosting, BreadcrumbList | BlogPosting author/publisher → Person; isPartOf → Blog |
| `/media/` | CollectionPage, ItemList, BreadcrumbList | List contains verified publisher-hosted URLs |
| `/facts/` | WebPage, Person, Organization, BreadcrumbList | Public reference page; no duplicate ProfilePage |
| `/contact/` | ContactPage, BreadcrumbList | mainEntity → Person |
| `/privacy/`, `/speaking-partnerships/` | WebPage, BreadcrumbList | Personal-site utility/editorial pages |

## Property rules

- `jobTitle` is `Chief Executive Officer`; visible founder status is represented separately through the Organization founder relationship and visible role copy.
- `sameAs` contains only the verified exact LinkedIn profile.
- Authored Yakuji pages are publication records, not independent `subjectOf` biographical coverage.
- Organization identifier uses a Companies House PropertyValue.
- Direct image URLs, dimensions and captions are supplied.
- `dateModified` uses material page/article dates.
- Personal essays are not published by NovaPharm.

## Prohibited markup

No Review, AggregateRating, Offer, Product, MedicalBusiness, Pharmacy, WholesaleStore, LocalBusiness, JobPosting, Event, FAQPage, interaction counts, awards or unsupported credentials.

## Source files

- `src/data/entity.mjs`
- `src/data/site.mjs`
- `src/lib/schema.mjs`
- `src/components/views.mjs`
- `src/content/thinking/*.md`

## Regression controls

`scripts/check-schema.mjs`, `scripts/check-seo-authority.mjs` and unit tests enforce canonical identifiers, publisher/author relationships, required page types, forbidden properties and public facts consistency.
