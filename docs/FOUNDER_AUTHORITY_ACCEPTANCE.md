# Founder authority acceptance map

Reviewed: 15 July 2026

| Acceptance criterion | Implementation |
|---|---|
| Visible site no longer foregrounds missing permissions | Homepage, About, Ventures, Media, Profile and Speaking rewritten |
| No unsupported positive claim | Central entity data and existing claim denylist preserved |
| Regulatory-boundary copy removed | Removed from homepage and page content; visible-content test added |
| Correction essay retired | Source set to `public: false`; old routes mapped to new founder essay |
| Strong founder-origin essay | `why-i-chose-to-build-in-pharmaceuticals.md` |
| Existing essays more specific | Three existing essays substantially rewritten |
| Six or more new cornerstone essays | Seven new public cornerstone essays |
| SEO, GEO and AEO structure | Unique metadata, answer-led openings, primary sources, internal links and article schema |
| Homepage reflects pharmaceutical ambition | Hero, thesis, venture, principles and CTA rewritten |
| About builds founder character | Full founder narrative added without public weakness catalogue |
| Ventures explains company strategy | Six operating areas, route model, geography and founder role added |
| Media is a professional editorial profile | Bilingual publication abstracts, selected essays, bio and enquiry topics added |
| Facts page humanised | Visible label changed to Profile; machine terms and word-count headings removed |
| Machine-readable links hidden | `/facts.json` remains available but has no visible page CTA |
| Design and performance preserved | No CSS, portrait, canvas or breakpoint changes |
| Private material protected | No private documents, supplier names, negotiations or financial details added |
| Editorial regression protection | `test:visible-content` added to `npm run check` |
| Draft PR only | Branch isolated from main; no deployment changes |

Final hosted CI and rendered review remain mandatory before merge recommendation.
