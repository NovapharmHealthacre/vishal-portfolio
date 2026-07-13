import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { canonicalRoutes as pageRoutes, legacyRedirects, physicalAliases } from '../../src/data/site.mjs';
import { loadArticles } from '../../src/lib/content.mjs';

const packagePath =
  process.env.PLAYWRIGHT_MODULE ??
  path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');

if (!fs.existsSync(packagePath)) {
  console.error('Playwright package unavailable. Set PLAYWRIGHT_MODULE to playwright/index.mjs.');
  process.exit(2);
}

const { chromium, firefox, webkit } = await import(pathToFileURL(packagePath).href);
const port = 4399;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/dev.mjs', '--dist', `--port=${port}`], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {}
    if (server.exitCode !== null) {
      throw new Error(`Preview server exited with code ${server.exitCode}: ${serverOutput.trim()}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Preview server did not start: ${serverOutput.trim() || 'no child-process output'}`);
};

const ensure = (condition, message) => {
  if (!condition) throw new Error(message);
};

const articles = loadArticles(path.resolve('.'));
const essayRoutes = articles.map((article) => article.canonicalPath);
const canonicalRoutes = [...pageRoutes, ...essayRoutes];
const generatedCompatibilityRoutes = [
  ...Object.keys(legacyRedirects),
  ...articles.map((article) => `/thinking/${article.slug}/`),
  ...articles.flatMap((article) => article.legacyPaths.filter((route) => !route.endsWith('/index.html'))),
];
const directIndexRoutes = [
  ...Object.keys(physicalAliases),
  ...articles.flatMap((article) => article.legacyPaths.filter((route) => route.endsWith('/index.html'))),
];
const routeChecks = [
  ...canonicalRoutes.map((route) => ({ route, expectedNoIndex: false })),
  ...generatedCompatibilityRoutes.map((route) => ({ route, expectedNoIndex: true })),
  ...directIndexRoutes.map((route) => ({ route, expectedNoIndex: false })),
].filter((entry, index, entries) => entries.findIndex((candidate) => candidate.route === entry.route) === index);

const visualRoutes = [
  '/',
  '/about/',
  '/ventures/',
  '/thinking/',
  '/essays/regulated-industries/',
  '/facts/',
  '/contact/',
  '/404.html',
];
const overflowRoutes = ['/', '/essays/what-parallel-import-actually-means/', '/speaking-partnerships/', '/contact/'];
const overflowViewports = [
  { width: 320, height: 568, mobile: true, label: '320x568' },
  { width: 360, height: 800, mobile: true, label: '360x800' },
  { width: 390, height: 844, mobile: true, label: '390x844' },
  { width: 768, height: 1024, mobile: false, label: '768x1024' },
  { width: 1024, height: 768, mobile: false, label: '1024x768' },
  { width: 1280, height: 800, mobile: false, label: '1280x800' },
  { width: 1440, height: 1000, mobile: false, label: '1440x1000' },
  { width: 1920, height: 1080, mobile: false, label: '1920x1080' },
  { width: 844, height: 390, mobile: true, label: '844x390-landscape' },
];

const results = [];
const output = path.resolve('artifacts/screenshots');
fs.mkdirSync(output, { recursive: true });

const screenshotSlug = (route) => {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-').replace(/\.html$/, '') || 'home';
};

const diagnosticsFor = (page, options = {}) => {
  let consoleErrors = [];
  let pageErrors = [];
  let requestFailures = [];

  page.on('console', (message) => {
    if (message.type() === 'error' && !options.ignoreConsoleError?.(message)) {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.startsWith(base) && !options.ignoreFailedRequest?.(url)) {
      requestFailures.push(`${url} (${request.failure()?.errorText ?? 'unknown error'})`);
    }
  });

  return {
    reset() {
      consoleErrors = [];
      pageErrors = [];
      requestFailures = [];
    },
    assertClean(label) {
      const failures = [
        ...consoleErrors.map((message) => `console: ${message}`),
        ...pageErrors.map((message) => `pageerror: ${message}`),
        ...requestFailures.map((message) => `requestfailed: ${message}`),
      ];
      this.reset();
      if (failures.length) throw new Error(`${label}: ${failures.join('; ')}`);
    },
  };
};

