const fs = require('fs');
const path = require('path');

const root = __dirname.replace(/\/scripts$/, '');
const files = [
  'index.html',
  'style.css',
  'script.js',
  'style.min.css',
  'script.min.js'
];

let failed = false;
for (const file of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing expected file: ${file}`);
    failed = true;
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const requiredChecks = [
  'M.Therapy',
  'O Mnie',
  'Opinie pacjentów',
  'Umów wizytę online',
  'Cennik',
  'Kontakt'
];

for (const check of requiredChecks) {
  if (!html.includes(check)) {
    console.error(`Missing required text: ${check}`);
    failed = true;
  }
}

const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
if (!css.includes('scroll-padding-top') || !css.includes('scroll-margin-top')) {
  console.error('Missing sticky-scroll offset styles');
  failed = true;
}

if (failed) {
  console.error('Smoke test failed.');
  process.exit(1);
}

console.log('Smoke test passed. Core homepage content and key CSS hooks are present.');
