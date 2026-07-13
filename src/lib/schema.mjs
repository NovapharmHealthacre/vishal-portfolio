import { company, person, publications, site, verificationDate } from '../data/entity.mjs';
import { absolute } from '../data/site.mjs';

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.origin}/#website`,
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
  image: {
    '@type': 'ImageObject',
    '@id': person.image.id,
    contentUrl: absolute('/images/portrait/vishal-chakravarty-960.jpg'),
    caption: person.image.alt,
    width: 960,
    height: 935,
  },
  jobTitle: 'Founder & CEO',
  worksFor: { '@id': company.id },
  description: person.shortBio,
  knowsAbout: person.knowsAbout,
  sameAs: person.sameAs,
});

export const profileSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${site.origin}/about/#profile`,
  url: `${site.origin}/about/`,
  name: 'About Vishal Chakravarty',
  dateModified: verificationDate,
  inLanguage: site.language,
  mainEntity: { '@id': person.id },
});

export const webPageSchema = ({ path, name, description, type = 'WebPage', mainEntity } = {}) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${absolute(path)}#page`,
  url: absolute(path),
  name,
  description,
  dateModified: verificationDate,
  inLanguage: site.language,
  isPartOf: { '@id': `${site.origin}/#website` },
  ...(mainEntity ? { mainEntity } : {}),
});

export const organisationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': company.id,
  name: company.name,
  legalName: company.legalName,
  identifier: company.companyNumber,
  foundingDate: company.incorporationDate,
  url: company.officialUrl,
  description: company.description,
  founder: { '@id': person.id },
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
  headline: article.title,
  description: article.description,
  datePublished: article.published,
  dateModified: article.modified,
  inLanguage: site.language,
  author: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
  publisher: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
  image: {
    '@type': 'ImageObject',
    url: absolute(article.socialImage),
    width: 1200,
    height: 630,
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
  dateModified: articles[0]?.modified ?? verificationDate,
  inLanguage: site.language,
  isPartOf: { '@id': `${site.origin}/#website` },
  mainEntity: {
    '@type': 'Blog',
    '@id': `${site.origin}/thinking/#blog`,
    name: 'Thinking by Vishal Chakravarty',
    author: { '@type': 'Person', '@id': person.id, name: person.name, url: `${site.origin}/about/` },
    blogPost: articles.map((article) => ({ '@type': 'BlogPosting', '@id': `${absolute(article.canonicalPath)}#article` })),
  },
});

export const mediaCollectionSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${site.origin}/media/#page`,
  url: `${site.origin}/media/`,
  name: 'Media and publications by Vishal Chakravarty',
  dateModified: verificationDate,
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
