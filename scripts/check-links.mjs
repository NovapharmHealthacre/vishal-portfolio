import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const origin = 'https://vishal.novapharmhealthcare.com';
const htmlFiles = [];
const failures = [];
const idsByFile = new Map();
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (entry.name.endsWith('.html')) htmlFiles.push(location);
  }
};
walk(dist);

const resolvePath = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (clean === '/') return path.join(dist, 'index.html');
  if (clean.endsWith('/')) return path.join(dist, clean, 'index.html');
  return path.join(dist, clean);
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  idsByFile.set(file, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])));
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const refs = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) => match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0])),
  ];
  const ids = idsByFile.get(file);
  for (const ref of refs) {
    if (/^(?:mailto:|tel:|data:)/.test(ref)) continue;
    if (ref.startsWith('#')) {
      if (ref.length > 1 && !ids.has(ref.slice(1))) failures.push(`${path.relative(dist, file)}: missing anchor ${ref}`);
      continue;
    }
    const parsed = new URL(ref, `${origin}/${path.relative(dist, file).replaceAll(path.sep, '/')}`);
    if (parsed.origin !== origin) continue;
    const destination = resolvePath(parsed.pathname);
    if (!fs.existsSync(destination)) failures.push(`${path.relative(dist, file)}: missing ${ref}`);
    else if (parsed.hash && destination.endsWith('.html')) {
      const targetIds = idsByFile.get(destination) ?? new Set([...fs.readFileSync(destination, 'utf8').matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
      if (!targetIds.has(decodeURIComponent(parsed.hash.slice(1)))) failures.push(`${path.relative(dist, file)}: missing destination fragment ${ref}`);
    }
  }
}

const css = fs.readFileSync(path.join(dist, 'assets/site.css'), 'utf8');
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const ref = match[1];
  if (ref.startsWith('data:') || ref.startsWith('%23')) continue;
  const parsed = new URL(ref, `${origin}/assets/site.css`);
  if (parsed.origin === origin && !fs.existsSync(resolvePath(parsed.pathname))) failures.push(`assets/site.css: missing ${ref}`);
}

for (const name of ['sitemap.xml', 'rss.xml', 'feed.json', 'facts.json']) {
  const content = fs.readFileSync(path.join(dist, name), 'utf8');
  for (const match of content.matchAll(/https:\/\/vishal\.novapharmhealthcare\.com(?:\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]*)?/g)) {
    const parsed = new URL(match[0]);
    if (!fs.existsSync(resolvePath(parsed.pathname))) failures.push(`${name}: missing same-origin URL ${match[0]}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Checked HTML, srcset, CSS and machine-readable local links across ${htmlFiles.length} HTML files.`);
