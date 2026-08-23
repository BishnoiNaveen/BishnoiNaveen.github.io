# Apple UI Specification & Design Tokens Guide (iOS 18 & visionOS)

**Target Project:** Naveen Bishnoi Portfolio Redesign  
**Document Type:** Master Design System, CSS Recipes & Token Specifications  
**Author:** Explorer 2 (Apple UI Spec & Design Tokens Explorer)  
**Date:** 2026-08-23  

---

## 1. Executive Summary & Aesthetic Paradigm Shift

The previous portfolio design relied on a dark obsidian theme (`#0d1117` / `hsl(228, 18%, 7%)`) which felt too dark, heavy, and lacked prominent visual imagery. 

This specification defines the complete transition to a **Bright & Vivid Apple Fluid UI (iOS 18 & visionOS)** aesthetic:
- **Canvas:** Ultra-bright pure whites (`#FFFFFF`), luminous subtle off-whites (`#F5F5F7`), and glowing saturated Siri/WWDC mesh gradients.
- **Contrast:** Apple high-contrast typography with pure black (`#1D1D1F`) text for unmatched clarity and editorial elegance.
- **Materials:** Authentic visionOS heavy glassmorphism featuring multi-layer specular light borders, deep blurs (`backdrop-filter: blur(40px) saturate(150%)`), and ambient shadows.
- **Accents:** Apple's signature `#0071E3` action blue alongside vivid iOS 18 system hues (Siri Violet `#AF52DE`, Electric Rose `#FF2D55`, Aqua Teal `#00C7BE`, Mint `#34C759`).
- **Imagery:** Edge-to-edge luxury visual presentation with 32px soft rounded corners and expansive whitespace.

---

## 2. Master Color Tokens (Design System Palette)

### 2.1 Core Surfaces & Canvas Colors

| Token Name | Hex / CSS Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-canvas` | `#F5F5F7` | Apple system light gray page background |
| `--color-surface-pure` | `#FFFFFF` | Pure white solid background for elevated cards & sections |
| `--color-surface-translucent` | `rgba(255, 255, 255, 0.75)` | Translucent white surface for secondary containers |
| `--color-glass-base` | `rgba(255, 255, 255, 0.40)` | Standard visionOS glassmorphism card material |
| `--color-glass-elevated` | `rgba(255, 255, 255, 0.55)` | Hover / elevated visionOS glass material |
| `--color-glass-dock` | `rgba(255, 255, 255, 0.65)` | Floating navigation dock and bottom bar glass material |
| `--color-glass-sheet` | `rgba(255, 255, 255, 0.85)` | Full modal drawer / mobile sheet glass surface |

### 2.2 High-Contrast Apple Typography Scale

| Token Name | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-text-primary` | `#1D1D1F` | Pure Apple black / primary text, titles, prominent headlines |
| `--color-text-secondary` | `#424245` | Muted dark gray for descriptions, body copy, and secondary labels |
| `--color-text-tertiary` | `#86868B` | Apple system gray for timestamps, breadcrumbs, tags, and microcopy |
| `--color-text-quaternary` | `#A1A1A6` | Subtle placeholder / inactive icon color |
| `--color-text-on-accent` | `#FFFFFF` | Crisp white text on top of saturated buttons and badges |

### 2.3 Apple Vivid Accents & System Tints

| Token Name | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `--color-accent-blue` | `#0071E3` | Apple signature action blue (Primary CTAs, active links, focus rings) |
| `--color-accent-blue-hover` | `#0077ED` | Lighter hover state for blue buttons |
| `--color-accent-blue-active` | `#0062C4` | Pressed / active state for blue buttons |
| `--color-accent-blue-subtle` | `rgba(0, 113, 227, 0.08)` | Blue tint background for icons, pill chips, and hover states |
| `--color-accent-blue-glow` | `rgba(0, 113, 227, 0.30)` | Box shadow glow for primary actions |
| `--color-accent-purple` | `#AF52DE` | iOS 18 Siri Violet / Multi-Agent & Orchestration badge |
| `--color-accent-pink` | `#FF2D55` | iOS 18 System Rose / Warning & Highlight accents |
| `--color-accent-cyan` | `#32ADE6` | VisionOS Aqua / Stream processing & edge telemetry |
| `--color-accent-teal` | `#00C7BE` | Precision Agri & telemetry yield sensors |
| `--color-accent-green` | `#34C759` | Apple System Green / Live, Healthy, Quorum OK status |
| `--color-accent-amber` | `#FF9500` | Apple System Orange / Beta, In-Progress, Alert status |

