#!/usr/bin/env node
/**
 * test-runner.mjs — Master 4-Tier Opaque-Box E2E Test Suite Runner
 * Executes all 4-Tier test suites across the 15 features in PROJECT.md:
 * - Tier 1: Feature Coverage (75+ tests across all 15 features + Spring Physics audit)
 * - Tier 2: Boundary & Corner Cases (75+ tests across all 15 features)
 * - Tier 3: Cross-Feature Combinations & Pairwise Contracts (15+ tests + Radical Honesty audit)
 * - Tier 4: Real-World Application Scenarios (10+ user journeys + Runge-Kutta ODE simulation)
 */

import path from 'node:path';
import { colors, WORKSPACE_ROOT, importModule } from './utils/test-helpers.mjs';

// Registered 4-Tier E2E Test Suites
export const SUITES = [
  { file: 'tests/e2e/m1-3d-camera-journey.test.mjs', name: 'Tier 1: Milestone 1 7-Scene Continuous 3D Journey', tier: 1 },
  { file: 'tests/e2e/tier1-features.test.mjs', name: 'Tier 1: Feature Coverage (15 Features)', tier: 1 },
  { file: 'tests/e2e/m2-navigation-hero-manifesto.test.mjs', name: 'Tier 1/2: Milestone 2 Nav, Hero & Manifesto', tier: 2 },
  { file: 'tests/e2e/m2-empirical-challenge.test.mjs', name: 'Tier 2: Milestone 2 Empirical Challenge & Stress Harness', tier: 2 },
  { file: 'tests/e2e/spring-physics-audit.test.mjs', name: 'Tier 1: Spring Physics & Motion Audit', tier: 1 },
  { file: 'tests/e2e/m5-motion-physics-polish.test.mjs', name: 'Tier 1/2: Milestone 5 Motion, Magnetic Physics & Scroll Polish', tier: 1 },
  { file: 'tests/e2e/tier2-boundaries.test.mjs', name: 'Tier 2: Boundary & Corner Cases (15 Features)', tier: 2 },
  { file: 'tests/e2e/theme-engine-anti-fouc-stress.test.mjs', name: 'Tier 2: Theme Engine & Anti-FOUC Stress Suite', tier: 2 },
  { file: 'tests/e2e/tier3-interactions.test.mjs', name: 'Tier 3: Cross-Feature Combinations', tier: 3 },
  { file: 'tests/e2e/radical-honesty-audit.test.mjs', name: 'Tier 3: Radical Honesty & Anti-Fabrication', tier: 3 },
  { file: 'tests/e2e/tier4-scenarios.test.mjs', name: 'Tier 4: Real-World Application Scenarios', tier: 4 },
  { file: 'tests/e2e/m3-editorial-casestudies.test.mjs', name: 'Tier 3: Milestone 3 Editorial Works & 7-Part Case Studies', tier: 3 },
  { file: 'tests/e2e/m3-cinematic-scroll-engine.test.mjs', name: 'Tier 3: Milestone 3 Cinematic 3D Scroll Engine & Overlays', tier: 3 },
  { file: 'tests/e2e/scroll-canvas-stress.test.mjs', name: 'Tier 4: Cinematic ScrollCanvas & Overlay Empirical Stress Harness', tier: 4 },
  { file: 'tests/e2e/m3-empirical-challenge.test.mjs', name: 'Tier 4: Empirical Physics & Stress Harness', tier: 4 },
  { file: 'tests/e2e/m4-editorial-skills-lab-contact.test.mjs', name: 'Tier 3: Milestone 4 Editorial, Skills, Lab & Contact', tier: 3 },
  { file: 'tests/e2e/m4-empirical-challenge.test.mjs', name: 'Tier 4: Milestone 4 Empirical Challenge & Stress Harness', tier: 4 },
  { file: 'tests/e2e/m5-empirical-challenge.test.mjs', name: 'Tier 4: Milestone 5 Empirical Challenge & Motion Physics Stress Harness', tier: 4 },
  { file: 'tests/e2e/challenger-scroll-canvas-stress.test.mjs', name: 'Tier 4: Challenger 1: Master Empirical ScrollCanvas Stress Harness', tier: 4 },
  { file: 'tests/e2e/lighthouse-audit.test.mjs', name: 'Tier 4: Lighthouse Performance, SEO & Accessibility Audit', tier: 4 },
];

