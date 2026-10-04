const routeCosmicHero = document.querySelector('[data-page-cosmic-hero]');
const routeCosmos = routeCosmicHero?.querySelector('[data-page-cosmos]');
const routeReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (routeCosmicHero && routeCosmos && !routeReducedMotion && window.matchMedia('(min-width: 721px)').matches) {
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;
  let targetScroll = 0;
  let frame = 0;
  let active = true;

  const clampRoute = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateRouteScroll = () => {
    const rect = routeCosmicHero.getBoundingClientRect();
    targetScroll = clampRoute(-rect.top / Math.max(1, rect.height), 0, 1);
  };

  const onRoutePointerMove = (event) => {
    const rect = routeCosmicHero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
  };

  const resetRoutePointer = () => {
    targetX = 0;
    targetY = 0;
  };

  const renderRouteCosmos = (time) => {
    if (!active) return;

    pointerX += (targetX - pointerX) * 0.03;
    pointerY += (targetY - pointerY) * 0.03;
    scrollProgress += (targetScroll - scrollProgress) * 0.045;

    const driftX = Math.sin(time * 0.000045) * 5;
    const driftY = Math.cos(time * 0.000038) * 4;
    const scale = 1.065 + scrollProgress * 0.09;

    routeCosmos.style.setProperty('--route-x', `${(pointerX * 9 + driftX).toFixed(2)}px`);
    routeCosmos.style.setProperty('--route-y', `${(pointerY * 7 + driftY + scrollProgress * 12).toFixed(2)}px`);
    routeCosmos.style.setProperty('--route-scale', scale.toFixed(4));

    frame = requestAnimationFrame(renderRouteCosmos);
  };

  const routeObserver = new IntersectionObserver(([entry]) => {
    active = Boolean(entry?.isIntersecting);
    cancelAnimationFrame(frame);
    if (active) frame = requestAnimationFrame(renderRouteCosmos);
  }, { threshold: 0.03 });

  routeObserver.observe(routeCosmicHero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      active = false;
      cancelAnimationFrame(frame);
      return;
    }
    const rect = routeCosmicHero.getBoundingClientRect();
    active = rect.bottom > 0 && rect.top < window.innerHeight;
    cancelAnimationFrame(frame);
    if (active) frame = requestAnimationFrame(renderRouteCosmos);
  });
  routeCosmicHero.addEventListener('pointermove', onRoutePointerMove, { passive: true });
  routeCosmicHero.addEventListener('pointerleave', resetRoutePointer, { passive: true });
  window.addEventListener('scroll', updateRouteScroll, { passive: true });
  updateRouteScroll();
  frame = requestAnimationFrame(renderRouteCosmos);
}
