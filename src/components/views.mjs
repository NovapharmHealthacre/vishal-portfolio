import { company, person, publications, site } from '../data/entity.mjs';
import { pageMeta } from '../data/site.mjs';
import { escapeHtml, externalLink, formatDate } from '../lib/html.mjs';
import {
  articleSchema,
  breadcrumbSchema,
  iphex2026EventSchema,
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
    <img src="/images/portrait/vishal-chakravarty-1440.webp" width="1440" height="1440" alt="${escapeHtml(person.image.alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
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

const thinkingGroups = Object.freeze([
  {
    id: 'market-access',
    label: 'Market Access',
    categories: ['Market access', 'Regulated markets', 'Commercial strategy'],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing & Technology Transfer',
    categories: ['Manufacturing', 'Technology transfer', 'Product economics'],
  },
  {
    id: 'supply-resilience',
    label: 'Supply & Resilience',
    categories: ['Supply strategy'],
  },
  {
    id: 'company-building',
    label: 'Company Building',
    categories: ['Founder execution', 'Founder perspective'],
  },
]);

const groupedThinking = (articles) => thinkingGroups
  .map((group) => ({
    ...group,
    articles: articles.filter((article) => group.categories.includes(article.category)),
  }))
  .filter((group) => group.articles.length);


const pageSectionIndex = (html, label = 'On this page') => {
  const sections = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((match) => ({
    id: match[1],
    label: match[2].replace(/<[^>]+>/g, '').trim(),
  }));
  if (sections.length < 2) return '';
  return `<nav class="page-section-index" aria-label="${label}"><p>${label}</p><ol>${sections
    .map((section) => `<li><a href="#${section.id}">${section.label}</a></li>`)
    .join('')}</ol></nav>`;
};

const routeSummary = ({ eyebrow, title, copy, facts = [] }) => `
  <section class="route-summary" data-reveal>
    <p class="eyebrow">${eyebrow}</p>
    <div class="route-summary-copy">
      <h2>${title}</h2>
      <p>${copy}</p>
      ${facts.length ? `<dl class="route-facts">${facts.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>` : ''}
    </div>
  </section>`;


const nasaRouteHero = ({
  variant,
  crumbs,
  eyebrow,
  title,
  deck,
  image,
  width,
  height,
  source,
  credit,
  meta = [],
  action = '',
  foreground = '',
}) => `
  <section class="page-hero page-hero-cosmic page-hero-${variant}" data-page-cosmic-hero aria-labelledby="${variant}-hero-title">
    <div class="page-cosmos${image ? '' : ' page-cosmos-owned'}" data-page-cosmos aria-hidden="true">
      ${image ? `<img
        class="page-cosmos-image"
        src="${image}?w=1200"
        srcset="${image}?w=720 720w, ${image}?w=1200 1200w, ${image}?w=1800 1800w"
        sizes="100vw"
        width="${width}"
        height="${height}"
        alt=""
        fetchpriority="high"
        decoding="async">` : '<div class="nova-signal-field"><span></span><span></span><span></span><span></span><span></span><span></span></div>'}
      <div class="page-cosmos-optics"></div>
    </div>
    ${foreground}
    ${breadcrumbs(crumbs)}
    <div class="page-cosmic-copy">
      <p class="eyebrow">${eyebrow}</p>
      <h1 id="${variant}-hero-title">${title}</h1>
      <p class="page-deck">${deck}</p>
      ${action}
    </div>
    <div class="page-observation" aria-label="Observation details">
      ${meta.map((item) => `<span>${item}</span>`).join('')}
    </div>
    ${source && credit ? `<a class="page-cosmic-credit" href="${source}" target="_blank" rel="noopener noreferrer">${credit}</a>` : '<span class="page-cosmic-credit page-cosmic-credit-owned">Nova signal system</span>'}
  </section>`;

export const renderHome = (articles) => {
  const meta = pageMeta.home;
  const selected = articles.slice(0, 3);
  const yakujiPublication = publications.find((publication) => publication.publisher === 'Yakuji Nippo');
  if (!yakujiPublication) throw new Error('Missing verified Yakuji Nippo publication record');
  const body = `
    <section class="hero hero-cosmic hero-hubble" aria-labelledby="hero-title" data-hubble-hero>
      <div class="hubble-cosmos" data-real-cosmos aria-hidden="true">
        <img
          class="hubble-wide"
          src="https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/1999/02/STScI-01EVVFQ1NQ9XCZD9CFGJ1FJ822.tif?w=960"
          srcset="https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/1999/02/STScI-01EVVFQ1NQ9XCZD9CFGJ1FJ822.tif?w=640 640w, https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/1999/02/STScI-01EVVFQ1NQ9XCZD9CFGJ1FJ822.tif?w=960 960w, https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/1999/02/STScI-01EVVFQ1NQ9XCZD9CFGJ1FJ822.tif?w=1600 1600w"
          sizes="(max-width: 720px) 82vw, 100vw"
          width="2400"
          height="3000"
          alt=""
          fetchpriority="high"
          decoding="async">
        <div class="hubble-close-shell">
          <picture>
            <source media="(min-width: 721px)" srcset="https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2017/02/STScI-01EVVBRGBTS2CZP6VK5TK0W4RW.tiff?w=720">
            <img
              class="hubble-close"
              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              width="1500"
              height="1200"
              alt=""
              loading="lazy"
              fetchpriority="low"
              decoding="async">
          </picture>
        </div>
        <div class="hubble-optics"></div>
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Pharmaceuticals · Market access · Company building</p>
        <h1 id="hero-title"><span>Vishal</span> <span>Chakravarty.</span></h1>
        <p class="hero-proposition">${escapeHtml(person.proposition)}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/about/">About Vishal <span aria-hidden="true">↗</span></a>
          <a class="button button-ghost" href="/thinking/">Read the work <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <a class="hero-credit" href="https://science.nasa.gov/asset/hubble/supernova-1987a-in-the-large-magellanic-cloud/" target="_blank" rel="noopener noreferrer">
        Hubble · Supernova 1987A · NASA/ESA
      </a>
      <div class="hero-proof" aria-label="Areas of work"><span>Market access</span><span>Manufacturing & technology transfer</span><span>Specialist medicines & supply</span></div>
    </section>

    <section class="founder-feature section" id="about" aria-labelledby="statement-title" data-reveal>
      <div class="founder-feature-portrait">
        ${portrait(false)}
        <p>Vishal Chakravarty</p>
      </div>
      <div class="founder-feature-copy">
        <p class="eyebrow">01 / Founder thesis</p>
        <h2 id="statement-title">The route is the product.</h2>
        <p>A medicine does not reach a market because one function succeeds. Product, regulatory pathway, manufacturer, supply, economics and channel have to work as one route.</p>
        <a class="text-link" href="/about/">The founder journey <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="venture-feature section" id="companies" aria-labelledby="venture-title" data-reveal>
      <div class="section-heading"><div><p class="eyebrow">02 / Company · NovaPharm Healthcare</p></div></div>
      <div class="venture-grid"><div><h2 id="venture-title">${escapeHtml(company.name)}</h2><p class="venture-number">UK pharmaceutical company · Established ${company.incorporationDate.slice(0, 4)}</p></div><div class="venture-copy"><p class="lead">${escapeHtml(company.description)}</p><p>${escapeHtml(company.currentFocus)}</p><div class="venture-status-pills"><span class="status-pill"><span aria-hidden="true"></span>Product & market strategy</span><span class="status-pill"><span aria-hidden="true"></span>Manufacturing & supply</span></div><a class="button button-light" href="/ventures/">Explore NovaPharm ${arrow}</a></div></div>
    </section>

    <section class="principles section" aria-labelledby="principles-title" data-reveal>
      <div class="section-heading"><div><p class="eyebrow">03 / Operating system</p><h2 id="principles-title">Three decisions shape the route</h2></div></div>
      <div class="principle-list"><article><span>01</span><h3>Market access begins before approval</h3><p>Product, regulatory, manufacturing, pricing and channel decisions need one commercial sequence from the beginning.</p></article><article><span>02</span><h3>Supply is designed before launch</h3><p>Manufacturer choice, batch size, lead time and alternative routes determine whether availability can be maintained.</p></article><article><span>03</span><h3>Commercial strategy must survive operations</h3><p>A forecast is only useful when the pack, cost, cash cycle and buying route can support it in the real market.</p></article></div>
    </section>

    <section class="writing section" id="essays" aria-labelledby="writing-title" data-reveal><div class="section-heading"><div><p class="eyebrow">04 / Thinking</p><h2 id="writing-title">Pharmaceutical essays</h2></div><a class="text-link" href="/thinking/">All essays <span aria-hidden="true">→</span></a></div><div class="essay-list">${selected.map(articleCard).join('')}</div></section>

    <section class="evidence section" aria-labelledby="evidence-title" data-reveal><p class="eyebrow">05 / Public record</p><div class="evidence-grid"><div><h2 id="evidence-title">Company, writing<br>and work.</h2><p>Official company information, publisher-hosted writing and a concise professional profile.</p></div><div class="evidence-links"><a href="${company.companiesHouseUrl}" target="_blank" rel="noopener noreferrer"><span>Companies House</span><strong>${escapeHtml(company.name)} · Incorporated ${company.incorporationDate.slice(0, 4)}</strong>${arrow}</a><a href="${yakujiPublication.english}" target="_blank" rel="noopener noreferrer"><span>Yakuji Nippo</span><strong>UK–EU pharmaceutical market access series</strong>${arrow}</a><a href="/facts/"><span>Public record</span><strong>Selected facts, published work and independent sources</strong>${arrow}</a></div></div></section>

    <section class="closing section" id="invest" aria-labelledby="closing-title" data-reveal><span id="contact" class="anchor-target" aria-hidden="true"></span><p class="eyebrow">06 / Speaking · Editorial · Selected partnerships</p><h2 id="closing-title">Useful conversations start with a real operating problem.</h2><div><a class="button button-primary" href="/speaking-partnerships/">Conversation areas ${arrow}</a><a class="text-link" href="/contact/">Contact directly <span aria-hidden="true">→</span></a></div></section>`;
  return renderPage({ ...meta, body, socialImage: person.image.path, socialImageAlt: person.image.alt, socialImageWidth: person.image.width, socialImageHeight: person.image.height, schemas: [websiteSchema(), personSchema(), webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id }, primaryImage: { '@id': person.image.id } })], className: 'home-page' });
};

