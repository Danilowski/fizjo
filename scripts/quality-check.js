const fs = require('fs');
const path = require('path');

const root = __dirname.replace(/\/scripts$/, '');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const checks = [
  ['CSS has scroll padding', /scroll-padding-top\s*:/, css],
  ['CSS has scroll margin', /scroll-margin-top\s*:/, css],
  ['Meta viewport present', /<meta name="viewport"/, html],
  ['Main CTA present', /Umów wizytę online/, html],
  ['Reviews section present', /Opinie pacjentów/, html],
  ['JS has review config', /ZNANY_LEKARZ_REVIEW_COUNT/, js],
  ['JS has initial review limit', /getInitialVisibleReviews|INITIAL_VISIBLE_REVIEWS/, js],
  ['JS has DOM ready bootstrap', /DOMContentLoaded/, js]
];

let failed = false;
for (const [label, regex, source] of checks) {
  if (!regex.test(source)) {
    console.error(`Quality check failed: ${label}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('Quality checks passed. Core quality and structure guardrails are in place.');
