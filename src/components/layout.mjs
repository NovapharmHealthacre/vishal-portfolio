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
        <li><a class="nav-contact" href="/contact/"${currentPath === '/contact/' ? ' aria-current="page"' : ''}>Contact</a></li>
      </ul>
    </nav>
  </header>`;

const footerMarkup = () => `
  <footer class="site-footer">
    <div class="footer-intro">
      <p class="eyebrow">Pharmaceutical entrepreneurship</p>
      <h2>From product opportunity<br>to market access.</h2>
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
        <a href="/facts/">Profile</a>
        <a href="/privacy/">Privacy</a>
      </nav>
      <div class="footer-contact">
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="${site.linkedIn}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${verificationDate.slice(0, 4)} Vishal Chakravarty</span>
      <span>Founder & CEO · NovaPharm Healthcare Ltd</span>
    </div>
  </footer>`;

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
  socialImageAlt = 'Vishal Chakravarty — pharmaceutical founder and CEO of NovaPharm Healthcare Ltd',
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
    'upgrade-insecure-requests',
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
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
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
    <script src="/assets/site.js" defer></script>
    ${schemaScripts.map((schema) => `<script type="application/ld+json">${schema}</script>`).join('\n    ')}
  </head>
  <body class="${escapeHtml(className)}">
    <a class="skip-link" href="#main">Skip to main content</a>
    ${navigationMarkup(path)}
    <main id="main" tabindex="-1">${body}</main>
    ${footerMarkup()}
  </body>
</html>`;
};
