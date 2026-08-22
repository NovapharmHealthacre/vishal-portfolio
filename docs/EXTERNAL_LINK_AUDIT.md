# External-link release audit

Audit run: 22 August 2026
Scope: every external `href` emitted by the production build
Method: direct HTTPS retrieval of every primary publisher URL and the public NovaPharm origin; external-profile ownership remains an owner-controlled check

## Result

| Destination group | URLs | Result | Release treatment |
|---|---:|---|---|
| Companies House | 1 | Directly reachable; company 16716501, active status and 15 September 2025 incorporation remain visible. | Pass |
| Yakuji Nippo | 8 | All four English and four Japanese publisher pages are directly reachable. | Pass |
| Pharmaceutical Commerce | 1 | The publisher-hosted commentary is directly reachable. | Pass |
| GOV.UK / MHRA guidance | 5 | All five primary-source guidance and register pages are directly reachable. | Pass |
| LinkedIn | 1 | The configured URL remains the owner-approved exact profile; external-profile contents were not changed by this release. | Owner-controlled content check |
| NovaPharm Healthcare | 1 | The canonical HTTPS origin is directly reachable and serves the current corporate release. | Pass |

No unsupported Wikipedia, Wikidata, Crunchbase, GitHub, X, Instagram or YouTube identity URL is emitted. No external runtime script, font or analytics request is present.

## URLs checked

- `https://find-and-update.company-information.service.gov.uk/company/16716501`
- `https://novapharmhealthcare.com/`
- `https://www.linkedin.com/in/vishal-chakravarty`
- `https://www.yakuji.co.jp/entry129529.html`
- `https://www.yakuji.co.jp/entry129530.html`
- `https://www.yakuji.co.jp/entry131265.html`
- `https://www.yakuji.co.jp/entry131266.html`
- `https://www.yakuji.co.jp/entry133526.html`
- `https://www.yakuji.co.jp/entry133527.html`
- `https://www.yakuji.co.jp/entry136963.html`
- `https://www.yakuji.co.jp/entry136964.html`
- `https://www.pharmaceuticalcommerce.com/view/why-onshoring-alone-wont-secure-pharma-supply-chains`
- `https://www.gov.uk/government/collections/parallel-import-licences-lists-of-approved-products`
- `https://www.gov.uk/government/publications/human-and-veterinary-medicines-register-of-licensed-wholesale-distribution-sites`
- `https://www.gov.uk/guidance/apply-for-manufacturer-or-wholesaler-of-medicines-licences`
- `https://www.gov.uk/guidance/good-manufacturing-practice-and-good-distribution-practice`
- `https://www.gov.uk/guidance/medicines-apply-for-a-parallel-import-licence`

## Owner-controlled profile check

Compare the LinkedIn headline, company relationship and website field with the canonical entity register. This release does not authorise automatic edits to the external profile.
