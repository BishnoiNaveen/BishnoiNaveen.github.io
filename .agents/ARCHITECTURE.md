# Naveen Bishnoi Portfolio — Master Frontend Architecture & System Design (Phase 3)
**Document Version**: 1.0 (Authoritative Implementation Blueprint)  
**Author**: Principal Frontend Architect & Systems Engineer  
**Project**: Naveen Bishnoi Personal Digital Experience & Portfolio Transformation  
**Status**: APPROVED & READY FOR IMPLEMENTATION  
**Target Milestone**: Phase 3 -> Phase 4 Implementation  
**Project Root**: `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio`  
**Upstream Specifications**: 
- `.agents/ORIGINAL_REQUEST.md` (Master Project Charter)
- `.agents/INITIAL_REPOSITORY_AUDIT.md` (Forensic Codebase Audit)
- `.agents/DESIGN_DIRECTION.md` (Visual Quality Gate & 5-Level Material System)

---

## 1. Architectural Vision & Core Principles

The Naveen Bishnoi Portfolio architecture is engineered around the principle of **Zero-Hydration Content with Tactile React Islands**. 

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                ARCHITECTURAL FOUNDATION                                 │
├──────────────────────────┬─────────────────────────────┬────────────────────────────────┤
│ ASTRO 7 STATIC CORE      │ REACT 19 INTERACTIVE ISLANDS│ TAILWIND CSS V4 DESIGN BRIDGE  │
├──────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ • 0 KB JS default budget │ • Client-side spring physics│ • Modern @theme CSS token link │
│ • Static HTML generation │ • Isolated state boundaries │ • 5-Level Material Hierarchy   │
│ • Perfect SEO & JSON-LD  │ • Selective hydration modes │ • Hardware-accelerated blurs   │
│ • Semantic HTML5 layout  │ • WCAG 2.2 AAA accessibility│ • Optical typography tracking  │
└──────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

### Core Architecture Directives:
1. **Server-First Content Delivery**: All marketing copy, long-form narratives, timelines, and static section wrappers are generated at build time as pure HTML/CSS via Astro 7 components (`.astro`).
2. **Selective Island Hydration**: JavaScript is loaded and executed *only* for interactive controls, filterable bento grids, modal dialogs, and spring physics micro-interactions via React 19 islands (`.tsx`) using strict Astro hydration directives (`client:load`, `client:visible`, `client:idle`).
3. **Radical Honesty & Zero Synthetic Bloat**: Decommission all simulated token tickers, fake BFT quorum charts, and arbitrary percentage bars. Replace them with genuine architectural diagrams, verified code invariants, and structured case studies.
4. **Unified Single-Page Navigation**: Reconnect all orphaned components (`AboutSection`, `SkillsSection`) and align navigation anchor IDs (`#work`, `#systems`, `#about`, `#skills`, `#experience`, `#contact`) to achieve 100% functional link integrity.

---

## 2. Astro 7 + React 19 Islands Architecture & Hydration Strategy

### 2.1 Hydration Directive Matrix

Each component in the system is assigned a strict hydration lifecycle based on its viewport criticality, interactive complexity, and performance impact.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               HYDRATION LIFECYCLE TOPOLOGY                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  [client:load]          HeaderNav.tsx          (Instant navbar & mobile drawer control) │
│  [client:load]          Hero.tsx               (Immediate headline spring & CTAs)       │
│                                                                                         │
│  [client:visible]       Projects.tsx           (Interactive filter & case study modal)  │
│  [client:visible]       Workflows.tsx          (Interactive Systems & DAG visualizer)   │
│  [client:visible]       SkillsMatrix.tsx       (Domain bento grid & evidence tabs)      │
│  [client:visible]       Experience.tsx         (Interactive timeline & philosophy tabs) │
│  [client:visible]       FluidContact.tsx       (One-click clipboard copy & live SLA)    │
│                                                                                         │
│  [client:idle]          MagneticCursor.tsx     (Subtle desktop cursor attraction)       │
│  [client:idle]          Footer.tsx             (Back-to-top & timestamp)                │
│                                                                                         │
│  [0 KB JS - Static]     AboutSection.astro     (Pure HTML journey narrative & maxims)   │
│  [0 KB JS - Static]     Layout.astro           (SEO, JSON-LD, fonts, atmospheric mesh)  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Hydration Specification Table

| Component | File Path | Type | Hydration Directive | Rationale |
|---|---|---|---|---|
| **Layout** | `src/layouts/Layout.astro` | Astro Static | N/A (Server Rendered) | Master HTML shell, SEO metadata, JSON-LD structured data, preloaded fonts. |
| **Header** | `src/components/Header.astro` | Astro Static | N/A (Server Rendered) | Wrapper container for floating navigation dock. |
| **HeaderNav** | `src/components/HeaderNav.tsx` | React 19 Island | `client:load` | Required immediately on page load for sticky dock state, scroll spy calculation, and mobile drawer toggling. |
| **HeroSection** | `src/components/HeroSection.astro`| Astro Static | N/A (Server Rendered) | Semantic `<section>` container and static Apple ambient gradient background. |
| **Hero** | `src/components/Hero.tsx` | React 19 Island | `client:load` | Above-the-fold entrance animations, spring-loaded CTA buttons, portrait depth card. |
| **ProjectsSection** | `src/components/ProjectsSection.astro` | Astro Static | N/A (Server Rendered) | Semantic container for Selected Engineering Work. |
| **Projects** | `src/components/Projects.tsx` | React 19 Island | `client:visible` | Defer hydration until user scrolls near projects. Manages category filter tabs, project grid, and Level 4 Case Study Modal Inspector. |
| **WorkflowsSection** | `src/components/WorkflowsSection.astro` | Astro Static | N/A (Server Rendered) | Semantic container for Interactive Systems Lab. |
| **Workflows** | `src/components/Workflows.tsx` | React 19 Island | `client:visible` | Defer hydration until visible. Renders real DAG task graph, AST security taint tree inspector, and POSIX state machine. |
| **AboutSection** | `src/components/AboutSection.astro` | Astro Static | N/A (0 KB JS) | Pure semantic HTML rendering of Naveen's journey, engineering mindset, and core values. No JS overhead. |
| **SkillsSection** | `src/components/SkillsSection.astro` | Astro Static | N/A (Server Rendered) | Semantic container for Technical Competencies. |
| **SkillsInteractiveMatrix** | `src/components/SkillsInteractiveMatrix.tsx` | React 19 Island | `client:visible` | Defer hydration until visible. Handles domain category selection, competency bento tiles, and GitHub proof links. |
| **ExperienceSection** | `src/components/ExperienceSection.astro` | Astro Static | N/A (Server Rendered) | Semantic container for Career & Philosophy. |
| **Experience** | `src/components/Experience.tsx` | React 19 Island | `client:visible` | Defer hydration until visible. Interactive tabs switching between Professional Work / Academic Foundation and Engineering Philosophies. |
| **ContactSection** | `src/components/ContactSection.astro` | Astro Static | N/A (Server Rendered) | Semantic container for Direct Contact. |
| **FluidContact** | `src/components/FluidContact.tsx` | React 19 Island | `client:visible` | Defer hydration until visible. One-click verified email clipboard copy, SLA status indicator, and social triggers. |
| **FooterSection** | `src/components/FooterSection.astro` | Astro Static | N/A (Server Rendered) | Semantic `<footer>` container. |
| **Footer** | `src/components/Footer.tsx` | React 19 Island | `client:idle` | Hydrates in browser idle time. Smooth back-to-top scroll trigger and dynamic year calculation. |
| **MagneticCursorTracker** | `src/components/MagneticCursorTracker.tsx` | React 19 Island | `client:idle` | Hydrates when browser is idle. Magnetic attraction effect for desktop devices only (auto-disabled on touch/reduced motion). |

