// Level definitions for "What Must Be".
// Map legend (see engine.js parseLevel):
//   #  stone          .  floor          E  exit           O  pit (fill with a crate or runner)
//   =  rail (runners and pushed crates may enter; you may not)
//   n e s w  one-way tiles       _  plate      d  door (open while any plate is pressed)
//   x  door (closed while any plate is pressed)            1-9 / gates[]  gate that closes after N turns
//   @  you    b  crate    > < ^ v  runner (rolls until stopped)    h H j J  shuttle (back and forth)
//   R L U D  lamp shooting right/left/up/down     / \  mirrors     *  eye
//   %  veil (present at start)    &  veil (absent at start)
// `under` gives the tile beneath an entity ('=' rail, '_' plate).
const MB = require('./mb.js');
const L = [];
const add = (ch, title, text, def) => L.push(Object.assign({ ch, title, text }, def));

// ───────────────────────── I · ALREADY ─────────────────────────
{
  const m = new MB(14, 10);
  m.vline(3, 2, 7, '='); m.set(3, 1, 'v'); m.under(3, 1, '=');
  m.vline(10, 2, 5, '='); m.set(10, 1, 'v'); m.under(10, 1, '='); m.set(10, 6, '.'); m.set(10, 7, '=');
  m.set(11, 6, '.'); m.set(11, 7, '.');
  m.hline(1, 12, 8); m.set(1, 8, 'E'); m.set(3, 8, 'O'); m.set(10, 8, 'O'); m.set(12, 8, '@');
  add('I', 'Already', 'The runner sealed in stone has already done everything it will ever do. The one you could reach is still on its way.', m.out());
}
add('I', 'Commit', 'Waiting for the bridge is how you lose the gate. The bridge forms the moment you can no longer stop it.', {
  map: [
    '###############',
    '######.....O.E#',
    '######n####=###',
    '#..........=###',
    '#..........=###',
    '#..........=###',
    '#..........@###',
    '#..........=###',
    '#..........=###',
    '#..........=###',
    '###########^###',
    '###############'],
  under: ['', '', '', '', '', '', '', '', '', '', '           ='],
  gates: [[8, 1, 14]],
});
{
  const m = new MB(18, 7);
  m.hline(1, 12, 1, '='); m.set(1, 1, '>'); m.under(1, 1, '='); m.set(12, 1, '_');
  m.rect(1, 2, 12, 4);
  m.set(13, 3, 'x'); m.set(14, 3, '.'); m.set(15, 3, 'E');
  m.set(4, 2, 'b'); m.set(2, 3, '@');
  add('I', 'Doorstop', 'You cannot outrun what you cannot stop.', m.out());
}
add('I', 'Power', 'A machine you can never touch is already everywhere on its rail. Make yourself able to touch it.', {
  map: [
    '##############',
    '#H====_=.===##',
    '########.#####',
    '########O#####',
    '#..@....b....#',
    '#...........x#',
    '#..........#E#',
    '##############'],
  under: ['', '#='],
});

// ───────────────────────── II · NEEDED ─────────────────────────
add('II', 'Needed', 'A wall that changes nothing is not there. Give its work to something else.', {
  map: [
    '#############',
    '#.....#.....#',
    '#R....\\...E.#',
    '#..b..%.....#',
    '#.....*.....#',
    '#.@...#.....#',
    '#############'],
});
add('II', 'Walk the Light', "Your shadow can do a wall's work.", {
  map: [
    '##########',
    '#@....D###',
    '#####.:###',
    '######:###',
    '######%###',
    '######:###',
    '######:.E#',
    '######*###',
    '##########'],
});
{
  const m = new MB(10, 9);
  m.rect(1, 1, 8, 2);
  m.set(4, 1, 'D'); m.set(4, 2, 'b'); m.set(4, 3, '.'); m.set(4, 4, '&'); m.set(4, 5, '*');
  m.set(1, 4, 'R'); m.hline(2, 3, 4); m.set(5, 4, '.'); m.set(6, 4, '%'); m.set(7, 4, '.'); m.set(8, 4, '*');
  m.set(6, 3, '.'); m.vline(6, 5, 6); m.set(6, 7, 'E');
  m.set(2, 2, '@');
  add('II', 'Chain', 'Take a reason away here, and something else becomes necessary there.', m.out());
}
{
  const m = new MB(12, 11);
  m.rect(1, 1, 10, 3);
  m.set(5, 1, 'D'); m.vline(5, 2, 7); m.set(5, 8, '*'); m.set(5, 6, '%');
  m.set(1, 6, 'R'); m.hline(2, 4, 6); m.hline(6, 9, 6); m.set(10, 6, '*');
  m.set(6, 7, '.'); m.set(6, 8, '.'); m.set(7, 8, 'E');
  m.set(3, 4, '.'); m.set(3, 5, '.');
  m.set(8, 2, 'b'); m.set(2, 2, '@');
  add('II', 'Both', 'One wall, two reasons.', m.out());
}

