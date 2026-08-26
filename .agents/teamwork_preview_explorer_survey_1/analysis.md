# Codebase & Tech Stack Deep Survey Analysis

**Author**: Explorer 1 (Codebase & Tech Stack Explorer)  
**Date**: 2026-08-24  
**Project**: Naveen Bishnoi Portfolio Redesign  
**Workspace**: `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio`  
**Target Directives**: Requirements R1 through R7 (`.agents/ORIGINAL_REQUEST.md`)

---

## 1. Executive Summary

The objective of this investigation is to provide a complete, forensic architectural survey of the existing Naveen Bishnoi portfolio codebase. The project mandate (`ORIGINAL_REQUEST.md`) requires a **complete visual redesign from first principles** (R1-R7). The website must transform from a dark, tech-heavy, dashboard/AI aesthetic into a **premium personal product** inspired by Apple product design, award-winning editorial art direction, and world-class creative engineering.

This audit establishes:
1. The exact technical stack, dependencies, scripts, and runtime environment.
2. An inventory of all files, templates, styles, and components.
3. A strict classification of elements that must be **completely removed/replaced** versus technical assets and data structures that can be **safely preserved and reused**.
4. The status of testing, static compilation, asset bundling, and GitHub Pages deployment.

---

## 2. Tech Stack & Environment Architecture

### 2.1 Core Runtime & Engine Matrix
| Layer | Technology | Version / Spec | Configuration File | Status / Notes |
|---|---|---|---|---|
| **Runtime Environment** | Node.js | `>=22.12.0` (Active: `v24.18.0`) | `package.json` | Fully supported ESM runtime |
| **Meta-Framework** | Astro | `^7.1.6` | `astro.config.mjs` | Static site generation (`output: 'static'`), HTML compression enabled |
| **UI Component Engine** | React / React DOM | `^19.2.8` | `astro.config.mjs`, `tsconfig.json` | React 19 Islands with `@astrojs/react` (`^6.0.4`), strict JSX typing |
| **Styling Engine** | Tailwind CSS | `^4.3.3` | `astro.config.mjs`, `src/styles/global.css` | Vite Tailwind plugin (`@tailwindcss/vite` `^4.3.3`), `@theme` token definitions |
| **Animation & Springs** | Framer Motion | `^13.1.1` | `src/lib/springs.ts` | Hardware-accelerated transitions & WWDC 2018 Apple fluid springs |
| **Micro-Interactions** | GSAP | `^3.12.7` | `package.json` | Available for complex timeline sequences |
| **Smooth Scroll** | Studio Freight Lenis | `v1.0.39` | `src/layouts/Layout.astro` | Deferred CDN script with Astro View Transitions compatibility |
| **Iconography** | Lucide React | `^1.33.0` | `package.json`, `src/components/icons.tsx` | Clean SVG vector iconography |
| **Type System** | TypeScript | Strict | `tsconfig.json` | Path aliases `@/* -> src/*`, `react-jsx` compiler options |
| **CI / CD Deployment** | GitHub Actions | `withastro/action@v3` | `.github/workflows/deploy.yml` | Automatic GitHub Pages deployment on push to `master` |

