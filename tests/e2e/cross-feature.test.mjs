/**
 * cross-feature.test.mjs — Tier 3: Cross-Feature Integration & Pairwise Testing
 * Tests interactions between navigation targets and DOM anchors, workflow steps and code inspectors,
 * Hermes agent IDs and knowledge graph relations, project IDs and modal expansion keys,
 * and spring presets integration.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Cross-Feature Integration & Pairwise Contracts (Tier 3)',
  3,
  'Validates cross-module contracts: nav scroll spy anchors, workflow step inspectors, Hermes agent-knowledge graph links, and project modal keys.'
);

suite.test('Navigation dock scroll spy targets match section IDs in page templates', (ctx) => {
  const indexPagePath = path.join(WORKSPACE_ROOT, 'src', 'pages', 'index.astro');
  const distIndexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const componentsDir = path.join(WORKSPACE_ROOT, 'src', 'components');

  ctx.assertFileExists(indexPagePath, 'src/pages/index.astro must exist');

  const pageContent = fs.readFileSync(indexPagePath, 'utf8');
  const htmlContent = fs.existsSync(distIndexPath) ? fs.readFileSync(distIndexPath, 'utf8') : '';

  // Standard navigation anchor targets
  const expectedTargets = ['hero', 'about', 'workflows', 'hermes', 'projects', 'skills', 'contact'];

  for (const targetId of expectedTargets) {
    // Check if section is included in index.astro, dist/index.html, or has matching component
    const hasAnchorInHtml = htmlContent.includes(`id="${targetId}"`) || htmlContent.includes(`id='${targetId}'`);
    const hasCompInPage = pageContent.toLowerCase().includes(targetId) ||
                          fs.existsSync(path.join(componentsDir, `${targetId.charAt(0).toUpperCase() + targetId.slice(1)}Section.astro`));

    ctx.assert(
      hasAnchorInHtml || hasCompInPage,
      `Nav target "#${targetId}" must correspond to an active section in template or DOM`
    );
  }
});

suite.test('Workflow DAG step inspectors: code snippets and failure policy cross-linking', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  ctx.assertFileExists(workflowsPath, 'src/data/workflows.ts must exist');

  const { workflowsData } = await importModule(workflowsPath);
  ctx.assert(Array.isArray(workflowsData) && workflowsData.length >= 5, 'Must load at least 5 workflows');

  const validLanguages = new Set(['python', 'typescript', 'rust', 'sql', 'c', 'yaml', 'json']);
  const validStrategies = new Set(['retry_with_backoff', 'circuit_break', 'fallback_subroutine', 'human_escalation']);

  for (const wf of workflowsData) {
    for (const step of wf.steps) {
      // Cross-link code snippet with valid syntax highlighting metadata
      if (step.codeSnippet) {
        ctx.assert(
          validLanguages.has(step.codeSnippet.language),
          `Step ${step.id} codeSnippet language "${step.codeSnippet.language}" must be in [python, typescript, rust, sql, c, yaml, json]`
        );
        ctx.assertNonEmptyString(step.codeSnippet.filename, `Step ${step.id} codeSnippet must have filename`);
        ctx.assertNonEmptyString(step.codeSnippet.code, `Step ${step.id} codeSnippet code must not be empty`);
      }

      // Cross-link failure policy strategy
      if (step.failurePolicy) {
        ctx.assert(
          validStrategies.has(step.failurePolicy.strategy),
          `Step ${step.id} failure strategy "${step.failurePolicy.strategy}" must be valid`
        );
        if (step.failurePolicy.strategy === 'fallback_subroutine' && step.failurePolicy.fallbackStepId) {
          // Fallback step should be a valid step id within the same workflow
          const stepIds = new Set(wf.steps.map(s => s.id));
          ctx.assert(
            stepIds.has(step.failurePolicy.fallbackStepId),
            `Step ${step.id} fallbackStepId "${step.failurePolicy.fallbackStepId}" must exist in workflow ${wf.id}`
          );
        }
      }
    }
  }
});

suite.test('Hermes memory knowledge graph referential integrity and agent cross-linking', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  ctx.assertFileExists(hermesPath, 'src/data/hermes.ts must exist');

  const { hermesMemorySystem, hermesTelemetryRecords, hermesTaskGraph } = await importModule(hermesPath);

  // 1. Knowledge Graph Referential Integrity: all relations must connect valid entity IDs
  const kg = hermesMemorySystem.semanticKnowledgeGraph;
  const entityIds = new Set(kg.entities.map(e => e.id));

  for (const relation of kg.relations) {
    ctx.assert(
      entityIds.has(relation.from),
      `Knowledge graph relation "from" (${relation.from}) must exist in entities`
    );
    ctx.assert(
      entityIds.has(relation.to),
      `Knowledge graph relation "to" (${relation.to}) must exist in entities`
    );
    ctx.assertInRange(relation.weight, 0.0, 1.0, `Relation weight must be in [0.0, 1.0]`);
  }

  // 2. Cross-check telemetry agents and task graph nodes
  const agentIds = new Set(hermesTelemetryRecords.map(a => a.agentId));
  for (const node of hermesTaskGraph.nodes) {
    if (node.agentId) {
      ctx.assert(
        agentIds.has(node.agentId) || node.agentId.startsWith('hermes') || node.agentId.startsWith('agent'),
        `Task node ${node.id} references agent ${node.agentId}`
      );
    }
  }
});

suite.test('Projects collection uniqueness and modal layout expansion keys', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  const seenTitles = new Set();
  for (const proj of projects) {
    // Assert unique project titles (used for React key and shared layoutId)
    ctx.assert(!seenTitles.has(proj.title), `Project title "${proj.title}" must be unique across the portfolio`);
    seenTitles.add(proj.title);

    // Assert all data required for modal expansion is present
    ctx.assert(Array.isArray(proj.highlights) && proj.highlights.length >= 1, `Project "${proj.title}" must provide highlights for modal`);
    ctx.assertNonEmptyString(proj.description, `Project "${proj.title}" must provide full description for modal view`);
    ctx.assert(Array.isArray(proj.techStack) && proj.techStack.length >= 1, `Project "${proj.title}" must provide techStack for chips`);
  }
});

suite.test('Spring physics presets integration in custom hooks and UI components', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const { springPresets } = await importModule(springsPath);

  // Assert all 7 preset keys are defined
  const expectedKeys = ['snappy', 'glide', 'buoyant', 'morph', 'cinematic', 'sheet', 'magnetic'];
  for (const key of expectedKeys) {
    ctx.assert(springPresets[key] !== undefined, `springPresets must contain "${key}"`);
  }

  // Check useMagnetic hook exists and imports or references magnetic spring
  const hooksDir = path.join(WORKSPACE_ROOT, 'src', 'hooks');
  if (fs.existsSync(hooksDir)) {
    const magneticHookPath = path.join(hooksDir, 'useMagnetic.ts');
    if (fs.existsSync(magneticHookPath)) {
      const hookContent = fs.readFileSync(magneticHookPath, 'utf8');
      ctx.assert(
        hookContent.includes('spring') || hookContent.includes('magnetic') || hookContent.includes('useSpring') || hookContent.includes('useMotionValue'),
        'useMagnetic hook must utilize spring physics or motion values'
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
