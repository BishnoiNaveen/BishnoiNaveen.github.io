## 2026-08-25T07:40:49Z

<USER_REQUEST>
You are the Lead 3D/WebGL & Frontend Systems Worker (`teamwork_preview_worker`) on the Cinematic Portfolio Redesign project.

Your working directory: C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\teamwork_preview_worker_m1_1
Workspace root: C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio

MANDATORY FIRST STEP: Read the authoritative user request at:
C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\ORIGINAL_REQUEST.md
Also review:
C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\ARCHITECTURE.md
C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\SCENE_MAP.md
C:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\CINEMATIC_DIRECTION.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL TASK REQUIREMENTS:
The user has issued an explicit execution directive: Build the continuous 3D camera journey across 7 scenes now.

1. Dependencies:
   Ensure all required dependencies (`three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis` or `@studio-freight/lenis`, `@react-three/postprocessing`, `postprocessing`, `lucide-react`, `clsx`, `tailwind-merge`) are properly installed and configured in `package.json`.

2. Camera Controller (`src/experience/camera/CameraController.tsx`):
   - Implement continuous camera spline using `THREE.CatmullRomCurve3` across the 7-scene coordinate waypoints defined in `SCENE_MAP.md`.
   - Bind Lenis smooth scroll and GSAP ScrollTrigger to normalize scroll progress strictly `0.0` to `1.0`.
   - In the render loop (useFrame / rAF), use `curve.getPointAt()` and `curve.getTangentAt()` with `THREE.MathUtils.lerp()` to give the camera physical drag/weight and lookAhead tracking.

3. 7-Scene Continuous 3D Experience:
   Implement procedural WebGL 3D scenes in `src/experience/scenes/`:
   - `Scene01Boot.tsx`: Pitch black void, drifting instanced micro-particles, subtle ambient glow.
   - `Scene02AIWorld.tsx`: Revealing futuristic AI universe, floating server monoliths, procedural ground grid depth.
   - `Scene03Robot.tsx`: Gigantic humanoid AI figure, rotating gimbal rings, metallic exoskeleton aperture penetration.
   - `Scene04Brain.tsx`: Massive 3D neural network, 84+ Fibonacci spherical nodes (`THREE.InstancedMesh`) with pulsing axon Bezier curves.
   - `Scene05Signal.tsx`: High-velocity electric signal tracking, warp particle streaks, node-to-skyscraper column morph.
   - `Scene06City.tsx`: Sprawling cybernetic digital city with towers representing portfolio pillars (Projects, AI Lab, Resume, Contact).
   - `Scene07Portfolio.tsx`: Grand entrance portico penetration, optical light flare, and transition into the interactive portfolio.

4. Cinematic Post-Processing (`src/experience/postprocessing/PostProcessingPipeline.tsx`):
   - Setup `EffectComposer` with:
     - `BokehPass` / Depth of Field dynamically focusing on focal geometry.
     - `UnrealBloomPass` for selective neural path and core emission glow.
     - Chromatic Aberration & Film Grain (custom shader or pass).
     - `SMAAPass` / `FXAAPass` for anti-aliasing.

5. Minimal DOM Overlays (`src/experience/overlay/CinematicOverlay.tsx`):
   - Pure HTML/CSS text overlays styled with `mix-blend-mode: overlay` / `difference`.
   - GSAP ScrollTrigger timeline smoothly fading text in and out for each of the 7 scenes according to the scroll ranges in `SCENE_MAP.md`.
   - Minimalist Swiss/sci-fi typography, coordinate telemetry, system boot badges.

6. Master Experience Integration (`src/experience/CinematicExperience.tsx` & `src/pages/index.astro`):
   - Canvas fixed at `position: fixed; inset: 0; z-index: -1; pointer-events: none;`.
   - Scroll track container pinned for smooth scrubbing.
   - Smooth unpinning and transition in Scene 07 directly into Naveen's executive portfolio sections (Featured Projects, KRONE IoT, Systems Lab, Skills Bento, Contact).

7. Verification:
   - Run `npm run build` to ensure the entire application compiles with 0 errors.
   - Run `npm test` to verify all tests pass.
   - Provide a complete handoff report in `.agents/teamwork_preview_worker_m1_1/handoff.md` with build logs, test logs, code files created/modified, and verification commands.

When finished, use `send_message` to report completion.
</USER_REQUEST>
