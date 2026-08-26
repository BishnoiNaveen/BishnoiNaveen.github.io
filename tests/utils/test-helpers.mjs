import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Root directory resolver relative to project workspace.
 */
export const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '..', '..');

/**
 * Converts a file path to a file:// URL compatible with ESM dynamic import across all platforms.
 */
export function toFileUrl(filePath) {
  return pathToFileURL(path.resolve(filePath)).href;
}

/**
 * Dynamically import a module safely on both Windows and POSIX systems.
 */
export async function importModule(filePath) {
  return import(toFileUrl(filePath));
}

// ANSI color codes
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

/**
 * Creates a structured test suite instance.
 * @param {string} suiteName - Name of the test suite
 * @param {number} tier - Test Tier (1, 2, 3, or 4)
 * @param {string} description - Brief description of test scope
 */
export function createTestSuite(suiteName, tier = 1, description = '') {
  const tests = [];
  let totalAssertions = 0;
  let passedAssertions = 0;
  let failedAssertions = 0;

  const testContext = {
    name: suiteName,
    tier,
    description,
    
    /**
     * Define an individual test case within this suite.
     * @param {string} testName - Descriptive name of the test
     * @param {() => void | Promise<void>} fn - Test execution function
     */
    test(testName, fn) {
      tests.push({ name: testName, fn });
    },

    /**
     * Assert a boolean condition is true.
     */
    assert(condition, message) {
      totalAssertions++;
      if (!condition) {
        failedAssertions++;
        throw new Error(message || `Assertion failed (condition was ${condition})`);
      }
      passedAssertions++;
    },

    /**
     * Assert two values are strictly equal.
     */
    assertEqual(actual, expected, message) {
      totalAssertions++;
      if (actual !== expected) {
        failedAssertions++;
        const msg = message ? `${message} | ` : '';
        throw new Error(`${msg}Expected [${expected}] (${typeof expected}) but got [${actual}] (${typeof actual})`);
      }
      passedAssertions++;
    },

    /**
     * Assert two values are not equal.
     */
    assertNotEqual(actual, unexpected, message) {
      totalAssertions++;
      if (actual === unexpected) {
        failedAssertions++;
        const msg = message ? `${message} | ` : '';
        throw new Error(`${msg}Expected value NOT to be [${unexpected}]`);
      }
      passedAssertions++;
    },

    /**
     * Assert deep equality for JSON-serializable structures.
     */
    assertDeepEqual(actual, expected, message) {
      totalAssertions++;
      const actualJson = JSON.stringify(actual);
      const expectedJson = JSON.stringify(expected);
      if (actualJson !== expectedJson) {
        failedAssertions++;
        const msg = message ? `${message} | ` : '';
        throw new Error(`${msg}Deep equality mismatch:\nExpected: ${expectedJson}\nActual:   ${actualJson}`);
      }
      passedAssertions++;
    },

    /**
     * Assert a numeric value is strictly positive (> 0).
     */
    assertPositive(val, message) {
      totalAssertions++;
      if (typeof val !== 'number' || isNaN(val) || val <= 0) {
        failedAssertions++;
        throw new Error(message || `Expected positive number, but got ${val}`);
      }
      passedAssertions++;
    },

    /**
     * Assert a numeric value is within inclusive range [min, max].
     */
    assertInRange(val, min, max, message) {
      totalAssertions++;
      if (typeof val !== 'number' || isNaN(val) || val < min || val > max) {
        failedAssertions++;
        throw new Error(message || `Expected value in range [${min}, ${max}], but got ${val}`);
      }
      passedAssertions++;
    },

    /**
     * Assert a string matches a regular expression.
     */
    assertMatches(str, regex, message) {
      totalAssertions++;
      if (typeof str !== 'string' || !regex.test(str)) {
        failedAssertions++;
        throw new Error(message || `Expected string to match pattern ${regex}, received: "${str?.substring?.(0, 100)}..."`);
      }
      passedAssertions++;
    },

    /**
     * Assert a string does NOT match a regular expression.
     */
    assertDoesNotMatch(str, regex, message) {
      totalAssertions++;
      if (typeof str === 'string' && regex.test(str)) {
        failedAssertions++;
        throw new Error(message || `Expected string NOT to match pattern ${regex}`);
      }
      passedAssertions++;
    },

    /**
     * Assert haystack contains needle.
     */
    assertContains(haystack, needle, message) {
      totalAssertions++;
      if (!haystack || !haystack.includes(needle)) {
        failedAssertions++;
        throw new Error(message || `Expected item to contain "${needle}"`);
      }
      passedAssertions++;
    },

    /**
     * Assert a file exists on disk.
     */
    assertFileExists(filePath, message) {
      totalAssertions++;
      if (!fs.existsSync(filePath)) {
        failedAssertions++;
        throw new Error(message || `Expected file to exist at path: ${filePath}`);
      }
      passedAssertions++;
    },

    /**
     * Assert a directory exists on disk.
     */
    assertDirExists(dirPath, message) {
      totalAssertions++;
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        failedAssertions++;
        throw new Error(message || `Expected directory to exist at path: ${dirPath}`);
      }
      passedAssertions++;
    },

    /**
     * Assert a string is non-empty.
     */
    assertNonEmptyString(val, message) {
      totalAssertions++;
      if (typeof val !== 'string' || val.trim().length === 0) {
        failedAssertions++;
        throw new Error(message || `Expected non-empty string, but got "${val}"`);
      }
      passedAssertions++;
    },

    /**
     * Assert an array has a minimum length.
     */
    assertArrayMinLength(arr, minLength, message) {
      totalAssertions++;
      if (!Array.isArray(arr) || arr.length < minLength) {
        failedAssertions++;
        throw new Error(message || `Expected array with at least ${minLength} items, but got length ${arr?.length}`);
      }
      passedAssertions++;
    },

    /**
     * Assert that a function throws an error matching an optional pattern.
     */
    assertThrows(fn, expectedPattern, message) {
      totalAssertions++;
      let threw = false;
      let caughtError = null;
      try {
        fn();
      } catch (err) {
        threw = true;
        caughtError = err;
      }
      if (!threw) {
        failedAssertions++;
        throw new Error(message || 'Expected function to throw an error, but it returned normally');
      }
      if (expectedPattern && caughtError) {
        const errorMsg = caughtError.message || String(caughtError);
        if (expectedPattern instanceof RegExp) {
          if (!expectedPattern.test(errorMsg)) {
            failedAssertions++;
            throw new Error(message || `Expected error message to match ${expectedPattern}, got "${errorMsg}"`);
          }
        } else if (!errorMsg.includes(expectedPattern)) {
          failedAssertions++;
          throw new Error(message || `Expected error message to contain "${expectedPattern}", got "${errorMsg}"`);
        }
      }
      passedAssertions++;
    },

    /**
     * Execute all tests in this suite and return structured summary.
     */
    async run() {
      const startTime = performance.now();
      const results = [];
      let suitePassed = true;

      console.log(`\n${colors.bright}${colors.cyan}▶ RUNNING SUITE [Tier ${tier}]: ${suiteName}${colors.reset}`);
      if (description) {
        console.log(`  ${colors.dim}${description}${colors.reset}`);
      }

      for (const { name: testName, fn } of tests) {
        const testStartTime = performance.now();
        try {
          await fn(testContext);
          const duration = (performance.now() - testStartTime).toFixed(1);
          results.push({ name: testName, passed: true, duration });
          console.log(`  ${colors.green}✓${colors.reset} ${testName} ${colors.dim}(${duration}ms)${colors.reset}`);
        } catch (err) {
          suitePassed = false;
          const duration = (performance.now() - testStartTime).toFixed(1);
          results.push({ name: testName, passed: false, duration, error: err.message });
          console.log(`  ${colors.red}✗${colors.reset} ${testName} ${colors.dim}(${duration}ms)${colors.reset}`);
          console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
        }
      }

      const totalDuration = (performance.now() - startTime).toFixed(1);
      const passedCount = results.filter(r => r.passed).length;
      const failedCount = results.filter(r => !r.passed).length;

      const summary = {
        name: suiteName,
        tier,
        passed: suitePassed,
        totalTests: tests.length,
        passedTests: passedCount,
        failedTests: failedCount,
        totalAssertions,
        passedAssertions,
        failedAssertions,
        duration: totalDuration,
        results,
      };

      if (suitePassed) {
        console.log(`${colors.green}✔ PASS [Tier ${tier}]: ${suiteName} (${passedCount}/${tests.length} tests, ${passedAssertions} assertions, ${totalDuration}ms)${colors.reset}`);
      } else {
        console.log(`${colors.red}✖ FAIL [Tier ${tier}]: ${suiteName} (${failedCount}/${tests.length} tests failed, ${totalDuration}ms)${colors.reset}`);
      }

      return summary;
    }
  };

  return testContext;
}