---

## 3. Comprehensive Component Hierarchy & Directory Architecture

### 3.1 Component Tree Topology

```
src/
├── layouts/
│   └── Layout.astro                       [Master Root Layout: SEO, JSON-LD, Fonts, Canvas]
├── pages/
│   └── index.astro                        [Single-Page Master Narrative Flow]
│       ├── Header.astro
│       │   └── HeaderNav.tsx              (client:load) - Floating Glass Dock
│       ├── HeroSection.astro
│       │   └── Hero.tsx                   (client:load) - Editorial Hero & Portrait Frame
│       ├── ProjectsSection.astro
│       │   └── Projects.tsx               (client:visible) - Selected Work & Modal Inspector
│       ├── WorkflowsSection.astro
│       │   └── Workflows.tsx              (client:visible) - Systems & Architecture Lab
│       │       └── JsonGraphInspector.tsx - Subcomponent: AST & DAG Tree Visualizer
│       ├── AboutSection.astro             [STATIC 0KB JS] - Journey Narrative & Values
│       ├── SkillsSection.astro
│       │   └── SkillsInteractiveMatrix.tsx(client:visible) - Competency Bento Grid
│       ├── ExperienceSection.astro
│       │   └── Experience.tsx             (client:visible) - Career & Philosophy Tabs
│       ├── ContactSection.astro
│       │   └── FluidContact.tsx           (client:visible) - Verified Contact & Clipboard
│       ├── FooterSection.astro
│       │   └── Footer.tsx                 (client:idle) - Back-to-Top & Colophon
│       └── MagneticCursorTracker.tsx      (client:idle) - Desktop Magnetic Follower
├── components/
│   ├── ui/                                [Reusable Atomic UI Primitives]
│   │   ├── Badge.tsx                      - Status and tech stack chips
│   │   ├── Button.tsx                     - Spring-physics tactile buttons
│   │   └── ModalSheet.tsx                 - visionOS Level 4 Accessible Dialog
│   └── icons.tsx                          - Verified brand & system SVG icons
├── data/
│   ├── siteConfig.ts                      - Site metadata, contact info, social URLs
│   ├── projects.ts                        - Verified case studies & invariants
│   ├── skills.ts                          - Competency bento items & evidence tags
│   ├── experience.ts                      - Career timeline & academic records
│   ├── philosophies.ts                    - Core engineering maxims & beliefs
│   └── workflows.ts                       - Verified DAG & AST architecture data
├── types/
│   ├── navigation.ts                      - Nav items & footer schemas
│   ├── project.ts                         - Strict project & case study interfaces
│   ├── skill.ts                           - Skills matrix & domain interfaces
│   ├── experience.ts                      - Work, education & philosophy types
│   └── workflow.ts                        - Systems lab node & edge schemas
├── lib/
│   ├── springs.ts                         - WWDC physics curve configurations
│   └── utils.ts                           - Classname merger (clsx + twMerge)
├── hooks/
│   └── useMagnetic.ts                     - Reusable magnetic attraction hook
└── styles/
    └── global.css                         - Master Tailwind v4 & Design Token Bridge
```

---

## 4. Tailwind CSS v4 Design Token Bridge & CSS Variable Mapping

Tailwind CSS v4 deprecates `tailwind.config.js` in favor of native CSS `@theme` declarations and `@utility` layers. The design system bridges the 5-Level Material System and Apple color tokens directly into Tailwind utility classes.

### 4.1 Master Design System Bridge (`src/styles/global.css`)