### 2.2 Package Scripts Analysis (`package.json`)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "node tests/run-all.mjs",
    "test:e2e": "node tests/run-all.mjs"
  }
}
```
- `npm run build`: Executes clean Astro static bundling into `dist/`.
- `npm test` / `npm run test:e2e`: Runs master test runner executing 11 test suites spanning 4 tiers.

---

## 3. Comprehensive Codebase Inventory

### 3.1 Directory Layout
```
c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio/
├── .astro/                     # Astro cache & generated TypeScript definitions
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages CI/CD workflow
├── dist/                       # Static build output artifacts
├── public/
│   ├── images/                 # Project imagery & authentic portrait
│   │   ├── aeonis-ops.jpg / aeonis_ops.jpg
│   │   ├── gams-terminal.jpg / gas_agency_system.jpg
│   │   ├── hermes-agent.jpg
│   │   ├── krone-telematics.jpg
│   │   ├── medallion-pipeline.jpg
│   │   ├── portfolio_hero.jpg   # Real photograph of Naveen Bishnoi
│   │   ├── sentinel_ai.jpg
│   │   ├── smart_task_system.jpg
│   │   └── ultron_framework.jpg
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── Naveen_Bishnoi_Resume.pdf
│   ├── og-image.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── CanvasBackground.tsx   # [REPLACE] Particle canvas
│   │   ├── CustomCursor.tsx       # [REPLACE] Trailing custom cursor
│   │   ├── HeaderNav.tsx          # [REDESIGN] Floating navbar
│   │   ├── Hero.tsx               # [REDESIGN] Hero section
│   │   ├── HeroSection.astro      # Astro wrapper for Hero
│   │   ├── HomeSkills.tsx         # [REDESIGN] Home skills section
│   │   ├── LabComponent.tsx       # [REDESIGN] Lab experiments page
│   │   ├── Magnetic.tsx           # [PRESERVE] Spring magnetic wrapper
│   │   ├── Preloader.tsx          # [REPLACE] Initial loading percentage screen
│   │   ├── Projects.tsx           # [REDESIGN] Projects showcase
│   │   ├── ProjectsSection.astro  # Astro wrapper for Projects
│   │   ├── ResumeComponent.tsx    # [REDESIGN] Resume & CV page
│   │   ├── ScrollProgress.tsx     # [REPLACE] Top scroll progress bar
│   │   ├── Terminal.tsx           # [REPLACE] Dropdown hacker terminal
│   │   └── icons.tsx              # [PRESERVE] Social SVG icons
│   ├── data/
│   │   ├── hermes.ts              # [PRESERVE] Telemetry, DAG task graph, 3-tier memory
│   │   ├── projects.ts            # [PRESERVE] 6 verified project definitions & invariants
│   │   └── workflows.ts           # [PRESERVE] 5 deep enterprise workflow architectures
│   ├── hooks/
│   │   └── useMagnetic.ts         # [PRESERVE] Direct manipulation mouse pull hook
│   ├── layouts/
│   │   ├── BaseLayout.astro       # [PRESERVE] Forwarder to Layout.astro
│   │   └── Layout.astro           # [REDESIGN] Main HTML document shell & meta tags
│   ├── lib/
│   │   └── springs.ts             # [PRESERVE] Apple WWDC 2018 Fluid Spring presets
│   ├── pages/
│   │   ├── contact.astro          # [REDESIGN] Contact page
│   │   ├── index.astro            # [REDESIGN] Home page
│   │   ├── lab.astro              # [REDESIGN] Lab page
│   │   ├── projects.astro         # [REDESIGN] Projects index
│   │   ├── projects/
│   │   │   └── krone-iot.astro    # [REDESIGN] Case study template
│   │   └── resume.astro           # [REDESIGN] Resume page
│   ├── styles/
│   │   ├── design-system.css      # Forwarder stylesheet
│   │   └── global.css             # [REDESIGN] Theme tokens, typography, utilities
│   ├── types/
│   │   ├── hermes.ts              # TypeScript interfaces for Hermes telemetry & quorum
│   │   ├── project.ts             # TypeScript interfaces for project entries
│   │   └── workflow.ts            # TypeScript interfaces for 6-step workflow pipelines
│   └── utils/
│       └── sound.ts               # [REPLACE] Synthetic Web Audio sound effects
├── tests/
│   ├── e2e/                       # 11 E2E test suites (Tiers 1-4)
│   ├── utils/test-helpers.mjs     # Test harness utilities & assertions
│   └── run-all.mjs                # Master test execution runner
├── astro.config.mjs
├── package.json
├── PROJECT.md
├── README.md
└── tsconfig.json
```

---

## 4. Component & Feature Classification: Replace vs. Reuse

### 4.1 Elements to Completely Remove / Replace (Violating R1-R7)
| Component / File | Current Behavior / Look | Reason for Removal / Redesign per R1-R7 |
|---|---|---|
| `CanvasBackground.tsx` | Interactive green/emerald particle network canvas responding to mouse moves | Directly violates R1 & R6 ("Remove glowing boxes, random particles, futuristic SaaS styling"). |
| `Preloader.tsx` | Fullscreen `#09090b` overlay with ticking percentage (`0% -> 100%`) and "Initializing Systems" | Feels like a sci-fi video game / AI portfolio template. Violates R1 ("Remove telemetry, technical cards"). |
| `Terminal.tsx` | Dropdown `Cmd+K` terminal (`root@naveen_sys`, `sudo hire naveen`, `whoami`) | Cyberpunk / hacker gimmick. Violates R1 & R2 ("A PREMIUM PERSONAL PRODUCT... NOT a dark futuristic AI portfolio"). |
| `CustomCursor.tsx` | Trailing white dot & ring with `mix-blend-difference` | Distracting, overrides native cursor behavior, fails accessibility standards, anti-Apple aesthetic. |
| `ScrollProgress.tsx` | Fixed 1px emerald top bar tracking scroll progress | Unnecessary visual noise; clean floating navigation is sufficient. |
| `src/utils/sound.ts` | Synthesizes 800Hz / 150Hz Web Audio beeps on hover/click | Unsolicited audio violates the "quiet, minimal, expensive" editorial calm. |
| `src/pages/index.astro` Marquee | Infinite ticker repeating "SYSTEM ARCHITECTURE • AI AUTOMATION • DISTRIBUTED SYSTEMS..." | Cluttered SaaS banner aesthetic. |
| `src/styles/global.css` | Dark `#09090b` palette with violet/emerald radial glows | Needs replacement with Apple Light/Dark material system (Light: `#F5F5F7`, Text: `#1D1D1F`, Accent: `#0071E3`). |
| `HeaderNav.tsx` | Dark translucent pill with high contrast white text | Needs refactor into Apple translucent floating navigation dock with restrained glassmorphism. |
| `Hero.tsx` | Split text with dark gradient text and generic Unsplash architecture wireframe image | Replace with R5 magazine-cover layout: Huge editorial typography + Naveen's real photograph (`portfolio_hero.jpg`) + expansive whitespace. |
| `Projects.tsx` | Alternating dark box cards with emerald hover lines and dark overlays | Replace with full-width editorial art-directed project sections (R5). |
| `HomeSkills.tsx` | 2-column dark cards with emerald hover states | Replace with Apple-style bento narrative grouping (WHO I AM / HOW I THINK). |

