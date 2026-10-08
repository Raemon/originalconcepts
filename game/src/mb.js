// tiny map builder
class MB {
  constructor(W, H) { this.W = W; this.H = H; this.g = Array.from({ length: H }, () => Array(W).fill('#')); this.u = Array.from({ length: H }, () => Array(W).fill(' ')); this.gates = []; }
  set(x, y, ch) { this.g[y][x] = ch; return this; }
  under(x, y, ch) { this.u[y][x] = ch; return this; }
  rect(x0, y0, x1, y1, ch = '.') { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.g[y][x] = ch; return this; }
  hline(x0, x1, y, ch = '.') { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.g[y][x] = ch; return this; }
  vline(x, y0, y1, ch = '.') { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.g[y][x] = ch; return this; }
  gate(x, y, n) { this.g[y][x] = '.'; this.gates.push([x, y, n]); return this; }
  out(name, extra = {}) {
    return Object.assign({ name, map: this.g.map(r => r.join('')), under: this.u.map(r => r.join('')), gates: this.gates }, extra);
  }
}
module.exports = MB;
