import crypto from 'node:crypto';
import { navigation, absolute, defaultSocialImage } from '../data/site.mjs';
import { person, site, verificationDate } from '../data/entity.mjs';
import { escapeHtml, jsonForHtml } from '../lib/html.mjs';

const scriptHash = (value) => `sha256-${crypto.createHash('sha256').update(value).digest('base64')}`;

const navigationMarkup = (currentPath) => `
  <header class="site-header" data-site-header>
    <a class="brand" href="/" aria-label="Vishal Chakravarty — home">
      <span class="brand-mark" aria-hidden="true">VC</span>
      <span class="brand-name">Vishal Chakravarty</span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">
      <span>Menu</span><span class="menu-glyph" aria-hidden="true"></span>
    </button>
    <nav id="site-navigation" class="site-navigation" aria-label="Primary navigation">
      <ul class="site-nav-list">
        ${navigation
          .map(
            (item) => {
              const current =
                currentPath === item.href ||
                (item.href === '/thinking/' && currentPath.startsWith('/essays/'));
              return `<li><a href="${item.href}"${current ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
            },
          )
          .join('')}
        <li><a href="/thinking/" data-founder-ai-open>Ask Vishal’s Work</a></li>
        <li><a class="nav-contact" href="/contact/"${currentPath === '/contact/' ? ' aria-current="page"' : ''}>Contact</a></li>
      </ul>
    </nav>
  </header>`;

const footerMarkup = () => `
  <footer class="site-footer">
    <div class="footer-intro">
      <p class="eyebrow">Vishal Chakravarty</p>
      <h2>Founder & CEO,<br>NovaPharm Healthcare Ltd.</h2>
    </div>
    <div class="footer-grid">
      <div>
        <p>${escapeHtml(person.proposition)}</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/about/">About</a>
        <a href="/ventures/">Ventures</a>
        <a href="/thinking/">Thinking</a>
        <a href="/media/">Media</a>
        <a href="/gallery/">Gallery</a>
        <a href="/facts/">Profile</a>
        <a href="/thinking/" data-founder-ai-open>Ask Vishal’s Work</a>
        <a href="/privacy/">Privacy</a>
      </nav>
      <div class="footer-contact">
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="${site.linkedIn}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${verificationDate.slice(0, 4)} Vishal Chakravarty</span>
      <span>Pharmaceutical entrepreneurship · Market access · Regulated markets</span>
    </div>
  </footer>`;

const founderAiMarkup = () => `
  <dialog class="founder-ai-dialog" data-founder-ai-dialog aria-labelledby="founder-ai-title" aria-describedby="founder-ai-description">
    <div class="founder-ai-shell">
      <header class="founder-ai-header">
        <div>
          <p class="eyebrow">Approved public evidence</p>
          <p class="founder-ai-kicker">Private, browser-based retrieval</p>
        </div>
        <button class="founder-ai-close" type="button" data-founder-ai-close aria-label="Close Ask Vishal’s Work">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="founder-ai-layout">
        <section class="founder-ai-controls" aria-label="Ask Vishal’s published work">
          <h2 id="founder-ai-title">Ask Vishal’s Work</h2>
          <p id="founder-ai-description">Search Vishal Chakravarty’s approved essays, verified biography and official public records. Every supported response quotes published evidence and links to its source.</p>
          <p class="founder-ai-boundary"><strong>Not Vishal speaking.</strong> This is an automated evidence summary. It does not use private files, infer new personal views, or provide medical, legal, investment or personalised regulatory advice.</p>
          <form class="founder-ai-form" data-founder-ai-form>
            <label for="founder-ai-query">Question or topic</label>
            <div class="founder-ai-query-row">
              <input id="founder-ai-query" name="query" type="search" maxlength="400" autocomplete="off" spellcheck="true" placeholder="For example: how does Vishal assess CMO readiness?" required data-founder-ai-input>
              <button class="button button-primary" type="submit">Search work</button>
            </div>
          </form>
          <div class="founder-ai-topics" role="group" aria-label="Suggested topics">
            <button type="button" data-founder-ai-topic="How does Vishal assess CMO readiness?">CMO readiness</button>
            <button type="button" data-founder-ai-topic="What has Vishal published about market access?">Market access</button>
            <button type="button" data-founder-ai-topic="How does Vishal think about supply resilience?">Supply resilience</button>
          </div>
          <p class="sr-only" aria-live="polite" data-founder-ai-status></p>
        </section>
        <section class="founder-ai-results" data-founder-ai-results aria-label="Evidence response" aria-live="polite" aria-atomic="false">
          <div class="founder-ai-empty">
            <p class="founder-ai-label">Source-first by design</p>
            <h3>Explore the published record.</h3>
            <p>Use a suggested topic or ask a focused question. Unsupported questions receive a clear abstention rather than an invented answer.</p>
          </div>
        </section>
      </div>
      <footer class="founder-ai-footer">
        <p>No query is sent to an external AI provider or retained by this website.</p>
        <div>
          <a href="/thinking/">Read all essays</a>
          <a href="/privacy/">Privacy</a>
          <button type="button" data-founder-ai-copy hidden>Copy cited answer</button>
        </div>
      </footer>
    </div>
  </dialog>`;

export const breadcrumbs = (items) => `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${item.path}">${escapeHtml(item.name)}</a>`}</li>`).join('')}</ol>
  </nav>`;

export const statusPill = (label, tone = '') =>
  `<span class="status-pill${tone ? ` status-${tone}` : ''}"><span aria-hidden="true"></span>${escapeHtml(label)}</span>`;

export const renderPage = ({
  title,
  description,
  path,
  body,
  schemas = [],
  className = '',
  socialImage = defaultSocialImage,
  socialImageAlt = 'Vishal Chakravarty — Founder and CEO of NovaPharm Healthcare Ltd',
  socialImageWidth = 1200,
  socialImageHeight = 630,
  noIndex = false,
}) => {
  const canonical = absolute(path);
  const schemaScripts = schemas.map((schema) => jsonForHtml(schema));
  const hashes = schemaScripts.map(scriptHash);
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self'",
    `script-src 'self'${hashes.length ? ` ${hashes.map((hash) => `'${hash}'`).join(' ')}` : ''}`,
    "connect-src 'self'",
    "frame-src 'none'",
    "form-action 'none'",
  ].join('; ');
  return `<!doctype html>
