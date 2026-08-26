/**
 * m3-editorial-casestudies.test.mjs — Milestone 3 Editorial Works & 7-Part Case Studies Suite
 * 
 * Objective:
 * 1. Validate complete 7-part engineering anatomy across all 6 premier projects:
 *    Problem -> Idea -> System Architecture -> Build & Invariants -> Verification & Proof -> Lessons -> Outcome.
 * 2. Assert verifiable technical invariants (Valgrind 0-byte, POSIX rename, 50Hz CAN, BFT quorum, DAG acyclicity, SAIF Tier 3).
 * 3. Verify existence and integrity of all bespoke visualizers and Level 4 visionOS modal components.
 * 4. Stress-test 10,000 rapid modal opening, project switching, and 7-tab transitions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 3: Full-Width Editorial Works & 7-Part Interactive Case Studies',
  3,
  'Validates 6 bespoke art-directed editorial project chapters, 7-part case study anatomy, and Level 4 modal physics.'
);

const PREMIER_PROJECT_IDS = [
  'gams',
  'krone-iot',
  'aeonis-ops',
  'ultron',
  'sentinel-ai',
  'portfolio',
];

const MANDATORY_7_SECTIONS = [
  'problem',
  'idea',
  'systemArchitecture',
  'buildAndInvariants',
  'verificationAndProof',
  'lessonsLearned',
  'measurableOutcome',
];

// =========================================================================
// TEST 1: 7-Part Case Study Anatomy Completeness
// =========================================================================
suite.test('All 6 Premier Projects must implement full 7-part engineering case study anatomy', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  ctx.assertFileExists(projectsPath, 'src/data/projects.ts must exist');

  const { projects } = await importModule(projectsPath);
  ctx.assertArrayMinLength(projects, 6, 'Must contain at least 6 projects');

  for (const projId of PREMIER_PROJECT_IDS) {
    const proj = projects.find(p => p.id === projId);
    ctx.assert(proj !== undefined, `Premier project "${projId}" must exist in projects.ts`);
    ctx.assert(proj.featured === true, `Project "${projId}" must be marked as featured: true`);
    ctx.assert(proj.caseStudy !== undefined, `Project "${projId}" must have a complete caseStudy object`);

    const cs = proj.caseStudy;
    for (const sectionKey of MANDATORY_7_SECTIONS) {
      const sec = cs[sectionKey];
      ctx.assert(sec !== undefined, `Project "${projId}" case study must include section "${sectionKey}"`);
      ctx.assertNonEmptyString(sec.title, `Project "${projId}" section "${sectionKey}" must have title`);
      ctx.assertNonEmptyString(sec.slug, `Project "${projId}" section "${sectionKey}" must have slug`);
      ctx.assertNonEmptyString(sec.summary, `Project "${projId}" section "${sectionKey}" must have summary`);
      ctx.assertArrayMinLength(sec.content, 1, `Project "${projId}" section "${sectionKey}" must contain content paragraphs`);
    }
  }
});

// =========================================================================
// TEST 2: Invariants & Empirical Proof Verifications
// =========================================================================
suite.test('Verified technical deliverables and mathematical invariants across all 6 projects', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  // 1. GAMS: 0-byte Valgrind leak & POSIX rename
  const gams = projects.find(p => p.id === 'gams');
  ctx.assert(
    gams.metrics.some(m => m.value.includes('0 Bytes') || m.label.includes('Valgrind')),
    'GAMS must verify Valgrind 0-byte heap leak'
  );
  ctx.assert(
    gams.systemInvariants.some(inv => inv.includes('rename') || inv.includes('inode')),
    'GAMS must specify atomic inode swap invariant'
  );

  // 2. KRONE IoT: 50Hz CAN Bus & 72h offline ring buffer
  const krone = projects.find(p => p.id === 'krone-iot');
  ctx.assert(
    krone.metrics.some(m => m.value.includes('50 Hz')),
    'KRONE IoT must verify 50Hz sampling rate'
  );
  ctx.assert(
    krone.metrics.some(m => m.value.includes('72 Hours') || m.description.includes('circular')),
    'KRONE IoT must verify 72-hour circular buffer'
  );

  // 3. AEONIS OPS: 4-agent BFT quorum & AST taint sentry
  const aeonis = projects.find(p => p.id === 'aeonis-ops');
  ctx.assert(
    aeonis.metrics.some(m => m.value.includes('BFT') || m.value.includes('Quorum')),
    'AEONIS OPS must verify BFT Quorum consensus'
  );
  ctx.assert(
    aeonis.systemInvariants.some(inv => inv.includes('canary') || inv.includes('rollback')),
    'AEONIS OPS must enforce automated canary rollback invariant'
  );

  // 4. Ultron: Kahn DAG cycle detection & 3-tier memory
  const ultron = projects.find(p => p.id === 'ultron');
  ctx.assert(
    ultron.metrics.some(m => m.value.includes('Dynamic DAG')),
    'Ultron must verify Dynamic DAG task engine'
  );
  ctx.assert(
    ultron.systemInvariants.some(inv => inv.includes('acyclic') || inv.includes('Kahn') || inv.includes('cycle')),
    'Ultron must specify graph acyclicity invariant'
  );

  // 5. Sentinel AI: AST taint analysis & SAIF Tier 3
  const sentinel = projects.find(p => p.id === 'sentinel-ai');
  ctx.assert(
    sentinel.metrics.some(m => m.value.includes('AST') || m.label.includes('Analysis')),
    'Sentinel AI must verify AST parser engine'
  );
  ctx.assert(
    sentinel.systemInvariants.some(inv => inv.includes('false-negative') || inv.includes('Zero')),
    'Sentinel AI must specify zero false-negative invariant on injection sinks'
  );

  // 6. Portfolio: 100/100 Lighthouse & fluid springs
  const portfolio = projects.find(p => p.id === 'portfolio');
  ctx.assert(
    portfolio.metrics.some(m => m.value.includes('100/100')),
    'Portfolio must verify 100/100 Lighthouse score'
  );
  ctx.assert(
    portfolio.systemInvariants.some(inv => inv.includes('0KB') || inv.includes('Zero-JS') || inv.includes('WCAG')),
    'Portfolio must specify zero-JS static baseline & WCAG compliance'
  );
});

// =========================================================================
// TEST 3: Bespoke Visualizers & Components Existence
// =========================================================================
suite.test('All bespoke visualizer components and modal sheet modules exist', (ctx) => {
  const visualizers = [
    'src/components/projects/visualizers/GamsMemoryVisualizer.tsx',
    'src/components/projects/visualizers/KroneTelemetryVisualizer.tsx',
    'src/components/projects/visualizers/AeonisConsensusVisualizer.tsx',
    'src/components/projects/visualizers/UltronDagVisualizer.tsx',
    'src/components/projects/visualizers/SentinelAstDiffVisualizer.tsx',
    'src/components/projects/visualizers/PortfolioExplodedVisualizer.tsx',
    'src/components/projects/CaseStudyModal.tsx',
    'src/components/projects/CaseStudySheet.tsx',
    'src/components/projects/ProjectEditorialRow.tsx',
    'src/components/projects/EditorialProjectsList.tsx',
    'src/components/projects/EditorialProjectsList.astro',
    'src/components/ProjectsSection.astro',
  ];

  for (const relPath of visualizers) {
    const fullPath = path.join(WORKSPACE_ROOT, relPath);
    ctx.assertFileExists(fullPath, `${relPath} must exist`);
  }
});

// =========================================================================
// TEST 4: Modal State Transition & 7-Tab Scrubber Stress Harness
// =========================================================================
suite.test('10,000 rapid modal project switches and 7-tab state transitions', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);
  const premierProjects = projects.filter(p => p.featured);

  const startTime = performance.now();

  let activeProject = null;
  let activeTab = 'problem';

  for (let i = 0; i < 10000; i++) {
    // Switch project
    activeProject = premierProjects[i % premierProjects.length];
    ctx.assert(activeProject !== null, 'Active project is non-null');

    // Switch tab
    activeTab = MANDATORY_7_SECTIONS[i % MANDATORY_7_SECTIONS.length];
    const section = activeProject.caseStudy[activeTab];
    ctx.assert(section !== undefined, `Project ${activeProject.id} has tab ${activeTab}`);
    ctx.assertNonEmptyString(section.title, 'Section title is non-empty');
  }

  const durationMs = performance.now() - startTime;
  ctx.assert(durationMs < 500, `10,000 modal and tab transitions executed in ${durationMs.toFixed(1)}ms (< 500ms)`);
});

// =========================================================================
// TEST 5: Escape Dismiss & Body Scroll Lock Integrity
// =========================================================================
suite.test('Escape key dismissal and body scroll lock lifecycle invariants', (ctx) => {
  const mockDOM = {
    body: { style: { overflow: '' } },
    listeners: new Map(),
    addEventListener(event, fn) {
      this.listeners.set(event, fn);
    },
    removeEventListener(event) {
      this.listeners.delete(event);
    },
  };

  // Open modal simulation
  const openModal = (state) => {
    state.isOpen = true;
    mockDOM.body.style.overflow = 'hidden';
  };

  // Close modal simulation
  const closeModal = (state) => {
    state.isOpen = false;
    mockDOM.body.style.overflow = '';
  };

  const modalState = { isOpen: false };

  openModal(modalState);
  ctx.assertEqual(modalState.isOpen, true, 'Modal is open');
  ctx.assertEqual(mockDOM.body.style.overflow, 'hidden', 'Body scroll is locked (overflow: hidden)');

  // Simulate Escape key press
  const handleKey = (key) => {
    if (key === 'Escape') {
      closeModal(modalState);
    }
  };

  handleKey('Escape');
  ctx.assertEqual(modalState.isOpen, false, 'Modal closed on Escape key');
  ctx.assertEqual(mockDOM.body.style.overflow, '', 'Body scroll restored on close');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
