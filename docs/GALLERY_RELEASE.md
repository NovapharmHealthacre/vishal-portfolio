# Founder gallery release

Status: live on the custom-domain production site; automated release verification active.

## Scope

- Dedicated `/gallery/` page
- Existing high-resolution official founder portrait
- Ten owner-supplied portraits with descriptive filenames, captions and alt text
- `ImageGallery` and `ImageObject` structured data
- One canonical Person portrait identifier
- `primaryImageOfPage` on the founder and gallery surfaces
- Image sitemap coverage for all eleven public portrait URLs
- Homepage gallery preview and primary navigation
- Cross-browser, accessibility, Lighthouse and post-deployment verification gates

## Privacy and rights accuracy

The owner authorised publication, cropping, optimisation and transformation of the selected portraits. Source files are emitted without embedded camera or editing metadata. The structured data describes Vishal as the subject of the images without making unsupported photographer, creator or copyright-owner claims.

## Release rule

Changes must pass the deterministic repository suite, Chromium/Firefox/WebKit QA, axe accessibility checks, Lighthouse thresholds and custom-domain production verification. DNS, the Pages custom domain, entity identifiers and the no-tracking privacy position remain protected.
