# Forensic Repository & Architecture Audit (Phase 0)
**Project:** Naveen Bishnoi Portfolio — Personal Brand & Digital Experience  
**Date:** 2026-08-24  
**Auditor:** Forensic Repository Auditor (Teamwork Explorer)  
**Project Root:** `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio`  
**Reference Specification:** `.agents/ORIGINAL_REQUEST.md`

---

## 1. Executive Summary & Repository Scorecard

A thorough, line-by-line forensic investigation of the Naveen Bishnoi portfolio codebase, build toolchains, asset pipelines, component architectures, and written narratives was conducted. 

### High-Level Assessment
The codebase is currently in a transitional state. An earlier sprint attempted to apply an "Apple visionOS" aesthetic to an Astro 7 + React 19 architecture. While the underlying modern tech stack (Astro Islands, Tailwind CSS v4, Framer Motion 13, Lucide React) is solid and high-performing, the repository suffers from **four critical flaws**:

1. **Synthetic Telemetry & Dashboard Bloat:** Over-engineering of complex simulated multi-agent telemetry dashboards (`Hermes.tsx` ~885 lines, `HermesTelemetryDashboard.tsx`, `Workflows.tsx` ~566 lines) displaying synthetic metrics (fake token costs, simulated Byzantine quorums, mock CAN bus 50Hz ingest) rather than focusing on clean, human-centered engineering case studies.
2. **Component Disconnection & Broken Navigation:** Crucial authentic sections (`AboutSection.astro` containing genuine narrative and philosophy, `SkillsSection.astro` / `SkillsInteractiveMatrix.tsx`) are completely omitted from `src/pages/index.astro`. Concurrently, `HeaderNav.tsx` features `#about` and `#skills` links that fail on click because their target DOM IDs do not exist on the page.
3. **Asset Redundancy & Missing Real Imagery:** The `public/images/` directory contains 12 raw JPEG files totaling 9.4 MB, of which **6 pairs are exact byte-for-byte duplicates** (e.g., `aeonis-ops.jpg` vs `aeonis_ops.jpg`). No WebP or AVIF formats exist. Furthermore, `portfolio_hero.jpg` is a duplicate of a tractor image (`krone-telematics.jpg`), meaning there is **no real photograph of Naveen Bishnoi** in the repository.
4. **Radical Honesty & Narrative Inflation:** In places, personal student projects (AEONIS OPS, Ultron Engine, GAMS) are listed as corporate employers/organizations in `Experience.tsx`, and project copy is weighed down by generic AI hype and inflated claims ("Redefining Intelligence", "Byzantine-Fault-Tolerant swarms", "12,500 msg/s fleetwide"). In contrast, Naveen's authentic profile (`github-profile/README.md`) reveals a genuine, ambitious BCA builder with strong systems-level intuition, C programming mastery, and hands-on AI agent experimentation.

### Repository Health Scorecard

| Area | Current Grade | Primary Finding / Issue |
| :--- | :---: | :--- |
| **Framework & Build** | **A-** | Astro 7 + React 19 + Tailwind v4 is robust; build is clean, but boilerplate `README.md` and scratch scripts linger. |
| **Component Architecture** | **C+** | Fragmented. Multiple orphaned files, stub wrappers, and redundant files (`Footer.astro` vs `FooterSection.astro`). |
| **Information Architecture** | **C** | Incomplete page structure (`About` and `Skills` omitted); navbar has broken anchor links. |
| **Visual & Material Design** | **B-** | Strong Apple visionOS token system in CSS, but hero is noisy with animated Siri mesh orbs and code card; dark theme styles linger in orphaned cards. |
| **Asset Optimization** | **D** | 9.4 MB of duplicate JPEGs; zero WebP/AVIF; placeholder/tractor used for hero portrait; dummy 1.3KB PDF resume. |
| **Content & Radical Honesty** | **C-** | AI buzzword density and inflated metrics obscure genuine engineering achievements (POSIX C engine, AST security, DAG scheduler). |
| **Test Infrastructure** | **B+** | Comprehensive 11-suite E2E test runner (`tests/run-all.mjs`), but tests focus on simulated telemetry assertions rather than DOM reality. |

---

## 2. Framework & Build Environment Audit

