// engine.js — rules for two laws:
//   FATEFALL:     an autonomous process that you could not possibly interfere with in time
//                 has already happened (completes instantly). Periodic ones you can never
//                 touch are already everywhere on their track at once (a "smear").
//   SINE QUA NON: a veil exists iff, without it, some eye would see differently.
//                 Existence is sticky: the world keeps its current configuration while it is
//                 consistent, and otherwise makes the smallest change that restores consistency.
(function (root) {
'use strict';

const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0]; // N E S W
const DNAME = 'NESW';
const T = { FLOOR: 0, STONE: 1, EXIT: 2, PIT: 3, ONEWAY: 4, PLATE: 5, DOOR: 6, IDOOR: 7, GATE: 8, TRACK: 9 };

// ---------------------------------------------------------------- level parsing
function parseLevel(def) {
  const map = def.map;
  const H = map.length, W = Math.max(...map.map(r => r.length));
  const N = W * H;
  const tile = new Uint8Array(N), tdir = new Int8Array(N).fill(-1);
  const fixed = new Array(N).fill(null);
  const emitters = [], eyes = [], veils = [], gates0 = [], veilInit = [];
  let player = -1;
  const crates = [], runners = [], shuttles = [];
  const at = (x, y) => y * W + x;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = map[y][x] || ' ', c = at(x, y);
    switch (ch) {
      case '#': tile[c] = T.STONE; break;
      case ' ': case '.': case ':': break;
      case 'E': tile[c] = T.EXIT; break;
      case '=': tile[c] = T.TRACK; break;
      case 'O': tile[c] = T.PIT; break;
      case 'n': tile[c] = T.ONEWAY; tdir[c] = 0; break;
      case 'e': tile[c] = T.ONEWAY; tdir[c] = 1; break;
      case 's': tile[c] = T.ONEWAY; tdir[c] = 2; break;
      case 'w': tile[c] = T.ONEWAY; tdir[c] = 3; break;
      case '_': tile[c] = T.PLATE; break;
      case 'd': tile[c] = T.DOOR; break;
      case 'x': tile[c] = T.IDOOR; break;
      case '@': player = c; break;
      case 'b': crates.push(c); break;
      case '^': runners.push({ c, d: 0, st: 0 }); break;
      case '>': runners.push({ c, d: 1, st: 0 }); break;
      case 'v': runners.push({ c, d: 2, st: 0 }); break;
      case '<': runners.push({ c, d: 3, st: 0 }); break;
      case 'h': shuttles.push({ c, d: 1 }); break;
      case 'H': shuttles.push({ c, d: 3 }); break;
      case 'j': shuttles.push({ c, d: 2 }); break;
      case 'J': shuttles.push({ c, d: 0 }); break;
      case '/': fixed[c] = { k: 'mirror', m: '/' }; break;
      case '\\': fixed[c] = { k: 'mirror', m: '\\' }; break;
      case '*': fixed[c] = { k: 'eye', id: eyes.length }; eyes.push(c); break;
      case '%': veils.push(c); veilInit.push(true); break;
      case '&': veils.push(c); veilInit.push(false); break;
      case 'U': fixed[c] = { k: 'emit', d: 0 }; emitters.push({ c, d: 0 }); break;
      case 'R': fixed[c] = { k: 'emit', d: 1 }; emitters.push({ c, d: 1 }); break;
      case 'D': fixed[c] = { k: 'emit', d: 2 }; emitters.push({ c, d: 2 }); break;
      case 'L': fixed[c] = { k: 'emit', d: 3 }; emitters.push({ c, d: 3 }); break;
      default:
        if (ch >= '1' && ch <= '9') { tile[c] = T.GATE; gates0.push({ c, n: ch.charCodeAt(0) - 48 }); }
        else throw new Error('bad char ' + JSON.stringify(ch) + ' at ' + x + ',' + y + ' in ' + def.name);
    }
  }
  // optional layer of tiles under entities: '=' track, '_' plate, 'E' exit
  if (def.under) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = (def.under[y] || '')[x];
    if (ch === '=') tile[at(x, y)] = T.TRACK;
    else if (ch === '_') tile[at(x, y)] = T.PLATE;
  }
  for (const g of (def.gates || [])) { const c = at(g[0], g[1]); tile[c] = T.GATE; gates0.push({ c, n: g[2] }); }
  for (const e of (def.extras || [])) {
    const c = at(e.x, e.y);
    if (e.t === 'crate') crates.push(c);
    else if (e.t === 'player') player = c;
    else if (e.t === 'veil') { veils.push(c); veilInit.push(e.on !== false); }
    else if (e.t === 'runner') runners.push({ c, d: DNAME.indexOf(e.d), st: 0 });
    else if (e.t === 'shuttle') shuttles.push({ c, d: DNAME.indexOf(e.d) });
  }
  if (player < 0) throw new Error('no player in ' + def.name);
  const lvl = { name: def.name, W, H, N, tile, tdir, fixed, emitters, eyes, veils, def,
    hasPlates: tile.some(t => t === T.PLATE) };
  const st = {
    t: 0, p: player,
    crates: crates.slice().sort((a, b) => a - b),
    runners: runners.map(r => ({ c: r.c, d: r.d, st: 0 })),
    shuttles: shuttles.map(s => ({ c: s.c, d: s.d, smear: false, ac: 0, ad: 0, at: 0, track: null })),
    gates: gates0.map(g => ({ c: g.c, n: g.n, closed: false })),
    filled: [],
    veil: veilInit.slice(),
    won: false,
  };
  return { lvl, st };
}