<html class="no-js" lang="en-GB">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:site_name" content="Vishal Chakravarty">
    <meta property="og:type" content="${path.startsWith('/essays/') ? 'article' : 'website'}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${absolute(socialImage)}">
    <meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}">
    <meta property="og:image:width" content="${socialImageWidth}">
    <meta property="og:image:height" content="${socialImageHeight}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${absolute(socialImage)}">
    <meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}">
    <meta name="theme-color" content="#0d0d0f">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="alternate" type="application/rss+xml" title="Thinking by Vishal Chakravarty" href="/rss.xml">
    <link rel="alternate" type="application/feed+json" title="Thinking by Vishal Chakravarty" href="/feed.json">
    <link rel="stylesheet" href="/assets/site.css">
    <link rel="stylesheet" href="/assets/content-fixes.css">
    <script src="/assets/site.js" defer></script>
    ${schemaScripts.map((schema) => `<script type="application/ld+json">${schema}</script>`).join('\n    ')}
  </head>
  <body class="${escapeHtml(className)}">
    <a class="skip-link" href="#main">Skip to main content</a>
    ${navigationMarkup(path)}
    <main id="main" tabindex="-1">${body}</main>
    ${footerMarkup()}
    ${founderAiMarkup()}
    <script type="module" src="/assets/founder-ai.js"></script>
  </body>
</html>`;
};
