# Cross-site entity contract

Reviewed: 14 July 2026

## Purpose

The personal and corporate domains describe related entities but must not create duplicate or competing identities.

## Canonical ownership

| Entity | Canonical owner | Persistent identifier |
|---|---|---|
| Vishal Chakravarty | Personal founder platform | `https://vishal.novapharmhealthcare.com/#person` |
| Vishal ProfilePage | Personal founder platform | `https://vishal.novapharmhealthcare.com/about/#profile` |
| Personal WebSite | Personal founder platform | `https://vishal.novapharmhealthcare.com/#website` |
| NovaPharm Healthcare | Corporate website | `https://novapharmhealthcare.com/#organization` |
| NovaPharm corporate WebSite | Corporate website | `https://novapharmhealthcare.com/#website` |

## Personal-site graph

- WebSite `publisher` → Vishal Person.
- ProfilePage `mainEntity` → Vishal Person.
- Blog and BlogPosting `author` → Vishal Person.
- Personal BlogPosting `publisher` → Vishal Person.
- Vishal Person `worksFor` → NovaPharm Organization.
- Ventures and Facts pages may include a concise Organization node using the corporate-domain `@id`.
- The personal site does not claim ownership of NovaPharm’s canonical corporate WebSite node.

## Corporate-site graph required later

- Corporate WebSite `publisher` → NovaPharm Organization.
- NovaPharm Organization `founder` → Vishal Person.
- Corporate leadership references to Vishal must reuse the personal Person `@id`.
- Corporate articles may use NovaPharm as publisher only when genuinely published by the company.

## Transitional limitation

The personal site can reference the intended corporate Organization identifier before the corporate website publishes a matching JSON-LD node. This is a declared coordination contract, not proof that the company site currently exposes the node. The corporate deployment must later adopt the same identifier.

## Conflict-prevention tests

Automated checks reject:

- the previous personal-domain company identifier;
- a personal WebSite published by the company;
- essays published by the company when they are personal essays;
- a Person `worksFor` reference that does not use the corporate identifier;
- a NovaPharm founder relation that does not reference Vishal;
- multiple personal Person identifiers.

## Change control

A canonical identifier must not be changed for cosmetic reasons. Changes require a migration plan covering visible links, JSON-LD, facts data, feeds, the corporate site and search-engine reprocessing.
