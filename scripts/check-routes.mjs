import fs from 'node:fs';
import path from 'node:path';
import { canonicalRoutes, legacyRedirects, physicalAliases } from '../src/data/site.mjs';
import { loadArticles } from '../src/lib/content.mjs';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const articles = loadArticles(root);
const expected = new Set(['/', '/404.html', '/rss.xml', '/feed.json', '/facts.json', '/sitemap.xml', '/robots.txt', '/llms.txt', '/CNAME', '/googlef9cdfdd63c360d56.html', '/favicon.svg', '/manifest.webmanifest']);
canonicalRoutes.forEach((route) => expected.add(route));
Object.keys(legacyRedirects).forEach((route) => expected.add(route));
Object.keys(physicalAliases).forEach((route) => expected.add(route));
for (const article of articles) {
  expected.add(article.canonicalPath);
  expected.add(`/thinking/${article.slug}/`);
  article.legacyPaths.forEach((route) => expected.add(route));
}
const fileFor = (route) => {
  if (route === '/' || route === '/index.html') return path.join(dist, 'index.html');
  if (route.endsWith('/')) return path.join(dist, route, 'index.html');
  return path.join(dist, route);
};
const missing = [...expected].filter((route) => !fs.existsSync(fileFor(route)));
if (missing.length) {
  console.error(`Missing routes:\n${missing.join('\n')}`);
  process.exit(1);
}
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapRoutes = [...canonicalRoutes, ...articles.map((article) => article.canonicalPath)];
for (const route of sitemapRoutes) {
  const absolute = new URL(route, 'https://vishal.novapharmhealthcare.com').href;
  if (!sitemap.includes(absolute)) missing.push(`sitemap: ${absolute}`);
}
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSitemapUrls = sitemapRoutes.map((route) => new URL(route, 'https://vishal.novapharmhealthcare.com').href);
if (new Set(sitemapUrls).size !== sitemapUrls.length) missing.push('sitemap: duplicate URL');
for (const url of sitemapUrls) if (!expectedSitemapUrls.includes(url)) missing.push(`sitemap: unexpected URL ${url}`);

const facts = JSON.parse(fs.readFileSync(path.join(dist, 'facts.json'), 'utf8'));
if (facts['@context']) missing.push('facts.json: must be documented public-facts JSON, not pseudo JSON-LD');
if (facts.schemaVersion !== 2 || facts.canonical !== 'https://vishal.novapharmhealthcare.com/facts/') missing.push('facts.json: invalid contract');
if (facts.entityIds?.person !== 'https://vishal.novapharmhealthcare.com/#person') missing.push('facts.json: canonical Person id missing');
if (facts.entityIds?.organization !== 'https://novapharmhealthcare.com/#organization') missing.push('facts.json: canonical Organization id missing');

const feed = JSON.parse(fs.readFileSync(path.join(dist, 'feed.json'), 'utf8'));
if (feed.items.length !== articles.length) missing.push('feed.json: item count does not match public essays');
for (const article of articles.filter((candidate) => candidate.sources.length)) {
  const item = feed.items.find((candidate) => candidate.url.endsWith(article.canonicalPath));
  for (const source of article.sources) if (!item?.content_html.includes(source.url)) missing.push(`feed.json: ${article.slug} omits source ${source.url}`);
}

const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
const crawlerPolicy = new Map([
  ['Googlebot', 'Allow: /'],
  ['Bingbot', 'Allow: /'],
  ['OAI-SearchBot', 'Allow: /'],
  ['ChatGPT-User', 'Allow: /'],
  ['GPTBot', 'Disallow: /'],
  ['Claude-SearchBot', 'Allow: /'],
  ['Claude-User', 'Allow: /'],
  ['ClaudeBot', 'Disallow: /'],
  ['PerplexityBot', 'Allow: /'],
  ['Perplexity-User', 'Allow: /'],
  ['Google-Extended', 'Disallow: /'],
  ['CCBot', 'Disallow: /'],
]);
for (const [agent, expectedRule] of crawlerPolicy) {
  const escaped = agent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = robots.match(new RegExp(`User-agent: ${escaped}\\n([\\s\\S]*?)(?=\\nUser-agent:|\\nSitemap:|$)`));
  if (!block) missing.push(`robots.txt: missing explicit ${agent} policy`);
  else if (!block[1].split('\n').map((line) => line.trim()).includes(expectedRule)) {
    missing.push(`robots.txt: ${agent} must contain ${expectedRule}`);
  }
}
if (/^Crawl-delay:/im.test(robots)) missing.push('robots.txt: Crawl-delay is not part of the approved policy');
if (!robots.includes('Sitemap: https://vishal.novapharmhealthcare.com/sitemap.xml')) missing.push('robots.txt: canonical sitemap directive missing');
if (missing.length) {
  console.error(missing.join('\n'));
  process.exit(1);
}
console.log(`Verified ${expected.size} canonical, legacy and machine-readable routes.`);
