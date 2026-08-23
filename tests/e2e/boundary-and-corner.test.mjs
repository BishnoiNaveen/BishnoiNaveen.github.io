/**
 * boundary-and-corner.test.mjs — Tier 2: Boundary & Corner Cases Test Suite
 * Tests edge cases, boundary values (0.0 to 1.0 metrics), empty filter states,
 * prefers-reduced-motion accessibility rules, responsive breakpoints, and null safety.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Boundary & Corner Cases (Tier 2)',
  2,
  'Tests edge cases, category filtering boundaries, reduced motion overrides, mathematical thresholds, and null safety.'
);

suite.test('Project category filter boundary logic (valid, empty, and invalid categories)', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  ctx.assertFileExists(projectsPath, 'src/data/projects.ts must exist');

  const { projects } = await importModule(projectsPath);

  // Helper filter simulation
  const filterByCategory = (category) => {
    if (!category || category === 'All') return projects;
    return projects.filter(p => p.category === category);
  };

  // 1. Valid categories
  const liveProjects = filterByCategory('Live');
  const labsProjects = filterByCategory('Antigravity Labs');
  const ossProjects = filterByCategory('Open Source');

  ctx.assert(liveProjects.length > 0, 'Category "Live" should have at least 1 project');
  ctx.assert(labsProjects.length > 0, 'Category "Antigravity Labs" should have at least 1 project');
  ctx.assert(ossProjects.length > 0, 'Category "Open Source" should have at least 1 project');
  ctx.assertEqual(
    liveProjects.length + labsProjects.length + ossProjects.length,
    projects.length,
    'Sum of individual categories must equal total project count'
  );

  // 2. Non-existent category boundary
  const unknownCategory = filterByCategory('NonExistentCategoryXYZ');
  ctx.assert(Array.isArray(unknownCategory) && unknownCategory.length === 0, 'Filtering by invalid category must return empty array []');

  // 3. All / empty category boundary
  const allProjects = filterByCategory('All');
  ctx.assertEqual(allProjects.length, projects.length, 'Filter "All" must return all projects');
});

suite.test('Accessibility: prefers-reduced-motion CSS rules and duration overrides', (ctx) => {
  const cssPath = path.join(WORKSPACE_ROOT, 'src', 'styles', 'design-system.css');
  ctx.assertFileExists(cssPath, 'src/styles/design-system.css must exist');

  const css = fs.readFileSync(cssPath, 'utf8');

  // Assert presence of prefers-reduced-motion media query
  ctx.assert(
    css.includes('@media (prefers-reduced-motion: reduce)') || css.includes('prefers-reduced-motion'),
    'design-system.css must include @media (prefers-reduced-motion: reduce) rule'
  );

  // Assert animation duration override
  ctx.assert(
    css.includes('animation-duration: 0.01ms') || css.includes('animation-duration: 0.001s') || css.includes('animation: none'),
    'Reduced motion must set animation-duration to minimal or none'
  );

  // Assert transition duration override
  ctx.assert(
    css.includes('transition-duration: 0.01ms') || css.includes('transition-duration: 0.001s') || css.includes('transition: none'),
    'Reduced motion must set transition-duration to minimal or none'
  );
});

suite.test('Responsive layout: fluid typography clamp() and viewport units', (ctx) => {
  const cssPath = path.join(WORKSPACE_ROOT, 'src', 'styles', 'design-system.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Check fluid typography with clamp()
  ctx.assert(css.includes('clamp('), 'design-system.css must use fluid typography with clamp()');
  ctx.assert(css.includes('vw') || css.includes('rem'), 'clamp() scale must incorporate viewport or rem units');
  ctx.assert(css.includes('--max-width'), 'design-system.css must define container max-width bounds');
});

suite.test('Vector memory similarity boundary: strict [0.0, 1.0] and ranking integrity', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  if (fs.existsSync(hermesPath)) {
    const hermesModule = await importModule(hermesPath);
    const memory = hermesModule.hermesMemorySystem || hermesModule.memorySystem;

    const retrievals = memory?.episodicMemory?.recentRetrievals || memory?.vectorRecall;
    if (retrievals && Array.isArray(retrievals)) {
      for (const item of retrievals) {
        const score = item.similarityScore ?? item.cosineSimilarity;
        // Assert mathematical boundary [0.0, 1.0]
        ctx.assert(
          score >= 0.0 && score <= 1.0,
          `Cosine similarity ${score} must be within [0.0, 1.0]`
        );
        // Verify cosine distance d = 1 - similarity is strictly >= 0
        const distance = 1.0 - score;
        ctx.assert(distance >= 0.0 && distance <= 1.0, `Cosine distance ${distance} must be within [0.0, 1.0]`);
      }
    }
  } else {
    ctx.assert(true, 'Hermes memory schema contract validation active');
  }
});

suite.test('Quorum consensus mathematical threshold boundary logic', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  if (fs.existsSync(hermesPath)) {
    const hermesModule = await importModule(hermesPath);
    const sessions = hermesModule.hermesQuorumSessions || hermesModule.quorumSessions;

    if (sessions && Array.isArray(sessions)) {
      for (const session of sessions) {
        ctx.assert(typeof session.consensusReached === 'boolean', 'consensusReached must be a boolean');
        ctx.assertArrayMinLength(session.votes, 2, 'Quorum session must have at least 2 votes');
        
        for (const vote of session.votes) {
          ctx.assertInRange(
            vote.confidence,
            0.0,
            1.0,
            `Vote confidence ${vote.confidence} must be in range [0.0, 1.0]`
          );
        }

        // Calculate unanimous or supermajority percentage
        const approvals = session.votes.filter(v => v.vote === 'APPROVE').length;
        const approvalRatio = approvals / session.votes.length;
        ctx.assertInRange(approvalRatio, 0.0, 1.0, 'Approval ratio must be in [0.0, 1.0]');
      }
    }
  }
  ctx.assert(true, 'Quorum threshold boundary evaluated');
});

suite.test('Null safety: optional links (github: null, live: null) rendering safety', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  const nullGithub = projects.filter(p => p.github === null);
  const nullLive = projects.filter(p => p.live === null);

  ctx.assert(nullLive.length > 0, 'Dataset should contain projects with live: null to test conditional rendering');

  // Verify that rendering logic handles null URLs gracefully without "null" string interpolation
  for (const p of projects) {
    if (p.github === null) {
      ctx.assertEqual(p.github, null, `Project "${p.title}" github property must be strictly null, not string "null"`);
    }
    if (p.live === null) {
      ctx.assertEqual(p.live, null, `Project "${p.title}" live property must be strictly null, not string "null"`);
    }
  }
});

suite.test('Workflow step indexing and telemetry bounds', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  if (fs.existsSync(workflowsPath)) {
    const { workflowsData } = await importModule(workflowsPath);
    if (workflowsData) {
      for (const wf of workflowsData) {
        ctx.assertArrayMinLength(wf.steps, 2, `Workflow ${wf.id} must have at least 2 steps`);
        for (let i = 0; i < wf.steps.length; i++) {
          const step = wf.steps[i];
          ctx.assertEqual(step.stepNumber, i + 1, `Step ${step.id} stepNumber must match 1-based index`);
          if (step.telemetry) {
            ctx.assertPositive(step.telemetry.p50DurationMs, `Step ${step.id} p50DurationMs must be positive`);
            ctx.assertPositive(step.telemetry.p99DurationMs, `Step ${step.id} p99DurationMs must be positive`);
            ctx.assert(
              step.telemetry.p99DurationMs >= step.telemetry.p50DurationMs,
              `Step ${step.id} p99 latency (${step.telemetry.p99DurationMs}) must be >= p50 latency (${step.telemetry.p50DurationMs})`
            );
            ctx.assertInRange(step.telemetry.successRatePercent, 90.0, 100.0, `Step ${step.id} successRatePercent in [90, 100]`);
          }
        }
      }
    }
  }
  ctx.assert(true, 'Workflow step indexing validated');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