### 4.2 Elements to Preserve & Leverage (High-Value Technical Assets)
| Asset / Module | File Path | Value & Reuse Rationale |
|---|---|---|
| **Apple Fluid Springs** | `src/lib/springs.ts` | WWDC 2018 spring configurations (`snappy`, `glide`, `buoyant`, `morph`, `cinematic`, `sheet`, `magnetic`) provide the exact mathematical foundation required for R6 expensive motion. |
| **Magnetic Physics Hook** | `src/hooks/useMagnetic.ts` | Direct manipulation pointer physics for magnetic buttons without DOM reflow. |
| **Real Portrait Photograph** | `public/images/portfolio_hero.jpg` | Authentic high-resolution portrait of Naveen Bishnoi required for R5 hero section. |
| **Project Visual Assets** | `public/images/*.jpg` | Real technical diagram/mockup imagery for KRONE, AEONIS, Ultron, GAMS, Medallion, Sentinel AI, Smart Task. |
| **Verified Projects Data** | `src/data/projects.ts` | 6 complete project definitions with zero fabricated metrics, verified invariants, and architecture decisions. |
| **Enterprise Workflows Data** | `src/data/workflows.ts` | 5 complete, deeply detailed 6-step workflow pipelines (KRONE IoT, AEONIS OPS, Ultron, Medallion, GAMS) with real code snippets. |
| **Hermes System Data** | `src/data/hermes.ts` | Complete telemetry contracts, DAG task graph, 3-tier memory system, router decisions, and Byzantine quorum sessions. |
| **TypeScript Type Contracts** | `src/types/*.ts` | Strict typing for projects, workflows, and multi-agent telemetry. |
| **Build & Test Infrastructure** | `astro.config.mjs`, `tests/` | Clean Astro 7 + React 19 build pipeline and comprehensive 11-suite test runner. |

---

## 5. Design & Token System Gap Analysis

