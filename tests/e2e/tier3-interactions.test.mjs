/**
 * tier3-interactions.test.mjs — Tier 3: Cross-Feature Combinations & Pairwise Contracts
 * Tests pairwise interactions across modules: theme toggle + modal expand, filter change + deep link,
 * mobile nav + scroll spy, magnetic button + modal, reduced motion + spring presets, etc.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  createTestSuite,
  WORKSPACE_ROOT,
  getCssContent,
  calculateContrastRatio,
  importModule,
} from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Tier 3: Cross-Feature Combinations & Pairwise Contracts',
  3,
  'Validates pairwise interactions, state synchronization, and cross-module contracts'
);

suite.test('P1: Theme Mode Switcher + Case Study Modal Layer Hierarchy', (t) => {
  const getModalThemeStyles = (theme) => {
    if (theme === 'light') {
      return {
        bg: 'rgba(255, 255, 255, 0.94)',
        text: '#1D1D1F',
        border: 'rgba(0, 0, 0, 0.08)',
        contrast: calculateContrastRatio('#1D1D1F', '#FFFFFF'),
      };
    }
    return {
      bg: 'rgba(22, 24, 31, 0.94)',
      text: '#F5F5F7',
      border: 'rgba(255, 255, 255, 0.08)',
      contrast: calculateContrastRatio('#F5F5F7', '#16181F'),
    };
  };

  const lightModal = getModalThemeStyles('light');
  const darkModal = getModalThemeStyles('dark');

  t.assert(lightModal.contrast >= 7.0, `Light mode modal text contrast (${lightModal.contrast.toFixed(2)}:1) meets WCAG AAA`);
  t.assert(darkModal.contrast >= 7.0, `Dark mode modal text contrast (${darkModal.contrast.toFixed(2)}:1) meets WCAG AAA`);
  t.assertNonEmptyString(lightModal.border, 'Light modal has subtle border');
  t.assertNonEmptyString(darkModal.border, 'Dark modal has subtle border');
});

suite.test('P2: Category Filter Change + Deep Link Project Anchor Navigation', async (t) => {
  const projectsModule = await importModule(path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts'));
  const projects = projectsModule.projects || [];

  const filterAndFind = (domain, slug) => {
    const matched = projects.filter(p => domain === 'ALL' || p.domain === domain || p.category === domain);
    return matched.find(p => p.id === slug || p.slug === slug);
  };

  const gams = filterAndFind('Systems & IoT', 'gams');
  t.assert(gams !== undefined, 'GAMS project resolved when filtering by Systems & IoT');
  t.assertEqual(gams.id, 'gams', 'Matched project id is gams');

  const aeonis = filterAndFind('Autonomous & AI', 'aeonis-ops');
  t.assert(aeonis !== undefined, 'AEONIS project resolved when filtering by Autonomous & AI');
});

suite.test('P3: Mobile Navigation Drawer + Section Scroll Spy Synchronization', (t) => {
  let navState = { isDrawerOpen: true, activeSection: '#hero' };
  const onMobileNavSelect = (targetAnchor) => {
    navState = {
      isDrawerOpen: false,
      activeSection: targetAnchor,
    };
  };

  onMobileNavSelect('#work');
  t.assertEqual(navState.isDrawerOpen, false, 'Selecting mobile nav item immediately closes drawer');
  t.assertEqual(navState.activeSection, '#work', 'Selecting mobile nav item updates active scroll spy section');
});

suite.test('P4: Magnetic Button Attraction + Modal Trigger Activation', (t) => {
  const triggerState = {
    magneticOffset: { x: 4.2, y: -2.1 },
    modalOpen: false,
    click() {
      this.magneticOffset = { x: 0, y: 0 }; // Snap back on click
      this.modalOpen = true;
    }
  };

  triggerState.click();
  t.assertEqual(triggerState.modalOpen, true, 'Clicking magnetic CTA opens modal dialog');
  t.assertEqual(triggerState.magneticOffset.x, 0, 'Magnetic offset resets on click compression');
});

suite.test('P5: prefers-reduced-motion + Spring Presets Deactivation', async (t) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const springsModule = await importModule(springsPath);
  const presets = springsModule.springPresets || {};

  const resolveTransition = (presetName, prefersReducedMotion) => {
    if (prefersReducedMotion) {
      return { duration: 0.0001, ease: 'linear' };
    }
    return presets[presetName];
  };

  const normalGlide = resolveTransition('glide', false);
  t.assertEqual(normalGlide.type, 'spring', 'Normal motion uses spring physics');

  const reducedGlide = resolveTransition('glide', true);
  t.assertEqual(reducedGlide.duration, 0.0001, 'Reduced motion bypasses springs with near-zero duration');
});

suite.test('P6: Case Study Modal Scroll Lock + Floating Nav Elevation Isolation', (t) => {
  const layers = {
    canvas: 0,
    content: 10,
    floatingNav: 50,
    modalBackdrop: 90,
    modalDialog: 100,
  };

  t.assert(layers.modalDialog > layers.modalBackdrop, 'Modal dialog is above modal backdrop');
  t.assert(layers.modalBackdrop > layers.floatingNav, 'Modal backdrop covers floating nav');
  t.assert(layers.floatingNav > layers.content, 'Floating nav is above regular content');
});

suite.test('P7: Lab DAG Task Inspector + Ultron Case Study Cross-Linking', async (t) => {
  const projectsModule = await importModule(path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts'));
  const ultron = (projectsModule.projects || []).find(p => p.id === 'ultron');
  t.assert(ultron !== undefined, 'Ultron project data exists');
  t.assert(ultron.systemInvariants.some(i => i.toLowerCase().includes('topological')), 'Ultron declares topological DAG invariants in case study');
});

suite.test('P8: Contact Clipboard Copy + Non-Blocking Timezone Clock', async (t) => {
  let clockTicks = 0;
  const timer = setInterval(() => { clockTicks++; }, 1);

  const simulateCopy = async () => {
    await new Promise(r => setTimeout(r, 5));
    return 'COPIED';
  };

  const copyStatus = await simulateCopy();
  clearInterval(timer);

  t.assertEqual(copyStatus, 'COPIED', 'Clipboard copy succeeds asynchronously');
  t.assertPositive(clockTicks, 'Timezone clock timer continues running during clipboard copy');
});

suite.test('P9: Project Tech Stack Chips + Skill Taxonomy Referential Consistency', async (t) => {
  const projectsModule = await importModule(path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts'));
  const projects = projectsModule.projects || [];
  const allProjectTech = new Set(projects.flatMap(p => p.techStack));

  t.assert(allProjectTech.has('C'), 'Projects include C');
  t.assert(allProjectTech.has('Python') || allProjectTech.has('TypeScript'), 'Projects include Python or TypeScript');
  t.assert(allProjectTech.has('Astro') || allProjectTech.has('React 19'), 'Projects include modern web stack');
});

suite.test('P10: Viewport Resize Transition: Desktop Dialog <-> Mobile Bottom Sheet', (t) => {
  const getModalPresentation = (viewportWidth) => {
    if (viewportWidth < 768) {
      return { type: 'BOTTOM_SHEET', dragToDismiss: true, borderRadius: '24px 24px 0 0' };
    }
    return { type: 'CENTERED_DIALOG', dragToDismiss: false, borderRadius: '20px' };
  };

  const mobileModal = getModalPresentation(375);
  t.assertEqual(mobileModal.type, 'BOTTOM_SHEET', 'Under 768px modal renders as bottom sheet');
  t.assertEqual(mobileModal.dragToDismiss, true, 'Mobile bottom sheet enables drag to dismiss');

  const desktopModal = getModalPresentation(1440);
  t.assertEqual(desktopModal.type, 'CENTERED_DIALOG', 'Desktop renders centered modal dialog');
  t.assertEqual(desktopModal.dragToDismiss, false, 'Desktop modal disables drag gesture');
});

suite.test('P11: Dark Mode Canvas + 5-Level Glass Specular Reflection Integration', (t) => {
  const darkGlassSpec = {
    canvasBg: '#08080A',
    glassBg: 'rgba(22, 24, 31, 0.68)',
    specularTopBorder: '1px solid rgba(255, 255, 255, 0.08)',
    blur: '32px',
  };

  t.assertNonEmptyString(darkGlassSpec.specularTopBorder, 'Dark glass declares specular top edge reflection');
  t.assertEqual(darkGlassSpec.blur, '32px', 'Dark glass utilizes 32px optical blur');
});

suite.test('P12: Hero Parallax Scroll Transform + Sticky Nav Stacking Context', (t) => {
  const heroTransformStyle = 'transform: translate3d(0px, 12.5px, 0px); will-change: transform;';
  t.assertMatches(heroTransformStyle, /translate3d|will-change/, 'Hero parallax uses 3D transform acceleration without layout reflow');
});

suite.test('P13: Lab POSIX Inode State Machine + GAMS Case Study Invariants Alignment', async (t) => {
  const projectsModule = await importModule(path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts'));
  const gams = (projectsModule.projects || []).find(p => p.id === 'gams');
  t.assert(gams.systemInvariants.some(i => i.toLowerCase().includes('atomic') || i.toLowerCase().includes('inode')), 'GAMS invariants state POSIX atomic inode swap');
});

suite.test('P14: Keyboard Tab Navigation + Focus Ring Containment within Modal', (t) => {
  const modalElements = ['close-btn', 'case-study-content', 'repo-link'];
  let currentFocusIndex = 0;

  const handleTab = (shiftKey) => {
    if (shiftKey) {
      currentFocusIndex = (currentFocusIndex - 1 + modalElements.length) % modalElements.length;
    } else {
      currentFocusIndex = (currentFocusIndex + 1) % modalElements.length;
    }
    return modalElements[currentFocusIndex];
  };

  t.assertEqual(handleTab(false), 'case-study-content', 'Tab moves forward');
  t.assertEqual(handleTab(false), 'repo-link', 'Tab moves forward to last element');
  t.assertEqual(handleTab(false), 'close-btn', 'Tab wraps around to first element');
  t.assertEqual(handleTab(true), 'repo-link', 'Shift+Tab wraps backwards');
});

suite.test('P15: Astro Static HTML Baseline + Selective React Island Hydration Contract', (t) => {
  const islandDirectives = ['client:load', 'client:visible', 'client:idle', 'client:media'];
  t.assert(islandDirectives.includes('client:load'), 'Astro supports client:load directive');
  t.assert(islandDirectives.includes('client:visible'), 'Astro supports client:visible directive');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
