# Codebase & Tech Stack Analysis — Naveen Bishnoi Portfolio
**Date**: 2026-08-23  
**Explorer**: Explorer 1 (Codebase & Tech Stack Explorer)  
**Target Goal**: Bright Apple-Style Redesign (WWDC 2018 Fluid Interface & visionOS Glassmorphism)

---

## 1. Executive Summary & Codebase Health

The Naveen Bishnoi Portfolio is a high-performance, statically generated web application powered by **Astro v7.1.6**, **React 19.2.8**, and **Framer Motion 13.1.1**.

### Current Status
- **Build Status**: `npm run build` completes cleanly in ~3.9 seconds, producing an optimized static production bundle in `dist/`.
- **Test Status**: Master E2E test runner (`node tests/run-all.mjs`) executes 10 suites covering Tiers 1–4, passing **54/54 tests** and **77,396 assertions** in ~5.2 seconds.
- **Island Architecture**: Zero-JS static baseline for `.astro` page shells and layout, with targeted client-side hydration (`client:load`, `client:visible`, `client:idle`) for interactive React islands.
- **Spring Physics Library**: `src/lib/springs.ts` implements 7 physical spring presets (snappy, glide, buoyant, morph, cinematic, sheet, magnetic) adhering to WWDC 2018 fluid interface principles.
- **Data Collections**: Rich, strongly typed local data models in `src/data/workflows.ts` (5 enterprise domains), `src/data/hermes.ts` (multi-agent telemetry, 3-tier memory, router logs, quorum consensus), and `src/data/projects.ts` (6 featured systems).

### Primary Redesign Objective
The current codebase functions with a dark obsidian palette (`hsl(228, 18%, 7%)`). The goal is to transform the aesthetic into a **bright, vivid Apple iOS 18 / visionOS design** featuring pure white (`#FFFFFF`) and ultra-light gray (`#F5F5F7`) canvases, glowing saturated mesh gradients, pure black (`#1D1D1F`) typography, signature Apple blue (`#0071E3`) accents, heavy glassmorphic blurs (`backdrop-filter: blur(40px) saturate(150%)`), and prominent edge-to-edge project imagery.

---

## 2. Tech Stack & Dependencies Audit

### `package.json` Dependencies
| Package | Version | Purpose |
|---|---|---|
| `astro` | `^7.1.6` | Core Static Site Generator & Island Architecture runtime |
| `@astrojs/react` | `^6.0.4` | Astro integration enabling React 19 JSX rendering & island hydration |
| `react` | `^19.2.8` | Component model for interactive widgets and dashboards |
| `react-dom` | `^19.2.8` | DOM rendering for React 19 islands |
| `@types/react` | `^19.2.18` | TypeScript definitions for React 19 |
| `@types/react-dom` | `^19.2.4` | TypeScript definitions for React DOM |
| `framer-motion` | `^13.1.1` | Declarative spring animations, shared layout FLIP, gestural drag |
| `gsap` | `^3.12.7` | GreenSock Animation Platform for high-performance canvas/micro-tweens |
| `lucide-react` | `^1.33.0` | Iconography library providing clean, vector icons |
| `clsx` | `^2.1.1` | Utility for constructing conditional className strings |
| `tailwind-merge` | `^3.6.0` | Conflict-free utility class merging |

### Node & Runtime Requirements
- `engines.node`: `>=22.12.0`
- TypeScript: Extended from `astro/tsconfigs/strict` with `baseUrl: "."` and path alias `@/*` -> `src/*`.

---

## 3. Project File Map & Structure