export const renderAbout = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'about',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }],
    eyebrow: 'About / 2026',
    title: 'Vishal<br>Chakravarty.',
    deck: 'Building across medicines, regulation, manufacturing, supply and market access — with the route designed as one system.',
    image: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2005/01/STScI-01EVT8DP1YM9FYPF0Y33VY7ANB.tif',
    width: 6637,
    height: 3787,
    source: 'https://science.nasa.gov/asset/hubble/barred-spiral-galaxy-ngc-1300/',
    credit: 'Hubble · NGC 1300 · NASA/ESA · Hubble Heritage Team',
    meta: ['NGC 1300 · Eridanus', 'Hubble · ACS', '69 million light-years'],
    action: `<a class="page-cosmic-action" href="#profile-snapshot-title">Explore the work <span aria-hidden="true">↓</span></a>`,
    foreground: `<picture class="about-hero-portrait"><img src="/images/portrait/vishal-chakravarty-960.webp" width="960" height="960" alt="${escapeHtml(person.image.alt)}" fetchpriority="high" decoding="async"></picture>`,
  });
  const body = `${hero}${pageSectionIndex(page.html)}<section class="profile-snapshot section" aria-labelledby="profile-snapshot-title" data-reveal><div><p class="eyebrow">At a glance</p><h2 id="profile-snapshot-title">Pharmaceutical operator and company builder.</h2></div><dl><div><dt>Role</dt><dd>Chief Executive Officer, NovaPharm Healthcare Ltd</dd></div><div><dt>Focus</dt><dd>Market access, manufacturing and resilient supply</dd></div><div><dt>Writing</dt><dd>UK–EU pharmaceutical strategy</dd></div><div><dt>Record</dt><dd><a href="/facts/">Public record →</a></dd></div></dl></section><section class="profile-spread section" data-reveal><div class="profile-image">${portrait(false)}<p>Vishal Chakravarty</p></div><article class="content-managed profile-copy">${page.html}</article></section>`;
  return renderPage({ ...meta, body, socialImage: person.image.path, socialImageAlt: person.image.alt, socialImageWidth: person.image.width, socialImageHeight: person.image.height, schemas: [profileSchema(), personSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])], className: 'about-page' });
};

