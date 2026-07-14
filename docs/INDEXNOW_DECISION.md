# IndexNow decision

Decision date: 14 July 2026
Status: Deferred, not implemented

## Decision

Do not add IndexNow automation in this phase.

## Reasoning

The current site is a small static founder platform with nine canonical pages and four essays. Material URL changes are expected to be infrequent. Implementing a key, diff-aware URL selection, post-deployment submission, retry handling and operational logging would add more release machinery than the present publishing cadence justifies.

The site already provides:

- canonical HTML;
- an automatically generated sitemap;
- Google Search Console verification preservation;
- documented Bing Webmaster submission;
- stable canonical URLs;
- RSS and JSON feeds.

A naive implementation that submits every URL after every deployment would violate the project’s restraint principle and would not affect Google indexing.

## Trigger for reconsideration

Reassess IndexNow when one or more conditions apply:

- at least four material content releases per month;
- frequent URL additions, removals or redirects;
- a larger corporate Insights system shares the deployment tooling;
- Bing discovery delay becomes measurable through Webmaster Tools;
- a secure post-deployment secret and monitoring process is approved.

## Required future design

Any future implementation must:

1. use a dedicated rotatable key;
2. host the verification file at the correct origin;
3. calculate changed canonical URLs from the production comparison, not submit all pages;
4. run only after successful production deployment, never on pull requests;
5. support dry-run and safe batching;
6. handle 200, 202, 400, 403, 422 and 429 responses;
7. avoid logging confidential values;
8. add automated tests and manual recovery instructions;
9. remain separate from Google URL Inspection and sitemap workflows.

## Current owner action

Verify the site in Bing Webmaster Tools and submit the sitemap. No IndexNow key or secret is required.