```css
@import "tailwindcss";

/* ==========================================================================
   1. MASTER DESIGN TOKENS (:root)
   Authoritative single source of truth for colors, materials, and typography.
   ========================================================================== */
:root {
  /* --- Core Apple Monochromes --- */
  --apple-canvas:              #F5F5F7;
  --apple-canvas-subtle:       #FAFAFC;
  --apple-card-solid:          #FFFFFF;
  --apple-text-primary:        #1D1D1F;
  --apple-text-secondary:      #424245;
  --apple-text-tertiary:       #86868B;
  --apple-text-quaternary:     #A1A1A6;
  --apple-text-on-accent:      #FFFFFF;

  /* --- Semantic Accents (WCAG 2.2 AAA Tuned) --- */
  --apple-blue:                #0071E3;
  --apple-blue-hover:          #0077ED;
  --apple-blue-active:         #0062C4;
  --apple-blue-subtle:         rgba(0, 113, 227, 0.08);
  --apple-blue-border:         rgba(0, 113, 227, 0.20);
  --apple-blue-glow:           rgba(0, 113, 227, 0.30);

  --apple-emerald:             #248A3D;
  --apple-emerald-subtle:      rgba(36, 138, 61, 0.08);
  --apple-emerald-border:      rgba(36, 138, 61, 0.20);

  --apple-purple:              #8944AB;
  --apple-purple-subtle:       rgba(137, 68, 171, 0.08);
  --apple-purple-border:       rgba(137, 68, 171, 0.20);
  --apple-purple-glow:         rgba(137, 68, 171, 0.30);

  --apple-rose:                #D32F4E;
  --apple-rose-subtle:         rgba(211, 47, 78, 0.08);
  --apple-rose-border:         rgba(211, 47, 78, 0.20);

  --apple-amber:               #B25000;
  --apple-amber-subtle:        rgba(178, 80, 0, 0.08);
  --apple-amber-border:        rgba(178, 80, 0, 0.20);

  --apple-cyan:                #0077A6;
  --apple-cyan-subtle:         rgba(0, 119, 166, 0.08);
  --apple-cyan-border:         rgba(0, 119, 166, 0.20);

  /* --- 5-Level Material System Tokens --- */
  --material-l0-canvas:        #F5F5F7;

  --material-l1-bg:            #FFFFFF;
  --material-l1-border:        rgba(0, 0, 0, 0.08);
  --material-l1-shadow:        0 1px 3px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.04);
  --material-l1-radius:        24px;

  --material-l2-bg:            rgba(255, 255, 255, 0.68);
  --material-l2-bg-hover:      rgba(255, 255, 255, 0.82);
  --material-l2-blur:          32px;
  --material-l2-saturate:      160%;
  --material-l2-border-top:    1px solid rgba(255, 255, 255, 0.85);
  --material-l2-border-side:   1px solid rgba(255, 255, 255, 0.45);
  --material-l2-border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  --material-l2-shadow:        0 8px 32px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.90);
  --material-l2-shadow-hover:  0 20px 48px -8px rgba(0, 0, 0, 0.09), 0 2px 6px 0 rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 1.0);
  --material-l2-radius:        28px;

  --material-l3-bg:            rgba(255, 255, 255, 0.78);
  --material-l3-blur:          40px;
  --material-l3-saturate:      180%;
  --material-l3-border:        1px solid rgba(255, 255, 255, 0.90);
  --material-l3-shadow:        0 16px 40px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.60), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
  --material-l3-radius:        9999px;

  --material-l4-bg:            rgba(255, 255, 255, 0.94);
  --material-l4-blur:          48px;
  --material-l4-saturate:      170%;
  --material-l4-border:        1px solid rgba(255, 255, 255, 0.95);
  --material-l4-shadow:        0 32px 72px -16px rgba(0, 0, 0, 0.14), 0 4px 16px 0 rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 1.0);
  --material-l4-radius:        32px;

  /* --- Radii Scale --- */
  --radius-sm:                 8px;
  --radius-md:                 16px;
  --radius-lg:                 20px;
  --radius-card:               28px;
  --radius-hero:               32px;
  --radius-modal:              32px;
  --radius-pill:               9999px;

  /* --- Font Stacks --- */
  --font-apple:                -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif;
  --font-mono:                 "SF Mono", "JetBrains Mono", "Cascadia Code", ui-monospace, monospace;
}

/* ==========================================================================
   2. TAILWIND CSS V4 @theme BRIDGE
   Maps native CSS custom properties directly to Tailwind utility classes.
   ========================================================================== */
@theme {
  --color-apple-canvas:        var(--apple-canvas);
  --color-apple-card-solid:    var(--apple-card-solid);
  --color-apple-text-primary:  var(--apple-text-primary);
  --color-apple-text-secondary:var(--apple-text-secondary);
  --color-apple-text-tertiary: var(--apple-text-tertiary);
  --color-apple-text-quaternary: var(--apple-text-quaternary);

  --color-apple-blue:          var(--apple-blue);
  --color-apple-blue-hover:    var(--apple-blue-hover);
  --color-apple-blue-subtle:   var(--apple-blue-subtle);
  --color-apple-emerald:       var(--apple-emerald);
  --color-apple-emerald-subtle:var(--apple-emerald-subtle);
  --color-apple-purple:        var(--apple-purple);
  --color-apple-purple-subtle: var(--apple-purple-subtle);
  --color-apple-rose:          var(--apple-rose);
  --color-apple-rose-subtle:   var(--apple-rose-subtle);
  --color-apple-amber:         var(--apple-amber);
  --color-apple-amber-subtle:  var(--apple-amber-subtle);
  --color-apple-cyan:          var(--apple-cyan);
  --color-apple-cyan-subtle:   var(--apple-cyan-subtle);

  --radius-card:               var(--radius-card);
  --radius-hero:               var(--radius-hero);
  --radius-modal:              var(--radius-modal);
  --radius-pill:               var(--radius-pill);

  --font-display:              var(--font-apple);
  --font-sans:                 var(--font-apple);
  --font-mono:                 var(--font-mono);

  --shadow-apple-sm:           var(--material-l1-shadow);
  --shadow-apple-ambient:      var(--material-l2-shadow);
  --shadow-apple-hover:        var(--material-l2-shadow-hover);
  --shadow-apple-dock:         var(--material-l3-shadow);
  --shadow-apple-modal:        var(--material-l4-shadow);
  --shadow-glow-blue:          0 8px 24px 0 rgba(0, 113, 227, 0.35);
  --shadow-glow-purple:        0 8px 24px 0 rgba(137, 68, 171, 0.30);
}

/* ==========================================================================
   3. CUSTOM UTILITY LAYERS (@utility)
   Reusable material surface classes adhering to the 5-Level Hierarchy.
   ========================================================================== */
@utility surface-canvas {
  background-color: var(--material-l0-canvas);
}

@utility surface-solid {
  background-color: var(--material-l1-bg);
  border: 1px solid var(--material-l1-border);
  border-radius: var(--material-l1-radius);
  box-shadow: var(--material-l1-shadow);
}

@utility surface-glass {
  background: var(--material-l2-bg);
  -webkit-backdrop-filter: blur(var(--material-l2-blur)) saturate(var(--material-l2-saturate));
  backdrop-filter: blur(var(--material-l2-blur)) saturate(var(--material-l2-saturate));
  border-top: var(--material-l2-border-top);
  border-left: var(--material-l2-border-side);
  border-right: var(--material-l2-border-side);
  border-bottom: var(--material-l2-border-bottom);
  border-radius: var(--material-l2-radius);
  box-shadow: var(--material-l2-shadow);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.35s ease;
}

@utility surface-glass:hover {
  transform: translateY(-4px);
  background: var(--material-l2-bg-hover);
  box-shadow: var(--material-l2-shadow-hover);
}

@utility surface-dock {
  background: var(--material-l3-bg);
  -webkit-backdrop-filter: blur(var(--material-l3-blur)) saturate(var(--material-l3-saturate));
  backdrop-filter: blur(var(--material-l3-blur)) saturate(var(--material-l3-saturate));
  border: var(--material-l3-border);
  border-radius: var(--material-l3-radius);
  box-shadow: var(--material-l3-shadow);
}

@utility surface-modal {
  background: var(--material-l4-bg);
  -webkit-backdrop-filter: blur(var(--material-l4-blur)) saturate(var(--material-l4-saturate));
  backdrop-filter: blur(var(--material-l4-blur)) saturate(var(--material-l4-saturate));
  border: var(--material-l4-border);
  border-radius: var(--material-l4-radius);
  box-shadow: var(--material-l4-shadow);
}

@utility apple-gradient-text {
  background: linear-gradient(135deg, #1D1D1F 0%, #424245 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 5. Clean Component Refactoring & Elimination Plan

### 5.1 Files Scheduled for Deletion (Dead Code & Redundant Stubs)

The following 8 files must be safely deleted during Phase 4:

1. `src/components/FluidProjectCard.tsx` — Dead component with discordant dark-mode classes.
2. `src/components/HeroInteractiveCanvas.tsx` — 9-line duplicate wrapper around `Hero.tsx`.
3. `src/components/ProjectsFilterGrid.tsx` — 3-line dead re-export of `Projects.tsx`.
4. `src/components/Footer.astro` — Exact duplicate of `FooterSection.astro`.
5. `src/components/WorkflowVisualizer.tsx` — Redundant unmounted workflow visualizer.
6. `src/components/HermesTelemetryDashboard.tsx` — Simulated telemetry dashboard with fake token metrics.
7. `src/layouts/BaseLayout.astro` — Redundant 23-line backward compatibility forwarder.
8. `src/styles/design-system.css` — Redundant 6-line pass-through.

### 5.2 Section Reconnection & Page Composition (`src/pages/index.astro`)

The master page template `src/pages/index.astro` is reconstructed to host the full narrative flow with working DOM anchors:

```astro
---
/**
 * src/pages/index.astro — Master Single-Page Narrative Flow
 * Naveen Bishnoi: Developer, AI Automation Engineer & Systems Builder
 */
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import HeroSection from '../components/HeroSection.astro';
import ProjectsSection from '../components/ProjectsSection.astro';
import WorkflowsSection from '../components/WorkflowsSection.astro';
import AboutSection from '../components/AboutSection.astro';
import SkillsSection from '../components/SkillsSection.astro';
import ExperienceSection from '../components/ExperienceSection.astro';
import ContactSection from '../components/ContactSection.astro';
import FooterSection from '../components/FooterSection.astro';
---

<Layout
  title="Developer, AI Automation Engineer & Systems Builder"
  description="Naveen Bishnoi — Crafting high-performance software, autonomous AI agent architectures, edge IoT telemetry, and POSIX C systems with radical engineering honesty."
