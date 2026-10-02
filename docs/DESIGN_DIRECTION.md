# Design direction

## Concept: Precision without theatre

Vishal's platform should feel like a premium personal product surface: clear, calm, fast and deliberate. The design is Apple-inspired in principle, not copied from Apple. No Apple source code, page markup, proprietary template, imagery or brand assets are used.

The system prioritises the person, the work and the evidence. Decoration is subordinate to information.

## Brand character

- Personal: Vishal is the primary identity.
- Precise: verified facts and source links outrank slogans.
- Product-minded: every component has a clear job.
- Regulated-market aware: confidence without unsupported claims.
- Human: authentic portraiture and authored work.
- Ambitious under control: scale through hierarchy and restraint.

## Visual system

### Colour

- Canvas: `#f5f5f7`
- Surface: `#ffffff`
- Primary ink: `#1d1d1f`
- Secondary copy: `#424245`
- Muted copy: `#6e6e73`
- Interaction blue: `#0066cc` (chosen to maintain WCAG AA contrast on the light canvas)
- Feature black: `#000000`

Colour is functional. Most pages remain light. Black is reserved for deliberate feature moments such as the NovaPharm section. Gradients, decorative noise and ornamental colour are excluded.

### Typography

- Interface and display use an operating-system-first sans stack headed by `-apple-system` and `BlinkMacSystemFont`.
- No proprietary font files are shipped.
- Headlines rely on weight, scale, spacing and short measures rather than serif drama.
- Body copy remains readable at approximately 65–75 characters per line.
- Labels are sentence case wherever possible; uppercase interface theatre is avoided.

### Grid and rhythm

- Content is capped around 1180–1280px for major product surfaces.
- Whitespace establishes hierarchy before borders or decoration.
- Rounded surfaces are used for discrete product-like sections, not every block.
- Thin rules are reserved for genuine structure.
- Mobile is recomposed rather than treated as a squeezed desktop layout.

## Homepage sequence

1. Vishal's name, current role and verified proposition.
2. The owner-supplied black-and-white portrait as the dominant visual.
3. Founder thesis in a quiet, centred statement.
4. NovaPharm as a high-contrast black feature surface.
5. Three operating principles as calm product cards.
6. Selected writing.
7. Verified public evidence.
8. Selected portrait preview.
9. Direct contact close.

## Navigation

The global navigation is compact, sticky and translucent. It uses a restrained blur/saturation treatment, small system typography and no decorative logo badge. Mobile navigation keeps 44px minimum touch targets and preserves keyboard/focus behaviour.

## Motion language

- Motion is short, quiet and reversible.
- Entry motion is limited to subtle opacity/position/scale changes.
- No scroll hijacking, cursor followers, fake loaders, continuous decorative canvases or parallax dependencies.
- `prefers-reduced-motion` removes non-essential motion.

## Portrait

The official rendered portrait is:

`/images/portrait/vishal-chakravarty-1440.webp`

It is the owner-supplied square black-and-white headshot, served at 1440 × 1440 for the principal profile image. The original factual alt text and structured-data identity remain intact.

Legacy responsive derivatives remain in the repository where release tooling still references them, but the current hero/about/gallery lead surfaces intentionally use the refreshed 1440px portrait.

## Accessibility and performance

- Visible focus states are mandatory.
- Touch targets remain at least 44px for primary controls.
- Long headings must not create horizontal overflow on narrow screens.
- Reduced motion must be honoured.
- No third-party runtime scripts or remote font dependencies are introduced.
- Existing CSP, structured-data, claims-governance, browser and Lighthouse gates remain release requirements.

## Implementation strategy

The verified content and governance architecture is intentionally preserved. The visual redesign is implemented as a final first-party stylesheet, `public/assets/apple-refresh.css`, loaded after the established base and content-fix styles.

This keeps the redesign reversible, reduces risk to generated content and tests, and avoids rewriting stable content logic solely for appearance.

## Explicit anti-patterns

No copied Apple page sections, proprietary Apple assets, generic SaaS dashboards, stock laboratory imagery, fake metrics, awards, testimonials, fake press logos, molecule wallpaper, ornamental glassmorphism, neon, cinematic loaders or decorative animation that competes with the content.