const assertDocument = async (page, label, expectedNoIndex) => {
  ensure((await page.locator('h1').count()) === 1, `${label}: expected one H1`);
  ensure((await page.locator('main#main').count()) === 1, `${label}: main landmark missing`);
  ensure(await page.locator('h1').isVisible(), `${label}: H1 is not visible`);
  ensure(
    !(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)),
    `${label}: horizontal overflow`,
  );
  const brokenImages = await page.locator('img').evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.getAttribute('src') || 'unknown image'),
  );
  ensure(!brokenImages.length, `${label}: broken images ${brokenImages.join(', ')}`);
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  if (expectedNoIndex === true) ensure(robots === 'noindex,follow', `${label}: expected noindex,follow`);
  if (expectedNoIndex === false) ensure(!robots?.includes('noindex'), `${label}: unexpectedly noindex`);
};

const auditRoute = async (page, diagnostics, route, options = {}) => {
  diagnostics.reset();
  const response = await page.goto(`${base}${route}`, { waitUntil: options.waitUntil ?? 'networkidle' });
  const expectedStatus = options.expectedStatus ?? 200;
  ensure(response?.status() === expectedStatus, `${options.label ?? route}: returned ${response?.status()}, expected ${expectedStatus}`);
  if (options.settleMs) await page.waitForTimeout(options.settleMs);
  await assertDocument(page, options.label ?? route, options.expectedNoIndex);
  diagnostics.assertClean(options.label ?? route);
};

const installImmediateIdleCallback = async (context) => {
  await context.addInitScript(() => {
    window.requestIdleCallback = (callback) => window.setTimeout(
      () => callback({ didTimeout: false, timeRemaining: () => 50 }),
      0,
    );
    window.cancelIdleCallback = (identifier) => window.clearTimeout(identifier);
  });
};

const assertNoJavaScriptRoutes = async (browser, browserName, viewport, label) => {
  const context = await browser.newContext({
    viewport,
    ...(browserName === 'firefox' ? {} : { isMobile: viewport.width < 600 }),
    hasTouch: viewport.width < 600,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    const diagnostics = diagnosticsFor(page);
    for (const check of [...routeChecks, { route: '/404.html', expectedNoIndex: true }]) {
      await auditRoute(page, diagnostics, check.route, {
        waitUntil: 'load',
        expectedNoIndex: check.expectedNoIndex,
        label: `${browserName} ${label} no-JS ${check.route}`,
      });
      ensure(await page.locator('#site-navigation').isVisible(), `${browserName} ${label}: no-JS navigation hidden on ${check.route}`);
      if (check.route === '/' || check.route === '/index.html') {
        ensure(await page.locator('#hero-title').isVisible(), `${browserName} ${label}: no-JS hero hidden`);
        ensure(await page.locator('.lattice-poster').isVisible(), `${browserName} ${label}: no-JS poster hidden`);
      }
    }
  } finally {
    await context.close();
  }
};

const assertDisabledLattice = async (browser, browserName, label, initScript, viewport = { width: 1440, height: 1000 }) => {
  const context = await browser.newContext({ viewport });
  await installImmediateIdleCallback(context);
  if (initScript) await context.addInitScript(initScript);
  try {
    const page = await context.newPage();
    let latticeRequests = 0;
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/assets/lattice.js') latticeRequests += 1;
    });
    const diagnostics = diagnosticsFor(page);
    await auditRoute(page, diagnostics, '/', { label: `${browserName} ${label}`, waitUntil: 'load', settleMs: 100 });
    ensure(latticeRequests === 0, `${browserName} ${label}: lattice module was requested`);
    ensure(await page.locator('.lattice-poster').isVisible(), `${browserName} ${label}: static poster hidden`);
  } finally {
    await context.close();
  }
};