export async function runAllSuites(options = {}) {
  const { targetTier = null, targetFilter = null } = options;

  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  NAVEEN BISHNOI PORTFOLIO — 4-TIER E2E TEST RUNNER                   ${colors.reset}`);
  console.log(`${colors.dim}  Node ${process.version} | ESM Master Runner | ${new Date().toISOString()}${colors.reset}`);
  if (targetTier) console.log(`${colors.yellow}  Filter: Running Tier ${targetTier} tests only${colors.reset}`);
  if (targetFilter) console.log(`${colors.yellow}  Filter: Matching "${targetFilter}"${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================================================${colors.reset}`);

  const activeSuites = SUITES.filter(s => {
    if (targetTier && s.tier !== targetTier) return false;
    if (targetFilter && !s.name.toLowerCase().includes(targetFilter) && !s.file.toLowerCase().includes(targetFilter)) return false;
    return true;
  });

  const overallStartTime = performance.now();
  const suiteSummaries = [];

  for (const suiteMeta of activeSuites) {
    const fullPath = path.join(WORKSPACE_ROOT, suiteMeta.file);
    try {
      const module = await importModule(fullPath);
      const suiteInstance = module.default;
      if (suiteInstance && typeof suiteInstance.run === 'function') {
        const summary = await suiteInstance.run();
        suiteSummaries.push(summary);
      } else {
        console.log(`${colors.red}Error: Suite in ${suiteMeta.file} does not export default suite instance${colors.reset}`);
        suiteSummaries.push({
          name: suiteMeta.name,
          tier: suiteMeta.tier,
          passed: false,
          totalTests: 0,
          passedTests: 0,
          failedTests: 1,
          totalAssertions: 0,
          duration: '0.0',
        });
      }
    } catch (err) {
      console.log(`${colors.red}Fatal execution error in ${suiteMeta.file}: ${err.message}${colors.reset}`);
      suiteSummaries.push({
        name: suiteMeta.name,
        tier: suiteMeta.tier,
        passed: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 1,
        totalAssertions: 0,
        duration: '0.0',
      });
    }
  }

  const overallDuration = (performance.now() - overallStartTime).toFixed(1);

  // Print Formatted Matrix Table
  console.log(`\n${colors.bright}${colors.cyan}========================================================================================${colors.reset}`);
  console.log(`${colors.bright}  4-TIER TEST EXECUTION MATRIX & COVERAGE SUMMARY                                      ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================================${colors.reset}`);
  console.log(`  ${'Suite Name'.padEnd(46)} | ${'Tier'.padEnd(5)} | ${'Status'.padEnd(8)} | ${'Tests'.padEnd(10)} | ${'Assertions'.padEnd(11)} | ${'Time'.padEnd(8)}`);
  console.log(`  ${'-'.repeat(46)}-+-${'-'.repeat(5)}-+-${'-'.repeat(8)}-+-${'-'.repeat(10)}-+-${'-'.repeat(11)}-+-${'-'.repeat(8)}`);

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalAssertions = 0;
  let allPassed = true;

  for (const s of suiteSummaries) {
    totalTests += s.totalTests;
    totalPassed += s.passedTests;
    totalFailed += s.failedTests;
    totalAssertions += s.totalAssertions;
    if (!s.passed) allPassed = false;

    const statusBadge = s.passed
      ? `${colors.green}PASS${colors.reset}`
      : `${colors.red}FAIL${colors.reset}`;
    const testCounts = `${s.passedTests}/${s.totalTests}`;
    const assertCount = `${s.totalAssertions}`;
    const durationStr = `${s.duration}ms`;

    console.log(`  ${s.name.padEnd(46)} | ${('Tier ' + s.tier).padEnd(5)} | ${statusBadge.padEnd(17)} | ${testCounts.padEnd(10)} | ${assertCount.padEnd(11)} | ${durationStr.padEnd(8)}`);
  }

  console.log(`  ${'-'.repeat(46)}-+-${'-'.repeat(5)}-+-${'-'.repeat(8)}-+-${'-'.repeat(10)}-+-${'-'.repeat(11)}-+-${'-'.repeat(8)}`);
  console.log(`  ${'TOTALS'.padEnd(46)} | ${'-'.padEnd(5)} | ${(allPassed ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`).padEnd(17)} | ${(`${totalPassed}/${totalTests}`).padEnd(10)} | ${(`${totalAssertions}`).padEnd(11)} | ${(`${overallDuration}ms`).padEnd(8)}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================================${colors.reset}`);

  if (allPassed) {
    console.log(`\n${colors.bgGreen}${colors.bright}${colors.white}  ✔ ALL 4-TIER E2E TEST SUITES PASSED (100% SUCCESS)  ${colors.reset}`);
    console.log(`${colors.green}  Total Suites: ${suiteSummaries.length} | Tests: ${totalTests} | Assertions: ${totalAssertions} | Time: ${overallDuration}ms${colors.reset}\n`);
    return { success: true, totalTests, totalPassed, totalAssertions, overallDuration };
  } else {
    console.log(`\n${colors.bgRed}${colors.bright}${colors.white}  ✖ TEST SUITE RUN COMPLETED WITH FAILURES  ${colors.reset}`);
    console.log(`${colors.red}  Passed Suites: ${suiteSummaries.filter(s => s.passed).length}/${suiteSummaries.length} | Failed Tests: ${totalFailed}/${totalTests}${colors.reset}\n`);
    return { success: false, totalTests, totalPassed, totalFailed, totalAssertions, overallDuration };
  }
}

// Direct CLI entrypoint
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='));
  const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
  const filterArg = args.find(a => a.startsWith('--filter='));
  const targetFilter = filterArg ? filterArg.split('=')[1].toLowerCase() : null;

  runAllSuites({ targetTier, targetFilter })
    .then(res => {
      process.exit(res.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error in test runner:', err);
      process.exit(1);
    });
}
