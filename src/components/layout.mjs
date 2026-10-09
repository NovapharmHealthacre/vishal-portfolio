import crypto from 'node:crypto';
import { navigation, absolute, defaultSocialImage } from '../data/site.mjs';
import { person, site, verificationDate } from '../data/entity.mjs';
import { escapeHtml, jsonForHtml } from '../lib/html.mjs';

const scriptHash = (value) => `sha256-${crypto.createHash('sha256').update(value).digest('base64')}`;

const navigationMarkup = (currentPath) => `
  <header class="site-header" data-site-header data-ui-layer="navigation">
    <a class="brand" href="/" aria-label="Vishal Chakravarty — home">
      <span class="brand-mark" aria-hidden="true">VC</span>
      <span class="brand-name">Vishal Chakravarty</span>
    </a>
    <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-navigation">
      <span class="menu-glyph" aria-hidden="true"></span>
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
    <button class="global-search-toggle" type="button" aria-label="Search this website" aria-expanded="false" aria-controls="site-search-panel">
      <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true" fill="none"><circle cx="8.5" cy="8.5" r="5.8" stroke="currentColor" stroke-width="1.5"/><path d="m13 13 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <section id="site-search-panel" class="site-search-panel" aria-label="Website search" hidden>
      <label for="site-search-input">Search Vishal Chakravarty</label>
      <input id="site-search-input" type="search" placeholder="Search this website" autocomplete="off" aria-controls="site-search-results">
      <p class="site-search-hint">Suggested: market access, manufacturing, medicines</p>
      <ul id="site-search-results" aria-live="polite"></ul>
    </section>
  </header>`;

const footerMarkup = () => `
  <footer class="site-footer" data-ui-layer="footer">
    <div class="footer-intro">
      <p class="eyebrow">Vishal Chakravarty</p>
      <h2>Strategy, infrastructure<br>and intelligence for medicines.</h2>
    </div>
    <div class="footer-grid">
      <div>
        <p>Work across pharmaceutical strategy, market access, manufacturing, resilient supply and the decision systems connecting them.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/about/">About</a>
        <a href="/ventures/">NovaPharm</a>
        <a href="/thinking/">Insights</a>
        <a href="/media/">Media</a>
        <a href="/facts/">Public record</a>
        <a href="/privacy/">Privacy</a>
      </nav>
      <div class="footer-contact">
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="${site.linkedIn}" target="_blank" rel="me noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${verificationDate.slice(0, 4)} Vishal Chakravarty</span>
      <span>Pharmaceuticals · Market access · Decision systems</span>
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
  socialImageAlt = 'Portrait of Vishal Chakravarty',
  socialImageWidth = 1200,
  socialImageHeight = 630,
  publishedTime,
  modifiedTime,
  noIndex = false,
  redirectTo,
}) => {
  const pageLabel = path.startsWith('/essays/') ? 'Insights' : ({
    '/about/': 'About',
    '/ventures/': 'NovaPharm',
    '/thinking/': 'Insights',
    '/media/': 'Media',
    '/facts/': 'Public record',
    '/contact/': 'Contact',
    '/speaking-partnerships/': 'Partnerships',
    '/privacy/': 'Privacy',
  }[path] ?? 'Vishal Chakravarty');
  const pageSections = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)]
    .slice(0, 2)
    .map((match) => ({ id: match[1], label: match[2].replace(/<[^>]+>/g, '').trim() }));
  const localNavigation = path !== '/' && !noIndex
    ? `<div class="apple-local-nav" aria-label="Page sections">
        <a class="apple-local-nav-title" href="${escapeHtml(path)}">${escapeHtml(pageLabel)}</a>
        <nav aria-label="Section navigation"><a href="#main" aria-current="location">Overview</a>
          ${pageSections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.label)}</a>`).join('')}
        </nav>
      </div>`
    : '';
  const canonical = absolute(path);
  const classNames = new Set(className.split(/\s+/).filter(Boolean));
  const routeCosmosEnabled = ['about-page', 'ventures-page', 'thinking-page', 'media-page', 'facts-page', 'contact-page'].some((name) => classNames.has(name));
  const nasaAssetsEnabled = classNames.has('home-page') || classNames.has('about-page');
  const ogType = path.startsWith('/essays/') ? 'article' : ['/about/', '/facts/'].includes(path) ? 'profile' : 'website';
  const imageType = socialImage.endsWith('.webp') ? 'image/webp' : socialImage.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const schemaScripts = schemas.map((schema) => jsonForHtml(schema));
  const hashes = schemaScripts.map(scriptHash);
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    `img-src 'self' data:${nasaAssetsEnabled ? ' https://assets.science.nasa.gov' : ''}`,
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
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    ${redirectTo ? `<meta http-equiv="refresh" content="0; url=${escapeHtml(redirectTo)}">` : ''}
    <meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="${escapeHtml(person.name)}">
    <meta name="application-name" content="Vishal Chakravarty">
    <meta name="apple-mobile-web-app-title" content="Vishal Chakravarty">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="robots" content="${noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}">
    <meta name="googlebot" content="${noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en-GB" href="${canonical}">
    <link rel="alternate" hreflang="x-default" href="${canonical}">
    <link rel="author" href="/about/">
    <link rel="alternate" type="application/json" title="Verified public facts about ${escapeHtml(person.name)}" href="/facts.json">
    <link rel="alternate" type="application/json" title="Structured public content index" href="/content-index.json">
    <meta property="og:site_name" content="Vishal Chakravarty">
    <meta property="og:locale" content="en_GB">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${absolute(socialImage)}">
    <meta property="og:image:secure_url" content="${absolute(socialImage)}">
    <meta property="og:image:type" content="${imageType}">
    <meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}">
    <meta property="og:image:width" content="${socialImageWidth}">
    <meta property="og:image:height" content="${socialImageHeight}">
    ${ogType === 'profile' ? '<meta property="profile:first_name" content="Vishal">\n    <meta property="profile:last_name" content="Chakravarty">' : ''}
    ${publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}">` : ''}
    ${modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}">` : ''}
    ${publishedTime ? `<meta property="article:author" content="${absolute('/about/')}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${absolute(socialImage)}">
    <meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}">
    <meta name="theme-color" content="#0d0d0f">
    <meta name="color-scheme" content="dark">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="/manifest.webmanifest">
    ${nasaAssetsEnabled ? '<link rel="preconnect" href="https://assets.science.nasa.gov" crossorigin>' : ''}
    <link rel="alternate" type="application/rss+xml" title="Thinking by Vishal Chakravarty" href="/rss.xml">
    <link rel="alternate" type="application/feed+json" title="Thinking by Vishal Chakravarty" href="/feed.json">
    ${routeCosmosEnabled ? '<link rel="stylesheet" href="/assets/route-cosmos.css">' : ''}
    <link rel="stylesheet" href="/assets/site.css">
    <script src="/assets/site.js" defer></script>
    ${routeCosmosEnabled ? '<script src="/assets/route-cosmos.js" defer></script>' : ''}
    ${schemaScripts.map((schema) => `<script type="application/ld+json">${schema}</script>`).join('\n    ')}
  </head>
  <body class="${escapeHtml(className)}">
    <a class="skip-link" href="#main">Skip to main content</a>
    ${navigationMarkup(path)}
    ${localNavigation}
    <main id="main" tabindex="-1" data-content-layer>${body}</main>
    ${footerMarkup()}
  </body>
</html>`;
};
