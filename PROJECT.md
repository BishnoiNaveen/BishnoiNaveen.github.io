# Project: World-Class Cinematic 3D Portfolio Redesign (Naveen Bishnoi)

## Architecture
A high-performance, ultra-premium portfolio blending an immersive 3D AI world dive-in scroll experience with an executive, vibrant resume and portfolio showcase.

```
[User Scroll Action]
       │
       ▼
[Lenis Smooth Scroll (RAF)] ──► [GSAP ScrollTrigger Pinned Track (400vh)]
                                           │
       ┌───────────────────────────────────┴───────────────────────────────────┐
       ▼                                                                       ▼
[HTML5 Canvas 2D Scrubber]                                           [Cinematic HTML Overlays]
- 120 WebP frames (1920x1080) rendered via Blender 5.2.0             - Act 1: Cyber Space Void & Intro Hero
- Preloaded & cached ring-buffer                                     - Act 2: Quantum Core Dive-in HUD
- 60fps/120fps smooth interpolation                                  - Act 3: Singularity Breakthrough Flare
                                                                     - Act 4: Pull-out & Transition to Vibrant Resume
                                                                               │
                                                                               ▼
                                                             [Executive Portfolio Showcase]
                                                             - 3-Tier Experience (KRONE Edge IoT)
                                                             - 4-Domain Tech Stack & Systems Architecture
                                                             - Flagship Open Source Projects & Lab
                                                             - Interactive Contact & Terminal HUD
```

## Feature Inventory
| # | Feature | Description | Milestone | Status | Source |
|---|---------|-------------|-----------|--------|--------|
| F1 | Reference Research Documentation | Technical breakdown of 5 top-tier scroll-driven references (Apple, Lusion, Linear, Bruno Simon, Active Theory) and mechanics | M1 | DONE | Survey / R1 |
| F2 | Blender Python 3D Asset Generator | Headless `bpy` script creating procedural AI neural core, floating nodes, camera dive path, and WebP frame rendering | M2 | DONE | Survey / R3 |
| F3 | Automated 3D Frame & Model Rendering | Execute Blender script to render 120-150 high-res WebP frames and glTF 3D assets to `public/assets/3d-frames/` | M2 | DONE | Survey / R3 |
| F4 | Cinematic Canvas Scroll-Jacking Engine | React component with HTML5 Canvas, frame preloader, ring-buffer caching, and GSAP ScrollTrigger timeline | M3 | DONE | Survey / R2 |
| F5 | Quantum Dive & Breakthrough Flare Overlays | Synchronized typography, holographic HUD counters, neural scan labels, and radial light flare transition | M3 | DONE | Survey / R2 |
| F6 | Seamless Dark-to-Vibrant Resume Transition | Smooth optical transition from deep cyber void (`#030712`) into vibrant, bright, high-contrast executive portfolio | M4 | DONE | Survey / R2 |
| F7 | Modernized Executive Resume & Portfolio UI | Ultra-premium sections: KRONE IoT Edge Experience, Systems Architecture Skills, Projects, Interactive Lab | M4 | DONE | Survey / Codebase |
| F8 | Automated Test Suite & Acceptance Checks | Test harness verifying documentation, Blender execution, scroll components, and clean `npm run build` | M5 | DONE | Survey / AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Reference Research & Mechanics Breakdown | Author authoritative research documentation in `docs/research_scroll_mechanics.md` | none | DONE |
| M2 | Blender 3D Asset Generation Pipeline | Implement and execute `scripts/generate_3d_assets.py` using Blender 5.2.0 CLI to generate WebP frames and 3D glTF | none | DONE |
| M3 | Cinematic 3D Scroll Engine & Overlays | Build `src/components/Cinematic/ScrollCanvas.tsx`, `HeroCinematic.tsx`, Lenis + GSAP ScrollTrigger integration | M2 | DONE |
| M4 | Ultra-Premium Vibrant Resume & Portfolio UI | Modernize `src/pages/index.astro`, resume components, bright vibrant color theme, navigation, and live metrics | M3 | DONE |
| M5 | E2E Testing & Acceptance Gate Verification | Comprehensive automated test suite, verification runner, `npm run build` and forensic integrity audit | M4 | DONE |

## Acceptance Criteria Matrix
- [x] **Criterion 1 (R1)**: A research document is created listing at least 3 high-end reference URLs with a breakdown of their scroll mechanics (`docs/research_scroll_mechanics.md` covers 5 references: Apple AirPods/iPhone 16 Pro, Lusion, Linear, Bruno Simon, Active Theory).
- [x] **Criterion 2 (R3)**: Blender Python scripts are created, tested, and successfully executed to generate 3D assets/video sequences without errors (`scripts/generate_3d_assets.py` executed via Blender 5.2.0, generating 120 WebP frames in `public/assets/3d-frames/` and Draco glTF `public/assets/3d/neural_core.glb`).
- [x] **Criterion 3 (R2)**: The landing page implements a scroll-linked animation library (GSAP ScrollTrigger + Lenis) mapping scroll position to 3D asset playback with 4-act dive-in and transition to vibrant resume (`src/components/Cinematic/ScrollCanvas.tsx`, `CinematicOverlay.tsx`, `CinematicSection.tsx`, `src/pages/index.astro`).
- [x] **Criterion 4 (AC4)**: Final portfolio code builds successfully (`npm run build`) without errors (verified: 6 static pages generated in 4.68s, exit code 0; 18 test suites passing with 584,344 assertions).

## Code Layout
- `docs/research_scroll_mechanics.md` — Authoritative research documentation
- `scripts/generate_3d_assets.py` — Blender 5.2.0 Python generation & rendering script
- `public/assets/3d-frames/` — 120 Rendered WebP frames for the scroll-jacking canvas
- `public/assets/3d/neural_core.glb` — glTF 3D model asset with Draco mesh compression
- `src/components/Cinematic/`
  - `ScrollCanvas.tsx` — High-performance 2D Canvas frame scrubber with preloader and ring buffer
  - `CinematicOverlay.tsx` — Floating HUD text, telemetry stats, and optical light flare overlay
  - `CinematicSection.tsx` & `CinematicHero.astro` — Astro/React container wrapping Lenis, GSAP, and Canvas
- `src/pages/index.astro` — Main entry point integrating Cinematic Hero into Vibrant Executive Portfolio
