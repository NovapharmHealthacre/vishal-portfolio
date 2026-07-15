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
        <div class="lattice-shell" aria-hidden="true">
          <canvas id="system-lattice"></canvas>
          <div class="lattice-poster"><span></span><span></span><span></span><span></span><span></span></div>
        </div>
        ${portrait(true)}
        <div class="portrait-caption"><span>Founder & CEO</span><span>${escapeHtml(company.name)}</span></div>
      </div>
      <div class="hero-proof" aria-label="Professional focus">
        <span>Market access</span>
        <span>Specialist medicines</span>
        <span>Cross-border supply</span>
      </div>
    </section>

    <section class="statement section" id="about" aria-labelledby="statement-title">
      <p class="section-number">01 / Founder thesis</p>
      <div class="statement-grid">
        <h2 id="statement-title">A medicine can be approvable and still fail to reach its market.</h2>
        <div class="statement-copy">
          <p>The route between a product and the people who need it is commercial as well as regulatory. It depends on manufacturing, licensing, price, supply, channel adoption and execution working together from the beginning.</p>
          <a class="text-link" href="/about/">The founder journey <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="venture-feature section" id="companies" aria-labelledby="venture-title">
      <div class="section-heading">
        <div><p class="section-number">02 / Venture</p><p class="eyebrow">NovaPharm Healthcare</p></div>
      </div>
      <div class="venture-grid">
        <div>
          <h2 id="venture-title">${escapeHtml(company.name)}</h2>
          <p class="venture-number">United Kingdom · Established 2025</p>
        </div>
        <div class="venture-copy">
          <p class="lead">${escapeHtml(company.description)}</p>
          <p>${escapeHtml(company.currentFocus)}</p>
          <a class="button button-light" href="/ventures/">Explore NovaPharm ${arrow}</a>
        </div>
      </div>
    </section>

    <section class="principles section" aria-labelledby="principles-title">
      <div class="section-heading">
        <div><p class="section-number">03 / Operating thesis</p><h2 id="principles-title">Three decisions shape the route to market</h2></div>
      </div>
      <div class="principle-list">
        <article><span>01</span><h3>Market access begins before approval</h3><p>Product selection, regulatory pathway, pricing and channel strategy have to be designed together, not handed from one team to another.</p></article>
        <article><span>02</span><h3>Supply is designed before launch</h3><p>Batch size, lead time, alternate sources, packaging and working capital determine whether a launch can be sustained after the first order.</p></article>
        <article><span>03</span><h3>Commercial strategy must survive operations</h3><p>A forecast only matters when the manufacturer, licence, pack, warehouse, buyer and economics can support it repeatedly.</p></article>
      </div>
    </section>

    <section class="writing section" id="essays" aria-labelledby="writing-title">
      <div class="section-heading">
        <div><p class="section-number">04 / Selected essays</p><h2 id="writing-title">Pharmaceutical strategy from the work</h2></div>
        <a class="text-link" href="/thinking/">All essays <span aria-hidden="true">→</span></a>
      </div>
      <div class="essay-list">${selected.map(articleCard).join('')}</div>
    </section>

    <section class="evidence section" aria-labelledby="evidence-title">
      <p class="section-number">05 / Selected record</p>
      <div class="evidence-grid">
        <div><h2 id="evidence-title">Company, writing<br>and published work.</h2><p>A concise record of NovaPharm Healthcare, Vishal’s external publications and his current pharmaceutical thinking.</p></div>
        <div class="evidence-links">
          <a href="${company.companiesHouseUrl}" target="_blank" rel="noopener noreferrer"><span>Companies House</span><strong>${company.name} · Established ${company.incorporationDate.slice(0, 4)}</strong>${arrow}</a>
          <a href="${publications[0].english}" target="_blank" rel="noopener noreferrer"><span>Yakuji Nippo</span><strong>UK–EU market access and compliance series</strong>${arrow}</a>
          <a href="/facts/"><span>Founder profile</span><strong>Biography, focus and official links</strong>${arrow}</a>
        </div>
      </div>
    </section>

    <section class="closing section" id="invest" aria-labelledby="closing-title">
      <span id="contact" class="anchor-target" aria-hidden="true"></span>
      <p class="eyebrow">Speaking · Editorial · Selected partnerships</p>
      <h2 id="closing-title">For conversations around pharmaceutical market access, manufacturing, supply and cross-border growth.</h2>
      <div><a class="button button-primary" href="/speaking-partnerships/">Conversation areas ${arrow}</a><a class="text-link" href="/contact/">Contact directly <span aria-hidden="true">→</span></a></div>
    </section>`;
  return renderPage({ ...meta, body, schemas: [websiteSchema(), personSchema(), webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } })], className: 'home-page' });
};

export const renderAbout = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])}
      <p class="eyebrow">Founder & CEO · Pharmaceutical entrepreneurship</p>
      <h1>Vishal Chakravarty.</h1>
      <p class="page-deck">Building NovaPharm Healthcare around specialist medicines, market access, manufacturing partnerships and cross-border supply.</p>
    </section>
    <section class="profile-spread section">
      <div class="profile-image">${portrait(false)}<p>Vishal Chakravarty · Founder & CEO</p></div>
      <article class="content-managed profile-copy">${page.html}</article>
    </section>`;
  return renderPage({ ...meta, body, schemas: [profileSchema(), personSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])], className: 'about-page' });
};

