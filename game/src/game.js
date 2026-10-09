// What Must Be — client: rendering, animation, explanation overlays, input.
(function () {
'use strict';
const E = window.Engine, LV = window.LEVELS, T = E.T;
const $ = id => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');
const stage = $('stage'), tip = $('tip'), menu = $('menu');

const LAWS = {
  I: { tag: 'I · Already', law: 'Whatever you can no longer prevent has already happened.',
    sub: 'A runner, shuttle or gate runs in real time only while you could still interfere with it in time. The instant you could not, it completes. A machine you can never reach is already at every point of its cycle at once.' },
  II: { tag: 'II · Needed', law: 'Nothing exists that makes no difference.',
    sub: 'A veil is present only if, without it, some eye would see differently. Give its work to anything else and it is gone; take that thing away and it is back.' },
  III: { tag: 'III · Permission', law: 'A change may reach the eyes only while you could still stop it.',
    sub: 'Both laws at once. When something becomes fate, every veil that could change what its arrival does to the eyes condenses in its way. A wall can exist just to keep you from changing fate.' },
};

// ───────────────────────── persistent progress (best effort: sandboxed iframes have no storage)
const store = {
  get(k, d) { try { const v = window.localStorage.getItem('wmb.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { window.localStorage.setItem('wmb.' + k, JSON.stringify(v)); } catch (e) { /* no storage here */ } },
};
const done = new Set(store.get('done', []));

// ───────────────────────── game state
let LI = 0, L = null, S = null, S0 = null, hist = [], info = null, startFx = [];
let trails = [], trailHist = [], startTrails = [];
let anim = null;            // { from, to, t0, dur }
let fxs = [];               // running effects
let hoverCell = -1, tipPinned = false;
let lastInputAt = 0, wonShown = false, focused = false;
const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const now = () => performance.now();
const ambient = t => reduceMotion ? 0 : t;

function load(i) {
  LI = (i + LV.length) % LV.length;
  const def = Object.assign({ name: LV[LI].title }, LV[LI]);
  const r = E.start(def);
  L = r.L; S = r.s; S0 = E.clone(S); hist = []; anim = null; fxs = []; wonShown = false;
  startFx = r.fx;
  startTrails = fateTrails(r.fx); trails = startTrails.slice(); trailHist = [];
  layout();
  analyze();
  addFx(r.fx, null, S, 350);
  $('win').classList.remove('on');
  const lv = LV[LI];
  const chIdx = LV.filter(l => l.ch === lv.ch).indexOf(lv) + 1;
  $('lvl').innerHTML = '<span class="num">' + lv.ch + '·' + chIdx + '</span>' + lv.title;
  const law = LAWS[lv.ch];
  $('law').innerHTML = '<span class="tag">' + law.tag + '</span>' + law.law;
  $('text').textContent = lv.text;
  store.set('cur', LI);
  hideTip();
  const first = LV.findIndex(l => l.ch === lv.ch) === LI;
  if (first && !seenCard.has(lv.ch)) showCard(lv.ch);
}
const seenCard = new Set();
function showCard(ch) {
  seenCard.add(ch);
  const c = $('card'), law = LAWS[ch];
  c.innerHTML = '<div class="in"><div class="h">' + law.tag + '</div><div class="t">' + law.law + '</div><div class="s">' + law.sub + '</div><div class="k">PRESS ANY KEY</div></div>';
  c.classList.add('on');
}
function hideCard() { $('card').classList.remove('on'); replayStart(); }
function replayStart() { if (!hist.length && startFx.length) { fxs = []; addFx(startFx, null, S, 250); } }
$('card').addEventListener('click', hideCard);

function analyze() {
  info = E.analyze(L, S);
  const A = info.A;
  // reach for display (body or crate)
  info.reach = c => Math.min(A.dB[c], A.dC ? A.dC[c] : 1e9);
  // gate leashes: cells from which you could still reach the gate in time
  info.leash = S.gates.map(g => g.closed ? null : leashOf(g));
  // which eyes each present veil is responsible for
  info.because = info.ghosts.map(gh => ({ i: gh.i, eyes: gh.lit ^ info.beams.lit, segs: gh.segs }));
}

function leashOf(g) {
  // reverse BFS from the gate over cells the player could walk
  const O = E.buildOcc(L, S);
  const pressed = E.platesPressed(L, S, O.occ);
  const dist = new Int32Array(L.N).fill(1e9);
  dist[g.c] = 0; const q = [g.c];
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    for (let d = 0; d < 4; d++) {
      const p = E.step(L, c, d); // p is a neighbour; the player would move p -> c in direction (d+2)%4
      if (p < 0 || dist[p] <= dist[c] + 1) continue;
      const t = L.tile[p];
      if (t === T.STONE || t === T.TRACK || L.fixed[p] || E.isPitOpen(L, S, p)) continue;
      if (E.doorClosed(L, p, pressed, O.occ)) continue;
      const md = (d + 2) % 4;
      if (L.tile[c] === T.ONEWAY && L.tdir[c] !== md) continue;
      if (t === T.ONEWAY && L.tdir[p] !== md) continue;
      if (t === T.GATE) { const gg = E.gateAt(S, p); if (gg && gg.closed) continue; }
      dist[p] = dist[c] + 1; q.push(p);
    }
  }
  const set = new Uint8Array(L.N);
  for (let c = 0; c < L.N; c++) if (dist[c] <= g.n) set[c] = 1;
  return { dist, set };
}

// ───────────────────────── turns
function act(d) {
  if (!L || menu.classList.contains('on')) return;
  if ($('card').classList.contains('on')) { hideCard(); return; }
  if (S.won) { if (d !== -2) next(); return; }
  finishAnim();
  const r = E.turn(L, S, d);
  if (!r.ok) { bump(d); return; }
  hist.push(S); trailHist.push(trails);
  trails = trails.concat(fateTrails(r.fx));
  const from = S;
  S = r.state;
  analyze();
  anim = { from, to: S, t0: now(), dur: 115 };
  addFx(r.fx, from, S, 0);
  lastInputAt = now();
  if (S.won) onWin();
  refreshTip();
}
function undo() {
  if (!hist.length) return;
  finishAnim(); fxs = [];
  S = hist.pop(); trails = trailHist.pop() || []; analyze(); $('win').classList.remove('on'); wonShown = false; refreshTip();
}
function restart() {
  if (!L) return;
  finishAnim(); fxs = [];
  if (hist.length) { hist.push(S); trailHist.push(trails); }
  S = E.clone(S0); trails = startTrails.slice(); analyze(); $('win').classList.remove('on'); wonShown = false;
  addFx(startFx, null, S, 0);
  refreshTip();
}
function next() { load(LI + 1); }
function finishAnim() { anim = null; }
let bumpAt = 0, bumpDir = 0;
function bump(d) { bumpAt = now(); bumpDir = d; }
function onWin() {
  if (wonShown) return; wonShown = true;
  done.add(LI); store.set('done', Array.from(done));
  setTimeout(() => { if (S.won) $('win').classList.add('on'); }, 380);
}

function fateTrails(list) { return list.filter(f => f.k === 'fate' && f.path.length).map(f => [f.from].concat(f.path)); }
// ───────────────────────── effects
function addFx(list, from, to, delay) {
  const t0 = now() + (delay || 0);
  for (const f of list) {
    if (f.k === 'fate') fxs.push({ k: 'fate', i: f.i, path: [f.from].concat(f.path), st: f.st, t0, dur: 720 });
    else if (f.k === 'condense' || f.k === 'dissolve') fxs.push({ k: f.k, i: f.i, t0, dur: 420 });
    else if (f.k === 'smear' || f.k === 'collapse') fxs.push({ k: f.k, i: f.i, t0, dur: 600, track: f.k === 'collapse' && from ? from.shuttles[f.i].track : null });
    else if (f.k === 'gate') fxs.push({ k: 'gate', j: f.j, t0, dur: 520 });
    else if (f.k === 'fill') fxs.push({ k: 'fill', at: f.to, from: f.from, t0, dur: 420 });
    else if (f.k === 'sink') fxs.push({ k: 'sink', at: f.at, t0, dur: 420 });
  }
}

// ───────────────────────── layout
let CS = 32, OX = 0, OY = 0, DPR = 1, CW = 0, CH = 0;
let staticLayer = null, grainLayer = null, lineInfo = null;
function layout() {
  if (!L) return;
  const w = Math.max(280, stage.clientWidth || $('app').clientWidth - 20 || 700);
  // inside an embedded widget the frame grows to fit us, so never size from the window height there
  let embedded = false; try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  const maxH = embedded ? Math.min(560, Math.max(240, w * 0.78)) : Math.max(260, Math.min(560, (window.innerHeight || 700) - 230));
  CS = Math.floor(Math.min(w / (L.W - 0.6), maxH / (L.H - 0.6), 46));
  CS = Math.max(CS, 12);
  CW = Math.round((L.W - 0.6) * CS); CH = Math.round((L.H - 0.6) * CS);
  OX = -0.3 * CS; OY = -0.3 * CS;
  DPR = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(CW * DPR); cv.height = Math.round(CH * DPR);
  cv.style.height = CH + 'px';
  cv.style.width = CW + 'px';
  cv.style.margin = '0 auto';
  buildStatic();
}
const cx = c => OX + (c % L.W + 0.5) * CS, cy = c => OY + ((c / L.W | 0) + 0.5) * CS;
const X0 = c => OX + (c % L.W) * CS, Y0 = c => OY + (c / L.W | 0) * CS;
const inb = (x, y) => x >= 0 && y >= 0 && x < L.W && y < L.H;
const idx = (x, y) => y * L.W + x;

function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function computeLines() {
  // which cells lie on a runner's or shuttle's line, and in which orientation (for drawing rails)
  const ori = new Int8Array(L.N).fill(-1); // 0 vertical, 1 horizontal
  const mark = (c, d, both) => {
    const dirs = both ? [d, (d + 2) % 4] : [d];
    ori[c] = d % 2;
    for (const dd of dirs) {
      let p = c;
      for (let k = 0; k < L.N; k++) {
        const n = E.step(L, p, dd);
        if (n < 0) break;
        const t = L.tile[n];
        if (t === T.STONE || L.fixed[n]) break;
        if (t === T.ONEWAY && L.tdir[n] !== dd) break;
        ori[n] = dd % 2; p = n;
        if (t === T.PIT) break;
      }
    }
  };
  S0.runners.forEach(r => mark(r.c, r.d, false));
  S0.shuttles.forEach(q => mark(q.c, q.d, true));
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.TRACK && ori[c] < 0) {
    const x = c % L.W, y = c / L.W | 0;
    const h = (inb(x - 1, y) && L.tile[idx(x - 1, y)] === T.TRACK) || (inb(x + 1, y) && L.tile[idx(x + 1, y)] === T.TRACK);
    ori[c] = h ? 1 : 0;
  }
  return ori;
}

function buildStatic() {
  lineInfo = computeLines();
  staticLayer = document.createElement('canvas');
  staticLayer.width = cv.width; staticLayer.height = cv.height;
  const g = staticLayer.getContext('2d');
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  // paper
  const bg = g.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, '#0b1020'); bg.addColorStop(1, '#080b15');
  g.fillStyle = bg; g.fillRect(0, 0, CW, CH);
  const isStone = c => L.tile[c] === T.STONE;
  // floor
  for (let c = 0; c < L.N; c++) {
    if (isStone(c)) continue;
    const x = X0(c), y = Y0(c);
    g.fillStyle = '#10172b'; g.fillRect(x, y, CS + 0.5, CS + 0.5);
  }
  // fine engraved grid on floor
  g.strokeStyle = 'rgba(110,140,215,0.07)'; g.lineWidth = 1;
  for (let c = 0; c < L.N; c++) {
    if (isStone(c)) continue;
    const x = X0(c), y = Y0(c);
    g.strokeRect(x + 0.5, y + 0.5, CS - 1, CS - 1);
    g.fillStyle = 'rgba(150,175,240,0.18)';
    g.fillRect(x + CS / 2 - 0.75, y + CS / 2 - 0.75, 1.5, 1.5);
  }
  // stone: ink mass + hatching (clipped), cross-hatched deep inside
  const stonePath = new Path2D();
  for (let c = 0; c < L.N; c++) if (isStone(c)) stonePath.rect(X0(c), Y0(c), CS + 0.6, CS + 0.6);
  g.save(); g.clip(stonePath);
  g.fillStyle = '#05070e'; g.fillRect(0, 0, CW, CH);
  const sp = Math.max(3.2, CS / 7.5);
  g.strokeStyle = 'rgba(88,112,180,0.30)'; g.lineWidth = 0.8;
  g.beginPath();
  for (let k = -CH; k < CW + CH; k += sp) { g.moveTo(k, 0); g.lineTo(k + CH, CH); }
  g.stroke();
  // deep stone: cross hatch
  const deep = new Path2D();
  for (let c = 0; c < L.N; c++) {
    if (!isStone(c)) continue;
    const x = c % L.W, y = c / L.W | 0;
    let allStone = true;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!inb(x + dx, y + dy)) continue;
      if (!isStone(idx(x + dx, y + dy))) allStone = false;
    }
    if (allStone) deep.rect(X0(c), Y0(c), CS + 0.6, CS + 0.6);
  }
  g.clip(deep);
  g.strokeStyle = 'rgba(70,90,150,0.22)';
  g.beginPath();
  for (let k = -CH; k < CW + CH; k += sp * 1.15) { g.moveTo(k + CH, 0); g.lineTo(k, CH); }
  g.stroke();
  g.restore();
  // engraved edges between stone and open ground, with soft shadow cast onto the floor
  for (let c = 0; c < L.N; c++) {
    if (isStone(c)) continue;
    const x = c % L.W, y = c / L.W | 0;
    const X = X0(c), Y = Y0(c);
    const sides = [[0, -1, X, Y, X + CS, Y], [1, 0, X + CS, Y, X + CS, Y + CS], [0, 1, X, Y + CS, X + CS, Y + CS], [-1, 0, X, Y, X, Y + CS]];
    for (const [dx, dy, x1, y1, x2, y2] of sides) {
      const nx = x + dx, ny = y + dy;
      if (!inb(nx, ny) || !isStone(idx(nx, ny))) continue;
      const sh = g.createLinearGradient(x1, y1, x1 - dy * CS * 0.28 * -1 - dx * CS * 0.28, y1 - dx * CS * 0.28 * -1 - dy * CS * 0.28);
      sh.addColorStop(0, 'rgba(0,0,0,0.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = sh;
      if (dx === 0) g.fillRect(X, dy < 0 ? Y : Y + CS * 0.72, CS, CS * 0.28);
      else g.fillRect(dx < 0 ? X : X + CS * 0.72, Y, CS * 0.28, CS);
      g.strokeStyle = 'rgba(160,184,245,0.55)'; g.lineWidth = 1.1;
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    }
  }
  // rails
  for (let c = 0; c < L.N; c++) {
    const t = L.tile[c];
    const onLine = lineInfo[c] >= 0 && t !== T.STONE;
    if (t !== T.TRACK && !onLine) continue;
    drawRail(g, c, lineInfo[c] < 0 ? 1 : lineInfo[c], t === T.TRACK);
  }
  // pits (open look; filled plugs are drawn live)
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PIT) {
    const x = cx(c), y = cy(c), r = CS * 0.42;
    const gr = g.createRadialGradient(x, y, r * 0.1, x, y, r);
    gr.addColorStop(0, '#000'); gr.addColorStop(1, '#0b1124');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = 'rgba(140,165,235,0.35)'; g.lineWidth = 1;
    for (let k = 1; k <= 3; k++) { g.beginPath(); g.arc(x, y, r * (0.35 + 0.2 * k), 0, 7); g.stroke(); }
  }
  // one-way tiles
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.ONEWAY) {
    const d = L.tdir[c], x = cx(c), y = cy(c);
    g.save(); g.translate(x, y); g.rotate([-Math.PI / 2, 0, Math.PI / 2, Math.PI][d]);
    g.strokeStyle = 'rgba(200,215,255,0.55)'; g.lineWidth = 1.4;
    for (let k = -1; k <= 1; k++) {
      g.beginPath(); g.moveTo(k * CS * 0.2 - CS * 0.08, -CS * 0.18); g.lineTo(k * CS * 0.2 + CS * 0.08, 0); g.lineTo(k * CS * 0.2 - CS * 0.08, CS * 0.18); g.stroke();
    }
    g.restore();
  }
  // plates (base)
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PLATE) {
    const x = X0(c), y = Y0(c), m = CS * 0.18;
    g.strokeStyle = 'rgba(210,180,120,0.5)'; g.lineWidth = 1.2;
    g.strokeRect(x + m, y + m, CS - 2 * m, CS - 2 * m);
    g.strokeStyle = 'rgba(210,180,120,0.25)';
    g.strokeRect(x + m + 3, y + m + 3, CS - 2 * m - 6, CS - 2 * m - 6);
  }
  // mirrors and lamp housings
  for (let c = 0; c < L.N; c++) {
    const f = L.fixed[c]; if (!f) continue;
    if (f.k === 'mirror') drawMirror(g, c, f.m);
    if (f.k === 'emit') drawLamp(g, c, f.d);
  }
  // engraved plate frame with a tick per cell
  g.strokeStyle = 'rgba(170,190,240,0.30)'; g.lineWidth = 1;
  g.strokeRect(3.5, 3.5, CW - 7, CH - 7);
  g.strokeStyle = 'rgba(170,190,240,0.14)'; g.strokeRect(6.5, 6.5, CW - 13, CH - 13);
  g.beginPath();
  for (let x = 0; x <= L.W; x++) { const px = OX + x * CS; if (px > 6 && px < CW - 6) { g.moveTo(px, 3.5); g.lineTo(px, 6.5); g.moveTo(px, CH - 3.5); g.lineTo(px, CH - 6.5); } }
  for (let y = 0; y <= L.H; y++) { const py = OY + y * CS; if (py > 6 && py < CH - 6) { g.moveTo(3.5, py); g.lineTo(6.5, py); g.moveTo(CW - 3.5, py); g.lineTo(CW - 6.5, py); } }
  g.stroke();
  // grain + vignette overlay
  grainLayer = document.createElement('canvas');
  grainLayer.width = cv.width; grainLayer.height = cv.height;
  const h = grainLayer.getContext('2d');
  h.setTransform(DPR, 0, 0, DPR, 0, 0);
  const R = rnd(1234 + LI);
  for (let k = 0; k < CW * CH / 26; k++) {
    h.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.05)';
    h.fillRect(R() * CW, R() * CH, 1, 1);
  }
  const vg = h.createRadialGradient(CW / 2, CH / 2, Math.min(CW, CH) * 0.35, CW / 2, CH / 2, Math.max(CW, CH) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.38)');
  h.fillStyle = vg; h.fillRect(0, 0, CW, CH);
}