export const renderVentures = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'ventures',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'NovaPharm', path: '/ventures/' }],
    eyebrow: 'NovaPharm Healthcare',
    title: 'Building the route<br>from product to market.',
    deck: 'Product strategy, regulatory pathways, manufacturing, supply and commercial market entry — connected as one operating system.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Product', 'Regulation', 'Manufacturing', 'Supply'],
    action: `<a class="page-cosmic-action" href="${company.officialUrl}" target="_blank" rel="noopener noreferrer">Explore NovaPharm <span aria-hidden="true">↗</span></a>`,
  });
  const summary = routeSummary({
    eyebrow: 'NovaPharm / Operating model',
    title: 'One route. Connected decisions.',
    copy: 'NovaPharm is being built around the complete path from product opportunity to repeatable market access, with regulation, manufacturing, supply and commercial execution designed together.',
    facts: [
      ['Foundation', 'United Kingdom'],
      ['Company', 'NovaPharm Healthcare Ltd'],
      ['Established', company.incorporationDate.slice(0, 4)],
      ['Model', 'Specialist medicines · regulated markets'],
    ],
  });
  const body = `${hero}${summary}${pageSectionIndex(page.html)}<section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': company.id } }), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'NovaPharm', path: '/ventures/' }])], className: 'ventures-page' });
};

export const renderThinking = (articles) => {
  const meta = pageMeta.thinking;
  const hero = nasaRouteHero({
    variant: 'thinking',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }],
    eyebrow: 'Essays on pharmaceuticals and regulated markets',
    title: 'Essays from<br><em>the work.</em>',
    deck: 'Original writing on market access, manufacturing, technology transfer, supply, portfolio strategy and building in regulated markets.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Primary sources', 'Operator analysis', 'Regulated markets'],
  });
  const groups = groupedThinking(articles);
  const body = `${hero}<section class="writing-index section" data-reveal aria-labelledby="essay-collection-title"><h2 id="essay-collection-title" class="sr-only">Published essays</h2><nav class="thinking-topic-nav" aria-label="Essay topics">${groups.map((group) => `<a href="#${group.id}">${escapeHtml(group.label)}</a>`).join('')}</nav>${groups.map((group) => `<section class="thinking-topic" id="${group.id}" aria-labelledby="${group.id}-title"><header class="thinking-topic-header"><p class="eyebrow">Topic</p><h2 id="${group.id}-title">${escapeHtml(group.label)}</h2><span>${group.articles.length} ${group.articles.length === 1 ? 'essay' : 'essays'}</span></header><div class="essay-list essay-list-large">${group.articles.map(articleCard).join('')}</div></section>`).join('')}</section><aside class="editorial-policy section" data-reveal><p class="eyebrow">Editorial approach</p><h2>Commercial questions, primary sources and an operator’s point of view.</h2><p>Regulatory and market-access pieces are reviewed on a 90-day cycle. Operational pharmaceutical pieces are reviewed on a 180-day cycle. Founder essays are updated only when the substance changes.</p></aside>`;
  return renderPage({ ...meta, body, schemas: [thinkingCollectionSchema(articles), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }])], className: 'thinking-page' });
};

export const renderArticle = (article, articles) => {
  const currentIndex = articles.findIndex((candidate) => candidate.slug === article.slug);
  const previous = articles[currentIndex + 1];
  const next = articles[currentIndex - 1];
  const related = article.related.map((slug) => articles.find((candidate) => candidate.slug === slug)).filter(Boolean);
  const body = `<article class="article-shell"><header class="article-header">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])}<p class="eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="article-summary">${escapeHtml(article.summary)}</p><div class="article-byline"><span>By ${escapeHtml(article.author)}</span><span>Published ${formatDate(article.published)}</span><span>Updated ${formatDate(article.modified)}</span><span>${article.reading.minutes} min · ${article.reading.words.toLocaleString('en-GB')} words</span></div></header><div class="article-layout"><aside class="article-aside"><span>${escapeHtml(article.category)}</span><p>Analysis on the decisions connecting product, market, manufacturing and supply.</p>${article.sources.length ? '<a href="#sources">Sources ↓</a>' : ''}</aside><div class="article-body">${article.html}</div></div>${article.sources.length ? `<section class="article-sources section" data-reveal id="sources" aria-labelledby="sources-title"><p class="section-number">Sources</p><h2 id="sources-title">Reference points</h2><ol>${article.sources.map((source) => `<li>${externalLink(source.url, source.label)}</li>`).join('')}</ol></section>` : ''}${related.length ? `<section class="related section" data-reveal><p class="section-number">Continue reading</p><div class="essay-list">${related.map(articleCard).join('')}</div></section>` : ''}<nav class="article-pagination" aria-label="Essay pagination">${previous ? `<a href="${previous.canonicalPath}"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a href="${next.canonicalPath}"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span></span>'}</nav></article>`;
  return renderPage({ title: `${article.title} — Vishal Chakravarty`, description: article.description, path: article.canonicalPath, socialImage: article.socialImage, socialImageAlt: `Social card for “${article.title}”, an essay by Vishal Chakravarty`, publishedTime: article.published, modifiedTime: article.modified, body, schemas: [webPageSchema({ path: article.canonicalPath, name: article.title, description: article.description, mainEntity: { '@id': `${new URL(article.canonicalPath, site.origin).href}#article` } }), articleSchema(article), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Thinking', path: '/thinking/' }, { name: article.title, path: article.canonicalPath }])], className: 'article-page' });
};

export const renderMedia = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'media',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }],
    eyebrow: 'Media & public work',
    title: 'Published.<br>Present.',
    deck: 'Publisher-hosted analysis, selected industry participation and press resources — with primary sources linked directly.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Publisher-hosted', 'Industry', 'Primary sources'],
  });
  const summary = routeSummary({
    eyebrow: 'Public record',
    title: 'Show the work. Link the source.',
    copy: 'Published analysis and selected industry participation sit here with primary-source verification. Original essays remain in Thinking; formal identity evidence remains in Public record.',
    facts: [
      ['Publishers', 'Yakuji Nippo · Pharmaceutical Commerce'],
      ['Industry', 'iPHEX 2026'],
      ['Focus', 'Market access · manufacturing · supply'],
      ['Format', 'Analysis · field notes · press resources'],
    ],
  });
  const iphexFeature = `
    <section class="media-field-note section" id="iphex-2026" aria-labelledby="iphex-2026-title" data-reveal>
      <header class="media-field-note-header">
        <div>
          <p class="eyebrow">Field note / iPHEX 2026</p>
          <h2 id="iphex-2026-title">Three days of conversations.<br>One operating question.</h2>
        </div>
        <dl>
          <div><dt>Event</dt><dd>iPHEX 2026</dd></div>
          <div><dt>Dates</dt><dd>7–9 September 2026</dd></div>
          <div><dt>Location</dt><dd>New Delhi, India</dd></div>
          <div><dt>Record</dt><dd>UK overseas delegate</dd></div>
        </dl>
      </header>
      <div class="media-field-note-grid">
        <figure class="media-field-note-lead">
          <img src="/images/media/vishal-chakravarty-iphex-2026-working.webp" width="440" height="550" alt="Vishal Chakravarty reviewing meeting material during iPHEX 2026." loading="lazy" decoding="async">
          <figcaption>Between scheduled business meetings during iPHEX 2026.</figcaption>
        </figure>
        <div class="media-field-note-copy">
          <p>The official iPHEX 2026 overseas delegates list records <strong>Vishal Om Prakash Chakravarty</strong> under the United Kingdom, representing <strong>NovaPharm Healthcare Ltd</strong>. That independent record matters more than another self-written title line.</p>
          <p>The event compressed months of partner discovery into three days: product portfolios, specialist medicines, oncology opportunities, manufacturing routes, dossiers, UK market access and cross-border supply.</p>
          <p>The useful conclusion was not that the market needs more product lists. It was the opposite. Quality, regulatory readiness, commercial fit and continuity of supply determine whether an opportunity can become a durable route to market.</p>
          <blockquote><p>A product list is not a strategy. The route from dossier to manufacturer to market is.</p></blockquote>
          <a class="text-link" href="https://iphex-india.com/exhibition/overseasdelegates_participating_list_2026" target="_blank" rel="noopener noreferrer">Official iPHEX overseas delegate record <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <figure class="media-field-note-wide">
        <img src="/images/media/vishal-chakravarty-iphex-2026-international-delegates.webp" width="500" height="333" alt="Vishal Chakravarty at iPHEX 2026 beside participating-country flags." loading="lazy" decoding="async">
        <figcaption>iPHEX 2026 brought together an international business-delegate programme around pharmaceuticals and healthcare.</figcaption>
      </figure>
    </section>`;
  const body = `${hero}${summary}${iphexFeature}${pageSectionIndex(page.html)}<section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({
    ...meta,
    body,
    socialImage: '/images/media/vishal-chakravarty-iphex-2026-international-delegates.webp',
    socialImageAlt: 'Vishal Chakravarty at iPHEX 2026 beside participating-country flags.',
    socialImageWidth: 500,
    socialImageHeight: 333,
    schemas: [
      mediaCollectionSchema(),
      iphex2026EventSchema(),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }]),
    ],
    className: 'media-page',
  });
};

export const renderSpeaking = (page) => {
  const meta = contentMeta(page);
  const hero = `<section class="page-hero page-hero-editorial">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])}<p class="eyebrow">Speaking / Editorial / Operator roundtables</p><h1>Useful conversations<br><em>start with the problem.</em></h1><p class="page-deck">Market access, manufacturing, technology transfer, supply resilience and company building in regulated markets.</p></section>`;
  const summary = routeSummary({
    eyebrow: 'Conversation design',
    title: 'Specific questions. Operator-level detail.',
    copy: 'The strongest formats begin with a real decision, constraint or market problem and build the conversation around what an audience can use.',
  });
  const body = `${hero}${summary}${pageSectionIndex(page.html)}<section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])], className: 'speaking-page' });
};

