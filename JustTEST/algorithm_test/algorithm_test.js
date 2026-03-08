/**
 * AXIOM — algorithms.js
 * 20 additional algorithms: Neural Net, Lorenz, Visual Hash, Force Graph,
 * Game of Life, Perlin Noise, Wave Interference, Bézier, Maze, Fourier Epicycles,
 * Genetic TSP, Navier-Stokes Fluid, Langton's Ant, Boids, Cloth Simulation,
 * Voronoi, Sorting Race, L-Systems, Marching Squares, RSA Visualizer
 */

'use strict';

/* ──────────────────────────────────────────────────────────────
   UTIL (re-export for standalone use)
────────────────────────────────────────────────────────────── */
const U = {
  lerp:  (a, b, t) => a + (b - a) * t,
  clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
  rand:  (lo, hi) => Math.random() * (hi - lo) + lo,
  dist:  (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay),
  debounce(fn, ms) { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; }
};

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 9 — Neural Network (Perceptron 2→4→4→1)
   Backprop with sigmoid activation, live decision boundary
══════════════════════════════════════════════════════════════ */
const NeuralNet = (() => {
  const drawCanvas = document.getElementById('neural-draw-canvas');
  const archCanvas = document.getElementById('neural-arch-canvas');
  if (!drawCanvas || !archCanvas) return;
  const dCtx = drawCanvas.getContext('2d');
  const aCtx = archCanvas.getContext('2d');

  let points = [], currentClass = 0, epoch = 0, training = false;

  // ── Network topology: 2 → 6 → 6 → 1 ──
  const arch = [2, 6, 6, 1];
  let weights = [], biases = [];

  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function sigmoidD(x) { const s = sigmoid(x); return s * (1 - s); }

  function initNet() {
    weights = []; biases = [];
    for (let l = 1; l < arch.length; l++) {
      const w = [], b = [];
      for (let j = 0; j < arch[l]; j++) {
        const wRow = [];
        for (let i = 0; i < arch[l-1]; i++) wRow.push((Math.random() - 0.5) * 1.4);
        w.push(wRow);
        b.push(0);
      }
      weights.push(w); biases.push(b);
    }
  }

  function forward(input) {
    let acts = [input];
    for (let l = 0; l < weights.length; l++) {
      const layerAct = weights[l].map((wRow, j) => {
        const z = wRow.reduce((s, w, i) => s + w * acts[l][i], 0) + biases[l][j];
        return sigmoid(z);
      });
      acts.push(layerAct);
    }
    return acts;
  }

  function trainStep(lr = 0.08) {
    if (points.length < 4) return;
    let totalLoss = 0;
    // Shuffle
    const shuffled = [...points].sort(() => Math.random() - 0.5);
    shuffled.forEach(({ x, y, cls }) => {
      const input  = [x, y];
      const target = cls;
      const acts   = forward(input);
      const output = acts[acts.length - 1][0];
      totalLoss += 0.5 * (output - target) ** 2;

      // Backprop
      let deltas = [[output - target]];
      for (let l = weights.length - 1; l >= 0; l--) {
        const prevDeltas = [];
        weights[l].forEach((wRow, j) => {
          const d = deltas[0][j];
          wRow.forEach((w, i) => {
            if (!prevDeltas[i]) prevDeltas[i] = 0;
            prevDeltas[i] += w * d;
          });
          // Update weights
          wRow.forEach((w, i) => { weights[l][j][i] -= lr * d * acts[l][i]; });
          biases[l][j] -= lr * d;
        });
        // Apply sigmoid derivative to prev layer
        const prevActs = acts[l];
        deltas = [prevActs.map((a, i) => (prevDeltas[i] || 0) * a * (1 - a))];
      }
    });
    epoch++;
    const acc = points.filter(p => {
      const out = forward([p.x, p.y]).pop()[0];
      return (out > 0.5 ? 1 : 0) === p.cls;
    }).length / points.length;

    document.getElementById('nn-epoch').textContent = epoch;
    document.getElementById('nn-loss').textContent  = (totalLoss / points.length).toFixed(4);
    document.getElementById('nn-acc').textContent   = (acc * 100).toFixed(1) + '%';
  }

  // ── Decision boundary rendering ──
  function drawBoundary(ctx, w, h) {
    const step = 6;
    for (let px = 0; px < w; px += step) {
      for (let py = 0; py < h; py += step) {
        const nx = px / w, ny = py / h;
        const out = forward([nx, ny]).pop()[0];
        ctx.fillStyle = out > 0.5
          ? `rgba(124,92,252,${out * 0.2})`
          : `rgba(0,229,204,${(1 - out) * 0.2})`;
        ctx.fillRect(px, py, step, step);
      }
    }
  }

  function resizeDraw() {
    drawCanvas.width  = drawCanvas.offsetWidth;
    drawCanvas.height = drawCanvas.offsetHeight;
  }
  function resizeArch() {
    archCanvas.width  = archCanvas.offsetWidth;
    archCanvas.height = archCanvas.offsetHeight;
  }

  function drawScene() {
    const w = drawCanvas.width, h = drawCanvas.height;
    dCtx.clearRect(0, 0, w, h);
    dCtx.fillStyle = '#0a0b0f';
    dCtx.fillRect(0, 0, w, h);
    if (points.length > 4) drawBoundary(dCtx, w, h);
    // Draw points
    points.forEach(({ x, y, cls }) => {
      dCtx.beginPath();
      if (cls === 0) {
        dCtx.arc(x * w, y * h, 6, 0, Math.PI * 2);
        dCtx.fillStyle = '#00e5cc';
      } else {
        dCtx.rect(x * w - 5, y * h - 5, 10, 10);
        dCtx.fillStyle = '#7c5cfc';
      }
      dCtx.fill();
    });
  }

  function drawArch() {
    const w = archCanvas.width, h = archCanvas.height;
    aCtx.clearRect(0, 0, w, h);
    aCtx.fillStyle = '#0a0b0f';
    aCtx.fillRect(0, 0, w, h);
    const layerX = arch.map((_, l) => (w * (l + 1)) / (arch.length + 1));
    const nodeY  = arch.map((n, l) => Array.from({ length: n }, (_, i) => (h * (i + 1)) / (n + 1)));

    // Edges
    for (let l = 0; l < arch.length - 1; l++) {
      for (let j = 0; j < arch[l + 1]; j++) {
        for (let i = 0; i < arch[l]; i++) {
          const w_val = weights[l] ? (weights[l][j][i] || 0) : 0;
          const alpha = U.clamp(Math.abs(w_val) * 0.5, 0.03, 0.5);
          aCtx.beginPath();
          aCtx.moveTo(layerX[l], nodeY[l][i]);
          aCtx.lineTo(layerX[l + 1], nodeY[l + 1][j]);
          aCtx.strokeStyle = w_val > 0 ? `rgba(0,229,204,${alpha})` : `rgba(255,64,96,${alpha})`;
          aCtx.lineWidth   = Math.min(Math.abs(w_val) * 0.8, 2);
          aCtx.stroke();
        }
      }
    }
    // Nodes
    arch.forEach((n, l) => {
      for (let i = 0; i < n; i++) {
        aCtx.beginPath();
        aCtx.arc(layerX[l], nodeY[l][i], 9, 0, Math.PI * 2);
        aCtx.fillStyle   = '#161820';
        aCtx.strokeStyle = l === 0 ? '#00e5cc' : l === arch.length - 1 ? '#f5a623' : '#7c5cfc';
        aCtx.lineWidth   = 1.5;
        aCtx.fill(); aCtx.stroke();
      }
    });
  }

  function loop() { drawScene(); drawArch(); if (training) trainStep(); requestAnimationFrame(loop); }

  drawCanvas.addEventListener('mousedown', e => {
    const r = drawCanvas.getBoundingClientRect();
    points.push({ x: (e.clientX - r.left) / drawCanvas.width, y: (e.clientY - r.top) / drawCanvas.height, cls: currentClass });
  });

  document.getElementById('nn-class-a').addEventListener('click', () => {
    currentClass = 0;
    document.getElementById('nn-class-a').classList.add('active');
    document.getElementById('nn-class-b').classList.remove('active');
  });
  document.getElementById('nn-class-b').addEventListener('click', () => {
    currentClass = 1;
    document.getElementById('nn-class-b').classList.add('active');
    document.getElementById('nn-class-a').classList.remove('active');
  });
  document.getElementById('nn-clear').addEventListener('click', () => { points = []; epoch = 0; initNet(); });
  document.getElementById('nn-train').addEventListener('click', () => { training = !training; });

  window.addEventListener('resize', U.debounce(() => { resizeDraw(); resizeArch(); }, 200));
  resizeDraw(); resizeArch(); initNet(); loop();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 10 — Lorenz Attractor (3D → 2D projection)
══════════════════════════════════════════════════════════════ */
const LorenzViz = (() => {
  const canvas = document.getElementById('lorenz-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let sigma = 10, rho = 28, beta = 8 / 3;
  let pts = [], maxPts = 4000;
  let x = 0.1, y = 0, z = 0;
  let angleY = 0.4, angleX = 0.2;

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));

  document.getElementById('lorenz-sigma').addEventListener('input', e => sigma = +e.target.value);
  document.getElementById('lorenz-rho').addEventListener('input',   e => rho   = +e.target.value);
  document.getElementById('lorenz-beta').addEventListener('input',  e => beta  = +e.target.value / 100);

  function project(px, py, pz, w, h) {
    // Rotate around Y then X
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const rx1 = px * cosY - pz * sinY;
    const rz1 = px * sinY + pz * cosY;
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const ry2 = py * cosX - rz1 * sinX;
    const scale = 8;
    return { sx: w / 2 + rx1 * scale, sy: h / 2 + ry2 * scale };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = 'rgba(6,6,8,0.12)';
    ctx.fillRect(0, 0, w, h);
    angleY += 0.003;

    // Integrate RK4 step
    const dt = 0.008;
    for (let i = 0; i < 3; i++) {
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
      x += dx * dt; y += dy * dt; z += dz * dt;
      pts.push({ x, y, z });
      if (pts.length > maxPts) pts.shift();
    }

    // Draw trail
    for (let i = 1; i < pts.length; i++) {
      const a = project(pts[i-1].x, pts[i-1].y, pts[i-1].z, w, h);
      const b = project(pts[i].x,   pts[i].y,   pts[i].z,   w, h);
      const t = i / pts.length;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.strokeStyle = `hsl(${180 + t * 140}, 90%, ${40 + t * 30}%)`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 11 — Visual Hash (simulated SHA-256 avalanche)
══════════════════════════════════════════════════════════════ */
const CryptoViz = (() => {
  const canvas = document.getElementById('crypto-canvas');
  const input  = document.getElementById('crypto-input');
  if (!canvas || !input) return;
  const ctx = canvas.getContext('2d');

  // Simple but visual "hash" — deterministic pseudo-SHA using xorshift
  function hash32(str) {
    let state = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
                 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      state = state.map((v, j) => {
        let x = v ^ (c << (j * 3 & 31));
        x = (x ^ (x >>> 13)) >>> 0;
        x = (x * 0x85ebca6b) >>> 0;
        x = (x ^ (x >>> 16)) >>> 0;
        return x;
      });
    }
    return state;
  }

  function toHex(arr) { return arr.map(v => (v >>> 0).toString(16).padStart(8,'0')).join(''); }

  function countBits(n) {
    let c = 0; while (n) { c += n & 1; n >>>= 1; } return c;
  }

  let prevHash = null;
  function update() {
    const text   = input.value;
    const h      = hash32(text);
    const hex    = toHex(h);
    document.getElementById('crypto-hash').textContent    = hex;

    // Entropy
    const bits = h.reduce((s, v) => s + countBits(v), 0);
    document.getElementById('crypto-entropy').textContent = bits + ' / 256';

    // Avalanche vs prev
    if (prevHash) {
      let diffBits = 0;
      prevHash.forEach((v, i) => { diffBits += countBits(v ^ h[i]); });
      document.getElementById('crypto-avalanche').textContent = diffBits + ' bits (' + Math.round(diffBits / 256 * 100) + '%)';
    }
    prevHash = [...h];

    // Draw 16×16 matrix coloured by hash nibbles
    const w = canvas.width, hh = canvas.height;
    ctx.clearRect(0, 0, w, hh);
    ctx.fillStyle = '#0a0b0f';
    ctx.fillRect(0, 0, w, hh);
    const COLS = 16, ROWS = 16;
    const cw = w / COLS, ch = hh / ROWS;
    hex.split('').forEach((nibble, idx) => {
      const val  = parseInt(nibble, 16) / 15;
      const row  = Math.floor(idx / COLS);
      const col  = idx % COLS;
      const hue  = val * 200 + 160;
      ctx.fillStyle = `hsla(${hue},85%,${30 + val * 35}%,1)`;
      ctx.fillRect(col * cw + 1, row * ch + 1, cw - 2, ch - 2);
      ctx.fillStyle = `rgba(0,0,0,0.5)`;
      ctx.font = `bold ${Math.min(cw, ch) * 0.45}px JetBrains Mono`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(nibble, col * cw + cw / 2, row * ch + ch / 2);
    });
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    update();
  }
  input.addEventListener('input', U.debounce(update, 80));
  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { obs.disconnect(); resize(); } }, { threshold: 0.1 });
  obs.observe(canvas);
  setTimeout(update, 400);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 12 — Force-Directed Graph (Fruchterman-Reingold)
══════════════════════════════════════════════════════════════ */
const ForceGraph = (() => {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [], edges = [], mode = 'move';
  let dragging = null, edgeStart = null;
  const K = 80, REPEL = 6000, ATTRACT = 0.06, DAMPING = 0.85;

  function makeNode(x, y, label) {
    return { x, y, vx: 0, vy: 0, label: label || String(nodes.length + 1) };
  }

  function reset() {
    nodes = []; edges = [];
    const W = canvas.width, H = canvas.height;
    for (let i = 0; i < 10; i++) {
      nodes.push(makeNode(U.rand(80, W - 80), U.rand(80, H - 80)));
    }
    edges = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[5,6],[6,7],[7,8],[8,9],[9,5],[2,7]];
    updateStats();
  }

  function updateStats() {
    document.getElementById('graph-nodes').textContent = nodes.length;
    document.getElementById('graph-edges').textContent = edges.length;
    // BFS diameter (approx)
    let maxDist = 0;
    if (nodes.length > 1) {
      nodes.forEach((_, src) => {
        const dist = new Array(nodes.length).fill(Infinity);
        dist[src] = 0;
        const q = [src];
        while (q.length) {
          const v = q.shift();
          edges.forEach(([a, b]) => {
            const nb = a === v ? b : b === v ? a : -1;
            if (nb >= 0 && dist[nb] === Infinity) { dist[nb] = dist[v] + 1; q.push(nb); }
          });
        }
        const max = Math.max(...dist.filter(d => d !== Infinity));
        if (max > maxDist) maxDist = max;
      });
    }
    document.getElementById('graph-diam').textContent = maxDist || '—';
  }

  function simulate() {
    nodes.forEach(n => {
      nodes.forEach(m => {
        if (n === m) return;
        const dx = n.x - m.x, dy = n.y - m.y;
        const d  = Math.hypot(dx, dy) + 0.1;
        const f  = REPEL / (d * d);
        n.vx += (dx / d) * f * 0.1;
        n.vy += (dy / d) * f * 0.1;
      });
    });
    edges.forEach(([a, b]) => {
      const dx = nodes[b].x - nodes[a].x, dy = nodes[b].y - nodes[a].y;
      const d  = Math.hypot(dx, dy) + 0.1;
      const f  = (d - K) * ATTRACT;
      nodes[a].vx += (dx / d) * f;
      nodes[a].vy += (dy / d) * f;
      nodes[b].vx -= (dx / d) * f;
      nodes[b].vy -= (dy / d) * f;
    });
    const W = canvas.width, H = canvas.height;
    nodes.forEach(n => {
      if (n === dragging) return;
      n.vx *= DAMPING; n.vy *= DAMPING;
      n.x  = U.clamp(n.x + n.vx, 20, W - 20);
      n.y  = U.clamp(n.y + n.vy, 20, H - 20);
    });
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, 0, W, H);

    simulate();

    // Edges
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a].x, nodes[a].y);
      ctx.lineTo(nodes[b].x, nodes[b].y);
      ctx.strokeStyle = 'rgba(0,229,204,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Nodes
    nodes.forEach((n, i) => {
      ctx.beginPath(); ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
      ctx.fillStyle   = edgeStart === i ? '#f5a623' : '#161820';
      ctx.strokeStyle = edgeStart === i ? '#f5a623' : '#7c5cfc';
      ctx.lineWidth   = 2; ctx.fill(); ctx.stroke();
      ctx.fillStyle   = '#f0f0f4';
      ctx.font        = 'bold 10px JetBrains Mono';
      ctx.textAlign   = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });
    requestAnimationFrame(draw);
  }

  function nodeAt(ex, ey) {
    const r = canvas.getBoundingClientRect();
    const mx = ex - r.left, my = ey - r.top;
    return nodes.findIndex(n => Math.hypot(n.x - mx, n.y - my) < 18);
  }

  canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const idx = nodeAt(e.clientX, e.clientY);
    if (mode === 'move' && idx >= 0) dragging = nodes[idx];
    else if (mode === 'add') {
      nodes.push(makeNode(mx, my));
      updateStats();
    } else if (mode === 'edge') {
      if (idx >= 0) {
        if (edgeStart === null) edgeStart = idx;
        else {
          if (edgeStart !== idx && !edges.some(([a,b]) => (a===edgeStart&&b===idx)||(a===idx&&b===edgeStart))) {
            edges.push([edgeStart, idx]); updateStats();
          }
          edgeStart = null;
        }
      }
    }
  });
  canvas.addEventListener('mousemove', e => {
    if (!dragging) return;
    const r = canvas.getBoundingClientRect();
    dragging.x = e.clientX - r.left; dragging.y = e.clientY - r.top;
    dragging.vx = 0; dragging.vy = 0;
  });
  canvas.addEventListener('mouseup', () => dragging = null);

  ['graph-mode-move','graph-mode-add','graph-mode-edge'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      mode = id.replace('graph-mode-','');
      edgeStart = null;
      document.querySelectorAll('#graph .ctrl-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    });
  });
  document.getElementById('graph-reset').addEventListener('click', () => { reset(); });

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; reset(); }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); draw();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 13 — Conway's Game of Life (toroidal grid)
══════════════════════════════════════════════════════════════ */
const GameOfLife = (() => {
  const canvas = document.getElementById('life-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLS = 120, ROWS = 68;
  let grid = [], next = [], running = false, gen = 0, speed = 8, lastTick = 0;
  let drawing = false;

  function make()  { return Array.from({ length: ROWS }, () => new Uint8Array(COLS)); }
  function init()  { grid = make(); next = make(); gen = 0; update(); }
  function randomize() {
    grid.forEach(row => row.forEach((_, c, r) => { r[c] = Math.random() < 0.3 ? 1 : 0; }));
    gen = 0; update();
  }

  function step() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            n += grid[(r + dr + ROWS) % ROWS][(c + dc + COLS) % COLS];
          }
        const alive = grid[r][c];
        next[r][c] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
      }
    }
    [grid, next] = [next, grid]; gen++;
  }

  function gliderGun() {
    init();
    const g = [
      [5,1],[5,2],[6,1],[6,2],[5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],
      [3,14],[9,14],[6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],
      [3,21],[4,21],[5,21],[3,22],[4,22],[5,22],[2,23],[6,23],[1,25],[2,25],[6,25],[7,25],
      [3,35],[4,35],[3,36],[4,36]
    ];
    g.forEach(([r,c]) => { if (grid[r] && c < COLS) grid[r][c] = 1; });
    update();
  }

  function update() {
    let pop = 0;
    grid.forEach(row => { row.forEach(c => { pop += c; }); });
    document.getElementById('life-gen').textContent = gen;
    document.getElementById('life-pop').textContent = pop;
  }

  function drawGrid() {
    const W = canvas.width, H = canvas.height;
    const cw = W / COLS, ch = H / ROWS;
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);
    grid.forEach((row, r) => {
      row.forEach((alive, c) => {
        if (!alive) return;
        const hue = (r / ROWS * 80 + 160);
        ctx.fillStyle = `hsl(${hue},80%,60%)`;
        ctx.fillRect(c * cw + 0.5, r * ch + 0.5, cw - 1, ch - 1);
      });
    });
  }

  function loop(ts) {
    if (running && ts - lastTick > 1000 / speed) { step(); update(); lastTick = ts; }
    drawGrid();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('mousedown', () => drawing = true);
  canvas.addEventListener('mouseup',   () => drawing = false);
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const r = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - r.left) / canvas.width  * COLS);
    const row = Math.floor((e.clientY - r.top)  / canvas.height * ROWS);
    if (grid[row] && c >= 0 && c < COLS) { grid[row][c] = 1; update(); }
  });

  document.getElementById('life-play').addEventListener('click', () => {
    running = !running;
    document.getElementById('life-play').textContent = running ? '⏸ Pause' : '▶ Play';
  });
  document.getElementById('life-step').addEventListener('click', () => { step(); update(); });
  document.getElementById('life-clear').addEventListener('click', init);
  document.getElementById('life-random').addEventListener('click', randomize);
  document.getElementById('life-glider').addEventListener('click', gliderGun);
  document.getElementById('life-speed-slider').addEventListener('input', e => {
    speed = +e.target.value;
    document.getElementById('life-speed').textContent = speed;
  });

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); randomize(); loop(0);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 14 — Perlin Noise Terrain
══════════════════════════════════════════════════════════════ */
const PerlinNoise = (() => {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Classic Perlin permutation table
  const P = (() => {
    const p = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    return [...p, ...p];
  })();
  let PERM = [...P];

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function grad(hash, x, y) {
    const h = hash & 3;
    return (h < 2 ? (h & 1 ? -x : x) : (h & 1 ? -y : y));
  }
  function noise2(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const a = PERM[X] + Y, b = PERM[X + 1] + Y;
    return U.lerp(
      U.lerp(grad(PERM[a],   xf,   yf),   grad(PERM[b],   xf - 1, yf),   u),
      U.lerp(grad(PERM[a+1], xf,   yf-1), grad(PERM[b+1], xf - 1, yf-1), u),
      v
    );
  }

  function fbm(x, y, octaves, scale) {
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      val += noise2(x * freq / scale, y * freq / scale) * amp;
      max += amp; amp *= 0.5; freq *= 2;
    }
    return val / max;
  }

  let octaves = 4, scale = 3.0, seed = 42;

  function generate() {
    // Reseed permutation
    const s = seed * 1234567 % 256;
    const p = Array.from({ length: 256 }, (_, i) => (i + s) % 256).sort(() => Math.sin(seed++) - 0.5);
    PERM = [...p, ...p];
    const W = canvas.width, H = canvas.height;
    const imgData = ctx.createImageData(W, H);
    const data = imgData.data;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const v  = (fbm(px, py, octaves, scale * 20) + 1) / 2;
        const idx = (py * W + px) * 4;
        // Terrain colouring
        if (v < 0.35)      { data[idx]=0;   data[idx+1]=30;  data[idx+2]=100; } // deep water
        else if (v < 0.42) { data[idx]=30;  data[idx+1]=80;  data[idx+2]=160; } // shallow
        else if (v < 0.48) { data[idx]=200; data[idx+1]=180; data[idx+2]=100; } // sand
        else if (v < 0.62) { data[idx]=40;  data[idx+1]=120; data[idx+2]=40;  } // grass
        else if (v < 0.75) { data[idx]=80;  data[idx+1]=60;  data[idx+2]=30;  } // mountain
        else               { data[idx]=220; data[idx+1]=220; data[idx+2]=220; } // snow
        data[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; generate(); }

  document.getElementById('noise-octaves').addEventListener('input', e => {
    octaves = +e.target.value;
    document.getElementById('noise-oct-val').textContent = octaves;
    generate();
  });
  document.getElementById('noise-scale').addEventListener('input', e => {
    scale = +e.target.value / 10;
    document.getElementById('noise-scale-val').textContent = scale.toFixed(1);
    generate();
  });
  document.getElementById('noise-seed').addEventListener('input', e => { seed = +e.target.value; generate(); });
  document.getElementById('noise-regen').addEventListener('click', () => { seed = Math.random() * 999 | 0; generate(); });

  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 15 — Wave Interference (Huygens principle)
══════════════════════════════════════════════════════════════ */
const WaveViz = (() => {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let sources = [], t = 0;

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }

  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    sources.push({ x: e.clientX - r.left, y: e.clientY - r.top, phase: t });
    if (sources.length > 8) sources.shift();
  });
  document.getElementById('wave-clear').addEventListener('click', () => sources = []);

  function draw() {
    const W = canvas.width, H = canvas.height;
    if (!sources.length) {
      ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(139,140,158,0.4)';
      ctx.font = '13px JetBrains Mono'; ctx.textAlign = 'center';
      ctx.fillText('Click to add wave sources', W/2, H/2);
      requestAnimationFrame(draw);
      t += 0.05;
      return;
    }
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;
    const λ = 60, ω = 2;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        let amp = 0;
        sources.forEach(s => {
          const d = Math.hypot(px - s.x, py - s.y);
          amp += Math.sin(2 * Math.PI * d / λ - ω * t + s.phase) / (1 + d * 0.02);
        });
        amp /= sources.length;
        const v   = (amp + 1) / 2;
        const idx = (py * W + px) * 4;
        data[idx]   = 0;
        data[idx+1] = v * 229 | 0;
        data[idx+2] = v * 204 | 0;
        data[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    // Source markers
    sources.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI*2);
      ctx.fillStyle = '#f5a623'; ctx.fill();
    });
    t += 0.05;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); } }, { threshold: 0.1 });
  obs.observe(canvas);
  resize(); draw();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 16 — Bézier Curves (De Casteljau)