### 2.4 Specular Hairline Borders & Shadows

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| `--border-specular-top` | `1px solid rgba(255, 255, 255, 0.75)` | Top edge specular light reflection on glass plates |
| `--border-specular-left` | `1px solid rgba(255, 255, 255, 0.40)` | Left edge ambient light reflection |
| `--border-subtle-dark` | `1px solid rgba(0, 0, 0, 0.06)` | Subtle bottom/right edge outline for contrast on white |
| `--border-active-blue` | `1px solid rgba(0, 113, 227, 0.40)` | Focus / active card border highlight |
| `--shadow-apple-ambient` | `0 8px 32px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.02)` | Standard floating glass plate shadow |
| `--shadow-apple-hover` | `0 20px 48px -8px rgba(0, 0, 0, 0.09), 0 2px 6px 0 rgba(0, 0, 0, 0.03)` | Buoyant card hover shadow |
| `--shadow-apple-dock` | `0 16px 40px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.6)` | Floating header dock shadow |

---

## 3. Materials: VisionOS Heavy Glassmorphism Specifications

Authentic Apple visionOS glass is **never flat opacity**. It combines three optical effects:
1. **High-radius blur with chroma saturation boost:** `backdrop-filter: blur(40px) saturate(150%)`
2. **Directional specular light edges:** Asymmetric borders (brighter top & left, darker subtle bottom) simulating overhead ambient light.
3. **Inner specular glow:** `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.8)`.

### 3.1 CSS Glassmorphism Level Matrix

```css
/* ============================================================
   visionOS Glass Materials (Light Mode)
   ============================================================ */

/* Level 1: Floating Header Dock & Fixed Bars */
.apple-glass-dock {
  background: rgba(255, 255, 255, 0.65);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  backdrop-filter: blur(30px) saturate(160%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    0 4px 24px -2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
}

/* Level 2: Standard Interactive Cards (Projects, Workflows, Telemetry) */
.apple-glass-card {
  background: rgba(255, 255, 255, 0.40);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  backdrop-filter: blur(40px) saturate(150%);
  border-top: 1px solid rgba(255, 255, 255, 0.80);
  border-left: 1px solid rgba(255, 255, 255, 0.45);
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.04),
    0 1px 2px 0 rgba(0, 0, 0, 0.02),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 300ms ease;
}

.apple-glass-card:hover {
  background: rgba(255, 255, 255, 0.60);
  transform: translateY(-4px);
  box-shadow: 
    0 20px 48px -8px rgba(0, 0, 0, 0.08),
    0 2px 6px 0 rgba(0, 0, 0, 0.03),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
}

/* Level 3: Modal Sheets, Flyout Drawers & Details Overlays */
.apple-glass-sheet {
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  backdrop-filter: blur(50px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 32px 72px -16px rgba(0, 0, 0, 0.14),
    0 4px 16px 0 rgba(0, 0, 0, 0.04),
    inset 0 1px 0 0 rgba(255, 255, 255, 1);
  border-radius: 32px;
}
```

---

## 4. Glowing Multi-Point iOS 18 Siri Mesh Gradients

To eliminate the "dark void" while maintaining luminous visual intrigue, background canvases incorporate glowing organic mesh orbs that drift gently behind glass plates:

```css
/* — Luminous Animated Siri Mesh Background — */
.apple-mesh-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.apple-mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
  mix-blend-mode: multiply;
  will-change: transform;
}

/* Orb 1: Apple Action Blue & Cyan Glow */
.apple-mesh-orb--blue {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, #38bdf8 0%, #0071E3 60%, transparent 80%);
  top: -10%;
  right: 5%;
  animation: float-orb-blue 14s ease-in-out infinite alternate;
}

/* Orb 2: Siri Magenta & Purple Glow */
.apple-mesh-orb--purple {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #f472b6 0%, #AF52DE 55%, transparent 75%);
  top: 30%;
  left: -8%;
  animation: float-orb-purple 18s ease-in-out infinite alternate;
}

/* Orb 3: Warm Sunrise Amber Glow */
.apple-mesh-orb--amber {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, #fbbf24 0%, #FF9500 50%, transparent 70%);
  bottom: 5%;
  right: 15%;
  animation: float-orb-amber 12s ease-in-out infinite alternate;
}

@keyframes float-orb-blue {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-40px, 50px) scale(1.08); }
  100% { transform: translate(30px, -30px) scale(0.95); }
}

@keyframes float-orb-purple {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(50px, -40px) scale(1.1); }
  100% { transform: translate(-30px, 30px) scale(0.92); }
}

@keyframes float-orb-amber {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-40px, -50px) scale(1.05); }
}
```

---

