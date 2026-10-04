# Design direction

## Concept: Precision with spatial depth

Vishal's platform should feel like a premium personal product surface: clear, calm, fast and deliberate. The visual benchmark combines Apple-like hierarchy and restraint with the spatial depth and ambient motion associated with modern OpenAI product experiences. The implementation remains original: no Apple or OpenAI source code, page markup, proprietary templates, imagery, motion assets or brand assets are copied.

The system prioritises the person, the work and the evidence. Motion creates atmosphere without becoming the information.

## Brand character

- Personal: Vishal is the primary identity.
- Precise: verified facts and source links outrank slogans.
- Product-minded: every component has a clear job.
- Regulated-market aware: confidence without unsupported claims.
- Human: authentic portraiture and authored work.
- Ambitious under control: scale through hierarchy, motion and restraint.

## Visual system

### Colour

- Canvas: `#f5f5f7`
- Surface: `#ffffff`
- Primary ink: `#1d1d1f`
- Secondary copy: `#424245`
- Muted copy: `#6e6e73`
- Interaction blue: `#0066cc` for WCAG AA contrast on the light canvas
- Immersive hero: `#000000`
- Hero light: `#f5f5f7`
- Spatial blue-violet light is limited to the animated Nova field

Colour is functional. Most information surfaces remain light; the homepage hero and selected feature surfaces may use black for contrast and depth.

### Typography

- Interface and display use an operating-system-first sans stack headed by `-apple-system` and `BlinkMacSystemFont`.
- On Apple hardware this resolves naturally to the system San Francisco family without distributing proprietary font files.
- Headlines rely on weight, scale, tracking and short measures rather than ornamental type.
- Body copy targets approximately 65–75 characters per line.
- Labels use sentence case wherever possible.

### Grid and rhythm

- Content is capped around 1180–1280px for major product surfaces.
- Whitespace establishes hierarchy before borders or decoration.
- Rounded surfaces are used for discrete product-like sections, not every block.
- Thin rules are reserved for genuine structure.
- Mobile is recomposed rather than treated as a squeezed desktop layout.

## Homepage sequence

1. Immersive black Hubble hero using the verified NASA/ESA Supernova 1987A observation, with Vishal's name and verified proposition.
2. Owner-supplied black-and-white portrait paired with the operating thesis.
3. NovaPharm as a high-contrast feature surface.
4. Three operating principles as calm product cards.
5. Selected writing.
6. Verified public evidence.
7. Direct contact close.

The public portrait gallery and the browser-based “Ask Vishal’s Work” interface are intentionally retired. The former `/gallery/` address is retained only as a noindex compatibility route to `/about/` so existing links fail gracefully without competing in search.

## Navigation

The global navigation is compact, sticky and translucent. It uses a 44px Apple-like rhythm, small system typography and no decorative logo badge. Mobile navigation preserves 44px minimum touch targets and keyboard/focus behaviour.

## Motion language

- The homepage uses a real NASA/ESA Hubble observation with restrained camera drift, pointer parallax and scroll-linked depth; the astronomical subject itself is not procedurally redrawn.
- About retains a distinct Hubble observation, while operating routes use Nova-owned signal-field artwork so scientific source material and first-party brand visuals remain clearly separated.
- Motion is progressive enhancement: essential content is server-generated and usable without JavaScript.
- Hero motion pauses when off-screen or when the document is hidden, and it is disabled for reduced-motion and narrow-screen contexts.
- Narrow-screen pages do not initialise scroll-reveal observers; content remains immediately visible.
- No scroll hijacking, cursor followers, fake loaders or continuous decorative animation outside deliberately immersive hero surfaces.

## Portrait

The canonical identity image remains the owner-supplied black-and-white founder portrait, but page delivery is responsive rather than fixed-size.

Rendered founder surfaces negotiate 640, 960 and 1440 pixel AVIF sources first, WebP second and JPEG as the standards-based fallback through `<picture>`, `srcset` and `sizes`. WebKit and other browsers choose the best supported format natively; no user-agent sniffing removes modern formats.

The factual alt text, intrinsic dimensions and canonical Person identity remain intact. Social and structured-data image references remain deliberate metadata choices rather than forcing the same physical file into every viewport.

## Search, entity and generative discovery

- Every public canonical page has one canonical URL and explicit indexability.
- Breadcrumbs are visible on internal pages and represented as `BreadcrumbList` structured data.
- Person, ProfilePage, Organization, WebSite, WebPage, BlogPosting and CollectionPage entities use stable `@id` values.
- The sitemap carries material `lastmod` dates and the canonical founder portrait in the Google image extension.
- `robots.txt` explicitly allows Googlebot, Bingbot, Applebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot while separately declining selected model-training crawlers.
- `facts.json`, RSS, JSON Feed and `llms.txt` expose structured, source-bounded discovery paths without inventing facts.
- Removed experiences do not remain in the canonical sitemap or generative-discovery file.

## Accessibility and performance

- Visible focus states are mandatory.
- Touch targets remain at least 44px for primary controls.
- Long headings must not create horizontal overflow on narrow screens.
- Reduced motion must be honoured.
- No third-party runtime scripts or remote font dependencies are introduced.
- Existing CSP, structured-data, claims-governance, multi-browser and Lighthouse gates remain release requirements.

## Implementation strategy

The verified content and governance architecture is preserved. The front end remains generated semantic HTML, CSS and small progressive JavaScript modules rather than migrating to a client-rendered framework merely for visual similarity.

This is deliberate. Apple, OpenAI, NASA and SpaceX are product and experience benchmarks, not requirements to reproduce their private infrastructure. Their complete production stacks are neither stable public specifications nor appropriate dependencies for this static publication. Languages and services are added only when a concrete capability requires them.

For the present product, browser-native HTML/CSS/JavaScript plus dependency-light Node.js build tooling provides the smallest transfer, strongest no-JavaScript baseline and narrowest attack surface. Swift, SwiftUI and UIKit are native Apple application technologies, not substitutes for browser HTML/CSS/JavaScript; similarly, adding Python, Go, Rust, React or Next.js without a product requirement would add runtime or operational complexity without improving the public experience.

## Explicit anti-patterns

No copied Apple or OpenAI page sections, proprietary assets, generic SaaS dashboards, stock laboratory imagery, fake metrics, awards, testimonials, fake press logos, molecule wallpaper, ornamental glassmorphism, neon spectacle, cinematic loaders or motion that competes with the content.