### 2.1 Dependency Inventory (`package.json`)
```json
{
  "name": "naveen-bishnoi-portfolio",
  "type": "module",
  "version": "1.0.0",
  "engines": { "node": ">=22.12.0" },
  "dependencies": {
    "@astrojs/react": "^6.0.4",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "astro": "^7.1.6",
    "clsx": "^2.1.1",
    "framer-motion": "^13.1.1",
    "gsap": "^3.12.7",
    "lucide-react": "^1.33.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3"
  }
}
```

### 2.2 Configuration Analysis
- **`astro.config.mjs`**: Properly configured with `@astrojs/react` integration, `@tailwindcss/vite` plugin, HTML compression enabled, and site URL `https://BishnoiNaveen.github.io`.
- **`tsconfig.json`**: Extends `astro/tsconfigs/strict` with `react-jsx` and path alias `@/*` -> `src/*`.
- **`README.md`**: Currently contains default Astro starter kit boilerplate (`# Astro Starter Kit: Minimal`). Needs a complete rewrite reflecting Naveen Bishnoi's portfolio architecture.
- **Root Cleanup**: `scripts/` contains 7 leftover development scripts (`build_docs.py`, `build_docs_script.py`, `gen_doc1.py`, `generate-docs.cjs`, `make_5_docs.py`, `test.txt`, `test_m1_responsive.mjs`) that should be removed.

---

## 3. Comprehensive Component Architecture & Categorization

Below is the master categorization of all components and modules across the codebase into **KEEP**, **REMOVE**, **REDESIGN**, and **REWRITE**.

### 3.1 Master Taxonomy Matrix

