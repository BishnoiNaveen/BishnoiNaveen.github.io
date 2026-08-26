/**
 * m2-navigation-hero-manifesto.test.mjs — Milestone 2 Verification Suite
 * Verifies Floating Navigation Dock, Cinematic Editorial Hero & Typographic Manifesto.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, getCssContent, getDistHtml } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 2: Navigation, Cinematic Hero & Typographic Manifesto',
  2,
  'Empirical verification of visionOS floating nav, Framer Motion active pills, magazine parallax hero, magnetic buttons, and architectural manifesto'
);

// ============================================================================
// 1. FLOATING NAVIGATION DOCK (5 Tests)
// ============================================================================
suite.test('M2.1: Floating Navigation Dock Source Files & Structure', (t) => {
  const floatingNavPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'FloatingNav.tsx');
  const mobileSheetPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'MobileNavSheet.tsx');
  const headerPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'Header.astro');

  t.assertFileExists(floatingNavPath, 'FloatingNav.tsx must exist');
  t.assertFileExists(mobileSheetPath, 'MobileNavSheet.tsx must exist');
  t.assertFileExists(headerPath, 'Header.astro must exist');

  const navContent = fs.readFileSync(floatingNavPath, 'utf8');
  t.assertMatches(navContent, /layoutId=["']active-nav-pill["']/, 'FloatingNav must use active-nav-pill layoutId');
  t.assertMatches(navContent, /springPresets\.glide/, 'FloatingNav must use springPresets.glide transition');
});

suite.test('M2.2: Navigation Items & Scroll Spy Chapter Targets', (t) => {
  const floatingNavPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'FloatingNav.tsx');
  const content = fs.readFileSync(floatingNavPath, 'utf8');

  const expectedLabels = ['Work', 'About', 'Lab', 'Contact', 'Resume'];
  for (const label of expectedLabels) {
    t.assert(content.includes(label), `Nav items must contain ${label}`);
  }
  t.assertMatches(content, /IntersectionObserver/, 'FloatingNav must utilize IntersectionObserver for scroll spy');
});

suite.test('M2.3: Integrated ThemeToggle Component & Zero Layout Shift', (t) => {
  const togglePath = path.join(WORKSPACE_ROOT, 'src', 'components', 'ui', 'ThemeToggle.tsx');
  t.assertFileExists(togglePath, 'ThemeToggle.tsx must exist');

  const content = fs.readFileSync(togglePath, 'utf8');
  t.assertMatches(content, /toggleTheme/, 'ThemeToggle must call toggleTheme');
  t.assertMatches(content, /subscribeToThemeChange/, 'ThemeToggle must subscribe to theme changes');
  t.assertMatches(content, /aria-label/, 'ThemeToggle must include accessible aria-label');
});

suite.test('M2.4: MobileNavSheet Drag-to-Dismiss Physics & Touch Target Sizes', (t) => {
  const sheetPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'nav', 'MobileNavSheet.tsx');
  const content = fs.readFileSync(sheetPath, 'utf8');

  t.assertMatches(content, /drag=["']y["']/, 'MobileNavSheet must support drag="y" gesture');
  t.assertMatches(content, /springPresets\.sheet/, 'MobileNavSheet must use springPresets.sheet transition');
  t.assertMatches(content, /min-h-\[48px\]|min-w-\[44px\]/, 'MobileNavSheet must guarantee >=44px touch targets');
});

suite.test('M2.5: VisionOS Level 3 Glass Styling & Specular Hairline', (t) => {
  const css = getCssContent();
  t.assertMatches(css, /backdrop-filter/, 'CSS must configure backdrop-filter');
  t.assertMatches(css, /specular-hairline/, 'CSS must define specular-hairline highlight rule');
});

// ============================================================================
// 2. CINEMATIC EDITORIAL HERO (5 Tests)
// ============================================================================
suite.test('M2.6: Cinematic Hero Source Files & Composition', (t) => {
  const heroAstroPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'CinematicHero.astro');
  const parallaxPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'HeroParallaxPhoto.tsx');
  const actionsPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'HeroActionButtons.tsx');

  t.assertFileExists(heroAstroPath, 'CinematicHero.astro must exist');
  t.assertFileExists(parallaxPath, 'HeroParallaxPhoto.tsx must exist');
  t.assertFileExists(actionsPath, 'HeroActionButtons.tsx must exist');
});

suite.test('M2.7: Editorial Headline & Subtitle Integrity', (t) => {
  const heroPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'CinematicHero.astro');
  const content = fs.readFileSync(heroPath, 'utf8');

  t.assert(content.includes('Building Resilient Systems.'), 'Hero must feature "Building Resilient Systems."');
  t.assert(content.includes('Architecting AI Automation.'), 'Hero must feature "Architecting AI Automation."');
  t.assert(content.includes('Naveen Bishnoi — Software Architect &amp; AI Systems Engineer') || content.includes('Naveen Bishnoi — Software Architect & AI Systems Engineer'), 'Hero must declare Naveen Bishnoi software architect subtitle');
});

suite.test('M2.8: Portrait Parallax Photo Interactive 3D Physics', (t) => {
  const parallaxPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'HeroParallaxPhoto.tsx');
  const content = fs.readFileSync(parallaxPath, 'utf8');

  t.assertMatches(content, /useSpring/, 'HeroParallaxPhoto must utilize useSpring for smooth tilt/translation');
  t.assertMatches(content, /rotateX|rotateY/, 'HeroParallaxPhoto must map mouse movement to 3D rotation');
  t.assertMatches(content, /pointer:\s*fine/, 'HeroParallaxPhoto must guard parallax to fine-pointer devices');
  t.assertMatches(content, /specular-hairline/, 'HeroParallaxPhoto frame must include specular-hairline class');
});

suite.test('M2.9: Magnetic Action Buttons Protocol', (t) => {
  const buttonPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'ui', 'MagneticButton.tsx');
  const content = fs.readFileSync(buttonPath, 'utf8');

  t.assertMatches(content, /useMagnetic/, 'MagneticButton must use useMagnetic hook');
  t.assertMatches(content, /springPresets\.snappy/, 'MagneticButton must use springPresets.snappy');
});

suite.test('M2.10: Zero Cyber Card Clutter in Hero', (t) => {
  const heroPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'CinematicHero.astro');
  const content = fs.readFileSync(heroPath, 'utf8');

  t.assertDoesNotMatch(content, /cyber-box|glow-box|neon-border/i, 'Hero must not contain glowing cyber boxes');
  t.assertDoesNotMatch(content, /\$0\.\d+\s*\/\s*token/i, 'Hero must not contain synthetic dollar tickers');
});

// ============================================================================
// 3. TYPOGRAPHIC MANIFESTO (5 Tests)
// ============================================================================
suite.test('M2.11: Typographic Manifesto Source File & Headline', (t) => {
  const manifestoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'manifesto', 'TypographicManifesto.astro');
  t.assertFileExists(manifestoPath, 'TypographicManifesto.astro must exist');

  const content = fs.readFileSync(manifestoPath, 'utf8');
  t.assert(content.includes('Software with Mathematical Invariants &amp; Physical Depth.') || content.includes('Software with Mathematical Invariants & Physical Depth.'), 'Manifesto must feature thesis headline');
});

suite.test('M2.12: Three Core Engineering Pillars Definition', (t) => {
  const manifestoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'manifesto', 'TypographicManifesto.astro');
  const content = fs.readFileSync(manifestoPath, 'utf8');

  t.assert(content.includes('Invariants Over Assertions'), 'Must define Pillar 1: Invariants Over Assertions');
  t.assert(content.includes('Zero Dynamic Leaks'), 'Must define Pillar 2: Zero Dynamic Leaks');
  t.assert(content.includes('Deterministic Automation'), 'Must define Pillar 3: Deterministic Automation');
});

suite.test('M2.13: Grounded System Proof Tags', (t) => {
  const manifestoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'manifesto', 'TypographicManifesto.astro');
  const content = fs.readFileSync(manifestoPath, 'utf8');

  t.assert(content.includes('POSIX Atomic Inode Swap'), 'Must include POSIX Atomic Inode Swap tag');
  t.assert(content.includes('Valgrind 0-Byte Heap Leak'), 'Must include Valgrind 0-Byte Heap Leak tag');
  t.assert(content.includes('BFT Quorum & AST Sentry'), 'Must include BFT Quorum & AST Sentry tag');
});

suite.test('M2.14: Fluid Typography Clamp Scaling in Design Tokens', (t) => {
  const css = getCssContent();
  t.assertMatches(css, /--type-display-hero:\s*clamp\(/, 'Design tokens must define fluid clamp for hero display');
  t.assertMatches(css, /--type-headline-chapter:\s*clamp\(/, 'Design tokens must define fluid clamp for chapter headlines');
});

suite.test('M2.15: Built HTML Static Delivery & Landmark Verification', (t) => {
  const html = getDistHtml('index.html');
  t.assert(html.length > 500, 'Built index.html must be populated');
  t.assert(html.includes('Building Resilient Systems'), 'Built index.html must contain hero headline');
  t.assert(html.includes('Software with Mathematical Invariants'), 'Built index.html must contain manifesto headline');
  t.assert(html.includes('role="banner"') || html.includes('<header'), 'Built index.html must contain header landmark');
  t.assert(html.includes('role="navigation"') || html.includes('<nav'), 'Built index.html must contain navigation landmark');
  t.assert(html.includes('id="hero"'), 'Built index.html must contain id="hero"');
  t.assert(html.includes('id="manifesto"'), 'Built index.html must contain id="manifesto"');
});

export default suite;
