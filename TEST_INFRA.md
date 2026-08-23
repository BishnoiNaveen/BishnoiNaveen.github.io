# E2E Test Infra: Naveen Bishnoi Portfolio Redesign

## Test Philosophy
- Opaque-box, requirement-driven. Tests verify external observable properties and contract adherence.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing across Tiers 1-4.
- Zero dependency on internal implementation shortcuts (no mock cheating, genuine data and component verification).

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | Astro & TypeScript Build Integrity | ORIGINAL_REQUEST §Acceptance Criteria | 5 | 5 | ✓ | ✓ |
| 2 | Spring Physics & Framer Motion Replacement | ORIGINAL_REQUEST §R1, Agent-as-Judge | 5 | 5 | ✓ | ✓ |
| 3 | Translucent Materials & Glassmorphism | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 4 | Workflows Local Data Architecture | ORIGINAL_REQUEST §R2, Agent-as-Judge | 5 | 5 | ✓ | ✓ |
| 5 | Hermes Telemetry & Agent Data Layer | ORIGINAL_REQUEST §R2, Agent-as-Judge | 5 | 5 | ✓ | ✓ |
| 6 | Fluid Navigation Dock & Pill Indicator | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 7 | Fluid Hero 3D Perspective & Magnetic UI | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 8 | Interactive Workflows Visualizer & DAG | ORIGINAL_REQUEST §R1, §R2 | 5 | 5 | ✓ | ✓ |
| 9 | Hermes Telemetry Dashboard & Memory Inspector | ORIGINAL_REQUEST §R1, §R2 | 5 | 5 | ✓ | ✓ |
| 10 | Projects Filter Grid & Shared Layout Expansion | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 11 | Skills Interactive Matrix & Gauges | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 12 | Fluid Contact Section & Social Links | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 13 | Responsive Layout & Reduced Motion | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 14 | Lighthouse Performance Score (>=90) | ORIGINAL_REQUEST §Acceptance Criteria | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node.js automated test runner scripts in `tests/`
  - `tests/e2e/build-verification.test.mjs`: Executes `npm run build` and asserts 0 exit code, output artifact existence in `dist/`.
  - `tests/e2e/spring-physics-audit.test.mjs`: Audits codebase for Framer Motion spring presets, explicit damping/stiffness, absence of static CSS transitions on interactive elements.
  - `tests/e2e/data-integrity.test.mjs`: Validates all local Workflows and Hermes data records against type schemas.
  - `tests/e2e/dom-and-sections.test.mjs`: Inspects built static HTML and island mounts for Workflows, Hermes, Projects, Skills, Contact sections.
  - `tests/e2e/lighthouse-audit.test.mjs`: Tests performance, a11y, best practices, and SEO benchmarks.
- **Unified Test Command**: `npm run test:e2e` (or `node tests/run-all.mjs`)

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total ≥ 70 test assertions)
- Tier 2: Boundary & Corner Cases (empty data, invalid filters, reduced motion, window resize) (Total ≥ 70 test assertions)
- Tier 3: Cross-Feature Combinations (Nav + Section Scroll, Filter + Modal Expand, Workflow Step Drawer + Theme)
- Tier 4: Real-World User Workloads (Complete portfolio exploration journey, fast interactive switching, Lighthouse >= 90)