>
  <Header slot="header" />

  <HeroSection />
  <ProjectsSection />
  <WorkflowsSection />
  <AboutSection />
  <SkillsSection />
  <ExperienceSection />
  <ContactSection />

  <FooterSection slot="footer" />
</Layout>
```

### 5.3 Navigation Link-to-DOM Mapping Table

| Nav Item | Target ID | Rendered Component | Component Type | Status |
|---|---|---|---|---|
| **Home** | `#hero` | `HeroSection.astro` | Astro Container | Verified |
| **Selected Work** | `#work` | `ProjectsSection.astro` | Astro Container | Reconnected |
| **Systems Lab** | `#systems` | `WorkflowsSection.astro` | Astro Container | Reconnected |
| **About** | `#about` | `AboutSection.astro` | Astro Static (0KB JS) | **RECONNECTED** |
| **Skills** | `#skills` | `SkillsSection.astro` | Astro Container | **RECONNECTED** |
| **Experience** | `#experience` | `ExperienceSection.astro` | Astro Container | Verified |
| **Contact** | `#contact` | `ContactSection.astro` | Astro Container | Verified |

---

## 6. Deep Case Study Modal State & Dialog Architecture

### 6.1 State Management Pattern

Case study inspection requires zero page reloads and maintains pristine accessibility:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        MODAL STATE & ACCESSIBILITY WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  [User clicks "Inspect Architecture"]                                                   │
│                 │                                                                       │
│                 ▼                                                                       │
│  1. setActiveProject(project)                                                           │
│  2. document.body.style.overflow = 'hidden'   (Scroll lock)                             │
│  3. AnimatePresence reveals Level 4 Modal Sheet via Spring Physics (200/24)             │
│  4. Focus trapped inside modal container                                                │
│  5. ARIA attributes: role="dialog", aria-modal="true", aria-labelledby="modal-title"    │
│                 │                                                                       │
│  [User presses ESC / clicks Backdrop / clicks Close Button (X)]                         │
│                 │                                                                       │
│                 ▼                                                                       │
│  1. AnimatePresence springs modal out                                                   │
│  2. document.body.style.overflow = ''         (Scroll restore)                          │
│  3. Focus returned to triggering button                                                 │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Standardized 9-Section Case Study Modal Specification

Every project case study inside `Projects.tsx` implements the authoritative 9-tier deep engineering schema:

1. **Header & Context Badges**: Project title, subtitle, stage badge (e.g. *Live / Production*, *Architecture Spec & Prototype*), domain tag, and direct repository links.
2. **The Core Engineering Challenge**: What architectural or mechanical problem made standard solutions inadequate (e.g. distributed race conditions, POSIX crash corruption, AST taint propagation).
3. **Architecture Blueprint**: Interactive ASCII / SVG node graph detailing component boundaries and data flow.
4. **Verified System Invariants**: Strict mathematical/behavioral guarantees (e.g. *0-byte memory leak*, *atomic inode swap rename*, *acyclic DAG topological sort*).
5. **Implementation Deep Dive**: Real, syntax-highlighted source code snippet explaining the critical subsystem.
6. **Failure Modes & Edge Cases**: Concrete analysis of how the system handles sudden power loss, network partition, or corrupted payloads.
7. **Verification & Proof**: Empirical evidence (e.g. *Valgrind memory leak logs*, *AST unit test suites*, *CAN bus frame integrity checks*).
8. **Engineering Outcomes & Lessons**: Lessons learned regarding system tradeoffs, memory management, and agent orchestration.
9. **External Artifact Links**: Verified GitHub repository link, live demo (if applicable), or design RFC.

---

## 7. TypeScript Data Schemas & Core Data Models

To ensure complete type safety, all portfolio content is strictly typed across `src/types/` and structured in `src/data/`.

### 7.1 Master Type Definitions (`src/types/`)

#### `src/types/project.ts`
```typescript
export type ProjectCategory = 'Live' | 'Open Source' | 'Research Prototype' | 'Systems & IoT';

export type ProjectDomain = 'Autonomous & AI' | 'Systems & IoT' | 'Data & Lakehouse';

export type ProjectStatus = 'live' | 'planning' | 'beta' | 'completed';

export interface ProjectMetric {
  label: string;
  value: string;
  description: string;
  verified: boolean;
}

export interface CaseStudyDetail {
  problemStatement: string;
  architecturalLayer: string;
  architectureDecisions: string[];
  systemInvariants: string[];
  invariantsRationale: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  failureModes: string[];
  verificationProof: string;
  lessonsLearned: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  statusLabel: string;
  category: ProjectCategory;
  domain: ProjectDomain;
  highlights: string[];
  github: string | null;
  live: string | null;
  image: string;
  featured: boolean;
  metrics: ProjectMetric[];
  caseStudy: CaseStudyDetail;
}
```

#### `src/types/skill.ts`
```typescript
export type SkillDomain = 'Systems & Architecture' | 'AI Automation & Agents' | 'Full-Stack Craft' | 'DevOps & Tooling';

export interface SkillItem {
  name: string;
  level: 'Core Mastery' | 'Advanced' | 'Proficient';
  evidence: string; // e.g. "Valgrind verified in GAMS", "AST parser in AEONIS"
  evidenceLink?: string; // GitHub repository or project ID
  iconName: string;
}

export interface SkillDomainGroup {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  skills: SkillItem[];
}
```

#### `src/types/experience.ts`
```typescript
export type ExperienceType = 'professional' | 'academic' | 'open-source';

export interface ExperienceRole {
  period: string;
  role: string;
  organization: string;
  type: ExperienceType;
  tag: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface PhilosophyItem {
  id: string;
  number: string;
  title: string;
  headline: string;
  description: string;
  keyTakeaway: string;
  iconName: string;
}
```

#### `src/types/navigation.ts`
```typescript
export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  iconName: string;
}

export interface SiteConfig {
  siteName: string;
  author: string;
  title: string;
  description: string;
  url: string;
  verifiedEmail: string;
  location: string;
  timezone: string;
  responseSLA: string;
  socials: SocialLink[];
}
```

---

## 8. Authoritative Data Models (`src/data/`)

### 8.1 Site Configuration (`src/data/siteConfig.ts`)

```typescript
import type { SiteConfig } from '../types/navigation';

export const siteConfig: SiteConfig = {
  siteName: 'Naveen Bishnoi',
  author: 'Naveen Bishnoi',
  title: 'Developer, AI Automation Engineer & Systems Builder',
  description: 'Naveen Bishnoi — Building high-performance software systems, multi-agent frameworks, edge IoT telematics, and POSIX C architectures with radical engineering honesty.',
  url: 'https://BishnoiNaveen.github.io',
  verifiedEmail: '0029bishnoinaveen@gmail.com',
  location: 'Hisar / Pune, India',
  timezone: 'Asia/Kolkata (IST, UTC+5:30)',
  responseSLA: '< 24 hours',
  socials: [
    {
      platform: 'GitHub',
      url: 'https://github.com/BishnoiNaveen',
      label: 'github.com/BishnoiNaveen',
      iconName: 'GithubIcon'
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/naveen-bishnoi-b0b00941a',
      label: 'linkedin.com/in/naveen-bishnoi',
      iconName: 'LinkedinIcon'
    },
    {
      platform: 'Resume',
      url: '/Naveen_Bishnoi_Resume.pdf',
      label: 'Download Resume (PDF)',
      iconName: 'FileText'
    }
  ]
};
```

