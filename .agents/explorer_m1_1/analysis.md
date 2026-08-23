# Milestone 1.1 Architecture Report: Global Styling & Root Layout

**Author:** Explorer M1_1 (Global Styling & Layout Architect)  
**Date:** 2026-08-23  
**Working Directory:** `.agents/explorer_m1_1`  
**Target Files:** `src/styles/global.css` and `src/layouts/Layout.astro`  
**Reference Sources:** `apple_ui_inspiration.md`, `.agents/explorer_0_2/analysis.md`, `PROJECT.md`, `.agents/ORIGINAL_REQUEST.md`

---

## 1. Executive Summary & Aesthetic Architecture

This report delivers the exact, production-ready architectural implementation plan for **Global Styling (`src/styles/global.css`)** and the **Root Layout (`src/layouts/Layout.astro`)**.

### Paradigm Shift from Dark Obsidian to Bright Apple Fluid UI
- **Canvas:** Pure Apple system canvas light gray (`#F5F5F7`) and pure white (`#FFFFFF`) solid surfaces, completely replacing the legacy dark `#0d1117` palette.
- **Typography:** High-contrast pure Apple black (`#1D1D1F`) for headlines, display metrics, and primary text; `#424245` for crisp body copy; `#86868B` for timestamps and secondary tags.
- **Materials:** Authentic visionOS heavy glassmorphism utilizing `backdrop-filter: blur(40px) saturate(160%)`, asymmetric directional specular light borders (`border-top: 1px solid rgba(255,255,255,0.90)`, `border-left: 1px solid rgba(255,255,255,0.50)`), and inner specular light rims (`inset 0 1px 0 0 rgba(255,255,255,0.80)`).
- **Siri Glowing Mesh Gradients:** Four organic, glowing multi-point radial orbs (Apple Action Blue `#0071E3`, Siri Magenta/Violet `#AF52DE`, Warm Sunrise Gold `#FF9500`, and Mint Aqua `#00C7BE`) floating and drifting behind glass layers with gentle keyframe animations.
- **Accents:** Apple Action Blue (`#0071E3`) for primary CTA capsules, active navigation indicators, and focus outlines.

---

## 2. Master CSS Tokens Specification (`:root`)