const runBrowserSuite = async (browser, browserName) => {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  try {
    const page = await desktop.newPage();
    const diagnostics = diagnosticsFor(page);
    for (const check of routeChecks) {
      await auditRoute(page, diagnostics, check.route, {
        expectedNoIndex: check.expectedNoIndex,
        settleMs: check.route === '/' || check.route === '/index.html' ? 1300 : 0,
        label: `${browserName} desktop ${check.route}`,
      });
    }
    await auditRoute(page, diagnostics, '/definitely-not-a-route/', {
      expectedStatus: 404,
      expectedNoIndex: true,
      label: `${browserName} unknown route`,
    });
    for (const route of visualRoutes) {
      await auditRoute(page, diagnostics, route, {
        expectedNoIndex: route === '/404.html',
        settleMs: route === '/' ? 1300 : 0,
        label: `${browserName} desktop visual ${route}`,
      });
      await page.screenshot({ path: path.join(output, `${screenshotSlug(route)}-${browserName}-desktop.png`), fullPage: true });
    }
  } finally {
    await desktop.close();
  }

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    ...(browserName === 'firefox' ? {} : { isMobile: true }),
    hasTouch: true,
  });
  try {
    const page = await mobile.newPage();
    const diagnostics = diagnosticsFor(page);
    for (const route of visualRoutes) {
      await auditRoute(page, diagnostics, route, {
        expectedNoIndex: route === '/404.html',
        label: `${browserName} mobile visual ${route}`,
      });
      await page.screenshot({ path: path.join(output, `${screenshotSlug(route)}-${browserName}-mobile.png`), fullPage: true });
    }

    await auditRoute(page, diagnostics, '/', { label: `${browserName} mobile interaction home` });
    diagnostics.reset();
    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    ensure(await skipLink.evaluate((element) => document.activeElement === element), `${browserName}: skip link did not receive focus`);
    await skipLink.press('Enter');
    await page.waitForFunction(() => window.location.hash === '#main');
    ensure(
      await page.locator('#main').evaluate((element) => document.activeElement === element),
      `${browserName}: skip link did not move focus to main`,
    );
    diagnostics.assertClean(`${browserName} skip-link interaction`);

    await auditRoute(page, diagnostics, '/', { label: `${browserName} mobile-menu home` });
    diagnostics.reset();
    const toggle = page.locator('.menu-toggle');
    await toggle.focus();
    await toggle.click();
    ensure((await toggle.getAttribute('aria-expanded')) === 'true', `${browserName}: mobile menu did not expand`);
    ensure(await page.locator('#site-navigation').isVisible(), `${browserName}: expanded mobile navigation hidden`);
    await page.keyboard.press('Escape');
    ensure((await toggle.getAttribute('aria-expanded')) === 'false', `${browserName}: Escape did not collapse mobile menu`);
    ensure(await toggle.evaluate((element) => document.activeElement === element), `${browserName}: Escape did not return focus to menu toggle`);
    ensure(!(await page.locator('#site-navigation').isVisible()), `${browserName}: collapsed mobile navigation remained visible`);
    diagnostics.assertClean(`${browserName} mobile-menu interaction`);
  } finally {
    await mobile.close();
  }

  for (const viewport of overflowViewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      ...(browserName === 'firefox' ? {} : { isMobile: viewport.mobile }),
      hasTouch: viewport.mobile,
      reducedMotion: 'reduce',
    });
    try {
      const page = await context.newPage();
      const diagnostics = diagnosticsFor(page);
      for (const route of overflowRoutes) {
        await auditRoute(page, diagnostics, route, {
          label: `${browserName} ${viewport.label} ${route}`,
        });
      }
    } finally {
      await context.close();
    }
  }

  await assertNoJavaScriptRoutes(browser, browserName, { width: 1440, height: 1000 }, 'desktop');
  await assertNoJavaScriptRoutes(browser, browserName, { width: 390, height: 844 }, 'mobile');

  const reduced = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await installImmediateIdleCallback(reduced);
  try {
    const page = await reduced.newPage();
    let latticeRequests = 0;
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/assets/lattice.js') latticeRequests += 1;
    });
    const diagnostics = diagnosticsFor(page);
    await auditRoute(page, diagnostics, '/', { label: `${browserName} reduced motion`, waitUntil: 'load', settleMs: 100 });
    ensure(latticeRequests === 0, `${browserName}: lattice requested under reduced motion`);
    ensure(!(await page.locator('#system-lattice').isVisible()), `${browserName}: canvas visible under reduced motion`);
    ensure(await page.locator('.lattice-poster').isVisible(), `${browserName}: reduced-motion poster hidden`);
    ensure((await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)) === 0, `${browserName}: animation remained active under reduced motion`);
  } finally {
    await reduced.close();
  }

  await assertDisabledLattice(browser, browserName, 'Save-Data fallback', () => {
    Object.defineProperty(navigator, 'connection', { configurable: true, get: () => ({ saveData: true }) });
  });
  await assertDisabledLattice(browser, browserName, 'low-memory fallback', () => {
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 2 });
  });
  await assertDisabledLattice(browser, browserName, 'low-concurrency fallback', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 2 });
  });
  await assertDisabledLattice(browser, browserName, 'narrow-screen fallback', undefined, { width: 390, height: 844 });

  const noCanvas = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await installImmediateIdleCallback(noCanvas);
  await noCanvas.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  try {
    const page = await noCanvas.newPage();
    const diagnostics = diagnosticsFor(page);
    await auditRoute(page, diagnostics, '/', { label: `${browserName} canvas failure`, waitUntil: 'load', settleMs: 100 });
    await page.waitForFunction(() => document.querySelector('#system-lattice')?.hidden === true);
    ensure(await page.locator('.lattice-poster').isVisible(), `${browserName}: canvas failure removed the poster fallback`);
  } finally {
    await noCanvas.close();
  }

  const moduleFailure = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await installImmediateIdleCallback(moduleFailure);
  try {
    const page = await moduleFailure.newPage();
    await page.route('**/assets/lattice.js', (route) => route.abort('failed'));
    const diagnostics = diagnosticsFor(page, {
      ignoreFailedRequest: (url) => new URL(url).pathname === '/assets/lattice.js',
      ignoreConsoleError: (message) =>
        new URL(message.location().url || base).pathname === '/assets/lattice.js' ||
        /failed to load resource/i.test(message.text()),
    });
    const latticeRequest = page.waitForRequest((request) => new URL(request.url()).pathname === '/assets/lattice.js');
    await auditRoute(page, diagnostics, '/', { label: `${browserName} lattice module failure`, waitUntil: 'load' });
    await latticeRequest;
    await page.waitForTimeout(50);
    diagnostics.assertClean(`${browserName} lattice module failure`);
    ensure(await page.locator('#hero-title').isVisible(), `${browserName}: module failure hid hero content`);
    ensure(await page.locator('.lattice-poster').isVisible(), `${browserName}: module failure removed the poster fallback`);
  } finally {
    await moduleFailure.close();
  }
};