```
.
├── .agents/                          # Multi-agent coordination metadata
│   ├── ORIGINAL_REQUEST.md           # User prompt & acceptance criteria
│   ├── explorer_0_1/                 # Explorer 1 working directory
│   │   ├── BRIEFING.md
│   │   ├── DISPATCH.md
│   │   ├── progress.md
│   │   ├── analysis.md
│   │   └── handoff.md
├── public/                           # Static assets served at root
│   ├── favicon.ico                   # Standard favicon
│   ├── favicon.svg                   # Scalable vector favicon
│   ├── og-image.png                  # Open Graph social preview (1200x630)
│   ├── robots.txt                    # Search crawler policy
│   ├── Naveen_Bishnoi_Resume.pdf     # Resume downloadable asset
│   ├── fonts/                        # Local font storage
│   └── images/                       # Project image assets
│       ├── aeonis_ops.jpg            # 1.10 MB image
│       ├── gas_agency_system.jpg     # 641 KB image
│       ├── portfolio_hero.jpg        # 674 KB image
│       ├── sentinel_ai.jpg           # 929 KB image
│       ├── smart_task_system.jpg     # 585 KB image
│       └── ultron_framework.jpg      # 1.00 MB image
├── src/
│   ├── components/                   # Astro shells & React interactive islands
│   │   ├── AboutSection.astro        # Timeline & philosophy section
│   │   ├── ContactSection.astro      # Contact section shell
│   │   ├── FluidContact.tsx          # React island: direct email & social cards
│   │   ├── FluidProjectCard.tsx      # React component: interactive project card
│   │   ├── Footer.astro              # Semantic <footer> with social links
│   │   ├── Header.astro              # Astro wrapper for HeaderNav
│   │   ├── HeaderNav.tsx             # React island: floating dock & mobile sheet
│   │   ├── HermesSection.astro       # Hermes section shell
│   │   ├── HermesTelemetryDashboard.tsx # React island: multi-agent telemetry dashboard
│   │   ├── HeroInteractiveCanvas.tsx # React island: 3D perspective tilt & copy
│   │   ├── HeroSection.astro         # Hero section shell with mesh gradient
│   │   ├── icons.tsx                 # Custom SVG icons (Github, Linkedin, Instagram)
│   │   ├── JsonGraphInspector.tsx    # React component: expandable JSON tree inspector
│   │   ├── MagneticCursorTracker.tsx # React island: fluid magnetic cursor follower
│   │   ├── ProjectsFilterGrid.tsx    # React island: category FLIP filter & modal
│   │   ├── ProjectsSection.astro     # Projects section shell
│   │   ├── SkillsInteractiveMatrix.tsx # React island: category switch & skill gauges
│   │   ├── SkillsSection.astro       # Skills section shell
│   │   ├── WorkflowsSection.astro    # Workflows section shell
│   │   └── WorkflowVisualizer.tsx    # React island: DAG visualizer & step inspector
│   ├── data/                         # Typed data sources
│   │   ├── hermes.ts                 # Hermes telemetry, DAGs, memory, router, quorum
│   │   ├── projects.ts               # 6 detailed projects with system invariants
│   │   └── workflows.ts              # 5 enterprise workflows (KRONE, AEONIS, etc.)
│   ├── hooks/
│   │   └── useMagnetic.ts            # Custom hook for mouse displacement spring pull
│   ├── layouts/
│   │   └── BaseLayout.astro          # Master HTML layout, SEO, JSON-LD, fonts
│   ├── lib/
│   │   └── springs.ts                # WWDC 2018 spring physics matrix
│   ├── pages/
│   │   └── index.astro               # Home page assembling all sections
│   ├── styles/
│   │   └── design-system.css         # CSS custom properties, tokens, reset, utilities
│   └── types/
│       ├── hermes.ts                 # Hermes types & interfaces
│       ├── project.ts                # Project types & interfaces
│       └── workflow.ts               # Workflow DAG types & interfaces
├── tests/                            # Test suite
│   ├── run-all.mjs                   # Master test suite runner
│   ├── utils/test-helpers.mjs        # Assertion library and test harnesses
│   └── e2e/                          # 10 E2E test suites (Tiers 1-4)
├── apple_ui_inspiration.md           # Visual aesthetic specification
├── astro.config.mjs                  # Astro configuration
├── package.json                      # Project dependencies & scripts
├── PROJECT.md                        # Master architectural plan & feature specs
├── README.md                         # Project documentation
└── tsconfig.json                     # TypeScript strict configuration
```