function clone(s) {
  return {
    t: s.t, p: s.p, crates: s.crates.slice(),
    runners: s.runners.map(r => ({ c: r.c, d: r.d, st: r.st })),
    shuttles: s.shuttles.map(q => ({ c: q.c, d: q.d, smear: q.smear, ac: q.ac, ad: q.ad, at: q.at, track: q.track, cyc: q.cyc })),
    gates: s.gates.map(g => ({ c: g.c, n: g.n, closed: g.closed })),
    filled: s.filled.slice(), veil: s.veil.slice(), won: s.won,
  };
}

// ---------------------------------------------------------------- occupancy
// codes: 0 empty; 1 player; 2 crate; 3 runner; 4 shuttle; 5 smear; 6 veil
function buildOcc(L, s) {
  const occ = new Int16Array(L.N), who = new Int16Array(L.N).fill(-1);
  occ[s.p] = 1;
  s.crates.forEach((c, i) => { occ[c] = 2; who[c] = i; });
  s.runners.forEach((r, i) => { if (r.st !== 2) { occ[r.c] = 3; who[r.c] = i; } });
  s.shuttles.forEach((q, i) => {
    if (q.smear) { for (const c of q.track) { if (!occ[c]) { occ[c] = 5; who[c] = i; } } }
    else { occ[q.c] = 4; who[q.c] = i; }
  });
  L.veils.forEach((c, i) => { if (s.veil[i] && !occ[c]) { occ[c] = 6; who[c] = i; } });
  return { occ, who };
}

function isPitOpen(L, s, c) { return L.tile[c] === T.PIT && s.filled.indexOf(c) < 0; }
function gateAt(s, c) { for (const g of s.gates) if (g.c === c) return g; return null; }
function platesPressed(L, s, occ) {
  if (!L.hasPlates) return false;
  for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PLATE && occ[c]) return true;
  return false;
}
function doorClosed(L, c, pressed, occ) {
  const t = L.tile[c];
  if (t === T.DOOR) return !pressed && !occ[c];
  if (t === T.IDOOR) return pressed && !occ[c];
  return false;
}
// permanent obstruction for something moving from `from` into c in direction d
function permBlocked(L, s, from, c, d) {
  if (c < 0) return true;
  const t = L.tile[c];
  if (t === T.STONE) return true;
  if (L.fixed[c]) return true;
  if (t === T.ONEWAY && L.tdir[c] !== d) return true;
  if (from >= 0 && L.tile[from] === T.ONEWAY && L.tdir[from] !== d) return true;
  if (t === T.GATE) { const g = gateAt(s, c); if (g && g.closed) return true; }
  return false;
}
function step(L, c, d) {
  const x = c % L.W + DX[d], y = (c / L.W | 0) + DY[d];
  if (x < 0 || y < 0 || x >= L.W || y >= L.H) return -1;
  return y * L.W + x;
}