| Component / File Path | Current Status / Role | Categorization | Action & Rationale |
| :--- | :--- | :---: | :--- |
| `src/layouts/Layout.astro` | Master root layout with SEO meta & JSON-LD | **KEEP & REFINE** | Keep JSON-LD, SEO, and font configurations. Refine background gradient layers to remove heavy CPU mesh animation. |
| `src/layouts/BaseLayout.astro` | 23-line backward compatibility forwarder | **REMOVE** | Redundant single-line pass-through. Consolidate everything into `Layout.astro`. |
| `src/pages/index.astro` | Primary page entry point | **REDESIGN** | Reconstruct page layout to include `Hero`, `Selected Work`, `About / How I Think`, `Interactive Lab / Systems`, `Skills Matrix`, `Contact`, `Footer`. |
| `src/components/Header.astro` | Astro wrapper for header | **KEEP** | Clean wrapper around `HeaderNav.tsx`. |
| `src/components/HeaderNav.tsx` | Apple floating glass dock navbar | **REDESIGN** | Reconcile navigation items (`#work`, `#about`, `#systems`, `#skills`, `#contact`), fix active indicator springs, remove dead link references. |
| `src/components/HeroSection.astro` | Hero section Astro wrapper with CSS gradient orbs | **REDESIGN** | Replace 3 floating animated gradient orbs and CSS keyframes with clean, restrained Apple editorial background. |
| `src/components/Hero.tsx` | Hero React island with 3D tilt & live stats | **REDESIGN** | Replace fake code simulator and synthetic stats with real portrait framing of Naveen, strong typography, and genuine credentials. |
| `src/components/HeroInteractiveCanvas.tsx` | 9-line stub wrapper around `Hero.tsx` | **REMOVE** | Dead duplicate stub. Delete completely. |
| `src/components/AboutSection.astro` | Orphaned About section with journey timeline | **REWRITE & INTEGRATE** | Integrate into `index.astro`. Elevate copy from student phrasing to confident systems-level builder narrative. |
| `src/components/ProjectsSection.astro` | Projects Astro wrapper | **KEEP** | Clean section wrapper. |
| `src/components/Projects.tsx` | Filterable project grid & modal detail view | **REDESIGN** | Evolve from generic card grid to Apple product-launch style editorial showcase with rich visual hierarchy. |
| `src/components/FluidProjectCard.tsx` | 167-line dark-slate card component | **REMOVE** | Completely unused dead code with discordant dark-mode styling. |
| `src/components/ProjectsFilterGrid.tsx` | 3-line stub re-exporting `Projects.tsx` | **REMOVE** | Unnecessary duplicate stub. Delete. |
| `src/components/WorkflowsSection.astro` | Workflows Astro wrapper | **KEEP** | Clean section container. |
| `src/components/Workflows.tsx` | 566-line interactive DAG pipeline visualizer | **REDESIGN** | Refactor from simulated dashboard to interactive "Interactive Systems Lab" showcasing real engineering architectures. |
| `src/components/WorkflowVisualizer.tsx` | Alternative workflow visualizer component | **REMOVE** | Consolidate logic into the primary systems showcase. |
| `src/components/HermesSection.astro` | Hermes Astro wrapper | **KEEP** | Section container. |
| `src/components/Hermes.tsx` | 885-line simulated multi-agent telemetry dashboard | **REDESIGN** | Strip synthetic token/cost counters and fake BFT consensus. Transform into genuine Multi-Agent Orchestration & DAG case study. |
| `src/components/HermesTelemetryDashboard.tsx`| 32 KB secondary telemetry component | **REMOVE** | Redundant duplicate dashboard. Consolidate into single cohesive systems architecture module. |
| `src/components/JsonGraphInspector.tsx` | JSON / AST graph viewer | **KEEP** | High-utility interactive component for inspecting DAG task graphs and AST security trees. |
| `src/components/SkillsSection.astro` | Orphaned Skills section wrapper | **INTEGRATE** | Mount into `index.astro` in proper visual hierarchy. |
| `src/components/SkillsInteractiveMatrix.tsx` | 310-line skills matrix with progress bars | **REDESIGN** | Replace arbitrary percentage bars (96%, 92%) with Apple-style competency bento grid grouped by domain expertise. |
| `src/components/ExperienceSection.astro` | Experience Astro wrapper | **KEEP** | Clean section wrapper. |
| `src/components/Experience.tsx` | Career timeline & engineering philosophies | **REWRITE & REDESIGN** | Remove fake company listings for personal projects. Distinctly delineate genuine work at KRONE, academic foundations, and open-source systems. |
| `src/components/ContactSection.astro` | Contact Astro wrapper | **KEEP** | Clean section wrapper. |
| `src/components/FluidContact.tsx` | Contact card with email copy & SLA indicator | **REDESIGN** | Refine typography, verify correct single email address (`0029bishnoinaveen@gmail.com` or `naveenbishnoi108@gmail.com`), polish glass aesthetics. |
| `src/components/Footer.astro` | 10-line wrapper for `Footer.tsx` | **REMOVE** | Exact duplicate of `FooterSection.astro`. Delete. |
| `src/components/FooterSection.astro` | Footer Astro wrapper | **KEEP** | Primary footer wrapper. |
| `src/components/Footer.tsx` | Footer React island with back-to-top button | **KEEP & REFINE** | Update footer links, copyright, and social links. |
| `src/components/MagneticCursorTracker.tsx` | Custom magnetic cursor follower | **KEEP** | Subtle Apple-like cursor interaction (disabled on touch / reduced-motion). |
| `src/components/icons.tsx` | Custom SVG brand icons (GitHub, LinkedIn, etc.) | **KEEP** | Essential brand icons. |
| `src/lib/springs.ts` | Framer Motion physics spring curve presets | **KEEP** | High-quality Apple WWDC spring physics definitions (`snappy`, `buoyant`, `glide`, `magnetic`). |
| `src/hooks/useMagnetic.ts` | React magnetic mouse attraction hook | **KEEP** | Clean, reusable micro-interaction hook. |
| `src/data/projects.ts` | Projects dataset | **REWRITE** | Remove fabricated claims (e.g. fake latency, exaggerated metrics). Align project records with verified architectures. |
| `src/data/workflows.ts` | Workflows dataset (71 KB) | **REWRITE & PRUNE** | Prune synthetic step telemetry. Ground steps in real architectural decisions. |
| `src/data/hermes.ts` | Hermes agent dataset (19 KB) | **REWRITE & PRUNE** | Strip simulated token cost counters and fake turn counts. Ground in actual agentic orchestration mechanisms. |
| `src/styles/global.css` | Master CSS design system and tokens (725 lines) | **KEEP & REFINE** | High-quality CSS custom properties; remove legacy dark-mode class overrides. |
| `src/styles/design-system.css` | 6-line pass-through importing `global.css` | **REMOVE** | Redundant file. |

---

## 4. Detailed Findings: Orphaned, Redundant & Stub Files

During the forensic audit, 8 files were identified as completely detached from the live build or serving as redundant wrappers:

