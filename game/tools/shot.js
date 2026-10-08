// usage: node shot.js file.html out.png [w h] [jsToRunBeforeShot] [waitMs]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, out, w='900', h='640', pre='', wait='800'] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  const logs = [];
  page.on('console', m => logs.push(m.type()+': '+m.text()));
  page.on('pageerror', e => logs.push('PAGEERROR: '+e.message));
  await page.goto('file://' + require('path').resolve(file));
  await page.waitForTimeout(300);
  if (pre) { try { const r = await page.evaluate(pre); if (r !== undefined) logs.push('EVAL: '+JSON.stringify(r)); } catch(e) { logs.push('EVALERR: '+e.message); } }
  await page.waitForTimeout(+wait);
  await page.screenshot({ path: out });
  console.log(logs.join('\n'));
  await browser.close();
})();