function drawRail(g, c, o, isTrack) {
  const X = X0(c), Y = Y0(c);
  g.save();
  if (isTrack) { g.fillStyle = 'rgba(4,6,12,0.55)'; g.fillRect(X, Y, CS, CS); }
  g.translate(X + CS / 2, Y + CS / 2);
  if (o === 0) g.rotate(Math.PI / 2);
  const a = isTrack ? 0.55 : 0.28;
  g.strokeStyle = 'rgba(190,160,110,' + a * 0.8 + ')'; g.lineWidth = 1.2;
  // sleepers
  for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * CS / 3, -CS * 0.26); g.lineTo(k * CS / 3, CS * 0.26); g.stroke(); }
  g.strokeStyle = 'rgba(220,200,160,' + a + ')'; g.lineWidth = 1.3;
  g.beginPath(); g.moveTo(-CS / 2, -CS * 0.17); g.lineTo(CS / 2, -CS * 0.17); g.moveTo(-CS / 2, CS * 0.17); g.lineTo(CS / 2, CS * 0.17); g.stroke();
  g.restore();
}
function drawMirror(g, c, m) {
  const X = X0(c), Y = Y0(c), p = CS * 0.12;
  g.save();
  g.fillStyle = '#0c1222'; g.fillRect(X + 1, Y + 1, CS - 2, CS - 2);
  g.strokeStyle = 'rgba(190,210,255,0.35)'; g.lineWidth = 1; g.strokeRect(X + 2.5, Y + 2.5, CS - 5, CS - 5);
  g.lineCap = 'round';
  g.strokeStyle = '#e9f1ff'; g.lineWidth = Math.max(2, CS * 0.09);
  g.beginPath();
  if (m === '/') { g.moveTo(X + p, Y + CS - p); g.lineTo(X + CS - p, Y + p); } else { g.moveTo(X + p, Y + p); g.lineTo(X + CS - p, Y + CS - p); }
  g.stroke();
  g.restore();
}
function drawLamp(g, c, d) {
  const x = cx(c), y = cy(c);
  g.save(); g.translate(x, y); g.rotate([-Math.PI / 2, 0, Math.PI / 2, Math.PI][d]);
  g.fillStyle = '#1a1408'; g.strokeStyle = 'rgba(230,190,110,0.8)'; g.lineWidth = 1.3;
  roundRect(g, -CS * 0.36, -CS * 0.3, CS * 0.6, CS * 0.6, CS * 0.1); g.fill(); g.stroke();
  g.beginPath(); g.arc(CS * 0.24, 0, CS * 0.17, -Math.PI / 2, Math.PI / 2); g.stroke();
  g.fillStyle = '#ffe2a0'; g.beginPath(); g.arc(CS * 0.2, 0, CS * 0.08, 0, 7); g.fill();
  g.restore();
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}

