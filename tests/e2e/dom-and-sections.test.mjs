/**
 * dom-and-sections.test.mjs — Tier 1: Semantic DOM Structure & Section Verification
 * Inspects dist/index.html and source templates to verify semantic landmarks,
 * section anchors (#hero, #about, #workflows, #hermes, #projects, #skills, #contact),
 * translucent glassmorphism classes, navigation dock, links, and accessibility tags.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, getCssContent } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Semantic DOM Structure & Sections (Tier 1)',
  1,
  'Validates semantic HTML landmarks, required section containers, glassmorphism classes, navigation items, links, and accessibility compliance.'
);

suite.test('Semantic landmarks (<header>, <main>, <footer>, <nav>) in built HTML or templates', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  ctx.assertFileExists(indexPath, 'dist/index.html must exist');

  const html = fs.readFileSync(indexPath, 'utf8');

  // Verify core landmark tags
  ctx.assert(html.includes('<header') || html.includes('role="banner"'), 'Document must contain <header> landmark');
  ctx.assert(html.includes('<main') || html.includes('role="main"'), 'Document must contain <main> landmark');
  ctx.assert(html.includes('<footer') || html.includes('role="contentinfo"'), 'Document must contain <footer> landmark');
  ctx.assert(html.includes('<nav') || html.includes('role="navigation"'), 'Document must contain <nav> navigation landmark');
});

suite.test('Presence of core portfolio sections in DOM or templates', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  // Also check src/components for section modules
  const componentsDir = path.join(WORKSPACE_ROOT, 'src', 'components');

  const requiredSections = [
    { name: 'Hero', id: 'hero', pattern: /id=["']hero["']/i, comp: 'HeroSection.astro' },
    { name: 'About', id: 'about', pattern: /id=["']about["']/i, comp: 'AboutSection.astro' },
    { name: 'Projects', id: 'projects', pattern: /id=["']projects["']/i, comp: 'ProjectsSection.astro' },
    { name: 'Skills', id: 'skills', pattern: /id=["']skills["']/i, comp: 'SkillsSection.astro' },
    { name: 'Contact', id: 'contact', pattern: /id=["']contact["']/i, comp: 'ContactSection.astro' },
  ];

  for (const sec of requiredSections) {
    const inHtml = sec.pattern.test(html);
    const compExists = fs.existsSync(path.join(componentsDir, sec.comp));
    ctx.assert(
      inHtml || compExists,
      `Section "${sec.name}" (id="#${sec.id}" or ${sec.comp}) must be present in DOM or component inventory`
    );
  }
});

suite.test('Workflows and Hermes dedicated data section containers', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');
  const componentsDir = path.join(WORKSPACE_ROOT, 'src', 'components');

  const hasWorkflowsHtml = /id=["']workflows["']/i.test(html) || html.includes('Workflows') || html.includes('workflow');
  const hasWorkflowsComp = fs.existsSync(path.join(componentsDir, 'WorkflowsSection.astro')) ||
                           fs.existsSync(path.join(componentsDir, 'WorkflowVisualizer.tsx'));

  ctx.assert(
    hasWorkflowsHtml || hasWorkflowsComp,
    'Dedicated Workflows section container (id="#workflows" or WorkflowVisualizer) must exist per R2 contract'
  );

  const hasHermesHtml = /id=["']hermes["']/i.test(html) || html.includes('Hermes') || html.includes('hermes');
  const hasHermesComp = fs.existsSync(path.join(componentsDir, 'HermesSection.astro')) ||
                        fs.existsSync(path.join(componentsDir, 'HermesTelemetryDashboard.tsx'));

  ctx.assert(
    hasHermesHtml || hasHermesComp,
    'Dedicated Hermes telemetry section container (id="#hermes" or HermesTelemetryDashboard) must exist per R2 contract'
  );
});

suite.test('Glassmorphism design system tokens and utilities in CSS stylesheets', (ctx) => {
  const css = getCssContent();
  ctx.assert(css.length > 500, 'CSS stylesheets must contain non-empty style rules');

  // Verify translucent glass tokens and theme foundation
  ctx.assert(css.includes('--apple-canvas') || css.includes('--color-bg-primary'), 'CSS must define primary background canvas token');
  ctx.assert(css.includes('--apple-blue') || css.includes('--color-accent'), 'CSS must define accent color token');
  ctx.assert(css.includes('--apple-glass-base') || css.includes('--color-bg-glass') || css.includes('--glass-bg'), 'CSS must define translucent glass token');
  ctx.assert(css.includes('backdrop-filter'), 'CSS must configure backdrop-filter blur');
  ctx.assert(css.includes('.apple-glass-card') || css.includes('.glass'), 'CSS must provide glass card utility classes');
  ctx.assert(css.includes('.apple-glass-dock') || css.includes('apple-glass'), 'CSS must provide glass dock utility classes');
});

suite.test('Navigation items, interactive components, and anchor links integrity', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  // Verify floating navigation dock or links exist
  const navTargets = ['hero', 'about', 'workflows', 'hermes', 'projects', 'skills', 'contact'];
  for (const target of navTargets) {
    const hasNavAnchor = html.includes(`href="#${target}"`) || html.includes(`href='#${target}'`) || html.toLowerCase().includes(target);
    ctx.assert(hasNavAnchor, `Navigation target or anchor for "${target}" must be present`);
  }

  // Check all anchor tags with target="_blank" have rel="noopener" or "noreferrer"
  const blankLinks = html.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gi) || [];
  for (const link of blankLinks) {
    ctx.assert(
      link.includes('rel="noopener') || link.includes('rel="noreferrer') || link.includes("rel='noopener") || link.includes("rel='noreferrer"),
      `External link must include rel="noopener" for security/a11y: ${link}`
    );
  }

  // Check headings hierarchy exists
  ctx.assert(html.includes('<h1') || html.includes('<H1'), 'Page must have at least one <h1> heading');
  ctx.assert(html.includes('<h2') || html.includes('<H2'), 'Page must have <h2> section headings');
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
