const path = require('node:path');
const fs = require('node:fs');
const sharp = require('C:/Users/timos/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const root = path.join(__dirname, 'dist', 'assets');
const originals = path.join(__dirname, 'reference-media', 'originals');
const photos = [
  'collection', 'exhibition', 'meeting-01', 'meeting-02', 'meeting-04',
  'process-01', 'process-02', 'process-03', 'process-04', 'sculpture-gesture',
  'sculpture-glasses', 'sculpture-light', 'studio', 'ilya-portrait', 'istukan',
  'moai-garden-black', 'moai-garden-stone', 'moai-gallery-blue', 'moai-freedom',
  'moai-night-stone', 'moai-gold-interior'
];

async function run() {
  for (const name of photos) {
    const publicInput = path.join(root, `${name}.png`);
    const input = fs.existsSync(publicInput) ? publicInput : path.join(originals, `${name}.png`);
    if (!fs.existsSync(input)) continue;
    const metadata = await sharp(input).metadata();
    const source = name === 'meeting-02' && metadata.width > 100
      ? sharp(input).extract({ left: 0, top: 0, width: metadata.width - Math.min(80, Math.floor(metadata.width * .07)), height: metadata.height })
      : sharp(input);
    await source.clone().rotate().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(path.join(root, `${name}-720.webp`));
    await source.clone().rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(root, `${name}-1440.webp`));
  }
  const publicLogoSource = path.join(root, 'veresk-hand-logo.png');
  const logoSource = fs.existsSync(publicLogoSource) ? publicLogoSource : path.join(originals, 'veresk-hand-logo.png');
  if (fs.existsSync(logoSource)) {
    await sharp(logoSource).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize({ width: 260, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(root, 'logo-hand.png'));
    await sharp(logoSource).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize({ width: 96, height: 96, fit: 'contain' }).png({ compressionLevel: 9 }).toFile(path.join(root, 'favicon.png'));
  }
  console.log(`Optimized ${photos.length} photo sets and the hand logo.`);
}

run().catch(error => { console.error(error); process.exitCode = 1; });