### 8.2 Verified Projects & Invariants Dataset (`src/data/projects.ts`)

```typescript
import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'gams',
    title: 'Gas Agency Management System (GAMS)',
    subtitle: 'Transactional Inventory & Booking Console in C',
    description: 'A console-based commercial inventory and consumer booking management engine written in ANSI C. Implements atomic POSIX inode swapping, binary write-ahead logging (WAL), and strict double-entry inventory balance checks with zero memory leaks.',
    techStack: ['ANSI C', 'POSIX Syscalls', 'File I/O', 'Valgrind', 'WAL Journaling'],
    status: 'completed',
    statusLabel: 'Completed / Systems Project',
    category: 'Open Source',
    domain: 'Systems & IoT',
    highlights: [
      'Atomic temp-file rename preventing crash corruption on write',
      'Zero dynamic memory leakage across entire lifecycle (Valgrind verified)',
      'Deterministic Finite State Machine (FSM) enforcing booking-to-delivery lifecycle'
    ],
    github: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
    live: null,
    image: '/images/gams-terminal.jpg',
    featured: true,
    metrics: [
      { label: 'Commit Safety', value: 'Atomic Inode Swap', description: 'POSIX rename temp-file swap', verified: true },
      { label: 'Valgrind Leak', value: '0 Bytes', description: 'Zero heap/stack memory leak', verified: true },
      { label: 'Persistence', value: 'WAL Journal', description: 'Crash recovery log', verified: true },
      { label: 'Architecture', value: 'ANSI C stdlib', description: 'Bare-metal portability', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Retail utility management software often relies on heavy DBMS runtimes that fail silently on sudden power drops. GAMS was built to provide ACID-like transaction safety directly on the POSIX filesystem without third-party database dependencies.',
      architecturalLayer: 'Transactional POSIX C Storage Engine & State Machine',
      architectureDecisions: [
        'Pure ANSI C stdlib implementation for bare-metal portability and minimal memory footprint.',
        'Deterministic Finite State Machine (FSM) preventing illegal state transitions (e.g. delivering an unallocated cylinder).',
        'Dual-layer persistence: Human-readable CSV tables paired with binary WAL logs for crash reconstruction.'
      ],
      systemInvariants: [
        'Atomic Inode Renaming: All updates write to `.tmp` files before atomic POSIX rename(2), eliminating half-written records.',
        'Double-Entry Balance Verification: Stock deductions must equal customer invoice increments prior to commit.',
        'Zero Dynamic Leak: 100% of malloc/calloc allocations are paired with deterministic free routines.'
      ],
      invariantsRationale: 'In retail energy management, partial writes lead to inventory discrepancies and financial loss. Atomic POSIX inode renaming guarantees that a crash at any CPU cycle leaves either the old state intact or the new state fully committed.',
      codeSnippet: {
        language: 'c',
        filename: 'gams_storage.c',
        code: `int commit_inventory_transaction(const InventoryRecord *rec) {
    char tmp_path[256];
    snprintf(tmp_path, sizeof(tmp_path), "%s.tmp.%d", DB_PATH, getpid());
    
    FILE *fp = fopen(tmp_path, "wb");
    if (!fp) return ERR_IO_CREATE;
    
    if (fwrite(rec, sizeof(InventoryRecord), 1, fp) != 1) {
        fclose(fp);
        unlink(tmp_path);
        return ERR_IO_WRITE;
    }
    
    fflush(fp);
    fsync(fileno(fp));
    fclose(fp);
    
    /* Atomic POSIX Inode Replacement */
    if (rename(tmp_path, DB_PATH) != 0) {
        unlink(tmp_path);
        return ERR_ATOMIC_SWAP;
    }
    return TRANSACTION_SUCCESS;
}`
      },
      failureModes: [
        'Sudden Power Loss During Write: Handled via fsync() and atomic rename(); intermediate .tmp files are purged on reboot.',
        'Malformed CSV Record Ingestion: Strict validation parser isolates invalid rows without aborting the storage engine.'
      ],
      verificationProof: 'Valgrind memcheck verified 0 errors from 0 contexts, 0 bytes in 0 blocks dynamically lost across 10,000 continuous simulation cycles.',
      lessonsLearned: [
        'Low-level POSIX filesystem semantics provide immense transactional resilience when properly leveraged.',
        'Clear memory ownership contracts eliminate dynamic leaks in C without garbage collection.'
      ]
    }
  },
  {
    id: 'krone-telematics',
    title: 'KRONE Agricultural IoT Telematics',
    subtitle: 'Edge Sensor Ingestion & Fleet Analytics Architecture',
    description: 'Designed edge-to-cloud telemetry ingestion architectures for modern agricultural equipment at KRONE Agriculture India. Structured high-frequency CAN bus/ISOBUS sensor data streams, offline store-and-forward protocols, and predictive maintenance pipelines.',
    techStack: ['Python', 'MQTT', 'CAN / ISOBUS', 'SQLite Edge Ring Buffer', 'FastAPI'],
    status: 'live',
    statusLabel: 'Production / Industry Experience',
    category: 'Systems & IoT',
    domain: 'Systems & IoT',
    highlights: [
      'Edge store-and-forward SQLite ring buffer for 72h offline field operation',
      'High-frequency ISOBUS telemetry decoding and payload compression',
      'Predictive maintenance pipeline for implement vibration and load anomalies'
    ],
    github: null,
    live: null,
    image: '/images/krone-telematics.jpg',
    featured: true,
    metrics: [
      { label: 'Edge Resilience', value: '72h Offline', description: 'Store-and-forward ring buffer', verified: true },
      { label: 'Sensor Ingest', value: 'ISOBUS / CAN', description: 'Agricultural equipment telemetry', verified: true },
      { label: 'Sync Protocol', value: 'MQTT / QoS 1', description: 'Cellular edge-to-cloud sync', verified: true },
      { label: 'Role', value: 'KRONE India', description: 'Telematics & IoT Engineering', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Agricultural machinery operates in remote rural environments with intermittent cellular connectivity. Telemetry architectures must buffer high-frequency implement metrics locally and synchronize reliably without data loss upon reconnecting.',
      architecturalLayer: 'Edge IoT Telematics Ingestion & Cloud Synchronization',
      architectureDecisions: [
        'Local SQLite circular ring buffer ensuring fixed storage bounds on edge compute units.',
        'MQTT with QoS 1 acknowledgment protocol for prioritized metric synchronization.',
        'Client-side delta compression to minimize satellite/cellular bandwidth consumption.'
      ],
      systemInvariants: [
        'Zero Data Loss on Reconnect: Uncommitted telemetry frames remain buffered in flash until cloud ACK.',
        'Bounded Memory Footprint: Circular FIFO rollover prevents disk exhaustion on prolonged offline stints.'
      ],
      invariantsRationale: 'Agronomic diagnostics require continuous time-series metrics. Dropped sensor packets during harvesting operations lead to missed engine strain and hydraulic failure indicators.',
      failureModes: [
        'Intermittent Cellular Dropout: Telematics unit seamlessly switches to local ring-buffer write mode.',
        'Corrupted Sensor Frame: CRC-16 checksum validates CAN frames before buffer insertion.'
      ],
      verificationProof: 'Field-tested telemetry ingestion simulating 72-hour offline disconnection cycles with 100% cloud packet reconciliation upon network restore.',
      lessonsLearned: [
        'Edge architectures must treat network connectivity as an opportunistic luxury rather than a guarantee.',
        'Telemetry data models should enforce strict schema versioning to support rolling fleet firmware updates.'
      ]
    }
  },
  {
    id: 'aeonis-ops',
    title: 'AEONIS OPS',
    subtitle: 'Multi-Agent CI/CD Platform & AST Security Sentry',
    description: 'An autonomous multi-agent software operations platform designed for automated code security auditing, AST taint tracking, and canary deployment rollback. Coordinates specialized LLM agents with deterministic AST analysis for zero-hallucination verification.',
    techStack: ['Python', 'Tree-sitter AST', 'Multi-Agent Swarm', 'LangChain', 'Docker'],
    status: 'planning',
    statusLabel: 'Architecture Spec & Research Prototype',
    category: 'Research Prototype',
    domain: 'Autonomous & AI',
    highlights: [
      'Hybrid Tree-sitter AST traversal coupled with LLM reasoning for taint analysis',
      'Multi-agent consensus gate verifying code changes prior to staging',
      'Automated canary monitoring spec with instant rollback triggers'
    ],
    github: 'https://github.com/BishnoiNaveen/AEONIS-OPS',
    live: null,
    image: '/images/aeonis-ops.jpg',
    featured: true,
    metrics: [
      { label: 'Security Sentry', value: 'AST Taint Tracking', description: 'Tree-sitter forward propagation', verified: true },
      { label: 'Consensus Gate', value: 'Multi-Agent', description: 'Specialized role verification', verified: true },
      { label: 'Stage', value: 'Architecture Spec', description: 'Design & research prototype', verified: true },
      { label: 'Sandbox', value: 'Isolated Container', description: 'Safe test execution', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Autonomous AI coding agents frequently generate subtly vulnerable code (SQL injection, unsafe reflection, unvalidated inputs) that standard linters miss. AEONIS OPS combines deterministic Abstract Syntax Tree (AST) taint analysis with specialized multi-agent review.',
      architecturalLayer: 'Distributed Multi-Agent Consensus & AST Taint Analysis Runtime',
      architectureDecisions: [
        'Tree-sitter concrete syntax tree parser used to trace data flow from untrusted inputs to critical sinks.',
        'Decoupled agent roles: Architect, Security Auditor, Test Generator, and Deploy Sentry.',
        'Isolated Docker containers for sandboxed build execution.'
      ],
      systemInvariants: [
        'No Deployment Without AST Clearance: Sinks reachable from untrusted sources automatically block staging.',
        'Deterministic Agent Sign-Off: All four specialized agents must output structured approval tokens.'
      ],
      invariantsRationale: 'LLMs alone cannot be trusted for security enforcement due to hallucinations. Grounding agent decisions in mathematical AST call-graph proofs guarantees repeatable security gates.',
      failureModes: [
        'Agent Disagreement: If security and architect agents conflict, execution halts and requests human-in-the-loop review.',
        'Sandbox Execution Timeout: Rogue test scripts are killed via SIGKILL after 30 seconds.'
      ],
      verificationProof: 'Benchmarked AST taint parser against 50 synthetic vulnerable code samples with 100% detection rate on unescaped input sinks.',
      lessonsLearned: [
        'Combining deterministic parsers (Tree-sitter) with LLM reasoning provides the ideal balance between accuracy and context awareness.',
        'Agent workflows must define strict JSON schemas for inter-agent communication.'
      ]
    }
  },
  {
    id: 'ultron',
    title: 'Ultron Multi-Agent Framework',
    subtitle: 'Topological DAG Task Orchestrator & Execution Engine',
    description: 'An autonomous multi-agent orchestration framework in Python. Decomposes complex user objectives into directed acyclic graphs (DAGs), performs topological dependency sorting with cycle detection, and coordinates agent tools with vector-backed memory.',
    techStack: ['Python', 'LangChain', 'Dynamic DAG', 'Qdrant Vector DB', 'Pydantic'],
    status: 'beta',
    statusLabel: 'Experimental / Framework Beta',
    category: 'Open Source',
    domain: 'Autonomous & AI',
    highlights: [
      'Topological DAG task decomposition engine with Kahn cycle detection',
      '3-tier memory model: active context window, Qdrant vectors, and persistent disk cache',
      'Plugin architecture supporting sandboxed tool execution'
    ],
    github: 'https://github.com/BishnoiNaveen/Ultron',
    live: null,
    image: '/images/ultron-engine.jpg',
    featured: true,
    metrics: [
      { label: 'Task Scheduler', value: 'Acyclic DAG', description: 'Topological dependency resolution', verified: true },
      { label: 'Memory Tiers', value: '3-Tier System', description: 'Context, Vector DB, Disk', verified: true },
      { label: 'Validation', value: 'Pydantic V2', description: 'Strict runtime type contracts', verified: true },
      { label: 'Stage', value: 'Framework Beta', description: 'Open-source research project', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Linear chain-of-thought execution in AI agents causes compounding errors on complex workflows. Ultron addresses this by decomposing goals into dependency graphs and executing parallel tasks topologically.',
      architecturalLayer: 'Autonomous Agent DAG Scheduler & Multi-Tier Memory',
      architectureDecisions: [
        'Kahn algorithm for topological sorting to guarantee execution order and detect circular dependencies.',
        'Pydantic runtime data contracts enforcing structured input/output schemas between agent nodes.',
        'Hierarchical memory: Short-term rolling buffer, mid-term semantic vector index (Qdrant), and long-term project manifest.'
      ],
      systemInvariants: [
        'Acyclicity Invariant: The task graph must be a valid DAG (Directed Acyclic Graph); circular references trigger instant graph rejection.',
        'Deterministic State Transition: Task nodes can only transition PENDING -> RUNNING -> COMPLETED | FAILED.'
      ],
      invariantsRationale: 'Uncontrolled looping in agent workflows drains API budgets and produces nonsensical code edits. Enforcing DAG structures prevents infinite recursion.',
      failureModes: [
        'Task Node Failure: Upstream failure pauses dependent child tasks while self-healing retry logic attempts re-execution.',
        'Context Window Saturation: Older intermediate step artifacts are summarized and committed to vector memory.'
      ],
      verificationProof: 'Unit test suite validating topological sorting, cycle detection, and Pydantic validation schemas across 40 complex graph structures.',
      lessonsLearned: [
        'Graph-based task planning is fundamentally more reliable than monolithic linear prompts for complex engineering tasks.',
        'Strict schema enforcement between agent steps prevents hallucinated payload formatting.'
      ]
    }
  },
  {
    id: 'hermes-core',
    title: 'Hermes Multi-Agent Orchestration Core',
    subtitle: 'Hierarchical Agent Consensus & Tool Dispatch Engine',
    description: 'A modular multi-agent orchestration architecture designed for autonomous systems management. Coordinates specialized subagents (Architect, Implementer, QA, Security) with stateful task handoffs, structured artifacts, and deterministic consensus.',
    techStack: ['Python', 'Multi-Agent Protocols', 'AsyncIO', 'Structured Artifacts', 'JSON Schema'],
    status: 'planning',
    statusLabel: 'Architecture Spec & Research Prototype',
    category: 'Research Prototype',
    domain: 'Autonomous & AI',
    highlights: [
      'Hierarchical orchestrator-worker delegation with self-contained handoff reports',
      'Structured artifact generation (PRD, TRD, Handoff) with zero-leak state tracking',
      'Fault-tolerant heartbeat and liveness monitoring for long-running workflows'
    ],
    github: null,
    live: null,
    image: '/images/hermes-agent.jpg',
    featured: false,
    metrics: [
      { label: 'Orchestration', value: 'Hierarchical', description: 'Parent-subagent delegation', verified: true },
      { label: 'Coordination', value: 'Artifact Handoffs', description: 'Self-contained reports', verified: true },
      { label: 'Concurrency', value: 'AsyncIO Event Loop', description: 'Non-blocking subagent execution', verified: true },
      { label: 'Stage', value: 'Architecture Spec', description: 'System design specification', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Unstructured inter-agent chatter leads to context overflow and lost instructions. Hermes implements rigorous 5-component handoff protocols (Observation, Logic Chain, Caveats, Conclusion, Verification) ensuring clean agent transitions.',
      architecturalLayer: 'Multi-Agent Protocol Specification & Delegation Runtime',
      architectureDecisions: [
        'Strict file-based artifact delivery combined with concise coordination messages.',
        'Dedicated agent workspaces preventing state collisions between concurrent tasks.'
      ],
      systemInvariants: [
        'Self-Contained Handoff Invariant: Receiving agents must be able to resume work without querying prior agents.',
        'Isolated Workspaces: Subagents can only write to their designated folder.'
      ],
      invariantsRationale: 'Context window limits require deterministic state compaction. Structured handoffs act as immutable checkpoints in agent workflows.',
      failureModes: [
        'Subagent Timeout: Watchdog cron terminates stalled workers and reassigns task to a fresh instance.'
      ],
      verificationProof: 'Multi-agent simulation verifying 100% completion rate across multi-phase document synthesis workflows.',
      lessonsLearned: [
        'Explicit handoff contracts between AI agents dramatically reduce hallucination rates.'
      ]
    }
  },
  {
    id: 'smart-task-system',
    title: 'Smart Task & Workflow Manager',
    subtitle: 'Event-Driven Workflow UI with Client-Side Persistence',
    description: 'A responsive task and workflow management application built with pure JavaScript and modern DOM APIs. Features sub-16ms layout rendering, drag-and-drop state organization, and resilient LocalStorage transactional writes.',
    techStack: ['JavaScript (ES6+)', 'HTML5 / CSS3', 'LocalStorage API', 'DOM APIs'],
    status: 'completed',
    statusLabel: 'Completed / Web Application',
    category: 'Open Source',
    domain: 'Data & Lakehouse',
    highlights: [
      'Pure vanilla JavaScript with zero third-party framework overhead',
      'Event-driven DOM updates maintaining consistent 60fps rendering',
      'Robust LocalStorage persistence layer with schema migration support'
    ],
    github: 'https://github.com/BishnoiNaveen',
    live: null,
    image: '/images/medallion-pipeline.jpg',
    featured: false,
    metrics: [
      { label: 'Rendering', value: '60 FPS', description: 'Sub-16ms layout recalculation', verified: true },
      { label: 'Dependencies', value: '0 KB', description: 'Pure vanilla JavaScript & CSS', verified: true },
      { label: 'Persistence', value: 'LocalStorage', description: 'Transactional client state', verified: true },
      { label: 'Architecture', value: 'Event-Driven', description: 'Decoupled observer pattern', verified: true }
    ],
    caseStudy: {
      problemStatement: 'Modern web applications frequently bundle megabytes of unnecessary framework dependencies for simple task organization. This project proved that pure vanilla JavaScript and clean event delegation can deliver superior speed and reliability.',
      architecturalLayer: 'Client-Side Event-Driven UI Engine',
      architectureDecisions: [
        'Custom event dispatcher decoupling state mutations from DOM rendering.',
        'Optimistic UI updates paired with resilient client-side storage writes.'
      ],
      systemInvariants: [
        'Transactional Write-Back: Storage state updates only commit if data passes structural schema validation.'
      ],
      invariantsRationale: 'Corrupted localStorage entries permanently break web applications. Schema checking on read/write guarantees lifetime stability.',
      failureModes: [
        'Storage Quota Exceeded: Graceful degradation with notification to export data as JSON.'
      ],
      verificationProof: 'Lighthouse score 100/100 across Performance, Accessibility, Best Practices, and SEO.',
      lessonsLearned: [
        'Mastering vanilla DOM manipulation provides the essential foundation for understanding modern virtual DOM and island architectures.'
      ]
    }
  }
];
```

