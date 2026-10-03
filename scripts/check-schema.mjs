import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const origin = 'https://vishal.novapharmhealthcare.com';
const personId = `${origin}/#person`;
const websiteId = `${origin}/#website`;
const profileId = `${origin}/about/#profile`;
const organizationId = 'https://novapharmhealthcare.com/#organization';
const htmlFiles = [];
const failures = [];
const titles = new Map();
const descriptions = new Map();

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (entry.name.endsWith('.html')) htmlFiles.push(location);
  }
};

const routeFor = (relative) => {
  const normalised = relative.replaceAll(path.sep, '/');
  if (normalised === 'index.html') return '/';
  if (normalised.endsWith('/index.html')) return `/${normalised.slice(0, -'index.html'.length)}`;
  return `/${normalised}`;
};

const matches = (html, expression) => [...html.matchAll(expression)];

walk(dist);

for (const file of htmlFiles) {
  const rel = path.relative(dist, file);
  if (rel === 'googlef9cdfdd63c360d56.html') continue;
  const route = routeFor(rel);
  const html = fs.readFileSync(file, 'utf8');
  const titleMatches = matches(html, /<title>([^<]+)<\/title>/g);
  const descriptionMatches = matches(html, /<meta name="description" content="([^"]+)"/g);
  const canonicalMatches = matches(html, /<link rel="canonical" href="([^"]+)"/g);
  const robotsMatches = matches(html, /<meta name="robots" content="([^"]+)"/g);
  const noIndex = robotsMatches[0]?.[1].includes('noindex') ?? false;

  if (titleMatches.length !== 1 || descriptionMatches.length !== 1 || canonicalMatches.length !== 1 || robotsMatches.length !== 1) {
    failures.push(`${rel}: expected one title, description, canonical and robots directive`);
    continue;
  }

  const title = titleMatches[0][1];
  const description = descriptionMatches[0][1];
  const canonical = canonicalMatches[0][1];
  let canonicalUrl;
  try {
    canonicalUrl = new URL(canonical);
  } catch {
    failures.push(`${rel}: malformed canonical ${canonical}`);
  }
  if (canonicalUrl && canonicalUrl.origin !== origin) failures.push(`${rel}: canonical is off-origin`);
  if (canonicalUrl && canonicalUrl.protocol !== 'https:') failures.push(`${rel}: canonical is not HTTPS`);
  if (canonicalUrl && !noIndex && canonicalUrl.pathname !== '/' && !canonicalUrl.pathname.endsWith('/')) failures.push(`${rel}: canonical lacks trailing slash`);
  if (canonicalUrl && canonicalUrl.pathname !== canonicalUrl.pathname.toLowerCase()) failures.push(`${rel}: canonical path must be lowercase`);
  if (!noIndex && canonical !== new URL(route, origin).href) failures.push(`${rel}: canonical does not match its generated route`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${rel}: expected exactly one H1`);
  if (!/<meta property="og:image:alt" content="[^"]+"/.test(html)) failures.push(`${rel}: missing og:image:alt`);
  if (!/<meta property="og:image:secure_url" content="https:\/\//.test(html)) failures.push(`${rel}: missing secure Open Graph image URL`);
  if (!/<meta property="og:image:type" content="image\/(?:jpeg|png|webp)"/.test(html)) failures.push(`${rel}: missing Open Graph image type`);
  if (!/<meta name="twitter:image:alt" content="[^"]+"/.test(html)) failures.push(`${rel}: missing twitter:image:alt`);
  const languageAlternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  for (const hreflang of ['en-GB', 'x-default']) {
    const alternate = languageAlternates.find((match) => match[1] === hreflang);
    if (!alternate) failures.push(`${rel}: missing ${hreflang} language alternate`);
    else if (alternate[2] !== canonical) failures.push(`${rel}: ${hreflang} alternate must match canonical`);
  }

  if (!noIndex) {
    if (titles.has(title)) failures.push(`${rel}: duplicate title with ${titles.get(title)}`);
    if (descriptions.has(description)) failures.push(`${rel}: duplicate description with ${descriptions.get(description)}`);
    titles.set(title, rel);
    descriptions.set(description, rel);
  } else if (robotsMatches[0][1] !== 'noindex,follow') {
    failures.push(`${rel}: noindex route must use noindex,follow`);
  }

  const schemas = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      schemas.push(schema);
      const serialised = JSON.stringify(schema);
      for (const forbidden of ['nationality', 'birthDate', 'address', 'telephone', 'aggregateRating', 'review', 'award']) {
        if (new RegExp(`"${forbidden}"`).test(serialised)) failures.push(`${rel}: forbidden schema property ${forbidden}`);
      }
      if (schema['@context'] !== 'https://schema.org') failures.push(`${rel}: JSON-LD lacks Schema.org context`);
    } catch (error) {
      failures.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }

  const topTypes = new Set(schemas.flatMap((schema) => Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]));
  const requireType = (type) => {
    if (!topTypes.has(type)) failures.push(`${rel}: missing ${type} structured data`);
  };

  if (!noIndex) {
    if (route === '/') ['WebSite', 'Person', 'WebPage'].forEach(requireType);
    else if (route === '/about/') ['ProfilePage', 'Person', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/ventures/') ['WebPage', 'Organization', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/thinking/') ['CollectionPage', 'BreadcrumbList'].forEach(requireType);
    else if (route.startsWith('/essays/')) ['WebPage', 'BlogPosting', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/media/') ['CollectionPage', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/facts/') ['WebPage', 'Person', 'Organization', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/contact/') ['ContactPage', 'BreadcrumbList'].forEach(requireType);
    else if (route === '/privacy/' || route === '/speaking-partnerships/') ['WebPage', 'BreadcrumbList'].forEach(requireType);
  }

  for (const schema of schemas) {
    const serialised = JSON.stringify(schema);
    if (serialised.includes(`${origin}/ventures/#novapharm-healthcare`)) {
      failures.push(`${rel}: legacy competing NovaPharm organization id remains`);
    }
  }

  const website = schemas.find((schema) => schema['@type'] === 'WebSite');
  if (website) {
    if (website['@id'] !== websiteId) failures.push(`${rel}: WebSite id is not canonical`);
    if (website.publisher?.['@id'] !== personId) failures.push(`${rel}: personal WebSite publisher must be Vishal`);
    if (website.creator?.['@id'] !== personId || website.about?.['@id'] !== personId) failures.push(`${rel}: WebSite creator/about must reference Vishal`);
  }

  const person = schemas.find((schema) => schema['@type'] === 'Person');
  if (person) {
    if (person['@id'] !== personId) failures.push(`${rel}: Person id is not canonical`);
    if (person.jobTitle !== 'Chief Executive Officer') failures.push(`${rel}: Person jobTitle must use the approved executive designation`);
    if (person.givenName !== 'Vishal' || person.familyName !== 'Chakravarty') failures.push(`${rel}: Person name parts are incomplete`);
    if (person.alternateName !== 'Vishal Om Prakash Chakravarty') failures.push(`${rel}: Person alternate identity is incomplete`);
    for (const sameAs of [
      'https://www.linkedin.com/in/vishal-chakravarty',
      'https://www.wikidata.org/wiki/Q137660690',
      'https://find-and-update.company-information.service.gov.uk/officers/GCJvCvEf20rHFbzF_T9LKAGEJic/appointments',
      'https://novapharmhealthcare.com/leadership/vishal-chakravarty/',
      'https://www.crunchbase.com/person/vishal-chakravarty',
    ]) {
      if (!person.sameAs?.includes(sameAs)) failures.push(`${rel}: Person sameAs missing ${sameAs}`);
    }
    if (person.hasOccupation?.name !== 'Chief Executive Officer') failures.push(`${rel}: Person occupation is incomplete`);
    if (person.worksFor?.['@id'] !== organizationId) failures.push(`${rel}: Person worksFor must reference the corporate canonical id`);
  }

  const organization = schemas.find((schema) => schema['@type'] === 'Organization');
  if (organization) {
    if (organization['@id'] !== organizationId) failures.push(`${rel}: Organization id is not canonical to the company domain`);
    if (organization.founder?.['@id'] !== personId) failures.push(`${rel}: Organization founder must reference Vishal`);
    for (const sameAs of [
      'https://find-and-update.company-information.service.gov.uk/company/16716501',
      'https://www.linkedin.com/company/novapharm-healthcare/',
      'https://www.crunchbase.com/organization/novapharm-healthcare',
    ]) {
      if (!organization.sameAs?.includes(sameAs)) failures.push(`${rel}: Organization sameAs missing ${sameAs}`);
    }
  }

  if (!noIndex && route !== '/') {
    const breadcrumb = schemas.find((schema) => schema['@type'] === 'BreadcrumbList');
    const expectedBreadcrumbId = `${new URL(route, origin).href}#breadcrumb`;
    if (breadcrumb?.['@id'] !== expectedBreadcrumbId) failures.push(`${rel}: BreadcrumbList id is not canonical`);
    const pageNode = schemas.find((schema) => ['WebPage', 'ContactPage', 'CollectionPage', 'ProfilePage'].includes(schema['@type']));
    if (pageNode && pageNode.breadcrumb?.['@id'] !== expectedBreadcrumbId) failures.push(`${rel}: page node does not reference its BreadcrumbList`);
  }

  if (route === '/about/') {
    const profile = schemas.find((schema) => schema['@type'] === 'ProfilePage');
    if (profile?.['@id'] !== profileId) failures.push(`${rel}: ProfilePage id is not canonical`);
    if (profile?.url !== `${origin}/about/`) failures.push(`${rel}: ProfilePage URL does not describe this page`);
    if (profile?.mainEntity?.['@id'] !== personId) failures.push(`${rel}: ProfilePage mainEntity must reference Vishal`);
    if (!/<meta property="og:type" content="profile"/.test(html)) failures.push(`${rel}: About page must use Open Graph profile type`);
    if (!/<meta property="profile:first_name" content="Vishal"/.test(html) || !/<meta property="profile:last_name" content="Chakravarty"/.test(html)) failures.push(`${rel}: profile Open Graph name fields missing`);
  }
  if (route === '/facts/' && schemas.some((schema) => schema['@type'] === 'ProfilePage')) {
    failures.push(`${rel}: facts page must not emit the about-page ProfilePage node`);
  }
  if (!noIndex && route.startsWith('/essays/')) {
    const article = schemas.find((schema) => schema['@type'] === 'BlogPosting');
    if (!article?.author?.['@type'] || !article.author.name || !article.author.url) failures.push(`${rel}: Article author is incomplete`);
    if (article?.author?.['@id'] !== personId) failures.push(`${rel}: Article author must reference Vishal`);
    if (article?.publisher?.['@id'] !== personId) failures.push(`${rel}: Personal essay publisher must reference Vishal`);
    if (article?.image?.width !== 1200 || article?.image?.height !== 630) failures.push(`${rel}: Article ImageObject dimensions are incomplete`);
    if (!/<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}"/.test(html)) failures.push(`${rel}: article Open Graph published time missing`);
    if (!/<meta property="article:modified_time" content="\d{4}-\d{2}-\d{2}"/.test(html)) failures.push(`${rel}: article Open Graph modified time missing`);
    if (!/<meta property="article:author" content="https:\/\/vishal\.novapharmhealthcare\.com\/about\/"/.test(html)) failures.push(`${rel}: article Open Graph author missing`);
  }
  if (route === '/thinking/') {
    const collection = schemas.find((schema) => schema['@type'] === 'CollectionPage');
    if (collection?.mainEntity?.['@type'] !== 'Blog') failures.push(`${rel}: Thinking collection lacks its Blog entity`);
    if (collection?.mainEntity?.publisher?.['@id'] !== personId) failures.push(`${rel}: Blog publisher must reference Vishal`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Validated canonical metadata and semantic JSON-LD across ${htmlFiles.length} HTML files.`);
