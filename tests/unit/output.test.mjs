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

test('content security policy permits only same-origin connections', () => {
  const html = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
  assert.match(html, /connect-src &#39;self&#39;; frame-src &#39;none&#39;/);
  assert.doesNotMatch(html, /connect-src (?:\*|https?:|&#39;none&#39;)/);
});

test('public facts expose only approved public-safe records and canonical entity ids', () => {
  const facts = JSON.parse(fs.readFileSync(path.resolve('dist/facts.json'), 'utf8'));
  assert.equal(facts.schemaVersion, 2);
  assert.deepEqual(facts.person.sameAs, ['https://www.linkedin.com/in/vishal-chakravarty']);
  assert.equal(facts.person.jobTitle, 'Chief Executive Officer');
  assert.equal(facts.entityIds.person, 'https://vishal.novapharmhealthcare.com/#person');
  assert.equal(facts.entityIds.personalWebsite, 'https://vishal.novapharmhealthcare.com/#website');
  assert.equal(facts.entityIds.profilePage, 'https://vishal.novapharmhealthcare.com/about/#profile');
  assert.equal(facts.entityIds.organization, 'https://novapharmhealthcare.com/#organization');
  assert.equal(facts.entityIds.organizationWebsite, 'https://novapharmhealthcare.com/#website');
  assert.equal(facts.facts.length, 5);
  assert.equal(facts.facts.every((fact) => fact.publicSafe === true), true);
  assert.equal(
    facts.facts.find((fact) => fact.id === 'P-008')?.approvedWording,
    'His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.',
  );
  assert.equal(facts.facts.find((fact) => fact.id === 'P-008')?.status, 'VERIFIED_HISTORICAL');
  assert.doesNotMatch(JSON.stringify(facts), /passport|birthDate|residential address|\bvisa\b|\bimmigration\b/i);
});

test('privacy output matches the approved minimal email flow', () => {
  const html = fs.readFileSync(path.resolve('dist/privacy/index.html'), 'utf8');
  assert.match(html, /does not include analytics, advertising trackers, a contact form or non-essential cookies/);
  assert.match(
    html,
    /Email enquiries are sent through your email provider and processed through the owner&#39;s business email provider so the enquiry can be read, answered and managed\./,
  );
  assert.doesNotMatch(
    html,
    /(?:we|the owner) (?:retain|delete|never share|do not share)|(?:is|are) stored for \d+|will be automatically deleted|(?:our|the) (?:lawful|legal) basis is|we will not (?:disclose|share)/i,
  );
});

test('contact output uses the approved public inbox', () => {
  const html = fs.readFileSync(path.resolve('dist/contact/index.html'), 'utf8');
  assert.match(html, /mailto:vishal@novapharmhealthcare\.com/);
  assert.match(html, />vishal@novapharmhealthcare\.com</);
  assert.doesNotMatch(html, /vishal@novapharmhealthcare\.co\.uk/i);
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