// ───────────────────────── frame
function frame() {
  requestAnimationFrame(frame);
  if (!L) return;
  const t = now();
  let k = 1;
  if (anim) { k = Math.min(1, (t - anim.t0) / anim.dur); if (k >= 1) anim = null; }
  const e = 1 - Math.pow(1 - k, 3);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(staticLayer, 0, 0, CW, CH);
  const O = E.buildOcc(L, S);
  const pressed = E.platesPressed(L, S, O.occ);
  drawTimeWash(t);
  drawTrails();
  drawPlatesLive(O);
  drawPitsLive(t);
  drawExit(t);
  drawDoors(pressed, O);
  drawGates(t);
  drawLeashes(t);
  drawGhostLight(t);
  drawLight(t);
  drawEyes(t);
  drawBecause(t);
  drawVeils(t);
  drawSmears(t);
  drawFutures(t);
  drawCrates(e);
  drawMovers(e, t);
  drawPlayer(e, t);
  drawFx(t);
  drawHover(t);
  bloom();
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(grainLayer, 0, 0, CW, CH);
}
let bloomCv = null, bloomOk = null;
function bloom() {
  if (bloomOk === null) { const tc = document.createElement('canvas').getContext('2d'); bloomOk = !!tc && 'filter' in tc; }
  if (!bloomOk) return;
  const bw = Math.max(1, Math.round(CW / 3)), bh = Math.max(1, Math.round(CH / 3));
  if (!bloomCv || bloomCv.width !== bw || bloomCv.height !== bh) { bloomCv = document.createElement('canvas'); bloomCv.width = bw; bloomCv.height = bh; }
  const b = bloomCv.getContext('2d');
  b.globalCompositeOperation = 'source-over'; b.filter = 'none'; b.clearRect(0, 0, bw, bh);
  b.filter = 'brightness(0.75) contrast(2.6) blur(' + Math.max(2, CS / 7) + 'px)';
  b.drawImage(cv, 0, 0, bw, bh);
  ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.55;
  ctx.drawImage(bloomCv, 0, 0, CW, CH);
  ctx.restore();
}

function lerpCell(a, b, e) {
  const ax = a % L.W, ay = a / L.W | 0, bx = b % L.W, by = b / L.W | 0;
  return [OX + (ax + (bx - ax) * e + 0.5) * CS, OY + (ay + (by - ay) * e + 0.5) * CS];
}

