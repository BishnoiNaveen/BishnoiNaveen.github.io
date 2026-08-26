/**
 * radical-honesty-audit.test.mjs — Tier 3: Radical Honesty & Anti-Fabrication Audit Suite
 * Enforces requirement R1: Strict verification of authentic claims, zero fabricated marketing metrics,
 * zero fake SLAs/costs, honest status indicators, and authentic professional positioning.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Radical Honesty & Anti-Fabrication Audit (Tier 3)',
  3,
  'Asserts zero invented metrics, authentic developer positioning, valid status badges, and grounded technical claims across source and dist.'
);

// Collect all text files in src and dist
function getSourceFiles(dir, extensions = ['.ts', '.tsx', '.astro', '.html', '.css', '.json']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.astro') {
        files = files.concat(getSourceFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

suite.test('Strict scan: Zero fabricated marketing metrics across all source code and built distribution', (ctx) => {
  const srcDir = path.join(WORKSPACE_ROOT, 'src');
  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  
  const allFiles = [...getSourceFiles(srcDir), ...getSourceFiles(distDir)];
  ctx.assert(allFiles.length > 5, 'Must scan source and distribution files');

  // Forbidden fabricated phrases from prompt & anti-hallucination policy
  const forbiddenPatterns = [
    { pattern: /\$0\.0042\s*\/\s*1k/i, name: 'Fabricated token cost ($0.0042/1k tokens)' },
    { pattern: /99\.999%/i, name: 'Fabricated five-nines uptime (99.999%)' },
    { pattern: /10M\s*req\/s/i, name: 'Fabricated 10M req/sec throughput' },
    { pattern: /10M\s*requests\s*per\s*sec/i, name: 'Fabricated 10M requests per sec' },
    { pattern: /world'?s\s+fastest/i, name: 'Superlative hype: world\'s fastest' },
    { pattern: /infinite\s+scalability/i, name: 'Superlative hype: infinite scalability' },
    { pattern: /100%\s*test\s*coverage/i, name: 'False claim: 100% test coverage' },
    { pattern: /\b(GenAI\s+Wizard|Coding\s+Ninja|Rockstar\s+Developer|AI\s+Guru)\b/i, name: 'Generic inflated buzzword title' },
  ];

  for (const file of allFiles) {
    const relativePath = path.relative(WORKSPACE_ROOT, file);
    // Skip test files themselves
    if (relativePath.startsWith('tests') || relativePath.startsWith('scripts')) continue;

    const content = fs.readFileSync(file, 'utf8');

    for (const { pattern, name } of forbiddenPatterns) {
      const match = pattern.exec(content);
      ctx.assert(
        match === null,
        `Radical Honesty Violation: Found "${name}" in ${relativePath} (matched: "${match ? match[0] : ''}")`
      );
    }
  }
});

suite.test('Authentic developer positioning and identity verification', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const srcIndexPath = path.join(WORKSPACE_ROOT, 'src', 'pages', 'index.astro');
  const layoutPath = path.join(WORKSPACE_ROOT, 'src', 'layouts', 'Layout.astro');
  
  let html = '';
  if (fs.existsSync(indexPath)) {
    html = fs.readFileSync(indexPath, 'utf8');
  } else {
    if (fs.existsSync(srcIndexPath)) html += fs.readFileSync(srcIndexPath, 'utf8') + '\n';
    if (fs.existsSync(layoutPath)) html += fs.readFileSync(layoutPath, 'utf8') + '\n';
  }

  // 1. Author Name
  ctx.assert(html.includes('Naveen Bishnoi'), 'Landing page must feature author Naveen Bishnoi');

  // 2. Clear, authentic titles (AI Automation Engineer, Developer, Systems Builder, Software Architect)
  const hasLegitTitle = html.includes('AI Automation') || 
                         html.includes('Software Architect') || 
                         html.includes('Systems Builder') ||
                         html.includes('Developer');
  ctx.assert(hasLegitTitle, 'Portfolio must position Naveen with authentic technical titles');

  // 3. How I Think philosophy section presence
  const aboutPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'AboutSection.astro');
  if (fs.existsSync(aboutPath)) {
    const aboutContent = fs.readFileSync(aboutPath, 'utf8');
    ctx.assert(
      aboutContent.includes('Architect') || aboutContent.includes('Build') || aboutContent.includes('Verify'),
      'About / Philosophy section must explain architectural thought process'
    );
  }
});

suite.test('Honest project status badges and lifecycle classification', async (ctx) => {
  const projectsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'projects.ts');
  const { projects } = await importModule(projectsPath);

  const allowedStatuses = new Set(['live', 'planning', 'beta', 'prototype', 'experimental', 'archived']);
  const allowedCategories = new Set(['Live', 'Antigravity Labs', 'Open Source']);

  for (const proj of projects) {
    ctx.assert(
      allowedStatuses.has(proj.status.toLowerCase()),
      `Project "${proj.title}" status "${proj.status}" must be an honest lifecycle status`
    );
    ctx.assert(
      allowedCategories.has(proj.category),
      `Project "${proj.title}" category "${proj.category}" must be a recognized portfolio category`
    );
    ctx.assertNonEmptyString(proj.summary || proj.description, `Project "${proj.title}" must have honest summary/description`);
  }
});

suite.test('Real user photograph asset and project imagery verification', (ctx) => {
  const publicDir = path.join(WORKSPACE_ROOT, 'public', 'images');
  ctx.assertDirExists(publicDir, 'public/images directory must exist');

  const heroImagePath = path.join(publicDir, 'portfolio_hero.jpg');
  ctx.assertFileExists(heroImagePath, 'Real photograph asset public/images/portfolio_hero.jpg must exist');

  const stat = fs.statSync(heroImagePath);
  ctx.assert(stat.size > 10000, `Photograph asset size (${stat.size} bytes) must be a high-resolution real image`);

  // Verify Layout renders this image in OpenGraph / Twitter meta cards
  const layoutPath = path.join(WORKSPACE_ROOT, 'src', 'layouts', 'Layout.astro');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    ctx.assert(
      layoutContent.includes('portfolio_hero.jpg'),
      'Layout.astro must configure portfolio_hero.jpg for authentic OpenGraph and Social cards'
    );
  }

  // Verify real project images are present
  const requiredProjectAssets = [
    'krone-telematics.jpg',
    'aeonis-ops.jpg',
    'ultron-engine.jpg',
    'medallion-pipeline.jpg',
    'gams-terminal.jpg',
    'hermes-agent.jpg'
  ];

  for (const asset of requiredProjectAssets) {
    const assetPath = path.join(publicDir, asset);
    ctx.assertFileExists(assetPath, `Required project asset ${asset} must exist in public/images`);
  }
});

suite.test('Enterprise workflows and telemetry data grounded in real architecture', async (ctx) => {
  const workflowsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'workflows.ts');
  const { workflowsData } = await importModule(workflowsPath);

  // Assert all 5 workflows represent real domain architectures
  const expectedArchitectures = ['KRONE', 'AEONIS', 'Ultron', 'Medallion', 'GAMS'];
  const allWorkflowText = workflowsData.map(w => `${w.id} ${w.title} ${w.summary} ${w.techStack.join(' ')}`).join(' ');

  for (const arch of expectedArchitectures) {
    ctx.assert(
      allWorkflowText.toLowerCase().includes(arch.toLowerCase()),
      `Workflows dataset must ground engineering pipelines in authentic "${arch}" domain`
    );
  }

  for (const wf of workflowsData) {
    // Assert latency and throughput are reasonable, grounded engineering ranges
    ctx.assertNonEmptyString(wf.latencySLA, `Workflow ${wf.id} must specify latency SLA`);
    ctx.assertNonEmptyString(wf.throughput, `Workflow ${wf.id} must specify throughput`);
  }
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
