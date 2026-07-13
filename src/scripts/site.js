document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

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

const latticeEligible =
  document.querySelector('#system-lattice') &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.innerWidth >= 720 &&
  !navigator.connection?.saveData &&
  (navigator.deviceMemory ?? 8) >= 4 &&
  (navigator.hardwareConcurrency ?? 8) >= 4;

if (latticeEligible) {
  const loadLattice = () => {
    const schedule = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 400));
    schedule(() => import('/assets/lattice.js').catch(() => {}), { timeout: 1200 });
  };
  if (document.readyState === 'complete') loadLattice();
  else window.addEventListener('load', loadLattice, { once: true });
}
