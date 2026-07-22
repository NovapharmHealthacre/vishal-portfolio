const ABSTENTION = 'I could not verify that from Vishal’s approved published work.';
const RESPONSE_LABEL = 'AI-generated summary based on Vishal’s published work';

const STOP_WORDS = new Set([
  'a','about','an','and','are','as','at','be','by','can','did','do','does','for','from','how','i','in','is','it',
  'me','of','on','or','the','their','this','to','was','what','when','where','which','who','why','with','work','vishal'
]);

const CONCEPTS = Object.freeze({
  approval: ['regulatory','authorisation','permission','market access'],
  access: ['market','channel','launch','commercialisation','availability'],
  cmo: ['manufacturer','manufacturing','cdmo','site','technology transfer'],
  resilience: ['supply','continuity','inventory','lead time','supplier'],
  batch: ['manufacturing','economics','inventory','minimum batch size'],
  founder: ['company building','execution','credibility','entrepreneurship'],
  digital: ['technology','data','infrastructure','traceability'],
  brexit: ['uk','eu','europe','market entry','regulatory'],
  specialist: ['medicine','portfolio','product','market access'],
  parallel: ['import','licensing','supply','risk']
});

const POLICY_RULES = Object.freeze([
  {
    id: 'medical',
    pattern: /\b(diagnos|symptom|treat(?:ment)?|dos(?:e|age)|interaction|pregnan|paediatric|medicine should i|cure|patient record|adverse event|side effect|medical emergency)\b/i,
    message: 'This experience cannot provide medical, treatment or patient-specific information. Use an appropriate healthcare professional or official safety-reporting route.'
  },
  {
    id: 'private',
    pattern: /\b(private (?:chat|email|document|contract)|portal|customer data|supplier (?:data|price)|password|credential|immigration|visa|personal financ|bank|confidential|business plan forecast)\b/i,
    message: 'Private, personal and confidential information is outside this experience. It searches approved public work only.'
  },
  {
    id: 'advice',
    pattern: /\b(legal advice|investment advice|personalised regulatory|guarantee|predict approval|stock price|valuation|net worth)\b/i,
    message: 'This experience cannot provide legal, investment or personalised regulatory advice.'
  },
  {
    id: 'unsupported-status',
    pattern: /\b(live stock|current inventory|product available|mhra approved|wda\(h\) holder|current revenue|profit forecast|nhs contract)\b/i,
    message: 'Current commercial, product, financial and authorisation status is not inferred from Vishal’s published essays.'
  },
  {
    id: 'injection',
    pattern: /\b(ignore (?:all |the |previous )?(?:instructions|rules)|reveal (?:the )?(?:prompt|system)|bypass|jailbreak|developer message|hidden instruction|act as vishal|pretend to be vishal)\b/i,
    message: 'I cannot change the evidence and attribution boundaries of this experience.'
  }
]);

export function tokenize(value) {
  return [...new Set(
    String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  )];
}

export function evaluateFounderPolicy(query) {
  const value = String(query || '').trim();
  if (!value) return { allowed: false, id: 'empty', message: 'Enter a question or topic from Vishal’s published work.' };
  if (value.length > 400) return { allowed: false, id: 'length', message: 'Please keep the question under 400 characters.' };
  const match = POLICY_RULES.find((rule) => rule.pattern.test(value));
  return match ? { allowed: false, id: match.id, message: match.message } : { allowed: true, id: 'published-work' };
}

function expandedTerms(query) {
  const direct = tokenize(query);
  const expanded = new Set(direct);
  for (const term of direct) {
    for (const related of CONCEPTS[term] || []) tokenize(related).forEach((token) => expanded.add(token));
  }
  return { direct, expanded: [...expanded] };
}

function scoreText(text, terms, weight) {
  const haystack = String(text || '').toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? weight : 0), 0);
}

export function retrieveFounderEvidence(knowledge, query, { limit = 5 } = {}) {
  const { direct, expanded } = expandedTerms(query);
  if (!direct.length) return [];
  const results = [];
  for (const document of knowledge?.documents || []) {
    const documentScore =
      scoreText(document.title, expanded, 8) +
      scoreText(document.summary, expanded, 4) +
      scoreText((document.topics || []).join(' '), expanded, 6);
    for (const entry of document.passages || []) {
      const searchable = `${document.title} ${document.summary} ${(document.topics || []).join(' ')} ${entry.heading} ${entry.passage}`.toLowerCase();
      const directMatches = direct.filter((term) => searchable.includes(term));
      const required = direct.length === 1 ? 1 : Math.min(2, direct.length);
      if (directMatches.length < required) continue;
      const score = documentScore + scoreText(entry.heading, expanded, 5) + scoreText(entry.passage, expanded, 2) + directMatches.length * 9;
      results.push({
        sourceId: document.id,
        title: document.title,
        url: document.url,
        type: document.type,
        author: document.author,
        published: document.published,
        modified: document.modified,
        topics: document.topics,
        heading: entry.heading,
        passage: entry.passage,
        score,
        directMatches: directMatches.length
      });
    }
  }
  return results
    .sort((a, b) => b.score - a.score || b.directMatches - a.directMatches || a.title.localeCompare(b.title))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.sourceId === item.sourceId) === index)
    .slice(0, limit);
}

