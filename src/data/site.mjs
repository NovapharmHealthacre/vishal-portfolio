import { site } from './entity.mjs';

export const navigation = Object.freeze([
  { href: '/about/', label: 'About' },
  { href: '/ventures/', label: 'Ventures' },
  { href: '/thinking/', label: 'Thinking' },
  { href: '/media/', label: 'Media' },
  { href: '/facts/', label: 'Facts' },
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

export const legacyRedirects = Object.freeze({
  '/about.html': '/about/',
  '/companies.html': '/ventures/',
  '/essays.html': '/thinking/',
  '/publications.html': '/media/',
  '/profiles.html': '/facts/',
  '/essays/from-swiggy-to-mhra/': '/essays/why-i-left-swiggy/',
});

export const physicalAliases = Object.freeze({
  '/index.html': '/',
});

export const defaultSocialImage = '/images/social/default-og.jpg';

export const pageMeta = Object.freeze({
  home: {
    title: 'Vishal Chakravarty — Founder & Operator',
    description:
      'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd, working on access, licensing and supply systems in regulated healthcare markets.',
    path: '/',
  },
  thinking: {
    title: 'Thinking — Essays by Vishal Chakravarty',
    description:
      'Essays on regulated markets, pharmaceutical access, resilience and the operating choices behind company building.',
    path: '/thinking/',
  },
});

export const absolute = (path) => new URL(path, site.origin).href;
