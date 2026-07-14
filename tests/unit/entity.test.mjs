import assert from 'node:assert/strict';
import test from 'node:test';
import { company, person, publications, site } from '../../src/data/entity.mjs';
import { articleSchema, organisationSchema, personSchema, websiteSchema } from '../../src/lib/schema.mjs';

const articleFixture = {
  title: 'Fixture essay',
  description: 'A structured-data fixture.',
  published: '2026-01-01',
  modified: '2026-01-02',
  canonicalPath: '/essays/fixture/',
  socialImage: '/images/social/default-og.jpg',
  category: 'Testing',
  reading: { words: 100, minutes: 1 },
};

test('entity facts match the verified ledger', () => {
  assert.equal(company.companyNumber, '16716501');
  assert.equal(company.incorporationDate, '2025-09-15');
  assert.equal(site.email, 'vishal@novapharmhealthcare.com');
  assert.equal(site.correctionEmail, site.email);
  assert.deepEqual(person.sameAs, [site.linkedIn]);
  assert.equal(publications.length, 3);
});

test('approved biography labels match their exact word counts', () => {
  assert.equal(person.shortBio.trim().split(/\s+/).length, 40);
  assert.equal(person.mediumBio.trim().split(/\s+/).length, 100);
  assert.match(
    person.mediumBio,
    /His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025\./,
  );
});

test('personal and corporate entities use non-competing canonical identifiers', () => {
  assert.equal(site.id, 'https://vishal.novapharmhealthcare.com/#website');
  assert.equal(person.id, 'https://vishal.novapharmhealthcare.com/#person');
  assert.equal(person.profileId, 'https://vishal.novapharmhealthcare.com/about/#profile');
  assert.equal(company.id, 'https://novapharmhealthcare.com/#organization');
  assert.equal(company.websiteId, 'https://novapharmhealthcare.com/#website');
  assert.equal(person.jobTitle, 'Chief Executive Officer');
});

test('schema relationships preserve personal authorship and corporate employment', () => {
  const website = websiteSchema();
  const personNode = personSchema();
  const organisation = organisationSchema();
  const article = articleSchema(articleFixture);

  assert.equal(website.publisher['@id'], person.id);
  assert.equal(personNode.worksFor['@id'], company.id);
  assert.equal(personNode.jobTitle, 'Chief Executive Officer');
  assert.equal(organisation.founder['@id'], person.id);
  assert.equal(article.author['@id'], person.id);
  assert.equal(article.publisher['@id'], person.id);
  assert.notEqual(article.publisher['@id'], company.id);
});

test('schema omits private and unsupported identity properties', () => {
  const serialised = JSON.stringify([personSchema(), organisationSchema()]);
  assert.doesNotMatch(serialised, /nationality|birthDate|address|telephone|Wikipedia|Wikidata/);
  assert.match(serialised, /2025-09-15/);
});
