/* eslint-disable */
/**
 * Gera os ícones do app (iOS + Android) a partir de `assets/icon.svg`.
 * Uso: npm run icons
 *
 * - iOS: 9 tamanhos em AppIcon.appiconset (PNG opaco — iOS rejeita alpha) + Contents.json
 * - Android: ic_launcher.png (quadrado) e ic_launcher_round.png (circular) por densidade
 *
 * Após rodar, é preciso recompilar o app (`npm run ios` / `npm run android`)
 * para o ícone novo aparecer — não basta recarregar o Metro.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SVG = path.join(ROOT, 'assets/icon.svg');
const BG = '#0B0F17';

const svg = fs.readFileSync(SVG);

const render = (size) =>
  sharp(svg, { density: 400 }).resize(size, size, { fit: 'cover' });

// PNG opaco (iOS rejeita alpha em app icons)
const opaque = (size, out) =>
  render(size).flatten({ background: BG }).png().toFile(out);

// PNG com máscara circular (Android ic_launcher_round)
const round = async (size, out) => {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const base = await render(size).flatten({ background: BG }).png().toBuffer();
  return sharp(base)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(out);
};

async function main() {
  // ---------- iOS ----------
  const iosDir = path.join(
    ROOT,
    'ios/RickMortyExplorer/Images.xcassets/AppIcon.appiconset',
  );
  for (const s of [40, 58, 60, 80, 87, 120, 180, 1024]) {
    await opaque(s, path.join(iosDir, `icon-${s}.png`));
  }
  const contents = {
    images: [
      { idiom: 'iphone', scale: '2x', size: '20x20', filename: 'icon-40.png' },
      { idiom: 'iphone', scale: '3x', size: '20x20', filename: 'icon-60.png' },
      { idiom: 'iphone', scale: '2x', size: '29x29', filename: 'icon-58.png' },
      { idiom: 'iphone', scale: '3x', size: '29x29', filename: 'icon-87.png' },
      { idiom: 'iphone', scale: '2x', size: '40x40', filename: 'icon-80.png' },
      { idiom: 'iphone', scale: '3x', size: '40x40', filename: 'icon-120.png' },
      { idiom: 'iphone', scale: '2x', size: '60x60', filename: 'icon-120.png' },
      { idiom: 'iphone', scale: '3x', size: '60x60', filename: 'icon-180.png' },
      { idiom: 'ios-marketing', scale: '1x', size: '1024x1024', filename: 'icon-1024.png' },
    ],
    info: { author: 'xcode', version: 1 },
  };
  fs.writeFileSync(
    path.join(iosDir, 'Contents.json'),
    JSON.stringify(contents, null, 2) + '\n',
  );

  // ---------- Android ----------
  const densities = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  for (const [d, size] of Object.entries(densities)) {
    const dir = path.join(ROOT, `android/app/src/main/res/mipmap-${d}`);
    await opaque(size, path.join(dir, 'ic_launcher.png'));
    await round(size, path.join(dir, 'ic_launcher_round.png'));
  }

  console.log('✓ Ícones gerados (iOS + Android) a partir de assets/icon.svg');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
