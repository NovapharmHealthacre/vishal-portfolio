# External-link release audit

Audit run: 13 July 2026
Scope: every external `href` emitted by the production build
Method: direct retrieval through the managed web client, with a focused search check where a site blocked direct retrieval

## Result

| Destination group | URLs | Result | Release treatment |
|---|---:|---|---|
| Companies House | 1 | Directly reachable; company 16716501, active status and 15 September 2025 incorporation remain visible. | Pass |
| Yakuji Nippo | 6 | All three English and three Japanese publisher pages are directly reachable. | Pass |
| GOV.UK / MHRA guidance | 5 | All five primary-source guidance and register pages are directly reachable. | Pass |
| LinkedIn | 1 | Direct retrieval was unavailable to the web client; current indexed result resolves the exact hyphenated profile and identifies NovaPharm plus both canonical websites. | Pass with retrieval caveat |
| NovaPharm Healthcare | 1 | Direct retrieval was rejected by the web client's URL-safety layer. The exact domain is independently present on Yakuji Nippo's author profile and the current LinkedIn result. | Identity corroborated; repeat an ordinary-browser HTTP check before production |

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
- `https://www.gov.uk/government/collections/parallel-import-licences-lists-of-approved-products`
- `https://www.gov.uk/government/publications/human-and-veterinary-medicines-register-of-licensed-wholesale-distribution-sites`
- `https://www.gov.uk/guidance/apply-for-manufacturer-or-wholesaler-of-medicines-licences`
- `https://www.gov.uk/guidance/good-manufacturing-practice-and-good-distribution-practice`
- `https://www.gov.uk/guidance/medicines-apply-for-a-parallel-import-licence`

## Pre-production retest

From a normal network-enabled browser, open the NovaPharm company domain and the LinkedIn profile, record the final URL/status, and confirm that neither has been repurposed. This is a release check, not permission to change either property.
