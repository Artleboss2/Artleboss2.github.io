/**
 * AXIOM — script.js
 * Computational Intelligence Systems
 * 8 Algorithms · Custom Cursor · Scroll Reveal · Session Tracker
 */

'use strict';

/* ════════════════════════════════════════════════════════
   MODULE: Core Utilities
════════════════════════════════════════════════════════ */
const Utils = {
  lerp:   (a, b, t) => a + (b - a) * t,
  clamp:  (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
  rand:   (lo, hi) => Math.random() * (hi - lo) + lo,
  randInt:(lo, hi) => Math.floor(Utils.rand(lo, hi)),
  dist:   (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay),
  /** Debounce */
  debounce(fn, ms) {
    let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); };
  }
};

/* ════════════════════════════════════════════════════════
   MODULE: Custom Cursor
════════════════════════════════════════════════════════ */
const Cursor = (() => {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (t.matches('button,a,input,textarea,[data-cursor],.ctrl-btn,.service-card'))
      document.body.classList.add('cursor-hover');
    else document.body.classList.remove('cursor-hover');
  });

  function animate() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx = Utils.lerp(rx, mx, 0.14);
    ry = Utils.lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ════════════════════════════════════════════════════════
   MODULE: Session Tracker
════════════════════════════════════════════════════════ */
const Session = (() => {
  const start      = Date.now();
  let mouseDistance = 0, prevMx = 0, prevMy = 0, interactions = 0;

  document.addEventListener('mousemove', e => {
    mouseDistance += Utils.dist(prevMx, prevMy, e.clientX, e.clientY);
    prevMx = e.clientX; prevMy = e.clientY;
  });
  document.addEventListener('click', () => interactions++);

  function fmt(ms) {
    const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
    return `${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }

  function update() {
    const elapsed = Date.now() - start;
    const depth   = Math.round((window.scrollY / (document.body.scrollHeight - innerHeight || 1)) * 100);
    document.getElementById('session-duration').textContent  = fmt(elapsed);
    document.getElementById('mouse-distance').textContent    = Math.round(mouseDistance).toLocaleString() + ' px';
    document.getElementById('scroll-depth').textContent      = depth + '%';
    document.getElementById('interaction-count').textContent = interactions;
  }
  setInterval(update, 1000);
})();

/* ════════════════════════════════════════════════════════
   MODULE: Navigation + Scroll Reveal + Active Section
════════════════════════════════════════════════════════ */
const Nav = (() => {
  const nav    = document.getElementById('nav');
  const links  = document.querySelectorAll('.nav-link');
  const items  = document.querySelectorAll('.reveal-item');
  const clock  = document.getElementById('nav-clock');

  // Scroll nav style
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Reveal observer
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.12 });
  items.forEach(el => revealObs.observe(el));

  // Active link observer
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

  // Clock
  function updateClock() {
    const now  = new Date();
    const h    = String(now.getHours()).padStart(2,'0');
    const m    = String(now.getMinutes()).padStart(2,'0');
    const s    = String(now.getSeconds()).padStart(2,'0');
    const t    = `${h}:${m}:${s}`;
    clock.textContent = t;
    document.getElementById('footer-time').textContent = t;
  }
  updateClock();
  setInterval(updateClock, 1000);
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 1: Visual QuickSort (Hero Background)
════════════════════════════════════════════════════════ */
const SortViz = (() => {
  const canvas  = document.getElementById('sort-canvas');
  const ctx     = canvas.getContext('2d');
  const BAR_COUNT = 80;
  let bars = [], comparisons = 0, sorting = false, animQueue = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', Utils.debounce(resize, 200));
  resize();

  function init() {
    bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
      val:   Utils.rand(0.08, 1),
      color: 0,    // 0=default, 1=comparing, 2=sorted
    }));
    comparisons = 0; animQueue = [];
    document.getElementById('stat-sort').textContent = '0';
  }

  // QuickSort capturing swap/compare frames
  function quickSort(arr, lo, hi) {
    if (lo >= hi) return;
    // Partition
    const pivot = arr[hi].val;
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      animQueue.push({ type: 'compare', a: j, b: hi });
      if (arr[j].val < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        animQueue.push({ type: 'swap', a: i, b: j });
      }
    }
    [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
    animQueue.push({ type: 'swap', a: i+1, b: hi });
    animQueue.push({ type: 'sorted', idx: i+1 });
    quickSort(arr, lo, i);
    quickSort(arr, i + 2, hi);
  }

  let frameIdx = 0, lastSort = 0;
  function draw(ts) {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dispatch animation events at 60fps pacing
    if (sorting && ts - lastSort > 8 && frameIdx < animQueue.length) {
      const ev = animQueue[frameIdx++];
      if (ev.type === 'compare') {
        bars[ev.a].color = 1; bars[ev.b].color = 1;
        setTimeout(() => { if (bars[ev.a]) bars[ev.a].color = 0; if (bars[ev.b]) bars[ev.b].color = 0; }, 60);
      } else if (ev.type === 'swap') {
        [bars[ev.a], bars[ev.b]] = [bars[ev.b], bars[ev.a]];
      } else if (ev.type === 'sorted') {
        bars[ev.idx].color = 2;
      }
      document.getElementById('stat-sort').textContent = comparisons;
      lastSort = ts;
      if (frameIdx >= animQueue.length) sorting = false;
    }

    // Draw bars
    const bw = w / BAR_COUNT;
    bars.forEach((bar, i) => {
      const bh = bar.val * h * 0.7;
      const x  = i * bw;
      const y  = h - bh;
      const alpha = 0.15 + bar.val * 0.45;
      if      (bar.color === 1) ctx.fillStyle = `rgba(0,229,204,${alpha + 0.3})`;
      else if (bar.color === 2) ctx.fillStyle = `rgba(124,92,252,${alpha})`;
      else                      ctx.fillStyle = `rgba(70,71,89,${alpha})`;
      ctx.fillRect(x + 1, y, bw - 2, bh);
    });

    requestAnimationFrame(draw);
  }

  function startSort() {
    init();
    const copy = bars.map(b => ({ ...b }));
    quickSort(copy, 0, copy.length - 1);
    bars = copy; // re-assign after capture
    // Re-init bars to unsorted for visual animation
    bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
      val: copy[i].val, color: 0
    }));
    const sorted = [...bars].sort((a,b) => a.val - b.val);
    // Rebuild from scratch so animation replays on sorted array
    bars = sorted.map(b => ({ ...b, color: 0 }));
    // Shuffle for visual effect
    for (let k = bars.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k+1));
      [bars[k], bars[j]] = [bars[j], bars[k]];
    }
    comparisons = 0; animQueue = [];
    quickSort(bars.map(b=>({...b})), 0, bars.length - 1);
    frameIdx = 0; sorting = true;
  }

  init();
  document.getElementById('init-btn').addEventListener('click', startSort);
  setTimeout(startSort, 1200);
  requestAnimationFrame(draw);
  document.getElementById('stat-nodes').textContent = BAR_COUNT;
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 7: Delaunay Triangulation (Hero Overlay)
════════════════════════════════════════════════════════ */
const DelaunayViz = (() => {
  const canvas = document.getElementById('delaunay-canvas');
  const ctx    = canvas.getContext('2d');
  let pts = [], vels = [], mouse = { x: 0.5, y: 0.5 };
  const N = 28;

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; init(); }
  window.addEventListener('resize', Utils.debounce(resize, 200));

  function init() {
    pts  = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random() }));
    vels = Array.from({ length: N }, () => ({
      vx: Utils.rand(-0.0002, 0.0002),
      vy: Utils.rand(-0.0002, 0.0002)
    }));
  }

  document.getElementById('hero').addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / canvas.width;
    mouse.y = (e.clientY - r.top)  / canvas.height;
  });

  // Bowyer-Watson-lite: circumcircle test
  function circumcircle(ax, ay, bx, by, cx, cy) {
    const D  = 2 * (ax*(by-cy) + bx*(cy-ay) + cx*(ay-by));
    if (Math.abs(D) < 1e-10) return null;
    const ux = ((ax*ax + ay*ay)*(by-cy) + (bx*bx + by*by)*(cy-ay) + (cx*cx + cy*cy)*(ay-by)) / D;
    const uy = ((ax*ax + ay*ay)*(cx-bx) + (bx*bx + by*by)*(ax-cx) + (cx*cx + cy*cy)*(bx-ax)) / D;
    const r  = Utils.dist(ax, ay, ux, uy);
    return { x: ux, y: uy, r };
  }

  function triangulate(pts) {
    const n  = pts.length;
    // Super triangle
    const M  = 10;
    const ST = [{ x: -M, y: -M }, { x: M*2, y: -M }, { x: -M, y: M*2 }];
    let tris = [[n, n+1, n+2]];
    const all = [...pts, ...ST];

    for (let i = 0; i < n; i++) {
      const { x, y } = all[i];
      const edges = [];
      tris = tris.filter(tri => {
        const [a, b, c] = tri;
        const cc = circumcircle(all[a].x, all[a].y, all[b].x, all[b].y, all[c].x, all[c].y);
        if (cc && Utils.dist(x, y, cc.x, cc.y) < cc.r) {
          edges.push([a,b],[b,c],[c,a]);
          return false;
        }
        return true;
      });
      // Unique edges
      const unique = edges.filter((e, ei) =>
        !edges.some((f, fi) => fi !== ei && ((e[0]===f[0]&&e[1]===f[1])||(e[0]===f[1]&&e[1]===f[0])))
      );
      unique.forEach(e => tris.push([e[0], e[1], i]));
    }
    return tris.filter(tri => !tri.some(idx => idx >= n));
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Move pts
    pts.forEach((p, i) => {
      p.x += vels[i].vx; p.y += vels[i].vy;
      if (p.x < 0||p.x > 1) vels[i].vx *= -1;
      if (p.y < 0||p.y > 1) vels[i].vy *= -1;
    });

    // Mouse attraction
    pts.forEach((p, i) => {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d  = Math.hypot(dx, dy);
      if (d < 0.15) { vels[i].vx += dx * 0.00004; vels[i].vy += dy * 0.00004; }
    });

    const tris = triangulate(pts);
    tris.forEach(([a, b, c]) => {
      const ax = pts[a].x*w, ay = pts[a].y*h;
      const bx = pts[b].x*w, by = pts[b].y*h;
      const cx = pts[c].x*w, cy = pts[c].y*h;
      ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.closePath();
      ctx.strokeStyle = 'rgba(0,229,204,0.12)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    });

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x*w, p.y*h, 2.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,229,204,0.55)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 2: A* Pathfinding (Interactive Grid)
════════════════════════════════════════════════════════ */
const PathfindingViz = (() => {
  const canvas = document.getElementById('pathfinding-canvas');
  const ctx    = canvas.getContext('2d');
  const COLS   = 48, ROWS = 27;
  let CELL_W, CELL_H;
  let grid = [], start = { r:13, c:3 }, end = { r:13, c:44 };
  let mode = 'wall', isDrawing = false;
  let pfExplored = 0, pfLength = 0;

  class GridNode {
    constructor(r, c) {
      this.r = r; this.c = c;
      this.wall = false; this.g = 0; this.h = 0; this.f = 0;
      this.parent = null; this.visited = false; this.inPath = false; this.inOpen = false;
    }
    reset() { this.g=0; this.h=0; this.f=0; this.parent=null; this.visited=false; this.inPath=false; this.inOpen=false; }
  }

  function buildGrid() {
    grid = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => new GridNode(r, c))
    );
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    CELL_W = canvas.width  / COLS;
    CELL_H = canvas.height / ROWS;
    buildGrid();
    solve();
  }

  function heuristic(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); // Manhattan
  }

  function neighbours(node) {
    const { r, c } = node;
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    return dirs.map(([dr,dc]) => grid[r+dr]?.[c+dc]).filter(n => n && !n.wall);
  }

  function solve() {
    // Reset
    grid.forEach(row => row.forEach(n => n.reset()));
    pfExplored = 0;

    const startNode = grid[start.r][start.c];
    const endNode   = grid[end.r][end.c];
    if (startNode.wall || endNode.wall) return;

    const open   = [startNode];
    startNode.inOpen = true;
    const closed = new Set();
    const t0     = performance.now();

    while (open.length) {
      // Get lowest f
      let qi = 0;
      for (let i = 1; i < open.length; i++) { if (open[i].f < open[qi].f) qi = i; }
      const cur = open.splice(qi, 1)[0];
      closed.add(cur);
      cur.visited = true; pfExplored++;

      if (cur === endNode) {
        // Trace path
        let node = endNode, len = 0;
        while (node) { node.inPath = true; node = node.parent; len++; }
        pfLength = len;
        document.getElementById('pf-explored').textContent = pfExplored;
        document.getElementById('pf-length').textContent   = len;
        document.getElementById('pf-time').textContent     = (performance.now()-t0).toFixed(1) + 'ms';
        return;
      }

      neighbours(cur).forEach(nb => {
        if (closed.has(nb)) return;
        const g = cur.g + 1;
        const inOpen = open.includes(nb);
        if (!inOpen || g < nb.g) {
          nb.g = g; nb.h = heuristic(nb, endNode); nb.f = nb.g + nb.h;
          nb.parent = cur;
          if (!inOpen) { open.push(nb); nb.inOpen = true; }
        }
      });
    }
    document.getElementById('pf-length').textContent = '—';
    document.getElementById('pf-explored').textContent = pfExplored;
    document.getElementById('pf-time').textContent = (performance.now()-t0).toFixed(1) + 'ms';
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0b0f';
    ctx.fillRect(0, 0, w, h);

    grid.forEach(row => row.forEach(node => {
      const x = node.c * CELL_W, y = node.r * CELL_H;
      if (node.wall)        ctx.fillStyle = '#1e1f2d';
      else if (node.inPath) ctx.fillStyle = 'rgba(0,229,204,0.7)';
      else if (node.visited)ctx.fillStyle = 'rgba(124,92,252,0.25)';
      else if (node.inOpen) ctx.fillStyle = 'rgba(0,229,204,0.08)';
      else                  ctx.fillStyle = 'transparent';

      ctx.fillRect(x+0.5, y+0.5, CELL_W-1, CELL_H-1);
    }));

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth   = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c*CELL_W,0); ctx.lineTo(c*CELL_W,h); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0,r*CELL_H); ctx.lineTo(w,r*CELL_H); ctx.stroke();
    }

    // Start / End markers
    const drawMarker = (r, c, color, label) => {
      const cx = (c + 0.5) * CELL_W, cy = (r + 0.5) * CELL_H;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(CELL_W,CELL_H)*0.4, 0, Math.PI*2);
      ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = '#000'; ctx.font = `bold ${Math.min(CELL_W,CELL_H)*0.5}px Syne`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, cy);
    };
    drawMarker(start.r, start.c, '#00e5cc', 'S');
    drawMarker(end.r,   end.c,   '#7c5cfc', 'E');

    requestAnimationFrame(draw);
  }

  function cellAt(e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return { r: Math.floor(y / CELL_H), c: Math.floor(x / CELL_W) };
  }

  function handleCell(pos) {
    const n = grid[pos.r]?.[pos.c];
    if (!n) return;
    if (mode === 'wall') {
      if ((pos.r===start.r&&pos.c===start.c)||(pos.r===end.r&&pos.c===end.c)) return;
      n.wall = !n.wall;
    } else if (mode === 'start') {
      start = pos;
    } else if (mode === 'end') {
      end = pos;
    }
    solve();
  }

  canvas.addEventListener('mousedown', e => { isDrawing = true; handleCell(cellAt(e)); });
  canvas.addEventListener('mousemove', e => { if (isDrawing && mode==='wall') handleCell(cellAt(e)); });
  canvas.addEventListener('mouseup',   () => isDrawing = false);

  // Mode buttons
  document.getElementById('mode-wall').addEventListener('click', () => {
    mode = 'wall';
    document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-wall').classList.add('active');
  });
  document.getElementById('mode-start').addEventListener('click', () => {
    mode = 'start';
    document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-start').classList.add('active');
  });
  document.getElementById('mode-end').addEventListener('click', () => {
    mode = 'end';
    document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-end').classList.add('active');
  });
  document.getElementById('clear-grid').addEventListener('click', () => {
    buildGrid(); solve();
  });

  window.addEventListener('resize', Utils.debounce(resize, 200));
  resize();
  draw();
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 3: Newtonian Particle Engine
════════════════════════════════════════════════════════ */
const ParticleEngine = (() => {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  const COUNT  = 500;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let gravity = 0.2, repulsion = 50, friction = 0.95;

  class Particle {
    constructor(w, h) {
      this.x  = Utils.rand(0, w);
      this.y  = Utils.rand(0, h);
      this.vx = Utils.rand(-0.8, 0.8);
      this.vy = Utils.rand(-0.8, 0.8);
      this.ax = 0; this.ay = 0;
      this.mass   = Utils.rand(0.4, 1.5);
      this.radius = this.mass * 2;
      this.hue    = Utils.rand(160, 220);
    }
    update(w, h) {
      this.vx = (this.vx + this.ax) * friction;
      this.vy = (this.vy + this.ay) * friction;
      this.vy += gravity * 0.001;
      this.x += this.vx; this.y += this.vy;
      // Bounce
      if (this.x < this.radius)    { this.x = this.radius;    this.vx *= -0.7; }
      if (this.x > w - this.radius){ this.x = w - this.radius; this.vx *= -0.7; }
      if (this.y < this.radius)    { this.y = this.radius;    this.vy *= -0.7; }
      if (this.y > h - this.radius){ this.y = h - this.radius; this.vy *= -0.7; }
      this.ax = 0; this.ay = 0;
    }
    applyForce(fx, fy) { this.ax += fx / this.mass; this.ay += fy / this.mass; }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${this.hue},80%,65%,0.65)`;
      ctx.fill();
    }
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: COUNT }, () => new Particle(canvas.width, canvas.height));
  }

  document.getElementById('particles').addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  document.getElementById('particles').addEventListener('mouseleave', () => mouse.active = false);

  document.getElementById('gravity-slider').addEventListener('input', e => gravity = +e.target.value / 10);
  document.getElementById('repulsion-slider').addEventListener('input', e => repulsion = +e.target.value);
  document.getElementById('friction-slider').addEventListener('input', e => friction = +e.target.value / 100);

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = 'rgba(6,6,8,0.18)';
    ctx.fillRect(0, 0, w, h);

    if (mouse.active) {
      particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 160 && d > 0.1) {
          const force = repulsion / (d * d + 1);
          p.applyForce((dx/d)*force, (dy/d)*force);
        }
        // Attraction to center
        const cdx = w/2 - p.x, cdy = h/2 - p.y;
        p.applyForce(cdx * 0.00005, cdy * 0.00005);
      });
    }

    // Pair interactions (limited for perf)
    for (let i = 0; i < COUNT; i += 3) {
      for (let j = i+1; j < Math.min(i+20, COUNT); j++) {
        const dx = particles[j].x - particles[i].x;
        const dy = particles[j].y - particles[i].y;
        const d  = Math.hypot(dx, dy);
        if (d < 80 && d > 0.1) {
          // Draw connection
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,204,${0.12 * (1 - d/80)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(w, h); p.draw(ctx); });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', Utils.debounce(resize, 200));
  resize();
  draw();
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 4a: Mandelbrot Fractal
════════════════════════════════════════════════════════ */
const FractalViz = (() => {
  const canvas = document.getElementById('fractal-canvas');
  const ctx    = canvas.getContext('2d');
  let view  = { x: -2.5, y: -1.5, w: 3.5, h: 3.5 };
  let maxIter = 100;
  let rendering = false;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    view.h = view.w * (canvas.height / canvas.width);
    render();
  }

  function render() {
    if (rendering) return;
    rendering = true;
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const cx = view.x + (px / w) * view.w;
        const cy = view.y + (py / h) * view.h;
        let zx = 0, zy = 0, iter = 0;
        while (zx*zx + zy*zy < 4 && iter < maxIter) {
          const tmp = zx*zx - zy*zy + cx;
          zy = 2*zx*zy + cy;
          zx = tmp; iter++;
        }
        const idx = (py * w + px) * 4;
        if (iter === maxIter) {
          data[idx]=6; data[idx+1]=6; data[idx+2]=8; data[idx+3]=255;
        } else {
          const t = iter / maxIter;
          // Neon palette
          const r = Math.round(Utils.lerp(0,  0, t)*255);
          const g = Math.round(Utils.lerp(229,0, Math.pow(t,0.5)));
          const b = Math.round(Utils.lerp(204,92,Math.pow(t,0.3)));
          data[idx]   = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    rendering = false;
  }

  canvas.addEventListener('click', e => {
    const r    = canvas.getBoundingClientRect();
    const px   = e.clientX - r.left, py = e.clientY - r.top;
    const cx   = view.x + (px / canvas.width)  * view.w;
    const cy   = view.y + (py / canvas.height) * view.h;
    view.w  *= 0.45; view.h = view.w * (canvas.height / canvas.width);
    view.x   = cx - view.w / 2; view.y = cy - view.h / 2;
    render();
  });

  document.getElementById('fractal-zoom-in').addEventListener('click', () => {
    view.x += view.w*0.25; view.y += view.h*0.25; view.w *= 0.5; view.h *= 0.5; render();
  });
  document.getElementById('fractal-zoom-out').addEventListener('click', () => {
    view.x -= view.w*0.5; view.y -= view.h*0.5; view.w *= 2; view.h = view.w * (canvas.height/canvas.width); render();
  });
  document.getElementById('fractal-reset').addEventListener('click', () => {
    view = { x:-2.5, y:-1.5, w:3.5, h:3.5 }; maxIter=100; render();
    document.getElementById('fractal-iter').value = 100;
    document.getElementById('fractal-iter-val').textContent = 100;
  });
  document.getElementById('fractal-iter').addEventListener('input', e => {
    maxIter = +e.target.value;
    document.getElementById('fractal-iter-val').textContent = maxIter;
    render();
  });

  const labObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { labObs.disconnect(); resize(); }
  }, { threshold: 0.1 });
  labObs.observe(canvas);
  window.addEventListener('resize', Utils.debounce(resize, 300));
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 8: FFT Scroll Visualizer
════════════════════════════════════════════════════════ */
const FFTViz = (() => {
  const canvas  = document.getElementById('fft-canvas');
  const ctx     = canvas.getContext('2d');
  let scrollVel = 0, scrollAcc = 0;
  let prevScroll = window.scrollY;
  const BANDS = 64;
  let freqs = new Float32Array(BANDS).fill(0);
  let t = 0;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    scrollAcc = (cur - prevScroll) * 0.8;
    scrollVel += scrollAcc;
    prevScroll = cur;
  }, { passive: true });

  function draw() {
    scrollVel *= 0.92;
    t += 0.04;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Simulate FFT from scroll velocity
    for (let i = 0; i < BANDS; i++) {
      const baseFreq = Math.sin(t * (0.8 + i*0.05) + i*0.3) * 0.5 + 0.5;
      const scrollDrive = Math.abs(scrollVel) * 0.12 * Math.exp(-i * 0.03);
      freqs[i] = Utils.lerp(freqs[i], baseFreq * 0.15 + scrollDrive, 0.25);
    }

    const bw = w / BANDS;
    for (let i = 0; i < BANDS; i++) {
      const amp = freqs[i];
      const bh  = amp * h * 0.9;
      const x   = i * bw;
      const hue = 160 + i * 1.4 + Math.abs(scrollVel) * 2;
      // Bar
      const grad = ctx.createLinearGradient(x, h, x, h - bh);
      grad.addColorStop(0, `hsla(${hue},90%,55%,0.0)`);
      grad.addColorStop(1, `hsla(${hue},90%,70%,0.9)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, h - bh, bw - 2, bh);
      // Reflection
      ctx.fillStyle = `hsla(${hue},90%,70%,0.12)`;
      ctx.fillRect(x + 1, h, bw - 2, bh * 0.4);
    }

    // Wave overlay
    ctx.beginPath();
    for (let i = 0; i <= BANDS; i++) {
      const amp = freqs[i] || 0;
      const x   = (i / BANDS) * w;
      const y   = h/2 - amp * h * 0.35;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(0,229,204,${0.3 + Math.min(Math.abs(scrollVel)*0.06, 0.5)})`;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', Utils.debounce(resize, 200));
  resize();
  draw();
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 5: Huffman Compression Tree
════════════════════════════════════════════════════════ */
const HuffmanViz = (() => {
  const canvas = document.getElementById('huffman-canvas');
  const ctx    = canvas.getContext('2d');
  const input  = document.getElementById('huffman-input');

  class HNode {
    constructor(char, freq, left=null, right=null) {
      this.char=char; this.freq=freq; this.left=left; this.right=right;
    }
  }

  function buildTree(text) {
    if (!text) return null;
    const freq = {};
    [...text].forEach(c => freq[c] = (freq[c]||0) + 1);
    let nodes = Object.entries(freq).map(([c,f]) => new HNode(c, f));
    while (nodes.length > 1) {
      nodes.sort((a,b) => a.freq - b.freq);
      const a = nodes.shift(), b = nodes.shift();
      nodes.push(new HNode(null, a.freq+b.freq, a, b));
    }
    return nodes[0] || null;
  }

  function getCodes(node, prefix='', codes={}) {
    if (!node) return codes;
    if (node.char !== null) codes[node.char] = prefix || '0';
    else { getCodes(node.left, prefix+'0', codes); getCodes(node.right, prefix+'1', codes); }
    return codes;
  }

  function treeDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
  }

  function drawTree(node, x, y, xOff, depth, maxDepth) {
    if (!node) return;
    const isLeaf = !node.left && !node.right;
    const r = isLeaf ? 18 : 13;
    // Lines to children
    if (node.left) {
      const lx = x - xOff, ly = y + 60;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(lx,ly);
      ctx.strokeStyle = 'rgba(0,229,204,0.3)'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = 'rgba(124,92,252,0.5)'; ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('0', x - xOff*0.5 - 6, y + 30);
      drawTree(node.left,  lx, ly, xOff*0.5, depth+1, maxDepth);
    }
    if (node.right) {
      const rx = x + xOff, ry = y + 60;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(rx,ry);
      ctx.strokeStyle = 'rgba(0,229,204,0.3)'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = 'rgba(124,92,252,0.5)'; ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('1', x + xOff*0.5 + 6, y + 30);
      drawTree(node.right, rx, ry, xOff*0.5, depth+1, maxDepth);
    }
    // Node circle
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
    if (isLeaf) {
      ctx.fillStyle   = 'rgba(0,229,204,0.18)';
      ctx.strokeStyle = 'rgba(0,229,204,0.7)';
    } else {
      ctx.fillStyle   = 'rgba(22,24,32,0.9)';
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    }
    ctx.lineWidth = 1; ctx.fill(); ctx.stroke();
    // Label
    ctx.fillStyle  = isLeaf ? '#00e5cc' : '#8b8c9e';
    ctx.font       = `${isLeaf ? 11 : 9}px JetBrains Mono`;
    ctx.textAlign  = 'center'; ctx.textBaseline = 'middle';
    const lbl = node.char !== null
      ? (node.char === ' ' ? '␣' : node.char) + `\n${node.freq}`
      : node.freq;
    ctx.fillText(isLeaf ? (node.char==='\n'?'↵':node.char) : node.freq, x, y);
  }

  function update() {
    const text = input.value;
    const tree = buildTree(text);
    const codes = getCodes(tree);

    // Stats
    const origBits = text.length * 8;
    const compBits = [...text].reduce((s,c) => s + (codes[c]?.length||0), 0);
    document.getElementById('huff-original').textContent   = origBits;
    document.getElementById('huff-compressed').textContent = compBits;
    document.getElementById('huff-ratio').textContent      = origBits ? ((1 - compBits/origBits)*100).toFixed(1)+'%' : '—';

    // Code table
    const codesEl = document.getElementById('huffman-codes');
    codesEl.innerHTML = Object.entries(codes)
      .sort((a,b) => a[1].length - b[1].length)
      .map(([c,code]) => `<div class="huff-code-item">${c==' '?'␣':c} <span>${code}</span></div>`)
      .join('');

    // Draw tree
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (tree) {
      const depth = treeDepth(tree);
      drawTree(tree, w/2, 36, w / Math.pow(2, 2), 0, depth);
    }
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    update();
  }

  input.addEventListener('input', Utils.debounce(update, 200));
  window.addEventListener('resize', Utils.debounce(resize, 200));
  const hObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { hObs.disconnect(); resize(); }
  }, { threshold: 0.1 });
  hObs.observe(canvas);
  setTimeout(update, 500);
})();

/* ════════════════════════════════════════════════════════
   ALGORITHM 6: Collaborative Filtering Recommendation
════════════════════════════════════════════════════════ */
const RecommendationEngine = (() => {
  const SERVICES = [
    { id: 'sort',   icon: '⚡', title: 'Algorithmic Sorting',   desc: 'Real-time data ordering with QuickSort & MergeSort visualization.',    tags: ['performance','data','visual']  },
    { id: 'path',   icon: '🗺', title: 'Pathfinding Systems',   desc: 'A* and Dijkstra solutions for navigation and route optimization.',      tags: ['navigation','graph','optimize'] },
    { id: 'phys',   icon: '⚛', title: 'Physics Simulation',    desc: 'N-body particle systems with Newtonian force modeling.',                tags: ['simulation','physics','visual'] },
    { id: 'fract',  icon: '🌀', title: 'Fractal Generation',    desc: 'Mandelbrot & Julia set renderers for generative visual design.',        tags: ['generative','math','visual']   },
    { id: 'huff',   icon: '📦', title: 'Data Compression',      desc: 'Huffman coding and entropy-based lossless compression pipelines.',      tags: ['data','compress','encode']     },
    { id: 'rec',    icon: '🧠', title: 'Recommendation AI',     desc: 'Collaborative filtering engine for personalized content delivery.',     tags: ['ai','data','personalize']      },
    { id: 'tri',    icon: '📐', title: 'Mesh Triangulation',    desc: 'Delaunay triangulation for computational geometry & 3D meshing.',       tags: ['geometry','3D','mesh']         },
    { id: 'fft',    icon: '〰', title: 'Frequency Analysis',    desc: 'FFT-based signal decomposition and waveform visualization systems.',    tags: ['signal','audio','visual']      },
  ];

  const dwell = {}; // time spent near each card
  SERVICES.forEach(s => dwell[s.id] = 0);

  const grid = document.getElementById('services-grid');

  SERVICES.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-card reveal-item';
    card.dataset.id = s.id;
    card.innerHTML = `
      <div class="service-icon">${s.icon}</div>
      <h4>${s.title}</h4>
      <p>${s.desc}</p>
      <span class="service-score mono">interest: <span class="interest-val">0%</span></span>
    `;
    card.addEventListener('mouseenter', () => {
      applyTilt(card);
      dwell[s.id] += 5; // fast increment on hover
    });
    card.addEventListener('mousemove', e => tiltCard(card, e));
    card.addEventListener('mouseleave', () => resetTilt(card));
    grid.appendChild(card);
  });

  // 3D Tilt
  function tiltCard(card, e) {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x*14}deg) rotateX(${-y*10}deg) scale(1.02)`;
  }
  function applyTilt(card) { card.style.transition = 'transform 0.1s'; }
  function resetTilt(card) {
    card.style.transition = 'transform 0.5s var(--ease-out-expo)';
    card.style.transform  = '';
  }

  // Dwell time accumulation via IntersectionObserver
  const ioObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const id = e.target.dataset.id;
      if (e.isIntersecting && id) dwell[id] += 1;
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.service-card').forEach(c => ioObs.observe(c));

  function updateRecommendations() {
    const total = Object.values(dwell).reduce((a,b)=>a+b, 0) || 1;
    const cards = document.querySelectorAll('.service-card');

    // Collaborative filtering: find related tags
    const topTag = (() => {
      const tagCount = {};
      SERVICES.forEach(s => {
        const weight = dwell[s.id] / total;
        s.tags.forEach(t => { tagCount[t] = (tagCount[t]||0) + weight; });
      });
      return Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>t);
    })();

    cards.forEach(card => {
      const id   = card.dataset.id;
      const svc  = SERVICES.find(s=>s.id===id);
      const pct  = Math.round((dwell[id]/total)*100);
      const iv   = card.querySelector('.interest-val');
      if (iv) iv.textContent = pct + '%';
      const match = svc.tags.filter(t=>topTag.includes(t)).length;
      card.classList.toggle('highlighted', match >= 2 && dwell[id] > 2);
    });

    // Recommendation tags
    const recEl = document.getElementById('recommendation-output');
    recEl.innerHTML = topTag.map(t => `<span class="rec-tag">${t}</span>`).join('');

    setTimeout(updateRecommendations, 1500);
  }
  setTimeout(updateRecommendations, 2000);
})();

/* ════════════════════════════════════════════════════════
   MODULE: Algorithmic Clock (Footer)
════════════════════════════════════════════════════════ */
const AlgoClock = (() => {
  const canvas = document.getElementById('clock-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width = 120; canvas.height = 120;

  function draw() {
    const now = new Date();
    const h   = now.getHours()   % 12, m = now.getMinutes(), s = now.getSeconds();
    const cx  = 60, cy = 60, R = 50;
    ctx.clearRect(0, 0, 120, 120);

    // Clock face
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth=1.5; ctx.stroke();

    // Tick marks
    for (let i=0; i<12; i++) {
      const a = (i/12)*Math.PI*2 - Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a)*(R-5), cy + Math.sin(a)*(R-5));
      ctx.lineTo(cx + Math.cos(a)*(R-2), cy + Math.sin(a)*(R-2));
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth=1; ctx.stroke();
    }

    // Hands
    const drawHand = (angle, len, color, width) => {
      const a = angle - Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a)*len, cy + Math.sin(a)*len);
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.lineCap = 'round'; ctx.stroke();
    };
    drawHand((h/12 + m/720)*Math.PI*2,    R*0.55, '#f0f0f4', 2.5);
    drawHand((m/60 + s/3600)*Math.PI*2,   R*0.75, '#8b8c9e', 1.5);
    drawHand((s/60)*Math.PI*2,            R*0.82, '#00e5cc', 1);

    // Center dot
    ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2);
    ctx.fillStyle='#00e5cc'; ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();

  // Entropy string
  function updateEntropy() {
    const chars = '0123456789abcdef';
    const e = Array.from({length:16},()=>chars[Math.floor(Math.random()*16)]).join('');
    document.getElementById('footer-entropy').textContent = `Entropy: 0x${e}`;
  }
  setInterval(updateEntropy, 1800);
})();

/* ════════════════════════════════════════════════════════
   MODULE: Init Button + Global FPS Counter
════════════════════════════════════════════════════════ */
(() => {
  let lastFrame = performance.now(), fpsVal = 60;
  function trackFPS(ts) {
    fpsVal = Utils.lerp(fpsVal, 1000 / (ts - lastFrame + 0.001), 0.05);
    lastFrame = ts;
    document.getElementById('stat-fps').textContent = Math.round(fpsVal);
    requestAnimationFrame(trackFPS);
  }
  requestAnimationFrame(trackFPS);
})();

/* ════════════════════════════════════════════════════════
   MODULE: Scroll depth indicator
════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const depth = Math.round((window.scrollY / (document.body.scrollHeight - innerHeight || 1)) * 100);
  document.getElementById('scroll-depth').textContent = depth + '%';
}, { passive: true });
