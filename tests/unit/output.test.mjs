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
  assert.match(html, /<title>Vishal Chakravarty \| Pharmaceuticals, Market Access &amp; Company Building<\/title>/);
  assert.match(html, /<link rel="alternate" hreflang="en-GB" href="https:\/\/vishal\.novapharmhealthcare\.com\/"/);
  assert.match(html, /<link rel="alternate" hreflang="x-default" href="https:\/\/vishal\.novapharmhealthcare\.com\/"/);
  assert.match(html, /<meta property="og:image:type" content="image\/webp">/);
  assert.match(html, /Building a UK-led pharmaceutical company around market access/);
  assert.match(html, /Pharmaceuticals · Market access · Company building/);
  assert.match(html, /data-hubble-hero/);
  assert.match(html, /data-real-cosmos/);
  assert.match(html, /assets\.science\.nasa\.gov\/dynamicimage\/assets\/science\/missions\/hubble\/releases\/1999\/02\/STScI-01EVVFQ1NQ9XCZD9CFGJ1FJ822\.tif/);
  assert.match(html, /Hubble · Supernova 1987A · NASA\/ESA/);
  assert.doesNotMatch(html, /id="nova-field"/);
  assert.equal(fs.existsSync(path.resolve('dist/assets/nova-field.js')), false);
  assert.doesNotMatch(html, /href="\/gallery\/"/);
  assert.doesNotMatch(html, /data-founder-ai/);
  assert.doesNotMatch(html, /Founder\s*(?:&|&amp;|and)\s*(?:Chief Executive Officer|CEO)/i);
  assert.match(html, /<nav id="site-navigation"/);
  assert.doesNotMatch(html, /assets\/route-cosmos\.js/);
  assert.doesNotMatch(html, /assets\/route-cosmos\.css/);
  assert.doesNotMatch(html, /loading screen/i);
});

test('About retains NASA observation while operating routes use Nova-owned visuals', () => {
  const about = fs.readFileSync(path.resolve('dist/about/index.html'), 'utf8');
  assert.match(about, /data-page-cosmic-hero/);
  assert.match(about, /STScI-01EVT8DP1YM9FYPF0Y33VY7ANB\.tif/);
  assert.match(about, /Hubble · NGC 1300 · NASA\/ESA · Hubble Heritage Team/);

  for (const route of ['ventures', 'thinking', 'media', 'facts', 'contact']) {
    const html = fs.readFileSync(path.resolve('dist/' + route + '/index.html'), 'utf8');
    assert.match(html, /data-page-cosmic-hero/);
    assert.match(html, /page-cosmos-owned/);
    assert.match(html, /nova-signal-field/);
    assert.match(html, /Nova signal system/);
    assert.doesNotMatch(html, /assets\.science\.nasa\.gov/);
    assert.match(html, /<link rel="stylesheet" href="\/assets\/route-cosmos\.css">/);
    assert.match(html, /<script src="\/assets\/route-cosmos\.js" defer><\/script>/);
  }
});

test('route cosmos stylesheet is shipped as a route-only asset', () => {
  const file = path.resolve('dist/assets/route-cosmos.css');
  assert.equal(fs.existsSync(file), true);
  const stylesheet = fs.readFileSync(file, 'utf8');
  assert.match(stylesheet, /page-hero-cosmic/);
  assert.match(stylesheet, /page-hero-about/);
  assert.match(stylesheet, /about-hero-portrait/);
  assert.match(stylesheet, /page-hero-ventures/);
  assert.match(stylesheet, /page-hero-contact/);
  assert.match(stylesheet, /Nova-owned route visual system/);
  assert.match(stylesheet, /nova-signal-field/);
});

test('route cosmos controller is built as a route-only asset', () => {
  const file = path.resolve('dist/assets/route-cosmos.js');
  assert.equal(fs.existsSync(file), true);
  const script = fs.readFileSync(file, 'utf8');
  assert.match(script, /data-page-cosmic-hero/);
  assert.match(script, /requestAnimationFrame/);
});

