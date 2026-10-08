const E = require('./engine.js');
function render(L, s) {
  const O = E.buildOcc(L, s);
  const beams = E.traceBeams(L, s);
  const beamCells = new Set();
  for (const seg of beams.segs) {
    for (let k = 0; k + 1 < seg.length; k++) {
      let a = seg[k], b = seg[k + 1];
      const ax = a % L.W, ay = a / L.W | 0, bx = b % L.W, by = b / L.W | 0;
      const sx = Math.sign(bx - ax), sy = Math.sign(by - ay);
      let x = ax, y = ay;
      while (x !== bx || y !== by) { x += sx; y += sy; beamCells.add(y * L.W + x); }
    }
  }
  const pressed = E.platesPressed(L, s, O.occ);
  let out = '';
  for (let y = 0; y < L.H; y++) {
    let row = '';
    for (let x = 0; x < L.W; x++) {
      const c = y * L.W + x;
      const t = L.tile[c];
      let ch = '.';
      if (t === E.T.STONE) ch = '#';
      else if (t === E.T.EXIT) ch = 'E';
      else if (t === E.T.PIT) ch = E.isPitOpen(L, s, c) ? 'O' : '_';
      else if (t === E.T.ONEWAY) ch = 'nesw'[L.tdir[c]];
      else if (t === E.T.TRACK) ch = '=';
      else if (t === E.T.PLATE) ch = 'p';
      else if (t === E.T.DOOR || t === E.T.IDOOR) ch = E.doorClosed(L, c, pressed, O.occ) ? 'D' : 'd';
      else if (t === E.T.GATE) { const g = E.gateAt(s, c); ch = g.closed ? 'X' : String(Math.min(9, g.n)); }
      if (beamCells.has(c) && ch === '.') ch = ':';
      const f = L.fixed[c];
      if (f) ch = f.k === 'mirror' ? f.m : f.k === 'eye' ? ((beams.lit >> f.id) & 1 ? '*' : 'o') : 'UREL'[0] && 'URDL'[f.d];
      const o = O.occ[c];
      if (o === 1) ch = '@';
      else if (o === 2) ch = 'b';
      else if (o === 3) { const r = s.runners[O.who[c]]; ch = r.st === 1 ? 'r' : '^>v<'[r.d]; }
      else if (o === 4) ch = 'h';
      else if (o === 5) ch = '~';
      else if (o === 6) ch = '%';
      else if (L.veils.indexOf(c) >= 0 && ch === '.') ch = "'";
      else if (L.veils.indexOf(c) >= 0 && ch === ':') ch = ';';
      row += ch;
    }
    out += row + '\n';
  }
  return out;
}
function play(def, moves, verbose = true) {
  let { L, s, fx } = E.start(def);
  if (verbose) console.log('== ' + def.name + ' (start) fx=' + JSON.stringify(fx) + '\n' + render(L, s));
  for (const m of moves) {
    const d = m === '.' ? -1 : 'NESW'.indexOf(m);
    const r = E.turn(L, s, d);
    if (!r.ok) { if (verbose) console.log('blocked move ' + m); continue; }
    s = r.state;
    if (verbose) console.log('after ' + m + ' t=' + s.t + (s.won ? ' WON' : '') + ' fx=' + JSON.stringify(r.fx.map(f => f.k + (f.i !== undefined ? f.i : '') + (f.j !== undefined ? 'g' + f.j : ''))) + '\n' + render(L, s));
  }
  return { L, s };
}
module.exports = { render, play };