// ---------------------------------------------------------------- one tick of autonomous processes
// rec (optional) collects default-future bookkeeping
function tickProcesses(L, s, rec, tk, skipSmear) {
  let O = buildOcc(L, s);
  let pressed = platesPressed(L, s, O.occ);
  // runners
  for (let i = 0; i < s.runners.length; i++) {
    const r = s.runners[i];
    if (r.st !== 0) continue;
    const tgt = step(L, r.c, r.d);
    if (permBlocked(L, s, r.c, tgt, r.d)) { r.st = 1; if (rec) rec.rDone[i] = tk; continue; }
    if (isPitOpen(L, s, tgt)) {
      if (rec) rec.rMoves[i].push([tgt, tk]);
      s.filled.push(tgt); r.c = tgt; r.st = 2;
      O = buildOcc(L, s); pressed = platesPressed(L, s, O.occ);
      continue;
    }
    if (doorClosed(L, tgt, pressed, O.occ)) { if (rec) rec.rWaits[i].push([tk, 'door', -1]); continue; }
    const o = O.occ[tgt];
    if (o) {
      if (rec) rec.rWaits[i].push([tk, ['', 'player', 'crate', 'runner', 'shuttle', 'smear', 'veil'][o], O.who[tgt]]);
      continue;
    }
    if (rec) rec.rMoves[i].push([tgt, tk]);
    r.c = tgt;
    O = buildOcc(L, s); pressed = platesPressed(L, s, O.occ);
  }
  // shuttles
  for (let i = 0; i < s.shuttles.length; i++) {
    const q = s.shuttles[i];
    if (q.smear && skipSmear) continue;
    const tgt = step(L, q.c, q.d);
    if (permBlocked(L, s, q.c, tgt, q.d) || isPitOpen(L, s, tgt)) { q.d = (q.d + 2) % 4; if (rec) rec.sCells[i].add(q.c); continue; }
    if (doorClosed(L, tgt, pressed, O.occ)) { if (rec) rec.sWaits[i].push([tk, 'door', -1]); continue; }
    const o = O.occ[tgt];
    if (o && !(o === 5 && O.who[tgt] === i)) {
      if (rec) rec.sWaits[i].push([tk, ['', 'player', 'crate', 'runner', 'shuttle', 'smear', 'veil'][o], O.who[tgt]]);
      continue;
    }
    q.c = tgt;
    if (rec) rec.sCells[i].add(tgt);
    if (!q.smear) { O = buildOcc(L, s); pressed = platesPressed(L, s, O.occ); }
  }
  // gates
  O = buildOcc(L, s);
  for (let j = 0; j < s.gates.length; j++) {
    const g = s.gates[j];
    if (g.closed) continue;
    if (g.n > 0) g.n--;
    if (g.n === 0 && !O.occ[g.c]) { g.closed = true; if (rec) rec.gClose[j] = tk; }
  }
}

// position of a smeared shuttle at time t (it has been running unobstructed since its anchor)
function shuttleCycle(L, s, c, d) {
  // list of (c,d) states from (c,d) until the state repeats; returns {states, start} where states[start..] is the cycle
  const states = [], seen = new Map();
  for (let k = 0; k < 8 * L.N + 8; k++) {
    const key = c * 4 + d;
    if (seen.has(key)) return { states, start: seen.get(key) };
    seen.set(key, states.length); states.push([c, d]);
    const tgt = step(L, c, d);
    if (permBlocked(L, s, c, tgt, d) || isPitOpen(L, s, tgt)) d = (d + 2) % 4; else c = tgt;
  }
  return { states, start: 0 };
}
function smearPhase(L, s, q, t) {
  if (!q.cyc) q.cyc = shuttleCycle(L, s, q.ac, q.ad);
  const { states, start } = q.cyc;
  let n = t - q.at;
  if (n < states.length) { const st = states[n]; return { c: st[0], d: st[1] }; }
  const per = states.length - start;
  const st = states[start + ((n - start) % per)];
  return { c: st[0], d: st[1] };
}
function shuttleTrack(L, s, c, d) {
  // cells visited over a full period when running alone on its track
  const seen = new Set(), states = new Set();
  for (let k = 0; k < 4 * L.N + 8; k++) {
    seen.add(c);
    const key = c * 4 + d;
    if (states.has(key)) break;
    states.add(key);
    const tgt = step(L, c, d);
    if (permBlocked(L, s, c, tgt, d) || isPitOpen(L, s, tgt)) d = (d + 2) % 4; else c = tgt;
  }
  return Array.from(seen).sort((a, b) => a - b);
}

