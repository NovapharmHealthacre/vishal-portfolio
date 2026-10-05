import { site } from './entity.mjs';

export const navigation = Object.freeze([
  { href: '/about/', label: 'About' },
  { href: '/ventures/', label: 'NovaPharm' },
  { href: '/thinking/', label: 'Insights' },
  { href: '/media/', label: 'Media' },
]);

export const canonicalRoutes = Object.freeze([
  '/',
  '/about/',
  '/ventures/',
  '/thinking/',
  '/media/',
  '/speaking-partnerships/',
  '/facts/',
  '/contact/',
  '/privacy/',
]);

export const routeModified = Object.freeze({
  '/': '2026-10-04',
  '/about/': '2026-10-04',
  '/ventures/': '2026-10-04',
  '/thinking/': '2026-10-04',
  '/media/': '2026-10-04',
  '/speaking-partnerships/': '2026-10-04',
  '/facts/': '2026-10-04',
  '/contact/': '2026-10-04',
  '/privacy/': '2026-10-02',
});

export const legacyRedirects = Object.freeze({
  '/about.html': '/about/',
  '/companies.html': '/ventures/',
  '/essays.html': '/thinking/',
  '/publications.html': '/media/',
  '/profiles.html': '/facts/',
  '/gallery/': '/about/',
  '/essays/from-swiggy-to-mhra/': '/essays/why-i-chose-to-build-in-pharmaceuticals/',
  '/essays/why-i-left-swiggy/': '/essays/why-i-chose-to-build-in-pharmaceuticals/',
});

export const physicalAliases = Object.freeze({
  '/index.html': '/',
});

export const defaultSocialImage = '/images/social/default-og.jpg';

export const pageMeta = Object.freeze({
  home: {
    title: 'Vishal Chakravarty | Pharmaceuticals, Market Access & Company Building',
    description:
      'Vishal Chakravarty works across pharmaceutical strategy, market access, manufacturing, resilient supply and decision systems, connecting product choice to patient access as one operating route.',
    path: '/',
    modified: routeModified['/'],
  },
  thinking: {
    title: 'Pharmaceutical Insights by Vishal Chakravarty',
    description:
      'First-principles insights on pharmaceutical market access, manufacturing, technology transfer, supply, portfolio strategy and building in regulated markets.',
    path: '/thinking/',
    modified: routeModified['/thinking/'],
  },
});

export const absolute = (path) => new URL(path, site.origin).href;
