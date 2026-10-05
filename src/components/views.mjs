import { company, person, publicAppearances, publications, site } from '../data/entity.mjs';
import { pageMeta } from '../data/site.mjs';
import { escapeHtml, externalLink, formatDate } from '../lib/html.mjs';
import {
  articleSchema,
  breadcrumbSchema,
  appearanceEventSchemas,
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

const portrait = (
  priority = false,
  className = 'portrait-frame',
  sizes = '(max-width: 720px) 91vw, (max-width: 980px) 46vw, 34rem',
) => `
  <picture class="${className}">
    <source
      type="image/avif"
      srcset="/images/portrait/vishal-chakravarty-640.avif 640w, /images/portrait/vishal-chakravarty-960.avif 960w, /images/portrait/vishal-chakravarty-1440.avif 1440w"
      sizes="${sizes}">
    <source
      type="image/webp"
      srcset="/images/portrait/vishal-chakravarty-640.webp 640w, /images/portrait/vishal-chakravarty-960.webp 960w, /images/portrait/vishal-chakravarty-1440.webp 1440w"
      sizes="${sizes}">
    <img
      src="/images/portrait/vishal-chakravarty-960.jpg"
      srcset="/images/portrait/vishal-chakravarty-640.jpg 640w, /images/portrait/vishal-chakravarty-960.jpg 960w, /images/portrait/vishal-chakravarty-1440.jpg 1440w"
      sizes="${sizes}"
      width="960"
      height="960"
      alt="${escapeHtml(person.image.alt)}"
      ${priority ? 'fetchpriority="high"' : 'loading="lazy" fetchpriority="low"'}
      decoding="async">
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

  const capabilityRows = [
    ['01', 'Market access & portfolio strategy', 'Connect product choice, regulatory pathway, pricing logic, channel and demand before capital is committed.'],
    ['02', 'Manufacturing & resilient supply', 'Design manufacturer choice, technology transfer, batch economics, sourcing and contingency as one operating route.'],
    ['03', 'Pharmaceutical decision systems', 'Turn fragmented product, regulatory, supply and market signals into clearer decisions and operating visibility.'],
  ];

  const body = `
    <section class="executive-hero" aria-labelledby="hero-title">
      <div class="executive-field" aria-hidden="true">
        <span class="executive-orbit executive-orbit-a"></span>
        <span class="executive-orbit executive-orbit-b"></span>
        <span class="executive-orbit executive-orbit-c"></span>
        <span class="executive-glow"></span>
      </div>
      <div class="executive-hero-copy">
        <p class="eyebrow">Pharmaceuticals · Strategy · Market access · Decision systems</p>
        <h1 id="hero-title">Build the route.<br><em>See the system.</em></h1>
        <p class="executive-deck">${escapeHtml(person.proposition)}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/about/">Explore the work <span aria-hidden="true">↗</span></a>
          <a class="button button-ghost" href="/thinking/">Read insights <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <aside class="executive-identity" aria-label="Profile">
        ${portrait(true, 'executive-portrait', '(max-width: 720px) 36vw, 11rem')}
        <div>
          <p>Vishal Chakravarty</p>
          <strong>${escapeHtml(person.founderRelationship)}</strong>
          <span>United Kingdom · Regulated pharmaceutical markets</span>
        </div>
      </aside>
      <div class="executive-proof" aria-label="Areas of focus">
        <div><span>01</span><strong>Market access</strong></div>
        <div><span>02</span><strong>Specialist medicines</strong></div>
        <div><span>03</span><strong>Manufacturing & supply</strong></div>
        <div><span>04</span><strong>Decision infrastructure</strong></div>
      </div>
    </section>

    <section class="institutional-thesis section" aria-labelledby="thesis-title" data-reveal>
      <div class="institutional-kicker">
        <p class="eyebrow">Operating thesis</p>
        <span>01 / The system</span>
      </div>
      <div class="institutional-thesis-copy">
        <h2 id="thesis-title">Most pharmaceutical problems are system problems.</h2>
        <p>A medicine does not reach a market because one function succeeds. Product strategy, regulation, manufacturing, supply, economics, channel and information have to work as one route.</p>
        <a class="text-link" href="/about/">How I approach the work <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="institutional-capabilities section" aria-labelledby="capabilities-title" data-reveal>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Where I work</p>
          <h2 id="capabilities-title">Three connected problems.<br>One operating view.</h2>
        </div>
      </div>
      <div class="institutional-capability-list">
        ${capabilityRows.map(([index, title, copy]) => `<article><span>${index}</span><h3>${title}</h3><p>${copy}</p><span class="capability-arrow" aria-hidden="true">↗</span></article>`).join('')}
      </div>
    </section>

    <section class="institutional-company" aria-labelledby="company-title" data-reveal>
      <div class="institutional-company-inner">
        <div>
          <p class="eyebrow">Company · NovaPharm Healthcare</p>
          <h2 id="company-title">Build the infrastructure before the scale arrives.</h2>
        </div>
        <div class="institutional-company-copy">
          <p class="lead">${escapeHtml(company.description)}</p>
          <p>${escapeHtml(company.currentFocus)}</p>
          <dl class="institutional-company-facts">
            <div><dt>Foundation</dt><dd>United Kingdom</dd></div>
            <div><dt>Established</dt><dd>${company.incorporationDate.slice(0, 4)}</dd></div>
            <div><dt>Model</dt><dd>Specialist medicines · regulated markets</dd></div>
          </dl>
          <a class="button button-dark" href="/ventures/">Explore NovaPharm ${arrow}</a>
        </div>
      </div>
    </section>

    <section class="institutional-insights section" aria-labelledby="insights-title" data-reveal>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Insights</p>
          <h2 id="insights-title">Ideas from the operating edge.</h2>
        </div>
        <a class="text-link" href="/thinking/">All insights <span aria-hidden="true">→</span></a>
      </div>
      <div class="essay-list institutional-essay-list">${selected.map(articleCard).join('')}</div>
    </section>

    <section class="evidence institutional-evidence section" aria-labelledby="evidence-title" data-reveal>
      <p class="eyebrow">Evidence, not adjectives</p>
      <div class="evidence-grid">
        <div>
          <h2 id="evidence-title">A public record<br>you can inspect.</h2>
          <p>Official company information, independent publisher-hosted analysis and a maintained record of claims and sources.</p>
        </div>
        <div class="evidence-links">
          <a href="${company.companiesHouseUrl}" target="_blank" rel="noopener noreferrer"><span>Companies House</span><strong>${escapeHtml(company.name)} · Incorporated ${company.incorporationDate.slice(0, 4)}</strong>${arrow}</a>
          <a href="${yakujiPublication.english}" target="_blank" rel="noopener noreferrer"><span>Yakuji Nippo</span><strong>UK–EU pharmaceutical market access analysis</strong>${arrow}</a>
          <a href="/facts/"><span>Public record</span><strong>Selected facts, published work and independent sources</strong>${arrow}</a>
        </div>
      </div>
    </section>

    <section class="institutional-principle section" aria-labelledby="principle-title" data-reveal>
      <p class="eyebrow">Principle</p>
      <h2 id="principle-title">Growth should never outrun regulatory readiness, supply resilience or the quality of the decision.</h2>
    </section>

    <section class="closing institutional-closing section" id="contact" aria-labelledby="closing-title" data-reveal>
      <p class="eyebrow">Speaking · Editorial · Selected partnerships</p>
      <h2 id="closing-title">Start with the problem worth solving.</h2>
      <div><a class="button button-primary" href="/speaking-partnerships/">Conversation areas ${arrow}</a><a class="text-link" href="/contact/">Contact directly <span aria-hidden="true">→</span></a></div>
    </section>`;

  return renderPage({
    ...meta,
    body,
    socialImage: person.image.path,
    socialImageAlt: person.image.alt,
    socialImageWidth: person.image.width,
    socialImageHeight: person.image.height,
    schemas: [
      websiteSchema(),
      personSchema(),
      webPageSchema({
        path: meta.path,
        name: meta.title,
        description: meta.description,
        mainEntity: { '@id': person.id },
        primaryImage: { '@id': person.image.id },
      }),
    ],
    className: 'home-page institutional-home',
  });
};

export const renderAbout = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'about',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }],
    eyebrow: 'About / 2026',
    title: 'Vishal<br>Chakravarty.',
    deck: 'Building across medicines, regulation, manufacturing, supply and market access — designing the route as one system and testing inherited constraints against first principles.',
    image: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2005/01/STScI-01EVT8DP1YM9FYPF0Y33VY7ANB.tif',
    width: 6637,
    height: 3787,
    source: 'https://science.nasa.gov/asset/hubble/barred-spiral-galaxy-ngc-1300/',
    credit: 'Hubble · NGC 1300 · NASA/ESA · Hubble Heritage Team',
    meta: ['NGC 1300 · Eridanus', 'Hubble · ACS', '69 million light-years'],
    action: `<a class="page-cosmic-action" href="#profile-snapshot-title">Explore the work <span aria-hidden="true">↓</span></a>`,
    foreground: portrait(true, 'about-hero-portrait', '(max-width: 720px) 66vw, 32rem'),
  });
  const body = `${hero}${pageSectionIndex(page.html)}<section class="profile-snapshot section" aria-labelledby="profile-snapshot-title" data-reveal><div><p class="eyebrow">At a glance</p><h2 id="profile-snapshot-title">Pharmaceutical operator and company builder.</h2></div><dl><div><dt>Role</dt><dd>Chief Executive Officer, NovaPharm Healthcare Ltd</dd></div><div><dt>Focus</dt><dd>Market access, manufacturing and resilient supply</dd></div><div><dt>Operating model</dt><dd>Integrated route · first principles</dd></div><div><dt>Record</dt><dd><a href="/facts/">Public record →</a></dd></div></dl></section><section class="profile-spread section" data-reveal><div class="profile-image">${portrait(false)}<p>Vishal Chakravarty</p></div><article class="content-managed profile-copy">${page.html}</article></section>`;
  return renderPage({ ...meta, body, socialImage: person.image.path, socialImageAlt: person.image.alt, socialImageWidth: person.image.width, socialImageHeight: person.image.height, schemas: [profileSchema(), personSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])], className: 'about-page' });
};

export const renderVentures = (page) => {
  const meta = contentMeta(page);
  const hero = nasaRouteHero({
    variant: 'ventures',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'NovaPharm', path: '/ventures/' }],
    eyebrow: 'NovaPharm Healthcare',
    title: 'Building the route<br>from product to market.',
    deck: 'Product strategy, regulatory pathways, manufacturing, supply, commercial market entry and decision infrastructure — designed as one operating system.',
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
    copy: 'NovaPharm is being built around the complete path from product opportunity to repeatable market access, with regulation, manufacturing, supply, commercial execution and decision visibility designed together.',
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
    deck: 'First-principles operator writing on market access, manufacturing, technology transfer, supply, portfolio strategy and building in regulated markets.',
    image: '',
    width: 0,
    height: 0,
    source: '',
    credit: '',
    meta: ['Primary sources', 'Operator analysis', 'Regulated markets'],
  });
  const groups = groupedThinking(articles);
  const body = `${hero}<section class="writing-index section" data-reveal aria-labelledby="essay-collection-title"><h2 id="essay-collection-title" class="sr-only">Published essays</h2><nav class="thinking-topic-nav" aria-label="Essay topics">${groups.map((group) => `<a href="#${group.id}">${escapeHtml(group.label)}</a>`).join('')}</nav>${groups.map((group) => `<section class="thinking-topic" id="${group.id}" aria-labelledby="${group.id}-title"><header class="thinking-topic-header"><p class="eyebrow">Topic</p><h2 id="${group.id}-title">${escapeHtml(group.label)}</h2><span>${group.articles.length} ${group.articles.length === 1 ? 'essay' : 'essays'}</span></header><div class="essay-list essay-list-large">${group.articles.map(articleCard).join('')}</div></section>`).join('')}</section><aside class="editorial-policy section" data-reveal><p class="eyebrow">Editorial approach</p><h2>Start with the constraint, not the convention.</h2><p>Each essay begins with an operating question and works back to the regulatory, technical, economic or market reality underneath it. Regulatory and market-access pieces are reviewed on a 90-day cycle; operational pieces on a 180-day cycle.</p></aside>`;
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


const appearanceVisual = (appearance) => {
  const visual = {
    'cphi-milan-2026': ['CPHI', 'MILAN', '06—08 OCT 2026'],
    '2030-health-co-creation': ['2030', 'HEALTH', '14 OCT · PORTCULLIS HOUSE'],
    'business-show-london-2026': ['THE BUSINESS', 'SHOW', '11—12 NOV · LONDON'],
  }[appearance.id] ?? [appearance.name, '', appearance.displayDate];
  return `<div class="appearance-visual appearance-visual-${appearance.id}" aria-hidden="true"><span>${visual[0]}</span><strong>${visual[1]}</strong><small>${visual[2]}</small></div>`;
};

const appearanceCard = (appearance) => `
  <article class="appearance-card" id="${appearance.id}">
    ${appearanceVisual(appearance)}
    <div class="appearance-card-body">
      <div class="appearance-card-topline"><span class="appearance-status">${escapeHtml(appearance.statusLabel)}</span><span>${escapeHtml(appearance.kind)}</span></div>
      <h3>${escapeHtml(appearance.name)}</h3>
      <p>${escapeHtml(appearance.summary)}</p>
      <dl>
        <div><dt>Date</dt><dd>${escapeHtml(appearance.displayDate)}</dd></div>
        <div><dt>Place</dt><dd>${escapeHtml(appearance.location)}</dd></div>
        <div><dt>Participation</dt><dd>${escapeHtml(appearance.role)}</dd></div>
      </dl>
      <div class="appearance-topics">${appearance.topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join('')}</div>
      <div class="appearance-links">
        <a class="text-link" href="${appearance.officialUrl}" target="_blank" rel="noopener noreferrer">Official event page <span aria-hidden="true">↗</span></a>
        ${appearance.verificationUrl && appearance.verificationUrl !== appearance.officialUrl ? `<a class="text-link" href="${appearance.verificationUrl}" target="_blank" rel="noopener noreferrer">Independent / organiser record <span aria-hidden="true">↗</span></a>` : ''}
      </div>
    </div>
  </article>`;

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
      ['Completed', 'iPHEX 2026'],
      ['Upcoming', 'Milan · Westminster · London'],
      ['Evidence', 'Official pages · organiser confirmations'],
    ],
  });
  const iphexFeature = `
    <section class="media-field-note section" id="iphex-2026" aria-labelledby="iphex-2026-title" data-reveal>
      <header class="media-field-note-header">
        <div>
          <p class="eyebrow">Industry field note / iPHEX 2026</p>
          <h2 id="iphex-2026-title">Three days.<br>Can the route work?</h2>
        </div>
        <dl>
          <div><dt>Event</dt><dd>iPHEX 2026</dd></div>
          <div><dt>Dates</dt><dd>7–9 September 2026</dd></div>
          <div><dt>Venue</dt><dd>Bharat Mandapam · New Delhi</dd></div>
          <div><dt>Record</dt><dd>Official UK overseas delegate</dd></div>
        </dl>
      </header>
      <div class="media-field-note-grid">
        <figure class="media-field-note-lead">
          <img src="/images/media/vishal-chakravarty-iphex-2026-working.webp" width="440" height="550" alt="Vishal Chakravarty reviewing meeting material during iPHEX 2026." loading="lazy" fetchpriority="low" decoding="async">
          <figcaption>Working between scheduled business meetings during iPHEX 2026.</figcaption>
        </figure>
        <div class="media-field-note-copy">
          <p>The official iPHEX 2026 overseas delegates list records <strong>Vishal Om Prakash Chakravarty</strong> under the United Kingdom, representing <strong>NovaPharm Healthcare Ltd</strong>. The event ran from 7–9 September 2026 at Bharat Mandapam, New Delhi.</p>
          <p>Across scheduled meetings and floor conversations, the focus was practical: product portfolios, specialist medicines, oncology opportunities, manufacturing routes, dossiers, UK market access and cross-border supply.</p>
          <p>The useful conclusion was not that the market needs more product lists. Product choice, quality, regulatory readiness, manufacturing fit, supply continuity and channel economics have to be evaluated together if an opportunity is going to become a durable route to market.</p>
          <blockquote><p>A product list is not a strategy. The route from dossier to manufacturer to market is.</p></blockquote>
          <div class="media-field-note-links">
            <a class="text-link" href="https://iphex-india.com/exhibition/overseasdelegates_participating_list_2026" target="_blank" rel="noopener noreferrer">Official delegate record <span aria-hidden="true">↗</span></a>
            <a class="text-link" href="https://www.iphex-india.com/" target="_blank" rel="noopener noreferrer">Official iPHEX 2026 site <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>

    </section>`;
  const upcomingAppearances = publicAppearances.filter((appearance) => appearance.status === 'confirmed');
  const appearancesSection = `
    <section class="media-appearances section" aria-labelledby="confirmed-appearances-title" data-reveal>
      <header class="media-appearances-header">
        <div><p class="eyebrow">Confirmed / Upcoming</p><h2 id="confirmed-appearances-title">Where the work goes next.</h2></div>
        <p>Only appearances supported by an organiser confirmation or completed registration are shown here. Applications and unconfirmed invitations stay off the public record.</p>
      </header>
      <div class="appearance-grid">${upcomingAppearances.map(appearanceCard).join('')}</div>
    </section>`;
  const body = `${hero}${summary}${iphexFeature}${appearancesSection}${pageSectionIndex(page.html)}<section class="content-managed prose-page section" data-reveal>${page.html}</section>`;
  return renderPage({
    ...meta,
    body,
    socialImage: '/images/media/vishal-chakravarty-iphex-2026-working.webp',
    socialImageAlt: 'Vishal Chakravarty reviewing meeting material during iPHEX 2026.',
    socialImageWidth: 440,
    socialImageHeight: 550,
    schemas: [
      mediaCollectionSchema(),
      ...appearanceEventSchemas(),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Media', path: '/media/' }]),
    ],
    className: 'media-page',
  });
};

export const renderSpeaking = (page) => {
  const meta = contentMeta(page);
  const hero = `<section class="page-hero page-hero-editorial">${breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Speaking & partnerships', path: '/speaking-partnerships/' }])}<p class="eyebrow">Speaking / Editorial / Operator roundtables</p><h1>Useful conversations<br><em>start with the problem.</em></h1><p class="page-deck">Market access, manufacturing, technology transfer, supply resilience, first-principles operating systems and company building in regulated markets.</p></section>`;
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
      ['Sources', 'Companies House · publishers · organisers'],
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
    deck: 'For selected conversations where a pharmaceutical operating problem, product route or system needs to be designed — not simply discussed.',
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
