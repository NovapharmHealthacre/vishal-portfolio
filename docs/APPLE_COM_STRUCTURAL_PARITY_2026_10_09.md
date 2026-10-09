# Apple.com structural parity — portfolio release 9 October 2026

## Source of comparison
- https://www.apple.com/ : global navigation, consecutive edge-to-edge flagship modules, equal paired promotional modules, footer hierarchy.
- https://www.apple.com/iphone/ : category page, separate local navigation, product hero typography, links and editorial sections.
- https://developer.apple.com/design/human-interface-guidelines/layout : responsive structure and familiar control positions.

## What changed from PR #41
PR #41 applied typography/colors while leaving the original editorial page composition in place. This is a complete change of page architecture.

| Apple site structure | Portfolio implementation |
| --- | --- |
| Compact persistent global navigation | 44px desktop, 48px mobile; equal-weight page tabs |
| Search navigation affordance | Functional indexed site search backed by `content-index.json`; Cmd/Ctrl+K/Escape |
| Second navigation bar on product pages | 52px sticky local section navigation below global header |
| Full-bleed flagship campaign panels | Three 692px campaigns: Vishal/NASA, founder portrait, NovaPharm |
| Consistent separation between campaigns | 12px full-width gaps |
| Two-column lower-home promo merchandising | Two-column 2×2 grid with 12px gutters, single-column mobile |
| Page-first focus, large identity headline | One clear headline, secondary proposition, two actions per hero |
| Responsive hero compositions | Independent mobile typography and art placement for all panels |
| Compact multi-column footer | Structured cross-site nav, credits and primary legal links |

## Preserved sources and proof
- NASA Hubble Supernova 1987A credit and actual NASA imagery.
- Verified founder portraits in AVIF/WebP/JPEG sizes.
- Regulatory and pharmaceutical descriptions as provided and approved; no new commercial or licensing claims.
- Company and publisher evidence URLs.
- Person, ProfilePage, Organization, BlogPosting and canonical SEO graph.
- Google ownership verification HTML, sitemap, robots and legacy redirects.

## Validation requirements
Automated quality, browser matrix, contrast, keyboard menu/search, 320px and 390px mobile overflow, page images, source and SEO, Lighthouse before merge. The hosted production website and Google indexing are verified separately.

## Scope boundary
The goal is faithful layout and interaction structure with user-owned identity and content, **not** Apple trademark/media reproduction, hidden code reuse, or claiming affiliation. Google's Knowledge Panel remains an independently generated Google feature, not a switch in the website.
