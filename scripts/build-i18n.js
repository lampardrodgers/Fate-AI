// Wrap i18n/<lang>.json into i18n/<lang>.js so the page also works when opened via file://
// Usage: node scripts/build-i18n.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'i18n');
for (const lang of ['en', 'ja']) {
  const json = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
  fs.writeFileSync(path.join(dir, lang + '.js'),
    `window.I18N=window.I18N||{};window.I18N.${lang}=${JSON.stringify(json)};\n`);
  console.log('built i18n/' + lang + '.js');
}
