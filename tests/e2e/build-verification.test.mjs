/**
 * build-verification.test.mjs — Tier 1: Build & Artifact Verification
 * Validates Astro build execution, exit code 0, static output structure in dist/,
 * asset bundling, and core document metadata.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createTestSuite, WORKSPACE_ROOT } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Build & Artifact Integrity (Tier 1)',
  1,
  'Verifies package scripts, Astro config, TypeScript compilation, and generated dist/ artifacts.'
);

suite.test('package.json configuration and scripts integrity', (ctx) => {
  const pkgPath = path.join(WORKSPACE_ROOT, 'package.json');
  ctx.assertFileExists(pkgPath, 'package.json must exist in project root');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  ctx.assertNonEmptyString(pkg.name, 'package.json must have a valid name');
  ctx.assertEqual(pkg.type, 'module', 'package.json must use ESM ("type": "module")');
  ctx.assert(pkg.scripts && typeof pkg.scripts.build === 'string', 'package.json must include a "build" script');
  ctx.assert(pkg.scripts && typeof pkg.scripts.dev === 'string', 'package.json must include a "dev" script');
  ctx.assert(pkg.dependencies && pkg.dependencies.astro, 'Astro must be listed in dependencies');
});

suite.test('astro.config.mjs syntax and presence', (ctx) => {
  const configPath = path.join(WORKSPACE_ROOT, 'astro.config.mjs');
  ctx.assertFileExists(configPath, 'astro.config.mjs must exist in project root');

  const content = fs.readFileSync(configPath, 'utf8');
  ctx.assert(content.includes('defineConfig'), 'astro.config.mjs must export defineConfig');
});

suite.test('tsconfig.json compiler options and strict mode', (ctx) => {
  const tsconfigPath = path.join(WORKSPACE_ROOT, 'tsconfig.json');
  ctx.assertFileExists(tsconfigPath, 'tsconfig.json must exist in project root');

  const raw = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfig = JSON.parse(raw);
  ctx.assert(
    tsconfig.compilerOptions || (typeof tsconfig.extends === 'string' && tsconfig.extends.includes('strict')),
    'tsconfig.json must define compilerOptions or extend strict Astro config'
  );
});

suite.test('Static build execution and exit code 0 verification', (ctx) => {
  // Execute build synchronously to verify compilation
  const output = execSync('npm run build', {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  ctx.assert(
    output.includes('Complete!') || output.includes('built in') || output.includes('dist'),
    'Astro build must report successful completion'
  );

  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  ctx.assertDirExists(distDir, 'dist/ directory must be generated upon build completion');
});

suite.test('dist/index.html generation and payload validity', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  ctx.assertFileExists(indexPath, 'dist/index.html must exist after build');

  const stat = fs.statSync(indexPath);
  ctx.assert(stat.size > 1000, `dist/index.html size (${stat.size} bytes) must exceed 1000 bytes`);

  const html = fs.readFileSync(indexPath, 'utf8');
  ctx.assert(html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>'), 'dist/index.html must have HTML5 doctype');
  ctx.assert(html.includes('<html'), 'dist/index.html must have <html> tag');
  ctx.assert(html.includes('<head'), 'dist/index.html must have <head> tag');
  ctx.assert(html.includes('<body'), 'dist/index.html must have <body> tag');
  ctx.assert(html.includes('</html'), 'dist/index.html must properly close </html> tag');
});

suite.test('HTML document metadata, viewport and SEO tags', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  ctx.assert(html.includes('charset="UTF-8"') || html.includes('charset="utf-8"'), 'HTML must declare UTF-8 charset');
  ctx.assert(html.includes('name="viewport"'), 'HTML must include responsive viewport meta tag');
  ctx.assert(html.includes('<title>'), 'HTML must include a <title> tag');
  ctx.assert(html.includes('Naveen Bishnoi'), 'HTML title or content must mention Naveen Bishnoi');
  ctx.assert(html.includes('name="description"'), 'HTML must include meta description tag for SEO');
});

suite.test('CSS and static assets bundling in dist/', (ctx) => {
  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  const astroAssetsDir = path.join(distDir, '_astro');

  // Astro generates bundled assets in dist/_astro
  if (fs.existsSync(astroAssetsDir)) {
    const files = fs.readdirSync(astroAssetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    ctx.assert(cssFiles.length >= 1, 'dist/_astro must contain at least 1 compiled CSS stylesheet');
    
    // Verify CSS file has non-zero size
    const mainCss = path.join(astroAssetsDir, cssFiles[0]);
    const cssStat = fs.statSync(mainCss);
    ctx.assert(cssStat.size > 500, `CSS bundle (${cssStat.size} bytes) must contain real styles`);
  } else {
    // If inline styles or alternative structure
    const indexPath = path.join(distDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    ctx.assert(html.includes('<style') || html.includes('.css'), 'HTML must reference styles or stylesheets');
  }
});

suite.test('Public image thumbnails and icons availability in dist/', (ctx) => {
  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  const imagesDir = path.join(distDir, 'images');

  if (fs.existsSync(imagesDir)) {
    const images = fs.readdirSync(imagesDir);
    ctx.assert(images.length >= 1, 'dist/images/ must contain project thumbnail images');
  }

  // Favicon check
  const hasFaviconIco = fs.existsSync(path.join(distDir, 'favicon.ico'));
  const hasFaviconSvg = fs.existsSync(path.join(distDir, 'favicon.svg'));
  ctx.assert(hasFaviconIco || hasFaviconSvg, 'dist/ must contain a favicon (ico or svg)');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
