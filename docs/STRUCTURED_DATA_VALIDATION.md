# Structured data validation

Reviewed: 14 July 2026

## Automated validation

The repository release suite must pass:

```bash
npm ci
npm run check
```

The schema gate verifies:

- valid JSON-LD and Schema.org context;
- expected page-specific types;
- canonical HTTPS identifiers;
- one persistent Person identifier;
- personal WebSite publisher → Person;
- Person worksFor → corporate Organization;
- Organization founder → Person;
- ProfilePage mainEntity → Person;
- personal Blog and BlogPosting publisher → Person;
- direct image metadata;
- one high-resolution canonical Person portrait and page-level `primaryImageOfPage` references;
- gallery ImageObjects that identify Vishal as the subject without unsupported creator or copyright claims;
- no private identity properties, ratings, reviews or unsupported awards;
- no legacy personal-domain Organization identifier.

## Rendered-source inspection

For each representative page, inspect the generated `dist` HTML rather than source modules alone:

- `/`
- `/about/`
- `/ventures/`
- `/thinking/`
- one pharmaceutical essay;
- `/media/`
- `/facts/`
- `/contact/`

Confirm that structured properties are supported by visible page text and that the canonical URL describes the same page.

## Public validators after an approved merge

Owner or release engineer should save evidence from:

1. Schema.org Validator for the homepage, About, Ventures, one essay and Facts.
2. Google Rich Results Test for About and one essay.
3. Google Search Console URL Inspection rendered HTML for the homepage and About.

Zero syntax errors are the minimum. A validator pass does not guarantee a rich result or Knowledge Panel.

## Expected limitations

- ProfilePage and Article markup can improve understanding but may not produce a visible rich result.
- The corporate Organization node is referenced by the personal site while its canonical home is the company domain. The corporate site must eventually expose the same `@id`.
- Yakuji articles authored by Vishal do not qualify as independent `subjectOf` coverage merely because they are hosted by a publisher.

## Failure policy

Do not merge when:

- an identifier changes without migration analysis;
- visible content and JSON-LD disagree;
- a private or unsupported property appears;
- an article date is changed without material content revision;
- an essay publisher points to NovaPharm without a genuine corporate editorial decision;
- a validator reports an error that affects the deployed graph.
