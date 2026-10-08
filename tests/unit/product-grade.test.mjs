import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve('dist');
const theme = fs.readFileSync(path.join(root, 'assets/product-grade-2026.css'), 'utf8');

test('portfolio product theme includes desktop mobile and reduced-motion rules', () => {
  for (const token of ['--product-blue:', '.institutional-home .executive-hero', '.page-hero-cosmic', '.site-header', '@media (max-width: 720px)', 'prefers-reduced-motion']) {
    assert.ok(theme.includes(token), 'Theme missing ' + token);
  }
});

test('theme is loaded once after baseline styles on every representative page', () => {
  for (const route of ['', 'about/', 'ventures/', 'thinking/', 'media/', 'facts/', 'contact/', 'privacy/']) {
    const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
    const ref = '<link rel="stylesheet" href="/assets/product-grade-2026.css">';
    assert.equal(html.split(ref).length - 1, 1, 'Theme count wrong on ' + route);
    const index = html.indexOf(ref);
    assert.ok(index > html.indexOf('/assets/site.css'), 'Theme before base on ' + route);
    const cosmos = html.indexOf('/assets/route-cosmos.css');
    if (cosmos >= 0) assert.ok(index > cosmos, 'Theme before cosmos on ' + route);
  }
});

test('the release preserves search indexing and identity foundations', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const about = fs.readFileSync(path.join(root, 'about/index.html'), 'utf8');
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const html of [home, about]) {
    assert.match(html, /rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
  }
  assert.match(about, /"@type":"ProfilePage"/);
  assert.match(home, /"@type":"Person"/);
  assert.match(robots, /User-agent: Googlebot\nAllow: \//);
  assert.match(sitemap, /https:\/\/vishal\.novapharmhealthcare\.com\/about\//);
});
