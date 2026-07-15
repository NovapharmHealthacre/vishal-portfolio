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
  '/': '2026-07-15',
  '/about/': '2026-07-15',
  '/ventures/': '2026-07-15',
  '/thinking/': '2026-07-15',
  '/media/': '2026-07-15',
  '/speaking-partnerships/': '2026-07-15',
  '/facts/': '2026-07-15',
  '/contact/': '2026-07-15',
  '/privacy/': '2026-07-15',
});

export const legacyRedirects = Object.freeze({
  '/about.html': '/about/',
  '/companies.html': '/ventures/',
  '/essays.html': '/thinking/',
  '/publications.html': '/media/',
  '/profiles.html': '/facts/',
  '/essays/why-i-left-swiggy/': '/essays/why-i-chose-to-build-in-pharmaceuticals/',
  '/essays/from-swiggy-to-mhra/': '/essays/why-i-chose-to-build-in-pharmaceuticals/',
});

export const physicalAliases = Object.freeze({
  '/index.html': '/',
});

export const defaultSocialImage = '/images/social/default-og.jpg';

export const pageMeta = Object.freeze({
  home: {
    title: 'Vishal Chakravarty — Pharmaceutical Founder & CEO',
    description:
      'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd, building across pharmaceutical market access, specialist medicines, manufacturing partnerships and cross-border supply.',
    path: '/',
    modified: routeModified['/'],
  },
  thinking: {
    title: 'Pharmaceutical Strategy Essays — Vishal Chakravarty',
    description:
      'Essays by Vishal Chakravarty on pharmaceutical market access, product strategy, manufacturing, technology transfer, supply and founder execution.',
    path: '/thinking/',
    modified: routeModified['/thinking/'],
  },
});

export const absolute = (path) => new URL(path, site.origin).href;