export const renderVentures = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-compact">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Ventures', path: '/ventures/' }])}
      <p class="eyebrow">NovaPharm Healthcare · United Kingdom</p>
      <h1>Connecting product opportunity<br>with market access.</h1>
      <p class="page-deck">NovaPharm is building across product strategy, licensing pathways, manufacturing partnerships, supply and commercialisation for specialist medicines.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': company.id } }), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Ventures', path: '/ventures/' }])], className: 'ventures-page' });
};

export const renderThinking = (articles) => {
  const meta = pageMeta.thinking;
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])}
      <p class="eyebrow">Market access · Manufacturing · Supply · Founder execution</p>
      <h1>Pharmaceutical strategy,<br><em>from product to market.</em></h1>
      <p class="page-deck">Essays on the commercial and operational decisions behind pharmaceutical market entry, technology transfer, supply and company building.</p>
    </section>
    <section class="writing-index section" aria-labelledby="essay-collection-title">
      <h2 id="essay-collection-title" class="sr-only">Published essays</h2>
      <div class="collection-summary"><span>${articles.length} essays</span><span>By Vishal Chakravarty</span><span>Primary sources where relevant</span></div>
      <div class="essay-list essay-list-large">${articles.map(articleCard).join('')}</div>
    </section>
    <aside class="editorial-policy section"><p class="eyebrow">Editorial approach</p><h2>Commercial perspective, grounded in current sources.</h2><p>The essays combine founder analysis with authoritative pharmaceutical and regulatory references where the subject requires them.</p></aside>`;
  return renderPage({ ...meta, body, schemas: [thinkingCollectionSchema(articles), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])], className: 'thinking-page' });
};

export const renderArticle = (article, articles) => {
  const currentIndex = articles.findIndex((candidate) => candidate.slug === article.slug);
  const previous = articles[currentIndex + 1];
  const next = articles[currentIndex - 1];
  const related = article.related.map((slug) => articles.find((candidate) => candidate.slug === slug)).filter(Boolean);
  const body = `
    <article class="article-shell">
      <header class="article-header">
        ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])}
        <p class="eyebrow">${escapeHtml(article.category)}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p class="article-summary">${escapeHtml(article.summary)}</p>
        <div class="article-byline"><span>By ${escapeHtml(article.author)}</span><span>Published ${formatDate(article.published)}</span><span>Updated ${formatDate(article.modified)}</span><span>${article.reading.minutes} min · ${article.reading.words.toLocaleString('en-GB')} words</span></div>
      </header>
      <div class="article-layout">
        <aside class="article-aside"><span>Essay</span><p>Founder analysis on pharmaceutical strategy and execution.</p>${article.sources.length ? '<a href="#sources">Sources ↓</a>' : ''}</aside>
        <div class="article-body">${article.html}</div>
      </div>
      ${article.sources.length ? `<section class="article-sources section" id="sources" aria-labelledby="sources-title">
        <p class="section-number">Sources</p><h2 id="sources-title">Reference points</h2>
        <ol>${article.sources.map((source) => `<li>${externalLink(source.url, source.label)}</li>`).join('')}</ol>
      </section>` : ''}
      ${related.length ? `<section class="related section"><p class="section-number">Continue reading</p><div class="essay-list">${related.map(articleCard).join('')}</div></section>` : ''}
      <nav class="article-pagination" aria-label="Essay pagination">
        ${previous ? `<a href="${previous.canonicalPath}"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>` : '<span></span>'}
        ${next ? `<a href="${next.canonicalPath}"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span></span>'}
      </nav>
    </article>`;
  return renderPage({
    title: `${article.title} — Vishal Chakravarty`,
    description: article.description,
    path: article.canonicalPath,
    socialImage: article.socialImage,
    socialImageAlt: `Social card for “${article.title}”, an essay by Vishal Chakravarty`,
    body,
    schemas: [webPageSchema({ path: article.canonicalPath, name: article.title, description: article.description, mainEntity: { '@id': `${new URL(article.canonicalPath, site.origin).href}#article` } }), articleSchema(article), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])],
    className: 'article-page',
  });
};

