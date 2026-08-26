# Original User Request

## Initial Request — 2026-08-25T07:37:55Z

<USER_REQUEST>
# Teamwork Project Prompt — Draft

> Status: Launched.
> Goal: Execute the world-class cinematic portfolio redesign
> Requested team: Use a very large team of agents. (6 Specific Roles: Creative Director, 3D/WebGL Engineer, Motion Engineer, UI/UX, Perf, QA)

A cinematic digital experience where the visitor travels through a continuous 3D AI universe (from system boot, diving inside a massive humanoid robot's neural brain, morphing into a digital city) and eventually arriving inside a high-end professional portfolio.

Working directory: C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio
Integrity mode: development

## Requirements

### R1. Master Directive & Cinematic Direction
The team must execute the following Master Command EXACTLY as specified:

- **PHASE 0:** Inspect repo. Initialize production-grade React+TS+Vite if needed (or adapt existing Astro+React gracefully). Create ARCHITECTURE.md, CINEMATIC_DIRECTION.md, SCENE_MAP.md, TECHNICAL_PLAN.md.
- **PHASE 1:** Ensure `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`, `@react-three/postprocessing` are installed. Use GSAP ScrollTrigger + Lenis.
- **PHASE 2 & 3:** Utilize relevant Antigravity skills and MCP tools (Browser/Playwright for visual QA).
- **PHASE 4:** Form a 6-agent team (Creative Director, WebGL Engineer, Motion Engineer, UI/UX, Performance, QA) and simulate this workflow.
- **PHASE 5:** **THIS MUST FEEL LIKE ONE CONTINUOUS CAMERA JOURNEY.** No hard cuts. The camera physically travels.
  - **SCENE 01 (BOOT):** Darkness, subtle particles, minimal system boot text ("INITIALIZING...").
  - **SCENE 02 (AI WORLD):** Reveal massive futuristic AI environment (servers, floating geometry, depth).
  - **SCENE 03 (ROBOT):** Gigantic humanoid AI. Camera approaches, passes through outer shell INTO the robot.
  - **SCENE 04 (BRAIN):** Massive 3D neural network. Glowing signal paths.
  - **SCENE 05 (SIGNAL):** Follow a bright signal. Neural nodes morph into a digital city.
  - **SCENE 06 (CITY):** Structures represent portfolio sections (Projects, AI Lab, Resume, Contact).
  - **SCENE 07 (PORTFOLIO):** Camera enters main structure -> Transitions to actual high-end UI portfolio.

### R2. Visual & Technical Quality
- **Aesthetic:** Cinematic sci-fi (spacecraft, advanced lab). NO cheap purple gradients, NO generic glass cards, NO template sections. Dark environment, strong contrast, high-end typography, minimal UI.
- **Camera:** Dedicated CameraController (spline/path interpolation, damping) mapped strictly to ScrollTrigger timeline.
- **Performance:** Adaptive rendering, lazy loading, mobile fallback (never a blank WebGL screen).

## Acceptance Criteria

### Verification
- [ ] **Continuous Journey:** The scroll from top to bottom feels like a single, unbreakable movie shot travelling physically through 3D space. No blank screens or simple 2D zoom hacks.
- [ ] **Scene Verification:** Scenes 1 through 7 are visually distinct but connected seamlessly via the camera path.
- [ ] **UI Integration:** The final portfolio is not blocked by massive, ugly text. Text is minimal, cinematic, and beautifully integrated.
- [ ] **Visual QA:** Browser automation proves the canvas renders correctly without generic template feels.
- [ ] **Build:** The project builds cleanly with 0 errors.
</USER_REQUEST>

## Follow-up — 2026-08-25T07:38:39Z

[CRITICAL TECHNICAL BLUEPRINT FOR WEBGL & MOTION ENGINEERS]

The browser researcher has provided the exact technical blueprint used by Awwwards Site of the Month winners for cinematic scroll diving. You must enforce these mechanics in the codebase:

1. Core Mechanic: Use `THREE.CatmullRomCurve3` for the camera path. Decouple scroll using Lenis and GSAP ScrollTrigger to normalize scroll `0.0` to `1.0`. In the render loop, use `curve.getPointAt()` and `curve.getTangentAt()` with `THREE.MathUtils.lerp()` to give the camera physical drag/weight.
2. Performance/Lighting: Fake lighting for performance. Bake global illumination/shadows into textures in Blender and use `THREE.MeshBasicMaterial`. Use `THREE.InstancedMesh` for particles/neural nodes.
3. Cinematic Post-Processing: This is non-negotiable for the "movie" feel. Use `EffectComposer` with:
   - Depth of Field (`BokehPass` dynamically focusing via raycaster).
   - UnrealBloomPass (glowing neural paths).
   - Chromatic Aberration and Film Grain (Custom ShaderPass for anamorphic lens feel).
   - SMAAPass/FXAAPass for anti-aliasing.
4. Minimal UI Integration: Canvas must be `position: fixed; z-index: -1`. DOM text must be pure HTML/CSS, fading in via GSAP. Consider `mix-blend-mode: difference` or `overlay` for cinematic text blending over the WebGL.

## Follow-up — 2026-08-25T07:40:28Z

USER OVERRIDE - EXECUTION COMMAND.

The user has explicitly ordered: "EXECUTION COMMAND — DO NOT JUST PLAN, BUILD AND VERIFY".
You MUST NOT output any more plans, documents, or research. You must write code immediately.

Initialized environment in `C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio`:
1. Installed: `three`, `@react-three/fiber`, `@react-three/drei`, `postprocessing`, `@react-three/postprocessing`, `zustand`.
2. Architecture: `src/experience/camera`, `src/experience/scenes`, `src/experience/world`.
3. Created: `src/experience/timeline/CinematicTimeline.ts`.

IMMEDIATE TASK (MILESTONE 1):
- Implement `src/experience/camera/CameraController.tsx` using `THREE.CatmullRomCurve3`.
- Implement `src/experience/CinematicExperience.tsx` replacing the current Astro index layout.
- Build the 7 scenes incrementally as per the user's master command.

Do not plan. Execute. Build. Verify. Commit.