```
src/
├── components/
│   ├── AboutSection.astro          <-- [ORPHANED] Never imported in index.astro
│   ├── SkillsSection.astro         <-- [ORPHANED] Never imported in index.astro
│   ├── SkillsInteractiveMatrix.tsx <-- [ORPHANED] Only imported in orphaned SkillsSection.astro
│   ├── FluidProjectCard.tsx        <-- [DEAD CODE] Never imported anywhere; has dark-theme styling
│   ├── HeroInteractiveCanvas.tsx   <-- [STUB] 9-line duplicate wrapper around Hero.tsx
│   ├── ProjectsFilterGrid.tsx      <-- [STUB] 3-line re-export of Projects.tsx
│   ├── Footer.astro                <-- [DUPLICATE] Exact clone of FooterSection.astro
│   └── WorkflowVisualizer.tsx      <-- [REDUNDANT] Secondary unmounted workflow component
├── layouts/
│   └── BaseLayout.astro            <-- [REDUNDANT] 23-line backward compatibility pass-through
└── styles/
    └── design-system.css           <-- [REDUNDANT] 6-line pass-through to global.css
```

### Impact on User Experience
- Visitors to the current production build cannot read Naveen's "About Me" journey or "Skills Matrix" because these components are absent from the rendered DOM.
- The navigation bar still includes links to `#about` and `#skills`. Clicking these buttons results in zero scrolling action, creating an apparent defect.

---

## 5. Visual Design, Materials & Motion Audit

### 5.1 Palette & Theme Consistency
- **Design Intent:** Bright Apple Aesthetic (`--apple-canvas: #F5F5F7`, `--apple-card-solid: #FFFFFF`, `--apple-text-primary: #1D1D1F`, `--apple-blue: #0071E3`).
- **Current Deficiencies:**
  - `HeroSection.astro` utilizes three large, heavily animated glowing mesh gradient orbs (`#38BDF8`, `#F472B6`, `#FDE047`) that float continuously. This creates visual noise and draws focus away from the core headline and call-to-action.
  - While `global.css` defines an Apple light palette, several legacy files (`FluidProjectCard.tsx`, terminal code blocks in `Hero.tsx` and `Workflows.tsx`) still utilize hardcoded dark slate backgrounds (`bg-slate-900`, `text-violet-400`), resulting in visual dissonance.

### 5.2 Material System (Glassmorphism Discipline)
- **CSS Tokens Defined:**
  - Base Card: `rgba(255, 255, 255, 0.65)` with `backdrop-filter: blur(20px)`
  - Elevated Glass: `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(32px)`
  - Floating Dock: `rgba(255, 255, 255, 0.70)` with `backdrop-filter: blur(24px)`
- **Evaluation:** The CSS tokens in `global.css` are well-structured. However, the current layout applies glassmorphism to almost every single card, badge, and box on the page. 
- **Recommendation:** Implement a strict **5-level Material Hierarchy**:
  1. *Level 0 (Canvas):* Solid `#F5F5F7`
  2. *Level 1 (Content Surfaces):* Solid `#FFFFFF` cards with subtle borders (`rgba(0,0,0,0.06)`) and ambient shadows
  3. *Level 2 (Elevated Panels / Modals):* High-opacity glass (`rgba(255,255,255,0.85)`)
  4. *Level 3 (Floating Controls / Navigation Dock):* Frosted translucent glass (`rgba(255,255,255,0.72)`) with specular hairline border
  5. *Level 4 (Overlays / Sheets):* Modal backdrops (`rgba(0,0,0,0.25)` + blur)

### 5.3 Motion & Interaction Physics
- **Spring Definitions in `src/lib/springs.ts`:**
  - `snappy`: `{ stiffness: 400, damping: 30 }`
  - `buoyant`: `{ stiffness: 260, damping: 20 }`
  - `glide`: `{ stiffness: 180, damping: 24 }`
  - `magnetic`: `{ stiffness: 350, damping: 25 }`
- **Evaluation:** The spring presets in `springs.ts` follow Apple's fluid interaction guidelines. However, `MagneticCursorTracker.tsx` and constant 3D card tilts on mousemove in the hero can be distracting on desktop.
- **Recommendation:** Retain spring curves for layout transitions, tab switching, and modal opens; eliminate looping background keyframe animations and excessive 3D card tilt.

---

## 6. Media & Asset Inventory Audit

### 6.1 Public Directory Asset Analysis (`public/`)

