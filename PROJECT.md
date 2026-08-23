# Project: Naveen Bishnoi Portfolio Redesign (Apple Fluid UI & Hermes Data)

## Architecture
- **Framework**: Astro v7 with Island Architecture (`astro:island`)
- **Interactive UI Engine**: React 19 + Framer Motion (WWDC 2018 spring physics: explicit mass, stiffness, damping, restDelta)
- **Styling**: Translucent Glassmorphism Design System (Levels 1-3 vibrancy, specular hairline borders, backdrop blur, ambient depth)
- **Data Layer**: Strongly-typed local TypeScript & Content Collections (`src/data/workflows.ts`, `src/data/hermes.ts`, `src/types/`)
- **Hydration Strategy**:
  - Zero-JS static HTML baseline (`.astro` layout and shells)
  - `client:load` for Header navigation dock and Hero interactive elements
  - `client:visible` for Workflows visualizer, Hermes telemetry, Projects grid, Skills matrix
  - `client:idle` for subtle magnetic cursor follower
- **Target Performance**: Lighthouse Score >= 90 (target 95-100), clean `npm run build` with zero TypeScript/Astro errors

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | React & Framer Motion Toolchain Setup | Install `@astrojs/react`, `react`, `react-dom`, `framer-motion`, configure `astro.config.mjs` and `tsconfig.json` | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Spring Physics Presets Library | Mathematical spring matrix in `src/lib/springs.ts` with explicit mass, stiffness, damping, restDelta for 7 interaction types | M1 | ORIGINAL_REQUEST §R1, Agent-as-Judge |
| 3 | 4-Tier Translucent Material Tokens | Optical vibrancy, frosted glass (16px/24px/32px blur), specular border highlights in `src/styles/design-system.css` | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Workflows Data Architecture & Schemas | Strongly-typed TypeScript data in `src/data/workflows.ts` covering 5 enterprise domains (KRONE IoT, AEONIS OPS, Ultron, Medallion Stream, GAMS) | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Hermes Telemetry & Agent Data Models | Detailed multi-agent data in `src/data/hermes.ts` (Agent Telemetry, Task DAGs, 3-tier Memory, Dynamic LLM Router Logs, Quorum Consensus) | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Fluid Nav Pill & Dynamic Floating Dock | React Island with shared `layoutId` gliding spring indicator, active scroll spy, and fluid mobile sheet | M3 | ORIGINAL_REQUEST §R1 |
| 7 | Fluid Hero Interactive Canvas | 3D perspective code card with spring tilt, magnetic buttons, live status indicators | M3 | ORIGINAL_REQUEST §R1 |
| 8 | Interactive Workflows Visualizer Island | Interactive multi-step DAG/pipeline node visualizer with animated SVG flow lines, step inspection drawer, code snippet viewer | M3 | ORIGINAL_REQUEST §R1, §R2 |
| 9 | Hermes Telemetry & Memory Dashboard Island | Live simulated agent telemetry stream, token/cost/latency gauges, 3-tier memory inspector (Working, Vector Recall, Knowledge Graph), router matrix, JSON tree viewer | M3 | ORIGINAL_REQUEST §R1, §R2 |
| 10 | Fluid Projects Filter Deck & Expanding Modal | Card grid with category filter FLIP layout animations, hover buoyancy, and shared `layoutId` card-to-modal expansion | M3 | ORIGINAL_REQUEST §R1 |
| 11 | Interactive Skills Radar & Spring Matrix | Category-switchable skill matrix with spring-animated proficiency gauges | M3 | ORIGINAL_REQUEST §R1 |
| 12 | Fluid Contact & Philosophy Section | Translucent spring-animated contact cards and interactive philosophy highlights | M3 | ORIGINAL_REQUEST §R1 |
| 13 | Page Assembly & Full Island Orchestration | Integrate all React islands into `index.astro` and `.astro` section shells, eliminate legacy CSS transition conflicts | M4 | ORIGINAL_REQUEST §R1, §R2 |
| 14 | Responsive Layout & Reduced Motion Support | Mobile responsiveness, WCAG 2.2 AA accessibility, `prefers-reduced-motion` instantaneous fallbacks | M4 | ORIGINAL_REQUEST §R3 |
| 15 | E2E Testing Suite (Tiers 1-4) | Opaque-box requirement verification suite testing build, spring physics, local data loading, navigation, and DOM structure | E2E Track | ORIGINAL_REQUEST §Acceptance Criteria |
| 16 | Final Integration, Build & Lighthouse Polish | 100% E2E test pass, forensic integrity audit clean, Lighthouse performance >= 90 verification | M_Final | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Test harness, test runners, Tiers 1-4 test cases, `TEST_READY.md` publication | None | DONE |
| 1 | M1: Foundation & Design System | Dependencies, Astro/React/TS config, `src/lib/springs.ts`, translucent materials in `design-system.css`, placeholder assets | None | DONE |
| 2 | M2: Workflows & Hermes Data Layer | `src/types/workflow.ts`, `src/types/hermes.ts`, `src/data/workflows.ts`, `src/data/hermes.ts` | None | DONE |
| 3 | M3: Fluid React Islands & Visualizers | `HeaderNav.tsx`, `HeroInteractiveCanvas.tsx`, `WorkflowVisualizer.tsx`, `HermesTelemetryDashboard.tsx`, `ProjectsFilterGrid.tsx`, `SkillsInteractiveMatrix.tsx`, `FluidContact.tsx` | M1, M2 | DONE |
| 4 | M4: Page Assembly & Layout Integration | `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, section wrapper components, CSS transition replacement, a11y & responsive polish | M3 | DONE |
| Final | M_Final: E2E Verification & Lighthouse Polish | Run full test suite, fix any regressions, execute Forensic Integrity Audit, verify Lighthouse score >= 90 | E2E, M4 | DONE |

## Interface Contracts

### `src/lib/springs.ts` ↔ React Island Components
```typescript
import type { Transition } from 'framer-motion';

