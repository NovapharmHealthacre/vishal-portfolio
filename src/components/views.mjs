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
import { breadcrumbs, renderPage, statusPill } from './layout.mjs';

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
        <p class="eyebrow">Founder · Operator · Regulated markets</p>
        <h1 id="hero-title"><span>Vishal</span> <span>Chakravarty</span></h1>
        <p class="hero-proposition">${escapeHtml(person.proposition)}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/about/">Enter the story <span aria-hidden="true">↗</span></a>
          <a class="text-link" href="/thinking/">Read the thinking <span aria-hidden="true">→</span></a>
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
      <div class="hero-proof" aria-label="Verified summary">
        <span>Company ${escapeHtml(company.companyNumber)}</span>
        <span>Incorporated ${formatDate(company.incorporationDate)}</span>
        <span>Facts reviewed ${formatDate(verificationDate)}</span>
      </div>
    </section>

    <section class="statement section" id="about" aria-labelledby="statement-title">
      <p class="section-number">01 / Position</p>
      <div class="statement-grid">
        <h2 id="statement-title">Complex markets do not need louder promises. They need better operating systems.</h2>
        <div class="statement-copy">
          <p>${escapeHtml(person.shortBio)}</p>
          <a class="text-link" href="/about/">Read the verified profile <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="venture-feature section" id="companies" aria-labelledby="venture-title">
      <div class="section-heading">
        <div><p class="section-number">02 / Venture</p><p class="eyebrow">Status before spectacle</p></div>
        ${statusPill('Active · UK registered', 'verified')}
      </div>
      <div class="venture-grid">
        <div>
          <h2 id="venture-title">${escapeHtml(company.name)}</h2>
          <p class="venture-number">Company ${escapeHtml(company.companyNumber)}</p>
        </div>
        <div class="venture-copy">
          <div class="venture-status-pills">${statusPill('Registration · verified', 'verified')}${statusPill('Focus · planned', 'roadmap')}</div>
          <p class="lead">${escapeHtml(company.description)}</p>
          <p>${escapeHtml(company.currentFocus)}</p>
          <div class="status-note">
            <span>Regulatory boundary</span>
            <p>${escapeHtml(company.regulatoryStatus)}</p>
          </div>
          <a class="button button-light" href="/ventures/">Current state & roadmap ${arrow}</a>
        </div>
      </div>
    </section>

    <section class="principles section" aria-labelledby="principles-title">
      <div class="section-heading">
        <div><p class="section-number">03 / Operating thesis</p><h2 id="principles-title">Three disciplines</h2></div>
      </div>
      <div class="principle-list">
        <article><span>01</span><h3>Make status visible</h3><p>Separate what exists, what is in progress and what remains a plan. Credibility begins at that boundary.</p></article>
        <article><span>02</span><h3>Design for evidence</h3><p>In regulated markets, a decision is only as strong as the source, date and responsibility behind it.</p></article>
        <article><span>03</span><h3>Build for resilience</h3><p>The useful system is not the one that looks fastest. It is the one that remains accountable under pressure.</p></article>
      </div>
    </section>

    <section class="writing section" id="essays" aria-labelledby="writing-title">
      <div class="section-heading">
        <div><p class="section-number">04 / Selected thinking</p><h2 id="writing-title">Notes from the work</h2></div>
        <a class="text-link" href="/thinking/">All essays <span aria-hidden="true">→</span></a>
      </div>
      <div class="essay-list">${selected.map(articleCard).join('')}</div>
    </section>

    <section class="evidence section" aria-labelledby="evidence-title">
      <p class="section-number">05 / Public evidence</p>
      <div class="evidence-grid">
        <div><h2 id="evidence-title">Proof belongs<br>beside the claim.</h2><p>A compact record for readers, journalists and machines—dated, visible and deliberately narrower than the ambition.</p></div>
        <div class="evidence-links">
          <a href="${company.companiesHouseUrl}" target="_blank" rel="noopener noreferrer"><span>Companies House</span><strong>Active company · incorporated ${company.incorporationDate.slice(0, 4)}</strong>${arrow}</a>
          <a href="${publications[0].english}" target="_blank" rel="noopener noreferrer"><span>Yakuji Nippo</span><strong>Three bilingual instalments published</strong>${arrow}</a>
          <a href="/facts/"><span>Public fact sheet</span><strong>Last reviewed ${formatDate(verificationDate)}</strong>${arrow}</a>
        </div>
      </div>
    </section>

    <section class="closing section" id="invest" aria-labelledby="closing-title">
      <span id="contact" class="anchor-target" aria-hidden="true"></span>
      <p class="eyebrow">Speaking · Editorial · Selected partnerships</p>
      <h2 id="closing-title">A good conversation can clarify the system before anyone tries to scale it.</h2>
      <div><a class="button button-primary" href="/speaking-partnerships/">Conversation areas ${arrow}</a><a class="text-link" href="/contact/">Contact directly <span aria-hidden="true">→</span></a></div>
    </section>`;
  return renderPage({ ...meta, body, schemas: [websiteSchema(), personSchema(), webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } })], className: 'home-page' });
};

export const renderAbout = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])}
      <p class="eyebrow">Verified founder profile · Reviewed ${formatDate(verificationDate)}</p>
      <h1>Vishal Chakravarty.</h1>
      <p class="page-deck">Founder and operator working on regulated healthcare markets, with a public record that distinguishes present facts from future work.</p>
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
      <p class="eyebrow">Entity record · Reviewed ${formatDate(verificationDate)}</p>
      <h1>NovaPharm Healthcare Ltd,<br>in its current state.</h1>
      <p class="page-deck">NovaPharm is presented here through what is registered, what is being developed and what remains on the roadmap.</p>
    </section>
    <div class="page-status-line">${statusPill('Company registration · verified', 'verified')}${statusPill('Operating model · planned', 'roadmap')}</div>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': company.id } }), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Ventures', path: '/ventures/' }])], className: 'ventures-page' });
};

export const renderThinking = (articles) => {
  const meta = pageMeta.thinking;
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])}
      <p class="eyebrow">Field notes · Essays · Operating ideas</p>
      <h1>Thinking in public,<br><em>with the sources attached.</em></h1>
      <p class="page-deck">Writing on regulated markets, pharmaceutical access, resilience and the decisions behind company building.</p>
    </section>
    <section class="writing-index section" aria-labelledby="essay-collection-title">
      <h2 id="essay-collection-title" class="sr-only">Published essays</h2>
      <div class="collection-summary"><span>${articles.length} essays</span><span>British English</span><span>Primary sources preferred</span></div>
      <div class="essay-list essay-list-large">${articles.map(articleCard).join('')}</div>
    </section>
    <aside class="editorial-policy section"><p class="eyebrow">Editorial standard</p><h2>Analysis is not medical advice.</h2><p>Pharmaceutical essays are general analysis. They cite authoritative sources where appropriate, distinguish opinion from factual guidance and do not replace professional, regulatory or patient-specific advice.</p></aside>`;
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
        <aside class="article-aside"><span>Essay</span><p>General analysis, not patient-specific medical or legal advice.</p>${article.sources.length ? '<a href="#sources">Sources ↓</a>' : ''}</aside>
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
      <p class="eyebrow">Publisher-hosted record · Reviewed ${formatDate(verificationDate)}</p>
      <h1>Vishal Chakravarty’s<br>published work.</h1>
      <p class="page-deck">A deliberately short record that counts only live, independently hosted publication URLs.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [mediaCollectionSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }])], className: 'media-page' });
};