```
public/
├── favicon.ico                 (655 B)   - Standard favicon
├── favicon.svg                 (513 B)   - SVG icon
├── og-image.png                (83 KB)   - Social preview card
├── robots.txt                  (71 B)    - Crawler configuration
├── Naveen_Bishnoi_Resume.pdf   (1.4 KB)  - Raw stream minimal dummy PDF
├── fonts/                      (0 files) - EMPTY DIRECTORY
└── images/                     (12 files, 9.4 MB TOTAL)
    ├── aeonis-ops.jpg          (1.10 MB) == aeonis_ops.jpg          (1.10 MB) [DUPLICATE]
    ├── gams-terminal.jpg       (642 KB)  == gas_agency_system.jpg   (642 KB)  [DUPLICATE]
    ├── hermes-agent.jpg        (930 KB)  == sentinel_ai.jpg         (930 KB)  [DUPLICATE]
    ├── krone-telematics.jpg    (674 KB)  == portfolio_hero.jpg      (674 KB)  [DUPLICATE]
    ├── medallion-pipeline.jpg  (585 KB)  == smart_task_system.jpg   (585 KB)  [DUPLICATE]
    └── ultron-engine.jpg       (1.01 MB) == ultron_framework.jpg    (1.01 MB) [DUPLICATE]
```

### 6.2 Key Asset Findings
1. **100% Duplicate Image Waste:** Exactly 6 unique images are stored twice under kebab-case and snake_case naming conventions, consuming ~9.4 MB of storage and bandwidth.
2. **Missing Hero Portrait:** `portfolio_hero.jpg` is an exact duplicate of `krone-telematics.jpg` (a photograph of an agricultural combine harvester). There is currently **no actual photograph of Naveen Bishnoi** in `public/images/`.
3. **Unoptimized Formats:** All assets are uncompressed JPEGs. Converting these images to modern WebP / AVIF formats will reduce payload size by >75% (from 4.7 MB unique down to <1 MB).
4. **Mock PDF Resume:** `Naveen_Bishnoi_Resume.pdf` is an unformatted, manually assembled 1.3KB PDF text stream.

---

## 7. Radical Honesty & Content Truth Matrix

To ensure the portfolio establishes authentic credibility, every factual claim across the codebase was cross-referenced against Naveen's actual GitHub profile (`github-profile/README.md`) and project repositories.

### 7.1 Claims Audit & Radical Honesty Matrix

| Topic / Section | Current Codebase Copy (Unverified / Inflated) | Ground Truth Reality (`github-profile/README.md`) | Required Correction / Rewrite Strategy |
| :--- | :--- | :--- | :--- |
| **Headline & Brand** | *"Engineering Autonomous Systems. Redefining Intelligence."* | Systems-Level Thinker, AI-Augmented Developer, BCA Fresher. | **Rewrite:** Confident, grounded positioning: *"Developer & Systems Builder. Architecting AI automation, multi-agent frameworks, and high-performance software."* |
| **Career Experience** | `Experience.tsx` lists student projects (AEONIS OPS, Ultron Engine, GAMS) as corporate employers. | AEONIS OPS and Ultron are independent open-source / research prototypes built by Naveen. | **Rewrite:** Separate experience into **Work Experience** (e.g. KRONE Agriculture India), **Academic Foundation** (BCA), and **Selected Systems & Research Projects**. |
| **KRONE Agri Project** | *"12,500 msg/s fleetwide aggregate telemetry, 50Hz ISOBUS sensor ingestion, embedded Rust on vehicle ECUs, 72h SQLite ring buffer."* | Real domain work related to agricultural telematics and data ingestion pipelines at KRONE India. | **Rewrite:** Frame as real telemetry architecture design: *"Architecting edge-to-cloud agricultural telemetry, sensor ingestion pipelines, and predictive analytics for fleet operations."* |
| **AEONIS OPS** | *"BFT Quorum Finality <25ms, Tree-sitter AST taint propagation, 4-agent cryptographic sign-off, Istio canary sentry."* | AI-powered operations architecture for autonomous DevOps and code security auditing (Architecture / Prototype stage). | **Rewrite:** Transparently state as *Architecture Spec & Research Prototype*: *"Designing multi-agent CI/CD workflows, automated code security analysis, and self-healing deployment pipelines."* |
| **Ultron Framework** | *"Topological DAG task decomposition, 3-tier memory (Qdrant, RDF graph), Docker container sandbox."* | Multi-agent orchestration framework in Python / LangChain for automated task execution (Beta stage). | **Rewrite:** State as *Framework Beta*: *"Building an autonomous multi-agent task execution engine with DAG scheduling and vector-backed memory."* |
| **Gas Agency System** | *"POSIX temp-file inode swap, WAL Journal crash recovery, 0 byte Valgrind leak."* | Complete console-based LPG inventory and booking management system built in ANSI C with CSV persistence. | **Rewrite:** Highlight genuine systems engineering: *"Console-based inventory and transaction management engine in C, featuring deterministic state transitions and zero dynamic memory leaks."* |
| **Smart Task System** | *"Dynamic Event-Driven Workflow Architecture, Sub-16ms layout rendering, LocalStorage transactional write-back."* | Dynamic JavaScript task manager with LocalStorage persistence and clean DOM interactions. | **Rewrite:** Honest web engineering: *"Lightweight, event-driven task and workflow manager built with pure JavaScript and client-side persistence."* |
| **Contact Email** | Three different emails appear: `naveenbishnoi108@gmail.com`, `0029bishnoinaveen@gmail.com`, `bishnoinaveen759@gmail.com`. | Discrepancy between GitHub profile, resume, and site footer. | **Unify:** Standardize on one verified, primary professional contact email across all components and documentation. |

