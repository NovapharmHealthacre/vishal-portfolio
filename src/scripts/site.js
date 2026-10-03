document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

const isSafariWebKit =
  /AppleWebKit/i.test(navigator.userAgent) &&
  !/(Chrome|Chromium|CriOS|Edg|OPR|Android)/i.test(navigator.userAgent);

if (isSafariWebKit) {
  for (const source of document.querySelectorAll('picture source[type="image/avif"]')) source.remove();
}

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

const closeMenu = () => {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
};

if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

const novaFieldEligible =
  document.querySelector('#nova-field') &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !navigator.connection?.saveData &&
  (navigator.deviceMemory ?? 8) >= 4 &&
  (navigator.hardwareConcurrency ?? 8) >= 4;

if (novaFieldEligible) {
  const loadNovaField = () => {
    const schedule = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 120));
    schedule(() => import('/assets/nova-field.js').catch(() => {}), { timeout: 700 });
  };
  if (document.readyState === 'complete') loadNovaField();
  else window.addEventListener('load', loadNovaField, { once: true });
}


const header = document.querySelector('[data-site-header]');
if (header) {
  const syncHeader = () => {
    header.dataset.scrolled = String(window.scrollY > 8);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

const revealItems = [...document.querySelectorAll('[data-reveal]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealItems.length) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    for (const item of revealItems) item.classList.add('is-visible');
  } else {
    document.documentElement.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.08 },
    );
    for (const item of revealItems) revealObserver.observe(item);
  }
}