// ---------------------------------------------------------------- default future
const HORIZON = 72;
function snapKey(s) {
  let k = '';
  for (const r of s.runners) k += r.c + ':' + r.st + ',';
  for (const g of s.gates) k += (g.closed ? 'X' : g.n) + ',';
  return k;
}
function simulateDefault(L, s0) {
  const s = clone(s0);
  // smeared shuttles run as ordinary shuttles from their current phase
  for (const q of s.shuttles) if (q.smear) { const ph = smearPhase(L, s0, q, s0.t); q.c = ph.c; q.d = ph.d; q.smear = false; q.track = null; }
  const rec = {
    rMoves: s.runners.map(() => []), rWaits: s.runners.map(() => []), rDone: s.runners.map(() => -1),
    sCells: s.shuttles.map(q => new Set([q.c])), sWaits: s.shuttles.map(() => []),
    gClose: s.gates.map(() => -1), plateUsers: new Set(), doorUsers: new Set(),
  };
  let quiet = 0;
  const minT = s.shuttles.length ? 4 * Math.max(L.W, L.H) + 4 : 0;
  for (let tk = 1; tk <= HORIZON; tk++) {
    const before = tk > minT ? snapKey(s) : null;
    tickProcesses(L, s, rec, tk, false);
    s.t++;
    if (before !== null && !s.shuttles.length) {
      if (snapKey(s) === before && !s.gates.some(g => !g.closed && g.n > 0)) { if (++quiet >= 2) break; } else quiet = 0;
    }
    if (L.hasPlates) {
      const O = buildOcc(L, s);
      for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PLATE && O.occ[c] >= 3 && O.occ[c] <= 4) rec.plateUsers.add((O.occ[c] === 3 ? 'r' : 's') + O.who[c]);
    }
  }
  rec.end = s;
  return rec;
}

// ---------------------------------------------------------------- reach analysis
function playerPassable(L, s, O, pressed, from, c, d) {
  if (c < 0) return false;
  if (L.tile[c] === T.TRACK) return false;
  if (permBlocked(L, s, from, c, d)) return false;
  if (isPitOpen(L, s, c)) return false;
  if (doorClosed(L, c, pressed, O.occ)) return false;
  return true;
}
// Reach analysis treats things that are moving (active runners, unsmeared shuttles) as passable —
// they will have moved on — and a smeared track as a destination you could step into but not through.
function reachOcc(L, s, O) {
  const r = new Int16Array(L.N);
  for (let c = 0; c < L.N; c++) {
    const o = O.occ[c];
    if (o === 3) { const rr = s.runners[O.who[c]]; r[c] = rr.st === 0 ? 0 : 3; }
    else if (o === 4) r[c] = 0;
    else r[c] = o;
  }
  return r;
}
function bfsBody(L, s, O, pressed) {
  const R = reachOcc(L, s, O);
  const dist = new Int32Array(L.N).fill(1e9);
  dist[s.p] = 0;
  const q = [s.p];
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    if (R[c] === 5) continue; // a smear cell can be entered (in principle) but not crossed
    for (let d = 0; d < 4; d++) {
      const n = step(L, c, d);
      if (n < 0 || dist[n] <= dist[c] + 1) continue;
      if (!playerPassable(L, s, O, pressed, c, n, d)) continue;
      if (R[n] && R[n] !== 1 && R[n] !== 5) continue;
      dist[n] = dist[c] + 1; q.push(n);
    }
  }
  return dist;
}
// earliest time any single crate can be pushed onto each cell (other crates static)
function bfsCrates(L, s, O, pressed) {
  const R = reachOcc(L, s, O);
  const best = new Int32Array(L.N).fill(1e9);
  for (let ci = 0; ci < s.crates.length; ci++) {
    const c0 = s.crates[ci];
    best[c0] = 0;
    const seen = new Set();
    const key = (p, b) => p * L.N + b;
    let frontier = [[s.p, c0]];
    seen.add(key(s.p, c0));
    for (let t = 0; frontier.length && t < 60; t++) {
      const next = [];
      for (const [p, b] of frontier) {
        if (R[b] === 5) continue; // crate pushed into a smear cell: counts, but goes no further
        for (let d = 0; d < 4; d++) {
          const n = step(L, p, d);
          if (n < 0) continue;
          if (!playerPassable(L, s, O, pressed, p, n, d)) continue;
          if (n === b) {
            const nb = step(L, b, d);
            if (nb < 0 || permBlocked(L, s, b, nb, d) || isPitOpen(L, s, nb) || doorClosed(L, nb, pressed, O.occ)) continue;
            const oc = R[nb];
            if (oc && oc !== 1 && oc !== 5) continue;
            if (oc === 2) continue;
            const k = key(n, nb);
            if (seen.has(k)) continue;
            seen.add(k); next.push([n, nb]);
            if (t + 1 < best[nb]) best[nb] = t + 1;
          } else {
            const oc = R[n];
            if (oc === 2 || oc === 3 || oc === 5 || oc === 6) continue;
            const k = key(n, b);
            if (seen.has(k)) continue;
            seen.add(k); next.push([n, b]);
          }
        }
      }
      frontier = next;
    }
  }
  return best;
}

