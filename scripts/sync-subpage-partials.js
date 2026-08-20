const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const headerPartial = fs.readFileSync(path.join(ROOT, 'partials', 'subpage-header.html'), 'utf8').trim();
const footerPartial = fs.readFileSync(path.join(ROOT, 'partials', 'subpage-footer.html'), 'utf8').trim();

const pages = [
  'fizjoterapia-ortopedyczna-bydgoszcz/index.html',
  'fizjoterapia-stomatologiczna-bydgoszcz/index.html',
  'kontakt-i-dojazd/index.html',
  'pierwsza-wizyta/index.html',
  'rehabilitacja-pooperacyjna-bydgoszcz/index.html',
  'terapia-bruksizmu-bydgoszcz/index.html'
];

const headerBlock = [
  '<!-- SHARED_SUBPAGE_HEADER_START -->',
  headerPartial,
  '<!-- SHARED_SUBPAGE_HEADER_END -->'
].join('\n');

const footerBlock = [
  '<!-- SHARED_SUBPAGE_FOOTER_START -->',
  footerPartial,
  '<!-- SHARED_SUBPAGE_FOOTER_END -->'
].join('\n');

const markerHeaderRegex = /<!-- SHARED_SUBPAGE_HEADER_START -->[\s\S]*?<!-- SHARED_SUBPAGE_HEADER_END -->/;
const markerFooterRegex = /<!-- SHARED_SUBPAGE_FOOTER_START -->[\s\S]*?<!-- SHARED_SUBPAGE_FOOTER_END -->/;

const legacyHeaderRegex = /<a class="skip-link"[\s\S]*?<\/header>/;
const legacyFooterRegex = /<div class="mobile-action-bar"[\s\S]*?<\/footer>/;

for (const relPath of pages) {
  const absPath = path.join(ROOT, relPath);
  let html = fs.readFileSync(absPath, 'utf8');

  if (markerHeaderRegex.test(html)) {
    html = html.replace(markerHeaderRegex, headerBlock);
  } else if (legacyHeaderRegex.test(html)) {
    html = html.replace(legacyHeaderRegex, headerBlock);
  } else {
    throw new Error(`Header block not found in ${relPath}`);
  }

  if (markerFooterRegex.test(html)) {
    html = html.replace(markerFooterRegex, footerBlock);
  } else if (legacyFooterRegex.test(html)) {
    html = html.replace(legacyFooterRegex, footerBlock);
  } else {
    throw new Error(`Footer block not found in ${relPath}`);
  }

  fs.writeFileSync(absPath, html, 'utf8');
}

console.log(`Synchronized shared partials in ${pages.length} subpages.`);
