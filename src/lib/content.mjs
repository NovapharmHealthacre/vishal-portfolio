import fs from 'node:fs';
import path from 'node:path';
import { escapeHtml, slugify } from './html.mjs';

const REQUIRED_ARTICLE_FIELDS = [
  'title',
  'description',
  'summary',
  'author',
  'published',
  'modified',
  'category',
  'canonicalPath',
  'legacyPaths',
  'socialImage',
  'sources',
  'related',
  'public',
];

const parseValue = (raw) => {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
    return JSON.parse(value);
  }
  return value.replace(/^(["'])(.*)\1$/, '$2');
};

export const parseFrontMatter = (source, filename = 'content') => {
  if (!source.startsWith('---\n')) {
    throw new Error(`${filename}: front matter must start with ---`);
  }
  const end = source.indexOf('\n---\n', 4);
  if (end === -1) throw new Error(`${filename}: front matter closing --- not found`);
  const header = source.slice(4, end);
  const body = source.slice(end + 5).trim();
  const data = {};
  for (const [index, line] of header.split('\n').entries()) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) throw new Error(`${filename}:${index + 2}: invalid front matter line`);
    const key = line.slice(0, colon).trim();
    data[key] = parseValue(line.slice(colon + 1));
  }
  return { data, body };
};

const renderInline = (raw) => {
  let value = escapeHtml(raw);
  value = value.replace(/`([^`]+)`/g, '<code>$1</code>');
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  value = value.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+|\/[^)\s]+)\)/g, (_match, label, url) => {
    const external = url.startsWith('http');
    return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}${external ? '<span aria-hidden="true"> ↗</span>' : ''}</a>`;
  });
  return value;
};

export const renderMarkdown = (markdown) => {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const out = [];
  let paragraph = [];
  let list = null;
  let inCode = false;
  let code = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.type}>${list.items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${list.type}>`);
    list = null;
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      if (inCode) {
        out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      out.push('<hr>');
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      out.push(`<h${level} id="${slugify(text)}">${renderInline(text)}</h${level}>`);
      continue;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      out.push(`<blockquote><p>${renderInline(quote[1])}</p></blockquote>`);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (list && list.type !== 'ul') flushList();
      list ??= { type: 'ul', items: [] };
      list.items.push(unordered[1]);
      continue;
    }
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (list && list.type !== 'ol') flushList();
      list ??= { type: 'ol', items: [] };
      list.items.push(ordered[1]);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  if (inCode) throw new Error('Unclosed fenced code block');
  return out.join('\n');
};

export const calculateReadingTime = (body) => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.ceil(words / 220)) };
};

export const loadArticles = (root) => {
  const directory = path.join(root, 'src/content/thinking');
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const filename = path.join(directory, name);
      const source = fs.readFileSync(filename, 'utf8');
      const { data, body } = parseFrontMatter(source, name);
      for (const key of REQUIRED_ARTICLE_FIELDS) {
        if (data[key] === undefined || data[key] === '') throw new Error(`${name}: missing ${key}`);
      }
      if (!Array.isArray(data.sources) || !Array.isArray(data.related) || !Array.isArray(data.legacyPaths)) {
        throw new Error(`${name}: sources, related and legacyPaths must be JSON arrays`);
      }
      const slug = name.replace(/\.md$/, '');
      const reading = calculateReadingTime(body);
      return { ...data, slug, body, html: renderMarkdown(body), reading, filename };
    })
    .filter((article) => article.public)
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
};

const interpolate = (body, variables, filename) => {
  const resolved = body.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_match, key) => {
    if (variables[key] === undefined) throw new Error(`${filename}: unknown content variable ${key}`);
    return String(variables[key]);
  });
  if (/\{\{[A-Z0-9_]+\}\}/.test(resolved)) throw new Error(`${filename}: unresolved content variable`);
  return resolved;
};

export const loadPageContent = (root, variables = {}) => {
  const directory = path.join(root, 'src/content/pages');
  if (!fs.existsSync(directory)) return {};
  return Object.fromEntries(
    fs
      .readdirSync(directory)
      .filter((name) => name.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => {
        const { data, body } = parseFrontMatter(fs.readFileSync(path.join(directory, name), 'utf8'), name);
        for (const key of ['title', 'description', 'canonicalPath', 'public']) {
          if (data[key] === undefined || data[key] === '') throw new Error(`${name}: missing ${key}`);
        }
        const resolvedBody = interpolate(body, variables, name);
        return [name.replace(/\.md$/, ''), { ...data, body: resolvedBody, html: renderMarkdown(resolvedBody) }];
      }),
  );
};
