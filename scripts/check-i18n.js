// Verify that i18n/en.json and i18n/ja.json have exactly the same structure as i18n/zh.json
// (same keys, same array lengths, same nulls). Lists every mismatch it finds.
// Usage: node scripts/check-i18n.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'i18n');
const load = l => JSON.parse(fs.readFileSync(path.join(dir, l + '.json'), 'utf8'));
const zh = load('zh');
let bad = 0;
function cmp(a, b, p, lang) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return report(p, lang, 'should be an array');
    if (a.length !== b.length) report(p, lang, `array length ${b.length}, expected ${a.length}`);
    a.forEach((v, i) => b[i] !== undefined && cmp(v, b[i], `${p}[${i}]`, lang));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return report(p, lang, 'should be an object');
    for (const k of Object.keys(a)) k in b ? cmp(a[k], b[k], `${p}.${k}`, lang) : report(`${p}.${k}`, lang, 'missing');
    for (const k of Object.keys(b)) if (!(k in a)) report(`${p}.${k}`, lang, 'extra key not in zh.json');
  } else if ((a === null) !== (b === null)) report(p, lang, 'null mismatch');
}
function report(p, lang, msg) { bad++; console.log(`[${lang}] ${p || '(root)'}: ${msg}`); }
for (const lang of ['en', 'ja']) cmp(zh, load(lang), '', lang);
if (bad) { console.log(`\n${bad} problem(s). Fix them, then run node scripts/build-i18n.js`); process.exit(1); }
console.log('i18n OK: en.json and ja.json match zh.json');
