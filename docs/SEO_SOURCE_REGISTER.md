# SEO source register

Reviewed: 14 July 2026

This register records the official guidance used for the post-launch SEO and entity-authority phase. Third-party SEO blogs are not treated as technical authority.

| Topic | Official source | Guidance used | Implementation decision | Owner action | Review |
|---|---|---|---|---|---|
| Search essentials | Google Search Central, `developers.google.com/search/docs/essentials` | Build useful, people-first, crawlable content and avoid manipulative practices. | Preserve semantic HTML, factual claims, stable URLs and no hidden or doorway content. | None. | Quarterly |
| AI features in Search | Google Search Central, `developers.google.com/search/docs/appearance/ai-features` | Normal SEO fundamentals apply; content should be accurate, relevant and useful. | No separate AI-only content layer. Human-readable pages remain canonical. | None. | Quarterly |
| ProfilePage | Google Search Central, `developers.google.com/search/docs/appearance/structured-data/profile-page` | An About Me page may use ProfilePage when one person is the primary focus; markup must match visible content. | `/about/` remains the canonical ProfilePage for Vishal. | Validate the deployed URL in Rich Results Test and URL Inspection after merge. | On material profile change |
| Organization markup | Google Search Central, `developers.google.com/search/docs/appearance/structured-data/organization` | Use accurate organisation identity data and consistent identifiers. | NovaPharm uses the corporate-domain `#organization` identifier; the personal site refers to it rather than creating a competing identity. | Corporate website should publish the same identifier. | Quarterly |
| Sitemaps | Google Search Central, `developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap` | Include canonical URLs and truthful last modification dates; sitemap inclusion does not guarantee indexing. | Generated sitemap contains only canonical pages and essays with material `lastmod`. | Submit in Search Console. | Monthly |
| Knowledge Panels | Google Knowledge Panel Help, `support.google.com/knowledgepanel/answer/9163198` | Panels are generated automatically from multiple sources and cannot be guaranteed by schema. | Build entity consistency without Wikipedia, Wikidata or directory manipulation. | Claim only if a correct panel appears. | Quarterly |
| Search Console | Google Search Console Help, `support.google.com/webmasters` | Verify ownership, submit sitemaps, inspect rendered pages and monitor indexing/security. | Existing verification file is preserved; owner actions are documented separately. | Complete owner checklist. | Weekly first month |
| Bing Webmaster | Microsoft Bing Webmaster documentation, `bing.com/webmasters/help` | Verify ownership, submit sitemaps and inspect crawl/index status. | Owner workflow documented; no credentials stored. | Verify/import property and submit sitemap. | Monthly |
| IndexNow | IndexNow, `indexnow.org/documentation` | Notify supporting engines only when URLs are created, changed or removed; protect the key and avoid spam. | Deferred for this small, low-frequency static site pending a clear operational benefit. | Reconsider if publishing cadence increases. | Six-monthly |
| OpenAI search crawler | OpenAI, `platform.openai.com/docs/bots` | OAI-SearchBot supports search discovery; GPTBot is separately used for model development; ChatGPT-User is user-triggered and robots rules may not apply. | Allow OAI-SearchBot, decline GPTBot, document ChatGPT-User separately. | Confirm training preference if it changes. | Quarterly |
| Anthropic crawlers | Anthropic, `support.anthropic.com/en/articles/8896518` | Claude-SearchBot, Claude-User and ClaudeBot have distinct purposes. | Allow search/user retrieval; decline model-development crawler. | None. | Quarterly |
| Perplexity crawlers | Perplexity, `docs.perplexity.ai/guides/bots` | PerplexityBot supports search; Perplexity-User is user-triggered and may not follow robots.txt. | Allow both as an expression of discovery intent and document limitations. | None. | Quarterly |
| Google-Extended | Google crawler documentation, `developers.google.com/search/docs/crawling-indexing/google-common-crawlers` | Google-Extended is independent from Google Search indexing controls. | Decline Google-Extended while allowing Googlebot. | Review owner preference periodically. | Quarterly |
| Accessibility | W3C WCAG 2.2 and WAI-ARIA Authoring Practices | Semantic HTML and native controls remain preferred; accessibility must be tested. | Preserve current WCAG 2.2 AA practices and browser/axe gates. | None. | Every visual change |
| Performance | web.dev Core Web Vitals | Target LCP ≤2.5s, INP <200ms and CLS <0.1 at the 75th percentile where measurable. | Existing release metrics remain regression baselines. | Monitor Search Console field data when available. | Monthly |
| GitHub Pages | GitHub Docs, `docs.github.com/pages` | Generated artifacts can be deployed through Actions with custom-domain safeguards. | No Pages, DNS or deployment changes in this phase. | None until an approved merge. | On workflow changes |

## Decision rule

When official guidance changes, the implementation must be reviewed before changing crawler access, structured data, indexing controls or verification files. Search-engine eligibility is not a promise of ranking, rich results, AI citations or a Knowledge Panel.