// what you can reach is the open present; everything else is already history
function drawTimeWash(t) {
  const dB = info.A.dB;
  ctx.save();
  for (let c = 0; c < L.N; c++) {
    const tt = L.tile[c];
    if (tt === T.STONE) continue;
    const X = X0(c), Y = Y0(c);
    if (dB[c] < 1e9) {
      const k = Math.max(0, 1 - dB[c] / 14);
      ctx.fillStyle = 'rgba(120,170,255,' + (0.04 + 0.07 * k) + ')';
      ctx.fillRect(X, Y, CS, CS);
    } else {
      ctx.fillStyle = 'rgba(150,105,45,0.17)'; ctx.fillRect(X, Y, CS, CS);
      ctx.strokeStyle = 'rgba(200,160,95,0.10)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 3; k < CS * 2; k += 5) { const a = Math.min(k, CS), b = Math.max(0, k - CS); ctx.moveTo(X + a, Y + b); ctx.lineTo(X + b, Y + a); }
      ctx.stroke();
    }
  }
  ctx.restore();
}
function drawTrails() {
  if (!trails.length) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const p of trails) {
    const pts = p.map(c => [cx(c), cy(c)]);
    ctx.strokeStyle = 'rgba(214,160,80,0.10)'; ctx.lineWidth = CS * 0.5; strokePts(pts);
    ctx.strokeStyle = 'rgba(235,190,120,0.30)'; ctx.lineWidth = 1; ctx.setLineDash([1, 3]); strokePts(pts); ctx.setLineDash([]);
    for (const q of pts) { ctx.strokeStyle = 'rgba(235,190,120,0.14)'; ctx.beginPath(); ctx.arc(q[0], q[1], CS * 0.3, 0, 7); ctx.stroke(); }
  }
  ctx.restore();
}
function drawPlatesLive(O) {
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PLATE && O.occ[c]) {
    const x = X0(c), y = Y0(c), m = CS * 0.2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,200,110,0.16)'; ctx.fillRect(x + m, y + m, CS - 2 * m, CS - 2 * m);
    ctx.restore();
  }
}
function drawPitsLive(t) {
  for (const c of S.filled) {
    const x = cx(c), y = cy(c), r = CS * 0.43;
    ctx.fillStyle = '#18213a'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(190,160,110,0.55)'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.strokeStyle = 'rgba(190,160,110,0.25)';
    ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.2); ctx.lineTo(x + r * 0.6, y - r * 0.2); ctx.moveTo(x - r * 0.6, y + r * 0.25); ctx.lineTo(x + r * 0.6, y + r * 0.25); ctx.stroke();
  }
}
function drawExit(t) {
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.EXIT) {
    const x = cx(c), y = cy(c);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(x, y, 1, x, y, CS * 0.75);
    gr.addColorStop(0, 'rgba(255,230,170,0.55)'); gr.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = gr; ctx.fillRect(x - CS, y - CS, CS * 2, CS * 2);
    ctx.strokeStyle = 'rgba(255,225,160,0.85)'; ctx.lineWidth = 1.2;
    for (let k = 0; k < 3; k++) {
      const a = t / 1400 * (k % 2 ? -1 : 1) + k;
      ctx.beginPath(); ctx.arc(x, y, CS * (0.16 + 0.1 * k), a, a + Math.PI * 1.35); ctx.stroke();
    }
    ctx.restore();
  }
}
function drawDoors(pressed, O) {
  for (let c = 0; c < L.N; c++) {
    const t = L.tile[c]; if (t !== T.DOOR && t !== T.IDOOR) continue;
    const closed = E.doorClosed(L, c, pressed, O.occ);
    const X = X0(c), Y = Y0(c);
    ctx.save();
    if (closed) {
      ctx.fillStyle = '#141008'; ctx.fillRect(X + 1, Y + 1, CS - 2, CS - 2);
      ctx.strokeStyle = 'rgba(220,180,110,0.85)'; ctx.lineWidth = 1.6;
      for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(X + k * CS / 4, Y + 2); ctx.lineTo(X + k * CS / 4, Y + CS - 2); ctx.stroke(); }
      ctx.strokeRect(X + 1.5, Y + 1.5, CS - 3, CS - 3);
    } else {
      ctx.strokeStyle = 'rgba(220,180,110,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.strokeRect(X + 2.5, Y + 2.5, CS - 5, CS - 5); ctx.setLineDash([]);
    }
    // ◇ opens when pressed, ◆ shuts when pressed
    const x = X + CS / 2, y = Y + CS / 2, r = CS * 0.12;
    ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath();
    ctx.fillStyle = closed ? '#141008' : 'rgba(0,0,0,0)';
    if (t === T.IDOOR) { ctx.fillStyle = 'rgba(255,200,120,0.95)'; ctx.fill(); }
    else { ctx.fill(); ctx.strokeStyle = 'rgba(255,200,120,0.95)'; ctx.lineWidth = 1.2; ctx.stroke(); }
    ctx.restore();
  }
}
function drawGates(t) {
  S.gates.forEach((g, j) => {
    const X = X0(g.c), Y = Y0(g.c), x = cx(g.c), y = cy(g.c);
    ctx.save();
    if (g.closed) {
      ctx.fillStyle = '#05070e'; ctx.fillRect(X, Y, CS, CS);
      ctx.strokeStyle = 'rgba(88,112,180,0.4)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); for (let k = -CS; k < CS; k += 4) { ctx.moveTo(X + k, Y); ctx.lineTo(X + k + CS, Y + CS); } ctx.save(); ctx.clip(new Path2D()); ctx.restore(); ctx.stroke();
      ctx.strokeStyle = 'rgba(160,184,245,0.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(X + 0.5, Y + 0.5, CS - 1, CS - 1);
    } else {
      const reach = info.reach(g.c), ok = reach <= g.n;
      ctx.strokeStyle = ok ? 'rgba(255,214,140,0.85)' : 'rgba(255,120,100,0.9)'; ctx.lineWidth = 1.3;
      const w = CS * 0.22, h = CS * 0.3;
      ctx.beginPath(); ctx.moveTo(x - w, y - h); ctx.lineTo(x + w, y - h); ctx.lineTo(x - w, y + h); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = '#ffe3a6'; ctx.font = 'bold ' + Math.round(CS * 0.36) + 'px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(g.n), x + CS * 0.3, y - CS * 0.28);
    }
    ctx.restore();
  });
}
function drawLeashes(t) {
  if (!info.leash) return;
  S.gates.forEach((g, j) => {
    const ls = info.leash[j]; if (!ls) return;
    const hovered = hoverCell === g.c;
    ctx.save();
    ctx.strokeStyle = hovered ? 'rgba(255,214,140,0.75)' : 'rgba(255,214,140,0.28)';
    ctx.lineWidth = hovered ? 1.6 : 1.1;
    ctx.setLineDash([2, 4]); ctx.lineDashOffset = -t / 80;
    ctx.beginPath();
    for (let c = 0; c < L.N; c++) {
      if (!ls.set[c]) continue;
      const x = c % L.W, y = c / L.W | 0, X = X0(c), Y = Y0(c);
      const out = (dx, dy) => !inb(x + dx, y + dy) || !ls.set[idx(x + dx, y + dy)];
      if (out(0, -1)) { ctx.moveTo(X, Y); ctx.lineTo(X + CS, Y); }
      if (out(0, 1)) { ctx.moveTo(X, Y + CS); ctx.lineTo(X + CS, Y + CS); }
      if (out(-1, 0)) { ctx.moveTo(X, Y); ctx.lineTo(X, Y + CS); }
      if (out(1, 0)) { ctx.moveTo(X + CS, Y); ctx.lineTo(X + CS, Y + CS); }
    }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  });
}