try {
  await waitForServer();
  for (const [name, browserType] of Object.entries({ chromium, firefox, webkit })) {
    let browser;
    try {
      browser = await browserType.launch({ headless: true });
    } catch (error) {
      console.error(`${name} could not launch: ${error.message}`);
      process.exitCode = 2;
      continue;
    }
    try {
      await runBrowserSuite(browser, name);
      results.push({
        browser: name,
        routeChecks: routeChecks.length,
        desktop: 'pass',
        mobile: 'pass',
        responsive: `${overflowViewports.length} viewports pass`,
        noJavaScript: 'desktop and mobile pass',
        reducedMotion: 'pass',
        canvasFailure: 'pass',
        saveData: 'pass',
        lowMemory: 'pass',
        lowConcurrency: 'pass',
        moduleFailure: 'pass',
      });
    } catch (error) {
      console.error(`${name} QA failed: ${error.stack ?? error.message}`);
      process.exitCode = 1;
    } finally {
      await browser.close();
    }
  }
} finally {
  server.kill('SIGTERM');
  fs.mkdirSync(path.resolve('artifacts'), { recursive: true });
  fs.writeFileSync(path.resolve('artifacts/browser-results.json'), `${JSON.stringify(results, null, 2)}\n`);
}

if (results.length !== 3) {
  console.error(`Browser QA incomplete: ${results.length}/3 browser engines passed.`);
  process.exit(process.exitCode || 1);
}
console.log(`Browser QA passed in ${results.map((result) => result.browser).join(', ')}.`);
