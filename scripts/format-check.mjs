import fs from 'node:fs';
import path from 'node:path';

const roots = ['docs', 'public', 'scripts', 'src', 'tests'];
const extensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.svg', '.txt', '.xml', '.yml']);
const failures = [];
const walk = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (extensions.has(path.extname(entry.name))) {
      const content = fs.readFileSync(location, 'utf8');
      if (content.includes('\r\n')) failures.push(`${location}: CRLF line endings`);
      const trailingWhitespace = content.split('\n').some((line) => {
        const trailing = line.match(/[ \t]+$/)?.[0];
        return Boolean(trailing && !(path.extname(entry.name) === '.md' && trailing === '  '));
      });
      if (trailingWhitespace) failures.push(`${location}: trailing whitespace`);
      if (!content.endsWith('\n')) failures.push(`${location}: missing final newline`);
    }
  }
};
roots.forEach(walk);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Formatting hygiene checks passed.');
