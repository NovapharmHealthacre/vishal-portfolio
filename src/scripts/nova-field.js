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
      startedAt: performance.now(),
      pointerX: 0,
      pointerY: 0,
      pointerTargetX: 0,
      pointerTargetY: 0,
      scroll: 0,
      scrollTarget: 0,
      stars: [],
      filaments: [],
      tracers: [],
      ejecta: [],
      wisps: [],
    };

    const palette = {
      ice: [236, 250, 255],
      cyan: [45, 195, 224],
      teal: [15, 156, 181],
      blue: [51, 128, 211],
      violet: [135, 101, 209],
      magenta: [184, 34, 93],
      rose: [221, 64, 101],
      ember: [219, 120, 52],
      gold: [238, 173, 85],
    };

    const colourSequence = [
      palette.cyan,
      palette.ice,
      palette.teal,
      palette.rose,
      palette.magenta,
      palette.blue,
      palette.ember,
      palette.cyan,
      palette.violet,
      palette.gold,
    ];

    let seed = 0x41535452;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    const lerp = (from, to, amount) => from + (to - from) * amount;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

    const rgba = (colour, alpha) =>
      `rgba(${colour[0]}, ${colour[1]}, ${colour[2]}, ${alpha})`;

    const createScene = () => {
      seed = 0x41535452;

      const wide = state.width > 1100;
      const starCount = wide ? 180 : 128;
      const filamentCount = wide ? 34 : 26;
      const tracerCount = wide ? 240 : 170;
      const ejectaCount = wide ? 260 : 190;
      const wispCount = wide ? 20 : 14;

      state.stars = Array.from({ length: starCount }, (_, index) => ({
        x: random(),
        y: random(),
        depth: 0.18 + random() * 0.82,
        size: index < 12 ? 0.8 + random() * 1.7 : 0.25 + random() * 0.85,
        alpha: 0.08 + random() * 0.58,
        twinkle: random() * Math.PI * 2,
      }));

      state.filaments = Array.from({ length: filamentCount }, (_, index) => {
        const outer = index % 5 === 0;
        const colour = colourSequence[index % colourSequence.length];
        const warm = colour === palette.magenta || colour === palette.rose || colour === palette.ember || colour === palette.gold;

        return {
          index,
          colour,
          base: outer ? 0.78 + random() * 0.16 : 0.38 + random() * 0.44,
          thickness: outer ? 0.8 + random() * 1.25 : 0.55 + random() * 1.05,
          alpha: outer ? 0.11 + random() * 0.12 : 0.075 + random() * 0.12,
          phase: random() * Math.PI * 2,
          rotation: -0.22 + (random() - 0.5) * 0.38,
          squash: 0.52 + random() * 0.28,
          freqA: 2 + Math.floor(random() * 4),
          freqB: 5 + Math.floor(random() * 5),
          ampA: 0.035 + random() * 0.065,
          ampB: 0.012 + random() * 0.036,
          drift: (random() - 0.5) * 0.000025,
          lobe: index % 3 === 0 ? (random() > 0.5 ? 1 : -1) : 0,
          lobeStrength: warm ? 0.08 + random() * 0.14 : 0.03 + random() * 0.09,
          offsetX: (random() - 0.5) * 0.08,
          offsetY: (random() - 0.5) * 0.06,
        };
      });

      state.tracers = Array.from({ length: tracerCount }, (_, index) => ({
        path: Math.floor(random() * state.filaments.length),
        t: random(),
        speed: 0.000009 + random() * 0.000034,
        size: index < 24 ? 0.9 + random() * 1.4 : 0.35 + random() * 0.9,
        alpha: 0.15 + random() * 0.66,
        phase: random() * Math.PI * 2,
        direction: random() > 0.2 ? 1 : -1,
      }));

      state.ejecta = Array.from({ length: ejectaCount }, (_, index) => {
        const colour = colourSequence[(index * 3) % colourSequence.length];
        return {
          angle: random() * Math.PI * 2,
          radius: 0.16 + random() * 0.86,
          spread: (random() - 0.5) * 0.24,
          size: index < 18 ? 1.1 + random() * 2.3 : 0.28 + random() * 1.1,
          alpha: 0.1 + random() * 0.54,
          depth: 0.3 + random() * 0.7,
          colour,
          phase: random() * Math.PI * 2,
          drift: (random() - 0.5) * 0.00003,
        };
      });

      state.wisps = Array.from({ length: wispCount }, (_, index) => ({
        angle: random() * Math.PI * 2,
        radius: 0.2 + random() * 0.72,
        span: 0.25 + random() * 0.52,
        size: 60 + random() * 150,
        alpha: 0.012 + random() * 0.038,
        colour: colourSequence[(index + 4) % colourSequence.length],
        phase: random() * Math.PI * 2,
        drift: (random() - 0.5) * 0.000015,
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

    const geometry = (time) => {
      const compact = state.width < 900;
      const scrollExpansion = 1 + state.scroll * 0.12;
      const intro = easeOutCubic(clamp((time - state.startedAt) / 2100, 0, 1));
      const introScale = lerp(0.72, 1, intro);
      const scale = Math.min(state.width, state.height) * (compact ? 0.62 : 0.68) * scrollExpansion * introScale;

      return {
        cx: state.width * (compact ? 0.67 : 0.63) + state.pointerX * 18,
        cy: state.height * (compact ? 0.42 : 0.43) + state.pointerY * 13 + state.scroll * 18,
        scale,
        intro,
      };
    };

    const filamentPoint = (filament, t, scale, time) => {
      const theta = t * Math.PI * 2 + filament.rotation + time * filament.drift;
      const wobble =
        Math.sin(theta * filament.freqA + filament.phase + time * 0.00012) * filament.ampA +
        Math.sin(theta * filament.freqB - filament.phase * 0.7 - time * 0.00008) * filament.ampB;

      const petal = filament.lobe
        ? Math.max(0, Math.cos(theta - filament.phase)) * filament.lobeStrength * filament.lobe
        : 0;

      const radialBreath = Math.sin(time * 0.00022 + filament.phase) * 0.008;
      const radius = filament.base + wobble + radialBreath;
      const rawX = Math.cos(theta) * radius * scale;
      const rawY = Math.sin(theta) * radius * scale * filament.squash;

      const twist = -0.12;
      const x = rawX * Math.cos(twist) - rawY * Math.sin(twist);
      const y = rawX * Math.sin(twist) + rawY * Math.cos(twist);

      return {
        x: x + filament.offsetX * scale + petal * scale,
        y: y + filament.offsetY * scale + petal * scale * 0.16,
      };
    };

    const drawStars = (time) => {
      context.save();
      for (const star of state.stars) {
        const pulse = 0.72 + Math.sin(time * 0.00115 + star.twinkle) * 0.28;
        const x = star.x * state.width + state.pointerX * 7 * star.depth;
        const y = star.y * state.height + state.pointerY * 5 * star.depth;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(228, 240, 255, ${star.alpha * pulse})`;
        context.fill();
      }
      context.restore();
    };

    const drawWisps = (cx, cy, scale, time) => {
      for (const wisp of state.wisps) {
        const angle = wisp.angle + time * wisp.drift;
        const radius = wisp.radius * scale;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.62;
        const gradient = context.createRadialGradient(x, y, 0, x, y, wisp.size);
        gradient.addColorStop(0, rgba(wisp.colour, wisp.alpha));
        gradient.addColorStop(0.48, rgba(wisp.colour, wisp.alpha * 0.28));
        gradient.addColorStop(1, rgba(wisp.colour, 0));
        context.fillStyle = gradient;
        context.fillRect(x - wisp.size, y - wisp.size, wisp.size * 2, wisp.size * 2);
      }
    };

    const drawFilament = (filament, cx, cy, scale, time, intro) => {
      const segments = 58;
      const colour = filament.colour;
      const visibleSegments = Math.max(3, Math.floor(segments * intro));

      context.beginPath();
      for (let i = 0; i <= visibleSegments; i += 1) {
        const t = i / segments;
        const point = filamentPoint(filament, t, scale, time);
        const x = cx + point.x;
        const y = cy + point.y;

        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = filament.thickness * 5.4;
      context.strokeStyle = rgba(colour, filament.alpha * 0.13 * intro);
      context.stroke();

      context.lineWidth = filament.thickness * 1.45;
      context.strokeStyle = rgba(colour, filament.alpha * 0.82 * intro);
      context.stroke();

      context.lineWidth = Math.max(0.45, filament.thickness * 0.38);
      context.strokeStyle = rgba(palette.ice, filament.alpha * 0.32 * intro);
      context.stroke();
    };

    const drawTracers = (cx, cy, scale, time, intro) => {
      for (const tracer of state.tracers) {
        const filament = state.filaments[tracer.path];
        if (!filament) continue;

        const travel = tracer.t + time * tracer.speed * tracer.direction;
        const t = ((travel % 1) + 1) % 1;
        const point = filamentPoint(filament, t, scale, time);
        const previous = filamentPoint(filament, (t - 0.004 * tracer.direction + 1) % 1, scale, time);
        const x = cx + point.x;
        const y = cy + point.y;
        const px = cx + previous.x;
        const py = cy + previous.y;
        const pulse = 0.7 + Math.sin(time * 0.0017 + tracer.phase) * 0.3;
        const alpha = tracer.alpha * pulse * intro;

        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(x, y);
        context.lineCap = 'round';
        context.lineWidth = tracer.size * 1.1;
        context.strokeStyle = rgba(filament.colour, alpha * 0.5);
        context.stroke();

        context.beginPath();
        context.arc(x, y, tracer.size, 0, Math.PI * 2);
        context.fillStyle = rgba(palette.ice, Math.min(0.95, alpha));
        context.fill();
      }
    };

    const drawEjecta = (cx, cy, scale, time, intro) => {
      for (const particle of state.ejecta) {
        const drift = time * particle.drift;
        const angle = particle.angle + drift;
        const pulse = 0.7 + Math.sin(time * 0.0014 + particle.phase) * 0.3;
        const radius = particle.radius * scale * (0.88 + intro * 0.12);
        const turbulence = Math.sin(angle * 7 + particle.phase + time * 0.00013) * particle.spread * scale;
        const x =
          cx +
          Math.cos(angle) * radius +
          Math.cos(angle + Math.PI / 2) * turbulence +
          state.pointerX * 8 * particle.depth;
        const y =
          cy +
          Math.sin(angle) * radius * 0.62 +
          Math.sin(angle + Math.PI / 2) * turbulence * 0.44 +
          state.pointerY * 6 * particle.depth;

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fillStyle = rgba(particle.colour, particle.alpha * pulse * intro);
        context.fill();
      }
    };

    const drawVeilRibbons = (cx, cy, scale, time, intro) => {
      const ribbons = [
        { colour: palette.cyan, y: -0.04, phase: 0.2, alpha: 0.14, width: 1.05 },
        { colour: palette.rose, y: 0.035, phase: 2.1, alpha: 0.11, width: 1.38 },
        { colour: palette.ice, y: 0.005, phase: 3.8, alpha: 0.06, width: 0.62 },
      ];

      for (const ribbon of ribbons) {
        context.beginPath();
        const segments = 72;
        const visibleSegments = Math.max(6, Math.floor(segments * intro));

        for (let i = 0; i <= visibleSegments; i += 1) {
          const progress = i / segments;
          const xNorm = -0.98 + progress * 1.96;
          const envelope = Math.sin(progress * Math.PI);
          const wave =
            Math.sin(progress * Math.PI * 2.4 + ribbon.phase + time * 0.00012) * 0.09 +
            Math.sin(progress * Math.PI * 6.2 - ribbon.phase + time * 0.00007) * 0.025;

          const x = cx + xNorm * scale * 1.06;
          const y =
            cy +
            (ribbon.y + wave * envelope) * scale +
            Math.sin(progress * Math.PI) * scale * 0.025;

          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 9 * ribbon.width;
        context.strokeStyle = rgba(ribbon.colour, ribbon.alpha * 0.12 * intro);
        context.stroke();

        context.lineWidth = 2.2 * ribbon.width;
        context.strokeStyle = rgba(ribbon.colour, ribbon.alpha * intro);
        context.stroke();

        context.lineWidth = 0.55;
        context.strokeStyle = rgba(palette.ice, ribbon.alpha * 0.4 * intro);
        context.stroke();
      }
    };

    const drawCore = (cx, cy, scale, time, intro) => {
      const pulse = 0.98 + Math.sin(time * 0.00115) * 0.035;
      const radius = scale * 0.19 * pulse;

      const aura = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.48);
      aura.addColorStop(0, `rgba(234, 252, 255, ${0.62 * intro})`);
      aura.addColorStop(0.055, `rgba(105, 221, 244, ${0.36 * intro})`);
      aura.addColorStop(0.16, `rgba(28, 177, 211, ${0.19 * intro})`);
      aura.addColorStop(0.31, `rgba(69, 111, 204, ${0.09 * intro})`);
      aura.addColorStop(0.48, `rgba(185, 35, 92, ${0.04 * intro})`);
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = aura;
      context.fillRect(0, 0, state.width, state.height);

      const core = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
      core.addColorStop(0, `rgba(255, 255, 255, ${0.98 * intro})`);
      core.addColorStop(0.08, `rgba(222, 253, 255, ${0.95 * intro})`);
      core.addColorStop(0.26, `rgba(83, 220, 240, ${0.7 * intro})`);
      core.addColorStop(0.58, `rgba(17, 152, 184, ${0.23 * intro})`);
      core.addColorStop(1, 'rgba(16, 140, 178, 0)');
      context.fillStyle = core;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const spikes = [
        { angle: 0, length: scale * 0.52, alpha: 0.14 },
        { angle: Math.PI / 2, length: scale * 0.42, alpha: 0.1 },
      ];

      for (const spike of spikes) {
        context.save();
        context.translate(cx, cy);
        context.rotate(spike.angle);
        const gradient = context.createLinearGradient(-spike.length, 0, spike.length, 0);
        gradient.addColorStop(0, 'rgba(215, 246, 255, 0)');
        gradient.addColorStop(0.46, `rgba(228, 250, 255, ${spike.alpha * 0.2 * intro})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${spike.alpha * intro})`);
        gradient.addColorStop(0.54, `rgba(228, 250, 255, ${spike.alpha * 0.2 * intro})`);
        gradient.addColorStop(1, 'rgba(215, 246, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(-spike.length, -0.4, spike.length * 2, 0.8);
        context.restore();
      }
    };

    const drawVignette = (cx, cy, scale) => {
      const gradient = context.createRadialGradient(
        cx,
        cy,
        scale * 0.14,
        state.width * 0.5,
        state.height * 0.5,
        Math.max(state.width, state.height) * 0.78,
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.52, 'rgba(0, 0, 0, 0.015)');
      gradient.addColorStop(0.78, 'rgba(0, 0, 0, 0.22)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.72)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, state.width, state.height);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, state.width, state.height);

      state.pointerX += (state.pointerTargetX - state.pointerX) * 0.034;
      state.pointerY += (state.pointerTargetY - state.pointerY) * 0.034;
      state.scroll += (state.scrollTarget - state.scroll) * 0.05;

      const { cx, cy, scale, intro } = geometry(time);

      drawStars(time);

      context.save();
      context.globalCompositeOperation = 'screen';
      drawWisps(cx, cy, scale, time);

      for (const filament of state.filaments) {
        drawFilament(filament, cx, cy, scale, time, intro);
      }

      drawVeilRibbons(cx, cy, scale, time, intro);
      drawEjecta(cx, cy, scale, time, intro);
      drawTracers(cx, cy, scale, time, intro);
      drawCore(cx, cy, scale, time, intro);
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

    const hero = canvas.closest('.hero-cosmic');

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      state.pointerTargetX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      state.pointerTargetY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    };

    const resetPointer = () => {
      state.pointerTargetX = 0;
      state.pointerTargetY = 0;
    };

    const onScroll = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height), 0, 1);
      state.scrollTarget = progress;
    };

    hero?.addEventListener('pointermove', onPointerMove, { passive: true });
    hero?.addEventListener('pointerleave', resetPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', syncMotion);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    onScroll();
    syncMotion();
  }
}