```css
/* ============================================================
   APPLE DESIGN SYSTEM — DESIGN TOKENS (:root)
   Single source of truth for all visual tokens across portfolio
   ============================================================ */
:root {
  /* --- 1. Surfaces & Canvas --- */
  --apple-canvas:              #F5F5F7;
  --apple-canvas-subtle:       #FAFAFC;
  --apple-card-solid:          #FFFFFF;
  --apple-card-bg:             rgba(255, 255, 255, 0.65);
  --apple-card-elevated:       rgba(255, 255, 255, 0.85);
  --apple-glass-base:          rgba(255, 255, 255, 0.40);
  --apple-glass-elevated:      rgba(255, 255, 255, 0.60);
  --apple-glass-dock:          rgba(255, 255, 255, 0.70);
  --apple-glass-sheet:         rgba(255, 255, 255, 0.88);
  --apple-surface-subtle:      rgba(0, 0, 0, 0.02);
  --apple-surface-tint:        rgba(0, 113, 227, 0.06);

  /* --- 2. High-Contrast Apple Typography Scale --- */
  --apple-text-primary:        #1D1D1F; /* Pure Apple Black / Display & Titles */
  --apple-text-secondary:      #424245; /* Dark gray / Body copy & descriptions */
  --apple-text-tertiary:       #86868B; /* System gray / Subtitles, tags, dates */
  --apple-text-quaternary:     #A1A1A6; /* Inactive icons, subtle placeholders */
  --apple-text-on-accent:      #FFFFFF; /* White on saturated buttons/chips */

  /* --- 3. Apple Vivid Accents & System Tints --- */
  --apple-blue:                #0071E3; /* Apple signature action blue */
  --apple-blue-hover:          #0077ED;
  --apple-blue-active:         #0062C4;
  --apple-blue-subtle:         rgba(0, 113, 227, 0.08);
  --apple-blue-glow:           rgba(0, 113, 227, 0.30);
  
  --apple-purple:              #AF52DE; /* iOS 18 Siri Violet / Multi-agent badge */
  --apple-purple-subtle:       rgba(175, 82, 222, 0.10);
  --apple-purple-glow:         rgba(175, 82, 222, 0.30);

  --apple-rose:                #FF2D55; /* iOS 18 System Rose / Pink highlights */
  --apple-rose-subtle:         rgba(255, 45, 85, 0.10);

  --apple-cyan:                #32ADE6; /* visionOS Aqua / Telemetry & stream metrics */
  --apple-cyan-subtle:         rgba(50, 173, 230, 0.10);

  --apple-teal:                #00C7BE; /* Precision Agri / sensors */
  --apple-teal-subtle:         rgba(0, 199, 190, 0.10);

  --apple-emerald:             #34C759; /* Apple System Green / Live, Healthy status */
  --apple-emerald-subtle:      rgba(52, 199, 89, 0.12);

  --apple-amber:               #FF9500; /* Apple System Orange / Beta, In-Progress */
  --apple-amber-subtle:        rgba(255, 149, 0, 0.12);

  --apple-red:                 #FF3B30; /* Apple System Red / Error, Critical Alert */
  --apple-red-subtle:          rgba(255, 59, 48, 0.12);

  /* --- 4. Specular Hairline Borders & Edge Lighting --- */
  --apple-border:              rgba(0, 0, 0, 0.08);
  --apple-border-subtle:       rgba(0, 0, 0, 0.04);
  --apple-border-strong:       rgba(0, 0, 0, 0.12);
  --apple-border-specular:     rgba(255, 255, 255, 0.85); /* Top edge light reflection */
  --apple-border-specular-soft:rgba(255, 255, 255, 0.45); /* Left edge ambient reflection */
  --apple-border-active:       rgba(0, 113, 227, 0.40);

  /* --- 5. Ambient & Buoyant Shadows --- */
  --apple-shadow-sm:           0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
  --apple-shadow-ambient:      0 8px 32px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  --apple-shadow-hover:        0 20px 48px -8px rgba(0, 0, 0, 0.09), 0 2px 6px 0 rgba(0, 0, 0, 0.03);
  --apple-shadow-dock:         0 16px 40px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.6);
  --apple-shadow-modal:        0 32px 72px -16px rgba(0, 0, 0, 0.14), 0 4px 16px 0 rgba(0, 0, 0, 0.04);
  --apple-shadow-glow-blue:    0 8px 24px 0 rgba(0, 113, 227, 0.35);
  --apple-shadow-glow-purple:  0 8px 24px 0 rgba(175, 82, 222, 0.30);

  /* --- 6. Radii Scale --- */
  --apple-radius-xs:           6px;
  --apple-radius-sm:           10px;
  --apple-radius-md:           16px;
  --apple-radius-lg:           20px;
  --apple-radius-card:         28px;
  --apple-radius-hero:         32px;
  --apple-radius-pill:         9999px;

  /* --- 7. Typography Scale & Fonts --- */
  --font-apple:                -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif;
  --font-mono:                 "SF Mono", "JetBrains Mono", "Cascadia Code", ui-monospace, monospace;

  /* Modular Typography */
  --text-xs:                   clamp(0.72rem, 0.68rem + 0.15vw, 0.8125rem);
  --text-sm:                   clamp(0.85rem, 0.80rem + 0.2vw, 0.9375rem);
  --text-base:                 clamp(0.95rem, 0.90rem + 0.25vw, 1.0625rem);
  --text-lg:                   clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);
  --text-xl:                   clamp(1.35rem, 1.22rem + 0.5vw, 1.6rem);
  --text-2xl:                  clamp(1.65rem, 1.45rem + 0.8vw, 2.1rem);
  --text-3xl:                  clamp(2.0rem, 1.65rem + 1.4vw, 2.75rem);
  --text-4xl:                  clamp(2.5rem, 2.0rem + 2.0vw, 3.5rem);
  --text-5xl:                  clamp(3.0rem, 2.4rem + 3.0vw, 4.75rem);

  /* --- 8. Spacing Scale --- */
  --space-1:                   0.25rem;  /* 4px */
  --space-2:                   0.5rem;   /* 8px */
  --space-3:                   0.75rem;  /* 12px */
  --space-4:                   1rem;     /* 16px */
  --space-5:                   1.25rem;  /* 20px */
  --space-6:                   1.5rem;   /* 24px */
  --space-8:                   2rem;     /* 32px */
  --space-10:                  2.5rem;   /* 40px */
  --space-12:                  3rem;     /* 48px */
  --space-16:                  4rem;     /* 64px */
  --space-20:                  5rem;     /* 80px */
  --space-24:                  6rem;     /* 96px */
  --space-32:                  8rem;     /* 128px */
  --header-height:             72px;
  --max-width:                 1240px;
  --max-width-narrow:          880px;

  /* --- 9. Backward-Compatibility Aliases --- */
  --color-bg-primary:          var(--apple-canvas);
  --color-bg-secondary:        var(--apple-card-solid);
  --color-bg-tertiary:         var(--apple-card-bg);
  --color-bg-glass:            var(--apple-glass-base);
  --color-text-primary:        var(--apple-text-primary);
  --color-text-secondary:      var(--apple-text-secondary);
  --color-text-tertiary:       var(--apple-text-tertiary);
  --color-accent:              var(--apple-blue);
  --color-accent-hover:        var(--apple-blue-hover);
  --color-accent-glow:         var(--apple-blue-glow);
  --color-accent-subtle:       var(--apple-blue-subtle);
  --color-border:              var(--apple-border);
  --color-border-hover:        var(--apple-border-active);
  --color-success:             var(--apple-emerald);
  --color-warning:             var(--apple-amber);
  --color-error:               var(--apple-red);
}
```

