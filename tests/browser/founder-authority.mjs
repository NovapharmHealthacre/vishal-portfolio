import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE;
if (!playwrightPath) {
  console.error('Set PLAYWRIGHT_MODULE to an installed Playwright module.');
  process.exit(2);
}

const playwright = await import(pathToFileURL(playwrightPath).href);
const axePath = process.env.AXE_MODULE;
const axeSource = axePath ? (await import(pathToFileURL(axePath).href)).source : null;
const port = Number(process.env.BROWSER_QA_PORT ?? 4399);
const origin = `http://127.0.0.1:${port}`;
const artifacts = path.resolve('artifacts');
const screenshots = path.join(artifacts, 'screenshots');
fs.rmSync(artifacts, { recursive: true, force: true });
fs.mkdirSync(screenshots, { recursive: true });

const ensure = (condition, message) => {
  if (!condition) throw new Error(message);
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const sitemap = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf8');
const canonicalRoutes = [...sitemap.matchAll(/<loc>https:\/\/vishal\.novapharmhealthcare\.com([^<]*)<\/loc>/g)].map((match) => match[1]);
const compatibilityRoutes = [
  '/about.html',
  '/companies.html',
  '/essays.html',
  '/publications.html',
  '/profiles.html',
  '/essays/why-i-left-swiggy/',
  '/essays/from-swiggy-to-mhra/',
];
const screenshotRoutes = [
  '/',
  '/about/',
  '/ventures/',
  '/thinking/',
  '/media/',
  '/speaking-partnerships/',
  '/facts/',
  '/contact/',
  '/privacy/',
  '/essays/why-i-chose-to-build-in-pharmaceuticals/',
  '/essays/regulatory-approval-is-not-market-access/',
  '/essays/choosing-a-cmo-for-regulated-markets/',
  '/404.html',
];
const narrowRoutes = [
  '/',
  '/about/',
  '/ventures/',
  '/thinking/',
  '/media/',
  '/facts/',
  '/contact/',
  '/essays/why-i-chose-to-build-in-pharmaceuticals/',
  '/essays/regulatory-approval-is-not-market-access/',
];

const slug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-').replace('.html', ''));

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error('Preview server did not start.');
};

const server = spawn(process.execPath, ['scripts/dev.mjs', '--dist', `--port=${port}`], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (chunk) => { serverLog += chunk; });
server.stderr.on('data', (chunk) => { serverLog += chunk; });

const auditDocument = async (page, label, { expectNoIndex = false, checkConsole = true } = {}) => {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15_000 });
  const state = await page.evaluate(() => ({
    h1: document.querySelectorAll('main h1').length,
    mainText: document.querySelector('main')?.innerText.trim().length ?? 0,
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    robots: document.querySelector('meta[name="robots"]')?.content ?? '',
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    brokenImages: [...document.images].filter((image) => image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
  }));
  ensure(state.h1 === 1, `${label}: expected one main H1, found ${state.h1}`);
  ensure(state.mainText > 80, `${label}: main content is unexpectedly short`);
  ensure(state.canonical.startsWith('https://vishal.novapharmhealthcare.com/'), `${label}: invalid canonical ${state.canonical}`);
  ensure(expectNoIndex ? state.robots.includes('noindex') : !state.robots.includes('noindex'), `${label}: unexpected robots ${state.robots}`);
  ensure(state.overflow <= 1, `${label}: horizontal overflow ${state.overflow}px`);
  ensure(state.brokenImages.length === 0, `${label}: broken images ${state.brokenImages.join(', ')}`);
  if (checkConsole) {
    const errors = page.__consoleErrors ?? [];
    ensure(errors.length === 0, `${label}: console errors ${errors.join(' | ')}`);
  }
};

const attachConsole = (page) => {
  page.__consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') page.__consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => page.__consoleErrors.push(error.message));
};

const runAxe = async (page, label) => {
  if (!axeSource) return [];
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
    });
    return result.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length }));
  });
  const serious = violations.filter((violation) => ['critical', 'serious'].includes(violation.impact));
  ensure(serious.length === 0, `${label}: serious axe violations ${JSON.stringify(serious)}`);
  return violations;
};

const results = [];
await waitForServer();

