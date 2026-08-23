/**
 * spring-physics-audit.test.mjs — Tier 1: Apple Fluid Spring Physics Audit
 * Audits src/lib/springs.ts, validates WWDC 2018 spring mechanics (mass, stiffness, damping, restDelta),
 * computes damping ratios (zeta), and audits interactive components for Framer Motion spring usage
 * replacing legacy static CSS transitions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Spring Physics & Framer Motion Replacement (Tier 1)',
  1,
  'Audits spring parameter matrices in src/lib/springs.ts and Framer Motion integration across interactive components.'
);

const EXPECTED_PRESETS = ['snappy', 'glide', 'buoyant', 'morph', 'cinematic', 'sheet', 'magnetic'];

suite.test('src/lib/springs.ts module existence and export contract', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  ctx.assertFileExists(springsPath, 'src/lib/springs.ts must exist per M1 / Feature 2 contract');

  // Dynamic import of TypeScript module via importModule
  const springsModule = await importModule(springsPath);
  ctx.assert(springsModule !== null && typeof springsModule === 'object', 'springs.ts must export a valid module object');

  // Check either individual exports or springPresets dictionary
  const presets = springsModule.springPresets || springsModule.springs || springsModule;
  ctx.assert(presets !== null && typeof presets === 'object', 'springs.ts must export spring presets');

  for (const presetName of EXPECTED_PRESETS) {
    const preset = presets[presetName] || springsModule[presetName];
    ctx.assert(preset !== undefined, `springs.ts must define "${presetName}" preset`);
  }
});

suite.test('Explicit physical parameters (mass, stiffness, damping, restDelta) for all presets', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  if (!fs.existsSync(springsPath)) {
    throw new Error(`Missing ${springsPath}`);
  }

  const springsModule = await importModule(springsPath);
  const presets = springsModule.springPresets || springsModule.springs || springsModule;

  for (const presetName of EXPECTED_PRESETS) {
    const preset = presets[presetName] || springsModule[presetName];
    ctx.assert(preset !== undefined, `Preset "${presetName}" must exist`);

    ctx.assertEqual(preset.type, 'spring', `Preset "${presetName}" must declare type: "spring"`);
    ctx.assertPositive(preset.mass, `Preset "${presetName}" must have positive numeric mass (got: ${preset.mass})`);
    ctx.assertPositive(preset.stiffness, `Preset "${presetName}" must have positive numeric stiffness (got: ${preset.stiffness})`);
    ctx.assertPositive(preset.damping, `Preset "${presetName}" must have positive numeric damping (got: ${preset.damping})`);
    
    // restDelta should be small threshold (<= 0.01) for precise rest state
    if (preset.restDelta !== undefined) {
      ctx.assert(typeof preset.restDelta === 'number' && preset.restDelta <= 0.01,
        `Preset "${presetName}" restDelta must be <= 0.01 for settling precision (got: ${preset.restDelta})`
      );
    }
  }
});

suite.test('Mathematical stability and damping ratio (zeta) validation', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  if (!fs.existsSync(springsPath)) {
    throw new Error(`Missing ${springsPath}`);
  }

  const springsModule = await importModule(springsPath);
  const presets = springsModule.springPresets || springsModule.springs || springsModule;

  for (const presetName of EXPECTED_PRESETS) {
    const preset = presets[presetName] || springsModule[presetName];
    const { mass, stiffness, damping } = preset;

    // Damping ratio formula: zeta = damping / (2 * sqrt(mass * stiffness))
    const criticalDamping = 2 * Math.sqrt(mass * stiffness);
    const zeta = damping / criticalDamping;

    // Stable fluid UI springs typically range from underdamped (0.4) to slightly overdamped (1.4)
    ctx.assertInRange(
      zeta,
      0.3,
      1.6,
      `Preset "${presetName}" damping ratio zeta=${zeta.toFixed(3)} must be physically stable in range [0.3, 1.6]`
    );
  }
});

suite.test('Component audit: Framer Motion spring usage on interactive React Islands', (ctx) => {
  const componentsDir = path.join(WORKSPACE_ROOT, 'src', 'components');
  ctx.assertDirExists(componentsDir, 'src/components directory must exist');

  const files = fs.readdirSync(componentsDir);
  const reactComponents = files.filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

  if (reactComponents.length > 0) {
    let motionUsageCount = 0;
    for (const compFile of reactComponents) {
      const content = fs.readFileSync(path.join(componentsDir, compFile), 'utf8');
      if (
        content.includes('framer-motion') ||
        content.includes('motion.') ||
        content.includes('AnimatePresence') ||
        content.includes('springPresets') ||
        content.includes('useSpring')
      ) {
        motionUsageCount++;
      }
    }
    ctx.assert(
      motionUsageCount > 0,
      `At least one interactive component must utilize Framer Motion springs (found ${motionUsageCount}/${reactComponents.length})`
    );
  } else {
    // If React islands are planned for M3, check package.json or design system guidelines
    const pkg = JSON.parse(fs.readFileSync(path.join(WORKSPACE_ROOT, 'package.json'), 'utf8'));
    ctx.assert(
      (pkg.dependencies && pkg.dependencies['framer-motion']) || fs.existsSync(path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts')),
      'Framer Motion or spring physics library must be present or configured in toolchain'
    );
  }
});

suite.test('Absence of static CSS transitions on interactive island components', (ctx) => {
  const componentsDir = path.join(WORKSPACE_ROOT, 'src', 'components');
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir);
    const reactComponents = files.filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

    for (const compFile of reactComponents) {
      const content = fs.readFileSync(path.join(componentsDir, compFile), 'utf8');
      // Verify no hardcoded CSS linear/ease hover transitions replacing physics
      const hasLinearTransition = /transition:\s*(all|transform)\s+0\.\d+s\s+linear/i.test(content);
      ctx.assert(
        !hasLinearTransition,
        `Interactive component ${compFile} must not use static linear CSS transitions instead of Framer Motion springs`
      );
    }
  }
  ctx.assert(true, 'No legacy static linear transitions detected on interactive island components');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