---

## 3. VisionOS Glassmorphism & Material Utility Classes

```css
/* ============================================================
   VISIONOS GLASS MATERIALS & UTILITY CLASSES
   ============================================================ */

/* Utility 1: Subtle Ambient Glass (Chips, Overlays, Floating Labels) */
.apple-glass {
  background: rgba(255, 255, 255, 0.50);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.70);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.03), 
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

/* Utility 2: Core VisionOS Interactive Card (Projects, Workflows, Hermes, Skills) */
.apple-glass-card {
  background: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  backdrop-filter: blur(40px) saturate(160%);
  border-top: 1px solid rgba(255, 255, 255, 0.90);
  border-left: 1px solid rgba(255, 255, 255, 0.50);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.04),
    0 1px 2px 0 rgba(0, 0, 0, 0.02),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.80);
  border-radius: var(--apple-radius-card);
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 300ms ease,
              border-color 300ms ease;
}

.apple-glass-card:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-4px);
  box-shadow: 
    0 20px 48px -8px rgba(0, 0, 0, 0.08),
    0 2px 6px 0 rgba(0, 0, 0, 0.03),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.95);
}

/* Utility 3: Directional Specular Border */
.apple-specular-border {
  border-top: 1px solid rgba(255, 255, 255, 0.90);
  border-left: 1px solid rgba(255, 255, 255, 0.50);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.85);
}

/* Utility 4: Navigation Capsule Dock (Header Dock) */
.apple-glass-dock {
  background: rgba(255, 255, 255, 0.70);
  -webkit-backdrop-filter: blur(30px) saturate(170%);
  backdrop-filter: blur(30px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.80);
  box-shadow: 
    0 12px 36px -8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.95);
  border-radius: var(--apple-radius-pill);
}

/* Utility 5: Modal & Drawer Sheet Glass */
.apple-glass-sheet {
  background: rgba(255, 255, 255, 0.88);
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  backdrop-filter: blur(50px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 32px 72px -16px rgba(0, 0, 0, 0.14),
    0 4px 16px 0 rgba(0, 0, 0, 0.04),
    inset 0 1px 0 0 rgba(255, 255, 255, 1);
  border-radius: var(--apple-radius-hero);
}
```

---

## 4. Siri Glowing Mesh Gradient Background & Keyframe Animations

