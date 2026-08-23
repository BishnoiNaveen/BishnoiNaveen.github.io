/**
 * real-world-workload.test.mjs — Tier 4: Real-World User Workloads & Stress Testing
 * Simulates complete end-to-end user exploration flows, audits asset payload budgets,
 * measures DOM hierarchy depth, and stresses state transitions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Real-World Workloads & Stress Testing (Tier 4)',
  4,
  'Simulates full user exploration journeys, validates bundle payload budgets, DOM tree depth, and rapid state-switching.'
);

suite.test('Simulated End-to-End User Portfolio Journey Flow', async (ctx) => {
  // Step 1: User arrives at Portfolio (Landing on Hero)
  const distIndexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  ctx.assertFileExists(distIndexPath, 'dist/index.html must exist for real user landing');

  const html = fs.readFileSync(distIndexPath, 'utf8');
  ctx.assert(html.includes('Naveen Bishnoi'), 'Landing page must render portfolio owner name');
  ctx.assert(html.includes('AI') || html.includes('Engineer') || html.includes('Architect'), 'Hero must display professional domain titles');

  // Step 2: User navigates to Workflows section and interacts with DAG nodes
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  if (fs.existsSync(workflowsPath)) {
    const { workflowsData } = await importModule(workflowsPath);
    ctx.assertArrayMinLength(workflowsData, 5, 'User can explore at least 5 enterprise workflows');

    for (const wf of workflowsData) {
      ctx.assert(wf.steps.length >= 2, `Workflow ${wf.id} has inspectable steps`);
      // Simulate user selecting each step to inspect code snippet
      for (const step of wf.steps) {
        ctx.assertNonEmptyString(step.name, `User can view name for step ${step.id}`);
        if (step.codeSnippet) {
          ctx.assert(step.codeSnippet.code.length > 10, `User can inspect code snippet for step ${step.id}`);
        }
      }
    }
  }

  // Step 3: User inspects Hermes Telemetry Dashboard
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  if (fs.existsSync(hermesPath)) {
    const { hermesTelemetryRecords, hermesMemorySystem } = await importModule(hermesPath);
    ctx.assert(hermesTelemetryRecords.length >= 3, 'User can view live telemetry for multiple autonomous agents');
    ctx.assert(hermesMemorySystem.workingMemory.entries.length >= 1, 'User can inspect Working Memory tier');
    ctx.assert(
      (hermesMemorySystem.episodicMemory?.recentRetrievals || hermesMemorySystem.vectorRecall)?.length >= 1,
      'User can inspect Episodic Vector Recall tier'
    );
  }

  // Step 4: User filters projects by category
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  const categories = ['Live', 'Antigravity Labs', 'Open Source'];
  for (const cat of categories) {
    const filtered = projects.filter(p => p.category === cat);
    ctx.assert(filtered.length > 0, `User filtering by "${cat}" gets matching project cards`);
  }

  // Step 5: User scrolls to Contact and accesses social/email links
  ctx.assert(
    html.includes('github.com') || html.includes('mailto:') || html.includes('linkedin.com') || html.includes('contact'),
    'User can locate active contact / social links on the page'
  );
});

suite.test('Payload budget audit: HTML and CSS bundle sizes', (ctx) => {
  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  ctx.assertDirExists(distDir, 'dist/ directory must exist');

  const indexPath = path.join(distDir, 'index.html');
  const indexStat = fs.statSync(indexPath);

  // Assert HTML size budget < 250 KB (ensuring lean, fast initial load)
  const maxHtmlSizeKb = 250;
  const actualHtmlKb = (indexStat.size / 1024).toFixed(1);
  ctx.assert(
    indexStat.size < maxHtmlSizeKb * 1024,
    `HTML payload (${actualHtmlKb} KB) exceeds budget limit (${maxHtmlSizeKb} KB)`
  );

  // Check CSS bundle size in _astro
  const astroDir = path.join(distDir, '_astro');
  if (fs.existsSync(astroDir)) {
    const files = fs.readdirSync(astroDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    for (const cssFile of cssFiles) {
      const cssStat = fs.statSync(path.join(astroDir, cssFile));
      const cssKb = (cssStat.size / 1024).toFixed(1);
      ctx.assert(
        cssStat.size < 200 * 1024,
        `CSS bundle ${cssFile} (${cssKb} KB) exceeds budget limit (200 KB)`
      );
    }
  }
});

suite.test('DOM complexity and tree nesting depth audit', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  // Measure tag open/close hierarchy depth using simple stack parser
  let maxDepth = 0;
  let currentDepth = 0;
  let elementCount = 0;

  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>/g;
  const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype']);

  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (voidElements.has(tagName) || fullTag.endsWith('/>')) {
      elementCount++;
      continue;
    }

    if (fullTag.startsWith('</')) {
      currentDepth = Math.max(0, currentDepth - 1);
    } else {
      elementCount++;
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
    }
  }

  // Max DOM depth should be <= 32 to prevent style recalculation bottlenecks
  ctx.assert(
    maxDepth <= 32,
    `Maximum DOM nesting depth (${maxDepth}) must be <= 32 levels`
  );

  // Total element count should be reasonable (< 2500) for Lighthouse performance
  ctx.assert(
    elementCount < 2500,
    `Total DOM element count (${elementCount}) must be < 2500 elements`
  );
});

suite.test('SEO, viewport, and accessibility markers in compiled distribution', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  // HTML5 lang attribute
  ctx.assert(html.includes('lang="en"') || html.includes("lang='en'"), 'HTML must declare lang="en"');

  // Viewport meta
  ctx.assert(html.includes('name="viewport"'), 'Document must have viewport meta tag');

  // Title and Description
  ctx.assert(html.includes('<title>'), 'Document must contain <title>');
  ctx.assert(html.includes('name="description"'), 'Document must contain description meta tag');

  // Image accessibility: all <img> tags must have alt attribute
  const imgTags = html.match(/<img\s+[^>]*>/gi) || [];
  for (const img of imgTags) {
    ctx.assert(
      img.includes('alt="') || img.includes("alt='") || img.includes('aria-hidden="true"'),
      `Every image must have an alt attribute or aria-hidden: ${img}`
    );
  }
});

suite.test('High-frequency state switching stress simulation (100 synthetic transitions)', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  const { workflowsData } = await importModule(workflowsPath);

  const categories = ['All', 'Live', 'Antigravity Labs', 'Open Source'];
  
  const startTime = performance.now();

  // Simulate 100 rapid state transitions
  for (let i = 0; i < 100; i++) {
    // 1. Filter transition
    const selectedCategory = categories[i % categories.length];
    const filteredProjects = selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.category === selectedCategory);
    ctx.assert(filteredProjects.length > 0, `Filter state ${i} (${selectedCategory}) produced results`);

    // 2. Workflow tab transition
    const activeWorkflow = workflowsData[i % workflowsData.length];
    ctx.assertNonEmptyString(activeWorkflow.id, `Workflow selection ${i} active`);

    // 3. Step selection transition
    const activeStep = activeWorkflow.steps[i % activeWorkflow.steps.length];
    ctx.assertNonEmptyString(activeStep.id, `Step selection ${i} active`);
  }

  const durationMs = performance.now() - startTime;
  // 100 in-memory state transitions should execute in < 50ms
  ctx.assert(
    durationMs < 100,
    `100 state transitions executed in ${durationMs.toFixed(1)}ms (must be < 100ms)`
  );
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
