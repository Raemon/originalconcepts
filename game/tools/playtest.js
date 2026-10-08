// Plays every level's solver solution inside the real built page and checks it wins.
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const path = require('path');
const E = require('../src/engine.js');
const levels = require('../src/levels.src.js');
(async () => {
  const file = path.resolve(process.argv[2] || 'dist/what-must-be.html');
  const shotDir = process.argv[3];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 760, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + file);
  await page.waitForTimeout(300);
  let ok = 0;
  for (let i = 0; i < levels.length; i++) {
    const def = Object.assign({ name: levels[i].title }, levels[i]);
    const sol = E.solve(def, 70, 400000);
    if (!sol.solved) { console.log('no solution for', levels[i].title); continue; }
    const won = await page.evaluate(([i, moves]) => {
      WMB.closeMenu(); WMB.load(i); WMB.hideCard();
      for (const m of moves) WMB.act(m === '.' ? -1 : 'NESW'.indexOf(m));
      return WMB.state().won;
    }, [i, sol.moves]);
    console.log((won ? 'WIN ' : 'FAIL') + ' ' + levels[i].title + ' (' + sol.moves.length + ' moves)');
    if (won) ok++;
    if (shotDir) { await page.waitForTimeout(600); await page.screenshot({ path: path.join(shotDir, 'won' + i + '.png') }); }
  }
  console.log(ok + '/' + levels.length + ' levels won in-page; errors: ' + (errors.length ? errors.join(' | ') : 'none'));
  await browser.close();
})();