export const renderSpeaking = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-editorial">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])}
      <p class="eyebrow">Invitations, not invented credentials</p>
      <h1>Conversations for people<br><em>doing the difficult work.</em></h1>
      <p class="page-deck">Selected themes for speaking, editorial and partnership enquiries—without implying a stage history, advisory role or existing commercial relationship.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])], className: 'speaking-page' });
};

export const renderFacts = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="page-hero page-hero-compact">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Public facts', path: '/facts/' }])}
      <p class="eyebrow">Last reviewed ${formatDate(verificationDate)}</p>
      <h1>Vishal Chakravarty:<br>public facts.</h1>
      <p class="page-deck">A public reference for journalists, collaborators, search engines and AI systems. It is intentionally narrower than a pitch deck.</p>
    </section>
    <div class="page-action-line"><a class="text-link" href="/facts.json">Machine-readable fact record <span aria-hidden="true">→</span></a></div>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id } }), personSchema(), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Public facts', path: '/facts/' }])], className: 'facts-page' });
};

export const renderContact = (page) => {
  const meta = contentMeta(page);
  const body = `
    <section class="contact-hero">
      ${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])}
      <p class="eyebrow">Direct contact</p>
      <h1>Bring a real question.</h1>
      <p class="page-deck">For selected conversations connected to regulated-market building, pharmaceutical access and editorial work.</p>
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
      <p class="eyebrow">Effective ${formatDate(verificationDate)}</p><h1>A quiet site should also be a private one.</h1><p class="page-deck">This page describes the data practices of this static founder platform as actually built.</p>
    </section>
    <section class="content-managed prose-page section">${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])], className: 'privacy-page' });
};

export const renderCompatibility = (from, to) =>
  renderPage({
    title: 'This page has moved — Vishal Chakravarty',
    description: 'A legacy route for the Vishal Chakravarty founder platform.',
    path: to,
    noIndex: true,
    className: 'compatibility-page',
    body: `<section class="utility-page"><p class="eyebrow">Route preserved</p><h1>This page has a clearer home.</h1><p>The content previously available at <code>${escapeHtml(from)}</code> now lives at the canonical route below.</p><a class="button button-primary" href="${to}">Continue to ${escapeHtml(to)} <span aria-hidden="true">→</span></a></section>`,
  });

export const renderNotFound = () =>
  renderPage({
    title: 'Page not found — Vishal Chakravarty',
    description: 'The requested page could not be found.',
    path: '/404.html',
    noIndex: true,
    className: 'not-found-page',
    body: `<section class="utility-page"><p class="eyebrow">404 · Outside the mapped route</p><h1>There is no page here.</h1><p>The useful paths are still close: the founder profile, current venture status and published thinking.</p><div><a class="button button-primary" href="/">Return home</a><a class="text-link" href="/thinking/">Browse essays <span aria-hidden="true">→</span></a></div></section>`,
  });
