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
  assert.match(html, /<title>Vishal Chakravarty \| CEO, NovaPharm Healthcare<\/title>/);
  assert.match(html, /<link rel="alternate" hreflang="en-GB" href="https:\/\/vishal\.novapharmhealthcare\.com\/"/);
  assert.match(html, /<link rel="alternate" hreflang="x-default" href="https:\/\/vishal\.novapharmhealthcare\.com\/"/);
  assert.match(html, /<meta property="og:image:type" content="image\/webp">/);
  assert.match(html, /Building a UK-led pharmaceutical company around market access/);
  assert.match(html, /Chief Executive Officer · Founder of NovaPharm Healthcare Ltd/);
  assert.match(html, /id="nova-field"/);
  assert.doesNotMatch(html, /href="\/gallery\/"/);
  assert.doesNotMatch(html, /data-founder-ai/);
  assert.doesNotMatch(html, /Founder\s*(?:&|&amp;|and)\s*(?:Chief Executive Officer|CEO)/i);
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
  assert.deepEqual(facts.person.sameAs, [
    'https://www.linkedin.com/in/vishal-chakravarty',
    'https://www.wikidata.org/wiki/Q137660690',
    'https://find-and-update.company-information.service.gov.uk/officers/GCJvCvEf20rHFbzF_T9LKAGEJic/appointments',
    'https://novapharmhealthcare.com/leadership/vishal-chakravarty/',
  ]);
  assert.equal(facts.person.jobTitle, 'Chief Executive Officer');
  assert.equal(facts.person.givenName, 'Vishal');
  assert.equal(facts.person.familyName, 'Chakravarty');
  assert.equal(facts.person.alternateName, 'Vishal Om Prakash Chakravarty');
  assert.equal(facts.answers.length, 3);
  assert.equal(facts.answers.every((answer) => answer.source.startsWith('https://vishal.novapharmhealthcare.com/')), true);
  assert.equal(facts.entityIds.person, 'https://vishal.novapharmhealthcare.com/#person');
  assert.equal(facts.entityIds.personalWebsite, 'https://vishal.novapharmhealthcare.com/#website');
  assert.equal(facts.entityIds.profilePage, 'https://vishal.novapharmhealthcare.com/about/#profile');
  assert.equal(facts.entityIds.organization, 'https://novapharmhealthcare.com/#organization');
  assert.equal(facts.entityIds.organizationWebsite, 'https://novapharmhealthcare.com/#website');
  assert.equal(facts.company.linkedInUrl, 'https://www.linkedin.com/company/novapharm-healthcare/');
  assert.equal(facts.company.wikidataUrl, 'https://www.wikidata.org/wiki/Q137660644');
  assert.equal(facts.facts.length, 8);
  assert.equal(facts.facts.every((fact) => fact.publicSafe === true), true);
  assert.equal(facts.person.role, 'Chief Executive Officer, NovaPharm Healthcare Ltd');
  assert.equal(facts.person.founderRelationship, 'Founder of NovaPharm Healthcare Ltd');
  assert.equal(facts.facts.find((fact) => fact.id === 'P-017')?.approvedWording, 'Founder of NovaPharm Healthcare Ltd');
  assert.equal(
    facts.facts.find((fact) => fact.id === 'P-008')?.approvedWording,
    'His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.',
  );
  assert.equal(facts.facts.find((fact) => fact.id === 'P-008')?.status, 'VERIFIED_HISTORICAL');
  assert.equal(facts.facts.find((fact) => fact.id === 'M-002')?.status, 'VERIFIED_CURRENT');
  assert.equal(facts.facts.find((fact) => fact.id === 'M-004')?.value, 'Six publisher-hosted contributions');
  assert.equal(
    facts.facts.find((fact) => fact.id === 'P-020')?.sourceUrl,
    'https://iphex-india.com/exhibition/overseasdelegates_participating_list_2026',
  );
  assert.doesNotMatch(JSON.stringify(facts), /passport|birthDate|residential address|\bvisa\b|\bimmigration\b/i);
  assert.doesNotMatch(JSON.stringify(facts), /Founder\s*(?:&|and)\s*(?:Chief Executive Officer|CEO)/i);
});


test('about page exposes a concise human-readable entity snapshot', () => {
  const html = fs.readFileSync(path.resolve('dist/about/index.html'), 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
  assert.match(main, /At a glance/);
  assert.match(main, /Chief Executive Officer/);
  assert.match(main, /NovaPharm Healthcare Ltd/);
  assert.match(main, /Market access, manufacturing and resilient supply/);
  assert.match(html, /<meta property="og:type" content="profile">/);
  assert.match(html, /<meta property="profile:first_name" content="Vishal">/);
  assert.match(html, /<meta property="profile:last_name" content="Chakravarty">/);
});

test('media output exposes the complete verified publisher record', () => {
  const html = fs.readFileSync(path.resolve('dist/media/index.html'), 'utf8');
  const facts = JSON.parse(fs.readFileSync(path.resolve('dist/facts.json'), 'utf8'));
  assert.equal(facts.publications.length, 6);
  assert.match(html, /entry136963\.html/);
  assert.match(html, /entry136964\.html/);
  assert.match(html, /why-onshoring-alone-wont-secure-pharma-supply-chains/);
  assert.match(html, /dscsa-can-trace-a-package-it-cannot-tell-you-whether-the-next-one-will-arrive-/);
  assert.match(html, /6 publisher-hosted contributions are verified below/);
});

test('facts page exposes independent identity verification sources', () => {
  const html = fs.readFileSync(path.resolve('dist/facts/index.html'), 'utf8');
  assert.match(html, /Independent public records/);
  assert.match(html, /overseasdelegates_participating_list_2026/);
  assert.match(html, /entry136963\.html/);
  assert.match(html, /why-onshoring-alone-wont-secure-pharma-supply-chains/);
});

test('privacy output matches the approved minimal email flow', () => {
  const html = fs.readFileSync(path.resolve('dist/privacy/index.html'), 'utf8');
  assert.match(html, /does not use analytics, advertising trackers, a contact form or non-essential cookies/);
  assert.match(
    html,
    /Email enquiries are sent through the sender’s email provider and processed through the owner’s business email provider so they can be read, answered and managed\./,
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

test('profile keeps machine discovery in head metadata while preserving a human-facing body', () => {
  const html = fs.readFileSync(path.resolve('dist/facts/index.html'), 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
  assert.match(main, /Founder profile/);
  assert.doesNotMatch(main, /Machine-readable fact record|href="\/facts\.json"/i);
  assert.match(html, /<link rel="alternate" type="application\/json"[^>]+href="\/facts\.json">/);
});

test('retired essay routes use neutral compatibility output', () => {
  const html = fs.readFileSync(path.resolve('dist/essays/why-i-left-swiggy/index.html'), 'utf8');
  assert.match(html, /This page has moved/);
  assert.match(html, /why-i-chose-to-build-in-pharmaceuticals/);
  assert.match(html, /<meta http-equiv="refresh" content="0; url=\/essays\/why-i-chose-to-build-in-pharmaceuticals\/">/);
  assert.doesNotMatch(html, /The Story Was Too Simple|This is the correction/i);
});

test('retired gallery route redirects to the canonical founder profile', () => {
  const html = fs.readFileSync(path.resolve('dist/gallery/index.html'), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/vishal\.novapharmhealthcare\.com\/about\/">/);
  assert.match(html, /<meta http-equiv="refresh" content="0; url=\/about\/">/);
  assert.match(html, /This page has moved/);
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
