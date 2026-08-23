#!/usr/bin/env node
/**
 * run-all.mjs — Master E2E Test Suite Runner
 * Executes all test modules across Tiers 1-4, renders a comprehensive test execution matrix,
 * tracks assertion counts, and provides rigorous status codes.
 */

import path from 'node:path';
import { colors, WORKSPACE_ROOT, importModule } from './utils/test-helpers.mjs';

// Registered E2E Test Suites
const SUITES = [
  { file: 'tests/e2e/build-verification.test.mjs', name: 'Build & Artifact Integrity', tier: 1 },
  { file: 'tests/e2e/spring-physics-audit.test.mjs', name: 'Spring Physics & Framer Motion', tier: 1 },
  { file: 'tests/e2e/data-integrity.test.mjs', name: 'Workflows, Hermes & Projects Data', tier: 1 },
  { file: 'tests/e2e/dom-and-sections.test.mjs', name: 'Semantic DOM & Section Structure', tier: 1 },
  { file: 'tests/e2e/boundary-and-corner.test.mjs', name: 'Boundary & Corner Cases', tier: 2 },
  { file: 'tests/e2e/empirical-challenge.test.mjs', name: 'Empirical Data Safety & Edge Cases', tier: 2 },
  { file: 'tests/e2e/cross-feature.test.mjs', name: 'Cross-Feature Integration & Contracts', tier: 3 },
  { file: 'tests/e2e/real-world-workload.test.mjs', name: 'Real-World Workloads & Stress', tier: 4 },
  { file: 'tests/e2e/m3-empirical-challenge.test.mjs', name: 'M3 Empirical Physics & Stress', tier: 4 },
  { file: 'tests/e2e/lighthouse-audit.test.mjs', name: 'Lighthouse Performance, SEO & A11y', tier: 4 },
];

async function main() {
  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='));
  const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
  const filterArg = args.find(a => a.startsWith('--filter='));
  const targetFilter = filterArg ? filterArg.split('=')[1].toLowerCase() : null;

  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  NAVEEN BISHNOI PORTFOLIO — E2E TEST SUITE RUNNER (Tiers 1-4)        ${colors.reset}`);
  console.log(`${colors.dim}  Node ${process.version} | ESM Runner | ${new Date().toISOString()}${colors.reset}`);
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
  console.log(`${colors.bright}  TEST EXECUTION MATRIX & COVERAGE SUMMARY                                             ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================================${colors.reset}`);
  console.log(`  ${'Suite Name'.padEnd(40)} | ${'Tier'.padEnd(5)} | ${'Status'.padEnd(8)} | ${'Tests'.padEnd(10)} | ${'Assertions'.padEnd(11)} | ${'Time'.padEnd(8)}`);
  console.log(`  ${'-'.repeat(40)}-+-${'-'.repeat(5)}-+-${'-'.repeat(8)}-+-${'-'.repeat(10)}-+-${'-'.repeat(11)}-+-${'-'.repeat(8)}`);

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

    console.log(`  ${s.name.padEnd(40)} | ${('Tier ' + s.tier).padEnd(5)} | ${statusBadge.padEnd(17)} | ${testCounts.padEnd(10)} | ${assertCount.padEnd(11)} | ${durationStr.padEnd(8)}`);
  }

  console.log(`  ${'-'.repeat(40)}-+-${'-'.repeat(5)}-+-${'-'.repeat(8)}-+-${'-'.repeat(10)}-+-${'-'.repeat(11)}-+-${'-'.repeat(8)}`);
  console.log(`  ${'TOTALS'.padEnd(40)} | ${'-'.padEnd(5)} | ${(allPassed ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`).padEnd(17)} | ${(`${totalPassed}/${totalTests}`).padEnd(10)} | ${(`${totalAssertions}`).padEnd(11)} | ${(`${overallDuration}ms`).padEnd(8)}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================================${colors.reset}`);

  if (allPassed) {
    console.log(`\n${colors.bgGreen}${colors.bright}${colors.white}  ✔ ALL E2E TEST SUITES PASSED (100% SUCCESS)  ${colors.reset}`);
    console.log(`${colors.green}  Total Suites: ${suiteSummaries.length} | Tests: ${totalTests} | Assertions: ${totalAssertions} | Time: ${overallDuration}ms${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.bgRed}${colors.bright}${colors.white}  ✖ TEST SUITE RUN COMPLETED WITH FAILURES  ${colors.reset}`);
    console.log(`${colors.red}  Passed Suites: ${suiteSummaries.filter(s => s.passed).length}/${suiteSummaries.length} | Failed Tests: ${totalFailed}/${totalTests}${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error in test runner:', err);
  process.exit(1);
});