// ─────────────────────── III · PERMISSION ───────────────────────
{
  const m = new MB(12, 9);
  m.hline(1, 9, 2, '='); m.set(1, 2, 'h'); m.under(1, 2, '='); m.set(5, 2, '.');
  m.set(4, 1, 'D'); m.set(5, 1, 'E');
  m.rect(1, 3, 10, 6); m.set(5, 3, '%'); m.set(4, 7, '*');
  m.set(9, 5, '@');
  add('III', 'Guardian', 'This wall touches no light. Ask what it keeps you from.', m.out());
}
{
  const m = new MB(22, 11);
  m.hline(1, 18, 2, '='); m.set(1, 2, '>'); m.under(1, 2, '=');
  m.set(9, 2, '&'); m.under(9, 2, '=');
  m.set(13, 2, '.');
  m.set(18, 2, '.'); m.under(18, 2, '_');
  m.set(18, 1, 'D'); m.set(18, 3, '.'); m.set(18, 4, '*');
  m.rect(11, 3, 15, 5);
  m.vline(13, 6, 7); m.hline(2, 13, 7);
  m.set(2, 8, 'd'); m.set(2, 9, 'E');
  m.set(13, 4, '@');
  add('III', 'Escort', 'It is allowed through only while you could still stop it.', m.out());
}
{
  const m = new MB(20, 9);
  m.rect(3, 1, 11, 2);
  m.set(12, 1, 'x'); m.set(13, 1, '.'); m.set(14, 1, 'O'); m.set(15, 1, 'E');
  m.hline(1, 16, 3, '='); m.set(1, 3, '>'); m.under(1, 3, '=');
  m.set(8, 3, '.');
  m.set(11, 3, '&'); m.under(11, 3, '=');
  m.set(16, 3, '.'); m.under(16, 3, '_');
  m.set(16, 2, '.'); m.set(16, 1, '*'); m.set(16, 4, 'U');
  m.rect(2, 4, 13, 6);
  m.set(8, 5, 'b'); m.set(6, 5, '@');
  add('III', 'Veto', 'Let go, and the world will stop it for you.', m.out());
}
{
  const m = new MB(22, 14);
  m.hline(1, 9, 2, '='); m.set(1, 2, 'h'); m.under(1, 2, '='); m.set(5, 2, '.');
  m.set(4, 1, 'D'); m.rect(1, 3, 9, 5); m.set(5, 3, '%'); m.set(4, 6, '*');
  m.set(5, 1, '.'); m.hline(5, 14, 1); m.vline(14, 1, 8);
  m.hline(1, 18, 9, '='); m.set(1, 9, '>'); m.under(1, 9, '=');
  m.set(9, 9, '&'); m.under(9, 9, '='); m.set(14, 9, '.'); m.set(18, 9, '.'); m.under(18, 9, '_');
  m.set(18, 8, 'D'); m.set(18, 10, '.'); m.set(18, 11, '*');
  m.vline(14, 10, 12); m.hline(14, 16, 12); m.set(16, 12, 'd'); m.set(17, 12, 'E');
  m.set(8, 4, '@');
  add('III', 'The Last Door', 'Everything at once.', m.out());
}

module.exports = L.map(l => {
  const o = { ch: l.ch, title: l.title, text: l.text, map: l.map };
  if (l.under && l.under.some(r => r && r.trim())) o.under = l.under;
  if (l.gates && l.gates.length) o.gates = l.gates;
  return o;
});
