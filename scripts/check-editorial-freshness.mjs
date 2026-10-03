import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadArticles } from '../src/lib/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articles = loadArticles(root);
const today = new Date();
const day = 24 * 60 * 60 * 1000;

const regulatory = new Set(['Market access', 'Regulated markets']);
const operational = new Set([
  'Manufacturing',
  'Technology transfer',
  'Product economics',
  'Commercial strategy',
  'Supply strategy',
  'Pharmaceutical technology',
  'Specialist medicines',
  'Portfolio strategy',
]);

const failures = [];
const summary = [];

for (const article of articles) {
  const limit = regulatory.has(article.category) ? 90 : operational.has(article.category) ? 180 : null;
  if (!limit) {
    summary.push({ title: article.title, category: article.category, policy: 'substantive-change only' });
    continue;
  }

  const modified = new Date(`${article.modified}T00:00:00Z`);
  const ageDays = Math.floor((today - modified) / day);
  const remaining = limit - ageDays;
  summary.push({ title: article.title, category: article.category, ageDays, reviewCycleDays: limit, remainingDays: remaining });
  if (ageDays > limit) failures.push(`${article.title}: ${ageDays} days since review; ${limit}-day policy exceeded`);
}

console.log(JSON.stringify(summary, null, 2));
if (failures.length) {
  console.error('\nEditorial review required:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('Editorial freshness policy passed.');