## 5. Typography Scale & Optical Sizing (San Francisco Style)

Apple's design language achieves its characteristic elegance through **strict optical tracking**:
- **Massive display headers:** Ultra-tight letter spacing (`-0.035em` to `-0.025em`) with bold weights (`700`/`800`) to create a cohesive editorial lockup.
- **Micro eyebrows & section labels:** Expanded loose letter spacing (`+0.08em` to `+0.12em`), uppercase, semi-bold (`600`) for crisp readability.
- **Body text:** Relaxed leading (`1.65`) on high-contrast `#1D1D1F` and `#424245`.

### 5.1 Typography Rules

| Role | Font Size Range | Line Height | Tracking | Weight | Color |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `clamp(2.75rem, 2.2rem + 3.8vw, 5.0rem)` | `1.05` | `-0.035em` | `800` | `#1D1D1F` |
| **Section Title (H2)** | `clamp(2.0rem, 1.6rem + 2.0vw, 3.25rem)` | `1.15` | `-0.03em` | `700` | `#1D1D1F` |
| **Card Title (H3)** | `clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)` | `1.25` | `-0.02em` | `700` | `#1D1D1F` |
| **Eyebrow Label** | `clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)` | `1.4` | `+0.08em` | `600` | `#0071E3` (Uppercase) |
| **Body Large** | `clamp(1.05rem, 0.98rem + 0.35vw, 1.25rem)` | `1.6` | `-0.01em` | `400` | `#424245` |
| **Body Standard** | `clamp(0.9375rem, 0.88rem + 0.25vw, 1.0625rem)` | `1.65` | `0em` | `400` | `#424245` |
| **Mono Telemetry** | `clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem)` | `1.5` | `0em` | `500` | `#1D1D1F` / `#0071E3` |

```css
/* Typography Helper Classes */
.apple-hero-headline {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: clamp(2.75rem, 2.2rem + 3.8vw, 5.0rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: #1D1D1F;
  text-wrap: balance;
}

.apple-section-headline {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  font-size: clamp(2.0rem, 1.6rem + 2.0vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #1D1D1F;
  text-wrap: balance;
}

.apple-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0071E3;
}

.apple-gradient-text {
  background: linear-gradient(135deg, #0071E3 0%, #AF52DE 50%, #FF2D55 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 6. Luxury Spacing & Layout Architecture

Apple layouts feel expansive and uncluttered due to **massive section padding** and **wide margins**:

1. **Section Vertical Spacing:**
   - Desktop: `120px` to `140px` (`py-28` to `py-36` / `--space-32`)
   - Tablet: `80px` to `100px` (`py-20` to `py-24`)
   - Mobile: `56px` to `64px` (`py-14` to `py-16`)
2. **Container Widths:**
   - Default Standard Grid: `max-w-6xl` (`1152px`) / `max-w-7xl` (`1280px`)
   - Focus Editorial Flow (About / Single Workflows): `max-w-4xl` (`896px`)
3. **Card Corner Radii:**
   - Standard Cards: `border-radius: 24px` (`rounded-3xl`)
   - Hero Feature Cards & Edge-to-Edge Imagery: `border-radius: 32px` (`rounded-[32px]`)
   - Capsule Badges & Navigation Docks: `border-radius: 9999px` (`rounded-full`)

---

## 7. Edge-to-Edge Imagery & Interactive Component Specifications

### 7.1 Rich Image Integration Matrix

Every project and architecture section must prominently feature edge-to-edge images rather than walls of text:

| Section / Project | Target Image Asset | Presentation Style |
| :--- | :--- | :--- |
| **Hero Island Preview** | `/images/portfolio_hero.jpg` | 3D Buoyant interactive tilt card with specular glare reflection overlay |
| **Gas Agency Management System (GAMS)** | `/images/gas_agency_system.jpg` | Edge-to-edge card hero image (`aspect-[16/10]`, `rounded-[24px]`) with zoom on hover |
| **Smart Task System** | `/images/smart_task_system.jpg` | Edge-to-edge card visual (`aspect-[16/10]`, `rounded-[24px]`) with live interactive state badge |
| **Naveen Bishnoi Portfolio** | `/images/portfolio_hero.jpg` | Featured showcase banner with Lighthouse 100/100 and WCAG AA verification badges |
| **AEONIS OPS Pipeline** | `/images/aeonis_ops.jpg` | High-resolution architecture blueprint graphic accompanied by AST taint scan visualizer |
| **Ultron Multi-Agent Framework** | `/images/ultron_framework.jpg` | Dynamic DAG orchestration graphic with node execution scrubber |
| **Sentinel AI Security Sentry** | `/images/sentinel_ai.jpg` | AST security sentry interface with live vulnerability patch drawer |

### 7.2 Exact Component CSS Recipes

#### A. Apple Primary Action Capsule Button
```css
.apple-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #FFFFFF;
  background: #0071E3;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.35);
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
}