export function createFounderAnswer(results) {
  if (!results?.length) return { label: RESPONSE_LABEL, answer: ABSTENTION, citations: [], evidenceStatus: 'Insufficient approved evidence' };
  const primary = results[0];
  return {
    label: RESPONSE_LABEL,
    answer: primary.passage,
    citations: results.slice(0, 3),
    evidenceStatus: `Cited ${primary.type.toLowerCase()}; extractive response`
  };
}

let knowledgePromise;
function loadKnowledge() {
  if (!knowledgePromise) {
    knowledgePromise = fetch('/assets/founder-knowledge.json', {
      credentials: 'same-origin',
      cache: 'force-cache',
      headers: { Accept: 'application/json' }
    }).then((response) => {
      if (!response.ok) throw new Error('Founder evidence is unavailable.');
      return response.json();
    }).then((knowledge) => {
      if (knowledge.schemaVersion !== '1.0.0' || !Array.isArray(knowledge.documents)) throw new Error('Founder evidence is invalid.');
      return knowledge;
    });
  }
  return knowledgePromise;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderMessage(container, title, message, tone = 'boundary') {
  container.replaceChildren();
  const article = element('article', `founder-ai-message founder-ai-${tone}`);
  article.append(element('p', 'founder-ai-label', title), element('p', '', message));
  container.append(article);
}

function renderAnswer(container, response) {
  container.replaceChildren();
  const article = element('article', 'founder-ai-answer');
  article.append(element('p', 'founder-ai-label', response.label));
  article.append(element('p', 'founder-ai-answer-copy', response.answer));
  article.append(element('p', 'founder-ai-evidence-status', response.evidenceStatus));
  if (response.citations.length) {
    const heading = element('h3', '', 'Sources');
    const list = element('ol', 'founder-ai-sources');
    for (const citation of response.citations) {
      const item = element('li');
      const link = element('a', '', citation.title);
      link.href = citation.url;
      if (!citation.url.startsWith(location.origin)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      const meta = element('span', '', `${citation.type} · ${citation.heading}`);
      const passage = element('q', '', citation.passage);
      item.append(link, meta, passage);
      list.append(item);
    }
    article.append(heading, list);
  }
  container.append(article);
}

function initFounderAi() {
  const dialog = document.querySelector('[data-founder-ai-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const form = dialog.querySelector('[data-founder-ai-form]');
  const input = dialog.querySelector('[data-founder-ai-input]');
  const results = dialog.querySelector('[data-founder-ai-results]');
  const status = dialog.querySelector('[data-founder-ai-status]');
  const copy = dialog.querySelector('[data-founder-ai-copy]');
  let lastResponse = null;

  const open = (query = '') => {
    if (!dialog.open) dialog.showModal();
    if (query) input.value = query;
    input.focus();
  };

  for (const trigger of document.querySelectorAll('[data-founder-ai-open]')) {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      open(trigger.dataset.query || '');
    });
  }

  for (const topic of dialog.querySelectorAll('[data-founder-ai-topic]')) {
    topic.addEventListener('click', () => {
      open(topic.dataset.founderAiTopic);
      form.requestSubmit();
    });
  }

  dialog.querySelector('[data-founder-ai-close]')?.addEventListener('click', () => dialog.close());

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    copy.hidden = true;
    lastResponse = null;
    const query = input.value.trim();
    const policy = evaluateFounderPolicy(query);
    if (!policy.allowed) {
      renderMessage(results, policy.id === 'empty' ? 'Question needed' : 'Boundary', policy.message);
      status.textContent = policy.message;
      return;
    }
    status.textContent = 'Searching approved published work.';
    form.setAttribute('aria-busy', 'true');
    try {
      const knowledge = await loadKnowledge();
      const response = createFounderAnswer(retrieveFounderEvidence(knowledge, query));
      lastResponse = response;
      renderAnswer(results, response);
      copy.hidden = !response.citations.length;
      status.textContent = response.citations.length ? `Answer found with ${response.citations.length} cited sources.` : response.answer;
    } catch {
      renderMessage(results, 'Search unavailable', 'The evidence index could not be opened. Vishal’s essays and profile remain available through the normal site navigation.', 'unavailable');
      status.textContent = 'Founder evidence search is unavailable.';
    } finally {
      form.removeAttribute('aria-busy');
    }
  });

  copy?.addEventListener('click', async () => {
    if (!lastResponse?.citations.length || !navigator.clipboard) return;
    const sources = lastResponse.citations.map((citation) => `${citation.title}: ${citation.url}`).join('\n');
    await navigator.clipboard.writeText(`${lastResponse.label}\n\n${lastResponse.answer}\n\nSources\n${sources}`);
    status.textContent = 'Answer and source links copied.';
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFounderAi, { once: true });
  else initFounderAi();
}

export { ABSTENTION, RESPONSE_LABEL };
