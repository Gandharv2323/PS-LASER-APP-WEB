// One-off screenshot optimizer — run manually with
// `node scripts/optimize-screenshots.mjs` whenever new real app
// screenshots are supplied. Reads raw phone screenshots from SRC_DIR and
// writes web-sized JPEG + WebP pairs into public/screenshots/. Screenshots
// themselves are real product evidence provided by the app's owner, never
// generated or fabricated.
//
// SRC_DIR is a machine-local path (this repo is website-only and doesn't
// carry the raw screenshots as source — only the already-optimized output
// in public/screenshots/ is committed here). Point it at wherever the raw
// screenshots actually are before re-running.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC_DIR = '../PS-App-main/PS-App-main/ScreenShots';
const OUT_DIR = 'public/screenshots';
const TARGET_WIDTH = 600; // ~2x pixel density at the frame's 300px display width

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const { name } = parse(file);
  // Normalize filenames: lowercase, spaces -> hyphens (e.g. "ai chat.jpg" -> "ai-chat")
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const src = join(SRC_DIR, file);

  await sharp(src).resize({ width: TARGET_WIDTH }).jpeg({ quality: 80, progressive: true }).toFile(join(OUT_DIR, `${slug}.jpg`));
  await sharp(src).resize({ width: TARGET_WIDTH }).webp({ quality: 78 }).toFile(join(OUT_DIR, `${slug}.webp`));

  console.log(`optimized ${file} -> ${slug}.jpg / ${slug}.webp`);
}