---

## 4. Architecture & Island Hydration Strategy

Astro's **Island Architecture** (`astro:island`) is utilized to deliver maximum runtime performance without unnecessary JavaScript payload on initial render:

```
[index.astro]
 ├── BaseLayout.astro (Static HTML, SEO, JSON-LD, CSS Tokens)
 │    ├── Header.astro ───────────> HeaderNav.tsx [client:load]
 │    ├── HeroSection.astro ──────> HeroInteractiveCanvas.tsx [client:load]
 │    ├── WorkflowsSection.astro ─> WorkflowVisualizer.tsx [client:visible]
 │    ├── HermesSection.astro ────> HermesTelemetryDashboard.tsx [client:visible]
 │    ├── ProjectsSection.astro ──> ProjectsFilterGrid.tsx [client:visible]
 │    ├── SkillsSection.astro ────> SkillsInteractiveMatrix.tsx [client:visible]
 │    ├── AboutSection.astro ─────> Pure Static HTML + Vanilla IntersectionObserver
 │    ├── ContactSection.astro ───> FluidContact.tsx [client:visible]
 │    ├── Footer.astro ───────────> Pure Static HTML
 │    └── MagneticCursorTracker ──> MagneticCursorTracker.tsx [client:idle]
```

### Hydration Allocation
- `client:load`: Header Navigation dock (needs immediate scroll-spy and interactivity) and Hero Interactive Canvas.
- `client:visible`: Below-the-fold sections (Workflows, Hermes, Projects, Skills, Contact) hydrate only when scrolled into the viewport threshold, keeping initial FID and LCP ultra-fast.
- `client:idle`: Magnetic cursor follower runs on background idle loop without competing with core rendering.

---

## 5. Spring Physics & Motion Architecture

All interactive elements utilize explicit Framer Motion spring physics defined in `src/lib/springs.ts`. Static CSS transitions on interactive islands have been removed to avoid motion conflict.

### Spring Presets Matrix
| Preset | Mass ($m$) | Stiffness ($k$) | Damping ($c$) | Damping Ratio ($\zeta$) | Use Case |
|---|---|---|---|---|---|
| `snappy` | 0.6 | 450 | 24 | 0.730 (Underdamped) | Buttons, toggles, icon chips, hover micro-effects |
| `glide` | 0.8 | 380 | 28 | 0.803 (Underdamped) | Navigation pill indicators, tab selectors |
| `buoyant` | 1.0 | 300 | 24 | 0.693 (Underdamped) | 3D card tilt, floating widgets, card hovering |
| `morph` | 1.1 | 280 | 26 | 0.741 (Underdamped) | FLIP layout animations, category grid reorganization |
| `cinematic` | 1.2 | 220 | 26 | 0.800 (Underdamped) | Expanding dialog modals, full view shifts |
| `sheet` | 1.0 | 320 | 32 | 0.894 (Underdamped) | Mobile slide-over drawer, gestural drag dismiss |
| `magnetic` | 0.5 | 260 | 20 | 0.877 (Underdamped) | Magnetic button pull, cursor follower |

All presets maintain damping ratios in the optimal range $0.69 < \zeta < 0.90$, guaranteeing snappy settling times ($< 350\text{ms}$) without oscillation overshoot.

---

## 6. Data Layer & Schemas

The data layer is 100% local, typed, and offline-capable:

