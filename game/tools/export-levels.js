// node game/tools/export-levels.js  -> writes game/src/levels.json and verifies each level is solvable
const path = require('path'), fs = require('fs');
const E = require('../src/engine.js');
const levels = require('../src/levels.src.js');
fs.writeFileSync(path.join(__dirname, '../src/levels.json'), JSON.stringify(levels));
let bad = 0;
for (const l of levels) {
  const def = Object.assign({ name: l.title }, l);
  const t0 = Date.now();
  const r = E.solve(def, 70, 400000);
  if (!r.solved) bad++;
  console.log(l.ch.padEnd(4), l.title.padEnd(14), (l.map[0].length + 'x' + l.map.length).padEnd(6),
    r.solved ? ('solved in ' + r.moves.length + ': ' + r.moves) : ('UNSOLVED (' + r.reason + ')'), (Date.now() - t0) + 'ms');
}
process.exit(bad ? 1 : 0);