// light: polyline points from cell list; the last point stops at the face of whatever blocked it
function beamPoints(seg) {
  const pts = [];
  for (let k = 0; k < seg.length; k++) pts.push([cx(seg[k]), cy(seg[k])]);
  if (pts.length >= 2) {
    const last = seg[seg.length - 1], f = L.fixed[last];
    const isEye = f && f.k === 'eye', isMirror = f && f.k === 'mirror';
    if (!isEye && !isMirror) {
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]);
      b[0] -= dx * CS * 0.5; b[1] -= dy * CS * 0.5;
    } else if (isEye) {
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]);
      b[0] -= dx * CS * 0.22; b[1] -= dy * CS * 0.22;
    }
    // start at the lamp's lens
    const a0 = pts[0], a1 = pts[1];
    const dx = Math.sign(a1[0] - a0[0]), dy = Math.sign(a1[1] - a0[1]);
    a0[0] += dx * CS * 0.3; a0[1] += dy * CS * 0.3;
  }
  return pts;
}
function strokePts(pts) { ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
function polyLen(pts) { let s = 0; for (let k = 1; k < pts.length; k++) s += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); return s; }
function pointAt(pts, d) {
  for (let k = 1; k < pts.length; k++) {
    const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
    if (d <= l) { const u = l ? d / l : 0; return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * u, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * u]; }
    d -= l;
  }
  return pts[pts.length - 1];
}
function drawLight(t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const seg of info.beams.segs) {
    if (seg.length < 2) continue;
    const pts = beamPoints(seg);
    ctx.strokeStyle = 'rgba(255,150,50,0.07)'; ctx.lineWidth = CS * 0.55; strokePts(pts);
    ctx.strokeStyle = 'rgba(255,175,70,0.16)'; ctx.lineWidth = CS * 0.24; strokePts(pts);
    ctx.strokeStyle = 'rgba(255,225,150,0.75)'; ctx.lineWidth = Math.max(1.4, CS * 0.075); strokePts(pts);
    ctx.strokeStyle = 'rgba(255,250,230,0.9)'; ctx.lineWidth = Math.max(0.7, CS * 0.03); strokePts(pts);
    // photons flowing along the beam
    const len = polyLen(pts), gap = CS * 0.9, off = (ambient(t) / 9) % gap;
    for (let d = off; d < len; d += gap) {
      const p = pointAt(pts, d);
      const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], CS * 0.16);
      gr.addColorStop(0, 'rgba(255,245,210,0.85)'); gr.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = gr; ctx.fillRect(p[0] - CS * 0.16, p[1] - CS * 0.16, CS * 0.32, CS * 0.32);
    }
  }
  ctx.restore();
}
// counterfactual light: what the lamps would do if a present veil were not there
function drawGhostLight(t) {
  if (!info.because.length) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const b of info.because) {
    const hov = hoverCell === L.veils[b.i];
    for (const seg of b.segs) {
      if (seg.length < 2) continue;
      // only draw the part that differs from real light: skip if identical to a real beam
      if (info.beams.segs.some(r => r.length === seg.length && r.every((v, k) => v === seg[k]))) continue;
      const pts = beamPoints(seg);
      const base = hov ? 0.95 : 0.42;
      ctx.setLineDash([CS * 0.14, CS * 0.2]); ctx.lineDashOffset = -t / 40;
      const off = 1.2 + 0.6 * Math.sin(t / 300);
      ctx.lineWidth = hov ? 2 : 1.3;
      ctx.save(); ctx.translate(-off, 0); ctx.strokeStyle = 'rgba(120,220,255,' + base + ')'; strokePts(pts); ctx.restore();
      ctx.save(); ctx.translate(off, 0); ctx.strokeStyle = 'rgba(255,120,220,' + base * 0.45 + ')'; strokePts(pts); ctx.restore();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(134,232,255,' + (hov ? 0.16 : 0.06) + ')'; ctx.lineWidth = CS * 0.26; strokePts(pts);
    }
  }
  ctx.restore();
}
function drawEyes(t) {
  L.eyes.forEach((c, i) => {
    const lit = (info.beams.lit >> i) & 1;
    const x = cx(c), y = cy(c), w = CS * 0.42, h = CS * 0.24;
    ctx.save();
    ctx.fillStyle = '#0b0f1c'; ctx.fillRect(X0(c) + 1, Y0(c) + 1, CS - 2, CS - 2);
    ctx.strokeStyle = lit ? 'rgba(255,230,170,0.95)' : 'rgba(170,190,240,0.75)'; ctx.lineWidth = 1.4;
    if (lit) {
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x, y - h * 2, x + w, y); ctx.quadraticCurveTo(x, y + h * 2, x - w, y); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      const gr = ctx.createRadialGradient(x, y, 0, x, y, CS * 0.5);
      gr.addColorStop(0, 'rgba(255,220,140,0.7)'); gr.addColorStop(1, 'rgba(255,180,80,0)');
      ctx.fillStyle = gr; ctx.fillRect(x - CS / 2, y - CS / 2, CS, CS);
      ctx.fillStyle = '#ffe9b8'; ctx.beginPath(); ctx.arc(x, y, CS * 0.11, 0, 7); ctx.fill();
      ctx.fillStyle = '#2a1a05'; ctx.beginPath(); ctx.arc(x, y, CS * 0.045, 0, 7); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x, y + h * 1.6, x + w, y); ctx.stroke();
      ctx.lineWidth = 1;
      for (let k = -2; k <= 2; k++) { const px = x + k * w * 0.36, py = y + h * 0.75 * (1 - Math.abs(k) * 0.18); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + k * 1.2, py + CS * 0.08); ctx.stroke(); }
    }
    ctx.restore();
  });
}
// the thread from each present veil to the eyes it is responsible for
function drawBecause(t) {
  ctx.save();
  for (const b of info.because) {
    if (!b.eyes) continue;
    const v = L.veils[b.i], hov = hoverCell === v;
    L.eyes.forEach((ec, ei) => {
      if (!((b.eyes >> ei) & 1)) return;
      const x1 = cx(v), y1 = cy(v), x2 = cx(ec), y2 = cy(ec);
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18, my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
      ctx.strokeStyle = hov ? 'rgba(217,238,255,0.8)' : 'rgba(217,238,255,0.16)'; ctx.lineWidth = hov ? 1.4 : 1;
      ctx.setLineDash([1, 5]); ctx.lineDashOffset = t / 60;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    });
  }
  ctx.setLineDash([]);
  ctx.restore();
}
// frost glyph for a veil, deterministic per veil
function frost(x, y, s, seed, amt, alpha) {
  const R = rnd(seed * 7919 + 17);
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(225,242,255,' + alpha + ')'; ctx.lineWidth = 1; ctx.lineCap = 'round';
  for (let a = 0; a < 6; a++) {
    const ang = a * Math.PI / 3 + R() * 0.2;
    const len = s * (0.42 + R() * 0.08) * amt;
    const ex = Math.cos(ang) * len, ey = Math.sin(ang) * len;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
    for (let b = 1; b <= 3; b++) {
      const u = b / 4, bl = len * (0.32 - b * 0.06) * (0.7 + R() * 0.5);
      const px = ex * u, py = ey * u;
      for (const sg of [-1, 1]) { const aa = ang + sg * Math.PI / 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(aa) * bl, py + Math.sin(aa) * bl); ctx.stroke(); }
    }
  }
  ctx.restore();
}
function drawVeils(t) {
  const running = {};
  for (const f of fxs) if ((f.k === 'condense' || f.k === 'dissolve') && t >= f.t0 && t < f.t0 + f.dur) running[f.i] = f;
  L.veils.forEach((c, i) => {
    const X = X0(c), Y = Y0(c), x = cx(c), y = cy(c);
    const present = S.veil[i];
    const f = running[i];
    let amt = present ? 1 : 0;
    if (f) { const u = (t - f.t0) / f.dur; amt = f.k === 'condense' ? u : 1 - u; }
    ctx.save();
    if (amt > 0.01) {
      const gr = ctx.createLinearGradient(X, Y, X + CS, Y + CS);
      gr.addColorStop(0, 'rgba(210,235,255,' + 0.30 * amt + ')'); gr.addColorStop(1, 'rgba(150,190,240,' + 0.16 * amt + ')');
      ctx.fillStyle = gr; ctx.fillRect(X + 1, Y + 1, CS - 2, CS - 2);
      ctx.strokeStyle = 'rgba(230,245,255,' + 0.85 * amt + ')'; ctx.lineWidth = 1.3; ctx.strokeRect(X + 1.5, Y + 1.5, CS - 3, CS - 3);
      frost(x, y, CS, i + 3, Math.min(1, amt * 1.2), 0.85 * amt);
      ctx.globalCompositeOperation = 'lighter';
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, CS * 0.7);
      g2.addColorStop(0, 'rgba(180,220,255,' + 0.18 * amt + ')'); g2.addColorStop(1, 'rgba(150,200,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(x - CS, y - CS, CS * 2, CS * 2);
    }
    if (amt < 0.99) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(200,225,255,' + 0.38 * (1 - amt) + ')'; ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]); ctx.strokeRect(X + 3.5, Y + 3.5, CS - 7, CS - 7); ctx.setLineDash([]);
      frost(x, y, CS * 0.55, i + 3, 1, 0.12 * (1 - amt));
    }
    if (f && f.k === 'dissolve') {
      const u = (t - f.t0) / f.dur, R = rnd(i * 31 + 5);
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 14; k++) {
        const a = R() * 7, r = CS * (0.1 + u * (0.4 + R() * 0.4));
        ctx.fillStyle = 'rgba(220,240,255,' + (1 - u) * 0.8 + ')';
        ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 1.6, 1.6);
      }
    }
    ctx.restore();
  });
}
// shuttles that can never be touched: their whole cycle at once
function drawSmears(t) {
  S.shuttles.forEach((q, i) => {
    let a = 0;
    const fx = fxs.find(f => (f.k === 'smear' || f.k === 'collapse') && f.i === i && t >= f.t0 && t < f.t0 + f.dur);
    if (q.smear) a = fx && fx.k === 'smear' ? (t - fx.t0) / fx.dur : 1;
    else if (fx && fx.k === 'collapse') a = 1 - (t - fx.t0) / fx.dur;
    if (a <= 0 || !q.track) {
      if (!(fx && fx.k === 'collapse')) return;
    }
    const track = q.track || (fx && fx.track) || [];
    if (!track.length) return;
    const xs = track.map(cx), ys = track.map(cy);
    const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const r = CS * 0.33;
    const gr = x2 - x1 >= y2 - y1 ? ctx.createLinearGradient(x1, 0, x2, 0) : ctx.createLinearGradient(0, y1, 0, y2);
    const sh = 0.5 + 0.5 * Math.sin(t / 500);
    gr.addColorStop(0, 'rgba(255,190,110,' + 0.35 * a + ')'); gr.addColorStop(0.5, 'rgba(255,220,160,' + (0.42 + 0.08 * sh) * a + ')'); gr.addColorStop(1, 'rgba(255,190,110,' + 0.35 * a + ')');
    ctx.fillStyle = gr;
    roundRect(ctx, x1 - r, y1 - r, x2 - x1 + 2 * r, y2 - y1 + 2 * r, r); ctx.fill();
    // long-exposure striations
    ctx.strokeStyle = 'rgba(255,240,210,' + 0.35 * a + ')'; ctx.lineWidth = 0.8;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      if (x2 - x1 >= y2 - y1) { ctx.moveTo(x1 - r * 0.6, (y1 + y2) / 2 + k * r * 0.33); ctx.lineTo(x2 + r * 0.6, (y1 + y2) / 2 + k * r * 0.33); }
      else { ctx.moveTo((x1 + x2) / 2 + k * r * 0.33, y1 - r * 0.6); ctx.lineTo((x1 + x2) / 2 + k * r * 0.33, y2 + r * 0.6); }
      ctx.stroke();
    }
    // its hidden phase: where it would be, if it were only in one place
    if (q.smear) {
      const ph = E.smearPhase(L, S, q, S.t);
      const px = cx(ph.c), py = cy(ph.c);
      const g2 = ctx.createRadialGradient(px, py, 0, px, py, CS * 0.42);
      g2.addColorStop(0, 'rgba(255,255,240,' + 0.55 * a + ')'); g2.addColorStop(1, 'rgba(255,220,150,0)');
      ctx.fillStyle = g2; ctx.fillRect(px - CS / 2, py - CS / 2, CS, CS);
    }
    ctx.restore();
  });
}
// the future of live processes: where they will go, and where you could still get in their way
function drawFutures(t) {
  const A = info.A, rec = info.rec;
  ctx.save();
  S.runners.forEach((r, i) => {
    if (r.st !== 0 || !A.live[i]) return;
    const mv = rec.rMoves[i]; if (!mv.length) return;
    const hov = hoverCell === r.c;
    let firstHit = -1;
    let px = cx(r.c), py = cy(r.c);
    for (let k = 0; k < mv.length; k++) {
      const [c, tk] = mv[k];
      const x = cx(c), y = cy(c);
      ctx.strokeStyle = hov ? 'rgba(255,214,140,0.6)' : 'rgba(255,214,140,0.22)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = hov ? 'rgba(255,214,140,0.8)' : 'rgba(255,214,140,0.35)';
      ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill();
      const can = info.reach(c) <= tk;
      if (can) {
        if (firstHit < 0) firstHit = k;
        ctx.strokeStyle = hov ? 'rgba(134,232,255,0.95)' : 'rgba(134,232,255,0.5)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, y, CS * 0.2 + (k === firstHit ? 1.5 * Math.sin(t / 200) : 0), 0, 7); ctx.stroke();
      }
      px = x; py = y;
    }
    // where it will come to rest if no one interferes
    const end = mv[mv.length - 1][0];
    ctx.strokeStyle = 'rgba(255,214,140,' + (hov ? 0.5 : 0.18) + ')'; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.arc(cx(end), cy(end), CS * 0.3, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  });
  ctx.restore();
}
function drawCrates(e) {
  const A = anim;
  S.crates.forEach((c, i) => {
    let x = cx(c), y = cy(c);
    if (A && A.from.crates.length === S.crates.length && A.from.crates[i] !== c) [x, y] = lerpCell(A.from.crates[i], c, e);
    crateAt(x, y, 1);
  });
}
function crateAt(x, y, s) {
  const h = CS * 0.4 * s;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x - h + 2, y - h + 3, 2 * h, 2 * h);
  ctx.fillStyle = '#7a5530'; ctx.fillRect(x - h, y - h, 2 * h, 2 * h);
  ctx.strokeStyle = '#d7aa6c'; ctx.lineWidth = 1.2; ctx.strokeRect(x - h + 0.5, y - h + 0.5, 2 * h - 1, 2 * h - 1);
  ctx.strokeStyle = 'rgba(230,190,130,0.55)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - h, y - h); ctx.lineTo(x + h, y + h); ctx.moveTo(x + h, y - h); ctx.lineTo(x - h, y + h); ctx.stroke();
  ctx.strokeRect(x - h * 0.6, y - h * 0.6, h * 1.2, h * 1.2);
  ctx.restore();
}
function ball(x, y, d, live, t, kind) {
  const r = CS * 0.31;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(x + 1.5, y + 2.5, r, 0, 7); ctx.fill();
  const gr = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  if (live) { gr.addColorStop(0, '#fff1c9'); gr.addColorStop(0.5, '#d9a556'); gr.addColorStop(1, '#6d4a1b'); }
  else { gr.addColorStop(0, '#9b8a6a'); gr.addColorStop(0.6, '#4c3d22'); gr.addColorStop(1, '#1d160a'); }
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = live ? 'rgba(255,230,170,0.9)' : 'rgba(150,130,90,0.7)'; ctx.lineWidth = 1.2; ctx.stroke();
  // engraved hatching: shimmering while still open, still once settled
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 1, 0, 7); ctx.clip();
  ctx.strokeStyle = live ? 'rgba(60,35,5,0.35)' : 'rgba(10,8,3,0.45)'; ctx.lineWidth = 0.8;
  const sp = Math.max(2.4, r / 3.2), ph = live ? (ambient(t) / 90) % sp : 0;
  ctx.beginPath(); for (let k = -2 * r - sp; k < 2 * r; k += sp) { ctx.moveTo(x + k + ph, y - r); ctx.lineTo(x + k + ph + r, y + r); } ctx.stroke();
  ctx.restore();
  // direction notch(es)
  ctx.fillStyle = live ? '#2b1a04' : '#0d0904';
  const dirs = kind === 'shuttle' ? [d, (d + 2) % 4] : [d];
  for (const dd of dirs) {
    const dx = E.DX[dd], dy = E.DY[dd];
    ctx.beginPath(); ctx.moveTo(x + dx * r * 0.85, y + dy * r * 0.85);
    ctx.lineTo(x + dx * r * 0.45 - dy * r * 0.25, y + dy * r * 0.45 + dx * r * 0.25);
    ctx.lineTo(x + dx * r * 0.45 + dy * r * 0.25, y + dy * r * 0.45 - dx * r * 0.25); ctx.closePath(); ctx.fill();
  }
  if (live) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(134,232,255,' + (0.25 + 0.15 * Math.sin(t / 260)) + ')'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, r + 3.5, 0, 7); ctx.stroke();
  }
  ctx.restore();
}
function drawMovers(e, t) {
  const A = anim, live = info.A.live, nR = S.runners.length;
  const fating = new Set(fxs.filter(f => f.k === 'fate' && t < f.t0 + f.dur * 0.55).map(f => f.i));
  S.runners.forEach((r, i) => {
    if (r.st === 2) return;
    if (fating.has(i)) return;
    let x = cx(r.c), y = cy(r.c);
    if (A && A.from.runners[i] && A.from.runners[i].c !== r.c && A.from.runners[i].st !== 2) {
      const dist = Math.abs(A.from.runners[i].c % L.W - r.c % L.W) + Math.abs((A.from.runners[i].c / L.W | 0) - (r.c / L.W | 0));
      if (dist <= 1) [x, y] = lerpCell(A.from.runners[i].c, r.c, e);
    }
    ball(x, y, r.d, r.st === 0 && !!live[i], t, 'runner');
  });
  S.shuttles.forEach((q, i) => {
    if (q.smear) return;
    let x = cx(q.c), y = cy(q.c);
    if (A && A.from.shuttles[i] && !A.from.shuttles[i].smear && A.from.shuttles[i].c !== q.c) [x, y] = lerpCell(A.from.shuttles[i].c, q.c, e);
    ball(x, y, q.d, !!live[nR + i], t, 'shuttle');
  });
}
function drawPlayer(e, t) {
  let x = cx(S.p), y = cy(S.p);
  if (anim && anim.from.p !== S.p) [x, y] = lerpCell(anim.from.p, S.p, e);
  if (bumpAt && t - bumpAt < 140 && bumpDir >= 0) { const u = Math.sin((t - bumpAt) / 140 * Math.PI) * CS * 0.08; x += E.DX[bumpDir] * u; y += E.DY[bumpDir] * u; }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const gr = ctx.createRadialGradient(x, y, 0, x, y, CS * 1.1);
  gr.addColorStop(0, 'rgba(255,236,190,0.30)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = gr; ctx.fillRect(x - CS * 1.1, y - CS * 1.1, CS * 2.2, CS * 2.2);
  ctx.globalCompositeOperation = 'source-over';
  // a small cloaked figure holding a light
  const s = CS / 32;
  ctx.fillStyle = '#1b2036'; ctx.strokeStyle = '#f5ead0'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x, y - 9 * s); ctx.quadraticCurveTo(x + 9 * s, y + 4 * s, x + 8 * s, y + 11 * s); ctx.lineTo(x - 8 * s, y + 11 * s); ctx.quadraticCurveTo(x - 9 * s, y + 4 * s, x, y - 9 * s); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - 9 * s, 4.2 * s, 0, 7); ctx.fillStyle = '#f5ead0'; ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  const lx = x + 6 * s, ly = y + 1 * s;
  const g2 = ctx.createRadialGradient(lx, ly, 0, lx, ly, 6 * s);
  g2.addColorStop(0, 'rgba(255,250,220,1)'); g2.addColorStop(1, 'rgba(255,210,120,0)');
  ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(lx, ly, 6 * s, 0, 7); ctx.fill();
  ctx.restore();
}
function drawFx(t) {
  fxs = fxs.filter(f => t < f.t0 + f.dur);
  for (const f of fxs) {
    const u = (t - f.t0) / f.dur;
    if (u < 0) continue;
    if (f.k === 'fate') {
      // chronophotograph: the whole remaining path, exposed at once (after Marey)
      const path = f.path; const n = path.length;
      const pts = path.map(c => [cx(c), cy(c)]);
      const fade = u < 0.15 ? u / 0.15 : 1 - (u - 0.15) / 0.85;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,200,120,' + 0.10 * fade + ')'; ctx.lineWidth = CS * 0.7; strokePts(pts);
      ctx.strokeStyle = 'rgba(255,236,200,' + 0.55 * fade + ')'; ctx.lineWidth = Math.max(1.5, CS * 0.06); strokePts(pts);
      const sweep = Math.min(1, u * 3.2);
      for (let k = 0; k < n; k++) {
        if (k / Math.max(1, n - 1) > sweep) break;
        const a = fade * (0.18 + 0.62 * (k + 1) / n);
        const x = pts[k][0], y = pts[k][1], r = CS * 0.31;
        const gr = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
        gr.addColorStop(0, 'rgba(255,240,200,' + a * 0.55 + ')'); gr.addColorStop(1, 'rgba(210,150,60,' + a * 0.12 + ')');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,236,200,' + a + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
      }
      ctx.restore();
      if (u > 0.45) {
        const end = path[n - 1];
        if (f.st !== 2) { ctx.save(); ctx.globalAlpha = Math.min(1, (u - 0.45) * 4); ball(cx(end), cy(end), S.runners[f.i] ? S.runners[f.i].d : 1, false, t, 'runner'); ctx.restore(); }
      }
    } else if (f.k === 'gate') {
      const g = S.gates[f.j]; if (!g) continue;
      const x = cx(g.c), y = cy(g.c);
      ctx.save(); ctx.strokeStyle = 'rgba(255,214,140,' + (1 - u) + ')'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, CS * (0.3 + u * 1.4), 0, 7); ctx.stroke(); ctx.restore();
    } else if (f.k === 'fill' || f.k === 'sink') {
      const x = cx(f.at), y = cy(f.at);
      ctx.save(); ctx.globalAlpha = 1 - u;
      if (f.k === 'fill') crateAt(x, y, 1 - u * 0.6); else ball(x, y, 1, false, t, 'runner');
      ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(200,215,255,' + (1 - u) * 0.6 + ')'; ctx.beginPath(); ctx.arc(x, y, CS * (0.2 + u * 0.5), 0, 7); ctx.stroke(); ctx.restore();
    } else if (f.k === 'condense') {
      const c = L.veils[f.i], x = cx(c), y = cy(c);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(210,235,255,' + (1 - u) * 0.8 + ')'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, CS * (0.9 - u * 0.5), 0, 7); ctx.stroke(); ctx.restore();
    }
  }
}
function drawHover(t) {
  if (hoverCell < 0 || !focusedOrHover) return;
  const X = X0(hoverCell), Y = Y0(hoverCell);
  ctx.save(); ctx.strokeStyle = 'rgba(220,230,255,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.strokeRect(X + 0.5, Y + 0.5, CS - 1, CS - 1); ctx.restore();
}