### 1. Workflows (`src/data/workflows.ts`, `src/types/workflow.ts`)
Contains 5 comprehensive enterprise workflows:
1. **KRONE Edge-to-Cloud Telematics & Yield Optimization**: 50Hz ISOBUS CAN ingestion, embedded ONNX anomaly detection, SQLite ring buffer, Kafka/TimescaleDB sync, PostGIS yield triangulation.
2. **AEONIS OPS Autonomous DevOps**: Git webhook trigger, multi-agent task decomposition, AST taint verification, Terraform ephemeral staging, canary rollback.
3. **Ultron Enterprise Multi-Agent Automation**: Dynamic DAG scheduling, isolated container sandbox execution, Byzantine fault tolerant quorum voting.
4. **Medallion Lakehouse Stream Processing**: Bronze raw Kafka ingestion, Silver dbt cleaning/deduplication, Gold BigQuery feature mart.
5. **GAMS Transactional Storage Engine**: High-throughput C console engine, double-entry inventory balancing, atomic inode swapping.

Each workflow includes rich step definitions, input/output schemas, failure strategies (retry with backoff, circuit breaker, failover, quarantine), and real runnable code snippets in Rust, Python, TypeScript, SQL, and C.

### 2. Hermes Telemetry & Agent Data (`src/data/hermes.ts`, `src/types/hermes.ts`)
Provides structured agent telemetry:
- **`hermesTelemetryRecords`**: Telemetry for 5 active agents (Master Orchestrator, Sentinel Security Sentry, Telematics Edge Ingest, Vector Memory Curating, Quorum Consensus Arbiter). Includes prompt/completion token counters, cost tracking, TTFT/total latency breakdowns, and model assignments.
- **`hermesTaskGraph`**: Directed Acyclic Graph (DAG) with node dependencies, topological execution levels, and node statuses.
- **`hermesMemorySystem`**: 3-tier memory system:
  - Working Memory (active context buffer)
  - Episodic Vector Recall (Qdrant semantic embeddings with cosine similarity $\ge 0.87$)
  - Semantic Knowledge Graph (subject-predicate-object triples with confidence scores)
- **`hermesRouterLogs`**: LLM arbitration logs showing model routing decisions based on complexity, latency, and cost trade-offs.
- **`hermesQuorumSessions`**: BFT quorum consensus logs with vote records and cryptographically signed consensus hash proofs.

### 3. Projects Collection (`src/data/projects.ts`, `src/types/project.ts`)
Features 6 projects across Live, Antigravity Labs, and Open Source categories:
1. **Gas Agency Management System (GAMS)** (C, File I/O, Data Structures)
2. **Smart Task System** (JavaScript, Reactive DOM)
3. **Naveen Bishnoi Portfolio** (Astro, React 19, Framer Motion, Tailwind)
4. **AEONIS OPS** (Python, Multi-Agent Architecture, DevOps)
5. **Ultron Framework** (Python, LangChain, Task DAGs)
6. **Sentinel AI Security** (TypeScript, AST Analysis, SAIF)

---

## 7. Current vs. Target Design System Comparison

| Property | Current Codebase (`src/styles/design-system.css`) | Target Bright Apple Redesign (`apple_ui_inspiration.md`) |
|---|---|---|
| **Background Canvas** | Dark obsidian (`hsl(228, 18%, 7%)`) | Pure white (`#FFFFFF`) & ultra-light gray (`#F5F5F7`) |
| **Gradients** | Dark violet/indigo orbs on dark bg | Bright, highly saturated iOS 18 Siri mesh gradients (sky blue, vivid pink, violet) |
| **Primary Text** | Near-white (`hsl(220, 20%, 95%)`) | High-contrast pure black (`#1D1D1F`) & dark slate (`#424245`) |
| **Accent Color** | Electric Violet (`hsl(258, 90%, 66%)`) | Apple Signature Blue (`#0071E3`) & vivid violet/fuchsia accents |
| **Glassmorphism Materials** | Dark tinted glass (`hsla(228, 16%, 12%, 0.6)`) | Ultra-bright visionOS glass (`rgba(255, 255, 255, 0.45)` with `blur(40px) saturate(160%)`) |
| **Glass Specular Borders** | `hsla(220, 20%, 95%, 0.08)` | Top: `rgba(255, 255, 255, 0.75)`, Left: `rgba(255, 255, 255, 0.35)`, Bottom: `rgba(0, 0, 0, 0.05)` |
| **Card Drop Shadows** | `hsla(0, 0%, 0%, 0.35)` | Light, diffused ambient shadows `0 12px 36px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)` |
| **Imagery** | Text-heavy cards, minimal visual assets displayed | Prominent edge-to-edge images with `border-radius: 32px`, visual workflow diagrams |
| **Typography** | Inter / JetBrains Mono | San Francisco feel (`system-ui, -apple-system, BlinkMacSystemFont`), tight header tracking (`-0.03em`) |

