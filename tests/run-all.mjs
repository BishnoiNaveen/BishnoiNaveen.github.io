#!/usr/bin/env node
/**
 * run-all.mjs — Master Entrypoint for 4-Tier E2E Test Suite Runner
 * Forwards execution to tests/test-runner.mjs
 */

import path from 'node:path';
import { runAllSuites } from './test-runner.mjs';

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