══════════════════════════════════════════════════════════════ */
const BezierViz = (() => {
  const canvas = document.getElementById('bezier-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pts = [], dragging = null, animT = 0;

  function reset() {
    const W = canvas.width, H = canvas.height;
    pts = [
      { x: W*0.1, y: H*0.8 }, { x: W*0.3, y: H*0.1 },
      { x: W*0.7, y: H*0.9 }, { x: W*0.9, y: H*0.2 }
    ];
    document.getElementById('bezier-degree').textContent = pts.length - 1;
  }

  function casteljau(points, t) {
    if (points.length === 1) return points[0];
    const next = [];
    for (let i = 0; i < points.length - 1; i++) {
      next.push({ x: U.lerp(points[i].x, points[i+1].x, t), y: U.lerp(points[i].y, points[i+1].y, t) });
    }
    return casteljau(next, t);
  }

  function drawIntermediate(points, t, level) {
    if (points.length < 2) return;
    const next = [];
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const p = { x: U.lerp(points[i].x, points[i+1].x, t), y: U.lerp(points[i].y, points[i+1].y, t) };
      next.push(p);
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i+1].x, points[i+1].y);
    }
    ctx.strokeStyle = `rgba(124,92,252,${0.12 + level * 0.08})`; ctx.lineWidth = 1; ctx.stroke();
    next.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(245,166,35,${0.5 + level*0.1})`; ctx.fill();
    });
    drawIntermediate(next, t, level + 1);
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'var(--bg-surface)'; ctx.fillRect(0, 0, W, H);

    // Full curve
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = casteljau(pts, i / 200);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = '#00e5cc'; ctx.lineWidth = 2.5; ctx.stroke();

    // De Casteljau construction lines at animT
    drawIntermediate(pts, animT, 0);
    const pt = casteljau(pts, animT);
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI*2);
    ctx.fillStyle = '#f5a623'; ctx.fill();

    // Control points
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2);
      ctx.fillStyle   = dragging === i ? '#f5a623' : '#161820';
      ctx.strokeStyle = '#7c5cfc'; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    });

    // Hull polygon
    ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(124,92,252,0.2)'; ctx.lineWidth = 1; ctx.stroke();

    animT = (animT + 0.004) % 1;
    document.getElementById('bezier-t-val').textContent = animT.toFixed(2);
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    dragging = pts.findIndex(p => Math.hypot(p.x - mx, p.y - my) < 14);
  });
  canvas.addEventListener('mousemove', e => {
    if (dragging < 0) return;
    const r = canvas.getBoundingClientRect();
    pts[dragging].x = e.clientX - r.left; pts[dragging].y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseup', () => dragging = -1);

  document.getElementById('bezier-add').addEventListener('click', () => {
    const W = canvas.width, H = canvas.height;
    pts.push({ x: U.rand(W*0.2, W*0.8), y: U.rand(H*0.2, H*0.8) });
    document.getElementById('bezier-degree').textContent = pts.length - 1;
  });
  document.getElementById('bezier-reset').addEventListener('click', reset);

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; reset(); }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); draw();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 17 — Maze Generator (Recursive Backtracker / DFS)
══════════════════════════════════════════════════════════════ */
const MazeGen = (() => {
  const canvas = document.getElementById('maze-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLS = 40, ROWS = 22;
  let cells = [], generating = false, solving = false, solvePath = [];
  let passages = 0;

  function Cell(r, c) { return { r, c, walls: [true,true,true,true], visited: false }; } // N E S W

  function build() {
    cells = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => Cell(r, c)));
    passages = 0; solvePath = [];
    const stack = [];
    let cur = cells[0][0]; cur.visited = true; stack.push(cur);
    document.getElementById('maze-status').textContent = 'carving…';

    function iterate() {
      if (stack.length === 0) { document.getElementById('maze-status').textContent = 'done'; generating = false; return; }
      const nbrs = [
        cells[cur.r-1]?.[cur.c], cells[cur.r]?.[cur.c+1],
        cells[cur.r+1]?.[cur.c], cells[cur.r]?.[cur.c-1]
      ].map((n, i) => n && !n.visited ? { n, dir: i } : null).filter(Boolean);

      if (nbrs.length) {
        const { n, dir } = nbrs[Math.floor(Math.random() * nbrs.length)];
        cur.walls[dir] = false;
        n.walls[(dir + 2) % 4] = false;
        n.visited = true; stack.push(cur); cur = n; passages++;
        document.getElementById('maze-passages').textContent = passages;
      } else {
        cur = stack.pop();
      }
      requestAnimationFrame(iterate);
    }
    generating = true;
    document.getElementById('maze-cells').textContent = ROWS * COLS;
    requestAnimationFrame(iterate);
  }

  function solveBFS() {
    const start = cells[0][0], end = cells[ROWS-1][COLS-1];
    const prev = new Map();
    const q = [start]; prev.set(start, null);
    while (q.length) {
      const cur = q.shift();
      if (cur === end) {
        solvePath = [];
        let node = end;
        while (node) { solvePath.push(node); node = prev.get(node); }
        solvePath.reverse();
        document.getElementById('maze-status').textContent = `path: ${solvePath.length}`;
        return;
      }
      const nbrs = [
        { n: cells[cur.r-1]?.[cur.c], dir: 0 }, { n: cells[cur.r]?.[cur.c+1], dir: 1 },
        { n: cells[cur.r+1]?.[cur.c], dir: 2 }, { n: cells[cur.r]?.[cur.c-1], dir: 3 }
      ];
      nbrs.forEach(({ n, dir }) => {
        if (n && !cur.walls[dir] && !prev.has(n)) { prev.set(n, cur); q.push(n); }
      });
    }
  }

  function drawMaze() {
    const W = canvas.width, H = canvas.height;
    const cw = W / COLS, ch = H / ROWS;
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);
    const pathSet = new Set(solvePath);

    cells.forEach(row => row.forEach(cell => {
      const x = cell.c * cw, y = cell.r * ch;
      if (pathSet.has(cell)) { ctx.fillStyle = 'rgba(0,229,204,0.25)'; ctx.fillRect(x, y, cw, ch); }
      ctx.strokeStyle = 'rgba(0,229,204,0.5)'; ctx.lineWidth = 1;
      if (cell.walls[0]) { ctx.beginPath(); ctx.moveTo(x,y);    ctx.lineTo(x+cw,y);    ctx.stroke(); }
      if (cell.walls[1]) { ctx.beginPath(); ctx.moveTo(x+cw,y); ctx.lineTo(x+cw,y+ch); ctx.stroke(); }
      if (cell.walls[2]) { ctx.beginPath(); ctx.moveTo(x,y+ch); ctx.lineTo(x+cw,y+ch); ctx.stroke(); }
      if (cell.walls[3]) { ctx.beginPath(); ctx.moveTo(x,y);    ctx.lineTo(x,y+ch);    ctx.stroke(); }
    }));

    // Start/end
    ctx.fillStyle = '#00e5cc'; ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#7c5cfc'; ctx.fillRect((COLS-1)*cw, (ROWS-1)*ch, cw, ch);
    requestAnimationFrame(drawMaze);
  }

  document.getElementById('maze-gen').addEventListener('click', build);
  document.getElementById('maze-solve').addEventListener('click', solveBFS);
  document.getElementById('maze-clear').addEventListener('click', () => { solvePath = []; document.getElementById('maze-status').textContent = 'idle'; });

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); build(); drawMaze();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 18 — Fourier Epicycles (DFT Drawing Machine)
══════════════════════════════════════════════════════════════ */
const Epicycles = (() => {
  const canvas = document.getElementById('epicycle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawMode = true, userPath = [], dftData = [], animating = false;
  let animT = 0, terms = 20, trace = [];

  function dft(pts) {
    const N = pts.length;
    return Array.from({ length: N }, (_, k) => {
      let re = 0, im = 0;
      pts.forEach((p, n) => {
        const phi = (2 * Math.PI * k * n) / N;
        re += p.x * Math.cos(phi) + p.y * Math.sin(phi);
        im += -p.x * Math.sin(phi) + p.y * Math.cos(phi);
      });
      re /= N; im /= N;
      return { re, im, freq: k, amp: Math.hypot(re, im), phase: Math.atan2(im, re) };
    }).sort((a, b) => b.amp - a.amp);
  }

  function drawEpicycles(t, W, H) {
    let x = W / 2, y = H / 2;
    const T = Math.min(terms, dftData.length);
    for (let i = 0; i < T; i++) {
      const { freq, amp, phase } = dftData[i];
      const px = x, py = y;
      x += amp * Math.cos(freq * t + phase);
      y += amp * Math.sin(freq * t + phase);
      ctx.beginPath(); ctx.arc(px, py, amp, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(0,229,204,0.12)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(124,92,252,0.6)'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    return { x, y };
  }

  function animLoop() {
    if (!animating) return;
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = 'rgba(6,6,8,0.25)'; ctx.fillRect(0, 0, W, H);
    const tip = drawEpicycles(animT, W, H);
    trace.push({ x: tip.x, y: tip.y });
    if (trace.length > dftData.length) trace.shift();

    ctx.beginPath();
    trace.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#00e5cc'; ctx.lineWidth = 2; ctx.stroke();
    animT += (2 * Math.PI) / dftData.length;
    document.getElementById('epi-freq').textContent = (animT / (2 * Math.PI) * 100).toFixed(1) + '%';
    requestAnimationFrame(animLoop);
  }

  canvas.addEventListener('mousedown', () => { if (drawMode) { userPath = []; trace = []; } });
  canvas.addEventListener('mousemove', e => {
    if (!drawMode || !e.buttons) return;
    const r = canvas.getBoundingClientRect();
    userPath.push({ x: e.clientX - r.left - canvas.width/2, y: e.clientY - r.top - canvas.height/2 });
  });
  canvas.addEventListener('mouseup', () => {
    if (drawMode && userPath.length > 4) {
      // Sample to 128 pts for perf
      const step = Math.max(1, Math.floor(userPath.length / 128));
      const sampled = userPath.filter((_, i) => i % step === 0);
      dftData = dft(sampled);
      document.getElementById('epi-circles').textContent = dftData.length;
    }
  });

  document.getElementById('epi-draw-mode').addEventListener('click', () => {
    drawMode = true; animating = false;
    document.getElementById('epi-draw-mode').classList.add('active');
    document.getElementById('epi-play').classList.remove('active');
  });
  document.getElementById('epi-play').addEventListener('click', () => {
    if (!dftData.length) return;
    drawMode = false; animating = true; animT = 0; trace = [];
    document.getElementById('epi-play').classList.add('active');
    document.getElementById('epi-draw-mode').classList.remove('active');
    animLoop();
  });
  document.getElementById('epi-clear').addEventListener('click', () => {
    userPath = []; dftData = []; trace = []; animating = false; animT = 0;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
  });
  document.getElementById('epi-terms').addEventListener('input', e => {
    terms = +e.target.value;
    document.getElementById('epi-terms-val').textContent = terms;
    trace = [];
  });

  // Idle draw loop
  function idleLoop() {
    if (!animating) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, 0, W, H);
      if (userPath.length > 1) {
        ctx.beginPath();
        userPath.forEach((p, i) => {
          const x = p.x + W/2, y = p.y + H/2;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#00e5cc'; ctx.lineWidth = 2; ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(139,140,158,0.3)';
        ctx.font = '13px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillText('Draw a closed path, then press ▶ Animate DFT', W/2, H/2);
      }
    }
    requestAnimationFrame(idleLoop);
  }

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); idleLoop();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 19 — Genetic Algorithm (TSP)
══════════════════════════════════════════════════════════════ */
const GeneticTSP = (() => {
  const canvas = document.getElementById('genetic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N_CITIES = 18, POP_SIZE = 80, MUTATION = 0.02;
  let cities = [], population = [], bestRoute = [], bestDist = Infinity;
  let running = false, gen = 0;

  function randCities() {
    cities = Array.from({ length: N_CITIES }, () => ({
      x: U.rand(60, canvas.width - 60),
      y: U.rand(60, canvas.height - 60)
    }));
    bestDist = Infinity; gen = 0; bestRoute = [];
    document.getElementById('ga-best').textContent = '—';
    document.getElementById('ga-gen').textContent  = '0';
  }

  function routeDist(route) {
    let d = 0;
    for (let i = 0; i < route.length; i++) {
      const a = cities[route[i]], b = cities[route[(i+1) % route.length]];
      d += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return d;
  }

  function randomRoute() { return Array.from({ length: N_CITIES }, (_,i)=>i).sort(()=>Math.random()-0.5); }

  function crossover(a, b) {
    const start = Math.random() * N_CITIES | 0;
    const len   = (Math.random() * N_CITIES / 2 + 1) | 0;
    const child = new Array(N_CITIES).fill(-1);
    for (let i = 0; i < len; i++) child[(start + i) % N_CITIES] = a[(start + i) % N_CITIES];
    let bi = 0;
    for (let i = 0; i < N_CITIES; i++) {
      if (!child.includes(b[bi])) { const fi = child.indexOf(-1); if (fi >= 0) child[fi] = b[bi]; }
      bi++;
    }
    child.forEach((v, i) => { if (v === -1) { child[i] = b.find(x => !child.includes(x)); } });
    return child;
  }

  function mutate(route) {
    const r = [...route];
    if (Math.random() < MUTATION) {
      const i = Math.random() * N_CITIES | 0, j = Math.random() * N_CITIES | 0;
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  function evolveStep() {
    const fitness  = population.map(r => 1 / routeDist(r));
    const total    = fitness.reduce((s,f)=>s+f,0);
    const newPop   = [];
    for (let i = 0; i < POP_SIZE; i++) {
      // Tournament selection
      const pick = () => {
        let best = null, bF = -1;
        for (let k = 0; k < 5; k++) {
          const idx = Math.random() * POP_SIZE | 0;
          if (fitness[idx] > bF) { bF = fitness[idx]; best = population[idx]; }
        }
        return best;
      };
      newPop.push(mutate(crossover(pick(), pick())));
    }
    population = newPop;
    const best = population.reduce((b, r) => routeDist(r) < routeDist(b) ? r : b);
    const d    = routeDist(best);
    if (d < bestDist) { bestDist = d; bestRoute = [...best]; }
    gen++;
    document.getElementById('ga-gen').textContent  = gen;
    document.getElementById('ga-best').textContent = Math.round(bestDist);
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);

    if (running) { for (let i = 0; i < 4; i++) evolveStep(); }

    // Draw best route
    if (bestRoute.length) {
      ctx.beginPath();
      bestRoute.forEach((ci, i) => {
        const c = cities[ci];
        i === 0 ? ctx.moveTo(c.x, c.y) : ctx.lineTo(c.x, c.y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,229,204,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Cities
    cities.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(c.x, c.y, 7, 0, Math.PI*2);
      ctx.fillStyle = '#161820'; ctx.strokeStyle = '#7c5cfc'; ctx.lineWidth = 2;
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f0f0f4'; ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(i, c.x, c.y);
    });

    requestAnimationFrame(draw);
  }

  document.getElementById('ga-start').addEventListener('click', () => {
    if (!cities.length) { resize(); }
    if (!population.length) population = Array.from({ length: POP_SIZE }, randomRoute);
    running = !running;
    document.getElementById('ga-start').textContent = running ? '⏸ Pause' : 'Evolve';
  });
  document.getElementById('ga-reset').addEventListener('click', () => {
    running = false; population = [];
    document.getElementById('ga-start').textContent = 'Evolve';
    resize();
  });

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    randCities();
  }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); draw();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 20 — Navier-Stokes Fluid Simulation (Jos Stam lite)
══════════════════════════════════════════════════════════════ */
const FluidSim = (() => {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N = 80;
  let viscosity = 0.00004, diffusion = 0.00002;
  let vx, vy, vx0, vy0, dens, dens0;
  let prevMx = -1, prevMy = -1;

  function idx(x, y) { return U.clamp(x, 0, N-1) + U.clamp(y, 0, N-1) * N; }
  function alloc() { return new Float32Array(N * N); }

  function init() {
    vx = alloc(); vy = alloc(); vx0 = alloc(); vy0 = alloc();
    dens = alloc(); dens0 = alloc();
  }

  function set_bnd(b, x) {
    for (let i = 1; i < N-1; i++) {
      x[idx(i,0)]   = b===2 ? -x[idx(i,1)]   : x[idx(i,1)];
      x[idx(i,N-1)] = b===2 ? -x[idx(i,N-2)] : x[idx(i,N-2)];
      x[idx(0,i)]   = b===1 ? -x[idx(1,i)]   : x[idx(1,i)];
      x[idx(N-1,i)] = b===1 ? -x[idx(N-2,i)] : x[idx(N-2,i)];
    }
    x[idx(0,0)]     = 0.5*(x[idx(1,0)]   + x[idx(0,1)]);
    x[idx(0,N-1)]   = 0.5*(x[idx(1,N-1)] + x[idx(0,N-2)]);
    x[idx(N-1,0)]   = 0.5*(x[idx(N-2,0)] + x[idx(N-1,1)]);
    x[idx(N-1,N-1)] = 0.5*(x[idx(N-2,N-1)]+ x[idx(N-1,N-2)]);
  }

  function lin_solve(b, x, x0, a, c) {
    const cRecip = 1 / c;
    for (let k = 0; k < 10; k++) {
      for (let j = 1; j < N-1; j++)
        for (let i = 1; i < N-1; i++)
          x[idx(i,j)] = (x0[idx(i,j)] + a*(x[idx(i-1,j)]+x[idx(i+1,j)]+x[idx(i,j-1)]+x[idx(i,j+1)])) * cRecip;
      set_bnd(b, x);
    }
  }

  function diffuse(b, x, x0, diff, dt) {
    lin_solve(b, x, x0, diff * dt * (N-2)*(N-2), 1 + 6 * diff * dt * (N-2)*(N-2));
  }

  function advect(b, d, d0, vx_, vy_, dt) {
    const dtx = dt * (N-2), dty = dt * (N-2);
    for (let j = 1; j < N-1; j++) {
      for (let i = 1; i < N-1; i++) {
        let x = i - dtx * vx_[idx(i,j)];
        let y = j - dty * vy_[idx(i,j)];
        x = U.clamp(x, 0.5, N-1.5); y = U.clamp(y, 0.5, N-1.5);
        const i0 = Math.floor(x), i1 = i0 + 1;
        const j0 = Math.floor(y), j1 = j0 + 1;
        const s1 = x-i0, s0 = 1-s1, t1 = y-j0, t0 = 1-t1;
        d[idx(i,j)] = s0*(t0*d0[idx(i0,j0)]+t1*d0[idx(i0,j1)])+s1*(t0*d0[idx(i1,j0)]+t1*d0[idx(i1,j1)]);
      }
    }
    set_bnd(b, d);
  }

  function project(vx_, vy_, p, div) {
    for (let j=1;j<N-1;j++)
      for (let i=1;i<N-1;i++) {
        div[idx(i,j)] = -0.5*(vx_[idx(i+1,j)]-vx_[idx(i-1,j)]+vy_[idx(i,j+1)]-vy_[idx(i,j-1)])/N;
        p[idx(i,j)] = 0;
      }
    set_bnd(0,div); set_bnd(0,p);
    lin_solve(0, p, div, 1, 6);
    for (let j=1;j<N-1;j++)
      for (let i=1;i<N-1;i++) {
        vx_[idx(i,j)] -= 0.5*(p[idx(i+1,j)]-p[idx(i-1,j)])*N;
        vy_[idx(i,j)] -= 0.5*(p[idx(i,j+1)]-p[idx(i,j-1)])*N;
      }
    set_bnd(1,vx_); set_bnd(2,vy_);
  }

  function step(dt) {
    diffuse(1, vx0, vx, viscosity, dt);
    diffuse(2, vy0, vy, viscosity, dt);
    project(vx0, vy0, vx, vy);
    advect(1, vx, vx0, vx0, vy0, dt);
    advect(2, vy, vy0, vx0, vy0, dt);
    project(vx, vy, vx0, vy0);
    diffuse(0, dens0, dens, diffusion, dt);
    advect(0, dens, dens0, vx, vy, dt);
  }

  function render() {
    const W = canvas.width, H = canvas.height;
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;
    const scaleX  = W / N, scaleY = H / N;
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const ci = Math.floor(i / scaleX), cj = Math.floor(j / scaleY);
        const d  = U.clamp(dens[idx(ci, cj)], 0, 1);
        const vv = Math.hypot(vx[idx(ci,cj)], vy[idx(ci,cj)]) * 3;
        const pi = (j * W + i) * 4;
        data[pi]   = d * 30  + vv * 80  | 0;
        data[pi+1] = d * 229 + vv * 120 | 0;
        data[pi+2] = d * 204 | 0;
        data[pi+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) / canvas.width  * N | 0;
    const my = (e.clientY - r.top)  / canvas.height * N | 0;
    if (prevMx >= 0) {
      const dx = (mx - prevMx) * 5, dy = (my - prevMy) * 5;
      for (let di = -1; di <= 1; di++)
        for (let dj = -1; dj <= 1; dj++) {
          const ci = U.clamp(mx+di,1,N-2), cj = U.clamp(my+dj,1,N-2);
          vx[idx(ci,cj)] += dx; vy[idx(ci,cj)] += dy;
          dens[idx(ci,cj)] += 0.8;
        }
    }
    prevMx = mx; prevMy = my;
  });
  canvas.addEventListener('mouseleave', () => { prevMx = -1; prevMy = -1; });

  document.getElementById('fluid-viscosity').addEventListener('input', e => viscosity = e.target.value * 0.000004);
  document.getElementById('fluid-diffusion').addEventListener('input', e => diffusion = e.target.value * 0.000001);
  document.getElementById('fluid-clear').addEventListener('click', init);

  function loop() { step(0.1); render(); requestAnimationFrame(loop); }
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));
  resize(); init(); loop();
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 21 — Langton's Ant (2D Turing Machine)
══════════════════════════════════════════════════════════════ */
const LangtonAnt = (() => {
  const canvas = document.getElementById('langton-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CELL = 4;
  let grid, ant, running = false, steps = 0, animId;

  function init() {
    const W = canvas.width, H = canvas.height;
    const cols = Math.floor(W/CELL), rows = Math.floor(H/CELL);
    grid = new Uint8Array(cols * rows);
    ant  = { c: cols/2|0, r: rows/2|0, dir: 0 }; // 0=N,1=E,2=S,3=W
    steps = 0;
    document.getElementById('langton-steps').textContent = 0;
  }

  const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];

  function tick(n) {
    const W = canvas.width, H = canvas.height;
    const cols = Math.floor(W/CELL), rows = Math.floor(H/CELL);
    for (let i = 0; i < n; i++) {
      const ci = ant.r * cols + ant.c;
      if (grid[ci]) {
        ant.dir = (ant.dir + 3) % 4; grid[ci] = 0;
      } else {
        ant.dir = (ant.dir + 1) % 4; grid[ci] = 1;
      }
      ant.r = ((ant.r + DR[ant.dir]) + rows) % rows;
      ant.c = ((ant.c + DC[ant.dir]) + cols) % cols;
      steps++;
    }
    document.getElementById('langton-steps').textContent = steps.toLocaleString();
  }

  function drawGrid() {
    const W = canvas.width, H = canvas.height;
    const cols = Math.floor(W/CELL), rows = Math.floor(H/CELL);
    ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, 0, W, H);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r*cols+c]) {
          ctx.fillStyle = `hsl(${(steps/50 + r*2)%360},70%,60%)`;
          ctx.fillRect(c*CELL, r*CELL, CELL-1, CELL-1);
        }
    // Ant
    ctx.fillStyle = '#f5a623';
    ctx.fillRect(ant.c*CELL, ant.r*CELL, CELL, CELL);
  }

  function loop() {
    if (running) tick(10);
    drawGrid();
    animId = requestAnimationFrame(loop);
  }

  document.getElementById('langton-play').addEventListener('click', () => {
    running = !running;
    document.getElementById('langton-play').textContent = running ? '⏸ Pause' : '▶ Run';
  });
  document.getElementById('langton-reset').addEventListener('click', () => { running = false; document.getElementById('langton-play').textContent = '▶ Run'; init(); });

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; init(); }
  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); loop(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 22 — Boids Flocking (Reynolds rules)
══════════════════════════════════════════════════════════════ */
const BoidsViz = (() => {
  const canvas = document.getElementById('boids-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COUNT = 120;
  let boids = [], cohesion = 0.4, separation = 0.6, alignment = 0.5;

  function makeBoid(W, H) {
    const a = Math.random() * Math.PI * 2;
    return { x: U.rand(0,W), y: U.rand(0,H), vx: Math.cos(a)*2, vy: Math.sin(a)*2 };
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    boids = Array.from({ length: COUNT }, () => makeBoid(canvas.width, canvas.height));
  }

  document.getElementById('boids-cohesion').addEventListener('input',   e => cohesion   = +e.target.value/100);
  document.getElementById('boids-separation').addEventListener('input', e => separation = +e.target.value/100);
  document.getElementById('boids-alignment').addEventListener('input',  e => alignment  = +e.target.value/100);

  const PERCEPTION = 60, SEP_DIST = 25;

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = 'rgba(10,11,15,0.25)'; ctx.fillRect(0, 0, W, H);

    boids.forEach(b => {
      let avgX=0,avgY=0,avgVx=0,avgVy=0,sepX=0,sepY=0,count=0;
      boids.forEach(o => {
        if (o===b) return;
        const d = U.dist(b.x,b.y,o.x,o.y);
        if (d < PERCEPTION) {
          avgX+=o.x; avgY+=o.y; avgVx+=o.vx; avgVy+=o.vy; count++;
          if (d < SEP_DIST) { sepX += b.x-o.x; sepY += b.y-o.y; }
        }
      });
      if (count > 0) {
        b.vx += (avgX/count - b.x) * 0.001 * cohesion;
        b.vy += (avgY/count - b.y) * 0.001 * cohesion;
        b.vx += avgVx/count * 0.05 * alignment;
        b.vy += avgVy/count * 0.05 * alignment;
      }
      b.vx += sepX * 0.04 * separation;
      b.vy += sepY * 0.04 * separation;
      // Speed clamp
      const spd = Math.hypot(b.vx, b.vy);
      if (spd > 3) { b.vx = b.vx/spd*3; b.vy = b.vy/spd*3; }
      if (spd < 0.5) { b.vx *= 1.05; b.vy *= 1.05; }
      b.x = (b.x + b.vx + W) % W;
      b.y = (b.y + b.vy + H) % H;
    });

    boids.forEach(b => {
      const a = Math.atan2(b.vy, b.vx);
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(-4,4); ctx.lineTo(-4,-4); ctx.closePath();
      ctx.fillStyle = `hsl(${180 + b.vx*20},80%,65%)`; ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); draw(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 23 — Cloth Simulation (Verlet integration)
══════════════════════════════════════════════════════════════ */
const ClothSim = (() => {
  const canvas = document.getElementById('cloth-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLS = 28, ROWS = 20, REST = 24, GRAVITY = 0.5, STIFF = 0.8;
  let pts = [], constraints = [], dragging = null;

  function build() {
    pts = []; constraints = [];
    const ox = (canvas.width  - (COLS-1)*REST) / 2;
    const oy = 40;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        pts.push({ x: ox+c*REST, y: oy+r*REST, px: ox+c*REST, py: oy+r*REST, pinned: r===0 });
      }
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (c < COLS-1) constraints.push([r*COLS+c, r*COLS+c+1, REST]);
        if (r < ROWS-1) constraints.push([r*COLS+c, (r+1)*COLS+c, REST]);
      }
  }

  function simulate() {
    const gravity = GRAVITY;
    pts.forEach(p => {
      if (p.pinned) return;
      const vx = (p.x - p.px) * 0.98, vy = (p.y - p.py) * 0.98;
      p.px = p.x; p.py = p.y;
      p.x  += vx; p.y  += vy + gravity;
      p.y   = Math.min(p.y, canvas.height - 2);
    });
    for (let iter = 0; iter < 5; iter++) {
      constraints.forEach(([ai, bi, len]) => {
        const a = pts[ai], b = pts[bi];
        const dx = b.x-a.x, dy = b.y-a.y;
        const d  = Math.hypot(dx, dy) || 0.001;
        const diff = (d - len) / d * 0.5 * STIFF;
        if (!a.pinned) { a.x += dx*diff; a.y += dy*diff; }
        if (!b.pinned) { b.x -= dx*diff; b.y -= dy*diff; }
      });
    }
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'var(--bg-surface)'; ctx.fillRect(0, 0, W, H);
    simulate();
    constraints.forEach(([ai, bi]) => {
      ctx.beginPath();
      ctx.moveTo(pts[ai].x, pts[ai].y);
      ctx.lineTo(pts[bi].x, pts[bi].y);
      ctx.strokeStyle = 'rgba(0,229,204,0.45)'; ctx.lineWidth = 1; ctx.stroke();
    });
    pts.forEach(p => {
      if (!p.pinned) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = '#f5a623'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX-r.left, my = e.clientY-r.top;
    dragging = pts.reduce((best, p, i) => {
      const d = U.dist(mx, my, p.x, p.y);
      return d < best.d ? { d, i } : best;
    }, { d: 40, i: -1 }).i;
    // Tear on right click
    if (e.button === 2) {
      constraints = constraints.filter(([ai,bi]) => {
        const a = pts[ai], b = pts[bi];
        return U.dist(mx,my,(a.x+b.x)/2,(a.y+b.y)/2) > 18;
      });
    }
  });
  canvas.addEventListener('mousemove', e => {
    if (dragging < 0) return;
    const r = canvas.getBoundingClientRect();
    pts[dragging].x = pts[dragging].px = e.clientX-r.left;
    pts[dragging].y = pts[dragging].py = e.clientY-r.top;
  });
  canvas.addEventListener('mouseup', () => dragging = -1);
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    build();
  }
  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); draw(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 24 — Voronoi Diagram (distance-based, live mouse)
══════════════════════════════════════════════════════════════ */
const VoronoiViz = (() => {
  const canvas = document.getElementById('voronoi-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let seeds = [], mx = -1, my = -1;
  const N_SEEDS = 20;

  function randomSeeds() {
    seeds = Array.from({ length: N_SEEDS }, () => ({
      x: U.rand(0.05, 0.95), y: U.rand(0.05, 0.95),
      hue: U.rand(140, 320)
    }));
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
    // Slightly repel nearest seed from cursor
    if (seeds.length) {
      const nearest = seeds.reduce((b, s) => {
        const d = U.dist(mx, my, s.x*canvas.width, s.y*canvas.height);
        return d < b.d ? { d, s } : b;
      }, { d: Infinity, s: null }).s;
      if (nearest) {
        const dx = nearest.x*canvas.width  - mx;
        const dy = nearest.y*canvas.height - my;
        const d  = Math.hypot(dx, dy) || 1;
        nearest.x += (dx/d) * 0.002;
        nearest.y += (dy/d) * 0.002;
        nearest.x  = U.clamp(nearest.x, 0.02, 0.98);
        nearest.y  = U.clamp(nearest.y, 0.02, 0.98);
      }
    }
  });

  // Drift seeds
  function drift() {
    seeds.forEach(s => {
      s.x += U.rand(-0.0004, 0.0004);
      s.y += U.rand(-0.0004, 0.0004);
      s.x  = U.clamp(s.x, 0.02, 0.98);
      s.y  = U.clamp(s.y, 0.02, 0.98);
    });
  }

  function render() {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) { requestAnimationFrame(render); return; }
    drift();
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        let minD = Infinity, minI = 0, sec = Infinity;
        seeds.forEach((s, i) => {
          const d = U.dist(px, py, s.x*W, s.y*H);
          if (d < minD) { sec = minD; minD = d; minI = i; }
          else if (d < sec) sec = d;
        });
        const edge = sec - minD < 3;
        const i    = (py * W + px) * 4;
        if (edge) { data[i]=10;data[i+1]=10;data[i+2]=15;data[i+3]=255; }
        else {
          const h = seeds[minI].hue, l = 15 + (1 - minD / (W*0.4)) * 30;
          const [r, g, b] = hslToRgb(h/360, 0.7, U.clamp(l, 8, 35)/100);
          data[i]=r; data[i+1]=g; data[i+2]=b; data[i+3]=255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    // Seed dots
    seeds.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x*W, s.y*H, 4, 0, Math.PI*2);
      ctx.fillStyle = '#f0f0f4'; ctx.fill();
    });
    requestAnimationFrame(render);
  }

  function hslToRgb(h, s, l) {
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    const hue2rgb = (p,q,t) => {
      if(t<0)t+=1; if(t>1)t-=1;
      if(t<1/6)return p+(q-p)*6*t;
      if(t<1/2)return q;
      if(t<2/3)return p+(q-p)*(2/3-t)*6;
      return p;
    };
    return [hue2rgb(p,q,h+1/3)*255|0, hue2rgb(p,q,h)*255|0, hue2rgb(p,q,h-1/3)*255|0];
  }

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); randomSeeds(); render(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 25 — Sorting Race (6 algorithms simultaneously)
══════════════════════════════════════════════════════════════ */
const SortRace = (() => {
  const container = document.getElementById('sortrace-grid');
  if (!container) return;

  const ALGOS = [
    { name: 'Bubble Sort',    color: '#ff4060', fn: bubbleSort   },
    { name: 'Insertion Sort', color: '#f5a623', fn: insertionSort },
    { name: 'Selection Sort', color: '#7c5cfc', fn: selectionSort },
    { name: 'Quick Sort',     color: '#00e5cc', fn: quickSortR   },
    { name: 'Merge Sort',     color: '#4af5b8', fn: mergeSortR   },
    { name: 'Shell Sort',     color: '#fc5c7d', fn: shellSort    },
  ];

  const canvases = [], queues = [], states = [];
  let N = 60, racing = false;

  ALGOS.forEach((algo, i) => {
    const panel = document.createElement('div');
    panel.className = 'sortrace-panel';
    panel.innerHTML = `
      <div class="sortrace-title">
        <span style="color:${algo.color}">${algo.name}</span>
        <span id="sr-ops-${i}" class="mono" style="font-size:10px;color:var(--text-muted)">0 ops</span>
      </div>`;
    const cv = document.createElement('canvas');
    cv.className = 'sortrace-canvas';
    panel.appendChild(cv);
    container.appendChild(panel);
    canvases.push(cv);
    queues.push([]);
    states.push({ arr: [], ops: 0, done: false });
  });

  function* bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length-i-1; j++) {
        if (arr[j] > arr[j+1]) { [arr[j],arr[j+1]] = [arr[j+1],arr[j]]; yield [j,j+1]; }
        else yield [j,j+1];
      }
  }
  function* insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0 && arr[j-1] > arr[j]) { [arr[j-1],arr[j]] = [arr[j],arr[j-1]]; j--; yield [j,j+1]; }
      yield [i,i];
    }
  }
  function* selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      let min = i;
      for (let j = i+1; j < arr.length; j++) { yield [j,min]; if (arr[j] < arr[min]) min = j; }
      [arr[i],arr[min]] = [arr[min],arr[i]]; yield [i,min];
    }
  }
  function* quickSortR(arr, lo=0, hi=arr.length-1) {
    if (lo >= hi) return;
    const p = arr[hi]; let i = lo;
    for (let j = lo; j < hi; j++) {
      yield [j,hi];
      if (arr[j] <= p) { [arr[i],arr[j]]=[arr[j],arr[i]]; i++; }
    }
    [arr[i],arr[hi]]=[arr[hi],arr[i]]; yield [i,hi];
    yield* quickSortR(arr,lo,i-1); yield* quickSortR(arr,i+1,hi);
  }
  function* mergeSortR(arr, lo=0, hi=arr.length-1) {
    if (lo >= hi) return;
    const mid = (lo+hi)>>1;
    yield* mergeSortR(arr,lo,mid); yield* mergeSortR(arr,mid+1,hi);
    const tmp = arr.slice(lo, hi+1).sort((a,b)=>a-b);
    for (let i = lo; i <= hi; i++) { arr[i] = tmp[i-lo]; yield [lo,hi]; }
  }
  function* shellSort(arr) {
    let gap = arr.length >> 1;
    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        let j = i;
        while (j >= gap && arr[j-gap] > arr[j]) { [arr[j-gap],arr[j]]=[arr[j],arr[j-gap]]; j-=gap; yield [j,j+gap]; }
      }
      gap >>= 1;
    }
  }

  function setup() {
    const base = Array.from({ length: N }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    ALGOS.forEach((algo, i) => {
      const arr = [...base];
      states[i] = { arr, gen: algo.fn(arr), ops: 0, done: false, highlight: [-1,-1] };
      document.getElementById(`sr-ops-${i}`).textContent = '0 ops';
    });
  }

  function drawBar(cv, state) {
    const W = cv.width = cv.offsetWidth, H = cv.height = cv.offsetHeight;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0,0,W,H);
    const bw = W / state.arr.length;
    state.arr.forEach((v, i) => {
      const bh = (v / N) * H;
      const hl = state.highlight.includes(i);
      ctx.fillStyle = hl ? ALGOS[canvases.indexOf(cv)].color : 'rgba(70,71,89,0.7)';
      ctx.fillRect(i*bw+0.5, H-bh, bw-1, bh);
    });
  }

  function tick() {
    if (!racing) return;
    let allDone = true;
    ALGOS.forEach((_, i) => {
      if (states[i].done) return;
      allDone = false;
      for (let k = 0; k < 4; k++) {
        const r = states[i].gen.next();
        if (r.done) { states[i].done = true; states[i].highlight = [-1,-1]; break; }
        else { states[i].highlight = r.value; states[i].ops++; }
      }
      document.getElementById(`sr-ops-${i}`).textContent = states[i].ops.toLocaleString() + ' ops';
      drawBar(canvases[i], states[i]);
    });
    if (allDone) racing = false;
    requestAnimationFrame(tick);
  }

  document.getElementById('sortrace-start').addEventListener('click', () => {
    setup(); racing = true; requestAnimationFrame(tick);
  });
  document.getElementById('sortrace-reset').addEventListener('click', () => { racing = false; setup(); canvases.forEach((cv,i)=>drawBar(cv,states[i])); });

  setup();
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); canvases.forEach((cv,i)=>drawBar(cv,states[i])); } }, { threshold: 0.1 });
  obs.observe(container);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 26 — L-Systems (Lindenmayer)
══════════════════════════════════════════════════════════════ */
const LSystems = (() => {
  const canvas = document.getElementById('lsystem-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PRESETS = {
    tree: {
      axiom: 'X', rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
      angle: 25, len: 8, depth: 5, color: '#00e5cc'
    },
    sierpinski: {
      axiom: 'F-G-G', rules: { F: 'F-G+F+G-F', G: 'GG' },
      angle: 120, len: 6, depth: 6, color: '#7c5cfc'
    },
    koch: {
      axiom: 'F', rules: { F: 'F+F-F-F+F' },
      angle: 90, len: 4, depth: 5, color: '#f5a623'
    },
    fern: {
      axiom: 'X', rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
      angle: 22.5, len: 7, depth: 5, color: '#4af5b8'
    }
  };

  let current = 'tree', depth = 5;

  function expand(preset) {
    let str = preset.axiom;
    for (let i = 0; i < depth; i++) {
      str = str.split('').map(c => preset.rules[c] || c).join('');
      if (str.length > 300000) break;
    }
    return str;
  }

  function render(preset) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);

    const str = expand(preset);
    document.getElementById('ls-symbols').textContent = str.length.toLocaleString();
    document.getElementById('ls-iter').textContent    = depth;

    const stack = [], a = preset.angle * Math.PI / 180;
    let x = W/2, y = H*0.95, dir = -Math.PI/2, len = preset.len;
    // Scale down for higher depths
    const scale = Math.max(0.3, 1 - depth * 0.12);
    const drawLen = len * scale;

    ctx.strokeStyle = preset.color; ctx.lineWidth = scale * 1.2;
    ctx.beginPath();
    for (const c of str) {
      if (c==='F'||c==='G') {
        const nx = x + Math.cos(dir)*drawLen, ny = y + Math.sin(dir)*drawLen;
        ctx.moveTo(x, y); ctx.lineTo(nx, ny);
        x = nx; y = ny;
      } else if (c==='+') dir += a;
      else if (c==='-') dir -= a;
      else if (c==='[') stack.push({ x, y, dir });
      else if (c===']' && stack.length) ({ x, y, dir } = stack.pop());
    }
    ctx.stroke();
  }

  function go(name) {
    current = name;
    document.querySelectorAll('#lsystem .ctrl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`ls-${name}`).classList.add('active');
    render(PRESETS[name]);
  }

  document.getElementById('ls-tree').addEventListener('click',      () => go('tree'));
  document.getElementById('ls-sierpinski').addEventListener('click', () => go('sierpinski'));
  document.getElementById('ls-koch').addEventListener('click',       () => go('koch'));
  document.getElementById('ls-fern').addEventListener('click',       () => go('fern'));
  document.getElementById('ls-depth').addEventListener('input', e => {
    depth = +e.target.value;
    document.getElementById('ls-iter').textContent = depth;
    render(PRESETS[current]);
  });

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; render(PRESETS[current]); }
  window.addEventListener('resize', U.debounce(resize, 300));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 27 — Marching Squares (Metaballs)
══════════════════════════════════════════════════════════════ */
const MarchingSquares = (() => {
  const canvas = document.getElementById('marching-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const BALLS = 6;
  let balls = [], t = 0;
  const ISO = 1.5;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    balls = Array.from({ length: BALLS }, () => ({
      x: U.rand(0.2, 0.8), y: U.rand(0.2, 0.8),
      vx: U.rand(-0.003, 0.003), vy: U.rand(-0.003, 0.003),
      r: U.rand(0.12, 0.22)
    }));
  }

  function field(x, y) {
    return balls.reduce((s, b) => {
      const dx = x - b.x, dy = y - b.y;
      return s + b.r * b.r / (dx*dx + dy*dy + 0.0001);
    }, 0);
  }

  // Marching squares lookup (simplified — linear interp on edges)
  function marchCell(x0, y0, x1, y1, v00, v10, v01, v11) {
    const idx = (v00>ISO?8:0)|(v10>ISO?4:0)|(v11>ISO?2:0)|(v01>ISO?1:0);
    if (idx===0||idx===15) return [];
    function lerp_edge(va, vb, xa, ya, xb, yb) {
      const t = (ISO-va)/(vb-va+0.0001);
      return [xa+t*(xb-xa), ya+t*(yb-ya)];
    }
    const T=lerp_edge(v00,v10,x0,y0,x1,y0), R=lerp_edge(v10,v11,x1,y0,x1,y1);
    const B=lerp_edge(v01,v11,x0,y1,x1,y1), L=lerp_edge(v00,v01,x0,y0,x0,y1);
    const segs = {
      1:[L,B],2:[B,R],3:[L,R],4:[T,R],5:[[T,L],[B,R]],6:[T,B],7:[T,L],
      8:[T,L],9:[T,B],10:[[T,R],[L,B]],11:[T,R],12:[L,R],13:[L,B],14:[B,R],
    };
    const s = segs[idx]; if (!s) return [];
    if (s[0] && Array.isArray(s[0][0])) return s; // ambiguous
    return [s];
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);

    // Move balls
    t += 0.01;
    balls.forEach(b => {
      b.x += b.vx + Math.sin(t * 1.3 + b.r*10) * 0.001;
      b.y += b.vy + Math.cos(t * 0.9 + b.r*7)  * 0.001;
      if (b.x<0.05||b.x>0.95) b.vx*=-1;
      if (b.y<0.05||b.y>0.95) b.vy*=-1;
    });

    const GRID = 40;
    const cw = W / GRID, ch = H / GRID;

    // Fill inside
    ctx.beginPath();
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const x0=gx/GRID, y0=gy/GRID, x1=(gx+1)/GRID, y1=(gy+1)/GRID;
        const v00=field(x0,y0), v10=field(x1,y0), v01=field(x0,y1), v11=field(x1,y1);
        const segs = marchCell(x0,y0,x1,y1,v00,v10,v01,v11);
        segs.forEach(([a,b]) => {
          ctx.moveTo(a[0]*W, a[1]*H);
          ctx.lineTo(b[0]*W, b[1]*H);
        });
        // Fill
        if (v00>ISO&&v10>ISO&&v01>ISO&&v11>ISO) {
          ctx.fillStyle = 'rgba(0,229,204,0.12)';
          ctx.fillRect(gx*cw, gy*ch, cw, ch);
        }
      }
    }
    ctx.strokeStyle = '#00e5cc'; ctx.lineWidth = 1.8; ctx.stroke();

    // Ball centres
    balls.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x*W, b.y*H, 5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,229,204,0.4)'; ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); draw(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();

/* ══════════════════════════════════════════════════════════════
   ALGORITHM 28 — RSA Key Visualizer
══════════════════════════════════════════════════════════════ */
const RSAViz = (() => {
  const canvas = document.getElementById('rsa-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }
  function primes(lo, hi) { return Array.from({ length: hi-lo }, (_, i) => lo+i).filter(isPrime); }
  function gcd(a, b)   { return b ? gcd(b, a%b) : a; }
  function modpow(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp  = BigInt(exp);
    mod  = BigInt(mod);
    while (exp > 0n) {
      if (exp % 2n === 1n) result = result * base % mod;
      exp = exp >> 1n; base = base * base % mod;
    }
    return Number(result);
  }
  function modInverse(e, phi) {
    let [old_r, r] = [e, phi], [old_s, s] = [1, 0];
    while (r !== 0) { const q = Math.floor(old_r/r); [old_r,r]=[r,old_r-q*r]; [old_s,s]=[s,old_s-q*s]; }
    return ((old_s % phi) + phi) % phi;
  }

  let p, q, n, phi, e, d;

  function generate() {
    const pool = primes(50, 130);
    p = pool[Math.random()*pool.length|0];
    do { q = pool[Math.random()*pool.length|0]; } while (q === p);
    n = p * q; phi = (p-1)*(q-1);
    e = [3,5,7,11,13,17].find(x => gcd(x, phi) === 1 && x < phi) || 65537;
    d = modInverse(e, phi);

    document.getElementById('rsa-p').textContent   = p;
    document.getElementById('rsa-q').textContent   = q;
    document.getElementById('rsa-n').textContent   = n;
    document.getElementById('rsa-phi').textContent = phi;
    document.getElementById('rsa-e').textContent   = e;
    document.getElementById('rsa-d').textContent   = d;
    encryptMsg();
    renderViz();
  }

  function encryptMsg() {
    if (!n) return;
    const m = +document.getElementById('rsa-msg').value;
    if (m >= n) { document.getElementById('rsa-enc').textContent = 'msg ≥ n!'; return; }
    const c = modpow(m, e, n);
    const dec = modpow(c, d, n);
    document.getElementById('rsa-enc').textContent = c;
    document.getElementById('rsa-dec').textContent = dec;
    renderViz();
  }

  function renderViz() {
    if (!n) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, 0, W, H);

    // Draw factor grid: n cells coloured by residues
    const side = Math.min(Math.sqrt(n)|0, 60);
    const cw = W / side, ch = (H - 80) / side;

    for (let i = 0; i < side; i++) {
      for (let j = 0; j < side; j++) {
        const v = (i * side + j + 1) % n;
        const inP = v % p === 0, inQ = v % q === 0;
        ctx.fillStyle = inP && inQ ? '#00e5cc'
          : inP ? 'rgba(0,229,204,0.4)'
          : inQ ? 'rgba(124,92,252,0.5)'
          : 'rgba(255,255,255,0.03)';
        ctx.fillRect(j*cw+0.5, i*ch+0.5, cw-1, ch-1);
      }
    }

    // Legend
    const labels = [
      { color:'#00e5cc',      text:`p=${p} & q=${q}` },
      { color:'rgba(0,229,204,0.5)', text:`mult of p=${p}` },
      { color:'rgba(124,92,252,0.7)',text:`mult of q=${q}` },
    ];
    labels.forEach(({ color, text }, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(16, H - 70 + i*22, 14, 14);
      ctx.fillStyle = '#8b8c9e';
      ctx.font = '12px JetBrains Mono'; ctx.textAlign = 'left';
      ctx.fillText(text, 36, H - 60 + i*22);
    });
  }

  document.getElementById('rsa-gen').addEventListener('click', generate);
  document.getElementById('rsa-msg').addEventListener('input', encryptMsg);

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; if (n) renderViz(); }
  window.addEventListener('resize', U.debounce(resize, 200));
  const obs = new IntersectionObserver(en => { if (en[0].isIntersecting) { obs.disconnect(); resize(); generate(); } }, { threshold: 0.1 });
  obs.observe(canvas);
})();
