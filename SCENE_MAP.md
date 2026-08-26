# 7-Scene Continuous Camera Journey Map

## Overview

The entire 3D experience unfolds across 7 seamless acts mapped strictly to normalized scroll progress $s \in [0.0, 1.0]$. The camera follows an unbroken `THREE.CatmullRomCurve3` spline trajectory through 3D space.

```
[0.00 - 0.14] SCENE 01: THE VOID BOOT
      │
      ▼
[0.14 - 0.28] SCENE 02: THE AI MEGALITH
      │
      ▼
[0.28 - 0.44] SCENE 03: THE HUMANOID TITAN
      │
      ▼
[0.44 - 0.60] SCENE 04: THE SYNAPTIC BRAIN
      │
      ▼
[0.60 - 0.74] SCENE 05: THE SIGNAL & MORPH
      │
      ▼
[0.74 - 0.88] SCENE 06: THE DIGITAL METROPOLIS
      │
      ▼
[0.88 - 1.00] SCENE 07: THE INNER SANCTUM (PORTFOLIO UI)
```

---

## Detailed Scene Breakdown

### SCENE 01: The Void Boot
- **Scroll Range**: $s \in [0.00, 0.14]$
- **Camera Path**: $(0, 0, 45) \to (0, 0, 38)$ (Gentle forward drift)
- **3D Visual Elements**:
  - Deep space obsidian void (`#030712`).
  - Subtle drifting micro-particles (`THREE.InstancedMesh` with 250 subtle cyan/silver motes).
  - Distant faint optical horizon.
- **Lighting & Post-Processing**: Dark atmosphere, high depth of field blur on background, subtle bloom on particle glints.
- **DOM Overlay Text**:
  - Eyebrow: `SYS.BOOT // KERNEL v7.4.2`
  - Headline: `INITIALIZING NEURAL CORE...`
  - Monospace Telemetry: `COORDINATES: 28.6139° N, 77.2090° E // BUFFER: 100% OK`
  - Interaction Cue: `[ SCROLL TO COMMENCE CAMERA JOURNEY ]`

---

### SCENE 02: The AI Megalith
- **Scroll Range**: $s \in [0.14, 0.28]$
- **Camera Path**: $(0, 0, 38) \to (8, 6, 26)$ (Crane ascent & tilt)
- **3D Visual Elements**:
  - Horizon opens to reveal a massive futuristic AI environment.
  - Floating server monoliths with pulsating circuit traces.
  - Infinite procedural depth grid in ground plane.
- **Lighting & Post-Processing**: Volumetric rim lighting, cool cyan/violet ambient fill, bloom expanding across server LED banks.
- **DOM Overlay Text**:
  - Eyebrow: `ENVIRONMENT // SECTOR 0`
  - Headline: `THE DISTRIBUTED AI UNIVERSE`
  - Subtitle: `Autonomous Systems · BFT Consensus · Edge Telematics`

---

### SCENE 03: The Humanoid Titan
- **Scroll Range**: $s \in [0.28, 0.44]$
- **Camera Path**: $(8, 6, 26) \to (0, 2, 8) \to (0, 1.2, 0.5)$ (Approaching & penetrating outer shell)
- **3D Visual Elements**:
  - Gigantic humanoid AI android / robotic titan standing in the center.
  - Counter-rotating gimbal aperture rings, mechanical exoskeleton plates, and optical core sensors.
  - Camera approaches chest/cranial aperture; exoskeleton plates slide open as camera penetrates directly through the metallic lattice.
- **Lighting & Post-Processing**: Amber and cyan key lights, chromatic aberration spike during metal shell pass-through.
- **DOM Overlay Text**:
  - Eyebrow: `STRUCTURAL SCAN // TARGET LOCKED`
  - Headline: `HUMANOID AI PLATFORM`
  - Subtitle: `Deep Hardware-Software Convergence · Low-Level Kernel Architecture`

---

