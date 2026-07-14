# Crawler policy register

Reviewed: 14 July 2026
Next scheduled review: 14 October 2026

| Crawler | Provider | Purpose | User-triggered | Training use | Rule | Official source |
|---|---|---|---|---|---|---|
| `Googlebot` | Google | Google Search crawling and indexing | No | No | Allow | Google common crawlers documentation |
| `Bingbot` | Microsoft | Bing Search crawling and indexing | No | No | Allow | Bing Webmaster documentation |
| `OAI-SearchBot` | OpenAI | Search discovery for ChatGPT search features | No | No | Allow | OpenAI bots documentation |
| `ChatGPT-User` | OpenAI | Fetch initiated by a ChatGPT user | Yes | No | Allow as stated intent; OpenAI notes robots may not apply | OpenAI bots documentation |
| `GPTBot` | OpenAI | Foundation-model development/training | No | Yes | Disallow | OpenAI bots documentation |
| `Claude-SearchBot` | Anthropic | Search discovery | No | No | Allow | Anthropic bot documentation |
| `Claude-User` | Anthropic | User-directed retrieval | Yes | No | Allow | Anthropic bot documentation |
| `ClaudeBot` | Anthropic | Model development | No | Yes | Disallow | Anthropic bot documentation |
| `PerplexityBot` | Perplexity | Search indexing and answer retrieval | No | Stated not to train foundation models | Allow | Perplexity crawler documentation |
| `Perplexity-User` | Perplexity | User-triggered page retrieval | Yes | No | Allow as stated intent; provider notes robots may be ignored | Perplexity crawler documentation |
| `Google-Extended` | Google | Control for certain Gemini training/grounding uses, separate from Google Search | No | AI-use control | Disallow | Google crawler documentation |
| `CCBot` | Common Crawl | Broad web corpus crawling | No | Corpus may support downstream model use | Disallow | Common Crawl bot documentation |
| `*` | Other | Public page discovery | Varies | Unknown | Allow public site | Site policy |

## Policy principles

1. Search discovery and model training are separate decisions.
2. Public HTML, CSS, JavaScript and images required for rendering are not blocked.
3. Robots.txt is not access control and contains no confidential path inventory.
4. Private information is excluded from the repository and protected by omission, not robots directives.
5. User-triggered agents may not follow robots.txt like automatic crawlers; comments document intent rather than promise enforcement.
6. The canonical sitemap is declared once.

## Change control

Before modifying a crawler rule:

- verify the exact user-agent in official documentation;
- record the crawler purpose and training implications;
- preserve ordinary Google/Bing search access;
- update `public/robots.txt`, this register and automated tests together;
- do not use third-party crawler lists as authority;
- obtain owner approval before changing the training preference.
