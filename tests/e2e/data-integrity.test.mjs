/**
 * data-integrity.test.mjs — Tier 1: Local Data Architecture & Schema Validation
 * Validates data records in src/data/workflows.ts, src/data/hermes.ts, and src/data/projects.ts
 * against type schemas, field completeness, positive telemetry metrics, and cosine similarity bounds.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Workflows, Hermes & Projects Data Integrity (Tier 1)',
  1,
  'Validates local TypeScript data collections against schemas, mathematical ranges, and enterprise domains.'
);

// --- 1. Projects Data Validation ---
suite.test('src/data/projects.ts schema compliance and records completeness', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  ctx.assertFileExists(projectsPath, 'src/data/projects.ts must exist');

  const projectsModule = await importModule(projectsPath);
  const projects = projectsModule.projects;
  ctx.assertArrayMinLength(projects, 6, 'projects collection must contain at least 6 projects');

  const validCategories = new Set(['Live', 'Antigravity Labs', 'Open Source']);
  const validStatuses = new Set(['live', 'planning', 'beta']);

  for (const proj of projects) {
    ctx.assertNonEmptyString(proj.title, `Project title must be non-empty string`);
    ctx.assertNonEmptyString(proj.subtitle, `Project "${proj.title}" must have subtitle`);
    ctx.assertNonEmptyString(proj.description, `Project "${proj.title}" must have description`);
    ctx.assertArrayMinLength(proj.techStack, 1, `Project "${proj.title}" must list at least 1 techStack item`);
    ctx.assert(validStatuses.has(proj.status), `Project "${proj.title}" status "${proj.status}" must be one of [live, planning, beta]`);
    ctx.assert(validCategories.has(proj.category), `Project "${proj.title}" category "${proj.category}" must be valid`);
    ctx.assertArrayMinLength(proj.highlights, 1, `Project "${proj.title}" must include highlights`);

    if (proj.github !== null) {
      ctx.assertMatches(proj.github, /^https?:\/\//, `Project "${proj.title}" github link must be valid URL`);
    }
    if (proj.live !== null) {
      ctx.assertMatches(proj.live, /^https?:\/\//, `Project "${proj.title}" live link must be valid URL`);
    }
  }
});

// --- 2. Workflows Data Validation ---
suite.test('src/data/workflows.ts schema, enterprise domains, and steps DAG', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  ctx.assertFileExists(workflowsPath, 'src/data/workflows.ts must exist per M2 contract');

  const workflowsModule = await importModule(workflowsPath);
  const workflows = workflowsModule.workflowsData || workflowsModule.workflows || workflowsModule.default;
  ctx.assertArrayMinLength(workflows, 5, 'workflowsData must contain at least 5 enterprise workflows');

  const requiredDomainKeywords = ['KRONE', 'AEONIS', 'Ultron', 'Medallion', 'GAMS'];
  const titles = workflows.map(w => `${w.id} ${w.title} ${w.slug}`).join(' ');

  for (const keyword of requiredDomainKeywords) {
    ctx.assert(
      titles.toLowerCase().includes(keyword.toLowerCase()),
      `Workflows collection must include enterprise workflow for "${keyword}"`
    );
  }

  for (const wf of workflows) {
    ctx.assertNonEmptyString(wf.id, 'Workflow id must be non-empty');
    ctx.assertNonEmptyString(wf.title, `Workflow "${wf.id}" must have a title`);
    ctx.assertNonEmptyString(wf.summary || wf.description, `Workflow "${wf.id}" must have a summary or description`);
    ctx.assertArrayMinLength(wf.steps, 2, `Workflow "${wf.id}" must contain at least 2 DAG steps`);
    ctx.assertNonEmptyString(wf.throughput, `Workflow "${wf.id}" must specify throughput`);
    ctx.assertNonEmptyString(wf.latencySLA, `Workflow "${wf.id}" must specify latencySLA`);

    for (const step of wf.steps) {
      ctx.assertNonEmptyString(step.id, `Step in workflow "${wf.id}" must have id`);
      ctx.assertNonEmptyString(step.name, `Step "${step.id}" must have name`);
      ctx.assertNonEmptyString(step.type, `Step "${step.id}" must have type`);
      ctx.assertNonEmptyString(step.description, `Step "${step.id}" must have description`);
      ctx.assert(Array.isArray(step.inputs), `Step "${step.id}" inputs must be an array`);
      ctx.assert(Array.isArray(step.outputs), `Step "${step.id}" outputs must be an array`);

      // Step telemetry assertions
      if (step.telemetry) {
        ctx.assertPositive(step.telemetry.p50DurationMs, `Step "${step.id}" p50DurationMs must be positive`);
        ctx.assertPositive(step.telemetry.p99DurationMs, `Step "${step.id}" p99DurationMs must be positive`);
        ctx.assertInRange(step.telemetry.successRatePercent, 90.0, 100.0, `Step "${step.id}" successRatePercent must be in [90, 100]`);
      }
    }
  }
});

// --- 3. Hermes Telemetry & Agent Data Validation ---
suite.test('src/data/hermes.ts telemetry records and task DAG structure', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  ctx.assertFileExists(hermesPath, 'src/data/hermes.ts must exist per M2 contract');

  const hermesModule = await importModule(hermesPath);

  // 1. Agent Telemetry Records
  const telemetry = hermesModule.hermesTelemetryRecords || hermesModule.telemetryRecords;
  ctx.assertArrayMinLength(telemetry, 3, 'hermesTelemetryRecords must contain at least 3 agent telemetry streams');

  for (const record of telemetry) {
    ctx.assertNonEmptyString(record.agentName, 'Agent record must have agentName');
    ctx.assertPositive(record.latency.totalLatencyMs, `Agent "${record.agentName}" latency.totalLatencyMs must be positive`);
    ctx.assertPositive(record.tokenMetrics.tokensPerSec, `Agent "${record.agentName}" tokensPerSec must be positive`);
    ctx.assertPositive(record.tokenMetrics.totalCostUsd, `Agent "${record.agentName}" totalCostUsd must be positive`);
    ctx.assertNonEmptyString(record.status, `Agent "${record.agentName}" status must be non-empty`);
  }

  // 2. Task DAG Graph
  const taskGraph = hermesModule.hermesTaskGraph || hermesModule.taskGraph;
  ctx.assert(taskGraph && typeof taskGraph === 'object', 'hermesTaskGraph must be defined');
  ctx.assertArrayMinLength(taskGraph.nodes, 3, 'hermesTaskGraph must have at least 3 nodes');
  ctx.assertArrayMinLength(taskGraph.edges, 2, 'hermesTaskGraph must have at least 2 edges');

  for (const node of taskGraph.nodes) {
    ctx.assertNonEmptyString(node.id, 'Task graph node must have id');
    ctx.assertNonEmptyString(node.label, 'Task graph node must have label');
  }

  for (const edge of taskGraph.edges) {
    ctx.assertNonEmptyString(edge.source, 'Task graph edge must have source');
    ctx.assertNonEmptyString(edge.target, 'Task graph edge must have target');
  }
});

suite.test('src/data/hermes.ts 3-tier memory system and vector cosine similarity bounds', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  if (!fs.existsSync(hermesPath)) {
    throw new Error(`Missing ${hermesPath}`);
  }

  const hermesModule = await importModule(hermesPath);
  const memorySystem = hermesModule.hermesMemorySystem || hermesModule.memorySystem;
  ctx.assert(memorySystem && typeof memorySystem === 'object', 'hermesMemorySystem must be defined');

  // Tier 1: Working Memory
  ctx.assert(Array.isArray(memorySystem.workingMemory?.entries), 'memorySystem.workingMemory.entries must be an array');
  ctx.assert(memorySystem.workingMemory.entries.length >= 1, 'workingMemory must contain active context items');

  // Tier 2: Episodic Memory / Vector Recall
  const vectorRecall = memorySystem.episodicMemory?.recentRetrievals || memorySystem.vectorRecall;
  ctx.assert(Array.isArray(vectorRecall), 'episodicMemory.recentRetrievals must be an array');
  ctx.assert(vectorRecall.length >= 1, 'vectorRecall must contain retrieved memory vectors');

  for (const item of vectorRecall) {
    ctx.assertNonEmptyString(item.documentSnippet || item.content || item.key, 'Vector recall item must have snippet/content');
    const score = item.similarityScore ?? item.cosineSimilarity;
    ctx.assertInRange(
      score,
      0.0,
      1.0,
      `Vector cosine similarity (${score}) must be in mathematical range [0.0, 1.0]`
    );
  }

  // Tier 3: Knowledge Graph
  const kg = memorySystem.semanticKnowledgeGraph || memorySystem.knowledgeGraph;
  ctx.assert(kg && typeof kg === 'object', 'knowledgeGraph must be defined');
  ctx.assertArrayMinLength(kg.entities, 2, 'knowledgeGraph must contain entities');
  ctx.assertArrayMinLength(kg.relations, 1, 'knowledgeGraph must contain relations');
});

suite.test('src/data/hermes.ts dynamic router logs and quorum consensus sessions', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  if (!fs.existsSync(hermesPath)) {
    throw new Error(`Missing ${hermesPath}`);
  }

  const hermesModule = await importModule(hermesPath);

  // Router Decisions
  const routerLogs = hermesModule.hermesRouterLogs || hermesModule.routerLogs;
  ctx.assertArrayMinLength(routerLogs, 2, 'hermesRouterLogs must contain router decisions');

  for (const log of routerLogs) {
    ctx.assertNonEmptyString(log.routingDecision.selectedModel, 'Router log must specify selected LLM model');
    ctx.assertNonEmptyString(log.promptClassification.domain, 'Router log must specify task domain');
    ctx.assertPositive(log.executionResult.actualDurationMs, 'Router log actualDurationMs must be positive');
  }

  // Quorum Sessions
  const quorumSessions = hermesModule.hermesQuorumSessions || hermesModule.quorumSessions;
  ctx.assertArrayMinLength(quorumSessions, 1, 'hermesQuorumSessions must contain quorum sessions');

  for (const session of quorumSessions) {
    ctx.assertArrayMinLength(session.votes, 2, 'Quorum session must have at least 2 votes');
    for (const vote of session.votes) {
      ctx.assertInRange(vote.confidence, 0.0, 1.0, 'Vote confidence must be in range [0.0, 1.0]');
      ctx.assertNonEmptyString(vote.agentName, 'Vote must have agentName');
    }
    ctx.assertNonEmptyString(session.finalDecision, 'Quorum session must have non-empty finalDecision');
  }
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
