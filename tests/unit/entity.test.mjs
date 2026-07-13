import assert from 'node:assert/strict';
import test from 'node:test';
import { company, person, publications, site } from '../../src/data/entity.mjs';
import { organisationSchema, personSchema } from '../../src/lib/schema.mjs';

test('entity facts match the verified ledger', () => {
  assert.equal(company.companyNumber, '16716501');
  assert.equal(company.incorporationDate, '2025-09-15');
  assert.deepEqual(person.sameAs, [site.linkedIn]);
  assert.equal(publications.length, 3);
});

test('approved biography labels match their exact word counts', () => {
  assert.equal(person.shortBio.trim().split(/\s+/).length, 40);
  assert.equal(person.mediumBio.trim().split(/\s+/).length, 100);
});

test('schema omits private and unsupported identity properties', () => {
  const serialised = JSON.stringify([personSchema(), organisationSchema()]);
  assert.doesNotMatch(serialised, /nationality|birthDate|address|telephone|Wikipedia|Wikidata/);
  assert.match(serialised, /2025-09-15/);
});