// ───────────────────────── explanations
function describe(c) {
  if (c < 0 || !L) return null;
  const O = E.buildOcc(L, S), o = O.occ[c], w = O.who[c], A = info.A;
  const t = L.tile[c], f = L.fixed[c];
  const out = [];
  if (o === 1) out.push('<b>You.</b> You block light and runners like anything solid.');
  if (o === 2) out.push('<b>Crate.</b> Push it. It blocks light and runners, and fills a pit.');
  if (o === 3) {
    const r = S.runners[w];
    if (r.st === 1) out.push('<b>Runner — finished.</b> It rolled until stone stopped it. Nothing more will happen to it.');
    else if (A.live[w]) {
      const why = A.why[w];
      out.push('<b>Runner — <span class="c">live</span>.</b> You could still get in its way in time' + (why && why.c !== undefined ? ' (blue rings: places you could reach before it does)' : '') + ', so it moves one step per turn.');
    } else out.push('<b>Runner — <span class="g">fated</span>.</b> Nothing you could do would reach its path in time, so everything it will ever do has already happened.');
  }
  if (o === 4) out.push('<b>Shuttle — <span class="c">live</span>.</b> You could reach its rail, so it is in one place at a time.');
  if (o === 5) out.push('<b>Shuttle — <span class="g">everywhere at once</span>.</b> You can never touch it, so its whole endless cycle has already happened: it fills its rail at every moment. The bright spark is where it would be if it were only in one place.');
  const vi = L.veils.indexOf(c);
  if (vi >= 0) {
    if (S.veil[vi]) {
      const b = info.because.find(x => x.i === vi);
      const changed = b ? b.eyes : 0;
      const names = [];
      L.eyes.forEach((ec, ei) => { if ((changed >> ei) & 1) names.push(((info.beams.lit >> ei) & 1) ? 'see darkness' : 'see light'); });
      out.push('<b>Veil — present.</b> It is here only because without it ' + (names.length ? 'an eye would ' + names[0] + (names.length > 1 ? ' (and ' + (names.length - 1) + ' more)' : '') : 'something would be different') + '. <span class="c">Dashed blue light</span> shows that other world.');
    } else if (o && o !== 6) {
      out.push('<b>Veil — absent.</b> It cannot form where something stands.');
    } else out.push('<b>Veil — absent.</b> Nothing anywhere would be different if it were here, so it is not.');
  }
  if (f && f.k === 'eye') out.push('<b>Eye — ' + (((info.beams.lit >> f.id) & 1) ? 'sees light' : 'sees darkness') + '.</b> Veils exist only to make a difference to what eyes see.');
  if (f && f.k === 'emit') out.push('<b>Lamp.</b>');
  if (f && f.k === 'mirror') out.push('<b>Mirror.</b>');
  if (t === T.GATE) {
    const g = E.gateAt(S, c);
    if (g.closed) out.push('<b>Gate — shut.</b>');
    else {
      const d = info.reach(c);
      out.push('<b>Gate.</b> It shuts in <span class="g">' + g.n + '</span> unless something stands in it. You can get there in <span class="g">' + (d >= 1e9 ? '—' : d) + '</span>. If you ever could not make it in time, it would already be shut. The dotted line is how far you may stray.');
    }
  }
  if (t === T.PIT) out.push(E.isPitOpen(L, S, c) ? '<b>Pit.</b> A crate or a runner can fill it.' : '<b>Filled pit.</b>');
  if (t === T.TRACK && !o) out.push('<b>Rail.</b> Runners and pushed crates can go here. You cannot.');
  if (t === T.ONEWAY) out.push('<b>One way.</b> Once through, you cannot go back.');
  if (t === T.PLATE) out.push('<b>Plate.</b> While anything presses it, ◇ doors open and ◆ doors shut.');
  if (t === T.DOOR) out.push('<b>◇ Door.</b> Open while a plate is pressed.');
  if (t === T.IDOOR) out.push('<b>◆ Door.</b> Shut while a plate is pressed.');
  if (t === T.EXIT) out.push('<b>Exit.</b>');
  return out.length ? out.join('<br>') : null;
}
let focusedOrHover = false;
function showTipAt(c, px, py) {
  const html = describe(c);
  if (!html) { hideTip(); return; }
  tip.innerHTML = html;
  tip.style.opacity = '1';
  const r = stage.getBoundingClientRect(), cvr = cv.getBoundingClientRect();
  let left = (cvr.left - r.left) + (X0(c) + CS) + 8, top = (cvr.top - r.top) + Y0(c);
  const tw = Math.min(300, r.width - 16);
  if (left + tw > r.width - 4) left = (cvr.left - r.left) + X0(c) - tw - 8;
  if (left < 4) left = 4;
  tip.style.left = left + 'px'; tip.style.top = Math.max(4, top) + 'px'; tip.style.maxWidth = tw + 'px';
}
function hideTip() { tip.style.opacity = '0'; }
function refreshTip() { if (hoverCell >= 0 && tip.style.opacity === '1') showTipAt(hoverCell); }
function cellFromEvent(ev) {
  const r = cv.getBoundingClientRect();
  const x = (ev.clientX - r.left) * (CW / r.width), y = (ev.clientY - r.top) * (CH / r.height);
  const gx = Math.floor((x - OX) / CS), gy = Math.floor((y - OY) / CS);
  return inb(gx, gy) ? idx(gx, gy) : -1;
}

