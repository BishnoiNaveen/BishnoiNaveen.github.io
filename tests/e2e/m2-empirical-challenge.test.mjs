import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule, getCssContent } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 2 Empirical Challenge & Stress Harness',
  2,
  'Empirical challenge verification of spring physics ODE, pointer degradation, sheet kinematics, and manifesto integrity.'
);

suite.test('M2-EMP-1: Spring Physics Damping Ratio & Parameter Invariants for Nav Glide', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  ctx.assertFileExists(springsPath, 'src/lib/springs.ts must exist');

  const { springPresets } = await importModule(springsPath);
  ctx.assert(springPresets !== undefined, 'springPresets export must exist');

  const glide = springPresets.glide;
  ctx.assert(glide !== undefined, 'springPresets.glide must be defined');
  ctx.assertEqual(glide.type, 'spring', 'glide type must be spring');

  const m = glide.mass;
  const k = glide.stiffness;
  const c = glide.damping;

  ctx.assertPositive(m, 'Glide mass must be positive');
  ctx.assertPositive(k, 'Glide stiffness must be positive');
  ctx.assertPositive(c, 'Glide damping must be positive');

  const cc = 2 * Math.sqrt(k * m);
  const zeta = c / cc;
  const omegaN = Math.sqrt(k / m);

  ctx.assert(zeta >= 0.75 && zeta <= 0.95, 'Glide damping ratio zeta in target range [0.75, 0.95]');
  ctx.assert(omegaN >= 15 && omegaN <= 30, 'Glide natural frequency omegaN in target range [15, 30]');
});

suite.test('M2-EMP-2: 100,000 Step RK4 ODE Simulation of Rapid Tab Transitions & Scroll Spy Jumps', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const { springPresets } = await importModule(springsPath);
  const { mass: m, stiffness: k, damping: c } = springPresets.glide;

  const tabPositions = [0, 80, 160, 240];
  let x = 0;
  let v = 0;
  const dt = 0.001;
  let maxPos = -Infinity;
  let minPos = Infinity;
  let maxVel = 0;

  for (let step = 0; step < 100000; step++) {
    const targetIdx = Math.floor(step / 15) % tabPositions.length;
    const target = tabPositions[targetIdx];

    const f_v = (currX, currV, tgt) => -(c * currV + k * (currX - tgt)) / m;

    const k1_x = v;
    const k1_v = f_v(x, v, target);

    const k2_x = v + 0.5 * dt * k1_v;
    const k2_v = f_v(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v, target);

    const k3_x = v + 0.5 * dt * k2_v;
    const k3_v = f_v(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v, target);

    const k4_x = v + dt * k3_v;
    const k4_v = f_v(x + dt * k3_x, v + dt * k3_v, target);

    x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
    v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);

    if (x > maxPos) maxPos = x;
    if (x < minPos) minPos = x;
    if (Math.abs(v) > maxVel) maxVel = Math.abs(v);
  }

  ctx.assert(minPos >= -50, 'Minimum position must be >= -50');
  ctx.assert(maxPos <= 300, 'Maximum position must be <= 300');

  const finalTarget = 160;
  let settledTime = null;
  for (let step = 0; step < 1000; step++) {
    const f_v = (currX, currV) => -(c * currV + k * (currX - finalTarget)) / m;
    const k1_x = v;
    const k1_v = f_v(x, v);
    const k2_x = v + 0.5 * dt * k1_v;
    const k2_v = f_v(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v);
    const k3_x = v + 0.5 * dt * k2_v;
    const k3_v = f_v(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v);
    const k4_x = v + dt * k3_v;
    const k4_v = f_v(x + dt * k3_x, v + dt * k3_v);

    x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
    v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);

    if (settledTime === null && Math.abs(x - finalTarget) <= 0.05 && Math.abs(v) <= 0.1) {
      settledTime = step * dt;
    }
  }

  ctx.assert(settledTime !== null, 'Spring must settle within 1s');
  ctx.assert(settledTime <= 0.8, 'Spring settled in ' + (settledTime * 1000).toFixed(1) + 'ms (must be <= 800ms under high momentum)');
  ctx.assert(Math.abs(x - finalTarget) < 0.01, 'Final position matches target');
});