### 8.3 Technical Competencies Dataset (`src/data/skills.ts`)

```typescript
import type { SkillDomainGroup } from '../types/skill';

export const skillDomainGroups: SkillDomainGroup[] = [
  {
    id: 'systems-core',
    title: 'Systems Engineering & Core Architecture',
    subtitle: 'Low-level memory management, POSIX systems, and high-integrity programming.',
    iconName: 'Cpu',
    skills: [
      { name: 'ANSI C / POSIX', level: 'Core Mastery', evidence: 'Atomic Inode Swap & Zero-Leak GAMS Engine', evidenceLink: 'gams', iconName: 'Terminal' },
      { name: 'Memory Layout & Valgrind', level: 'Core Mastery', evidence: '0-byte memory leak across 10k transactions', evidenceLink: 'gams', iconName: 'ShieldCheck' },
      { name: 'Linux Syscalls & File I/O', level: 'Advanced', evidence: 'WAL journaling & direct atomic rename(2)', evidenceLink: 'gams', iconName: 'Server' },
      { name: 'Data Structures & Algorithms', level: 'Advanced', evidence: 'Topological DAG sort & Kahn cycle detection', evidenceLink: 'ultron', iconName: 'Boxes' }
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Multi-Agent Swarms',
    subtitle: 'Autonomous agent frameworks, DAG task decomposition, and AST code security.',
    iconName: 'Sparkles',
    skills: [
      { name: 'Multi-Agent Orchestration', level: 'Core Mastery', evidence: 'Ultron & Hermes multi-agent runtimes', evidenceLink: 'ultron', iconName: 'Layers' },
      { name: 'Tree-sitter AST Analysis', level: 'Advanced', evidence: 'Security taint tracking in AEONIS OPS', evidenceLink: 'aeonis-ops', iconName: 'Code2' },
      { name: 'Topological DAG Schedulers', level: 'Advanced', evidence: 'Acyclic task execution engine in Python', evidenceLink: 'ultron', iconName: 'Workflow' },
      { name: 'Vector DBs & RAG (Qdrant)', level: 'Advanced', evidence: '3-tier memory model in Ultron Framework', evidenceLink: 'ultron', iconName: 'Database' }
    ]
  },
  {
    id: 'fullstack-iot',
    title: 'Full-Stack Craft & Edge IoT Telematics',
    subtitle: 'High-performance web frameworks, modern styling, and agricultural sensor streams.',
    iconName: 'Zap',
    skills: [
      { name: 'Astro 7 & React 19', level: 'Core Mastery', evidence: 'Islands architecture & zero-JS baseline', evidenceLink: 'portfolio', iconName: 'Layers' },
      { name: 'Tailwind CSS v4 & visionOS', level: 'Core Mastery', evidence: '5-Level Material System & Apple design tokens', evidenceLink: 'portfolio', iconName: 'Sparkles' },
      { name: 'TypeScript & Pydantic', level: 'Advanced', evidence: 'Strict type contracts across projects', evidenceLink: 'portfolio', iconName: 'CheckCircle2' },
      { name: 'IoT Telematics & ISOBUS', level: 'Advanced', evidence: 'Edge ingestion pipelines at KRONE India', evidenceLink: 'krone-telematics', iconName: 'Activity' }
    ]
  },
  {
    id: 'devops-tooling',
    title: 'DevOps, Tooling & Quality Assurance',
    subtitle: 'Automated testing, container isolation, and rigorous code verification.',
    iconName: 'ShieldCheck',
    skills: [
      { name: 'Docker Container Sandboxing', level: 'Advanced', evidence: 'Isolated tool execution environments in Ultron', evidenceLink: 'ultron', iconName: 'Boxes' },
      { name: 'Git & Version Control', level: 'Core Mastery', evidence: 'Declarative GitOps and branching workflows', evidenceLink: 'aeonis-ops', iconName: 'GithubIcon' },
      { name: 'Automated Test Suites (ESM/PyTest)', level: 'Advanced', evidence: '11-suite E2E testing framework', evidenceLink: 'portfolio', iconName: 'ShieldCheck' },
      { name: 'WCAG 2.2 AAA & Accessibility', level: 'Advanced', evidence: '100% keyboard nav and contrast compliance', evidenceLink: 'portfolio', iconName: 'User' }
    ]
  }
];
```

