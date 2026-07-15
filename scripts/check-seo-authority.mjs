import fs from 'node:fs';
import path from 'node:path';
import { loadArticles } from '../src/lib/content.mjs';
import { canonicalRoutes, routeModified } from '../src/data/site.mjs';
import { company, person, site } from '../src/data/entity.mjs';
import { galleryImages, galleryMeta } from '../src/data/gallery.mjs';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const failures = [];
const read = (relative) => fs.readFileSync(path.join(dist, relative), 'utf8');

const facts = JSON.parse(read('facts.json'));
if (facts.schemaVersion !== 2) failures.push('facts.json must use schemaVersion 2');
if (facts.entityIds?.person !== person.id) failures.push('facts.json Person id drifted');
if (facts.entityIds?.personalWebsite !== site.id) failures.push('facts.json personal Website id drifted');
if (facts.entityIds?.profilePage !== person.profileId) failures.push('facts.json ProfilePage id drifted');
if (facts.entityIds?.organization !== company.id) failures.push('facts.json Organization id drifted');
if (facts.entityIds?.organizationWebsite !== company.websiteId) failures.push('facts.json corporate Website id drifted');

const sitemap = read('sitemap.xml');
for (const forbidden of ['<priority>', '<changefreq>', '/404.html', '/about.html', '/companies.html', '/essays.html', '/profiles.html', '/publications.html']) {
  if (sitemap.includes(forbidden)) failures.push(`sitemap contains forbidden value ${forbidden}`);
}
const urls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g)].map((match) => ({
  url: match[1],
  modified: match[2],
}));
const articles = loadArticles(root);
const expected = new Map([
  ...canonicalRoutes.map((route) => [new URL(route, site.origin).href, routeModified[route]]),
  ...articles.map((article) => [new URL(article.canonicalPath, site.origin).href, article.modified]),
]);
if (urls.length !== expected.size) failures.push(`sitemap expected ${expected.size} URLs, found ${urls.length}`);
for (const { url, modified } of urls) {
  if (!expected.has(url)) failures.push(`unexpected sitemap URL ${url}`);
  if (expected.get(url) !== modified) failures.push(`${url}: sitemap lastmod ${modified} does not match ${expected.get(url)}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(modified)) failures.push(`${url}: malformed lastmod ${modified}`);
}
for (const url of expected.keys()) {
  if (!urls.some((entry) => entry.url === url)) failures.push(`missing sitemap URL ${url}`);
}
if (!sitemap.includes(`xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`)) failures.push('sitemap image namespace missing');
if (!sitemap.includes(`<loc>${new URL(galleryMeta.path, site.origin).href}</loc>`)) failures.push('gallery page missing from sitemap');
for (const image of galleryImages) {
  if (!sitemap.includes(`<image:loc>${new URL(image.path, site.origin).href}</image:loc>`)) failures.push(`${image.id}: missing image sitemap entry`);
}

const robots = read('robots.txt');
const requiredRobots = [
  'User-agent: Googlebot\nAllow: /',
  'User-agent: Bingbot\nAllow: /',
  'User-agent: OAI-SearchBot\nAllow: /',
  'User-agent: GPTBot\nDisallow: /',
  'User-agent: Claude-SearchBot\nAllow: /',
  'User-agent: ClaudeBot\nDisallow: /',
  'User-agent: PerplexityBot\nAllow: /',
  'User-agent: Google-Extended\nDisallow: /',
  `Sitemap: ${site.origin}/sitemap.xml`,
];
for (const rule of requiredRobots) {
  if (!robots.includes(rule)) failures.push(`robots.txt is missing policy: ${rule.split('\n')[0]}`);
}

const llms = read('llms.txt');
if (!llms.includes('supplemental navigation aid')) failures.push('llms.txt must state its supplemental status');
if (!llms.includes(person.id) || !llms.includes(company.id)) failures.push('llms.txt canonical entity ids are incomplete');
if (!llms.includes(`${site.origin}${galleryMeta.path}`)) failures.push('llms.txt gallery route missing');

const textFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else textFiles.push(location);
  }
};
walk(dist);
const forbiddenPrivateExtensions = /\.(doc|docx|pdf|xls|xlsx|ppt|pptx|key|pages|numbers)$/i;
for (const file of textFiles) {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/');
  if (forbiddenPrivateExtensions.test(relative)) failures.push(`private-document file type in dist: ${relative}`);
  if (!/\.(html|css|js|json|xml|txt|svg|webmanifest)$/i.test(relative)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const forbidden of [
    'https://vishal.novapharmhealthcare.com/ventures/#novapharm-healthcare',
    'www.googletagmanager.com',
    'google-analytics.com',
    'connect.facebook.net',
    'snap.licdn.com',
    'static.hotjar.com',
  ]) {
    if (content.includes(forbidden)) failures.push(`${relative}: forbidden authority/privacy value ${forbidden}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Validated ${expected.size} canonical URLs, ${galleryImages.length} image sitemap entries, cross-site entity ownership, crawler policy and privacy-safe output.`);
