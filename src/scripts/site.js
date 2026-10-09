if (!document.documentElement.classList.replace('no-js', 'js')) {
  document.documentElement.classList.add('js');
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
const revealMotionAllowed =
  !reducedMotion &&
  window.matchMedia('(min-width: 721px)').matches &&
  'IntersectionObserver' in window;

if (revealItems.length && revealMotionAllowed) {
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

/* Site-wide Apple-style search, backed by the site's existing public content index.
   No vendor search, personal data collection, or third-party requests. */
const searchToggle = document.querySelector('.global-search-toggle');
const searchPanel = document.querySelector('#site-search-panel');
const searchInput = document.querySelector('#site-search-input');
const searchResults = document.querySelector('#site-search-results');
let searchEntries = [];
let searchRequest;

const hideSearch = () => {
  if (!searchPanel || !searchToggle) return;
  searchPanel.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
};
const showSearch = async () => {
  if (!searchPanel || !searchInput || !searchToggle) return;
  closeMenu();
  searchPanel.hidden = false;
  searchToggle.setAttribute('aria-expanded', 'true');
  searchInput.focus();
  if (!searchRequest) {
    searchRequest = fetch('/content-index.json', { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw new Error('Index unavailable');
        return response.json();
      })
      .then((index) => {
        const pages = (index.pages || []).map((page) => ({
          title: page.title, description: page.description || '', href: page.canonical
        }));
        const essays = (index.essays || []).map((article) => ({
          title: article.title, description: article.summary || '', href: article.canonical
        }));
        searchEntries = [...pages, ...essays].filter((entry) => {
          try { return new URL(entry.href).origin === window.location.origin; }
          catch { return false; }
        });
        return searchEntries;
      })
      .catch(() => {
        if (searchResults) {
          const item = document.createElement('li');
          item.textContent = 'Search is temporarily unavailable. Browse the navigation above.';
          searchResults.replaceChildren(item);
        }
      });
  }
  await searchRequest;
  if (!searchPanel.hidden) searchInput.dispatchEvent(new Event('input'));
};

if (searchToggle && searchPanel && searchInput && searchResults) {
  searchToggle.addEventListener('click', () => {
    if (searchPanel.hidden) showSearch();
    else hideSearch();
  });
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.replaceChildren();
    if (query.length < 2) return;
    const matches = searchEntries.filter((entry) =>
      (entry.title + ' ' + entry.description).toLowerCase().includes(query)
    ).slice(0, 8);
    if (!matches.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No matching pages.';
      searchResults.append(empty);
      return;
    }
    for (const result of matches) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = result.href;
      link.textContent = result.title;
      item.append(link);
      searchResults.append(item);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !searchPanel.hidden) {
      hideSearch();
      searchToggle.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (searchPanel.hidden) showSearch();
      else searchInput.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle.contains(event.target)) hideSearch();
  });
}
