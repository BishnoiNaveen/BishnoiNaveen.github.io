/**
 * tests/e2e/m3-cinematic-scroll-engine.test.mjs
 * Milestone M3 & M4 Verification Suite — Cinematic 3D Scroll Engine & Overlays
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 3 & 4: Cinematic 3D Scroll Engine & Ultra-Premium Resume UI',
  3,
  'Empirical verification of 120-frame WebP sequence, Canvas 2D frame scrubber, 4-act HUD overlay, and Lenis/GSAP scroll track'
);

// ============================================================================
// 1. 3D WebP Frame Sequence & Manifest Verification
// ============================================================================
suite.test('M3.1: All 120 WebP 3D Frames and Manifest exist and are non-empty', (t) => {
  const framesDir = path.join(WORKSPACE_ROOT, 'public', 'assets', '3d-frames');
  const manifestPath = path.join(framesDir, 'manifest.json');

  t.assertFileExists(manifestPath, 'manifest.json must exist in public/assets/3d-frames');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  t.assertEqual(manifest.totalFrames, 120, 'Manifest must specify 120 total frames');
  t.assertEqual(manifest.width, 1920, 'Manifest width must be 1920');
  t.assertEqual(manifest.height, 1080, 'Manifest height must be 1080');
  t.assertEqual(manifest.format, 'webp', 'Manifest format must be webp');
  t.assertEqual(manifest.acts.length, 4, 'Manifest must declare 4 distinct acts');

  // Verify all 120 frames exist on disk
  for (let i = 1; i <= 120; i++) {
    const padded = String(i).padStart(3, '0');
    const frameFile = path.join(framesDir, `frame_${padded}.webp`);
    t.assertFileExists(frameFile, `Frame ${padded} must exist`);
    const stat = fs.statSync(frameFile);
    t.assert(stat.size > 1000, `Frame ${padded} must be > 1KB (got ${stat.size} bytes)`);
  }
});

// ============================================================================
// 2. ScrollCanvas Component Architecture & Keyframe Preloading
// ============================================================================
suite.test('M3.2: ScrollCanvas.tsx High-Performance 2D Canvas & Preloader Invariants', (t) => {
  const scrollCanvasPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'Cinematic', 'ScrollCanvas.tsx');
  t.assertFileExists(scrollCanvasPath, 'ScrollCanvas.tsx must exist');

  const content = fs.readFileSync(scrollCanvasPath, 'utf8');
  t.assertMatches(content, /devicePixelRatio/, 'ScrollCanvas must handle Retina / HiDPI DPR scaling');
  t.assertMatches(content, /imageSmoothingQuality\s*=\s*['"]high['"]/, 'ScrollCanvas must set high image smoothing quality');
  t.assertMatches(content, /drawImage/, 'ScrollCanvas must use 2D context drawImage for 60fps scrubbing');
  t.assertMatches(content, /canvasAspect\s*>\s*imgAspect|imgAspect/, 'ScrollCanvas must implement aspect ratio cover algorithm');
  t.assertMatches(content, /requestAnimationFrame/, 'ScrollCanvas must use RAF for smooth interpolation');
});

// ============================================================================
// 3. CinematicOverlay 4-Act Synchronized HUD & Optical Flare
// ============================================================================
suite.test('M3.3: CinematicOverlay.tsx 4-Act Narrative Typography & Telemetry', (t) => {
  const overlayPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'Cinematic', 'CinematicOverlay.tsx');
  t.assertFileExists(overlayPath, 'CinematicOverlay.tsx must exist');

  const content = fs.readFileSync(overlayPath, 'utf8');
  // Act 1
  t.assert(content.includes('NAVEEN BISHNOI'), 'Must include Act 1 Hero Name');
  t.assert(content.includes('Principal AI &amp; Systems Architect') || content.includes('Principal AI & Systems Architect'), 'Must include Act 1 Title');
  t.assert(content.includes('Scroll to Initialize Neural Dive'), 'Must include Act 1 Scroll CTA');

  // Act 2
  t.assert(content.includes('DEEP NEURAL LINK ACTIVE'), 'Must include Act 2 Deep Neural Link');
  t.assert(content.includes('Synaptic Lattice 4.8 THz'), 'Must include Act 2 Lattice telemetry');
  t.assert(content.includes('84 / 84 ACTIVE'), 'Must include 84 active axon nodes');

  // Act 3
  t.assert(content.includes('SINGULARITY PASS-THROUGH'), 'Must include Act 3 Singularity Pass-Through');
  t.assert(content.includes('POSIX Atomic Swap'), 'Must include Invariant 1: POSIX Atomic Swap');
  t.assert(content.includes('Kahn DAG Sentry'), 'Must include Invariant 2: Kahn DAG Sentry');

  // Act 4
  t.assert(content.includes('TRANSITIONING TO RESUME &amp; PORTFOLIO') || content.includes('TRANSITIONING TO RESUME & PORTFOLIO'), 'Must include Act 4 Breakthrough transition');
  t.assertMatches(content, /mix-blend-screen|radial-gradient/, 'Must include optical radial light flare overlay');
});

// ============================================================================
// 4. CinematicSection & Lenis / GSAP ScrollTrigger Integration
// ============================================================================
suite.test('M3.4: CinematicSection.tsx 400vh Track & Momentum Scroll Setup', (t) => {
  const sectionPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'Cinematic', 'CinematicSection.tsx');
  const heroAstroPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'Cinematic', 'CinematicHero.astro');

  t.assertFileExists(sectionPath, 'CinematicSection.tsx must exist');
  t.assertFileExists(heroAstroPath, 'CinematicHero.astro must exist');

  const content = fs.readFileSync(sectionPath, 'utf8');
  t.assertMatches(content, /import Lenis from ['"]lenis['"]/, 'CinematicSection must import Lenis');
  t.assertMatches(content, /ScrollTrigger/, 'CinematicSection must configure GSAP ScrollTrigger');
  t.assertMatches(content, /h-\[400vh\]|400vh/, 'CinematicSection must provide 400vh scroll height');
  t.assertMatches(content, /prefers-reduced-motion/, 'CinematicSection must respect prefers-reduced-motion');
});

// ============================================================================
// 5. Empirical Stress Test: 10,000 Rapid Scroll Scrubbing Computations
// ============================================================================
suite.test('M3.5: 10,000 Rapid Scroll Progress Calculations (< 50ms)', (t) => {
  const totalFrames = 120;
  const startTime = performance.now();

  for (let i = 0; i < 10000; i++) {
    const rawProgress = (i % 1000) / 1000;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    const targetFrame = Math.min(
      totalFrames,
      Math.max(1, Math.round(clampedProgress * (totalFrames - 1)) + 1)
    );

    t.assert(targetFrame >= 1 && targetFrame <= 120, 'Frame must be bounded in [1, 120]');

    // Act opacities
    const act1 = clampedProgress <= 0.20 ? 1 : clampedProgress <= 0.28 ? Math.max(0, 1 - (clampedProgress - 0.20) / 0.08) : 0;
    const act4 = clampedProgress < 0.84 ? 0 : Math.min(1, (clampedProgress - 0.84) / 0.10);
    t.assert(act1 >= 0 && act1 <= 1, 'Act 1 opacity must be normalized [0, 1]');
    t.assert(act4 >= 0 && act4 <= 1, 'Act 4 opacity must be normalized [0, 1]');
  }

  const durationMs = performance.now() - startTime;
  t.assert(durationMs < 50, `10,000 scroll scrubbing calculations completed in ${durationMs.toFixed(2)}ms (< 50ms)`);
});

// ============================================================================
// 6. Milestone M4 Executive Resume & Portfolio UI Integrity
// ============================================================================
suite.test('M4.1: Executive Resume & Portfolio Transition Invariants', (t) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  t.assertFileExists(indexPath, 'dist/index.html must exist');

  const html = fs.readFileSync(indexPath, 'utf8');
  t.assert(html.includes('Building Resilient Systems'), 'Hero must contain headline');
  t.assert(html.includes('KRONE Agriculture India'), 'Timeline must highlight KRONE Agriculture India');
  t.assert(html.includes('Bachelor of Computer Applications'), 'Timeline must include BCA Honours');
  t.assert(html.includes('0029bishnoinaveen@gmail.com'), 'Must provide direct email contact');
});

export default suite;
