# Cinematic Direction — Naveen Bishnoi Portfolio

> Creative Director deliverable. Defines the visual language, scene composition,
> transitions, lighting, and camera choreography of the scroll-driven 3D journey.
> This document governs every scene in `src/experience/`. Implementation status
> is tracked per milestone.

## 1. North Star

The site must feel like **one continuous science-fiction film controlled by scroll**,
not a website with decorative 3D. The visitor does not "scroll a page" — they fly a
camera through a single coherent world that begins in the void and ends inside the
portfolio interface.

Hard rule (from the brief): **no fake camera movement**. The camera has real XYZ
position along a Catmull-Rom spline (`src/experience/camera/splineData.ts`). It
travels ~192 world units from `z:45` (void) to `z:-135` (inner sanctum). Foreground,
midground, and background objects all exist in the same world, so relative depth
shifts naturally as the camera moves.

## 2. Visual Language

Target:
- cinematic sci-fi, advanced AI laboratory, digital consciousness
- futuristic spacecraft / high-end creative-technology studio

Forbidden:
- generic AI-website purple-gradient overload
- glassmorphism everywhere
- stock robot imagery / random low-poly robot model dropped in
- giant glowing cards / template-portfolio grids
- huge paragraphs of body text

Palette (locked):
- void / base: `#030712`
- cyan signal: `#00f0ff`
- violet core: `#8b5cf6`
- amber reactor: `#f59e0b`
- emerald terminal: `#10b981`

Typography: Inter (display/UI) + JetBrains Mono (telemetry/HUD). High contrast,
generous whitespace, minimal on-screen system text. Boot text never covers the screen.

## 3. One Master Timeline

There is exactly **one** timeline (`src/experience/timeline/CinematicTimeline.ts`,
zustand store). Scroll progress `0.0 → 1.0` is the single source of truth, driven by
Lenis + GSAP ScrollTrigger (`scrub`), then smoothed into a continuous camera progress
inside `CameraController`. No scene listens to its own independent scroll listener.

Scene progress windows (tuned, not fixed):
| Scene | Range | Camera beat |
|-------|-------|-------------|
| 01 Void Boot | 0.00–0.14 | idle in the void, identity reveal |
| 02 AI Megalith | 0.14–0.28 | crane up through server corridors |
| 03 Humanoid Titan | 0.28–0.44 | approach + penetrate the robot |
| 04 Synaptic Brain | 0.44–0.60 | dive into 3D neural matrix |
| 05 Signal & Morph | 0.60–0.74 | ride the photon, nodes → towers |
| 06 Digital Metropolis | 0.74–0.88 | flyover the portfolio city |
| 07 Inner Sanctum | 0.88–1.00 | portal arrival → dissolve to UI |

## 4. Scene Composition & Lighting

- **01 Boot** — near-black ambient (intensity 0.25), 280 instanced drifting
  micro-particles, dual pulsing wireframe geodesics. Minimal HUD: "INITIALIZING…
  NAVEEN BISHNOI". Fades out as the camera departs.
- **02 AI World** — enormous scale via two flanking corridors of 48 instanced
  server monoliths + orbital telemetry rings + ground depth grid. Camera cranes up.
- **03 Robot** — gigantic humanoid built from primitive volumes (no bad external
  model). Triple counter-rotating gimbal rings; armor plates slide apart
  (aperture open 0.34→0.42) so the camera physically enters the chest.
- **04 Brain** — 96 Fibonacci-distributed synaptic nodes (instanced) + k-nearest
  axon lines + bioluminescent firing pulses. Real 3D volume, camera flies through.
- **05 Signal** — leading photon + 180 warp streaks; morph factor stretches neural
  nodes into 36 skyscraper pylons. Continuous, no cut.
- **06 City** — 128 instanced towers in a canyon + 4 discipline megaliths
  (Projects / Lab / Resume / Contact) with skyward beacon lasers.
- **07 Sanctum** — 7 concentric portal arches → light flare → canvas opacity fades
  to 0 and the editorial portfolio UI is revealed beneath.

## 5. Camera Choreography

- Physical spline travel with exponential-lerp drag (weight, no snapping).
- LookAt is a blended spline target + tangent look-ahead (camera leads, not just
  follows).
- Per-scene FOV modulation (45→60→45) for breathing.
- Subtle pointer parallax damping (disabled under reduced-motion).
- Reverse scroll is fully supported — progress is monotonic-lerp toward target, so
  scrolling up rewinds the same continuous path.

## 6. Performance & Accessibility

- Adaptive DPR `[1, min(devicePixelRatio, 2)]`; antialias off (SMAA in post).
- Post-processing (Bloom / DoF / Chromatic Aberration / Vignette / Grain / SMAA)
  disabled under `prefers-reduced-motion`.
- WebGL fallback: if context creation fails, a static 2D core message shows and the
  full portfolio UI remains accessible (no blank page).
- All narrative content exists in the DOM (overlay + editorial chapters); WebGL
  enhances, never hides, the portfolio from a11y tools.

## 7. Milestone Status

- **M1 — Cinematic Prototype (DONE, committed `2adf589`)**
  - Wired `CinematicExperience` into `index.astro` (`client:only="react"`, 700vh track).
  - Canvas fades fully out at journey end → editorial portfolio reveal.
  - Verified: `astro build` green; canvas mounts; boot identity shows; portfolio
    reveals; camera path proven to travel 192 world units in XYZ.
  - Console clean of code errors (only sandbox-blocked Google-Font 504s remain).
- **M2 — Portfolio Arrival & Navigation Integration (DONE)**
  - **Performance Engineer**: `src/experience/quality/useQualityTier.ts` — adaptive
    `high/medium/low` tiers from device cores/RAM/DPR/mobile/reduced-motion. Drives
    Canvas `dpr`, post-processing on/off, and per-scene particle counts
    (boot/brain/signal scale by tier). `Q:<tier>` badge shown in HUD.
  - **UI/UX Engineer**: `src/experience/overlay/CityDestinations.tsx` — the four
    digital-city discipline megaliths (PROJECTS / AI LAB / RESUME / CONTACT) become
    real, clickable destinations during Scene 06. Clicking routes through a
    Lenis-aware scroll helper into the matching portfolio section (verified:
    clicking PROJECTS lands `#work` at viewport top).
  - **Audio**: `src/experience/audio/useAudioEngine.ts` — optional procedural WebAudio
    ambience (drone + motion-reactive shimmer). OFF by default; SOUND ON/OFF toggle
    requires explicit user gesture; no autoplay; zero third-party audio URLs.
  - Verified: `astro build` green; canvas mounts; SOUND off by default; Q badge
    detected; 4 city buttons render in city window + navigate; console clean of code
    errors (only sandbox-blocked Google-Font 504s remain).
- **M3+ — pending:** per-scene visual polish on real GPU, reduced-motion fallback UI
  path verification, mobile quality-mode visual QA, and the separate portfolio routes
  (/projects, /lab, /resume, /contact) cross-linking back into the journey.
