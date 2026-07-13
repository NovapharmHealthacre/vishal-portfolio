import fs from 'node:fs';
import path from 'node:path';
import { loadArticles, loadPageContent } from '../src/lib/content.mjs';
import { company, person, publicFacts, site } from '../src/data/entity.mjs';
import { contentVariables } from '../src/data/content-variables.mjs';

const root = path.resolve('.');
const articles = loadArticles(root);
const pages = loadPageContent(root, contentVariables);
const failures = [];
const seen = new Set();

if (articles.length !== 4) failures.push(`Expected 4 public essays, found ${articles.length}`);
if (Object.keys(pages).length !== 7) failures.push(`Expected 7 public page records, found ${Object.keys(pages).length}`);

for (const article of articles) {
  if (!article.canonicalPath.startsWith('/essays/') || !article.canonicalPath.endsWith('/')) failures.push(`${article.slug}: canonicalPath must preserve /essays/.../`);
  if (seen.has(article.canonicalPath)) failures.push(`${article.slug}: duplicate canonicalPath`);
  seen.add(article.canonicalPath);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.published) || !/^\d{4}-\d{2}-\d{2}$/.test(article.modified)) failures.push(`${article.slug}: invalid ISO date`);
  if (article.modified < article.published) failures.push(`${article.slug}: modified precedes published`);
  for (const source of article.sources) {
    if (!source.label || !/^https:\/\//.test(source.url)) failures.push(`${article.slug}: invalid source`);
  }
  if (!fs.existsSync(path.join(root, 'public', article.socialImage.replace(/^\//, '')))) failures.push(`${article.slug}: missing social image ${article.socialImage}`);
}

if (person.sameAs.length !== 1 || person.sameAs[0] !== site.linkedIn) failures.push('Person sameAs must contain verified LinkedIn only');
if (company.incorporationDate !== '2025-09-15') failures.push('Company incorporation date drift');
if (publicFacts.some((fact) => !fact.id || !fact.status || !fact.source || !fact.sourceDate || !fact.lastVerified || fact.publicSafe !== true || !fact.approvedWording || !fact.pages?.length)) failures.push('Malformed public fact');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Validated ${articles.length} essays, ${Object.keys(pages).length} pages and central entity data.`);