// ───────────────────────── input
const KEYS = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3, Space: -1, Period: -1 };
window.addEventListener('keydown', ev => {
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  const k = ev.code;
  if (menu.classList.contains('on')) {
    if (k === 'Escape') { closeMenu(); ev.preventDefault(); }
    return;
  }
  if ($('card').classList.contains('on')) { ev.preventDefault(); hideCard(); return; }
  if (k in KEYS) { ev.preventDefault(); act(KEYS[k]); return; }
  if (k === 'KeyZ' || k === 'Backspace' || k === 'KeyU') { ev.preventDefault(); undo(); return; }
  if (k === 'KeyR') { ev.preventDefault(); restart(); return; }
  if (k === 'Enter' && S && S.won) { ev.preventDefault(); next(); return; }
  if (k === 'BracketRight' || k === 'KeyN') { load(LI + 1); return; }
  if (k === 'BracketLeft' || k === 'KeyP') { load(LI - 1); return; }
  if (k === 'Escape' || k === 'KeyM') { ev.preventDefault(); openMenu(); return; }
  if (k === 'Slash' || k === 'KeyH') { openMenu('help'); return; }
});
cv.addEventListener('mousemove', ev => {
  const c = cellFromEvent(ev);
  focusedOrHover = true;
  if (c !== hoverCell) { hoverCell = c; showTipAt(c); }
});
cv.addEventListener('mouseleave', () => { hoverCell = -1; hideTip(); });
// touch: swipe to move, tap to ask. Until the game is tapped, a swipe over the board scrolls the page
// (the board may sit inside a post), and once the board is mostly scrolled out of view it lets go again.
const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
if (coarse) $('focus').textContent = 'tap to play';
let touch0 = null, engaged = false;
function engage(v) { if (engaged === v) return; engaged = v; $('app').classList.toggle('engaged', v); setFocus(focused); }
document.addEventListener('click', () => engage(true), true);
if (window.IntersectionObserver) new IntersectionObserver(es => { if (es[es.length - 1].intersectionRatio < 0.35) engage(false); }, { threshold: [0, 0.35] }).observe(cv);
cv.addEventListener('pointerdown', ev => {
  if (ev.pointerType === 'mouse') { stage.focus(); setFocus(true); }
  touch0 = { x: ev.clientX, y: ev.clientY, t: now(), c: cellFromEvent(ev) };
});
cv.addEventListener('pointercancel', () => { touch0 = null; });
cv.addEventListener('pointerup', ev => {
  if (!touch0) return;
  const dx = ev.clientX - touch0.x, dy = ev.clientY - touch0.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 22) { if (engaged || ev.pointerType === 'mouse') act(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)); }
  else if (ev.pointerType !== 'mouse') { hoverCell = touch0.c; focusedOrHover = true; showTipAt(touch0.c); }
  touch0 = null;
});
document.querySelectorAll('#pad button[data-d]').forEach(b => b.addEventListener('click', () => { setFocus(true); act(+b.dataset.d); }));
$('bUndo').onclick = () => undo();
$('bReset').onclick = () => restart();
$('bMenu').onclick = () => openMenu();
$('brand').onclick = () => openMenu();
$('next').onclick = () => next();
function setFocus(v) { focused = v; $('focus').style.opacity = (coarse ? engaged : v) ? '0' : '1'; }
window.addEventListener('focus', () => setFocus(true));
window.addEventListener('blur', () => setFocus(false));
stage.addEventListener('mousedown', () => { stage.focus(); setFocus(true); });
setFocus(document.hasFocus ? document.hasFocus() : false);