export const renderMedia = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-compact">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }])}
      <p class="eyebrow">Writing · Publications · Commentary</p>
      <h1>Published work and<br>pharmaceutical perspective.</h1>
      <p class="page-deck">External publications, independent essays and conversation areas across market access, supply and pharmaceutical company building.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [mediaCollectionSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }])], className: 'media-page' });
};

export const renderSpeaking = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])}
      <p class="eyebrow">Speaking · Editorial · Founder conversations</p>
      <h1>Pharmaceutical strategy<br><em>in practical terms.</em></h1>
      <p class="page-deck">Available for selected discussions on market access, manufacturing, technology transfer, supply, post-Brexit entry and founder execution.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])], className: 'speaking-page' });
};

export const renderFacts = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-compact">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Founder profile', path: '/facts/' }])}
      <p class="eyebrow">Founder profile</p>
      <h1>Vishal Chakravarty.</h1>
      <p class="page-deck">Biography, professional focus, selected publications and official links.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } }), personSchema(), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Founder profile', path: '/facts/' }])], className: 'facts-page' });
};

export const renderContact = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="contact-hero">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])}
      <p class="eyebrow">Direct contact</p>
      <h1>Start the conversation.</h1>
      <p class="page-deck">For selected conversations across pharmaceutical market access, manufacturing, supply, company building and editorial work.</p>
      <a class="contact-email" href="mailto:${site.email}"><span>${site.email}</span>${arrow}</a>
      <div class="content-managed contact-content">${page.html}</div>
    </section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, type: 'ContactPage', mainEntity: { '@id': person.id } }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])], className: 'contact-page' });
};

export const renderPrivacy = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-compact">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])}
      <p class="eyebrow">Privacy</p><h1>How this website handles data.</h1><p class="page-deck">A clear description of the data practices used by this portfolio.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])], className: 'privacy-page' });
};

export const renderCompatibility = (from, to) =>
  renderPage({
    title: 'This page has moved — Vishal Chakravarty',
    description: 'Continue to the current page on the Vishal Chakravarty founder platform.',
    path: to,
    noIndex: true,
    className: 'compatibility-page',
    body: `<section class="utility-page"><p class="eyebrow">Updated route</p><h1>Continue to the current page.</h1><p>This address now points to a newer essay or section of the portfolio.</p><a class="button button-primary" href="${to}">Continue <span aria-hidden="true">→</span></a></section>`,
  });

export const renderNotFound = () =>
  renderPage({
    title: 'Page not found — Vishal Chakravarty',
    description: 'The requested page could not be found.',
    path: '/404.html',
    noIndex: true,
    className: 'not-found-page',
    body: `<section class="utility-page"><p class="eyebrow">404</p><h1>There is no page here.</h1><p>Explore the founder profile, NovaPharm Healthcare or the latest pharmaceutical essays.</p><div><a class="button button-primary" href="/">Return home</a><a class="text-link" href="/thinking/">Browse essays <span aria-hidden="true">→</span></a></div></section>`,
  });
