import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('production output preserves ownership and custom-domain files', () => {
  assert.equal(fs.readFileSync(path.resolve('dist/CNAME'), 'utf8').trim(), 'vishal.novapharmhealthcare.com');
  assert.equal(
    fs.readFileSync(path.resolve('dist/googlef9cdfdd63c360d56.html'), 'utf8').trim(),
    'google-site-verification: googlef9cdfdd63c360d56.html',
  );
});

test('essential homepage content exists before JavaScript', () => {
  const html = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
  assert.match(html, /<h1 id="hero-title">/);
  assert.match(html, /Founder and operator working on more resilient access/);
  assert.match(html, /<nav id="site-navigation"/);
  assert.doesNotMatch(html, /loading screen/i);
});

test('generated portrait files are metadata-stripped derivatives', () => {
  const privateMetadataMarkers = ['Canon', 'LensSerialNumber', 'CameraSerialNumber', 'Snapseed', '2024:12:10'];
  const source = fs.readFileSync(path.resolve('src/assets/vishal-headshot-original.jpg'));
  for (const marker of privateMetadataMarkers) assert.equal(source.includes(Buffer.from(marker)), false, marker);
  for (const width of [640, 960, 1440]) {
    for (const extension of ['avif', 'webp', 'jpg']) {
      const file = path.resolve(`dist/images/portrait/vishal-chakravarty-${width}.${extension}`);
      assert.ok(fs.existsSync(file), file);
      assert.ok(fs.statSync(file).size > 3000, file);
      const image = fs.readFileSync(file);
      for (const marker of privateMetadataMarkers) assert.equal(image.includes(Buffer.from(marker)), false, `${file}: ${marker}`);
    }
  }
});
