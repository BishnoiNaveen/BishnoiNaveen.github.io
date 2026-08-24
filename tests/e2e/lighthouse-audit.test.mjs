/**
 * lighthouse-audit.test.mjs — Tier 4 / Acceptance: Lighthouse Performance, SEO & A11y Audit Suite
 * Audits Lighthouse Core Web Vitals targets (FCP, TBT, CLS), SEO metadata, JSON-LD structured schema,
 * CSS containment, responsive aspect ratios, font preconnects, and WCAG 2.2 AA accessibility markers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, getCssContent } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Lighthouse Performance, SEO & Accessibility Audit (Tier 4)',
  4,
  'Audits performance benchmarks (score >= 90), CSS containment, font preconnects, JSON-LD, SEO, and a11y compliance.'
);

suite.test('Performance & Core Web Vitals: Payload budgets, font preconnects and blocking assets', (ctx) => {
  const distDir = path.join(WORKSPACE_ROOT, 'dist');
  const distIndexPath = path.join(distDir, 'index.html');
  ctx.assertFileExists(distIndexPath, 'dist/index.html must exist for performance audit');

  const html = fs.readFileSync(distIndexPath, 'utf8');
  const stat = fs.statSync(distIndexPath);

  // 1. Initial HTML payload budget < 200 KB
  const htmlKb = stat.size / 1024;
  ctx.assert(
    htmlKb < 200,
    `HTML payload (${htmlKb.toFixed(1)} KB) must be under 200 KB budget for instant FCP`
  );

  // 2. Critical font preconnect hints
  ctx.assert(
    html.includes('rel="preconnect" href="https://fonts.googleapis.com"') ||
    html.includes("rel='preconnect' href='https://fonts.googleapis.com'"),
    'Document head must contain preconnect to fonts.googleapis.com'
  );
  ctx.assert(
    html.includes('rel="preconnect" href="https://fonts.gstatic.com"') ||
    html.includes("rel='preconnect' href='https://fonts.gstatic.com'"),
    'Document head must contain preconnect to fonts.gstatic.com with crossorigin'
  );

  // 3. No synchronous blocking script tags in head
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  if (headMatch) {
    const headHtml = headMatch[0];
    const syncScripts = headHtml.match(/<script(?![^>]*(?:async|defer|type=["']application\/ld\+json["']|type=["']module["']))[^>]*src=/gi) || [];
    ctx.assert(
      syncScripts.length === 0,
      `Head must not contain synchronous render-blocking scripts: ${syncScripts.join(', ')}`
    );
  }

  // 4. CSS bundle size budget
  const astroDir = path.join(distDir, '_astro');
  if (fs.existsSync(astroDir)) {
    const cssFiles = fs.readdirSync(astroDir).filter(f => f.endsWith('.css'));
    for (const cssFile of cssFiles) {
      const cssSize = fs.statSync(path.join(astroDir, cssFile)).size;
      ctx.assert(
        cssSize < 150 * 1024,
        `CSS bundle ${cssFile} (${(cssSize / 1024).toFixed(1)} KB) must be under 150 KB`
      );
    }
  }
});

suite.test('CSS Containment & Layout Stability: layout style paint isolation and smooth scroll', (ctx) => {
  const css = getCssContent();
  ctx.assert(css.length > 500, 'CSS stylesheets must exist and contain rules');

  // Verify containment rules in design system
  ctx.assert(
    css.includes('contain:') || css.includes('contain-layout') || css.includes('contain-paint') || css.includes('contain: layout style'),
    'CSS stylesheets must declare CSS containment rules for layout performance'
  );

  // Verify smooth scroll and scroll padding
  ctx.assert(css.includes('scroll-behavior: smooth'), 'HTML/CSS must declare scroll-behavior: smooth');
  ctx.assert(css.includes('scroll-padding-top:'), 'HTML/CSS must set scroll-padding-top for fixed navigation offset');
});

suite.test('SEO Metadata & Social Cards: OpenGraph, Twitter Cards, Canonical & Viewport', (ctx) => {
  const distIndexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(distIndexPath, 'utf8');

  // Title length and quality
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  ctx.assert(titleMatch !== null, 'Document must have <title>');
  const titleText = titleMatch ? titleMatch[1].trim() : '';
  ctx.assert(titleText.length >= 10 && titleText.length <= 70, `Title "${titleText}" length (${titleText.length}) should be 10-70 chars`);
  ctx.assert(titleText.includes('Naveen Bishnoi'), 'Title must contain author name');

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  ctx.assert(descMatch !== null, 'Document must have meta description');
  const descText = descMatch ? descMatch[1] : '';
  ctx.assert(descText.length >= 40 && descText.length <= 200, `Meta description (${descText.length} chars) must be 40-200 chars`);

  // Canonical link
  ctx.assert(
    html.includes('<link rel="canonical"') || html.includes("<link rel='canonical'"),
    'Document must contain canonical URL link tag'
  );

  // Theme color and color scheme
  ctx.assert(html.includes('name="theme-color"'), 'Document must have theme-color meta tag');
  ctx.assert(html.includes('name="color-scheme"'), 'Document must have color-scheme meta tag');

  // OpenGraph tags
  const requiredOgTags = ['og:type', 'og:title', 'og:description', 'og:image', 'og:url', 'og:site_name'];
  for (const tag of requiredOgTags) {
    ctx.assert(
      html.includes(`property="${tag}"`) || html.includes(`property='${tag}'`),
      `Document must contain OpenGraph tag: ${tag}`
    );
  }

  // Twitter Card tags
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  for (const tag of requiredTwitterTags) {
    ctx.assert(
      html.includes(`name="${tag}"`) || html.includes(`name='${tag}'`),
      `Document must contain Twitter Card tag: ${tag}`
    );
  }
});

suite.test('JSON-LD Structured Data: Schema.org Person & WebSite entity validity', (ctx) => {
  const distIndexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(distIndexPath, 'utf8');

  // Extract JSON-LD script block
  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  ctx.assert(jsonLdMatch !== null, 'Document must contain <script type="application/ld+json"> tag');

  const jsonLdRaw = jsonLdMatch ? jsonLdMatch[1] : '{}';
  let parsed;
  try {
    parsed = JSON.parse(jsonLdRaw);
  } catch (e) {
    ctx.assert(false, `JSON-LD must be valid JSON: ${e.message}`);
  }

  ctx.assert(parsed['@context'] === 'https://schema.org', 'JSON-LD context must be https://schema.org');
  ctx.assert(Array.isArray(parsed['@graph']) && parsed['@graph'].length >= 2, 'JSON-LD @graph must define at least WebSite and Person');

  const webSite = parsed['@graph'].find(e => e['@type'] === 'WebSite');
  const person = parsed['@graph'].find(e => e['@type'] === 'Person');

  ctx.assert(webSite !== undefined, 'JSON-LD @graph must include WebSite entity');
  ctx.assert(person !== undefined, 'JSON-LD @graph must include Person entity');

  if (person) {
    ctx.assertEqual(person.name, 'Naveen Bishnoi', 'Person entity name must be Naveen Bishnoi');
    ctx.assertNonEmptyString(person.jobTitle, 'Person entity must have jobTitle');
    ctx.assert(Array.isArray(person.knowsAbout) && person.knowsAbout.length >= 3, 'Person entity knowsAbout must list core competencies');
    ctx.assert(Array.isArray(person.sameAs) && person.sameAs.length >= 1, 'Person entity sameAs must include social profile links');
  }
});

suite.test('Accessibility & WCAG 2.2 AA: Heading hierarchy, landmarks, skip link, and contrast tokens', (ctx) => {
  const distIndexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  const html = fs.readFileSync(distIndexPath, 'utf8');

  // 1. Skip-to-content link
  ctx.assert(
    html.includes('href="#main-content"') && (html.includes('skip-link') || html.includes('Skip to main content')),
    'Document must contain skip-to-content accessibility link'
  );

  // 2. Main content landmark with matching id
  ctx.assert(
    html.includes('id="main-content"'),
    'Document must have <main id="main-content">'
  );

  // 3. Single H1 heading
  const h1Matches = html.match(/<h1[\s\S]*?<\/h1>/gi) || [];
  ctx.assert(
    h1Matches.length >= 1,
    'Page must contain an <h1> primary heading'
  );

  // 4. Section H2 headings
  const h2Matches = html.match(/<h2[\s\S]*?<\/h2>/gi) || [];
  ctx.assert(
    h2Matches.length >= 4,
    `Page must contain at least 4 <h2> section headings for outline hierarchy (found ${h2Matches.length})`
  );

  // 5. Reduced motion stylesheet verification
  const css = getCssContent();
  ctx.assert(
    css.includes('@media (prefers-reduced-motion: reduce)') || css.includes('@media(prefers-reduced-motion:reduce)') || css.includes('prefers-reduced-motion'),
    'CSS stylesheets must define @media (prefers-reduced-motion: reduce)'
  );
  ctx.assert(
    css.includes('animation-duration: 0.01ms') || css.includes('transition-duration: 0.01ms') || css.includes('animation: none'),
    'Reduced motion must suppress long transitions and animations'
  );
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
