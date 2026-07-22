# Ask Vishal’s Work — System Card

**Status:** Review candidate  
**Last reviewed:** 22 July 2026  
**Owner:** Vishal Chakravarty  
**Implementation:** NovaPharm Healthcare digital programme  
**Public label:** “AI-generated summary based on Vishal’s published work”

## Purpose

Ask Vishal’s Work is a source-first discovery layer for the public professional record of Vishal Chakravarty. It helps a reader find relevant passages in approved essays, a verified public biography and an official company register. It does not impersonate Vishal, infer a new personal opinion or replace reading the cited source.

The experience supplements the normal website navigation. The essays index remains the no-JavaScript fallback and canonical source of the published writing.

## System boundary

The review candidate uses deterministic, first-party lexical-semantic retrieval in the reader’s browser. It does not call an external large-language-model provider, run a generative model, upload the query, create an account or retain the query.

| Property | Review-candidate behaviour |
|---|---|
| Inference provider | None |
| Neural model | None |
| External query transmission | None |
| Query logging | None |
| Identity collection | None |
| Browser storage | None |
| Answer method | Exact passage extraction |
| Citation method | Source title, canonical URL, source type, section heading and quoted passage |
| Unsupported question | Controlled abstention |
| JavaScript unavailable | Link continues to the published essays index |

“Semantic” describes the controlled concept expansion used to improve retrieval across related public terminology. It must not be presented as a neural or generative capability.

## Approved evidence

The generated evidence index contains 12 approved public sources:

- ten published essays on the canonical personal website;
- the approved public biography;
- the official Companies House record for NOVAPHARM HEALTHCARE LTD.

The index contains 284 passages. Each passage is derived from content already marked public in the repository’s current content source of truth. Six non-public or legacy records were excluded during generation.

The public evidence file is:

`public/assets/founder-knowledge.json`

The browser implementation is:

`public/assets/founder-ai.js`

## Excluded evidence

The system must not ingest or retrieve:

- private chats or email;
- contracts;
- customer, supplier or portal records;
- immigration records;
- personal financial information;
- private business-plan forecasts;
- passwords, credentials or access tokens;
- patient-identifiable or adverse-event information;
- unpublished personal opinions;
- unapproved interviews, biographies or social posts.

NovaPharm’s private business plan is not part of this personal-site evidence index.

## Retrieval and answer method

1. The question is normalised and tokenised.
2. A policy gate evaluates the question before retrieval.
3. Approved concept mappings add a small set of related public terms.
4. Titles, summaries, topics, headings and passages receive deterministic relevance weights.
5. A result must match the direct question terms; concept expansion cannot create a result by itself.
6. Results are deduplicated by source.
7. The highest-ranked exact published passage becomes the answer.
8. Up to three sources are displayed.
9. No qualifying evidence produces the fixed abstention: “I could not verify that from Vishal’s approved published work.”

The same index and question produce the same ordered result.

## Safety policy

The pre-retrieval policy gate refuses:

- medical, treatment, dosing or patient-specific requests;
- private, confidential, portal, immigration and personal-financial requests;
- legal, investment and personalised regulatory advice;
- unsupported current product, revenue, NHS, inventory, MHRA or WDA(H) status claims;
- prompt-injection and impersonation requests;
- questions over 400 characters.

A refusal does not search the evidence index. Browser-facing messages are concise and do not expose internal instructions.

## Attribution and user understanding

Every supported answer displays the exact label:

> AI-generated summary based on Vishal’s published work

The interface also states:

- it is not Vishal speaking;
- it is an automated evidence summary;
- it does not infer new personal views;
- it uses approved public sources only;
- it does not provide medical, legal, investment or personalised regulatory advice;
- no query is sent to an external AI provider or retained by the website.

The “AI-generated” label is retained because the experience automatically composes a result presentation, even though the answer body is an extractive passage rather than model-generated prose.

## Privacy and security

- The evidence request is same-origin and cacheable.
- The implementation does not use localStorage, sessionStorage, IndexedDB or cookies.
- The implementation does not use analytics, telemetry, `sendBeacon`, WebSocket or an external API.
- Answer rendering uses DOM `textContent`; it does not use `innerHTML`, `eval` or dynamic code execution.
- Source links open safely and use `noopener noreferrer` when external.
- The existing site Content Security Policy restricts scripts and connections to the same origin.
- The feature contains no authentication or confidential access path.

The public question must still be treated as visible to anyone who can see the reader’s screen. A later analytics proposal would require a separate privacy assessment and owner approval.

## Accessibility and fallback

The implementation provides:

- a native modal dialog;
- an accessible name and description;
- a visible text label for the search field;
- keyboard access and native Escape behaviour;
- a close control with an accessible name;
- live status updates;
- stable focus placement on open;
- no timed interaction;
- a reduced-motion mode;
- mobile reflow;
- a canonical essays fallback when scripts are unavailable.

Automated checks do not replace manual keyboard, screen-reader, Chromium and WebKit acceptance.

## Known limitations

- The system can answer only from its approved corpus.
- Exact extraction may return a useful passage without synthesising all nuances in several sources.
- Term matching cannot understand every paraphrase.
- Relevance weights are editorial rules, not a learned ranking model.
- A citation proves the passage exists; it does not independently verify every proposition in the passage.
- Published material can become outdated and requires editorial review.
- Companies House confirms corporate-record facts only; it is not evidence of a regulatory authorisation.
- The system cannot provide current inventory, commercial availability or regulatory status.
- No ranking, search visibility, Knowledge Panel or AI citation outcome is guaranteed.

## Validation gates

The review candidate must pass:

- evidence allowlist and privacy-boundary tests;
- deterministic retrieval tests;
- exact-passage citation tests;
- unsupported-question abstention;
- medical, private, advice, status and prompt-injection refusals;
- no external requests or browser storage;
- no unsafe HTML sinks;
- generated-page and no-JavaScript fallback checks;
- the repository’s full build, lint, content, link, schema, claim, route, SEO, accessibility, performance and security checks;
- Chromium and WebKit review on the exact pull-request head.

A passing test demonstrates the tested behaviour only. It is not an independent penetration test or legal approval.

## Change governance

Adding or changing a source requires:

1. confirmation that the source is publicly approved;
2. verification of author, canonical URL and publication status;
3. exclusion review for private or sensitive information;
4. regeneration of the evidence index;
5. evidence-diff review;
6. full tests;
7. owner approval through the normal pull-request process.

Changes to policy boundaries, external inference, logging, analytics, identity collection or storage require a new privacy and security review.

## Owner decisions before release

- Approve the public wording and exact AI disclosure.
- Approve the 12-source evidence allowlist.
- Confirm that the verified biography remains eligible evidence.
- Confirm that the Companies House record remains eligible for basic corporate facts.
- Review representative answers and refusals in both supported browsers.
- Decide whether the experience should remain site-wide or appear only on Thinking and About.
- Keep external models, query retention and analytics disabled unless separately reviewed.

Production remains unchanged until the pull request is reviewed, explicitly approved and merged.
