/**
 * m5-motion-physics-polish.test.mjs — Milestone 5: Motion, Magnetic Physics & Scroll Polish Test Suite
 * Validates:
 * 1. Apple WWDC 2018 Harmonic Oscillator Presets in src/lib/springs.ts
 * 2. Magnetic Attraction Physics & 24px Bounding Radius in src/hooks/useMagnetic.ts and MagneticButton.tsx
 * 3. Mechanical Click Compression (scale: 0.97) on interactive buttons
 * 4. Reduced Motion Engine (instantTransition, zeroed offsets, CSS overrides)
 * 5. 8-Chapter Scroll Storytelling & Reveal Orchestration
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 5 — Motion, Magnetic Physics & Scroll Polish',
  1,
  'Audits Apple WWDC 2018 spring physics, magnetic bounding radius (24px), mechanical tap compression (scale: 0.97), reduced-motion safety, and 8-chapter scroll storytelling.'
);

const EXPECTED_PRESETS = ['snappy', 'glide', 'buoyant', 'morph', 'cinematic', 'sheet', 'magnetic'];

suite.test('src/lib/springs.ts exports all 7 harmonic oscillator presets with physically stable parameters', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  ctx.assertFileExists(springsPath, 'src/lib/springs.ts must exist');

  const springsModule = await importModule(springsPath);
  const presets = springsModule.springPresets;
  ctx.assert(presets !== undefined, 'springs.ts must export springPresets');

  for (const name of EXPECTED_PRESETS) {
    const p = presets[name];
    ctx.assert(p !== undefined, `Preset "${name}" must be defined`);
    ctx.assertEqual(p.type, 'spring', `Preset "${name}" must be of type "spring"`);
    ctx.assertPositive(p.mass, `Preset "${name}" mass must be positive (got ${p.mass})`);
    ctx.assertPositive(p.stiffness, `Preset "${name}" stiffness must be positive (got ${p.stiffness})`);
    ctx.assertPositive(p.damping, `Preset "${name}" damping must be positive (got ${p.damping})`);

    // Calculate damping ratio: zeta = damping / (2 * sqrt(mass * stiffness))
    const zeta = p.damping / (2 * Math.sqrt(p.mass * p.stiffness));
    ctx.assertInRange(
      zeta,
      0.4,
      1.5,
      `Preset "${name}" damping ratio zeta=${zeta.toFixed(3)} must be physically stable in [0.4, 1.5]`
    );
  }
});

suite.test('src/lib/springs.ts exports instantTransition, mechanicalClick, and getAccessibleSpring', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const springsModule = await importModule(springsPath);

  // instantTransition check
  ctx.assert(springsModule.instantTransition !== undefined, 'instantTransition must be exported');
  ctx.assertEqual(springsModule.instantTransition.type, 'tween', 'instantTransition must be tween');
  ctx.assertEqual(springsModule.instantTransition.duration, 0, 'instantTransition duration must be 0');

  // mechanicalClick check
  ctx.assert(springsModule.mechanicalClick !== undefined, 'mechanicalClick must be exported');
  ctx.assertEqual(springsModule.mechanicalClick.scale, 0.97, 'mechanicalClick scale must be 0.97');

  // cardTap check
  ctx.assert(springsModule.cardTap !== undefined, 'cardTap must be exported');
  ctx.assertEqual(springsModule.cardTap.scale, 0.985, 'cardTap scale must be 0.985');

  // getAccessibleSpring check
  ctx.assert(typeof springsModule.getAccessibleSpring === 'function', 'getAccessibleSpring must be a function');
  const normalSpring = springsModule.getAccessibleSpring('snappy', false);
  ctx.assertEqual(normalSpring.type, 'spring', 'getAccessibleSpring with false must return spring');
  const reducedSpring = springsModule.getAccessibleSpring('snappy', true);
  ctx.assertEqual(reducedSpring.duration, 0, 'getAccessibleSpring with true must return duration 0 transition');
});

suite.test('src/hooks/useMagnetic.ts enforces 24px radius constraint, fine pointer check, and reduced motion safety', (ctx) => {
  const hookPath = path.join(WORKSPACE_ROOT, 'src', 'hooks', 'useMagnetic.ts');
  ctx.assertFileExists(hookPath, 'src/hooks/useMagnetic.ts must exist');

  const content = fs.readFileSync(hookPath, 'utf8');

  // Check 24px radius constraint / Math.hypot clamping
  ctx.assert(
    content.includes('24') || content.includes('maxRadius'),
    'useMagnetic must declare or support a 24px max radius parameter'
  );
  ctx.assert(
    content.includes('Math.hypot') || content.includes('Math.sqrt'),
    'useMagnetic must calculate Euclidean vector distance to clamp bounding radius'
  );

  // Check fine pointer requirement
  ctx.assert(
    content.includes('pointer: fine'),
    'useMagnetic must verify (pointer: fine) to prevent magnetic disruption on touchscreens'
  );

  // Check reduced motion safety
  ctx.assert(
    content.includes('useReducedMotion') || content.includes('prefers-reduced-motion'),
    'useMagnetic must support reduced motion bypass'
  );
  ctx.assert(
    content.includes('instantTransition') || content.includes('duration: 0') || content.includes('0, y: 0'),
    'useMagnetic must zero position and transitions on reduced motion'
  );
});

suite.test('src/components/ui/MagneticButton.tsx implements mechanicalClick and 24px bounding radius', (ctx) => {
  const btnPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'ui', 'MagneticButton.tsx');
  ctx.assertFileExists(btnPath, 'MagneticButton.tsx must exist');

  const content = fs.readFileSync(btnPath, 'utf8');
  ctx.assert(
    content.includes('maxRadius') && (content.includes('24') || content.includes('useMagnetic')),
    'MagneticButton must use useMagnetic with 24px max radius'
  );
  ctx.assert(
    content.includes('mechanicalClick') || content.includes('scale: 0.97'),
    'MagneticButton must use mechanicalClick (scale: 0.97) for active click compression'
  );
  ctx.assert(
    content.includes('useReducedMotion'),
    'MagneticButton must integrate useReducedMotion for accessibility compliance'
  );
});

suite.test('Universal Accessibility: design-system.css contains strict prefers-reduced-motion overrides', (ctx) => {
  const cssPath = path.join(WORKSPACE_ROOT, 'src', 'styles', 'design-system.css');
  ctx.assertFileExists(cssPath, 'design-system.css must exist');

  const content = fs.readFileSync(cssPath, 'utf8');
  ctx.assert(
    content.includes('@media (prefers-reduced-motion: reduce)'),
    'design-system.css must have @media (prefers-reduced-motion: reduce) block'
  );
  ctx.assert(
    content.includes('transition-duration: 0.01ms !important;') || content.includes('transition-duration: 0s'),
    'Reduced motion must override transition durations'
  );
  ctx.assert(
    content.includes('transform: none !important;'),
    'Reduced motion must zero all transforms'
  );
  ctx.assert(
    content.includes('chapter-reveal'),
    'design-system.css must include .chapter-reveal classes for fluid scroll reveals'
  );
});

suite.test('Scroll Storytelling & Chapter Reveal Orchestration in src/pages/index.astro', (ctx) => {
  const indexPagePath = path.join(WORKSPACE_ROOT, 'src', 'pages', 'index.astro');
  ctx.assertFileExists(indexPagePath, 'src/pages/index.astro must exist');

  const content = fs.readFileSync(indexPagePath, 'utf8');

  // Verify chapter reveal markers
  ctx.assert(
    content.includes('chapter-reveal'),
    'index.astro must wrap chapters in .chapter-reveal containers'
  );

  // Verify reduced motion check in script
  ctx.assert(
    content.includes('prefers-reduced-motion'),
    'index.astro reveal script must check prefers-reduced-motion to instantly display content'
  );

  // Verify all 8 chapters are present
  const chapters = ['#hero', '#manifesto', '#work', '#lab', '#about', '#skills', '#timeline', '#contact'];
  for (const ch of chapters) {
    ctx.assert(
      content.includes(ch) || content.includes(ch.replace('#', '')),
      `index.astro must orchestrate chapter ${ch}`
    );
  }
});

suite.test('Spring Presets and Mechanical Tap Polish on Interactive Navigation & Island Components', (ctx) => {
  const componentsToAudit = [
    { file: 'src/components/ui/ThemeToggle.tsx', mustContain: ['springPresets.snappy', 'whileTap'] },
    { file: 'src/components/nav/FloatingNav.tsx', mustContain: ['springPresets', 'whileTap'] },
    { file: 'src/components/nav/MobileNavSheet.tsx', mustContain: ['springPresets.sheet', 'useReducedMotion'] },
    { file: 'src/components/hero/HeroParallaxPhoto.tsx', mustContain: ['useReducedMotion', 'springPresets'] },
    { file: 'src/components/lab/LabSuite.tsx', mustContain: ['activeLabSuiteTab', 'useReducedMotion'] },
    { file: 'src/components/about/SkillsBento.tsx', mustContain: ['activeSkillsDomainPill', 'useReducedMotion'] },
    { file: 'src/components/contact/ContactTerminal.tsx', mustContain: ['mechanicalClick', 'useReducedMotion'] },
    { file: 'src/components/projects/CaseStudyModal.tsx', mustContain: ['activeCaseStudyTabPill', 'useReducedMotion'] },
  ];

  for (const comp of componentsToAudit) {
    const compPath = path.join(WORKSPACE_ROOT, comp.file);
    ctx.assertFileExists(compPath, `${comp.file} must exist`);
    const content = fs.readFileSync(compPath, 'utf8');
    for (const requiredToken of comp.mustContain) {
      ctx.assert(
        content.includes(requiredToken),
        `${comp.file} must contain "${requiredToken}" for spring / motion polish`
      );
    }
  }
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
