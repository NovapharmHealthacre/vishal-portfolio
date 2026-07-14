import { company, person, profileModifiedDate, publications, site, verificationDate } from '../data/entity.mjs';
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
});

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': person.id,
  name: person.name,
  url: `${site.origin}/about/`,
  mainEntityOfPage: { '@id': person.profileId },
  image: {
    '@type': 'ImageObject',
    '@id': person.image.id,
    contentUrl: absolute('/images/portrait/vishal-chakravarty-960.jpg'),
    caption: person.image.alt,
    width: 960,
    height: 935,
    representativeOfPage: true,
  },
  jobTitle: person.jobTitle,
  worksFor: { '@id': company.id },
  description: person.shortBio,
  knowsAbout: person.knowsAbout,
  sameAs: person.sameAs,
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
  mainEntity: { '@id': person.id },
});

export const webPageSchema = ({ path, name, description, type = 'WebPage', mainEntity, dateModified } = {}) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${absolute(path)}#page`,
  url: absolute(path),
  name,
  description,
  dateModified: dateModified ?? routeModified[path] ?? verificationDate,
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  ...(mainEntity ? { mainEntity } : {}),
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
  sameAs: [company.companiesHouseUrl],
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
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
  description: 'Essays on regulated markets, pharmaceutical access, resilience and founder operations.',
  dateModified: articles[0]?.modified ?? routeModified['/thinking/'],
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  mainEntity: {
    '@type': 'Blog',
    '@id': `${site.origin}/thinking/#blog`,
    name: 'Thinking by Vishal Chakravarty',
    author: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
    publisher: { '@type': 'Person', '@id': person.id },
    blogPost: articles.map((article) => ({ '@type': 'BlogPosting', '@id': `${absolute(article.canonicalPath)}#article` })),
  },
});

export const mediaCollectionSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${site.origin}/media/#page`,
  url: `${site.origin}/media/`,
  name: 'Media and publications by Vishal Chakravarty',
  dateModified: routeModified['/media/'],
  inLanguage: site.language,
  isPartOf: { '@id': site.id },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: publications.length,
    itemListElement: publications.map((publication, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: publication.english,
      name: publication.title,
    })),
  },
});