```css
/* ============================================================
   SIRI GLOWING MESH GRADIENT BACKGROUND & FLOATING ORBS
   ============================================================ */

.apple-mesh-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.apple-mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(95px);
  opacity: 0.50;
  will-change: transform;
  pointer-events: none;
}

/* Orb 1: Apple Action Blue & Cyan Glow */
.apple-mesh-orb--blue {
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, #38BDF8 0%, #0071E3 55%, transparent 75%);
  top: -12%;
  right: -5%;
  animation: float-orb-blue 16s ease-in-out infinite alternate;
}

/* Orb 2: Siri Magenta & Purple Glow */
.apple-mesh-orb--purple {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #F472B6 0%, #AF52DE 55%, transparent 75%);
  top: 35%;
  left: -10%;
  animation: float-orb-purple 20s ease-in-out infinite alternate;
}

/* Orb 3: Warm Sunrise Amber & Peach Glow */
.apple-mesh-orb--amber {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, #FDE68A 0%, #FF9500 50%, transparent 70%);
  top: 68%;
  right: 5%;
  animation: float-orb-amber 15s ease-in-out infinite alternate;
}

/* Orb 4: Mint & Aqua Teal Glow */
.apple-mesh-orb--teal {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #A7F3D0 0%, #00C7BE 50%, transparent 70%);
  bottom: -8%;
  left: 20%;
  animation: float-orb-teal 18s ease-in-out infinite alternate;
}

/* Float Animations with gentle translation & scaling */
@keyframes float-orb-blue {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-45px, 60px) scale(1.08); }
  100% { transform: translate(35px, -35px) scale(0.95); }
}

@keyframes float-orb-purple {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(60px, -50px) scale(1.10); }
  100% { transform: translate(-40px, 40px) scale(0.92); }
}

@keyframes float-orb-amber {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-50px, -40px) scale(1.06); }
  100% { transform: translate(30px, 50px) scale(0.96); }
}

@keyframes float-orb-teal {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, -45px) scale(1.08); }
  100% { transform: translate(-30px, 30px) scale(0.94); }
}
```

---

## 5. Apple Typography, Buttons, Badges & Custom Scrollbar

```css
/* ============================================================
   TYPOGRAPHY, BUTTONS, BADGES & INTERACTION HELPERS
   ============================================================ */

.apple-hero-headline {
  font-family: var(--font-apple);
  font-size: clamp(2.75rem, 2.2rem + 3.8vw, 5.0rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--apple-text-primary);
  text-wrap: balance;
}

.apple-section-headline {
  font-family: var(--font-apple);
  font-size: clamp(2.0rem, 1.6rem + 2.0vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--apple-text-primary);
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
  color: var(--apple-blue);
}

.apple-gradient-text {
  background: linear-gradient(135deg, #0071E3 0%, #AF52DE 50%, #FF2D55 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Primary Capsule Button */
.apple-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 26px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #FFFFFF;
  background: var(--apple-blue);
  border-radius: var(--apple-radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.35);
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
}

.apple-btn-primary:hover {
  background: var(--apple-blue-hover);
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 113, 227, 0.45);
}

.apple-btn-primary:active {
  background: var(--apple-blue-active);
  transform: scale(0.98);
}

/* Secondary Glass Capsule Button */
.apple-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 26px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--apple-text-primary);
  background: rgba(255, 255, 255, 0.70);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: var(--apple-radius-pill);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
}

.apple-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* Status Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: var(--apple-radius-pill);
}

.badge--live {
  background: var(--apple-emerald-subtle);
  color: var(--apple-emerald);
  border: 1px solid rgba(52, 199, 89, 0.30);
}

.badge--planning {
  background: var(--apple-amber-subtle);
  color: var(--apple-amber);
  border: 1px solid rgba(255, 149, 0, 0.30);
}

.badge--purple {
  background: var(--apple-purple-subtle);
  color: var(--apple-purple);
  border: 1px solid rgba(175, 82, 222, 0.30);
}

.badge--blue {
  background: var(--apple-blue-subtle);
  color: var(--apple-blue);
  border: 1px solid rgba(0, 113, 227, 0.30);
}

/* Custom Apple Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.16);
  border-radius: var(--apple-radius-pill);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.28);
}

html {
  scrollbar-color: rgba(0, 0, 0, 0.16) transparent;
  scrollbar-width: thin;
}

/* Selection */
::selection {
  background: rgba(0, 113, 227, 0.20);
  color: var(--apple-text-primary);
}

/* Focus Outline */
:focus-visible {
  outline: 2px solid var(--apple-blue);
  outline-offset: 3px;
  border-radius: var(--apple-radius-xs);
}

/* Scroll-reveal helper */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Accessibility Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }

  .apple-mesh-orb {
    animation: none !important;
  }
}
```

