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
  if (!/<meta name="twitter:image:alt" content="[^"]+"/.test(html)) failures.push(`${rel}: missing twitter:image:alt`);

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
  }

  const person = schemas.find((schema) => schema['@type'] === 'Person');
  if (person) {
    if (person['@id'] !== personId) failures.push(`${rel}: Person id is not canonical`);
    if (person.jobTitle !== 'Chief Executive Officer') failures.push(`${rel}: Person jobTitle must use the approved executive designation`);
    if (person.worksFor?.['@id'] !== organizationId) failures.push(`${rel}: Person worksFor must reference the corporate canonical id`);
  }

  const organization = schemas.find((schema) => schema['@type'] === 'Organization');
  if (organization) {
    if (organization['@id'] !== organizationId) failures.push(`${rel}: Organization id is not canonical to the company domain`);
    if (organization.founder?.['@id'] !== personId) failures.push(`${rel}: Organization founder must reference Vishal`);
  }

  if (route === '/about/') {
    const profile = schemas.find((schema) => schema['@type'] === 'ProfilePage');
    if (profile?.['@id'] !== profileId) failures.push(`${rel}: ProfilePage id is not canonical`);
    if (profile?.url !== `${origin}/about/`) failures.push(`${rel}: ProfilePage URL does not describe this page`);
    if (profile?.mainEntity?.['@id'] !== personId) failures.push(`${rel}: ProfilePage mainEntity must reference Vishal`);
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