// which processes are LIVE (you could still interfere in time); the rest are FATED
function computeLive(L, s, rec) {
  const O = buildOcc(L, s);
  const pressed = platesPressed(L, s, O.occ);
  const dB = bfsBody(L, s, O, pressed);
  const dC = s.crates.length ? bfsCrates(L, s, O, pressed) : null;
  const reach = c => Math.min(dB[c], dC ? dC[c] : 1e9);
  let plateReachable = false;
  if (L.hasPlates) for (let c = 0; c < L.N; c++) if (L.tile[c] === T.PLATE && reach(c) < 1e9) plateReachable = true;
  const nR = s.runners.length, nS = s.shuttles.length, nG = s.gates.length;
  const live = new Uint8Array(nR + nS + nG);
  const why = new Array(nR + nS + nG).fill(null);
  const id = { r: i => i, s: i => nR + i, g: j => nR + nS + j };
  const edges = [];
  for (let i = 0; i < nR; i++) {
    const r = s.runners[i];
    if (r.st !== 0) continue;
    for (const [c, tk] of rec.rMoves[i]) { if (reach(c) <= tk) { live[i] = 1; why[i] = { c, tk, by: dB[c] <= tk ? 'body' : 'crate' }; break; } }
    for (const [tk, kind, w] of rec.rWaits[i]) {
      if (kind === 'player') { live[i] = 1; why[i] = why[i] || { kind }; }
      else if (kind === 'crate') {
        // live if you could get next to that crate (and so move it)
        const cc = s.crates[w];
        for (let d = 0; d < 4; d++) { const nb = step(L, cc, d); if (nb >= 0 && dB[nb] < 1e9) { live[i] = 1; why[i] = why[i] || { kind }; break; } }
      }
      else if (kind === 'runner') edges.push([i, id.r(w)]);
      else if (kind === 'shuttle' || kind === 'smear') edges.push([i, id.s(w)]);
      else if (kind === 'door' && plateReachable) { live[i] = 1; why[i] = why[i] || { kind: 'door' }; }
    }
  }
  for (let i = 0; i < nS; i++) {
    const cells = rec.sCells[i];
    for (const c of cells) if (reach(c) < 1e9) { live[id.s(i)] = 1; why[id.s(i)] = { c }; break; }
    for (const [tk, kind, w] of rec.sWaits[i]) {
      if (kind === 'player' || kind === 'crate') live[id.s(i)] = 1;
      else if (kind === 'runner') edges.push([id.s(i), id.r(w)]);
      else if (kind === 'shuttle' || kind === 'smear') edges.push([id.s(i), id.s(w)]);
      else if (kind === 'door' && plateReachable) live[id.s(i)] = 1;
    }
  }
  for (let j = 0; j < nG; j++) {
    const g = s.gates[j];
    if (g.closed) continue;
    if (O.occ[g.c] === 1 || O.occ[g.c] === 2) { live[id.g(j)] = 1; continue; }
    if (reach(g.c) <= g.n) { live[id.g(j)] = 1; why[id.g(j)] = { c: g.c }; }
    // a runner that passes through or rests in the gate interacts with it
    for (let i = 0; i < nR; i++) for (const [c] of rec.rMoves[i]) if (c === g.c) edges.push([i, id.g(j)]);
    for (let i = 0; i < nS; i++) if (rec.sCells[i].has(g.c)) edges.push([id.s(i), id.g(j)]);
  }
  // plates: processes that press plates interact with processes that meet doors
  if (L.hasPlates) {
    const users = Array.from(rec.plateUsers).map(k => k[0] === 'r' ? id.r(+k.slice(1)) : id.s(+k.slice(1)));
    const doorers = [];
    for (let i = 0; i < nR; i++) if (rec.rWaits[i].some(w => w[1] === 'door')) doorers.push(id.r(i));
    for (let i = 0; i < nS; i++) if (rec.sWaits[i].some(w => w[1] === 'door')) doorers.push(id.s(i));
    for (const a of users) for (const b of doorers) if (a !== b) edges.push([a, b]);
  }
  // contagion: anything that interacts with something live is live
  let changed = true;
  while (changed) {
    changed = false;
    for (const [a, b] of edges) {
      if (live[a] && !live[b]) { live[b] = 1; changed = true; }
      if (live[b] && !live[a]) { live[a] = 1; changed = true; }
    }
  }
  return { live, why, dB, dC, nR, nS, nG };
}

