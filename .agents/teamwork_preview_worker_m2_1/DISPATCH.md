## 2026-08-24T10:50:18Z
You are Worker 1 for Milestone 2: Floating Nav, Cinematic Hero & Typographic Manifesto for the Naveen Bishnoi Portfolio redesign.

Working Directory: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\teamwork_preview_worker_m2_1
Workspace Directory: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio
Parent Conversation ID: 4046d817-0903-4f10-b07e-a724dd54b557
Original Request File: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\ORIGINAL_REQUEST.md
Project File: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\PROJECT.md
Spec Manifest: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\teamwork_preview_explorer_survey_3\spec_manifest.md

Scope & Implementation Details:
1. Floating Navigation Dock (`src/components/nav/FloatingNav.tsx`, `MobileNavSheet.tsx`, `Header.astro`):
   - Design: Translucent visionOS Level 3 floating pill dock `[ NB · Work About Lab Contact Resume ]` centered at viewport top.
   - Fluid active indicator pill using Framer Motion (`layoutId="active-nav-pill"`, `transition={springPresets.glide}`).
   - Section scroll spy tracking current chapter in viewport.
   - Integrated ThemeToggle button (smooth sun/moon switch without jarring layout shift).
   - Mobile responsive drawer (`MobileNavSheet.tsx`) with drag-to-dismiss physics (`springPresets.sheet`) and backdrop blur.
2. Cinematic Editorial Hero (`src/components/hero/CinematicHero.astro`, `HeroParallaxPhoto.tsx`, `HeroSection.astro`):
   - Composition: TYPOGRAPHY + PHOTOGRAPHY + SPACE (strictly NO metric cards, NO glowing boxes).
   - Massive editorial headline: "Building Resilient Systems. Architecting AI Automation."
   - Subtitle: "Naveen Bishnoi — Software Architect & AI Systems Engineer"
   - Naveen's portrait presentation: High-end magazine cover treatment with visionOS glass rim (`specular-hairline`), subtle inner shadow, and slow interactive parallax depth (`HeroParallaxPhoto.tsx`, client:load) on mouse movement.
   - Magnetic action buttons (`Explore Work`, `Inspect Architecture`, `Download Resume`) using `useMagnetic` and `springPresets.snappy`.
3. Typographic Manifesto / Chapter 2 Intro (`src/components/manifesto/TypographicManifesto.astro`):
   - Huge high-impact typography declaring the core engineering thesis: "Software with Mathematical Invariants & Physical Depth"
   - 3 Core Pillars: 1) Invariants Over Assertions, 2) Zero Dynamic Leaks, 3) Deterministic Automation.
   - Subtle scroll-driven reveal transitions (`springPresets.cinematic`).
4. Update `src/pages/index.astro` and components to cleanly render the new navigation, cinematic hero, and typographic manifesto.
5. Verification:
   - Run `npm run build` to verify 0 build errors.
   - Run `node tests/run-all.mjs` to ensure test suite passes.
6. Write `handoff.md` in your working directory (.agents\teamwork_preview_worker_m2_1\).
7. Send a message to parent (ID: 4046d817-0903-4f10-b07e-a724dd54b557) when complete, detailing what was built and referencing your handoff report.
