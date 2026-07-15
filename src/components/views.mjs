import { company, person, publications, site, verificationDate } from '../data/entity.mjs';
import { pageMeta } from '../data/site.mjs';
import { escapeHtml, externalLink, formatDate } from '../lib/html.mjs';
import {
  articleSchema,
  breadcrumbSchema,
  mediaCollectionSchema,
  organisationSchema,
  personSchema,
  profileSchema,
  thinkingCollectionSchema,
  webPageSchema,
  websiteSchema,
} from '../lib/schema.mjs';
import { breadcrumbs, renderPage } from './layout.mjs';

const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const contentMeta = (page) => ({
  title: page.title.includes('Vishal Chakravarty') ? page.title : `${page.title} — Vishal Chakravarty`,
  description: page.description,
  path: page.canonicalPath,
});

const portrait = (priority = false) => `
  <picture class="portrait-frame">
    <source type="image/avif" srcset="/images/portrait/vishal-chakravarty-640.avif 640w, /images/portrait/vishal-chakravarty-960.avif 960w, /images/portrait/vishal-chakravarty-1440.avif 1440w" sizes="(max-width: 720px) 92vw, 48vw">
    <source type="image/webp" srcset="/images/portrait/vishal-chakravarty-640.webp 640w, /images/portrait/vishal-chakravarty-960.webp 960w, /images/portrait/vishal-chakravarty-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 48vw">
    <img src="/images/portrait/vishal-chakravarty-960.jpg" srcset="/images/portrait/vishal-chakravarty-640.jpg 640w, /images/portrait/vishal-chakravarty-960.jpg 960w, /images/portrait/vishal-chakravarty-1440.jpg 1440w" sizes="(max-width: 720px) 92vw, 48vw" width="960" height="935" alt="${escapeHtml(person.image.alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>`;

const articleCard = (article, index) => `
  <article class="essay-card">
    <div class="essay-index">${String(index + 1).padStart(2, '0')}</div>
    <div class="essay-card-copy">
      <div class="essay-meta"><span>${escapeHtml(article.category)}</span><span>${article.reading.minutes} min read</span></div>
      <h3><a href="${article.canonicalPath}">${escapeHtml(article.title)}</a></h3>
      <p>${escapeHtml(article.summary)}</p>
    </div>
    <a class="round-link" href="${article.canonicalPath}" aria-label="Read ${escapeHtml(article.title)}"><span aria-hidden="true">↗</span></a>
  </article>`;

