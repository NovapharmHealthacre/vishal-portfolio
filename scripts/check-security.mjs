import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const failures = [];
const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const forbiddenFiles = /(?:\.docx$|(?:annex|business.?plan|endorsement|recommendation|passport).*\.pdf$)/i;
const secretPatterns = [
  [/AKIA[0-9A-Z]{16}/, 'AWS access key'],
  [/(?:ghp|gho|ghu|ghs)_[A-Za-z0-9]{30,}/, 'GitHub token'],
  [/github_pat_[A-Za-z0-9_]{20,}/, 'GitHub fine-grained token'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
  [/["'](?:api[_-]?key|client[_-]?secret|password)["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i, 'hard-coded credential'],
];

for (const relative of tracked) {
  if (forbiddenFiles.test(relative)) failures.push(`${relative}: confidential source-document pattern`);
  const file = path.resolve(relative);
  if (!fs.existsSync(file) || fs.statSync(file).size > 2_000_000 || /\.(?:jpg|png|avif|webp)$/i.test(relative)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const [pattern, label] of secretPatterns) if (pattern.test(content)) failures.push(`${relative}: possible ${label}`);
}

const workflow = fs.readFileSync('.github/workflows/deploy-pages.yml', 'utf8');
if (!workflow.includes("if: github.ref == 'refs/heads/main'")) failures.push('deploy workflow is not restricted to main');
for (const workflowFile of ['.github/workflows/ci.yml', '.github/workflows/deploy-pages.yml']) {
  const content = fs.readFileSync(workflowFile, 'utf8');
  if (/uses:\s+[^\s@]+@v\d+/i.test(content)) failures.push(`${workflowFile}: action is tag-pinned instead of commit-pinned`);
}

const layout = fs.readFileSync('src/components/layout.mjs', 'utf8');
if (/unsafe-inline|unsafe-eval/.test(layout)) failures.push('CSP permits unsafe inline or eval execution');

const distFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else distFiles.push(location);
  }
};
walk(path.resolve('dist'));
for (const file of distFiles.filter((candidate) => candidate.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  if (/<script[^>]+src="https?:\/\//i.test(html)) failures.push(`${path.relative('dist', file)}: remote runtime script`);
  for (const match of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
    if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(match[1])) failures.push(`${path.relative('dist', file)}: external target lacks noopener noreferrer`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Security guardrails passed across ${tracked.length} tracked files and ${distFiles.length} build artifacts.`);
