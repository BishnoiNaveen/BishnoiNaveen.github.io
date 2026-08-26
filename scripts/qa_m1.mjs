// M1 QA: headless browser verification of the cinematic camera journey.
// Loads the portfolio, scrolls through the full 700vh track, and samples:
//  - console errors / page errors
//  - presence of the WebGL <canvas>
//  - camera world position (read from the R3F canvas via window.__CINE for proof of 3D travel)
//  - scene HUD identity text at boot
//  - screenshots at several progress points for visual inspection

import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:4321/';
const OUT = '/tmp/m1';

const errors = [];
const warnings = [];

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
  if (msg.type() === 'warning') warnings.push(msg.text());
});
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(3000);

const hasCanvas = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return c ? { w: c.width, h: c.height } : null;
});

const bootIdentity = await page.evaluate(() =>
  document.body.innerText.includes('NAVEEN BISHNOI') ? 'identity-visible' : 'no-identity'
);

// Expose camera world position if the R3F store is reachable.
// CinematicExperience uses a zustand store; we instead read the live camera
// by patching into the canvas's __r3f object if present.
async function sampleProgress(pct) {
  const track = await page.evaluate(() => document.body.scrollHeight);
  const y = Math.round((track - window.innerHeight) * pct);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(900); // let scrub + lerp settle

  const cam = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    // @ts-ignore
    const r3f = c && c.__r3f;
    if (r3f && r3f.root && r3f.root.camera) {
      const cam = r3f.root.camera;
      return { x: +cam.position.x.toFixed(2), y: +cam.position.y.toFixed(2), z: +cam.position.z.toFixed(2) };
    }
    return null;
  });

  const hudScene = await page.evaluate(() => {
    const m = document.body.innerText.match(/SCENE 0\d \/\/ [A-Z ]+/);
    return m ? m[0] : 'none';
  });

  return { pct, cam, hudScene };
}

const samples = [];
for (const pct of [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0]) {
  const s = await sampleProgress(pct);
  samples.push(s);
  await page.screenshot({ path: `${OUT}_${Math.round(pct * 100)}.png` });
}

// Reverse scroll check
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
const reverseTop = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  // @ts-ignore
  const cam = c && c.__r3f && c.__r3f.root && c.__r3f.root.camera;
  return cam ? { x: +cam.position.x.toFixed(2), y: +cam.position.y.toFixed(2), z: +cam.position.z.toFixed(2) } : null;
});

console.log('CANVAS:', JSON.stringify(hasCanvas));
console.log('BOOT_IDENTITY:', bootIdentity);
console.log('SAMPLES:');
for (const s of samples) console.log(' ', JSON.stringify(s));
console.log('REVERSE_TOP_CAM:', JSON.stringify(reverseTop));
console.log('ERROR_COUNT:', errors.length);
console.log('ERRORS:', JSON.stringify(errors.slice(0, 10)));
console.log('WARN_COUNT:', warnings.length);

await browser.close();