export const renderHome = (articles) => {
  const meta = pageMeta.home;
  const selected = articles.slice(0, 3);
  const body = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Founder & CEO · Pharmaceutical entrepreneurship · Regulated markets</p>
        <h1 id="hero-title"><span>Vishal</span> <span>Chakravarty</span></h1>
        <p class="hero-proposition">${escapeHtml(person.proposition)}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/about/">About Vishal <span aria-hidden="true">↗</span></a>
          <a class="text-link" href="/thinking/">Read the essays <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="lattice-shell" aria-hidden="true"><canvas id="system-lattice"></canvas><div class="lattice-poster"><span></span><span></span><span></span><span></span><span></span></div></div>
        ${portrait(true)}
        <div class="portrait-caption"><span>Founder & CEO</span><span>${escapeHtml(company.name)}</span></div>
      </div>
      <div class="hero-proof" aria-label="Areas of work"><span>Pharmaceutical market access</span><span>Manufacturing & technology transfer</span><span>Specialist medicines & supply</span></div>
    </section>

    <section class="statement section" id="about" aria-labelledby="statement-title">
      <p class="section-number">01 / Founder thesis</p>
      <div class="statement-grid"><h2 id="statement-title">A medicine can be approvable and still fail to reach the market.</h2><div class="statement-copy"><p>The real work is connecting product, regulatory pathway, manufacturer, supply, economics and channel early enough to build a route that can last.</p><a class="text-link" href="/about/">The founder journey <span aria-hidden="true">→</span></a></div></div>
    </section>

    <section class="venture-feature section" id="companies" aria-labelledby="venture-title">
      <div class="section-heading"><div><p class="section-number">02 / Venture</p><p class="eyebrow">NovaPharm Healthcare</p></div></div>
      <div class="venture-grid"><div><h2 id="venture-title">${escapeHtml(company.name)}</h2><p class="venture-number">UK pharmaceutical company · Established ${company.incorporationDate.slice(0, 4)}</p></div><div class="venture-copy"><p class="lead">${escapeHtml(company.description)}</p><p>${escapeHtml(company.currentFocus)}</p><div class="venture-status-pills"><span class="status-pill"><span aria-hidden="true"></span>Product & market strategy</span><span class="status-pill"><span aria-hidden="true"></span>Manufacturing & supply</span></div><a class="button button-light" href="/ventures/">Explore NovaPharm ${arrow}</a></div></div>
    </section>

    <section class="principles section" aria-labelledby="principles-title">
      <div class="section-heading"><div><p class="section-number">03 / Operating thesis</p><h2 id="principles-title">Three decisions shape the route</h2></div></div>
      <div class="principle-list"><article><span>01</span><h3>Market access begins before approval</h3><p>Product, regulatory, manufacturing, pricing and channel decisions need one commercial sequence from the beginning.</p></article><article><span>02</span><h3>Supply is designed before launch</h3><p>Manufacturer choice, batch size, lead time and alternative routes determine whether availability can be maintained.</p></article><article><span>03</span><h3>Commercial strategy must survive operations</h3><p>A forecast is only useful when the pack, cost, cash cycle and buying route can support it in the real market.</p></article></div>
    </section>

    <section class="writing section" id="essays" aria-labelledby="writing-title"><div class="section-heading"><div><p class="section-number">04 / Selected thinking</p><h2 id="writing-title">Pharmaceutical essays</h2></div><a class="text-link" href="/thinking/">All essays <span aria-hidden="true">→</span></a></div><div class="essay-list">${selected.map(articleCard).join('')}</div></section>

    <section class="evidence section" aria-labelledby="evidence-title"><p class="section-number">05 / Selected record</p><div class="evidence-grid"><div><h2 id="evidence-title">Company, writing<br>and work.</h2><p>Official company information, independent publication links and a concise professional profile.</p></div><div class="evidence-links"><a href="${company.companiesHouseUrl}" target="_blank" rel="noopener noreferrer"><span>Companies House</span><strong>${escapeHtml(company.name)} · Incorporated ${company.incorporationDate.slice(0, 4)}</strong>${arrow}</a><a href="${publications[0].english}" target="_blank" rel="noopener noreferrer"><span>Yakuji Nippo</span><strong>UK–EU pharmaceutical market access series</strong>${arrow}</a><a href="/facts/"><span>Founder profile</span><strong>Biography, focus and official links</strong>${arrow}</a></div></div></section>

    <section class="closing section" id="invest" aria-labelledby="closing-title"><span id="contact" class="anchor-target" aria-hidden="true"></span><p class="eyebrow">Speaking · Editorial · Selected partnerships</p><h2 id="closing-title">For conversations around pharmaceutical market access, manufacturing, supply and cross-border growth.</h2><div><a class="button button-primary" href="/speaking-partnerships/">Conversation areas ${arrow}</a><a class="text-link" href="/contact/">Contact directly <span aria-hidden="true">→</span></a></div></section>`;
  return renderPage({ ...meta, body, schemas: [websiteSchema(), personSchema(), webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } })], className: 'home-page' });
};

export const renderAbout = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-editorial">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])}<p class="eyebrow">Founder profile</p><h1>Vishal Chakravarty.</h1><p class="page-deck">Pharmaceutical entrepreneur building NovaPharm Healthcare around market access, specialist medicines, manufacturing partnerships and resilient supply.</p></section><section class="profile-spread section"><div class="profile-image">${portrait(false)}<p>Vishal Chakravarty · Founder & CEO</p></div><article class="content-managed profile-copy">${page.html}</article></section>`;
  return renderPage({ ...meta, body, schemas: [profileSchema(), personSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])], className: 'about-page' });
};

export const renderVentures = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-compact">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Ventures', path: '/ventures/' }])}<p class="eyebrow">NovaPharm Healthcare</p><h1>Building the route<br>from product to market.</h1><p class="page-deck">A UK pharmaceutical company connecting product strategy, licensing, manufacturing, supply and commercial market entry.</p></section><section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': company.id } }), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Ventures', path: '/ventures/' }])], className: 'ventures-page' });
};

export const renderThinking = (articles) => {
  const meta = pageMeta.thinking;
  const body = `<section class="page-hero page-hero-editorial">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])}<p class="eyebrow">Pharmaceutical strategy · Founder execution</p><h1>Essays from<br><em>the work.</em></h1><p class="page-deck">Original writing on market access, manufacturing, technology transfer, supply, portfolio strategy and building in regulated markets.</p></section><section class="writing-index section" aria-labelledby="essay-collection-title"><h2 id="essay-collection-title" class="sr-only">Published essays</h2><div class="collection-summary"><span>${articles.length} essays</span><span>Pharmaceutical strategy</span><span>Founder perspective</span></div><div class="essay-list essay-list-large">${articles.map(articleCard).join('')}</div></section><aside class="editorial-policy section"><p class="eyebrow">Editorial approach</p><h2>Commercial questions, primary sources and an operator’s point of view.</h2><p>Technical articles use current authoritative sources where the subject requires them. The writing focuses on operating and commercial decisions rather than patient-specific guidance.</p></aside>`;
  return renderPage({ ...meta, body, schemas: [thinkingCollectionSchema(articles), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])], className: 'thinking-page' });
};

