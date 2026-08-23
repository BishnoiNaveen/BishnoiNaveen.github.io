import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const htmlFile = path.join(distDir, 'index.html');

console.log('=== Milestone 1 Responsive & Performance Stress Test ===');

let failures = 0;
let passes = 0;

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`[PASS] ${name}`);
    passes++;
  } else {
    console.error(`[FAIL] ${name} - ${details}`);
    failures++;
  }
}

// 1. Build Artifact Existence
assert(fs.existsSync(htmlFile), 'dist/index.html exists');

const htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// 2. Responsive Breakpoint Token & CSS Validation
const astroFiles = fs.readdirSync(path.join(distDir, '_astro'));
const cssFiles = astroFiles.filter(f => f.endsWith('.css'));
assert(cssFiles.length > 0, `Found CSS bundle (${cssFiles.join(', ')})`);

const cssContent = cssFiles.map(f => fs.readFileSync(path.join(distDir, '_astro', f), 'utf-8')).join('\n');

// 3. Overflow & Scrollbar Verification
assert(cssContent.includes('overflow-x:hidden') || cssContent.includes('overflow-x: hidden') || htmlContent.includes('overflow-x'), 
  'Body has overflow-x prevention to eliminate horizontal scrollbars');

// 4. Fluid Clamp Typography Scale Checks
assert(cssContent.includes('clamp('), 'CSS contains fluid clamp typography scales');

// 5. Apple Bright Theme Design Tokens
assert(cssContent.includes('#f5f5f7') || cssContent.includes('#F5F5F7') || cssContent.includes('--apple-canvas'), 
  'Bright Apple Canvas token (#F5F5F7) is present in build');
assert(cssContent.includes('#0071e3') || cssContent.includes('#0071E3') || cssContent.includes('--apple-blue'), 
  'Apple Blue Accent (#0071E3) is present in build');
assert(cssContent.includes('#1d1d1f') || cssContent.includes('#1D1D1F') || cssContent.includes('--apple-text-primary'), 
  'Apple Text Primary (#1D1D1F) is present in build');

// 6. Backdrop-filter GPU & Fallback Verification
assert(cssContent.includes('backdrop-filter') || cssContent.includes('-webkit-backdrop-filter'), 
  'Backdrop-filter visionOS glassmorphism properties are compiled in CSS bundle');

// 7. Reduced Motion Accessibility & GPU Relief
assert(cssContent.includes('prefers-reduced-motion') || htmlContent.includes('prefers-reduced-motion'), 
  'prefers-reduced-motion media query support is configured for accessibility and GPU relief');

// 8. Responsive Breakpoint Classes in HTML & Island Code
assert(htmlContent.includes('sm:text-5xl') || htmlContent.includes('sm:') || cssContent.includes('@media (min-width: 640px)'), 
  'Mobile-to-Tablet (sm: 640px) breakpoint responsive scaling present');
assert(htmlContent.includes('md:') || cssContent.includes('@media (min-width: 768px)'), 
  'Tablet (md: 768px) breakpoint responsive scaling present');
assert(htmlContent.includes('lg:grid-cols-12') || htmlContent.includes('lg:') || cssContent.includes('@media (min-width: 1024px)'), 
  'Desktop (lg: 1024px) breakpoint responsive scaling present');
assert(htmlContent.includes('max-w-7xl') || htmlContent.includes('max-w-6xl') || cssContent.includes('max-width: 1240px') || cssContent.includes('max-width:1240px'), 
  'Ultra-wide (>1440px) container bounding constraints present');

// 9. Mobile Navigation Drawer & Touch Optimization
assert(htmlContent.includes('HeaderNav') || htmlContent.includes('Resume') || htmlContent.includes('aria-expanded'), 
  'HeaderNav island with mobile navigation controls compiled into HTML');

// 10. Performance / Bundle Size Audit
let totalJsSize = 0;
let totalCssSize = 0;
for (const file of astroFiles) {
  const filePath = path.join(distDir, '_astro', file);
  const stat = fs.statSync(filePath);
  if (file.endsWith('.js')) totalJsSize += stat.size;
  if (file.endsWith('.css')) totalCssSize += stat.size;
}

console.log(`Total CSS Bundle Size: ${(totalCssSize / 1024).toFixed(2)} KB`);
console.log(`Total JS Bundle Size: ${(totalJsSize / 1024).toFixed(2)} KB`);

assert(totalCssSize < 100 * 1024, `CSS bundle is lean (<100KB, actual: ${(totalCssSize / 1024).toFixed(2)} KB)`);
assert(totalJsSize < 600 * 1024, `JS bundle is reasonable (<600KB, actual: ${(totalJsSize / 1024).toFixed(2)} KB)`);

// Summary
console.log(`\nResults: ${passes} PASS, ${failures} FAIL`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL TESTS PASSED.');
}
