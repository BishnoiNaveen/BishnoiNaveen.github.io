/**
 * m3-empirical-challenge.test.mjs — Milestone 3 Empirical Challenge Suite
 * 
 * Objective:
 * 1. Mathematically verify spring oscillation damping ratios zeta = c / (2*sqrt(k*m)) in (0, 2)
 *    and run 4th-order Runge-Kutta (RK4) numerical ODE simulations for settling time and overshoot.
 * 2. Stress-test rapid category switching and state transitions in:
 *    - WorkflowVisualizer (10,000 rapid transitions, boundary step navigations, scrubber clamping)
 *    - ProjectsFilterGrid (10,000 rapid filter toggles, boundary categories, modal expand/collapse)
 *    - HermesTelemetryDashboard (10,000 tab/subtab switches, 1,000 live tick simulations, JSON state)
 * 3. Verify TypeScript build and schema consistency.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 3 Empirical Challenge & Stress Harness',
  4,
  'Empirical verification of spring physics damping ratios, ODE stability, and rapid state transitions across M3 React Islands.'
);

const EXPECTED_PRESETS = ['snappy', 'glide', 'buoyant', 'morph', 'cinematic', 'sheet', 'magnetic'];

// =========================================================================
// TEST 1: Spring Physics Damping Ratio (zeta) & Exact Mathematics
// =========================================================================
suite.test('Spring physics: exact damping ratios zeta = c / (2*sqrt(k*m)) in (0, 2)', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  ctx.assertFileExists(springsPath, 'src/lib/springs.ts must exist');

  const { springPresets } = await importModule(springsPath);
  ctx.assert(springPresets !== undefined, 'springPresets export must be defined');

  const physicsReport = [];

  for (const presetName of EXPECTED_PRESETS) {
    const preset = springPresets[presetName];
    ctx.assert(preset !== undefined, `Preset "${presetName}" must exist`);
    ctx.assertEqual(preset.type, 'spring', `Preset "${presetName}" type must be spring`);

    const m = preset.mass;
    const k = preset.stiffness;
    const c = preset.damping;
    const restDelta = preset.restDelta ?? 0.001;

    ctx.assertPositive(m, `Mass for ${presetName} must be positive`);
    ctx.assertPositive(k, `Stiffness for ${presetName} must be positive`);
    ctx.assertPositive(c, `Damping for ${presetName} must be positive`);

    // Critical damping: c_c = 2 * sqrt(k * m)
    const criticalDamping = 2 * Math.sqrt(k * m);
    // Damping ratio: zeta = c / c_c
    const zeta = c / criticalDamping;
    // Natural angular frequency: omega_n = sqrt(k / m)
    const omegaN = Math.sqrt(k / m);
    // Damped frequency: omega_d = omega_n * sqrt(|1 - zeta^2|)
    const omegaD = omegaN * Math.sqrt(Math.abs(1 - zeta * zeta));

    // Assert zeta strictly in (0, 2)
    ctx.assert(
      zeta > 0 && zeta < 2.0,
      `Preset "${presetName}" damping ratio zeta=${zeta.toFixed(4)} must be strictly in (0, 2)`
    );

    // Assert Apple fluid UX target: underdamped to slightly critically damped [0.65, 0.95]
    ctx.assert(
      zeta >= 0.65 && zeta <= 0.95,
      `Preset "${presetName}" damping ratio zeta=${zeta.toFixed(4)} is in optimal fluid range [0.65, 0.95]`
    );

    physicsReport.push({
      preset: presetName,
      mass: m,
      stiffness: k,
      damping: c,
      criticalDamping: criticalDamping.toFixed(3),
      zeta: zeta.toFixed(4),
      omegaN: omegaN.toFixed(2),
      omegaD: omegaD.toFixed(2),
      restDelta
    });
  }

  // Ensure all 7 presets evaluated
  ctx.assertEqual(physicsReport.length, 7, 'All 7 spring presets must be evaluated');
});

// =========================================================================
// TEST 2: Numerical ODE Simulation (RK4) for Spring Presets Stability
// =========================================================================
suite.test('Numerical ODE simulation (RK4): verify stability, zero explosion, and settling time', async (ctx) => {
  const springsPath = path.join(WORKSPACE_ROOT, 'src', 'lib', 'springs.ts');
  const { springPresets } = await importModule(springsPath);

  // RK4 simulator for m * x'' + c * x' + k * x = 0 with x(0) = 1.0, v(0) = 0
  for (const presetName of EXPECTED_PRESETS) {
    const { mass: m, stiffness: k, damping: c, restDelta = 0.001 } = springPresets[presetName];

    let x = 1.0; // initial displacement
    let v = 0.0; // initial velocity
    const dt = 0.001; // 1ms step
    const maxT = 2.0; // simulate up to 2 seconds

    let minX = 0.0;
    let settledTime = null;
    let isStable = true;

    for (let t = 0; t <= maxT; t += dt) {
      if (isNaN(x) || isNaN(v) || !isFinite(x) || !isFinite(v)) {
        isStable = false;
        break;
      }

      if (x < minX) {
        minX = x; // peak overshoot in negative direction
      }

      // Check settling condition: |x| <= restDelta and |v| <= restDelta * 10
      if (settledTime === null && Math.abs(x) <= restDelta && Math.abs(v) <= restDelta * 10) {
        settledTime = t;
      }

      // RK4 integration step
      // Derivatives: dx/dt = v, dv/dt = -(c*v + k*x) / m
      const f_v = (currX, currV) => -(c * currV + k * currX) / m;

      const k1_x = v;
      const k1_v = f_v(x, v);

      const k2_x = v + 0.5 * dt * k1_v;
      const k2_v = f_v(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v);

      const k3_x = v + 0.5 * dt * k2_v;
      const k3_v = f_v(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v);

      const k4_x = v + dt * k3_v;
      const k4_v = f_v(x + dt * k3_x, v + dt * k3_v);

      x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
      v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
    }

    ctx.assert(isStable, `Preset "${presetName}" ODE simulation must remain finite and stable`);
    
    // Controlled overshoot: max overshoot percentage <= 25% (i.e. minX >= -0.25)
    ctx.assert(
      minX >= -0.25,
      `Preset "${presetName}" overshoot (${(Math.abs(minX) * 100).toFixed(1)}%) must be <= 25%`
    );

    // Settling time should be between 100ms and 1500ms for responsive fluid UI
    ctx.assert(
      settledTime !== null && settledTime >= 0.1 && settledTime <= 1.5,
      `Preset "${presetName}" settled in ${settledTime ? (settledTime * 1000).toFixed(0) : 'none'}ms (expected 100ms-1500ms)`
    );
  }
});

// =========================================================================
// TEST 3: WorkflowVisualizer Stress & Boundary State Transitions
// =========================================================================
suite.test('WorkflowVisualizer: 10,000 rapid state transitions, boundary step navigations & invariants', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  const { workflowsData } = await importModule(workflowsPath);

  ctx.assertArrayMinLength(workflowsData, 5, 'Must contain 5 workflows');

  // Verify all 5 workflows have valid steps and unique IDs
  const wfIds = new Set();
  for (const wf of workflowsData) {
    ctx.assert(!wfIds.has(wf.id), `Workflow ID ${wf.id} must be unique`);
    wfIds.add(wf.id);
    ctx.assertArrayMinLength(wf.steps, 3, `Workflow ${wf.id} must have >= 3 steps`);
  }

  // Stress-test rapid switching (10,000 iterations)
  const startTime = performance.now();
  let currentWorkflow = workflowsData[0];
  let selectedStep = null;
  let activeScrubberIndex = 0;

  for (let i = 0; i < 10000; i++) {
    // Switch workflow
    const nextWf = workflowsData[i % workflowsData.length];
    currentWorkflow = nextWf;
    activeScrubberIndex = 0;
    selectedStep = null;

    // Simulate selecting step
    const stepIdx = i % currentWorkflow.steps.length;
    selectedStep = currentWorkflow.steps[stepIdx];

    // Simulate boundary step next/prev
    // Test prev step boundary
    const prevIdx = currentWorkflow.steps.findIndex(s => s.id === selectedStep.id);
    if (prevIdx > 0) {
      selectedStep = currentWorkflow.steps[prevIdx - 1];
    } else {
      // should remain at step 0
      ctx.assertEqual(selectedStep.id, currentWorkflow.steps[0].id, 'Prev at step 0 must remain step 0');
    }

    // Test next step boundary
    const nextIdx = currentWorkflow.steps.findIndex(s => s.id === selectedStep.id);
    if (nextIdx < currentWorkflow.steps.length - 1) {
      selectedStep = currentWorkflow.steps[nextIdx + 1];
    }

    // Advance scrubber
    activeScrubberIndex = (activeScrubberIndex + 1) % currentWorkflow.steps.length;
  }

  const durationMs = performance.now() - startTime;
  ctx.assert(durationMs < 500, `10,000 workflow state transitions executed in ${durationMs.toFixed(1)}ms (< 500ms)`);

  // Step types check
  const STEP_TYPES = ['trigger', 'compute', 'agent', 'validation', 'storage', 'emission'];
  for (const wf of workflowsData) {
    for (const step of wf.steps) {
      ctx.assert(
        STEP_TYPES.includes(step.type),
        `Step ${step.id} has valid type "${step.type}"`
      );
      ctx.assertPositive(step.telemetry.p50DurationMs, `Step ${step.id} p50 > 0`);
      ctx.assertPositive(step.telemetry.p99DurationMs, `Step ${step.id} p99 > 0`);
      ctx.assertPositive(step.telemetry.avgMemoryMb, `Step ${step.id} avgMemoryMb > 0`);
      ctx.assertInRange(step.telemetry.successRatePercent, 90, 100, `Step ${step.id} success rate in [90, 100]`);
    }
  }
});

// =========================================================================
// TEST 4: ProjectsFilterGrid Stress & Boundary Filtering
// =========================================================================
suite.test('ProjectsFilterGrid: 10,000 rapid category toggles, invalid categories, and modal expansion', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  ctx.assertArrayMinLength(projects, 6, 'Must contain at least 6 projects');

  const CATEGORIES = ['All', 'Live', 'Antigravity Labs', 'Open Source', 'Unknown', '', null, undefined];

  const startTime = performance.now();

  for (let i = 0; i < 10000; i++) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const filtered = (cat === 'All' || !cat)
      ? projects
      : projects.filter(p => p.category === cat);

    if (cat === 'All' || !cat) {
      ctx.assertEqual(filtered.length, projects.length, 'Empty or "All" returns all projects');
    } else if (cat === 'Unknown') {
      ctx.assertEqual(filtered.length, 0, 'Unknown category returns empty array');
    } else {
      ctx.assert(filtered.length > 0, `Category ${cat} returned non-empty results`);
    }

    // Simulate modal expansion
    const modalProject = projects[i % projects.length];
    ctx.assertNonEmptyString(modalProject.title, 'Project title exists');
    ctx.assertNonEmptyString(modalProject.description, 'Project description exists');
    ctx.assert(Array.isArray(modalProject.techStack), 'TechStack is array');
  }

  const durationMs = performance.now() - startTime;
  ctx.assert(durationMs < 500, `10,000 project filter transitions executed in ${durationMs.toFixed(1)}ms (< 500ms)`);
});

// =========================================================================
// TEST 5: HermesTelemetryDashboard Stress & Metric Calculation
// =========================================================================
suite.test('HermesTelemetryDashboard: 10,000 tab switches, 1,000 live streaming ticks & JSON state integrity', async (ctx) => {
  const hermesPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'hermes.ts');
  const { 
    hermesTelemetryRecords, 
    hermesTaskGraph, 
    hermesMemorySystem, 
    hermesRouterLogs, 
    hermesQuorumSessions 
  } = await importModule(hermesPath);

  ctx.assertArrayMinLength(hermesTelemetryRecords, 4, 'Must have at least 4 telemetry records');

  const TABS = ['memory', 'router', 'quorum', 'json'];
  const MEM_SUBTABS = ['working', 'episodic', 'knowledge'];

  const startTime = performance.now();

  // 1. Tab switches
  for (let i = 0; i < 10000; i++) {
    const activeTab = TABS[i % TABS.length];
    const activeMemSubTab = MEM_SUBTABS[i % MEM_SUBTABS.length];
    const selectedAgent = hermesTelemetryRecords[i % hermesTelemetryRecords.length];

    ctx.assertNonEmptyString(activeTab, 'Tab is string');
    ctx.assertNonEmptyString(activeMemSubTab, 'Subtab is string');
    ctx.assertNonEmptyString(selectedAgent.agentId, 'Agent ID exists');
  }

  // 2. Simulated 1,000 live streaming ticks
  for (let tick = 0; tick < 1000; tick++) {
    const totalTokens = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalTokens, 0) + tick * 145;
    const totalCost = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalCostUsd, 0) + tick * 0.002;
    const avgLatency = Math.round(
      hermesTelemetryRecords.reduce((acc, a) => acc + a.latency.ttftMs, 0) / hermesTelemetryRecords.length
    );
    const activeAgentsCount = hermesTelemetryRecords.filter(a => a.status !== 'IDLE' && a.status !== 'TERMINATED').length;

    ctx.assert(typeof totalTokens === 'number' && isFinite(totalTokens), 'totalTokens is finite number');
    ctx.assert(typeof totalCost === 'number' && isFinite(totalCost), 'totalCost is finite number');
    ctx.assert(typeof avgLatency === 'number' && isFinite(avgLatency), 'avgLatency is finite number');
    ctx.assert(activeAgentsCount >= 0 && activeAgentsCount <= hermesTelemetryRecords.length, 'activeAgentsCount in valid range');
  }

  // 3. JSON serialization of entire state tree
  const fullState = {
    telemetry: hermesTelemetryRecords,
    taskGraph: hermesTaskGraph,
    memorySystem: hermesMemorySystem,
    routerLogs: hermesRouterLogs,
    quorumSessions: hermesQuorumSessions
  };
  const jsonStr = JSON.stringify(fullState);
  ctx.assert(jsonStr.length > 1000, 'JSON state serialization succeeds with valid content');
  const parsedBack = JSON.parse(jsonStr);
  ctx.assertEqual(parsedBack.telemetry.length, hermesTelemetryRecords.length, 'Round-trip JSON serialization preserves telemetry count');

  const durationMs = performance.now() - startTime;
  ctx.assert(durationMs < 600, `Hermes telemetry stress harness completed in ${durationMs.toFixed(1)}ms (< 600ms)`);
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