| Attribute | Current Implementation | Target Design System (R2, R3, R4) |
|---|---|---|
| **Canvas Background** | `#09090b` / `#050505` (Dark void) | **Light Mode**: `#F5F5F7` (Canvas), `#FFFFFF` (Secondary).<br>**Dark Mode**: Near-black graphite with subtle atmospheric lighting. |
| **Primary Typography** | `Inter`, `system-ui` | `system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif`. Huge editorial scale with tight negative tracking (`-0.03em` to `-0.04em`). |
| **Color Accents** | Emerald `#34d399` & Violet `#8b5cf6` | Controlled Apple Blue (`#0071E3` / `#0077ED`) or subtle blue-violet (`#5E5CE6`). Zero neon/rainbow. |
| **Glassmorphism** | Global heavy dark blur with high opacity borders | Restrained visionOS glass: `rgba(255,255,255,0.70)` (Light) / `rgba(30,30,32,0.70)` (Dark), `backdrop-filter: blur(20px) saturate(180%)`, ultra-soft shadows. |
| **Layout Rhythm** | Crammed card grids, dense telemetry panels | Expansive whitespace, large padding (`py-24` to `py-40`), asymmetric editorial compositions, full-width project chapters. |
| **Hero Identity** | Generic wireframe background image + glowing pill | Naveen's actual portrait (`portfolio_hero.jpg`) treated like a high-end magazine cover + large editorial typography + clear value proposition. |

---

## 6. Build, Testing & Deployment Verification

### 6.1 Build Verification
- **Command**: `npm run build`
- **Output**: Astro compiles static HTML, minified CSS, and optimized React island JS bundles into `dist/`.
- **Integrity**: Zero build errors, strict TypeScript validation passes.

### 6.2 Test Suite Execution Audit
Execution of `npm test` (`node tests/run-all.mjs`) ran 11 test suites (60 tests, 77,726 assertions):
- **Passing Suites (7/11)**:
  - `Build & Artifact Integrity`: PASS (8/8)
  - `Spring Physics & Framer Motion Replacement`: PASS (5/5)
  - `Workflows, Hermes & Projects Data Integrity`: PASS (5/5)
  - `Empirical Challenger: Data Safety & Edge Cases`: PASS (4/4)
  - `Radical Honesty & Anti-Fabrication Audit`: PASS (5/5)
  - `Real-World Workloads & Stress Testing`: PASS (5/5)
  - `Milestone 3 Empirical Challenge & Stress Harness`: PASS (5/5)
- **Failing Tests (11/60 across 4 suites)**:
  - *Root Cause*: Legacy test assertions in `tests/e2e/dom-and-sections.test.mjs`, `tests/e2e/boundary-and-corner.test.mjs`, `tests/e2e/cross-feature.test.mjs`, and `tests/e2e/lighthouse-audit.test.mjs` expect specific legacy anchor IDs (`#about`), `@media (prefers-reduced-motion: reduce)` in CSS, title length <= 70 chars, JSON-LD Schema.org script, and skip-to-content accessibility link.
  - *Action*: During redesign implementation, ensure the new layout and CSS provide the required accessibility landmarks, skip link, JSON-LD, smooth scroll, reduced motion media query, and title SEO tags.

---

## 7. Actionable Architectural Recommendations for Implementation

1. **Clean Foundation & CSS Tokens (`src/styles/global.css`)**:
   - Establish CSS variables for Apple light/dark palettes, visionOS glass tokens, and responsive editorial typography.
   - Include `@media (prefers-reduced-motion: reduce)` rules and `scroll-behavior: smooth`.
2. **Main Layout Hardening (`src/layouts/Layout.astro`)**:
   - Add `<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>`.
   - Add Schema.org JSON-LD structured data for `Person` and `WebSite`.
   - Keep page `<title>` concise (10–70 characters).
   - Remove `CanvasBackground`, `Preloader`, `CustomCursor`, `Terminal`, and `ScrollProgress` injections.
3. **Hero Composition (`src/components/Hero.tsx`)**:
   - Compose using Typography + Photography (`/images/portfolio_hero.jpg`) + Space.
   - Use subtle parallax (`useScroll`, `useTransform`) and Apple spring entrance animations.
4. **Editorial Projects Experience (`src/components/Projects.tsx`)**:
   - Render full-width art-directed sections for featured projects (KRONE, AEONIS, Ultron, Medallion, GAMS).
   - Link directly to rich case studies or GitHub repositories.
5. **Editorial About & Skills (`src/components/HomeSkills.tsx` or new `AboutSection.tsx`)**:
   - Present "WHO I AM / HOW I THINK" as an editorial story.
   - Group technical skills logically with clean typography, eliminating progress bars.
6. **Minimal Floating Dock (`src/components/HeaderNav.tsx`)**:
   - Clean, translucent floating navigation `[ NB ] Work About Lab Contact Resume`.
   - Ensure anchor targets (`#work`, `#about`, `#lab`, `#contact`) match page sections.