---

## 6. Complete Implementation Plan for `src/layouts/Layout.astro`

Here is the exact code definition for `src/layouts/Layout.astro`:

```astro
---
/**
 * src/layouts/Layout.astro — Master Apple-Themed Root Layout Wrapper
 * Features:
 * - Bright theme metadata (#F5F5F7, light color-scheme)
 * - SEO meta tags, OpenGraph cards, Twitter cards, canonical URL
 * - Rich Schema.org JSON-LD (Person + WebSite)
 * - Preloaded fonts (Inter & JetBrains Mono)
 * - Fixed Siri Glowing Mesh Gradient Background with 4 floating orbs
 * - Accessible skip-to-content link (#main-content)
 * - Header, default, and Footer slots
 * - Vanilla JS IntersectionObserver for scroll-reveal performance
 * - Magnetic Cursor Tracker island (client:idle)
 */
import MagneticCursorTracker from '../components/MagneticCursorTracker';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

const {
  title = 'Home',
  description = 'Naveen Bishnoi — AI Automation Engineer & Software Architect. Building production-grade systems with AI-first architecture, multi-agent frameworks, and precision craftsmanship.',
  ogImage = '/images/portfolio_hero.jpg',
  canonicalUrl = Astro.url.href,
  keywords = [
    'Naveen Bishnoi',
    'AI Automation Engineer',
    'Software Architect',
    'Multi-Agent Systems',
    'Hermes Telemetry',
    'Apple Fluid Interface',
    'Full-Stack Developer',
    'Python',
    'TypeScript',
    'Astro',
    'React'
  ],
} = Astro.props;

const siteName = 'Naveen Bishnoi';
const siteUrl = Astro.site ?? new URL(Astro.url.pathname, 'https://BishnoiNaveen.github.io');
const fullOgImage = new URL(ogImage, siteUrl).href;

/* JSON-LD Structured Data — Person + WebSite */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": siteName,
      "url": siteUrl.toString(),
      "description": description,
    },
    {
      "@type": "Person",
      "name": "Naveen Bishnoi",
      "url": siteUrl.toString(),
      "image": fullOgImage,
      "jobTitle": "AI Automation Engineer & Software Architect",
      "knowsAbout": [
        "AI Automation",
        "Multi-Agent Orchestration",
        "System Architecture",
        "Full-Stack Development",
        "Python",
        "TypeScript",
        "React",
        "Astro",
        "Vector Databases",
        "Precision Agriculture Telemetry"
      ],
      "sameAs": [
        "https://github.com/BishnoiNaveen",
        "https://www.linkedin.com/in/naveen-bishnoi-b0b00941a",
        "https://www.instagram.com/bishnoi_.naveen"
      ]
    }
  ]
};
---

<!doctype html>
<html lang="en">
  <head>
    <!-- ====== Critical Meta ====== -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="theme-color" content="#F5F5F7" />
    <meta name="color-scheme" content="light" />

    <!-- ====== SEO ====== -->
    <title>{title} | {siteName}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords.join(', ')} />
    <meta name="author" content="Naveen Bishnoi" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonicalUrl} />

    <!-- ====== Open Graph (Facebook / LinkedIn) ====== -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${title} | ${siteName}`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={fullOgImage} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:site_name" content={siteName} />

    <!-- ====== Twitter Card ====== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${title} | ${siteName}`} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={fullOgImage} />

    <!-- ====== Favicons ====== -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- ====== JSON-LD Structured Data ====== -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

    <!-- ====== Generator ====== -->
    <meta name="generator" content={Astro.generator} />

    <!-- ====== Preconnect and Preload Critical Fonts ====== -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&family=JetBrains+Mono:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&family=JetBrains+Mono:wght@400;500;600&display=swap" />

    <!-- ====== Global Apple CSS ====== -->
    <style is:global>
      @import '../styles/global.css';
    </style>
  </head>

  <body>
    <!-- Skip-to-content link for keyboard navigation (a11y) -->
    <a href="#main-content" class="skip-link sr-only" id="skip-nav">
      Skip to main content
    </a>

    <!-- ====== Siri Glowing Mesh Gradient Background Layer ====== -->
    <div class="apple-mesh-container" aria-hidden="true">
      <div class="apple-mesh-orb apple-mesh-orb--blue"></div>
      <div class="apple-mesh-orb apple-mesh-orb--purple"></div>
      <div class="apple-mesh-orb apple-mesh-orb--amber"></div>
      <div class="apple-mesh-orb apple-mesh-orb--teal"></div>
    </div>

    <!-- Header Slot -->
    <slot name="header" />

    <!-- Main Content -->
    <main id="main-content" tabindex="-1" class="relative z-10">
      <slot />
    </main>

    <!-- Footer Slot -->
    <slot name="footer" />

    <!-- Magnetic Cursor Follower -->
    <MagneticCursorTracker client:idle />

    <!-- ====== Scroll Reveal Observer ====== -->
    <script>
      if (typeof IntersectionObserver !== 'undefined') {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
          );

          document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        } else {
          document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        }
      }
    </script>
  </body>
</html>

<style is:global>
  /* Skip link — visible on focus */
  .skip-link:focus {
    position: fixed;
    top: var(--space-4, 1rem);
    left: var(--space-4, 1rem);
    width: auto;
    height: auto;
    padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
    clip: auto;
    overflow: visible;
    white-space: normal;
    background: var(--apple-blue, #0071E3);
    color: #FFFFFF;
    font-weight: 600;
    border-radius: var(--apple-radius-pill, 9999px);
    z-index: 9999;
    outline: 2px solid #FFFFFF;
    box-shadow: 0 8px 24px rgba(0, 113, 227, 0.40);
  }
</style>
```

