import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { contentVariables } from '../../src/data/content-variables.mjs';
import { loadArticles, loadPageContent, renderMarkdown } from '../../src/lib/content.mjs';

const root = path.resolve('.');

const requiredSlugs = [
  'why-i-chose-to-build-in-pharmaceuticals',
  'regulatory-approval-is-not-market-access',
  'route-to-market-before-launch',
  'supply-resilience-before-first-purchase-order',
  'choosing-a-cmo-for-regulated-markets',
  'technology-transfer-before-formula-moves',
  'minimum-batch-size-product-future',
  'how-to-win-when-odds-are-against-you',
  'regulated-industries',
  'what-parallel-import-actually-means',
];

test('loads the complete public founder authority collection', () => {
  const articles = loadArticles(root);
  const pages = loadPageContent(root, contentVariables);
  assert.equal(articles.length, requiredSlugs.length);
  assert.equal(Object.keys(pages).length, 7);
  assert.equal(new Set(articles.map((article) => article.canonicalPath)).size, requiredSlugs.length);
  for (const slug of requiredSlugs) assert.equal(articles.some((article) => article.slug === slug), true, slug);
  assert.equal(articles.some((article) => article.title === 'The Story Was Too Simple'), false);
});

test('renders allowlisted Markdown and escapes HTML', () => {
  const output = renderMarkdown('## A heading\n\nA **strong** idea with <script>alert(1)</script>.');
  assert.match(output, /<h2 id="a-heading">A heading<\/h2>/);
  assert.match(output, /<strong>strong<\/strong>/);
  assert.doesNotMatch(output, /<script>/);
  assert.match(output, /&lt;script&gt;/);
});

test('public article content excludes private evidence terms', () => {
  const content = loadArticles(root).map((article) => `${article.title}\n${article.body}`).join('\n');
  assert.doesNotMatch(content, /passport|date of birth|residential address|\bvisa\b|\bimmigration\b/i);
  assert.doesNotMatch(content, /MHRA[- ]licensed wholesaler|GDP[- ]certified supply chain/i);
});