/**
 * Returns combined CSS content from src/styles and dist/_astro for CSS token/rule auditing.
 */
export function getCssContent() {
  const stylesDir = path.join(WORKSPACE_ROOT, 'src', 'styles');
  let combined = '';
  if (fs.existsSync(stylesDir)) {
    const files = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'));
    for (const f of files) {
      combined += '\n/* --- ' + f + ' --- */\n' + fs.readFileSync(path.join(stylesDir, f), 'utf8');
    }
  }
  const distAstroDir = path.join(WORKSPACE_ROOT, 'dist', '_astro');
  if (fs.existsSync(distAstroDir)) {
    const files = fs.readdirSync(distAstroDir).filter(f => f.endsWith('.css'));
    for (const f of files) {
      combined += '\n/* --- dist/_astro/' + f + ' --- */\n' + fs.readFileSync(path.join(distAstroDir, f), 'utf8');
    }
  }
  return combined;
}

/**
 * Reads and returns dist/index.html content if it exists.
 */
export function getDistHtml() {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, 'utf8');
  }
  return '';
}

/**
 * Returns all source code contents across src/ as a concatenated string for security & anti-fabrication scans.
 */
export function getAllSourceContent() {
  const srcDir = path.join(WORKSPACE_ROOT, 'src');
  let combined = '';
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(ts|tsx|astro|css|mjs|js|json)$/.test(entry.name)) {
        combined += `\n/* FILE: ${entry.name} */\n` + fs.readFileSync(fullPath, 'utf8');
      }
    }
  }
  walk(srcDir);
  return combined;
}