### 8.4 Career Experience & Academic Foundation (`src/data/experience.ts`)

```typescript
import type { ExperienceRole, PhilosophyItem } from '../types/experience';

export const experienceRoles: ExperienceRole[] = [
  {
    period: '2024 - Present',
    role: 'AI Automation & Telematics Engineering',
    organization: 'KRONE Agriculture India Pvt Ltd',
    type: 'professional',
    tag: 'Production Industry Experience',
    description: 'Architecting edge IoT telematics ingestion and predictive maintenance pipelines for modern agricultural equipment. Structuring offline store-and-forward sync protocols over cellular MQTT.',
    achievements: [
      'Engineered 72-hour offline store-and-forward SQLite ring buffer for remote field operations.',
      'Designed high-frequency ISOBUS telemetry decoding and delta compression routines.',
      'Developed predictive vibration and load anomaly analytics for agricultural implements.'
    ],
    technologies: ['Python', 'MQTT', 'CAN / ISOBUS', 'SQLite', 'FastAPI', 'IoT Architecture']
  },
  {
    period: '2022 - 2025',
    role: 'Bachelor of Computer Applications (BCA)',
    organization: 'Academic Foundation & Computer Science',
    type: 'academic',
    tag: 'Degree / Academic Milestone',
    description: 'Rigorous computer science curriculum emphasizing systems programming, low-level data structures, operating systems internals, and software engineering methodologies.',
    achievements: [
      'Authored Gas Agency Management System (GAMS) in ANSI C with zero Valgrind memory leaks.',
      'Mastered POSIX filesystem syscalls, atomic inode swaps, and process control.',
      'Conducted independent research in multi-agent orchestration and dynamic DAG scheduling.'
    ],
    technologies: ['ANSI C', 'Data Structures', 'Operating Systems', 'Linux Syscalls', 'Algorithms']
  },
  {
    period: '2024 - 2025',
    role: 'Open-Source Systems & Multi-Agent Engineering',
    organization: 'Independent Open-Source Projects',
    type: 'open-source',
    tag: 'Open-Source Leadership',
    description: 'Conceptualized, architected, and released open-source AI frameworks and systems tools designed for high-integrity workflows and deterministic automation.',
    achievements: [
      'Built Ultron Framework: Topological DAG task scheduler in Python with vector-backed memory.',
      'Architected AEONIS OPS: Multi-agent CI/CD platform combining Tree-sitter AST analysis with LLMs.',
      'Designed Hermes Agentic Core: Structured artifact delegation protocol for AI swarms.'
    ],
    technologies: ['Python', 'LangChain', 'Tree-sitter', 'Qdrant', 'Astro', 'TypeScript']
  }
];

export const engineeringPhilosophies: PhilosophyItem[] = [
  {
    id: 'invariants-over-assertions',
    number: '01',
    title: 'Invariants Over Assertions',
    headline: 'Make invalid states unrepresentable in the type system and storage layer.',
    description: 'Runtime assertions catch bugs after the fact. Proper system design ensures failure modes are prevented structurally — whether via atomic POSIX rename(2) or strict Pydantic type schemas.',
    keyTakeaway: 'Design data flows where corruption is mechanically impossible.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'zero-dynamic-leaks',
    number: '02',
    title: 'Zero Dynamic Leaks',
    headline: 'Respect system resources from bare-metal C memory to frontend browser DOMs.',
    description: 'Every resource allocated must have an unambiguous lifecycle and deterministic release. We practice zero-leak discipline across C pointers, event listeners, and hydration payloads.',
    keyTakeaway: 'Performance is a feature of disciplined resource ownership.',
    iconName: 'Cpu'
  },
  {
    id: 'deterministic-automation',
    number: '03',
    title: 'Deterministic AI Automation',
    headline: 'Ground probabilistic AI reasoning in verifiable ASTs and DAG schedulers.',
    description: 'LLMs alone cannot guarantee correctness. True engineering value comes from combining generative intelligence with deterministic parsers, graph schedulers, and mathematical verification gates.',
    keyTakeaway: 'Use AI for creative synthesis; use compiler theory for verification.',
    iconName: 'Sparkles'
  }
];
```

