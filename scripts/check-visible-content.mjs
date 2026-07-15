import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const publicFiles = [];

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (entry.name.endsWith('.html') || entry.name === 'rss.xml' || entry.name === 'feed.json') publicFiles.push(location);
  }
};

walk(dist);

const banned = [
  'Machine-readable fact record',
  'Regulatory boundary',
  'Not an operating claim',
  'What is deliberately absent',
  'The Story Was Too Simple',
  'This is the correction',
  'Invitations, not invented credentials',
  '40-word biography',
  '100-word biography',
  'for search engines and AI systems',
  'for readers, journalists and machines',
  'No X, Instagram, YouTube',
  'the company does not present itself',
  'this site does not present',
  'no customers are claimed',
  'Status before spectacle',
  'Evidence before assertion',
  'Proof belongs beside the claim',
  'Verified founder profile',
  'Entity record',
  'Public-safe record',
  'The old version',
  'The surviving evidence does not support',
  'The story is less dramatic now',
];

for (const file of publicFiles) {
  const relative = path.relative(dist, file);
  const content = fs.readFileSync(file, 'utf8');
  for (const phrase of banned) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) failures.push(`${relative}: banned visible phrase “${phrase}”`);
  }
  if (file.endsWith('.html')) {
    const plain = content.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
    const abstractTerms = ['evidence', 'verified', 'planned', 'claim'];
    const total = abstractTerms.reduce((sum, term) => sum + (plain.match(new RegExp(`\\b${term}\\w*\\b`, 'gi')) ?? []).length, 0);
    if (total > 18) failures.push(`${relative}: defensive vocabulary is overused (${total} instances)`);
  }
}

const feed = JSON.parse(fs.readFileSync(path.join(dist, 'feed.json'), 'utf8'));
const summaries = new Map();
for (const item of feed.items) {
  const key = item.summary.trim().toLowerCase();
  if (summaries.has(key)) failures.push(`feed.json: duplicate summary for ${item.url} and ${summaries.get(key)}`);
  summaries.set(key, item.url);
  if (/how to win|never give up|success mindset|unlock your potential/i.test(item.title)) {
    failures.push(`feed.json: motivational or generic title “${item.title}”`);
  }
}

const factsHtml = fs.readFileSync(path.join(dist, 'facts', 'index.html'), 'utf8');
if (factsHtml.includes('/facts.json')) failures.push('facts page: machine-readable JSON must not be promoted in the visitor interface');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Visible editorial content passed across ${publicFiles.length} public files and ${feed.items.length} essays.`);