export const renderFacts = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'facts',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Public record', path: '/facts/' }],
    eyebrow: 'Public record',
    title: 'Public record.',
    deck: 'Selected facts, published work and independent sources — separated from narrative biography.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Companies House', 'Publishers', 'Independent records'],
  });
  const summary = routeSummary({
    eyebrow: 'Verification',
    title: 'A concise record, built to be checked.',
    copy: 'Identity, company information, publisher-hosted work and independent records are kept concise so the evidence can be checked quickly.',
    facts: [
      ['Identity', 'Vishal Chakravarty'],
      ['Company', company.name],
      ['Published', String(publications.length) + ' external contributions'],
      ['Sources', 'Companies House · iPHEX · publishers'],
    ],
  });
  const body = `${hero}${summary}${pageSectionIndex(page.html)}<section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({ ...meta, body, socialImage: person.image.path, socialImageAlt: person.image.alt, socialImageWidth: person.image.width, socialImageHeight: person.image.height, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, mainEntity: { '@id': person.id }, primaryImage: { '@id': person.image.id } }), personSchema(), organisationSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Public record', path: '/facts/' }])], className: 'facts-page' });
};

export const renderContact = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'contact',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }],
    eyebrow: 'Direct contact',
    title: 'Start a focused<br>conversation.',
    deck: 'For selected conversations across pharmaceutical market access, manufacturing, supply, company building and editorial work.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Direct', 'Selected conversations', 'Email'],
    action: `<a class="contact-email contact-email-hero" href="mailto:${site.email}"><span>${site.email}</span>${arrow}</a>`,
  });
  const body = `${hero}${pageSectionIndex(page.html, 'Conversation guide')}<section class="content-managed contact-content contact-content-panel section" data-reveal>${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description, type: 'ContactPage', mainEntity: { '@id': person.id } }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])], className: 'contact-page' });
};

