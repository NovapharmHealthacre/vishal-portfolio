const canvas = document.querySelector('#system-lattice');

const shouldEnhance =
  canvas instanceof HTMLCanvasElement &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.innerWidth >= 720 &&
  !navigator.connection?.saveData &&
  (navigator.deviceMemory ?? 8) >= 4 &&
  (navigator.hardwareConcurrency ?? 8) >= 4;

if (shouldEnhance) {
  try {
    const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!context) throw new Error('Canvas rendering unavailable');

    const points = [
      [-1.45, -.65, .2], [-.8, -.25, 1.1], [-.25, -.8, -.4], [.25, -.1, .7],
      [.8, -.62, -.25], [1.42, -.2, .45], [-1.2, .35, -.65], [-.58, .7, .45],
      [0, .28, 1.3], [.58, .72, -.2], [1.22, .35, .65], [-.75, 1.2, -.25],
      [.1, 1.05, .5], [.92, 1.22, -.55],
    ];
    const links = [
      [0, 1], [1, 2], [1, 3], [2, 6], [2, 7], [3, 4], [3, 8], [3, 9],
      [4, 5], [4, 9], [5, 10], [6, 7], [7, 8], [7, 11], [8, 9], [8, 12],
      [9, 10], [9, 12], [9, 13], [10, 13], [11, 12], [12, 13],
    ];
    const route = [0, 1, 3, 8, 12, 13];
    const pointer = { x: 0, y: 0 };
    let width = 1;
    let height = 1;
    let ratio = 1;
    let visible = false;
    let running = false;
    let frame = 0;
    let lastPaint = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const project = ([x, y, z], time) => {
      const angle = time * .00006 + pointer.x * .08;
      const tilt = -.16 + pointer.y * .05;
      const rx = x * Math.cos(angle) - z * Math.sin(angle);
      const rz = x * Math.sin(angle) + z * Math.cos(angle);
      const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
      const depth = rz * Math.cos(tilt) + y * Math.sin(tilt);
      const scale = 1 / (1.72 + depth * .13);
      return {
        x: width * .5 + rx * width * .29 * scale,
        y: height * .48 + ry * height * .42 * scale,
        depth,
        scale,
      };
    };

    const draw = (time) => {
      frame = 0;
      if (!running || !visible || document.hidden) return;
      frame = requestAnimationFrame(draw);
      if (time - lastPaint < 40) return;
      lastPaint = time;
      context.clearRect(0, 0, width, height);
      const projected = points.map((point) => project(point, time));

      for (const [a, b] of links) {
        const start = projected[a];
        const end = projected[b];
        const alpha = .12 + (start.scale + end.scale) * .12;
        const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, `rgba(242,239,232,${alpha})`);
        gradient.addColorStop(1, `rgba(143,31,45,${alpha * .9})`);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = gradient;
        context.lineWidth = .65;
        context.stroke();
      }

      const progress = ((time * .000035) % 1) * (route.length - 1);
      const segment = Math.min(route.length - 2, Math.floor(progress));
      const local = progress - segment;
      const a = projected[route[segment]];
      const b = projected[route[segment + 1]];
      const routeX = a.x + (b.x - a.x) * local;
      const routeY = a.y + (b.y - a.y) * local;
      context.beginPath();
      context.arc(routeX, routeY, 3.5, 0, Math.PI * 2);
      context.fillStyle = '#d74c5a';
      context.shadowColor = 'rgba(215,76,90,.75)';
      context.shadowBlur = 15;
      context.fill();
      context.shadowBlur = 0;

      projected
        .map((point, index) => ({ ...point, index }))
        .sort((a, b) => b.depth - a.depth)
        .forEach((point) => {
          const radius = 1.5 + point.scale * 2.2;
          context.beginPath();
          context.arc(point.x, point.y, radius, 0, Math.PI * 2);
          context.fillStyle = route.includes(point.index) ? 'rgba(215,76,90,.86)' : 'rgba(242,239,232,.7)';
          context.fill();
          context.beginPath();
          context.arc(point.x, point.y, radius + 5, 0, Math.PI * 2);
          context.strokeStyle = 'rgba(242,239,232,.09)';
          context.stroke();
        });
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    }, { rootMargin: '100px' });
    observer.observe(canvas);

    new ResizeObserver(resize).observe(canvas);
    resize();
    canvas.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - .5;
      pointer.y = (event.clientY - rect.top) / rect.height - .5;
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => {
      pointer.x = 0;
      pointer.y = 0;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (visible) start();
    });
  } catch {
    canvas.hidden = true;
  }
}