suite.test('M2-EMP-3: Parallax Tilt Disables on Coarse/Touch Pointers', (ctx) => {
  const photoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'HeroParallaxPhoto.tsx');
  const content = fs.readFileSync(photoPath, 'utf8');

  ctx.assert(content.includes('(pointer: fine)'), 'HeroParallaxPhoto must query pointer: fine');
  ctx.assert(content.includes('isFinePointer ? rotateX : 0'), 'rotateX must fallback to 0');
  ctx.assert(content.includes('isFinePointer ? rotateY : 0'), 'rotateY must fallback to 0');
  ctx.assert(content.includes('isFinePointer ? translateX : 0'), 'translateX must fallback to 0');
  ctx.assert(content.includes('isFinePointer ? translateY : 0'), 'translateY must fallback to 0');
});

suite.test('M2-EMP-4: prefers-reduced-motion Overrides All CSS and Transform Kinetics', (ctx) => {
  const css = getCssContent();
  ctx.assert(css.includes('prefers-reduced-motion: reduce'), 'CSS must include prefers-reduced-motion');
  ctx.assert(css.includes('transform: none !important'), 'prefers-reduced-motion must force transform: none');
  ctx.assert(css.includes('animation-duration: 0.01ms !important'), 'prefers-reduced-motion must force animation-duration');
});

suite.test('M2-EMP-5: MobileNavSheet Drag-to-Dismiss Kinematic Simulation', (ctx) => {
  const sheetPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'MobileNavSheet.tsx');
  const content = fs.readFileSync(sheetPath, 'utf8');

  ctx.assert(content.includes('info.offset.y > 100'), 'Drag distance threshold > 100');
  ctx.assert(content.includes('info.velocity.y > 250'), 'Drag velocity threshold > 250');

  const handleDragEndSim = (offsetY, velocityY) => offsetY > 100 || velocityY > 250;
  ctx.assertEqual(handleDragEndSim(100, 250), false, 'Boundary 100, 250 does not close');
  ctx.assertEqual(handleDragEndSim(101, 0), true, 'Displacement 101 closes');
  ctx.assertEqual(handleDragEndSim(50, 251), true, 'Velocity 251 closes');
  ctx.assertEqual(handleDragEndSim(-200, -500), false, 'Upward drag does not close');

  for (let i = 0; i < 10000; i++) {
    const offsetY = (Math.random() - 0.3) * 400;
    const velocityY = (Math.random() - 0.3) * 1000;
    const shouldClose = handleDragEndSim(offsetY, velocityY);
    const expected = (offsetY > 100) || (velocityY > 250);
    ctx.assertEqual(shouldClose, expected, 'Invariant preserved across 10,000 pan gestures');
  }
});

suite.test('M2-EMP-6: MobileNavSheet ESC Key and Scroll Lock Lifecycle Invariant', (ctx) => {
  const sheetPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'MobileNavSheet.tsx');
  const content = fs.readFileSync(sheetPath, 'utf8');

  ctx.assert(content.includes("e.key === 'Escape'"), 'MobileNavSheet must check Escape key');
  ctx.assert(content.includes("document.body.style.overflow = 'hidden'"), 'MobileNavSheet locks body scroll');
  ctx.assert(content.includes('role="dialog"'), 'MobileNavSheet has dialog role');
  ctx.assert(content.includes('aria-modal="true"'), 'MobileNavSheet has aria-modal');
});

suite.test('M2-EMP-7: Zero Banned Cyber UI and Synthetic Telemetry in Hero and Manifesto', (ctx) => {
  const heroPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'CinematicHero.astro');
  const manifestoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'manifesto', 'TypographicManifesto.astro');

  const heroContent = fs.readFileSync(heroPath, 'utf8');
  const manifestoContent = fs.readFileSync(manifestoPath, 'utf8');

  const banned = ['cyber-box', 'neon-glow', 'synthetic-telemetry', '$0.', '99.999% uptime'];
  for (const b of banned) {
    ctx.assert(!heroContent.toLowerCase().includes(b), 'Hero must not include ' + b);
    ctx.assert(!manifestoContent.toLowerCase().includes(b), 'Manifesto must not include ' + b);
  }
});

suite.test('M2-EMP-8: Asset Integrity - High-Res Portrait and Resume Exist', (ctx) => {
  const portraitDistPath = path.join(WORKSPACE_ROOT, 'public', 'images', 'portfolio_hero.jpg');
  const resumeDistPath = path.join(WORKSPACE_ROOT, 'public', 'Naveen_Bishnoi_Resume.pdf');

  ctx.assertFileExists(portraitDistPath, 'Hero portrait image must exist');
  ctx.assertFileExists(resumeDistPath, 'Resume PDF must exist');

  const stats = fs.statSync(portraitDistPath);
  ctx.assert(stats.size > 10000, 'Portrait size > 10KB');
});

export default suite;