// complete everything that is fated. returns list of fx events (empty if nothing happened)
function hasProcesses(s) {
  for (const r of s.runners) if (r.st === 0) return true;
  if (s.shuttles.length) return true;
  for (const g of s.gates) if (!g.closed) return true;
  return false;
}
function applyFate(L, s, fxOut) {
  if (L.naive) return false;
  if (!hasProcesses(s)) return false;
  let any = false;
  for (let iter = 0; iter < 12; iter++) {
    const rec = simulateDefault(L, s);
    const A = computeLive(L, s, rec);
    const end = rec.end;
    let did = false;
    for (let i = 0; i < s.runners.length; i++) {
      const r = s.runners[i];
      if (r.st !== 0 || A.live[i]) continue;
      const e = end.runners[i];
      if (e.c !== r.c || e.st !== r.st) {
        if (fxOut) fxOut.push({ k: 'fate', i, from: r.c, path: rec.rMoves[i].map(m => m[0]), st: e.st });
        if (e.st === 2 && s.filled.indexOf(e.c) < 0) s.filled.push(e.c);
        r.c = e.c; r.d = e.d; r.st = e.st; did = true;
      } else if (e.st === 1 && r.st === 0) { r.st = 1; did = true; }
    }
    for (let i = 0; i < s.shuttles.length; i++) {
      const q = s.shuttles[i];
      const lv = A.live[A.nR + i];
      if (!q.smear && !lv) {
        q.smear = true; q.ac = q.c; q.ad = q.d; q.at = s.t; q.cyc = null; q.track = shuttleTrack(L, s, q.c, q.d);
        if (fxOut) fxOut.push({ k: 'smear', i }); did = true;
      } else if (q.smear && lv) {
        const ph = smearPhase(L, s, q, s.t);
        q.smear = false; q.c = ph.c; q.d = ph.d; q.track = null; q.cyc = null;
        if (fxOut) fxOut.push({ k: 'collapse', i }); did = true;
      }
    }
    for (let j = 0; j < s.gates.length; j++) {
      const g = s.gates[j];
      if (g.closed || A.live[A.nR + A.nS + j]) continue;
      const e = end.gates[j];
      if (e.closed) { g.closed = true; g.n = 0; if (fxOut) fxOut.push({ k: 'gate', j }); did = true; }
      else if (g.n !== e.n) { g.n = e.n; did = true; }
    }
    if (!did) break;
    any = true;
  }
  return any;
}

// ---------------------------------------------------------------- light
function traceBeams(L, s, O) {
  O = O || buildOcc(L, s);
  const pressed = platesPressed(L, s, O.occ);
  let lit = 0;
  const segs = [];
  for (const em of L.emitters) {
    let c = em.c, d = em.d;
    const pts = [c];
    const seen = new Set();
    for (let k = 0; k < 4 * L.N; k++) {
      const n = step(L, c, d);
      if (n < 0) { pts.push(c); break; }
      const t = L.tile[n];
      const key = n * 4 + d;
      if (seen.has(key)) { pts.push(n); break; }
      seen.add(key);
      if (t === T.STONE) { pts.push(n); break; }
      if (t === T.GATE) { const g = gateAt(s, n); if (g && g.closed) { pts.push(n); break; } }
      if (doorClosed(L, n, pressed, O.occ)) { pts.push(n); break; }
      const f = L.fixed[n];
      if (f) {
        if (f.k === 'mirror') {
          pts.push(n);
          if (f.m === '/') d = [1, 0, 3, 2][d]; else d = [3, 2, 1, 0][d];
          c = n; continue;
        }
        if (f.k === 'eye') lit |= 1 << f.id;
        pts.push(n); break;
      }
      if (O.occ[n]) { pts.push(n); break; }
      c = n;
    }
    segs.push(pts);
  }
  return { lit, segs };
}

