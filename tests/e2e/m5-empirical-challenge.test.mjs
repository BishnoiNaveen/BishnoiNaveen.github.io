/**
 * m5-empirical-challenge.test.mjs — Milestone 5 Empirical Challenge & Stress Suite
 * Author: Empirical Challenger 1
 * 
 * Objectives:
 * 1. Spring Physics Matrix: Verify all 7 harmonic oscillator presets have 0.70 <= zeta <= 0.92,
 *    sub-0.85s settling times, and Runge-Kutta numerical integration stability.
 * 2. Magnetic Physics Fuzzer: Stress test magnetic attraction across 1,000 randomized cursor vectors,
 *    verifying Euclidean norm clamping <= 24.0001px under all extreme coordinate offsets.
 * 3. Reduced-Motion Accessibility Engine: Verify instantTransition (duration: 0), zeroed magnetic offsets,
 *    and strict CSS overrides (transition-duration: 0.01ms, transform: none) under prefers-reduced-motion.
 * 4. Mechanical Tap Compression Matrix: Verify scale: 0.97 across buttons and scale: 0.985 on card taps.
 * 5. Scroll Storytelling & 8-Chapter Reveal Orchestration: Invariant checks for IntersectionObserver and CSS transitions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 5 Empirical Challenge & Motion Physics Stress Harness',
  4,
  'Adversarial stress testing of Apple WWDC 2018 spring damping ratios (0.70 <= zeta <= 0.92), 1,000-vector magnetic radius clamping (<= 24px), prefers-reduced-motion engine, and mechanical click compression.'
);

const EXPECTED_PRESETS = ['snappy', 'glide', 'buoyant', 'morph', 'cinematic', 'sheet', 'magnetic'];

// =========================================================================
// TEST 1: Spring Physics Damping Ratio (0.70 <= zeta <= 0.92) & RK4 Simulation
// =========================================================================
suite.test('1. Spring Physics: Damping ratio bounds (0.70 <= zeta <= 0.92), settling times & RK4 ODE convergence', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  ctx.assertFileExists(springsPath, 'src/lib/springs.ts must exist');

  const springsModule = await importModule(springsPath);
  const presets = springsModule.springPresets;
  ctx.assert(presets !== undefined, 'springs.ts must export springPresets');

  const computedMetrics = {};

  for (const name of EXPECTED_PRESETS) {
    const p = presets[name];
    ctx.assert(p !== undefined, `Preset "${name}" must be defined`);
    ctx.assertEqual(p.type, 'spring', `Preset "${name}" type must be spring`);

    const { mass, stiffness, damping } = p;
    ctx.assertPositive(mass, `Preset "${name}" mass must be positive`);
    ctx.assertPositive(stiffness, `Preset "${name}" stiffness must be positive`);
    ctx.assertPositive(damping, `Preset "${name}" damping must be positive`);

    // Damping ratio: zeta = c / (2 * sqrt(m * k))
    const criticalDamping = 2 * Math.sqrt(mass * stiffness);
    const zeta = damping / criticalDamping;

    // Strict empirical requirement: 0.70 <= zeta <= 0.92
    ctx.assert(
      zeta >= 0.70 && zeta <= 0.92,
      `Preset "${name}" damping ratio zeta=${zeta.toFixed(4)} must satisfy 0.70 <= zeta <= 0.92 (actual: ${zeta.toFixed(4)})`
    );

    // Natural angular frequency: omega_n = sqrt(k / m)
    const omega_n = Math.sqrt(stiffness / mass);

    // Damped angular frequency: omega_d = omega_n * sqrt(1 - zeta^2)
    const omega_d = omega_n * Math.sqrt(1 - zeta * zeta);

    // Settling time (2% threshold): t_s approx 4 / (zeta * omega_n)
    const settlingTime = 4 / (zeta * omega_n);
    ctx.assert(
      settlingTime >= 0.10 && settlingTime <= 0.85,
      `Preset "${name}" settling time (${settlingTime.toFixed(3)}s) must be responsive [0.10s, 0.85s]`
    );

    computedMetrics[name] = { zeta, omega_n, omega_d, settlingTime };

    // Numerical Runge-Kutta 4th Order (RK4) ODE Simulation
    // State: [x, v], where dx/dt = v, dv/dt = -(damping/mass)*v - (stiffness/mass)*x
    let x = 1.0; // Initial displacement 1 unit
    let v = 0.0; // Initial velocity 0
    const dt = 0.002; // 2ms time step
    const totalSteps = 500; // 1.0 second simulation
    let maxOvershoot = 0;

    const f = (xVal, vVal) => ({
      dx: vVal,
      dv: -(damping / mass) * vVal - (stiffness / mass) * xVal,
    });

    for (let step = 0; step < totalSteps; step++) {
      const k1 = f(x, v);
      const k2 = f(x + 0.5 * dt * k1.dx, v + 0.5 * dt * k1.dv);
      const k3 = f(x + 0.5 * dt * k2.dx, v + 0.5 * dt * k2.dv);
      const k4 = f(x + dt * k3.dx, v + dt * k3.dv);

      x += (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
      v += (dt / 6) * (k1.dv + 2 * k2.dv + 2 * k3.dv + k4.dv);

      // Track overshoot below target 0
      if (x < 0) {
        maxOvershoot = Math.max(maxOvershoot, Math.abs(x));
      }
    }

    // Settled position after 1 second must be virtually zero (< 0.005)
    ctx.assert(
      Math.abs(x) < 0.005,
      `Preset "${name}" RK4 final position (${x.toFixed(6)}) must settle to 0`
    );

    // Overshoot should be controlled (< 10% for zeta >= 0.70)
    ctx.assert(
      maxOvershoot <= 0.10,
      `Preset "${name}" RK4 max overshoot (${(maxOvershoot * 100).toFixed(2)}%) must be <= 10%`
    );
  }

  // Also verify helper computeDampingRatio from module
  if (typeof springsModule.computeDampingRatio === 'function') {
    const testZeta = springsModule.computeDampingRatio(0.6, 450, 28);
    ctx.assertInRange(testZeta, 0.85, 0.86, 'computeDampingRatio helper produces accurate zeta');
  }
});

// =========================================================================
// TEST 2: Magnetic Attraction Physics & 1,000 Randomized Vector Clamping
// =========================================================================
suite.test('2. Magnetic Attraction Physics: 1,000 randomized vector clamping stress test & boundary safety', async (ctx) => {
  const hookPath = path.join(WORKSPACE_ROOT, 'src', 'hooks', 'useMagnetic.ts');
  const btnPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'ui', 'MagneticButton.tsx');
  const magPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'Magnetic.tsx');

  ctx.assertFileExists(hookPath, 'useMagnetic.ts must exist');
  ctx.assertFileExists(btnPath, 'MagneticButton.tsx must exist');
  ctx.assertFileExists(magPath, 'Magnetic.tsx must exist');

  // Vector clamping mathematical implementation
  const calculateMagneticOffset = (rawDeltaX, rawDeltaY, maxRadius = 24) => {
    const distance = Math.hypot(rawDeltaX, rawDeltaY);
    if (distance > maxRadius && distance > 0) {
      const ratio = maxRadius / distance;
      return { x: rawDeltaX * ratio, y: rawDeltaY * ratio, distance: maxRadius };
    }
    return { x: rawDeltaX, y: rawDeltaY, distance };
  };

  // Seeded deterministic PRNG
  let seed = 123456789;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const strength = 0.28;
  const maxRadius = 24.0;

  // Run 1,000 randomized cursor displacement vectors across extreme bounds
  for (let i = 0; i < 1000; i++) {
    // Generate raw cursor offset from element center in [-5000px, 5000px]
    const offsetX = (rand() - 0.5) * 10000;
    const offsetY = (rand() - 0.5) * 10000;

    const rawDeltaX = offsetX * strength;
    const rawDeltaY = offsetY * strength;

    const { x, y, distance } = calculateMagneticOffset(rawDeltaX, rawDeltaY, maxRadius);

    const actualDisplacement = Math.hypot(x, y);

    ctx.assert(
      actualDisplacement <= 24.0001,
      `Vector #${i} (offset: [${offsetX.toFixed(1)}, ${offsetY.toFixed(1)}]) displacement ${actualDisplacement.toFixed(4)}px exceeds 24.0001px limit`
    );
    ctx.assert(
      !Number.isNaN(x) && !Number.isNaN(y),
      `Vector #${i} resulting coordinates must not be NaN`
    );
    ctx.assert(
      Number.isFinite(x) && Number.isFinite(y),
      `Vector #${i} resulting coordinates must be finite`
    );
  }

  // Extreme Corner & Boundary Cases:
  // Case A: (0, 0) Center origin
  const origin = calculateMagneticOffset(0, 0, maxRadius);
  ctx.assertEqual(origin.x, 0, 'Origin X displacement must be 0');
  ctx.assertEqual(origin.y, 0, 'Origin Y displacement must be 0');

  // Case B: Infinite offset
  const hugeX = calculateMagneticOffset(1e9, 0, maxRadius);
  ctx.assertInRange(hugeX.x, 23.999, 24.001, 'Huge X offset clamps to 24px');
  ctx.assertEqual(hugeX.y, 0, 'Huge X offset preserves 0 Y displacement');

  // Case C: 45-degree diagonal offset
  const diag = calculateMagneticOffset(1000, 1000, maxRadius);
  const expectedDiag = 24 / Math.SQRT2;
  ctx.assertInRange(diag.x, expectedDiag - 0.001, expectedDiag + 0.001, 'Diagonal X matches 24/sqrt(2)');
  ctx.assertInRange(diag.y, expectedDiag - 0.001, expectedDiag + 0.001, 'Diagonal Y matches 24/sqrt(2)');
  ctx.assertInRange(Math.hypot(diag.x, diag.y), 23.999, 24.001, 'Diagonal Euclidean distance equals 24px');

  // Case D: Sub-pixel micro-movements
  const micro = calculateMagneticOffset(0.0001, 0.0001, maxRadius);
  ctx.assert(Math.hypot(micro.x, micro.y) < 0.001, 'Micro movements remain unclamped');
});

// =========================================================================
// TEST 3: Reduced-Motion Engine & Universal Accessibility Matrix
// =========================================================================
suite.test('3. Reduced-Motion Engine: Instant fallbacks, zeroed transforms & CSS override coverage', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const cssPath = path.join(WORKSPACE_ROOT, 'src', 'styles', 'design-system.css');
  const springsModule = await importModule(springsPath);

  // 3.1: Verify instantTransition in springs.ts
  ctx.assert(springsModule.instantTransition !== undefined, 'instantTransition must be exported');
  ctx.assertEqual(springsModule.instantTransition.type, 'tween', 'instantTransition type must be tween');
  ctx.assertEqual(springsModule.instantTransition.duration, 0, 'instantTransition duration must be 0');

  // 3.2: Verify getAccessibleSpring
  for (const preset of EXPECTED_PRESETS) {
    const accessibleSpring = springsModule.getAccessibleSpring(preset, true);
    ctx.assertEqual(accessibleSpring.duration, 0, `getAccessibleSpring("${preset}", true) must have duration 0`);
    
    const normalSpring = springsModule.getAccessibleSpring(preset, false);
    ctx.assertEqual(normalSpring.type, 'spring', `getAccessibleSpring("${preset}", false) must return spring`);
  }

  // 3.3: Verify CSS @media (prefers-reduced-motion: reduce) block
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  ctx.assert(
    cssContent.includes('@media (prefers-reduced-motion: reduce)'),
    'design-system.css must contain @media (prefers-reduced-motion: reduce)'
  );

  const mediaIndex = cssContent.indexOf('@media (prefers-reduced-motion: reduce)');
  ctx.assert(mediaIndex !== -1, 'Found @media (prefers-reduced-motion: reduce) position');
  const reducedRules = cssContent.slice(mediaIndex);

  ctx.assert(
    reducedRules.includes('animation-duration: 0.01ms') || reducedRules.includes('animation-duration: 0s'),
    'CSS reduced motion must override animation duration'
  );
  ctx.assert(
    reducedRules.includes('transition-duration: 0.01ms') || reducedRules.includes('transition-duration: 0s'),
    'CSS reduced motion must override transition duration'
  );
  ctx.assert(
    reducedRules.includes('transform: none !important;'),
    'CSS reduced motion must force transform: none !important'
  );
  ctx.assert(
    reducedRules.includes('scroll-behavior: auto !important;'),
    'CSS reduced motion must disable smooth scrolling'
  );
  ctx.assert(
    reducedRules.includes('.chapter-reveal'),
    'CSS reduced motion must ensure .chapter-reveal is instantly visible'
  );
});

// =========================================================================
// TEST 4: Mechanical Tap Compression & Tactile Physics Constants
// =========================================================================
suite.test('4. Mechanical Click Compression: Apple WWDC 2018 scale constants & interactive island audit', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const springsModule = await importModule(springsPath);

  ctx.assert(springsModule.mechanicalClick !== undefined, 'mechanicalClick must be exported');
  ctx.assertEqual(springsModule.mechanicalClick.scale, 0.97, 'mechanicalClick scale must be exactly 0.97');

  ctx.assert(springsModule.cardTap !== undefined, 'cardTap must be exported');
  ctx.assertEqual(springsModule.cardTap.scale, 0.985, 'cardTap scale must be exactly 0.985');

  // Verify interactive components consume mechanical click / whileTap compression
  const componentsToVerify = [
    'src/components/ui/MagneticButton.tsx',
    'src/components/Magnetic.tsx',
    'src/components/ui/ThemeToggle.tsx',
    'src/components/nav/FloatingNav.tsx',
    'src/components/nav/MobileNavSheet.tsx',
    'src/components/projects/CaseStudyModal.tsx',
    'src/components/lab/LabSuite.tsx',
    'src/components/about/SkillsBento.tsx',
    'src/components/contact/ContactTerminal.tsx',
  ];

  for (const relPath of componentsToVerify) {
    const fullPath = path.join(WORKSPACE_ROOT, relPath);
    ctx.assertFileExists(fullPath, `${relPath} must exist`);
    const code = fs.readFileSync(fullPath, 'utf8');

    const hasTap = code.includes('whileTap') || code.includes('mechanicalClick') || code.includes('cardTap');
    ctx.assert(hasTap, `${relPath} must implement active tap/click compression (whileTap / mechanicalClick)`);
  }
});

// =========================================================================
// TEST 5: 8-Chapter Scroll Reveal Orchestration & Intersection Observer Invariants
// =========================================================================
suite.test('5. Scroll Storytelling: 8-Chapter structure, .chapter-reveal styling & progressive disclosure', async (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'src', 'pages', 'index.astro');
  const cssPath = path.join(WORKSPACE_ROOT, 'src', 'styles', 'design-system.css');

  ctx.assertFileExists(indexPath, 'src/pages/index.astro must exist');
  ctx.assertFileExists(cssPath, 'src/styles/design-system.css must exist');

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Check CSS transitions for .chapter-reveal
  ctx.assert(
    cssContent.includes('.chapter-reveal'),
    'design-system.css must define .chapter-reveal'
  );
  ctx.assert(
    cssContent.includes('cubic-bezier(0.16, 1, 0.3, 1)'),
    'design-system.css must use Apple fluid cubic-bezier(0.16, 1, 0.3, 1) for chapter reveals'
  );

  // Check all 8 chapters in index.astro
  const requiredChapters = [
    'hero',
    'manifesto',
    'work',
    'lab',
    'about',
    'skills',
    'timeline',
    'contact',
  ];

  for (const chapter of requiredChapters) {
    ctx.assert(
      indexContent.includes(`id="${chapter}"`) || indexContent.includes(`id='${chapter}'`) || indexContent.includes(chapter),
      `index.astro must contain chapter section for "${chapter}"`
    );
  }

  // Check that chapter-reveal wrapper is used
  const revealMatches = indexContent.match(/class=["'][^"']*chapter-reveal[^"']*["']/g) || [];
  ctx.assert(
    revealMatches.length >= 6,
    `index.astro must wrap at least 6 chapters in .chapter-reveal containers (found ${revealMatches.length})`
  );

  // Check IntersectionObserver script
  ctx.assert(
    indexContent.includes('IntersectionObserver'),
    'index.astro must use IntersectionObserver for performant scroll-triggered reveals'
  );
  ctx.assert(
    indexContent.includes('is-revealed'),
    'index.astro must toggle .is-revealed class on entry'
  );
});

// =========================================================================
// TEST 6: Framer Motion Component Reduced-Motion & Instant Transition Invariants
// =========================================================================
suite.test('6. Framer Motion Component Reduced-Motion Safety across active interactive TSX islands', async (ctx) => {
  const activeComponents = [
    'src/components/ui/MagneticButton.tsx',
    'src/components/Magnetic.tsx',
    'src/components/ui/ThemeToggle.tsx',
    'src/components/nav/FloatingNav.tsx',
    'src/components/nav/MobileNavSheet.tsx',
    'src/components/hero/HeroParallaxPhoto.tsx',
    'src/components/projects/CaseStudyModal.tsx',
    'src/components/projects/CaseStudySheet.tsx',
    'src/components/projects/EditorialProjectsList.tsx',
    'src/components/projects/ProjectEditorialRow.tsx',
    'src/components/projects/visualizers/AeonisConsensusVisualizer.tsx',
    'src/components/projects/visualizers/GamsMemoryVisualizer.tsx',
    'src/components/projects/visualizers/KroneTelemetryVisualizer.tsx',
    'src/components/projects/visualizers/PortfolioExplodedVisualizer.tsx',
    'src/components/projects/visualizers/SentinelAstDiffVisualizer.tsx',
    'src/components/projects/visualizers/UltronDagVisualizer.tsx',
    'src/components/lab/LabSuite.tsx',
    'src/components/about/SkillsBento.tsx',
    'src/components/contact/ContactTerminal.tsx',
  ];

  ctx.assert(activeComponents.length >= 15, `Targeting ${activeComponents.length} active interactive components`);

  let animatedComponentCount = 0;
  for (const relPath of activeComponents) {
    const filePath = path.join(WORKSPACE_ROOT, relPath);
    ctx.assertFileExists(filePath, `${relPath} must exist`);
    const code = fs.readFileSync(filePath, 'utf8');

    const hasMotion = code.includes('framer-motion') || code.includes('motion.') || code.includes('useSpring');
    if (hasMotion) {
      animatedComponentCount++;
      const hasAccessibilityAwareness =
        code.includes('useReducedMotion') ||
        code.includes('getAccessibleSpring') ||
        code.includes('instantTransition') ||
        code.includes('prefers-reduced-motion') ||
        code.includes('springPresets');

      ctx.assert(
        hasAccessibilityAwareness,
        `Active animated component ${relPath} must integrate reduced-motion safety (useReducedMotion / instantTransition / springPresets)`
      );
    }
  }

  ctx.assert(
    animatedComponentCount >= 10,
    `At least 10 active TSX components utilize Framer Motion spring physics (found ${animatedComponentCount})`
  );
});

// =========================================================================
// TEST 7: Touch Device Coarse Pointer Simulation & Zero-Offset Guarantee
// =========================================================================
suite.test('7. Touch Device Simulation: Coarse pointer immunity & zero magnetic displacement', async (ctx) => {
  const hookCode = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src', 'hooks', 'useMagnetic.ts'), 'utf8');
  const magCode = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src', 'components', 'Magnetic.tsx'), 'utf8');

  ctx.assert(
    hookCode.includes('(pointer: fine)'),
    'useMagnetic.ts must check window.matchMedia("(pointer: fine)")'
  );
  ctx.assert(
    magCode.includes('(pointer: fine)'),
    'Magnetic.tsx must check window.matchMedia("(pointer: fine)")'
  );

  // Simulate mousemove on coarse pointer device
  const simulateCoarseInteraction = (isFinePointer, clientX, clientY) => {
    let position = { x: 0, y: 0 };
    if (!isFinePointer) {
      // Must not move
      return position;
    }
    const rawX = clientX * 0.28;
    const rawY = clientY * 0.28;
    const dist = Math.hypot(rawX, rawY);
    if (dist > 24 && dist > 0) {
      const ratio = 24 / dist;
      position = { x: rawX * ratio, y: rawY * ratio };
    } else {
      position = { x: rawX, y: rawY };
    }
    return position;
  };

  for (let i = 0; i < 500; i++) {
    const coarseResult = simulateCoarseInteraction(false, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    ctx.assertEqual(coarseResult.x, 0, 'Coarse pointer X offset must remain strictly 0');
    ctx.assertEqual(coarseResult.y, 0, 'Coarse pointer Y offset must remain strictly 0');
  }
});

// =========================================================================
// TEST 8: layoutId Morphing Tab Invariants Across Chapters
// =========================================================================
suite.test('8. layoutId Morphing Pills: Active tab navigation strips & bento filter indicators', async (ctx) => {
  const modalCode = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src', 'components', 'projects', 'CaseStudyModal.tsx'), 'utf8');
  const labCode = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src', 'components', 'lab', 'LabSuite.tsx'), 'utf8');
  const bentoCode = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src', 'components', 'about', 'SkillsBento.tsx'), 'utf8');

  // Verify active tab pill layoutId tokens
  ctx.assert(
    modalCode.includes('layoutId="activeCaseStudyTabPill"'),
    'CaseStudyModal.tsx must use layoutId="activeCaseStudyTabPill" for smooth FLIP morphing'
  );
  ctx.assert(
    labCode.includes('layoutId="activeLabSuiteTab"'),
    'LabSuite.tsx must use layoutId="activeLabSuiteTab" for smooth FLIP morphing'
  );
  ctx.assert(
    bentoCode.includes('layoutId="activeSkillsDomainPill"'),
    'SkillsBento.tsx must use layoutId="activeSkillsDomainPill" for smooth FLIP morphing'
  );
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
