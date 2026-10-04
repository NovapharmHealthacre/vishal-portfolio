import { company, person, profileModifiedDate, publicAppearances, publicFacts, publications, site, verificationDate } from '../data/entity.mjs';
import { absolute, routeModified } from '../data/site.mjs';

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': site.id,
  url: `${site.origin}/`,
  name: site.name,
  description: site.description,
  inLanguage: site.language,
  publisher: { '@id': person.id },
  creator: { '@id': person.id },
  about: { '@id': person.id },
});

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': person.id,
  name: person.name,
  givenName: person.givenName,
  familyName: person.familyName,
  alternateName: person.alternateName,
  disambiguatingDescription: person.disambiguatingDescription,
  url: `${site.origin}/about/`,
  mainEntityOfPage: { '@id': person.profileId },
  image: {
    '@type': 'ImageObject',
    '@id': person.image.id,
    contentUrl: absolute(person.image.path),
    url: absolute(person.image.path),
    name: person.image.name,
    caption: person.image.alt,
    description: person.image.description,
    width: person.image.width,
    height: person.image.height,
    encodingFormat: 'image/webp',
    about: { '@id': person.id },
    representativeOfPage: true,
  },
  jobTitle: person.jobTitle,
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Chief Executive Officer',
  },
  worksFor: { '@id': company.id },
  description: person.shortBio,
  knowsAbout: person.knowsAbout,
  sameAs: person.sameAs,
  subjectOf: [
    ...publications.map((publication) => ({
      '@type': 'Article',
      '@id': `${publication.english}#article`,
      url: publication.english,
      headline: publication.title,
      publisher: {
        '@type': 'Organization',
        name: publication.publisher,
        url: publication.publisherUrl,
      },
    })),
    ...publicFacts
      .filter((fact) => fact.id === 'P-020' && fact.sourceUrl)
      .map((fact) => ({
        '@type': 'WebPage',
        '@id': `${fact.sourceUrl}#vishal-chakravarty`,
        url: fact.sourceUrl,
        name: fact.label,
      })),
  ],
});

export const profileSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': person.profileId,
  url: `${site.origin}/about/`,
  name: 'About Vishal Chakravarty',
  dateModified: profileModifiedDate,
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  breadcrumb: { '@id': `${site.origin}/about/#breadcrumb` },
  mainEntity: { '@id': person.id },
  primaryImageOfPage: { '@id': person.image.id },
});

export const webPageSchema = ({ path, name, description, type = 'WebPage', mainEntity, primaryImage, dateModified } = {}) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${absolute(path)}#page`,
  url: absolute(path),
  name,
  description,
  dateModified: dateModified ?? routeModified[path] ?? verificationDate,
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  ...(path !== '/' ? { breadcrumb: { '@id': `${absolute(path)}#breadcrumb` } } : {}),
  ...(mainEntity ? { mainEntity } : {}),
  ...(primaryImage ? { primaryImageOfPage: primaryImage } : {}),
});

export const organisationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': company.id,
  name: company.name,
  alternateName: company.brandName,
  legalName: company.legalName,
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Companies House company number',
    value: company.companyNumber,
  },
  foundingDate: company.incorporationDate,
  url: company.officialUrl,
  description: company.description,
  founder: { '@id': person.id },
  sameAs: [company.companiesHouseUrl, company.linkedInUrl, company.wikidataUrl],
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${absolute(items.at(-1)?.path ?? '/')}#breadcrumb`,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absolute(item.path),
  })),
});

export const articleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${absolute(article.canonicalPath)}#article`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${absolute(article.canonicalPath)}#page` },
  isPartOf: { '@id': `${site.origin}/thinking/#blog` },
  headline: article.title,
  description: article.description,
  datePublished: article.published,
  dateModified: article.modified,
  inLanguage: site.language,
  author: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
  publisher: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
  image: {
    '@type': 'ImageObject',
    '@id': `${absolute(article.socialImage)}#image`,
    contentUrl: absolute(article.socialImage),
    caption: `Social card for “${article.title}”, an essay by ${person.name}`,
    width: 1200,
    height: 630,
    representativeOfPage: true,
  },
  articleSection: article.category,
  wordCount: article.reading.words,
  isAccessibleForFree: true,
});

export const thinkingCollectionSchema = (articles) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${site.origin}/thinking/#page`,
  url: `${site.origin}/thinking/`,
  name: 'Thinking by Vishal Chakravarty',
  description: 'Essays on regulated markets, pharmaceutical access, resilience and company building.',
  dateModified: articles[0]?.modified ?? routeModified['/thinking/'],
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  breadcrumb: { '@id': `${site.origin}/thinking/#breadcrumb` },
  mainEntity: {
    '@type': 'Blog',
    '@id': `${site.origin}/thinking/#blog`,
    name: 'Thinking by Vishal Chakravarty',
    author: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
    publisher: { '@type': 'Person', '@id': person.id },
    blogPost: articles.map((article) => ({ '@type': 'BlogPosting', '@id': `${absolute(article.canonicalPath)}#article` })),
  },
});

export const appearanceEventSchema = (appearance) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  '@id': `${site.origin}/media/#${appearance.id}-event`,
  name: appearance.name,
  description: appearance.summary,
  startDate: appearance.startDate,
  endDate: appearance.endDate,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: appearance.eventStatus,
  url: appearance.officialUrl,
  sameAs: [...new Set([appearance.officialUrl, appearance.verificationUrl].filter(Boolean))],
  location: {
    '@type': 'Place',
    name: appearance.location,
  },
  organizer: {
    '@type': 'Organization',
    name: appearance.organizer,
    ...(appearance.organizerUrl ? { url: appearance.organizerUrl } : {}),
  },
  attendee: { '@id': person.id },
  ...(appearance.images.length ? { image: appearance.images.map((image) => absolute(image)) } : {}),
});

export const iphex2026EventSchema = () =>
  appearanceEventSchema(publicAppearances.find((appearance) => appearance.id === 'iphex-2026'));

export const appearanceEventSchemas = () => publicAppearances.map(appearanceEventSchema);

export const mediaCollectionSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${site.origin}/media/#page`,
  url: `${site.origin}/media/`,
  name: 'Media and publications by Vishal Chakravarty',
  dateModified: routeModified['/media/'],
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  breadcrumb: { '@id': `${site.origin}/media/#breadcrumb` },
  image: [
    {
      '@type': 'ImageObject',
      url: absolute('/images/media/vishal-chakravarty-iphex-2026-working.webp'),
      caption: 'Vishal Chakravarty reviewing meeting material during iPHEX 2026.',
      width: 440,
      height: 550,
    },
  ],
  hasPart: publicAppearances.map((appearance) => ({ '@id': `${site.origin}/media/#${appearance.id}-event` })),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: publications.length,
    itemListElement: publications.map((publication, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: publication.english,
      name: publication.title,
      item: {
        '@type': 'Article',
        '@id': `${publication.english}#article`,
        url: publication.english,
        headline: publication.title,
        description: publication.abstract,
        datePublished: publication.date,
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': person.id, name: person.name },
        publisher: {
          '@type': 'Organization',
          name: publication.publisher,
          url: publication.publisherUrl,
        },
      },
    })),
  },
});
