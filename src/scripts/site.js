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

const hubbleHero = document.querySelector('[data-hubble-hero]');
const hubbleCosmos = document.querySelector('[data-real-cosmos]');
const hubbleReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hubbleHero && hubbleCosmos && !hubbleReducedMotion && window.matchMedia('(min-width: 721px)').matches) {
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;
  let targetScroll = 0;
  let frame = 0;
  let active = true;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateScroll = () => {
    const rect = hubbleHero.getBoundingClientRect();
    targetScroll = clamp(-rect.top / Math.max(1, rect.height), 0, 1);
  };

  const onPointerMove = (event) => {
    const rect = hubbleHero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
  };

  const resetPointer = () => {
    targetX = 0;
    targetY = 0;
  };

  const renderCosmos = (time) => {
    if (!active) return;

    pointerX += (targetX - pointerX) * 0.035;
    pointerY += (targetY - pointerY) * 0.035;
    scrollProgress += (targetScroll - scrollProgress) * 0.05;

    const driftX = Math.sin(time * 0.000055) * 7;
    const driftY = Math.cos(time * 0.000043) * 5;
    const wideScale = 1.08 + scrollProgress * 0.13;
    const closeOpacity = 0.08 + scrollProgress * 0.42;
    const closeScale = 1.12 - scrollProgress * 0.08;

    hubbleCosmos.style.setProperty('--hubble-x', `${(pointerX * 12 + driftX).toFixed(2)}px`);
    hubbleCosmos.style.setProperty('--hubble-y', `${(pointerY * 9 + driftY + scrollProgress * 18).toFixed(2)}px`);
    hubbleCosmos.style.setProperty('--hubble-scale', wideScale.toFixed(4));
    hubbleCosmos.style.setProperty('--focus-x', `${(-pointerX * 7 + driftX * 0.25).toFixed(2)}px`);
    hubbleCosmos.style.setProperty('--focus-y', `${(-pointerY * 5 + driftY * 0.2).toFixed(2)}px`);
    hubbleCosmos.style.setProperty('--focus-scale', closeScale.toFixed(4));
    hubbleCosmos.style.setProperty('--focus-opacity', closeOpacity.toFixed(3));

    frame = requestAnimationFrame(renderCosmos);
  };

  const observer = new IntersectionObserver(([entry]) => {
    active = Boolean(entry?.isIntersecting);
    cancelAnimationFrame(frame);
    if (active) frame = requestAnimationFrame(renderCosmos);
  }, { threshold: 0.03 });

  observer.observe(hubbleHero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      active = false;
      cancelAnimationFrame(frame);
      return;
    }
    const rect = hubbleHero.getBoundingClientRect();
    active = rect.bottom > 0 && rect.top < window.innerHeight;
    cancelAnimationFrame(frame);
    if (active) frame = requestAnimationFrame(renderCosmos);
  });
  hubbleHero.addEventListener('pointermove', onPointerMove, { passive: true });
  hubbleHero.addEventListener('pointerleave', resetPointer, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  frame = requestAnimationFrame(renderCosmos);
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