export interface SpringPresets {
  snappy: Transition;    // { type: 'spring', mass: 0.6, stiffness: 450, damping: 24, restDelta: 0.001 }
  glide: Transition;     // { type: 'spring', mass: 0.8, stiffness: 380, damping: 28, restDelta: 0.001 }
  buoyant: Transition;   // { type: 'spring', mass: 1.0, stiffness: 300, damping: 24, restDelta: 0.001 }
  morph: Transition;     // { type: 'spring', mass: 1.1, stiffness: 280, damping: 26, restDelta: 0.001 }
  cinematic: Transition; // { type: 'spring', mass: 1.2, stiffness: 220, damping: 26, restDelta: 0.001 }
  sheet: Transition;     // { type: 'spring', mass: 1.0, stiffness: 320, damping: 32, restDelta: 0.001 }
  magnetic: Transition;  // { type: 'spring', mass: 0.5, stiffness: 260, damping: 20, restDelta: 0.001 }
}
```

### `src/data/workflows.ts` ↔ `<WorkflowVisualizer />`
```typescript
import type { Workflow, WorkflowStep } from '../types/workflow';
export const workflowsData: Workflow[];
```

### `src/data/hermes.ts` ↔ `<HermesTelemetryDashboard />`
```typescript
import type { 
  AgentTelemetryRecord, 
  HermesTaskGraph, 
  HermesMemorySystem, 
  RouterDecision,
  QuorumSession 
} from '../types/hermes';

export const hermesTelemetryRecords: AgentTelemetryRecord[];
export const hermesTaskGraph: HermesTaskGraph;
export const hermesMemorySystem: HermesMemorySystem;
export const hermesRouterLogs: RouterDecision[];
export const hermesQuorumSessions: QuorumSession[];
```

## Code Layout
```text
src/
├── components/
│   ├── AboutSection.astro
│   ├── ContactSection.astro
│   ├── FluidContact.tsx
│   ├── FluidProjectCard.tsx
│   ├── Footer.astro
│   ├── Header.astro
│   ├── HeaderNav.tsx
│   ├── HermesSection.astro
│   ├── HermesTelemetryDashboard.tsx
│   ├── HeroInteractiveCanvas.tsx
│   ├── HeroSection.astro
│   ├── JsonGraphInspector.tsx
│   ├── MagneticCursorTracker.tsx
│   ├── ProjectsFilterGrid.tsx
│   ├── ProjectsSection.astro
│   ├── SkillsInteractiveMatrix.tsx
│   ├── SkillsSection.astro
│   ├── WorkflowsSection.astro
│   └── WorkflowVisualizer.tsx
├── data/
│   ├── hermes.ts
│   ├── projects.ts
│   └── workflows.ts
├── hooks/
│   └── useMagnetic.ts
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   └── springs.ts
├── pages/
│   └── index.astro
├── styles/
│   └── design-system.css
└── types/
    ├── hermes.ts
    ├── project.ts
    └── workflow.ts
```