.apple-btn-primary:hover {
  background: #0077ED;
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 113, 227, 0.45);
}

.apple-btn-primary:active {
  background: #0062C4;
  transform: scale(0.98);
}
```

#### B. Apple Secondary Glass Capsule Button
```css
.apple-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1D1D1F;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.apple-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}
```

#### C. Fluid Project Card with Edge-to-Edge Image & Glass Base
```tsx
<motion.div
  layout
  whileHover={{ y: -6, scale: 1.01 }}
  transition={springPresets.buoyant}
  className="group relative rounded-[28px] bg-white/50 backdrop-blur-2xl border-t border-l border-white/80 border-r border-b border-black/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.09)] transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
>
  {/* Edge-to-Edge Top Image with 20px radius inside 28px card */}
  <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden mb-4 bg-slate-100 border border-black/[0.04]">
    <img 
      src={project.image} 
      alt={project.title} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
      loading="lazy"
    />
    {/* Specular Glare Ring */}
    <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-[20px] pointer-events-none" />
    
    {/* Floating Category Pill */}
    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1D1D1F] border border-white/60 shadow-sm">
      {project.category}
    </div>
  </div>

  {/* Content Details */}
  <div className="flex flex-col gap-2 px-1">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
        {project.title}
      </h3>
      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0071E3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </div>
    <p className="text-sm text-[#424245] leading-relaxed line-clamp-2">
      {project.description}
    </p>
  </div>
</motion.div>
```

---

## 8. Complete Tailwind Configuration & CSS Replacement Plan

To make the entire codebase bright Apple compliant, update `tailwind.config` or CSS classes across all components:

### 8.1 Required Variable Mapping

```css
:root {
  /* Canvas & Light Mode Bases */
  --color-bg-primary:      #F5F5F7;
  --color-bg-secondary:    #FFFFFF;
  --color-bg-tertiary:     rgba(255, 255, 255, 0.7);
  --color-bg-glass:        rgba(255, 255, 255, 0.45);

  /* High Contrast Text */
  --color-text-primary:    #1D1D1F;
  --color-text-secondary:  #424245;
  --color-text-tertiary:   #86868B;

  /* Apple Accents */
  --color-accent:          #0071E3;
  --color-accent-hover:    #0077ED;
  --color-accent-glow:     rgba(0, 113, 227, 0.25);
  --color-accent-subtle:   rgba(0, 113, 227, 0.08);

  /* Status Colors */
  --color-success:         #34C759;
  --color-warning:         #FF9500;
  --color-error:           #FF3B30;

  /* Borders */
  --color-border:          rgba(0, 0, 0, 0.08);
  --color-border-hover:    rgba(0, 113, 227, 0.35);

  /* Glassmorphism Specs */
  --glass-bg:              rgba(255, 255, 255, 0.45);
  --glass-blur:            36px;
  --glass-border:          1px solid rgba(255, 255, 255, 0.75);
  --glass-border-hover:    1px solid rgba(0, 113, 227, 0.4);

  /* Shadows */
  --shadow-sm:             0 1px 3px rgba(0, 0, 0, 0.03);
  --shadow-md:             0 4px 16px rgba(0, 0, 0, 0.05);
  --shadow-lg:             0 8px 32px rgba(0, 0, 0, 0.06);
  --shadow-glow:           0 0 20px rgba(0, 113, 227, 0.30);
}
```

---

## 9. Visual Verification Protocol (Reticle MCP)

Every component must be verified using the Reticle MCP tools to guarantee zero dark regressions:

1. **Luminosity Verification:** Ensure page background evaluates to `#F5F5F7` / `#FFFFFF` with glowing colored mesh gradients visible behind translucent cards.
2. **Backdrop Filter Execution:** Confirm that `backdrop-filter: blur(40px)` actively blurs underlying text and gradients, creating the frosted glass effect rather than solid gray fill.
3. **Contrast Compliance:** All text must meet WCAG 2.2 AA (>= 4.5:1 for body copy `#1D1D1F` on `#FFFFFF` / `#F5F5F7`).
4. **Imagery Presence:** Verify all 6 project and architectural images render with 24px–32px rounded corners and zero distortion.
5. **Spacing & Alignment:** Confirm `padding: 120px 24px` on desktop sections, eliminating any cramped cards or overflowing text.