test('unified design and publishing layers are shipped', () => {
  const home = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
  const about = fs.readFileSync(path.resolve('dist/about/index.html'), 'utf8');
  const ventures = fs.readFileSync(path.resolve('dist/ventures/index.html'), 'utf8');
  const css = fs.readFileSync(path.resolve('dist/assets/site.css'), 'utf8');
  const index = JSON.parse(fs.readFileSync(path.resolve('dist/content-index.json'), 'utf8'));
  const llms = fs.readFileSync(path.resolve('dist/llms.txt'), 'utf8');

  assert.match(home, /data-ui-layer="navigation"/);
  assert.match(home, /data-content-layer/);
  assert.doesNotMatch(home, /assets\/unified-system\.css/);
  assert.doesNotMatch(home, /assets\/content-fixes\.css/);
  assert.doesNotMatch(home, /assets\/apple-refresh\.css/);
  assert.equal((home.match(/rel="stylesheet"/g) ?? []).length, 1);
  assert.match(about, /class="page-section-index"/);
  assert.match(ventures, /class="route-summary"/);
  assert.match(ventures, /One route\. Connected decisions\./);
  assert.match(css, /Unified founder system/);
  assert.match(css, /--u-section/);
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.publisher.name, 'Vishal Chakravarty');
  assert.ok(index.pages.some((page) => page.canonical.endsWith('/ventures/')));
  assert.ok(index.essays.length >= 10);
  assert.match(llms, /Structured content index/);
  assert.doesNotMatch(llms, /passport|date of birth|residential address|\bvisa\b|\bimmigration\b/i);
});

test('content security policy permits only same-origin connections', () => {
  const html = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
  assert.match(html, /connect-src &#39;self&#39;; frame-src &#39;none&#39;/);
  assert.match(html, /img-src &#39;self&#39; data: https:\/\/assets\.science\.nasa\.gov/);
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
  assert.equal(
    facts.person.disambiguatingDescription,
    'Pharmaceutical executive and founder of NovaPharm Healthcare Ltd, a UK-registered pharmaceutical company.',
  );
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



test('visible executive title appears once, on About only', () => {
  const routes = [
    'index.html',
    'about/index.html',
    'ventures/index.html',
    'thinking/index.html',
    'media/index.html',
    'speaking-partnerships/index.html',
    'facts/index.html',
    'contact/index.html',
  ];
  const counts = routes.map((route) => {
    const html = fs.readFileSync(path.resolve('dist', route), 'utf8');
    const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
    return [route, (main.match(/Chief Executive Officer/g) ?? []).length];
  });
  assert.deepEqual(counts.filter(([, count]) => count > 0), [['about/index.html', 1]]);
});

test('thinking is organised into four durable authority topics', () => {
  const html = fs.readFileSync(path.resolve('dist/thinking/index.html'), 'utf8');
  for (const label of ['Market Access', 'Manufacturing &amp; Technology Transfer', 'Supply &amp; Resilience', 'Company Building']) {
    assert.ok(html.includes(label), label);
  }
  assert.match(html, /90-day cycle/);
  assert.match(html, /180-day cycle/);
});

test('contact offers intent-based email routes without a form', () => {
  const html = fs.readFileSync(path.resolve('dist/contact/index.html'), 'utf8');
  assert.match(html, /Pharmaceutical%20or%20commercial%20enquiry/);
  assert.match(html, /Manufacturing%20or%20partnership%20enquiry/);
  assert.match(html, /Media%20or%20speaking%20enquiry/);
  assert.doesNotMatch(html, /<form\b/i);
});

test('about page exposes a concise human-readable entity snapshot', () => {
  const html = fs.readFileSync(path.resolve('dist/about/index.html'), 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
  assert.match(main, /data-page-cosmic-hero/);
  assert.match(main, /STScI-01EVT8DP1YM9FYPF0Y33VY7ANB\.tif/);
  assert.match(main, /about-hero-portrait/);
  assert.match(main, /vishal-chakravarty-960\.webp/);
  assert.match(main, /Hubble · NGC 1300 · NASA\/ESA · Hubble Heritage Team/);
  assert.match(main, /Explore the work/);
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
  assert.match(main, /Public record/);
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
