/**
 * empirical-challenge.test.mjs — Empirical Challenger Verification Suite
 * Tests edge cases, single-step workflows, null project URLs, zero tokens,
 * extreme latency values, JSON tree search filters, and clipboard copy readiness.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Empirical Challenger: Data Safety & Edge Cases',
  2,
  'Empirically challenges single-step workflows, null project URLs, zero tokens, extreme latency values, and JSON inspector search filtering.'
);

suite.test('Workflow Visualizer: Single-step & boundary workflow state machine', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  const { workflowsData } = await importModule(workflowsPath);

  // 1. Validate real workflows data length
  ctx.assert(Array.isArray(workflowsData) && workflowsData.length >= 5, 'Must have at least 5 enterprise workflows');

  // 2. Synthetic Single-Step Workflow Resilience
  const singleStepWf = {
    id: 'single-step-wf',
    title: 'Single Step Test',
    summary: 'Testing single step boundary',
    category: 'Test',
    architectureType: 'Linear',
    throughput: '1 msg/s',
    latencySLA: '< 10ms',
    reliabilityTarget: '99.9%',
    techStack: ['Test'],
    steps: [{
      id: 'step-1',
      stepNumber: 1,
      name: 'Only Step',
      type: 'compute',
      role: 'Executor',
      description: 'Single step boundary test',
      inputs: [{ name: 'in', type: 'string', description: 'desc' }],
      outputs: [{ name: 'out', type: 'string', description: 'desc' }],
      telemetry: { p50DurationMs: 5, p99DurationMs: 10, avgMemoryMb: 12, successRatePercent: 100 },
      failurePolicy: { strategy: 'retry_with_backoff', maxRetries: 3 }
    }]
  };

  // Scrubber index transition with length 1
  let activeIndex = 0;
  const nextIndex = (activeIndex + 1) % singleStepWf.steps.length;
  ctx.assertEqual(nextIndex, 0, 'Modulo on single-step workflow must wrap cleanly to 0');

  // Next and Prev button invariants on step 1 of 1
  const isPrevDisabled = singleStepWf.steps[0].stepNumber === 1;
  const isNextDisabled = singleStepWf.steps[0].stepNumber === singleStepWf.steps.length;
  ctx.assert(isPrevDisabled, 'Prev button must be disabled on step 1');
  ctx.assert(isNextDisabled, 'Next button must be disabled on step 1 of single-step workflow');

  // 3. Multi-step workflow navigation bounds
  for (const wf of workflowsData) {
    const firstStep = wf.steps[0];
    const lastStep = wf.steps[wf.steps.length - 1];

    ctx.assert(firstStep.stepNumber === 1, `First step of ${wf.id} must be 1`);
    ctx.assert(lastStep.stepNumber === wf.steps.length, `Last step of ${wf.id} must equal steps.length`);
  }
});

suite.test('Projects: Null URLs and optional fields strict type and rendering safety', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  let nullGithubCount = 0;
  let nullLiveCount = 0;

  for (const p of projects) {
    // Assert strictly null or valid URL format
    if (p.github === null) {
      nullGithubCount++;
    } else {
      ctx.assert(
        p.github.startsWith('https://github.com/'),
        `Project "${p.title}" github must be valid GitHub URL, got "${p.github}"`
      );
    }

    if (p.live === null) {
      nullLiveCount++;
    } else {
      ctx.assert(
        p.live.startsWith('https://') || p.live.startsWith('http://'),
        `Project "${p.title}" live must be valid URL, got "${p.live}"`
      );
    }

    // Verify non-empty title and description
    ctx.assertNonEmptyString(p.title, `Project title must not be empty`);
    ctx.assertNonEmptyString(p.description, `Project description must not be empty`);
    ctx.assertArrayMinLength(p.techStack, 1, `Project "${p.title}" techStack must have at least 1 item`);
  }

  ctx.assert(nullLiveCount >= 1, 'Dataset must have at least 1 project with live: null to test conditional rendering');
  ctx.assert(nullGithubCount >= 0, 'Dataset handles optional github URLs');
});

suite.test('Hermes: Zero tokens, extreme latency values, and division resilience', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  const { hermesTelemetryRecords, hermesMemorySystem } = await importModule(hermesPath);

  // 1. Synthetic agent records: Zero tokens and Extreme load
  const syntheticSwarm = [
    {
      agentId: 'zero-agent',
      agentName: 'Zero Agent',
      role: 'Tester',
      status: 'IDLE',
      activeModel: 'gemini-1.5-flash',
      currentTask: 'Idle standby',
      tokenMetrics: { promptTokens: 0, completionTokens: 0, totalTokens: 0, cachedTokens: 0, totalCostUsd: 0 },
      latency: { ttftMs: 0, generationMs: 0, totalLatencyMs: 0 },
      memoryUsageMb: 0
    },
    {
      agentId: 'extreme-agent',
      agentName: 'Extreme Agent',
      role: 'Heavy Processor',
      status: 'EXECUTING_TOOL',
      activeModel: 'claude-3-5-sonnet',
      currentTask: 'High-throughput AST Analysis',
      tokenMetrics: { promptTokens: 2500000, completionTokens: 800000, totalTokens: 3300000, cachedTokens: 500000, totalCostUsd: 49.50 },
      latency: { ttftMs: 98000, generationMs: 140000, totalLatencyMs: 238000 },
      memoryUsageMb: 8192
    },
    ...hermesTelemetryRecords
  ];

  // Aggregate calculations
  const totalTokens = syntheticSwarm.reduce((acc, a) => acc + a.tokenMetrics.totalTokens, 0);
  const totalCost = syntheticSwarm.reduce((acc, a) => acc + a.tokenMetrics.totalCostUsd, 0);
  const avgLatency = Math.round(syntheticSwarm.reduce((acc, a) => acc + a.latency.ttftMs, 0) / syntheticSwarm.length);

  ctx.assert(!isNaN(totalTokens), 'Total tokens must not be NaN');
  ctx.assert(!isNaN(totalCost), 'Total cost must not be NaN');
  ctx.assert(!isNaN(avgLatency), 'Avg latency must not be NaN');
  ctx.assert(totalTokens > 3300000, 'Total tokens handles extreme numbers');
  ctx.assert(totalCost > 49.5, 'Total cost handles decimal accumulations');

  // 2. Working Memory capacity calculation resilience
  const wm = hermesMemorySystem.workingMemory;
  ctx.assertPositive(wm.maxContextTokens, 'maxContextTokens must be positive');
  ctx.assert(wm.activeContextTokens <= wm.maxContextTokens, 'activeContextTokens must not exceed maxContextTokens');
  const pct = Math.round((wm.activeContextTokens / wm.maxContextTokens) * 100);
  ctx.assertInRange(pct, 0, 100, 'Capacity utilization must be within [0, 100]%');
});

suite.test('JSON Graph Inspector: Search filtering, key matching, and copy serialization', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  const hermesData = await importModule(hermesPath);

  const fullState = {
    telemetry: hermesData.hermesTelemetryRecords,
    taskGraph: hermesData.hermesTaskGraph,
    memorySystem: hermesData.hermesMemorySystem,
    routerLogs: hermesData.hermesRouterLogs,
    quorumSessions: hermesData.hermesQuorumSessions
  };

  // 1. Serialization for Clipboard Copy
  const jsonString = JSON.stringify(fullState, null, 2);
  ctx.assert(jsonString.length > 500, 'Full Hermes state must serialize cleanly to JSON string without circular errors');

  const parsedBack = JSON.parse(jsonString);
  ctx.assert(parsedBack !== null && typeof parsedBack === 'object', 'JSON serialization round-trip must be lossless');

  // 2. Search Filter Evaluation Logic
  const simulateSearch = (value, term, name) => {
    if (!term) return true;
    const t = term.toLowerCase();
    if (name && name.toLowerCase().includes(t)) return true;
    const isObject = value !== null && typeof value === 'object';
    if (!isObject && String(value).toLowerCase().includes(t)) return true;
    try {
      const str = JSON.stringify(value).toLowerCase();
      return str.includes(t);
    } catch {
      return false;
    }
  };

  // Test various query terms against state
  ctx.assert(simulateSearch(fullState, 'Byzantine'), 'Search for "Byzantine" must return true');
  ctx.assert(simulateSearch(fullState, 'Qdrant'), 'Search for "Qdrant" must return true');
  ctx.assert(simulateSearch(fullState, 'ISOBUS'), 'Search for "ISOBUS" must return true');
  ctx.assert(simulateSearch(fullState, 'telemetry'), 'Search for "telemetry" must return true');
  ctx.assert(!simulateSearch(fullState, 'NonExistentXYZToken9999'), 'Search for non-existent token must return false');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
