// capture frames: node frames.js file.html outPrefix levelIndex "moves" [frameTimesMs...]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const [file, out, li, moves, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 760, height: 640 } });
  page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto('file://' + path.resolve(file));
  await page.waitForTimeout(250);
  await page.evaluate(([li, moves]) => { WMB.closeMenu(); WMB.load(+li); WMB.hideCard(); for (const m of moves.slice(0, -1)) WMB.act(m === '.' ? -1 : 'NESW'.indexOf(m)); }, [li, moves]);
  await page.waitForTimeout(500);
  const last = moves.slice(-1);
  await page.evaluate(m => { if (m) WMB.act(m === '.' ? -1 : 'NESW'.indexOf(m)); }, last);
  let t0 = 0;
  for (const t of times.map(Number)) { await page.waitForTimeout(t - t0); t0 = t; await page.screenshot({ path: out + '_' + t + '.png', clip: { x: 0, y: 60, width: 760, height: 440 } }); }
  await browser.close();
})();