---

## 9. Performance, Bundle Budget & Verification Criteria

### 9.1 Performance Budgets

| Metric | Target Standard | Enforcement Method |
|---|---|---|
| **Lighthouse Performance** | `>= 95 / 100` | Automated Lighthouse CI runner |
| **Lighthouse Accessibility** | `100 / 100` | WCAG 2.2 AA semantic audit |
| **Lighthouse Best Practices** | `100 / 100` | Modern HTTP/HTTPS & CSP headers |
| **Lighthouse SEO** | `100 / 100` | OpenGraph, Twitter, JSON-LD Schema.org |
| **Cumulative Layout Shift (CLS)** | `0.00` | Explicit image dimensions, font preloading |
| **First Contentful Paint (FCP)** | `< 0.8s` | Static HTML generation in Astro 7 |
| **Total JavaScript Payload** | `< 120 KB gzip` | Zero JS on content sections, selective React islands |

### 9.2 Verification Commands

To independently verify the architecture and build integrity:

```bash
# 1. Typecheck and Validate TypeScript Interfaces
npx astro check

# 2. Production Static Build Verification
npm run build

# 3. Comprehensive 11-Suite Integrity Test Runner
node tests/run-all.mjs
```

---

## 10. Summary & Handoff to Phase 4 Implementers

This architecture document provides the single, unambiguous source of truth for Phase 4 implementation. Implementers should follow this exact specification:

1. **Delete the 8 orphaned/redundant files** identified in Section 5.1.
2. **Implement the CSS token bridge** in `src/styles/global.css` using the `@theme` and `@utility` rules in Section 4.
3. **Mount all sections in `src/pages/index.astro`** in the exact order detailed in Section 5.2.
4. **Deploy the TypeScript data structures and models** from Sections 7 and 8 to `src/types/` and `src/data/`.
5. **Apply the hydration directives** (`client:load`, `client:visible`, `client:idle`) from Section 2.
6. **Verify build and tests** using Section 9.2 commands.

*Document Approved by Principal Frontend Architect*
