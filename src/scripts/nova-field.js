const canvas = document.querySelector('#nova-field');

if (canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const context = canvas.getContext('2d', { alpha: true, desynchronized: true });

  if (context) {
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      running: false,
      visible: true,
      frame: 0,
      lastDraw: 0,
      pointerX: 0,
      pointerY: 0,
      pointerTargetX: 0,
      pointerTargetY: 0,
      stars: [],
      dust: [],
    };

    let seed = 0x4e4f5641;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    const createScene = () => {
      seed = 0x4e4f5641;
      const compact = state.width < 720;
      const starCount = compact ? 88 : 168;
      const dustCount = compact ? 22 : 38;

      state.stars = Array.from({ length: starCount }, (_, index) => {
        const radius = Math.pow(random(), 0.62);
        return {
          radius,
          angle: random() * Math.PI * 2,
          depth: 0.28 + random() * 0.72,
          size: index < 8 ? 1.3 + random() * 1.8 : 0.35 + random() * 1.05,
          alpha: 0.18 + random() * 0.72,
          speed: (0.000035 + random() * 0.00009) * (random() > 0.5 ? 1 : -1),
          twinkle: random() * Math.PI * 2,
        };
      });

      state.dust = Array.from({ length: dustCount }, () => ({
        radius: 0.12 + random() * 0.9,
        angle: random() * Math.PI * 2,
        depth: 0.2 + random() * 0.8,
        size: 14 + random() * 56,
        alpha: 0.008 + random() * 0.022,
        speed: (0.000015 + random() * 0.000025) * (random() > 0.5 ? 1 : -1),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = Math.max(1, Math.round(rect.width));
      state.height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      createScene();
      draw(performance.now());
    };

    const galaxyPoint = (particle, time) => {
      const minDimension = Math.min(state.width, state.height);
      const drift = time * particle.speed;
      const angle = particle.angle + drift;
      const spiral = angle + particle.radius * 2.7;
      const radius = particle.radius * minDimension * 0.53;
      const squash = 0.47 + particle.depth * 0.22;
      const x = Math.cos(spiral) * radius;
      const y = Math.sin(spiral) * radius * squash;
      const rotation = -0.34;
      return {
        x: x * Math.cos(rotation) - y * Math.sin(rotation),
        y: x * Math.sin(rotation) + y * Math.cos(rotation),
      };
    };

    const drawFilament = (cx, cy, time, radius, alpha, offset) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(-0.34 + Math.sin(time * 0.00008 + offset) * 0.025);
      context.scale(1, 0.55);
      context.beginPath();
      context.arc(0, 0, radius, 0.2 + offset, Math.PI * 1.5 + offset);
      context.lineWidth = 0.7;
      context.strokeStyle = `rgba(170, 196, 255, ${alpha})`;
      context.stroke();
      context.restore();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, state.width, state.height);

      state.pointerX += (state.pointerTargetX - state.pointerX) * 0.035;
      state.pointerY += (state.pointerTargetY - state.pointerY) * 0.035;

      const cx = state.width * 0.62 + state.pointerX * 15;
      const cy = state.height * 0.46 + state.pointerY * 11;
      const minDimension = Math.min(state.width, state.height);

      const core = context.createRadialGradient(cx, cy, 0, cx, cy, minDimension * 0.48);
      core.addColorStop(0, 'rgba(225, 232, 255, 0.22)');
      core.addColorStop(0.08, 'rgba(151, 176, 255, 0.12)');
      core.addColorStop(0.25, 'rgba(91, 116, 214, 0.055)');
      core.addColorStop(0.62, 'rgba(49, 62, 120, 0.018)');
      core.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = core;
      context.fillRect(0, 0, state.width, state.height);

      context.globalCompositeOperation = 'screen';

      for (const particle of state.dust) {
        const point = galaxyPoint(particle, time);
        const x = cx + point.x + state.pointerX * 7 * particle.depth;
        const y = cy + point.y + state.pointerY * 5 * particle.depth;
        const gradient = context.createRadialGradient(x, y, 0, x, y, particle.size);
        gradient.addColorStop(0, `rgba(185, 204, 255, ${particle.alpha})`);
        gradient.addColorStop(1, 'rgba(88, 107, 183, 0)');
        context.fillStyle = gradient;
        context.fillRect(x - particle.size, y - particle.size, particle.size * 2, particle.size * 2);
      }

      drawFilament(cx, cy, time, minDimension * 0.23, 0.065, 0.2);
      drawFilament(cx, cy, time, minDimension * 0.35, 0.045, 1.1);
      drawFilament(cx, cy, time, minDimension * 0.47, 0.026, 2.05);

      for (const particle of state.stars) {
        const point = galaxyPoint(particle, time);
        const x = cx + point.x + state.pointerX * 9 * particle.depth;
        const y = cy + point.y + state.pointerY * 6 * particle.depth;
        const pulse = 0.76 + Math.sin(time * 0.0013 + particle.twinkle) * 0.24;
        const size = particle.size * (0.72 + particle.depth * 0.48);
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = `rgba(232, 238, 255, ${particle.alpha * pulse})`;
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';

      const vignette = context.createRadialGradient(
        state.width * 0.52,
        state.height * 0.5,
        minDimension * 0.12,
        state.width * 0.5,
        state.height * 0.5,
        Math.max(state.width, state.height) * 0.78,
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.52)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, state.width, state.height);
    };

    const tick = (time) => {
      if (!state.running) return;
      if (time - state.lastDraw >= 32) {
        draw(time);
        state.lastDraw = time;
      }
      state.frame = requestAnimationFrame(tick);
    };

    const syncMotion = () => {
      cancelAnimationFrame(state.frame);
      state.running = false;
      draw(performance.now());
      if (!reduceMotion.matches && state.visible && !document.hidden) {
        state.running = true;
        state.frame = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.visible = Boolean(entry?.isIntersecting);
        syncMotion();
      },
      { threshold: 0.05 },
    );

    observer.observe(canvas);

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      state.pointerTargetX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      state.pointerTargetY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    };

    const resetPointer = () => {
      state.pointerTargetX = 0;
      state.pointerTargetY = 0;
    };

    canvas.closest('.hero-cosmic')?.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.closest('.hero-cosmic')?.addEventListener('pointerleave', resetPointer, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);

    if (typeof reduceMotion.addEventListener === 'function') reduceMotion.addEventListener('change', syncMotion);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    syncMotion();
  }
}