---

## 7. Backward Compatibility & Step-by-Step Implementation Guide for Builder Agent

To ensure zero build errors and a smooth progressive enhancement:

1. **Step 1:** Create `src/styles/global.css` with all token definitions, glassmorphism classes, Siri orbs, button styles, and Apple light scrollbars.
2. **Step 2:** Update `src/styles/design-system.css` to import `./global.css` (or forward tokens) to prevent broken styles if any legacy component imports it.
3. **Step 3:** Create `src/layouts/Layout.astro` as specified above.
4. **Step 4:** Ensure `src/layouts/BaseLayout.astro` imports and forwards `Layout.astro` or is aliased so that existing references continue to work seamlessly.
5. **Step 5:** In `src/components/MagneticCursorTracker.tsx`, update the outer ring styling from dark violet to Apple Blue / light frosted ring (`border-[#0071E3]/50 bg-[#0071E3]/10`) to provide high contrast on the bright `#F5F5F7` background.
6. **Step 6:** Update `src/pages/index.astro` to import `Layout` from `../layouts/Layout.astro` and verify build with `npm run build`.

---

## 8. Reticle MCP Visual Verification Checklist

When the builder and inspector verify the site via Reticle:
- [ ] **Luminosity Check:** Page canvas is bright `#F5F5F7` / `#FFFFFF` with no dark void or muddy gray backgrounds.
- [ ] **Siri Orbs Presence:** 4 glowing gradient orbs are visible and slowly drifting in the background beneath glass cards.
- [ ] **Glassmorphism Blur:** `.apple-glass-card` and `.apple-glass-dock` show authentic frosted backdrop blur (`blur(40px)`).
- [ ] **Specular Edge Highlights:** Top and left card borders have sharp white light reflections (`border-top: 1px solid rgba(255, 255, 255, 0.90)`).
- [ ] **Contrast Compliance:** All typography is crisp `#1D1D1F` / `#424245` with WCAG AA compliance (> 4.5:1 ratio).
- [ ] **Zero Overlap / Perfect Alignment:** 120px desktop section vertical spacing with balanced horizontal padding.
