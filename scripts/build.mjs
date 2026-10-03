import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadArticles, loadPageContent } from '../src/lib/content.mjs';
import { canonicalRoutes, legacyRedirects, routeModified } from '../src/data/site.mjs';
import { company, person, publicFacts, publications, site, verificationDate } from '../src/data/entity.mjs';
import { contentVariables } from '../src/data/content-variables.mjs';
import {
  renderAbout,
  renderArticle,
  renderCompatibility,
  renderContact,
  renderFacts,
  renderHome,
  renderMedia,
  renderNotFound,
  renderPrivacy,
  renderSpeaking,
  renderThinking,
  renderVentures,
} from '../src/components/views.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const write = (relative, content) => {
  const destination = path.join(dist, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content.endsWith('\n') ? content : `${content}\n`);
};

const writeBinary = (relative, content) => {
  const destination = path.join(dist, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
};

const routeFile = (route) => {
  if (route === '/') return 'index.html';
  if (route.endsWith('.html')) return route.replace(/^\//, '');
  return path.join(route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
};

const xmlEscape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const articleSourceHtml = (article) =>
  article.sources.length
    ? `<section><h2>Sources</h2><ol>${article.sources.map((source) => `<li><a href="${xmlEscape(source.url)}" rel="noopener noreferrer">${xmlEscape(source.label)}</a></li>`).join('')}</ol></section>`
    : '';

const feedDescription = 'Essays on pharmaceutical market access, manufacturing, technology transfer, supply, portfolio strategy and founder execution.';

const jsonFeed = (articles) => ({
  version: 'https://jsonfeed.org/version/1.1',
  title: 'Thinking by Vishal Chakravarty',
  home_page_url: `${site.origin}/thinking/`,
  feed_url: `${site.origin}/feed.json`,
  description: feedDescription,
  authors: [{ name: person.name, url: `${site.origin}/about/` }],
  language: site.language,
  items: articles.map((article) => ({
    id: new URL(article.canonicalPath, site.origin).href,
    url: new URL(article.canonicalPath, site.origin).href,
    title: article.title,
    summary: article.summary,
    content_html: `${article.html}${articleSourceHtml(article)}`,
    date_published: `${article.published}T00:00:00Z`,
    date_modified: `${article.modified}T00:00:00Z`,
    authors: [{ name: person.name, url: `${site.origin}/about/` }],
    tags: [article.category],
    _reading_time_minutes: article.reading.minutes,
  })),
});

const rssFeed = (articles) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Thinking by Vishal Chakravarty</title>
    <link>${site.origin}/thinking/</link>
    <description>${xmlEscape(feedDescription)}</description>
    <language>en-gb</language>
    <atom:link href="${site.origin}/rss.xml" rel="self" type="application/rss+xml"/>
    ${articles.map((article) => `<item>
      <title>${xmlEscape(article.title)}</title>
      <link>${site.origin}${article.canonicalPath}</link>
      <guid isPermaLink="true">${site.origin}${article.canonicalPath}</guid>
      <pubDate>${new Date(`${article.published}T00:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${xmlEscape(person.name)}</dc:creator>
      <category>${xmlEscape(article.category)}</category>
      <description>${xmlEscape(article.summary)}</description>
      <content:encoded><![CDATA[${`${article.html}${articleSourceHtml(article)}`.replaceAll(']]>', ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`).join('\n    ')}
  </channel>
</rss>`;

const portraitImageXml = () => `
    <image:image>
      <image:loc>${xmlEscape(new URL(person.image.path, site.origin).href)}</image:loc>
      <image:title>${xmlEscape(person.image.name)}</image:title>
      <image:caption>${xmlEscape(person.image.description)}</image:caption>
    </image:image>`;

const sitemap = (articles) => {
  const staticEntries = canonicalRoutes.map((route) => ({ route, modified: routeModified[route] }));
  const articleEntries = articles.map((article) => ({ route: article.canonicalPath, modified: article.modified }));
  for (const entry of staticEntries) {
    if (!entry.modified) throw new Error(`Missing material lastmod date for ${entry.route}`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticEntries, ...articleEntries].map(({ route, modified }) => `  <url>
    <loc>${xmlEscape(new URL(route, site.origin).href)}</loc>
    <lastmod>${modified}</lastmod>${route === '/about/' ? portraitImageXml() : ''}
  </url>`).join('\n')}
</urlset>`;
};

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
write('assets/site.css', fs.readFileSync(path.join(root, 'src/styles/site.css'), 'utf8'));
write('assets/site.js', fs.readFileSync(path.join(root, 'src/scripts/site.js'), 'utf8'));
write('assets/route-cosmos.js', fs.readFileSync(path.join(root, 'src/scripts/route-cosmos.js'), 'utf8'));

const articles = loadArticles(root);
const pageContent = loadPageContent(root, contentVariables);
if (Object.keys(pageContent).length < 7) throw new Error('Expected the seven public page content records');

write('index.html', renderHome(articles));
write(routeFile('/about/'), renderAbout(pageContent.about));
write(routeFile('/ventures/'), renderVentures(pageContent.ventures));
write(routeFile('/thinking/'), renderThinking(articles));
write(routeFile('/media/'), renderMedia(pageContent.media));
write(routeFile('/speaking-partnerships/'), renderSpeaking(pageContent['speaking-partnerships']));
write(routeFile('/facts/'), renderFacts(pageContent.facts));
write(routeFile('/contact/'), renderContact(pageContent.contact));
write(routeFile('/privacy/'), renderPrivacy(pageContent.privacy));
write('404.html', renderNotFound());

for (const article of articles) {
  write(routeFile(article.canonicalPath), renderArticle(article, articles));
  write(routeFile(`/thinking/${article.slug}/`), renderCompatibility(`/thinking/${article.slug}/`, article.canonicalPath));
  for (const legacy of article.legacyPaths) {
    if (legacy.endsWith('/index.html')) continue;
    if (legacy !== article.canonicalPath) write(routeFile(legacy), renderCompatibility(legacy, article.canonicalPath));
  }
}

for (const [from, to] of Object.entries(legacyRedirects)) {
  write(routeFile(from), renderCompatibility(from, to));
}

write(
  'facts.json',
  JSON.stringify(
    {
      schemaVersion: 2,
      canonical: `${site.origin}/facts/`,
      lastReviewed: verificationDate,
      entityIds: {
        person: person.id,
        personalWebsite: site.id,
        profilePage: person.profileId,
        organization: company.id,
        organizationWebsite: company.websiteId,
      },
      person: {
        name: person.name,
        givenName: person.givenName,
        familyName: person.familyName,
        alternateName: person.alternateName,
        disambiguatingDescription: person.disambiguatingDescription,
        role: person.role,
        founderRelationship: person.founderRelationship,
        jobTitle: person.jobTitle,
        proposition: person.proposition,
        sameAs: person.sameAs,
      },
      answers: [
        {
          question: 'Who is Vishal Chakravarty?',
          answer: person.shortBio,
          source: `${site.origin}/about/`,
        },
        {
          question: 'What is NovaPharm Healthcare?',
          answer: company.description,
          source: `${site.origin}/ventures/`,
        },
        {
          question: 'What does Vishal Chakravarty work on?',
          answer: 'Pharmaceutical market access, specialist medicines, manufacturing partnerships, technology transfer, sourcing, supply and commercial route-to-market design.',
          source: `${site.origin}/facts/`,
        },
      ],
      company: {
        name: company.name,
        brandName: company.brandName,
        companyNumber: company.companyNumber,
        incorporated: company.incorporationDate,
        status: company.status,
        officialUrl: company.officialUrl,
        linkedInUrl: company.linkedInUrl,
        wikidataUrl: company.wikidataUrl,
        description: company.description,
        currentFocus: company.currentFocus,
      },
      publications,
      facts: publicFacts,
      correctionContact: site.correctionEmail,
    },
    null,
    2,
  ),
);
write('feed.json', JSON.stringify(jsonFeed(articles), null, 2));
write('rss.xml', rssFeed(articles));
write('sitemap.xml', sitemap(articles));

const outputFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else outputFiles.push(path.relative(dist, location));
  }
};
walk(dist);
console.log(`Built ${outputFiles.length} files from ${articles.length} essays.`);