/**
 * Computes spring physics damping ratio: zeta = c / (2 * sqrt(k * m))
 */
export function computeDampingRatio(mass, stiffness, damping) {
  return damping / (2 * Math.sqrt(stiffness * mass));
}

/**
 * 4th-Order Runge-Kutta (RK4) numerical ODE solver for mass-spring-damper system:
 * m * x'' + c * x' + k * x = 0  =>  x'' = -(c/m)*v - (k/m)*x
 */
export function simulateSpringRK4(mass, stiffness, damping, initialPos = 1.0, initialVel = 0.0, dt = 0.001, totalSteps = 2000) {
  let x = initialPos;
  let v = initialVel;
  const history = [{ t: 0, x, v }];

  const accel = (pos, vel) => -(damping / mass) * vel - (stiffness / mass) * pos;

  for (let step = 1; step <= totalSteps; step++) {
    // k1
    const k1_v = accel(x, v);
    const k1_x = v;

    // k2
    const k2_v = accel(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v);
    const k2_x = v + 0.5 * dt * k1_v;

    // k3
    const k3_v = accel(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v);
    const k3_x = v + 0.5 * dt * k2_v;

    // k4
    const k4_v = accel(x + dt * k3_x, v + dt * k3_v);
    const k4_x = v + dt * k3_v;

    // Update state
    x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
    v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);

    history.push({ t: step * dt, x, v });
  }

  return history;
}

/**
 * Calculates WCAG 2.2 Relative Luminance and Contrast Ratio for two hex colors.
 */
export function calculateContrastRatio(hex1, hex2) {
  const parseHex = (hex) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const lum1 = parseHex(hex1);
  const lum2 = parseHex(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}