// ---------------------------------------------------------------- existence (Sine Qua Non)
function veilForcedLatent(L, s) {
  // a veil cannot condense into an occupied cell
  const O = buildOcc(L, Object.assign({}, s, { veil: s.veil.map(() => false) }));
  return L.veils.map(c => O.occ[c] !== 0);
}
function veilPriority(L, s) {
  const s2 = clone(s); s2.veil = s.veil.map(() => false);
  const O = buildOcc(L, s2);
  const pressed = platesPressed(L, s2, O.occ);
  const best = new Int32Array(L.N).fill(1 << 20);
  for (const em of L.emitters) {
    let c = em.c, d = em.d, k = 0;
    const seen = new Set();
    for (let it = 0; it < 4 * L.N; it++) {
      const nx = step(L, c, d); if (nx < 0) break;
      const key = nx * 4 + d; if (seen.has(key)) break; seen.add(key);
      k++;
      if (k < best[nx]) best[nx] = k;
      const t = L.tile[nx];
      if (t === T.STONE) break;
      if (t === T.GATE) { const g = gateAt(s2, nx); if (g && g.closed) break; }
      if (doorClosed(L, nx, pressed, O.occ)) break;
      const f = L.fixed[nx];
      if (f) { if (f.k === 'mirror') { d = f.m === '/' ? [1, 0, 3, 2][d] : [3, 2, 1, 0][d]; c = nx; continue; } break; }
      if (O.occ[nx]) break;
      c = nx;
    }
  }
  return L.veils.map((c, i) => best[c] + i * 1e-3);
}
function maskOf(arr) { let m = 0; arr.forEach((v, i) => { if (v) m |= 1 << i; }); return m; }
function outcomeFor(L, s, mask, cache) {
  if (cache.has(mask)) return cache.get(mask);
  const s2 = clone(s);
  s2.veil = L.veils.map((_, i) => !!(mask & (1 << i)));
  applyFate(L, s2, null);
  const out = traceBeams(L, s2).lit;
  cache.set(mask, out);
  return out;
}
function necessity(L, s, mask, forced, cache) {
  let nec = 0;
  for (let i = 0; i < L.veils.length; i++) {
    if (forced[i]) continue;
    const a = outcomeFor(L, s, mask | (1 << i), cache), b = outcomeFor(L, s, mask & ~(1 << i), cache);
    if (a !== b) nec |= 1 << i;
  }
  return nec;
}
function chooseExistence(L, s) {
  const n = L.veils.length;
  if (!n) return { mask: 0, paradox: false };
  if (L.naiveVeils) return { mask: (1 << n) - 1 & maskOf(veilForcedLatent(L, s).map(f => !f)), paradox: false };
  const forced = veilForcedLatent(L, s);
  let freeMask = 0; forced.forEach((f, i) => { if (!f) freeMask |= 1 << i; });
  const cur = maskOf(s.veil) & freeMask;
  const cache = new Map();
  const stable = m => necessity(L, s, m, forced, cache) === m;
  if (stable(cur)) return { mask: cur, paradox: false };
  const free = []; for (let i = 0; i < n; i++) if (freeMask & (1 << i)) free.push(i);
  // tie-break: veils nearer a light source (along the light, with all veils thin) are preferred
  const prio = veilPriority(L, s);
  free.sort((a, b) => prio[a] - prio[b] || a - b);
  // smallest change first; among equals, prefer flipping lower-index veils
  const combos = [];
  const k = free.length;
  for (let m = 1; m < (1 << k); m++) {
    let flips = 0, pc = 0;
    for (let b = 0; b < k; b++) if (m & (1 << b)) { flips |= 1 << free[b]; pc++; }
    combos.push([pc, flips]);
  }
  // rank flips by priority order (bit b of m corresponds to free[b], already priority-sorted)
  const rank = new Map(); free.forEach((v, r) => rank.set(v, r));
  const score = flips => { let sc = 0; for (let i = 0; i < n; i++) if (flips & (1 << i)) sc += 1 << (k - 1 - rank.get(i)); return -sc; };
  combos.sort((a, b) => a[0] - b[0] || score(a[1]) - score(b[1]));
  for (const [, flips] of combos) { const m = cur ^ flips; if (stable(m)) return { mask: m, paradox: false }; }
  // no consistent world exists: the veils flicker (one synchronous step per tick)
  return { mask: necessity(L, s, cur, forced, cache), paradox: true };
}

// ---------------------------------------------------------------- settle: existence <-> fate fixpoint
function settle(L, s, fx) {
  for (let iter = 0; iter < 10; iter++) {
    const ch = chooseExistence(L, s);
    const old = maskOf(s.veil);
    let exChanged = false;
    if (ch.mask !== old) {
      for (let i = 0; i < L.veils.length; i++) {
        const now = !!(ch.mask & (1 << i));
        if (now !== s.veil[i]) { s.veil[i] = now; if (fx) fx.push({ k: now ? 'condense' : 'dissolve', i }); }
      }
      exChanged = true;
    }
    s.paradox = ch.paradox;
    const fChanged = applyFate(L, s, fx);
    if (ch.paradox) break;
    if (!exChanged && !fChanged) break;
  }
}