try {
  for (const browserName of ['chromium', 'firefox', 'webkit']) {
    const browserType = playwright[browserName];
    const browser = await browserType.launch({ headless: true });
    const browserResult = { browser: browserName, canonicalRoutes: 0, compatibilityRoutes: 0, screenshots: 0, axeViolations: 0 };
    try {
      const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
      for (const route of canonicalRoutes) {
        const page = await desktop.newPage();
        attachConsole(page);
        const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
        ensure(response?.status() === 200, `${browserName} ${route}: HTTP ${response?.status()}`);
        await auditDocument(page, `${browserName} ${route}`);
        browserResult.canonicalRoutes += 1;
        await page.close();
      }

      for (const route of compatibilityRoutes) {
        const page = await desktop.newPage();
        attachConsole(page);
        const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
        ensure(response?.status() === 200, `${browserName} compatibility ${route}: HTTP ${response?.status()}`);
        await auditDocument(page, `${browserName} compatibility ${route}`, { expectNoIndex: true });
        browserResult.compatibilityRoutes += 1;
        await page.close();
      }

      const unknown = await desktop.newPage();
      const unknownResponse = await unknown.goto(`${origin}/this-route-does-not-exist/`, { waitUntil: 'domcontentloaded' });
      ensure(unknownResponse?.status() === 404, `${browserName}: unknown route HTTP ${unknownResponse?.status()}`);
      await auditDocument(unknown, `${browserName} unknown route`, { expectNoIndex: true, checkConsole: false });
      await unknown.close();

      const desktopAxe = await desktop.newPage();
      attachConsole(desktopAxe);
      await desktopAxe.goto(origin, { waitUntil: 'networkidle' });
      browserResult.axeViolations += (await runAxe(desktopAxe, `${browserName} desktop home`)).length;
      await desktopAxe.close();

      for (const route of screenshotRoutes) {
        const page = await desktop.newPage();
        await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshots, `${slug(route)}-${browserName}-desktop.png`), fullPage: true });
        browserResult.screenshots += 1;
        await page.close();
      }
      await desktop.close();

      const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      for (const route of screenshotRoutes) {
        const page = await mobile.newPage();
        attachConsole(page);
        await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
        await auditDocument(page, `${browserName} mobile ${route}`, { expectNoIndex: route === '/404.html' });
        await page.screenshot({ path: path.join(screenshots, `${slug(route)}-${browserName}-mobile.png`), fullPage: true });
        browserResult.screenshots += 1;
        await page.close();
      }

      const menu = await mobile.newPage();
      await menu.goto(origin, { waitUntil: 'networkidle' });
      const button = menu.locator('.menu-toggle');
      await button.click();
      ensure((await button.getAttribute('aria-expanded')) === 'true', `${browserName}: mobile menu did not open`);
      ensure(await menu.locator('#site-navigation').isVisible(), `${browserName}: mobile navigation is not visible`);
      await menu.keyboard.press('Escape');
      ensure((await button.getAttribute('aria-expanded')) === 'false', `${browserName}: mobile menu did not close with Escape`);
      await menu.close();
      await mobile.close();

      const narrow = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });
      for (const route of narrowRoutes) {
        const page = await narrow.newPage();
        await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
        const narrowState = await page.evaluate(() => {
          const clientWidth = document.documentElement.clientWidth;
          const offenders = [...document.querySelectorAll('body *')]
            .map((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return {
                element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
                left: Math.round(rect.left * 10) / 10,
                right: Math.round(rect.right * 10) / 10,
                width: Math.round(rect.width * 10) / 10,
                minWidth: style.minWidth,
                position: style.position,
                whiteSpace: style.whiteSpace,
              };
            })
            .filter((item) => item.right > clientWidth + 1 || item.left < -1)
            .sort((a, b) => b.right - a.right)
            .slice(0, 12);
          return {
            innerWidth: window.innerWidth,
            visualViewportWidth: window.visualViewport?.width ?? null,
            clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            bodyClientWidth: document.body.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            bodyMinWidth: getComputedStyle(document.body).minWidth,
            offenders,
          };
        });
        ensure(narrowState.offenders.length === 0, `${browserName} 320x568 ${route}: elements cross the visible viewport; ${JSON.stringify(narrowState)}`);
        await page.close();
      }
      await narrow.close();

      const reduced = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const reducedPage = await reduced.newPage();
      await reducedPage.goto(origin, { waitUntil: 'networkidle' });
      ensure((await reducedPage.locator('#system-lattice[data-running="true"]').count()) === 0, `${browserName}: lattice runs under reduced motion`);
      await reduced.close();

      const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const noJsPage = await noJs.newPage();
      const noJsResponse = await noJsPage.goto(`${origin}/about/`, { waitUntil: 'domcontentloaded' });
      ensure(noJsResponse?.status() === 200, `${browserName}: no-JS About failed`);
      ensure((await noJsPage.locator('main').innerText()).length > 200, `${browserName}: no-JS content missing`);
      ensure(await noJsPage.locator('#site-navigation').isVisible(), `${browserName}: no-JS navigation hidden`);
      await noJs.close();

      const canvasFallback = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      await canvasFallback.addInitScript(() => {
        HTMLCanvasElement.prototype.getContext = () => null;
      });
      const canvasPage = await canvasFallback.newPage();
      await canvasPage.goto(origin, { waitUntil: 'networkidle' });
      ensure((await canvasPage.locator('#hero-title').innerText()).includes('Vishal'), `${browserName}: canvas fallback hid hero`);
      await canvasFallback.close();

      results.push(browserResult);
    } finally {
      await browser.close();
    }
  }
} catch (error) {
  fs.writeFileSync(path.join(artifacts, 'browser-results.json'), JSON.stringify(results, null, 2));
  fs.writeFileSync(path.join(artifacts, 'browser-failure.txt'), `${error.stack ?? error}\n${serverLog}`);
  throw error;
} finally {
  server.kill('SIGTERM');
}

fs.writeFileSync(path.join(artifacts, 'browser-results.json'), JSON.stringify(results, null, 2));
console.log(`Founder authority browser QA passed in ${results.length} engines with ${results.reduce((sum, result) => sum + result.screenshots, 0)} screenshots.`);