export const renderArticle = (article, articles) => {
  const currentIndex = articles.findIndex((candidate) => candidate.slug === article.slug);
  const previous = articles[currentIndex + 1];
  const next = articles[currentIndex - 1];
  const related = article.related.map((slug) => articles.find((candidate) => candidate.slug === slug)).filter(Boolean);
  const body = `<article class="article-shell"><header class="article-header">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])}<p class="eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="article-summary">${escapeHtml(article.summary)}</p><div class="article-byline"><span>By ${escapeHtml(article.author)}</span><span>Published ${formatDate(article.published)}</span><span>Updated ${formatDate(article.modified)}</span><span>${article.reading.minutes} min · ${article.reading.words.toLocaleString('en-GB')} words</span></div></header><div class="article-layout"><aside class="article-aside"><span>${escapeHtml(article.category)}</span><p>Founder analysis on the decisions connecting product, market, manufacturing and supply.</p>${article.sources.length ? '<a href="#sources">Sources ↓</a>' : ''}</aside><div class="article-body">${article.html}</div></div>${article.sources.length ? `<section class="article-sources section" id="sources" aria-labelledby="sources-title"><p class="section-number">Sources</p><h2 id="sources-title">Reference points</h2><ol>${article.sources.map((source) => `<li>${externalLink(source.url, source.label)}</li>`).join('')}</ol></section>` : ''}${related.length ? `<section class="related section"><p class="section-number">Continue reading</p><div class="essay-list">${related.map(articleCard).join('')}</div></section>` : ''}<nav class="article-pagination" aria-label="Essay pagination">${previous ? `<a href="${previous.canonicalPath}"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a href="${next.canonicalPath}"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span></span>'}</nav></article>`;
  return renderPage({ title: `${article.title} — Vishal Chakravarty`, description: article.description, path: article.canonicalPath, socialImage: article.socialImage, socialImageAlt: `Social card for “${article.title}”, an essay by Vishal Chakravarty`, body, schemas: [webPageSchema({ path: article.canonicalPath, name: article.title, description: article.description, mainEntity: { '@id': `${new URL(article.canonicalPath, site.origin).href}#article` } }), articleSchema(article), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])], className: 'article-page' });
};

export const renderMedia = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-compact">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }])}<p class="eyebrow">Writing & media</p><h1>Published work,<br>ideas and commentary.</h1><p class="page-deck">Selected writing on UK–EU pharmaceutical market access, post-Brexit regulation, parallel import and the operating decisions behind pharmaceutical companies.</p></section><section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [mediaCollectionSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }])], className: 'media-page' });
};

export const renderSpeaking = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-editorial">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])}<p class="eyebrow">Speaking · Editorial · Founder roundtables</p><h1>Conversations about<br><em>building in pharmaceuticals.</em></h1><p class="page-deck">Themes spanning market access, post-Brexit market entry, manufacturing partnerships, technology transfer, supply and founder execution.</p></section><section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])], className: 'speaking-page' });
};

export const renderFacts = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-compact">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Founder profile', path: '/facts/' }])}<p class="eyebrow">Founder profile</p><h1>Vishal Chakravarty.</h1><p class="page-deck">Biography, professional focus, selected publications and official links.</p></section><section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } }), personSchema(), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Founder profile', path: '/facts/' }])], className: 'facts-page' });
};

export const renderContact = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="contact-hero">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])}<p class="eyebrow">Direct contact</p><h1>Start a focused conversation.</h1><p class="page-deck">For selected conversations across pharmaceutical market access, manufacturing, supply, company building and editorial work.</p><a class="contact-email" href="mailto:${site.email}"><span>${site.email}</span>${arrow}</a><div class="content-managed contact-content">${page.html}</div></section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, type: 'ContactPage', mainEntity: { '@id': person.id } }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])], className: 'contact-page' });
};

export const renderPrivacy = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-compact">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])}<p class="eyebrow">Privacy</p><h1>How this website handles information.</h1><p class="page-deck">A concise description of the data practices used by this static website and its email contact route.</p></section><section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])], className: 'privacy-page' });
};

export const renderCompatibility = (from, to) => renderPage({ title: 'This page has moved — Vishal Chakravarty', description: 'A previous address for content on the Vishal Chakravarty founder platform.', path: to, noIndex: true, className: 'compatibility-page', body: `<section class="utility-page"><p class="eyebrow">Updated address</p><h1>This page has moved.</h1><p>The current article or profile is available at the link below.</p><a class="button button-primary" href="${to}">Continue <span aria-hidden="true">→</span></a></section>` });

export const renderNotFound = () => renderPage({ title: 'Page not found — Vishal Chakravarty', description: 'The requested page could not be found.', path: '/404.html', noIndex: true, className: 'not-found-page', body: `<section class="utility-page"><p class="eyebrow">404</p><h1>There is no page here.</h1><p>Explore the founder profile, NovaPharm Healthcare and the latest pharmaceutical essays.</p><div><a class="button button-primary" href="/">Return home</a><a class="text-link" href="/thinking/">Browse essays <span aria-hidden="true">→</span></a></div></section>` });