---

## 8. Test Infrastructure & Quality Assurance Assessment

### 8.1 Test Suite Structure (`tests/`)
The repository includes a custom ESM test runner (`tests/run-all.mjs`) organizing 11 test modules into 4 verification tiers:

- **Tier 1 (Core Integrity):** `build-verification.test.mjs`, `spring-physics-audit.test.mjs`, `data-integrity.test.mjs`, `dom-and-sections.test.mjs`
- **Tier 2 (Boundary & Corner Cases):** `boundary-and-corner.test.mjs`, `empirical-challenge.test.mjs`
- **Tier 3 (Integration & Policy):** `cross-feature.test.mjs`, `radical-honesty-audit.test.mjs`
- **Tier 4 (Real-World & Performance):** `real-world-workload.test.mjs`, `m3-empirical-challenge.test.mjs`, `lighthouse-audit.test.mjs`

### 8.2 Test Suite Audit Findings
1. **Strengths:** 
   - Zero external testing framework dependencies (pure Node.js ESM).
   - Fast execution time across unit checks.
   - Strict verification of package configurations and build outputs.
2. **Weaknesses / False Positives:**
   - Some tests (e.g. `dom-and-sections.test.mjs` line 48-53) accepted checking if a component file existed on disk (`compExists`) rather than asserting its actual inclusion in the rendered DOM of `dist/index.html`. This allowed `AboutSection.astro` and `SkillsSection.astro` to be omitted without failing the test suite.
   - Tests in `data-integrity.test.mjs` strictly verified schema properties for synthetic telemetry records (`hermesTelemetryRecords`), inadvertently incentivizing the retention of mock data.
3. **Recommendation:** Update test suites to assert live DOM presence for all sections and align data assertions with verified project schemas.

---

## 9. Actionable Roadmap for Subsequent Phases

Based on this forensic audit, the following execution plan is established for the redesign:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                             PHASE 0: AUDIT (DONE)                         │
│  - INITIAL_REPOSITORY_AUDIT.md produced with full KEEP/REMOVE/REDESIGN/REWRITE │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1: VISUAL BENCHMARK (DESIGN_BENCHMARK.md)        │
│  - Study Apple storytelling, Awwwards portfolios, and engineering sites    │
│  - Extract hierarchy, whitespace, editorial typography & material rules    │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                PHASE 2: DESIGN QUALITY GATE (DESIGN_DIRECTION.md)          │
│  - Define 5-Level Material System (restrained glass, solid card priority)  │
│  - Establish Apple editorial typographic hierarchy and color tokens       │
│  - VETO all generic AI templates, synthetic dashboards, and noisy loops    │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                   PHASE 3+: ARCHITECTURE, REWRITE & BUILD                  │
│  - Prune duplicate assets (convert 6 images to WebP, add real portrait)   │
│  - Delete dead components (FluidProjectCard, stubs, duplicate footers)     │
│  - Integrate About, Skills, and Selected Work in unified index.astro       │
│  - Rewrite copy with radical honesty and human engineering voice          │
│  - Validate with full test suite, Lighthouse >= 90, and WCAG 2.2 AA       │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Audit Conclusion

The Naveen Bishnoi portfolio has strong foundational technology (Astro 7, React 19, Tailwind v4, Framer Motion) but is currently hindered by **dashboard clutter, synthetic telemetry, orphaned sections, and duplicate media assets**.

By executing the KEEP / REMOVE / REDESIGN / REWRITE taxonomy outlined above, the portfolio will transform into a clean, distinctive, Apple-grade digital experience that showcases Naveen's genuine technical talent with absolute honesty and uncompromised craftsmanship.
