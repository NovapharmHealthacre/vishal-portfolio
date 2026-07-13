import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const root = path.resolve('dist');
const portArg = process.argv.find((value) => value.startsWith('--port='));
const port = Number(portArg?.split('=')[1] ?? process.env.PORT ?? 4321);

if (!args.has('--dist')) {
  const result = spawnSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const mime = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);
  let requested = decodeURIComponent(url.pathname);
  if (requested.endsWith('/')) requested += 'index.html';
  const safe = path.normalize(requested).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  let file = path.join(root, safe);
  if (!path.extname(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, '404.html');
    response.statusCode = 404;
  }
  response.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  fs.createReadStream(file).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview: http://127.0.0.1:${port}`);
});
