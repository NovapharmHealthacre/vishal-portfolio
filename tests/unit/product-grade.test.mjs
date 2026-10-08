import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve('dist');
const theme = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');

test('portfolio product theme includes desktop mobile and reduced-motion rules', () => {
  for (const token of ['--product-blue:', '.institutional-home .executive-hero', '.page-hero-cosmic', '.site-header', '@media (max-width: 720px)', 'prefers-reduced-motion']) {
    assert.ok(theme.includes(token), 'Theme missing ' + token);
  }
});

test('theme is loaded once after baseline styles on every representative page', () => {
  for (const route of ['', 'about/', 'ventures/', 'thinking/', 'media/', 'facts/', 'contact/', 'privacy/']) {
    const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
    assert.equal((html.match(/rel="stylesheet"/g) ?? []).length, route === '' || route === 'privacy/' ? 1 : 2, 'Unexpected stylesheet count ' + route);
    assert.ok(html.includes('/assets/site.css'), 'Missing unified stylesheet on ' + route);
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
  assert.match(about, /"@type"\s*:\s*"ProfilePage"/);
  assert.match(home, /"@type"\s*:\s*"Person"/);
  assert.match(robots, /User-agent: Googlebot\nAllow: \//);
  assert.match(sitemap, /https:\/\/vishal\.novapharmhealthcare\.com\/about\//);
});
