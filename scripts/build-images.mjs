// Builds social share card (og-image.jpg) with emerald streaming aesthetics and no personal photos.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets';
mkdirSync(OUT, { recursive: true });

// Social share image (1200x630) on a cinematic dark backdrop
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#07070a' } })
  .composite([
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g" cx="80%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.38"/>
            <stop offset="50%" stop-color="#0d5c2e" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#07070a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="g2" cx="20%" cy="80%" r="40%">
            <stop offset="0%" stop-color="#14532d" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#07070a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#g)"/>
        <rect width="1200" height="630" fill="url(#g2)"/>

        <!-- Subtle film grid lines -->
        <line x1="80" y1="80" x2="1120" y2="80" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
        <line x1="80" y1="550" x2="1120" y2="550" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>

        <!-- Top metadata -->
        <text x="80" y="125" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="14" fill="#22c55e" letter-spacing="4">● A SAI ROHAN ORIGINAL • STREAMING PORTFOLIO</text>
        <text x="1120" y="125" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="14" fill="#a7a6ad" letter-spacing="3">S01–S03</text>

        <!-- Main Title -->
        <text x="80" y="280" font-family="Impact, 'Arial Narrow', sans-serif" font-size="115" fill="#f4f1ec" letter-spacing="4">SAI ROHAN</text>
        <text x="84" y="335" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="28" fill="#22c55e" letter-spacing="14">THE SERIES</text>
        <text x="84" y="405" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="20" fill="#f4f1ec" letter-spacing="4">AI/ML ENTHUSIAST &amp; SOFTWARE DEVELOPER</text>
        <text x="84" y="445" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="16" fill="#a7a6ad" letter-spacing="3">B.TECH CSE (AI &amp; ML) • VIT CHENNAI • PYTHON &amp; C++</text>

        <!-- Right side emblem badge -->
        <circle cx="950" cy="320" r="140" fill="#0d5c2e" fill-opacity="0.25" stroke="#22c55e" stroke-opacity="0.4" stroke-width="2"/>
        <circle cx="950" cy="320" r="160" fill="none" stroke="#22c55e" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="8 8"/>
        <text x="950" y="355" text-anchor="middle" font-family="Impact, 'Arial Narrow', sans-serif" font-size="110" fill="#f4f1ec" letter-spacing="2">SR</text>
        <text x="950" y="415" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="12" fill="#22c55e" letter-spacing="5">ORIGINAL</text>
      </svg>`),
    },
  ])
  .jpeg({ quality: 90 })
  .toFile(`${OUT}/og-image.jpg`);

console.log('og-image.jpg generated successfully without portrait photos');
