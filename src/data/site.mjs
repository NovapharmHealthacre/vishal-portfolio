import { site } from './entity.mjs';

export const navigation = Object.freeze([
  { href: '/about/', label: 'About' },
  { href: '/ventures/', label: 'Ventures' },
  { href: '/thinking/', label: 'Thinking' },
  { href: '/media/', label: 'Media' },
  { href: '/facts/', label: 'Profile' },
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
  '/': '2026-10-03',
  '/about/': '2026-10-03',
  '/ventures/': '2026-10-02',
  '/thinking/': '2026-10-02',
  '/media/': '2026-10-02',
  '/speaking-partnerships/': '2026-10-02',
  '/facts/': '2026-10-02',
  '/contact/': '2026-10-02',
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
    title: 'Vishal Chakravarty | CEO, NovaPharm Healthcare',
    description:
      'Vishal Chakravarty is Chief Executive Officer of NovaPharm Healthcare Ltd and the company’s founder, working across pharmaceutical market access, specialist medicines, manufacturing partnerships and resilient supply.',
    path: '/',
    modified: routeModified['/'],
  },
  thinking: {
    title: 'Pharmaceutical Essays by Vishal Chakravarty',
    description:
      'Original essays on pharmaceutical market access, manufacturing, technology transfer, supply, portfolio strategy and building in regulated markets.',
    path: '/thinking/',
    modified: routeModified['/thinking/'],
  },
});

export const absolute = (path) => new URL(path, site.origin).href;
