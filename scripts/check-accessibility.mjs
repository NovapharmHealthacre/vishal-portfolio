import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (entry.name.endsWith('.html') && entry.name !== 'googlef9cdfdd63c360d56.html') files.push(location);
  }
};
walk(dist);

const stripTags = (value) => value.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();

for (const file of files) {
  const rel = path.relative(dist, file);
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (!/<html[^>]+lang="en-GB"/.test(html)) failures.push(`${rel}: missing document language`);
  if (!/<meta name="viewport"/.test(html)) failures.push(`${rel}: missing viewport`);
  if (!/<main\b[^>]*id="main"/.test(html)) failures.push(`${rel}: missing main landmark`);
  if (!/<nav\b[^>]*aria-label="Primary navigation"/.test(html)) failures.push(`${rel}: missing labelled primary navigation`);
  if (!/<a class="skip-link" href="#main">/.test(html)) failures.push(`${rel}: missing skip link`);
  if (duplicateIds.length) failures.push(`${rel}: duplicate IDs ${[...new Set(duplicateIds)].join(', ')}`);

  for (const match of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt="[^"]*"/.test(match[1])) failures.push(`${rel}: image missing alt`);
    if (!/\bwidth="\d+"/.test(match[1]) || !/\bheight="\d+"/.test(match[1])) failures.push(`${rel}: image missing dimensions`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    if (!stripTags(match[2]) && !/aria-label="[^"]+"/.test(match[1])) failures.push(`${rel}: unnamed button`);
  }
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    if (!stripTags(match[2]) && !/aria-label="[^"]+"/.test(match[1])) failures.push(`${rel}: empty link`);
  }
  for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) {
    if (!ids.includes(match[1])) failures.push(`${rel}: aria-controls target ${match[1]} missing`);
  }
  const headings = [...html.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index] > headings[index - 1] + 1) failures.push(`${rel}: heading level jumps H${headings[index - 1]} to H${headings[index]}`);
  }
}

const luminance = (hex) => {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) => (channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4));
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
};
const contrast = (foreground, background) => {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
for (const [foreground, background, label] of [
  ['#f2efe8', '#0d0d0f', 'ivory on ink'],
  ['#98938b', '#0d0d0f', 'graphite on ink'],
  ['#d74c5a', '#0d0d0f', 'signal red on ink'],
  ['#0d0d0f', '#f2efe8', 'ink on ivory'],
  ['#6f6b65', '#f2efe8', 'muted on ivory'],
]) {
  const ratio = contrast(foreground, background);
  if (ratio < 4.5) failures.push(`Colour contrast ${label}: ${ratio.toFixed(2)}:1`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Static accessibility preflight passed across ${files.length} pages; five core text pairs meet 4.5:1. Browser axe testing remains separate.`);
