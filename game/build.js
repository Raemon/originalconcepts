// Builds dist/what-must-be.html: a single self-contained file (no external resources).
const fs = require('fs'), path = require('path');
const src = p => fs.readFileSync(path.join(__dirname, 'src', p), 'utf8');
const levels = require('./src/levels.src.js');
fs.writeFileSync(path.join(__dirname, 'src', 'levels.json'), JSON.stringify(levels));
const fill = (tpl, marker, text) => tpl.split(marker).join(text);
let html = src('template.html');
html = fill(html, '/*__STYLE__*/', src('style.css'));
html = fill(html, '/*__ENGINE__*/', src('engine.js'));
html = fill(html, '/*__LEVELS__*/', JSON.stringify(levels));
html = fill(html, '/*__GAME__*/', src('game.js'));
if (/<\/script>/i.test(src('engine.js') + src('game.js'))) throw new Error('script contains </script>');
const out = path.join(__dirname, '..', 'dist', 'what-must-be.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote', out, (html.length / 1024).toFixed(1) + ' KB');
// claude.ai Artifact variant: the host supplies the document skeleton, so ship only title, style and content
const head = html.slice(html.indexOf('<title>'), html.indexOf('</head>'));
const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
const art = path.join(__dirname, '..', 'dist', 'artifact', 'what-must-be.html');
fs.mkdirSync(path.dirname(art), { recursive: true });
fs.writeFileSync(art, head.trim() + '\n' + body.trim() + '\n');
console.log('wrote', art);