// ---------------------------------------------------------------- player turn
function tryMove(L, s, d) {
  if (d < 0) return true; // wait
  const O = buildOcc(L, s);
  const pressed = platesPressed(L, s, O.occ);
  const n = step(L, s.p, d);
  if (!playerPassable(L, s, O, pressed, s.p, n, d)) return false;
  const o = O.occ[n];
  if (o === 2) {
    const nb = step(L, n, d);
    if (nb < 0 || permBlocked(L, s, n, nb, d) || doorClosed(L, nb, pressed, O.occ)) return false;
    if (O.occ[nb]) return false;
    const ci = s.crates.indexOf(n);
    if (isPitOpen(L, s, nb)) { s.crates.splice(ci, 1); s.filled.push(nb); s.moved = { k: 'fill', i: ci, from: n, to: nb }; }
    else { s.crates[ci] = nb; s.moved = { k: 'push', i: ci, from: n, to: nb }; }
    s.p = n;
    return true;
  }
  if (o) return false;
  s.p = n;
  return true;
}
// returns {ok, state, fx}
function turn(L, s0, d) {
  const s = clone(s0);
  if (s.won) return { ok: false, state: s0, fx: [] };
  s.moved = null;
  if (!tryMove(L, s, d)) return { ok: false, state: s0, fx: [] };
  const fx = [];
  if (s.moved) fx.push(s.moved);
  delete s.moved;
  const before = s.runners.map(r => r.st);
  tickProcesses(L, s, null, 0, true);
  s.runners.forEach((r, i) => { if (r.st === 2 && before[i] !== 2) fx.push({ k: 'sink', i, at: r.c }); });
  s.t++;
  settle(L, s, fx);
  if (L.tile[s.p] === T.EXIT) s.won = true;
  return { ok: true, state: s, fx };
}
function start(def, opts) {
  const { lvl, st } = parseLevel(def);
  if (opts) Object.assign(lvl, opts);
  const fx = [];
  settle(lvl, st, fx);
  return { L: lvl, s: st, fx };
}

// ---------------------------------------------------------------- analysis for display
function analyze(L, s) {
  const rec = simulateDefault(L, s);
  const A = computeLive(L, s, rec);
  const beams = traceBeams(L, s);
  // counterfactual light: for each existing veil, what the light would do without it
  const ghosts = [];
  L.veils.forEach((c, i) => {
    if (!s.veil[i]) return;
    const s2 = clone(s); s2.veil[i] = false;
    applyFate(L, s2, null);
    ghosts.push({ i, segs: traceBeams(L, s2).segs, lit: traceBeams(L, s2).lit });
  });
  return { rec, A, beams, ghosts };
}

// ---------------------------------------------------------------- hashing & solver
function key(L, s) {
  let k = s.p + '|' + s.crates.slice().sort((a, b) => a - b).join(',') + '|';
  for (const r of s.runners) k += r.c + ':' + r.d + ':' + r.st + ',';
  k += '|';
  for (const q of s.shuttles) {
    if (q.smear) { const ph = smearPhase(L, s, q, s.t); k += 'S' + ph.c + ':' + ph.d + ','; }
    else k += q.c + ':' + q.d + ',';
  }
  k += '|';
  for (const g of s.gates) k += (g.closed ? 'X' : g.n) + ',';
  k += '|' + s.filled.slice().sort((a, b) => a - b).join(',') + '|' + s.veil.map(v => v ? 1 : 0).join('');
  return k;
}
function solve(def, maxDepth, maxStates, opts) {
  maxDepth = maxDepth || 80; maxStates = maxStates || 200000;
  const { L, s } = start(def, opts);
  const seen = new Map();
  seen.set(key(L, s), null);
  let frontier = [s];
  const parent = new Map();
  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const next = [];
    for (const st of frontier) {
      for (const d of [0, 1, 2, 3, -1]) {
        const r = turn(L, st, d);
        if (!r.ok) continue;
        const k = key(L, r.state);
        if (seen.has(k)) continue;
        seen.set(k, { prev: key(L, st), d });
        if (r.state.won) {
          // reconstruct
          const moves = [];
          let kk = k;
          while (seen.get(kk)) { const e = seen.get(kk); moves.push(e.d < 0 ? '.' : DNAME[e.d]); kk = e.prev; }
          return { solved: true, moves: moves.reverse().join(''), states: seen.size };
        }
        next.push(r.state);
        if (seen.size > maxStates) return { solved: false, reason: 'cap', states: seen.size };
      }
    }
    frontier = next;
  }
  return { solved: false, reason: 'exhausted', states: seen.size };
}

const API = { T, DX, DY, DNAME, parseLevel, clone, buildOcc, start, turn, settle, analyze, traceBeams, simulateDefault,
  computeLive, applyFate, chooseExistence, solve, key, smearPhase, step, isPitOpen, gateAt, platesPressed, doorClosed };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Engine = API;
})(typeof self !== 'undefined' ? self : this);
