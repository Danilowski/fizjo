const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'optimized');
const ALLOWED_MEDIUM_CERTS = new Set(['certyfikat-3.jpg', 'certyfikat-4.jpg', 'certyfikat-5.jpg', 'certyfikat-8.jpg', 'certyfikat-9.jpg', 'certyfikat-14.jpg']);

const isTargetJpeg = (filePath) => {
  if (!filePath.toLowerCase().endsWith('.jpg')) return false;
  const rel = path.relative(IMAGES_DIR, filePath).replace(/\\/g, '/').toLowerCase();
  const name = path.basename(rel);

  if (rel.startsWith('mobile/')) {
    return name.startsWith('certyfikat-') || name === 'monika.jpg';
  }

  if (rel.startsWith('medium/')) {
    return ALLOWED_MEDIUM_CERTS.has(name);
  }

  return name.startsWith('certyfikat-') || name === 'monika.jpg';
};

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
};

const toVariantPath = (filePath, ext) => filePath.replace(/\.jpg$/i, `.${ext}`);

(async () => {
  const jpgFiles = walk(IMAGES_DIR).filter(isTargetJpeg);

  if (!jpgFiles.length) {
    console.log('No target JPG files found.');
    return;
  }

  let converted = 0;
  for (const jpgPath of jpgFiles) {
    const avifPath = toVariantPath(jpgPath, 'avif');
    const webpPath = toVariantPath(jpgPath, 'webp');

    await sharp(jpgPath)
      .avif({ quality: 45, effort: 4 })
      .toFile(avifPath);

    await sharp(jpgPath)
      .webp({ quality: 70, effort: 4 })
      .toFile(webpPath);

    converted += 1;
    console.log(`Converted: ${path.relative(ROOT, jpgPath)}`);
  }

  console.log(`Done. Converted ${converted} source JPG files to AVIF and WebP.`);
})();