---

## 8. Build, TypeScript, & Test Infrastructure

### Build Configuration (`astro.config.mjs`)
- Integration: `react()` with React 19 JSX runtime
- Output mode: `static`
- Minification: HTML compressed, CSS minified via Vite
- Static assets inline stylesheets: `auto`

### E2E Test Suite Matrix (`node tests/run-all.mjs`)
- **Tier 1 (4 suites)**: Build & Artifact Integrity, Spring Physics & Framer Motion Replacement, Workflows/Hermes/Projects Data Integrity, Semantic DOM & Sections.
- **Tier 2 (2 suites)**: Boundary & Corner Cases, Empirical Challenger (Data Safety & Edge Cases).
- **Tier 3 (1 suite)**: Cross-Feature Integration & Pairwise Contracts.
- **Tier 4 (3 suites)**: Real-World Workloads & Stress, M3 Empirical Physics & Stress, Lighthouse Performance/SEO/A11y Audit.

All 10 test suites pass completely and serve as a reliable regression harness during the bright redesign.

---

## 9. Key Action Items for the Bright Apple Redesign Team

1. **Design System & Token Modernization (`src/styles/design-system.css`)**:
   - Update `:root` variables to bright Apple color palette (`--color-bg-primary: #FFFFFF;`, `--color-bg-secondary: #F5F5F7;`, `--color-text-primary: #1D1D1F;`, `--color-accent: #0071E3;`).
   - Implement authentic visionOS glass tokens (`--glass-bg: rgba(255, 255, 255, 0.45);`, `--glass-blur: 40px;`, `--glass-border: 1px solid rgba(255, 255, 255, 0.6);`).
   - Update scrollbar, selection, and ambient lighting utilities.

2. **Base Layout & Background Mesh Gradients (`src/layouts/BaseLayout.astro`, `src/components/HeroSection.astro`)**:
   - Change `theme-color` meta to `#FFFFFF` and `color-scheme` to `light`.
   - Implement vibrant, colorful iOS 18 mesh background gradients behind glass panels.

3. **React Island Visual Overhaul**:
   - `HeaderNav.tsx`: Bright frosted glass pill dock, crisp high-contrast active tab indicator, iOS sheet menu with bright backdrop.
   - `HeroInteractiveCanvas.tsx`: Bright glass 3D card, Apple-blue CTAs, high-contrast code viewer with crisp light syntax highlighting.
   - `WorkflowVisualizer.tsx`: Bright glass DAG cards, vibrant step type badge colors, rich visual flow connectors.
   - `HermesTelemetryDashboard.tsx`: Bright glass telemetry cards, vivid live status indicators, crisp JSON inspector.
   - `ProjectsFilterGrid.tsx` & `FluidProjectCard.tsx`: Display large, high-res project imagery (`public/images/*`) prominently at top/edge of cards, bright tags, and clear typography.
   - `SkillsInteractiveMatrix.tsx`: Bright glass category selector, vivid spring proficiency bars.
   - `FluidContact.tsx`: Bright visionOS contact cards, crisp copy buttons, subtle ambient glow.

4. **Visual Verification Protocol**:
   - Use `reticle` MCP tool on running dev server (`npm run dev`) to visually audit contrast, alignments, image rendering, and glassmorphism.
   - Ensure all 10 E2E test suites remain 100% passing (`node tests/run-all.mjs`).