### SCENE 04: The Synaptic Brain
- **Scroll Range**: $s \in [0.44, 0.60]$
- **Camera Path**: $(0, 1.2, 0.5) \to (-3, -1, -12) \to (0, 0, -25)$ (Macro interior navigation)
- **3D Visual Elements**:
  - Vast 3D neural network matrix inside the robot's brain.
  - 84+ Fibonacci spherical synaptic nodes (`THREE.InstancedMesh`) connected by 3D glowing Bezier axon pathways.
  - Rhythmic bioluminescent signal pulses firing across pathways.
- **Lighting & Post-Processing**: Intense selective UnrealBloomPass on firing nodes; tight macro BokehPass depth of field.
- **DOM Overlay Text**:
  - Eyebrow: `NEURAL CORE // ACTIVE LINK`
  - Headline: `HIGH-FREQUENCY SYNAPTIC MATRIX`
  - Telemetry: `LATENCY: 0.12ms · INGEST: 50Hz · SAFETY: POSIX ATOMIC`

---

### SCENE 05: The Signal & Morph
- **Scroll Range**: $s \in [0.60, 0.74]$
- **Camera Path**: $(0, 0, -25) \to (4, -2, -45) \to (0, 8, -65)$ (High-velocity pursuit & climb)
- **3D Visual Elements**:
  - Camera locks onto and chases a brilliant, high-velocity photon electrical signal.
  - Particle trails stream past the lens (warp speed effect).
  - Neural nodes dynamically expand, elongate, and morph into structural skyscraper columns.
- **Lighting & Post-Processing**: Anamorphic streaks, maximum bloom saturation, dynamic motion blur and chromatic aberration.
- **DOM Overlay Text**:
  - Eyebrow: `DYNAMIC MORPH // PHASE TRANSITION`
  - Headline: `SIGNAL VELOCITY ACCELERATION`
  - Subtitle: `Synaptic Nodes Transforming to Digital Infrastructure`

---

### SCENE 06: The Digital Metropolis
- **Scroll Range**: $s \in [0.74, 0.88]$
- **Camera Path**: $(0, 8, -65) \to (0, 18, -95) \to (0, 4, -115)$ (Epic panoramic flyover)
- **3D Visual Elements**:
  - Sprawling cybernetic digital city with towering data skyscrapers.
  - Towering monoliths represent core portfolio pillars:
    - **Tower 1**: Flagship Projects (GAMS, KRONE IoT, Aeonis, Ultron, Sentinel AI)
    - **Tower 2**: Systems Architecture & Distributed Lab
    - **Tower 3**: Engineering Pedigree & Verified Resume
    - **Tower 4**: Communication Hub & Contact Terminal
- **Lighting & Post-Processing**: Panoramic horizon fog, golden amber and cyan neon ground grid, wide-angle cinematic perspective.
- **DOM Overlay Text**:
  - Eyebrow: `METROPOLIS // PORTFOLIO TOPOLOGY`
  - Headline: `ARCHITECTURAL ECOSYSTEM`
  - Subtitle: `Every Tower Houses a Core Production Discipline`

---

### SCENE 07: The Inner Sanctum (Portfolio UI)
- **Scroll Range**: $s \in [0.88, 1.00]$
- **Camera Path**: $(0, 4, -115) \to (0, 0, -135)$ (Gliding into central grand entrance)
- **3D Visual Elements**:
  - Camera glides through the glass and titanium grand entrance portico into the executive interior.
  - Radiant optical breakthrough flare seamlessly transitions WebGL canvas opacity into the clean, rich executive portfolio interface.
- **DOM Overlay & Portfolio UI**:
  - WebGL Canvas gently fades to `opacity: 0.15` (background ambient grid).
  - Full interactive executive showcase unlocks:
    1. **Featured Engineering Projects** (7 deep-dive case studies with live interactive memory/telemetry visualizers).
    2. **KRONE Edge IoT Telematics Architecture** (Live 50Hz CAN platform breakdown).
    3. **The Systems Lab** (Interactive DAG Inspector, AST Taint Sandbox, Inode Crash Simulator).
    4. **Competency Bento Grid** (Systems, AI/Edge, Full-Stack, Infrastructure).
    5. **Direct Communication & Terminal** (Verified email copy, resume download).
