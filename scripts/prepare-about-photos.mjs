import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp');
const source = process.argv[2];
if (!source) throw new Error('Provide the original photo folder. Originals are never modified.');
const output = resolve('public/images/about');
await mkdir(output, { recursive: true });
const photos = [
  ['IMG_2152.JPG', 'founder-at-the-decks'],
  ['IMG_2170.png', 'founder-teaching'],
  ['IMG_2460.png', 'founder-with-students'],
  ['IMG_2405.png', 'students-learning'],
  ['IMG_2417.png', 'students-creating'],
  ['IMG_3118.png', 'fom-community'],
];
for (const [original, name] of photos) {
  for (const width of [800, 1600]) {
    const info = await sharp(join(source, original)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(output, `${name}-${width}.webp`));
    console.log(`${name}-${width}.webp: ${info.width} × ${info.height}, ${Math.round(info.size / 1024)} KB`);
  }
}
