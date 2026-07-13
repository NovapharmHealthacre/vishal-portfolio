import { brotliCompressSync, constants } from 'node:zlib';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const limits = {
  criticalJavaScriptBrotli: 15 * 1024,
  totalJavaScriptBrotli: 35 * 1024,
  cssBrotli: 20 * 1024,
  homepageHtmlBrotli: 35 * 1024,
  lcpAvif: 180 * 1024,
  lcpFallback: 280 * 1024,
  initialTransferBrotli: 500 * 1024,
  domNodes: 1200,
};

const read = async (relative) => readFile(path.join(dist, relative));
const brotliSize = (buffer) => brotliCompressSync(buffer, {
  params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
}).byteLength;

const files = {
  homepage: await read('index.html'),
  css: await read('assets/site.css'),
  criticalJs: await read('assets/site.js'),
  latticeJs: await read('assets/lattice.js'),
  lcpAvif: await read('images/portrait/vishal-chakravarty-960.avif'),
  lcpFallback: await read('images/portrait/vishal-chakravarty-960.jpg'),
};

const measurements = {
  'Critical JavaScript (Brotli)': [brotliSize(files.criticalJs), limits.criticalJavaScriptBrotli],
  'All homepage JavaScript (Brotli)': [brotliSize(files.criticalJs) + brotliSize(files.latticeJs), limits.totalJavaScriptBrotli],
  'Global CSS (Brotli)': [brotliSize(files.css), limits.cssBrotli],
  'Homepage HTML (Brotli)': [brotliSize(files.homepage), limits.homepageHtmlBrotli],
  'LCP portrait AVIF': [files.lcpAvif.byteLength, limits.lcpAvif],
  'LCP portrait JPEG fallback': [files.lcpFallback.byteLength, limits.lcpFallback],
};

const initialTransfer = brotliSize(files.homepage)
  + brotliSize(files.css)
  + brotliSize(files.criticalJs)
  + files.lcpAvif.byteLength;
measurements['Initial homepage transfer estimate'] = [initialTransfer, limits.initialTransferBrotli];

const homepage = files.homepage.toString('utf8');
const domNodes = (homepage.match(/<[a-z][^>]*>/gi) ?? []).length;
const violations = [];

for (const [label, [actual, limit]] of Object.entries(measurements)) {
  const passed = actual <= limit;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}: ${(actual / 1024).toFixed(1)} KB / ${(limit / 1024).toFixed(0)} KB`);
  if (!passed) violations.push(`${label} exceeds its budget`);
}

console.log(`${domNodes <= limits.domNodes ? 'PASS' : 'FAIL'} Homepage DOM estimate: ${domNodes} / ${limits.domNodes} nodes`);
if (domNodes > limits.domNodes) violations.push('Homepage DOM estimate exceeds its budget');

if (/https?:\/\/[^"']+\.(?:woff2?|ttf|otf)/i.test(homepage + files.css.toString('utf8'))) {
  violations.push('Remote font reference detected');
}

if (/<script[^>]+src=["']https?:\/\//i.test(homepage)) {
  violations.push('Third-party runtime script detected on the homepage');
}

const assetDirectories = await readdir(path.join(dist, 'assets'));
const totalAssetBytes = (await Promise.all(assetDirectories.map(async (name) => (await stat(path.join(dist, 'assets', name))).size)))
  .reduce((sum, size) => sum + size, 0);
console.log(`INFO First-party assets on disk: ${(totalAssetBytes / 1024).toFixed(1)} KB across ${assetDirectories.length} files`);

if (violations.length) {
  for (const violation of violations) console.error(violation);
  process.exit(1);
}

console.log('Deterministic production size and dependency budgets passed.');
