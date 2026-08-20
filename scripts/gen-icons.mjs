// One-off icon/OG-image generator — run manually with `node scripts/gen-icons.mjs`.
//
// The source (assets/ps.png, expected at this repo's root) is the real PS
// Laser app icon — the same file flutter_launcher_icons uses in the
// Flutter app's own repo (github.com/Gandharv2323/PS-Laser-IOS,
// assets/ps.png there). This website repo is deliberately website-only,
// so that source file isn't copied in here automatically — drop a copy
// of it at assets/ps.png in THIS repo before running this script if the
// icons/OG image ever need regenerating. The already-generated outputs
// this script produces (public/favicon-32.png, public/apple-touch-icon.png,
// public/icon-512.png, public/og-image.png) are already committed and
// don't require this script to run again unless the source art changes.
import sharp from 'sharp';

const SRC = 'assets/ps.png';
const OUT = 'public';

async function run() {
  await sharp(SRC).resize(32, 32).png().toFile(`${OUT}/favicon-32.png`);
  await sharp(SRC).resize(180, 180).png().toFile(`${OUT}/apple-touch-icon.png`);
  await sharp(SRC).resize(512, 512).png().toFile(`${OUT}/icon-512.png`);

  // Simple branded OG image — black ground, gold wordmark, matching the
  // site's own palette. Rasterized from an inline SVG rather than a
  // fabricated marketing photo.
  const ogSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="18%" cy="15%" r="65%">
          <stop offset="0%" stop-color="#d4a843" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#0a0a0a" />
      <rect width="1200" height="630" fill="url(#glow)" />
      <text x="90" y="330" font-family="Georgia, serif" font-size="112" font-weight="700" letter-spacing="6" fill="#f5f5f5">PS LASER</text>
      <text x="90" y="390" font-family="Georgia, serif" font-size="34" fill="#dbae45" letter-spacing="2">PRECISION MEETS PRODUCTION</text>
      <rect x="90" y="430" width="120" height="4" fill="#dbae45" />
    </svg>`;
  await sharp(Buffer.from(ogSvg)).png().toFile(`${OUT}/og-image.png`);

  console.log('Icons + OG image written to', OUT);
}

run();
