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
      knots: [],
      filaments: [],
      clouds: [],
    };

    const palette = [
      [242, 247, 255],
      [167, 218, 255],
      [102, 188, 238],
      [125, 118, 224],
      [209, 108, 188],
      [255, 150, 91],
      [255, 205, 132],
    ];

    let seed = 0x53555052;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    const chooseColour = (index = -1) => {
      const position = index >= 0 ? index % palette.length : Math.floor(random() * palette.length);
      return palette[position];
    };

    const createScene = () => {
      seed = 0x53555052;
      const compact = state.width < 720;
      const starCount = compact ? 92 : 186;
      const knotCount = compact ? 92 : 190;
      const filamentCount = compact ? 24 : 48;
      const cloudCount = compact ? 18 : 34;

      state.stars = Array.from({ length: starCount }, (_, index) => ({
        x: random(),
        y: random(),
        depth: 0.2 + random() * 0.8,
        size: index < 10 ? 0.9 + random() * 1.7 : 0.28 + random() * 0.85,
        alpha: 0.1 + random() * 0.62,
        twinkle: random() * Math.PI * 2,
      }));

      state.knots = Array.from({ length: knotCount }, (_, index) => {
        const shell = index % 9 === 0 ? 0.92 : index % 4 === 0 ? 0.74 : 0.55 + random() * 0.35;
        return {
          angle: random() * Math.PI * 2,
          radius: shell + (random() - 0.5) * 0.16,
          depth: 0.35 + random() * 0.65,
          size: index < 18 ? 1.4 + random() * 2.6 : 0.45 + random() * 1.7,
          alpha: 0.12 + random() * 0.68,
          colour: chooseColour(index),
          drift: (random() - 0.5) * 0.000045,
          phase: random() * Math.PI * 2,
          stretch: 0.72 + random() * 0.72,
        };
      });

      state.filaments = Array.from({ length: filamentCount }, (_, index) => ({
        angle: random() * Math.PI * 2,
        radius: 0.32 + random() * 0.66,
        span: 0.12 + random() * 0.42,
        width: 0.45 + random() * 1.25,
        alpha: 0.035 + random() * 0.13,
        colour: chooseColour(index + 2),
        phase: random() * Math.PI * 2,
        drift: (random() - 0.5) * 0.000022,
        wobble: 0.01 + random() * 0.045,
      }));

      state.clouds = Array.from({ length: cloudCount }, (_, index) => ({
        angle: random() * Math.PI * 2,
        radius: 0.16 + random() * 0.82,
        size: 26 + random() * 90,
        alpha: 0.01 + random() * 0.042,
        colour: chooseColour(index + 4),
        phase: random() * Math.PI * 2,
        drift: (random() - 0.5) * 0.000018,
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

    const ellipsePoint = (angle, radius, scale, time = 0, phase = 0) => {
      const drift = Math.sin(time * 0.00008 + phase) * 0.012;
      const r = radius * scale * (1 + drift);
      const squash = state.width < 720 ? 0.84 : 0.78;
      const rotation = -0.16;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * squash;
      return {
        x: x * Math.cos(rotation) - y * Math.sin(rotation),
        y: x * Math.sin(rotation) + y * Math.cos(rotation),
      };
    };

    const drawBackgroundStars = (time) => {
      context.save();
      for (const star of state.stars) {
        const parallaxX = state.pointerX * 8 * star.depth;
        const parallaxY = state.pointerY * 6 * star.depth;
        const pulse = 0.74 + Math.sin(time * 0.0011 + star.twinkle) * 0.26;
        const x = star.x * state.width + parallaxX;
        const y = star.y * state.height + parallaxY;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(232, 239, 255, ${star.alpha * pulse})`;
        context.fill();
      }
      context.restore();
    };

    const drawCloud = (cx, cy, cloud, scale, time) => {
      const angle = cloud.angle + time * cloud.drift;
      const point = ellipsePoint(angle, cloud.radius, scale, time, cloud.phase);
      const x = cx + point.x + state.pointerX * 10 * cloud.radius;
      const y = cy + point.y + state.pointerY * 7 * cloud.radius;
      const [r, g, b] = cloud.colour;
      const gradient = context.createRadialGradient(x, y, 0, x, y, cloud.size);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${cloud.alpha})`);
      gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${cloud.alpha * 0.35})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      context.fillStyle = gradient;
      context.fillRect(x - cloud.size, y - cloud.size, cloud.size * 2, cloud.size * 2);
    };

    const drawFilament = (cx, cy, filament, scale, time) => {
      const start = filament.angle + time * filament.drift;
      const segments = 16;
      const [r, g, b] = filament.colour;

      context.beginPath();
      for (let i = 0; i <= segments; i += 1) {
        const progress = i / segments;
        const angle = start + filament.span * progress;
        const ripple =
          Math.sin(progress * Math.PI * 3 + filament.phase + time * 0.00018) *
          filament.wobble;
        const radius = filament.radius + ripple + Math.sin(progress * Math.PI) * 0.018;
        const point = ellipsePoint(angle, radius, scale, time, filament.phase);
        const x = cx + point.x;
        const y = cy + point.y;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.lineWidth = filament.width;
      context.lineCap = 'round';
      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${filament.alpha})`;
      context.stroke();
    };

    const drawKnot = (cx, cy, knot, scale, time) => {
      const angle = knot.angle + time * knot.drift;
      const point = ellipsePoint(angle, knot.radius, scale, time, knot.phase);
      const x = cx + point.x + state.pointerX * 8 * knot.depth;
      const y = cy + point.y + state.pointerY * 6 * knot.depth;
      const pulse = 0.76 + Math.sin(time * 0.0014 + knot.phase) * 0.24;
      const size = knot.size * (0.75 + knot.depth * 0.52);
      const [r, g, b] = knot.colour;

      const glow = context.createRadialGradient(x, y, 0, x, y, size * 4.4);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${knot.alpha * pulse})`);
      glow.addColorStop(0.24, `rgba(${r}, ${g}, ${b}, ${knot.alpha * pulse * 0.28})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      context.fillStyle = glow;
      context.fillRect(x - size * 4.4, y - size * 4.4, size * 8.8, size * 8.8);

      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(knot.stretch, 1);
      context.beginPath();
      context.arc(0, 0, Math.max(0.38, size * 0.55), 0, Math.PI * 2);
      context.fillStyle = `rgba(246, 249, 255, ${Math.min(0.94, knot.alpha * pulse + 0.12)})`;
      context.fill();
      context.restore();
    };

    const drawShockShell = (cx, cy, scale, time) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(-0.16);
      context.scale(1, state.width < 720 ? 0.84 : 0.78);

      for (const ring of [
        { radius: 0.42, width: 0.65, alpha: 0.08 },
        { radius: 0.67, width: 0.8, alpha: 0.13 },
        { radius: 0.88, width: 0.55, alpha: 0.1 },
        { radius: 1.02, width: 0.45, alpha: 0.055 },
      ]) {
        const breathe = 1 + Math.sin(time * 0.00016 + ring.radius * 8) * 0.007;
        context.beginPath();
        context.arc(0, 0, scale * ring.radius * breathe, 0, Math.PI * 2);
        context.lineWidth = ring.width;
        context.strokeStyle = `rgba(188, 218, 255, ${ring.alpha})`;
        context.stroke();
      }
      context.restore();
    };

    const drawCore = (cx, cy, scale, time) => {
      const pulse = 0.96 + Math.sin(time * 0.0011) * 0.04;
      const coreRadius = scale * 0.19 * pulse;

      const aura = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.54);
      aura.addColorStop(0, 'rgba(255, 252, 244, 0.68)');
      aura.addColorStop(0.035, 'rgba(240, 246, 255, 0.46)');
      aura.addColorStop(0.095, 'rgba(168, 211, 255, 0.26)');
      aura.addColorStop(0.22, 'rgba(117, 132, 231, 0.13)');
      aura.addColorStop(0.42, 'rgba(207, 93, 179, 0.055)');
      aura.addColorStop(0.72, 'rgba(72, 94, 170, 0.018)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = aura;
      context.fillRect(0, 0, state.width, state.height);

      context.save();
      context.globalCompositeOperation = 'screen';
      const spikes = [
        { angle: 0, length: scale * 0.62, width: 0.7, alpha: 0.16 },
        { angle: Math.PI / 2, length: scale * 0.54, width: 0.62, alpha: 0.13 },
        { angle: Math.PI / 4, length: scale * 0.42, width: 0.52, alpha: 0.09 },
        { angle: -Math.PI / 4, length: scale * 0.42, width: 0.52, alpha: 0.09 },
      ];

      for (const spike of spikes) {
        context.save();
        context.translate(cx, cy);
        context.rotate(spike.angle);
        const gradient = context.createLinearGradient(-spike.length, 0, spike.length, 0);
        gradient.addColorStop(0, 'rgba(210, 230, 255, 0)');
        gradient.addColorStop(0.43, `rgba(232, 240, 255, ${spike.alpha * 0.18})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${spike.alpha})`);
        gradient.addColorStop(0.57, `rgba(232, 240, 255, ${spike.alpha * 0.18})`);
        gradient.addColorStop(1, 'rgba(210, 230, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(-spike.length, -spike.width / 2, spike.length * 2, spike.width);
        context.restore();
      }

      const core = context.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      core.addColorStop(0, 'rgba(255, 255, 255, 1)');
      core.addColorStop(0.08, 'rgba(255, 252, 238, 0.98)');
      core.addColorStop(0.24, 'rgba(221, 238, 255, 0.88)');
      core.addColorStop(0.52, 'rgba(158, 203, 255, 0.34)');
      core.addColorStop(1, 'rgba(109, 132, 240, 0)');
      context.fillStyle = core;
      context.fillRect(cx - coreRadius, cy - coreRadius, coreRadius * 2, coreRadius * 2);
      context.restore();
    };

    const drawVignette = (cx, cy, scale) => {
      const vignette = context.createRadialGradient(
        cx,
        cy,
        scale * 0.12,
        state.width * 0.5,
        state.height * 0.5,
        Math.max(state.width, state.height) * 0.8,
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.54, 'rgba(0, 0, 0, 0.04)');
      vignette.addColorStop(0.78, 'rgba(0, 0, 0, 0.28)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.72)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, state.width, state.height);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, state.width, state.height);

      state.pointerX += (state.pointerTargetX - state.pointerX) * 0.032;
      state.pointerY += (state.pointerTargetY - state.pointerY) * 0.032;

      const compact = state.width < 720;
      const cx = state.width * (compact ? 0.72 : 0.64) + state.pointerX * 16;
      const cy = state.height * (compact ? 0.34 : 0.44) + state.pointerY * 12;
      const scale = Math.min(state.width, state.height) * (compact ? 0.56 : 0.57);

      drawBackgroundStars(time);

      context.save();
      context.globalCompositeOperation = 'screen';

      for (const cloud of state.clouds) drawCloud(cx, cy, cloud, scale, time);
      drawShockShell(cx, cy, scale, time);

      for (const filament of state.filaments) drawFilament(cx, cy, filament, scale, time);
      for (const knot of state.knots) drawKnot(cx, cy, knot, scale, time);

      drawCore(cx, cy, scale, time);
      context.restore();

      drawVignette(cx, cy, scale);
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

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', syncMotion);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    syncMotion();
  }
}