export const renderPrivacy = (page) => {
  const meta = contentMeta(page);
  const body = `<section class="page-hero page-hero-compact">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])}<p class="eyebrow">Privacy</p><h1>How this website handles information.</h1><p class="page-deck">A concise description of the data practices used by this static website and its email contact route.</p></section><section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({ ...meta, body, schemas: [webPageSchema({ path: meta.path, name: meta.title, description: meta.description }), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }])], className: 'privacy-page' });
};

export const renderCompatibility = (from, to) => renderPage({ title: 'This page has moved — Vishal Chakravarty', description: 'A previous address for content on the Vishal Chakravarty founder platform.', path: to, noIndex: true, redirectTo: to, className: 'compatibility-page', body: `<section class="utility-page"><p class="eyebrow">Updated address</p><h1>This page has moved.</h1><p>The current article or profile is available at the link below.</p><a class="button button-primary" href="${to}">Continue <span aria-hidden="true">→</span></a></section>` });

export const renderNotFound = () => renderPage({ title: 'Page not found — Vishal Chakravarty', description: 'The requested page could not be found.', path: '/404.html', noIndex: true, className: 'not-found-page', body: `<section class="utility-page"><p class="eyebrow">404</p><h1>There is no page here.</h1><p>Explore About, NovaPharm Healthcare and the latest pharmaceutical essays.</p><div><a class="button button-primary" href="/">Return home</a><a class="text-link" href="/thinking/">Read the essays <span aria-hidden="true">→</span></a></div></section>` });