// ───────────────────────── menu / help
function openMenu(which) {
  const chs = ['I', 'II', 'III'];
  let h = '<div class="ov-inner">';
  if (which === 'help') {
    h += '<div class="ov-title">HOW IT WORKS</div><div class="ov-sub">Reach the exit. Hover or tap anything to ask why it is the way it is.</div><div class="help">';
    h += '<h3>Moving</h3><p>Arrow keys or WASD (or swipe). <span class="k">Space</span> waits a turn. <span class="k">Z</span> undoes, <span class="k">R</span> restarts. Push crates by walking into them.</p>';
    h += '<h3>Things that move by themselves</h3><p><b>Runners</b> roll in a straight line until something stops them; a runner or crate that rolls into a pit fills it. <b>Shuttles</b> roll back and forth. <b>Gates</b> shut after the number of turns shown, unless something is standing in them. Rails carry runners and pushed crates, but you cannot walk on them.</p>';
    h += '<h3>Light</h3><p>Lamps shine until something solid stops them — you, crates, runners, veils. Mirrors turn light. Eyes see light or darkness. Plates open ◇ doors and shut ◆ doors while pressed.</p>';
    h += '<h3>What the marks mean</h3><p><span class="k">Blue rings</span> along a runner’s path are places you could still reach before it does. <span class="k">Dotted gold</span> around a gate is how far you can wander and still make it back in time. <span class="k">Dashed blue light</span> is light that would exist if a veil were gone; faint threads tie each veil to the eye it matters to.</p>';
    h += '</div><div class="row"><button class="b" id="mBack">Back</button></div></div>';
    menu.innerHTML = h; menu.classList.add('on'); $('app').classList.add('menu-open');
    $('mBack').onclick = () => openMenu();
    return;
  }
  h += '<div class="ov-title">WHAT MUST BE</div><div class="ov-sub">a puzzle game about two laws that are not true here, and what happens when both are</div>';
  h += '<div class="laws">';
  for (const ch of chs) h += '<div class="law"><div class="h">' + LAWS[ch].tag + '</div><div class="t">' + LAWS[ch].law + '</div><div class="s">' + LAWS[ch].sub + '</div></div>';
  h += '</div><div class="chapters">';
  for (const ch of chs) {
    h += '<div class="chap"><div class="h">' + LAWS[ch].tag + '</div>';
    LV.forEach((l, i) => { if (l.ch !== ch) return; const k = LV.filter(m => m.ch === ch).indexOf(l) + 1; h += '<button class="b' + (done.has(i) ? ' done' : '') + (i === LI ? ' cur' : '') + '" data-i="' + i + '"><span class="k">' + k + '</span>' + l.title + '</button>'; });
    h += '</div>';
  }
  h += '</div><div class="row"><button class="b" id="mPlay">' + (hist.length || LI ? 'Back to the puzzle' : 'Begin') + '</button><button class="b" id="mHelp">How it works</button></div></div>';
  menu.innerHTML = h; menu.classList.add('on'); $('app').classList.add('menu-open');
  menu.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => { closeMenu(); load(+b.dataset.i); });
  $('mPlay').onclick = () => closeMenu();
  $('mHelp').onclick = () => openMenu('help');
}
function closeMenu() { menu.classList.remove('on'); $('app').classList.remove('menu-open'); layout(); stage.focus(); if (!$('card').classList.contains('on')) replayStart(); }

// ───────────────────────── boot
let ro = null;
if (window.ResizeObserver) { ro = new ResizeObserver(() => { const w = stage.clientWidth; if (L && Math.abs(w - (ro.w || 0)) > 2) { ro.w = w; layout(); } }); ro.observe(stage); }
window.addEventListener('resize', () => layout());
function boot(data) {
  const want = data && typeof data.li === 'number' ? data.li : store.get('cur', 0);
  const start = Math.max(0, Math.min(LV.length - 1, want | 0));
  load(start);
  requestAnimationFrame(frame);
  if (!(data && typeof data.li === 'number') && !done.size && start === 0) openMenu();
}
try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ li: LI })); } catch (e) { /* not in a viewer */ }
const hot = window.claude && window.claude.hot;
if (hot && hot.ready) hot.ready(boot); else boot(hot && hot.data ? hot.data : {});
window.WMB = { load, act, undo, restart, state: () => S, level: () => LI, info: () => info, openMenu, closeMenu, hideCard };
})();
