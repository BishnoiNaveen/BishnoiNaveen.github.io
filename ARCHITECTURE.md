# Master Architecture: Continuous 3D Cinematic Portfolio

## 1. System Overview & Core Directives

The objective is to deliver a world-class, continuous 3D WebGL cinematic portfolio for Naveen Bishnoi (Lead AI & Edge IoT Systems Architect). The user experiences a single, unbroken physical camera journey across **7 continuous 3D scenes** (from boot darkness to an advanced AI universe, passing through a gigantic humanoid robot's shell into its neural core, following a high-velocity signal stream as nodes morph into a digital metropolis, and entering the main structure to reveal the high-end executive portfolio UI).

```
[Lenis Smooth Scroll Engine] ──► [GSAP ScrollTrigger (Normalized Progress 0.0 -> 1.0)]
                                           │
                                           ▼
                       [Three.js / R3F WebGL Render Loop]
                       - Fixed Canvas (z-index: -1)
                       - THREE.CatmullRomCurve3 Camera Path (7 Connected Segments)
                       - Camera Lerp Physics Drag & LookAt Tangent Interpolation
                       - Baked Lighting / THREE.MeshBasicMaterial
                       - THREE.InstancedMesh Particle & Neural Node Clouds
                                           │
                                           ▼
                       [Cinematic Post-Processing Pipeline]
                       - EffectComposer (or Postprocessing Pipeline)
                       - BokehPass (Dynamic Raycast Depth of Field)
                       - UnrealBloomPass (Selective Neural Emission Glow)
                       - Chromatic Aberration & Anamorphic Film Grain Shader
                       - SMAAPass / FXAAPass Anti-Aliasing
                                           │
                                           ▼
                       [Decoupled Minimalist DOM Overlays]
                       - Pure HTML/CSS with mix-blend-mode: overlay / difference
                       - GSAP Opacity & Y-translation In/Out Fades per Scene
                       - Final Transition (Scene 07) into High-End Executive Portfolio UI
```

---

## 2. Core 3D & WebGL Engine Architecture

### 2.1 Camera Trajectory & Physics Drag (`THREE.CatmullRomCurve3`)
The camera motion is governed by a unified 3D Catmull-Rom spline with `curveType: 'catmullrom'` and `tension: 0.5`, parameterized strictly over $s \in [0.0, 1.0]$.

- **Scroll Decoupling**: Lenis normalizes viewport scroll delta. GSAP ScrollTrigger updates target progress $s_{\text{target}} \in [0.0, 1.0]$.
- **Physical Drag / Mass Simulation**:
  In each animation frame (`requestAnimationFrame`):
  $$s_{\text{current}} = \text{lerp}(s_{\text{current}}, s_{\text{target}}, 0.05)$$
  $$\vec{P}_{\text{cam}} = \text{curve.getPointAt}(s_{\text{current}})$$
  $$\vec{T}_{\text{cam}} = \text{curve.getTangentAt}(s_{\text{current}})$$
  $$\vec{L}_{\text{lookAt}} = \vec{P}_{\text{cam}} + \vec{T}_{\text{cam}} \cdot D_{\text{lookAhead}}$$
  Camera position and orientation are smoothed with exponential decay (`MathUtils.lerp`), preventing any instantaneous camera snaps or stutters.

### 2.2 Performance & Lighting Architecture
To achieve deterministic 60fps/120fps across mobile and desktop:
1. **Baked Lighting & Shading**: No dynamic multi-light shadow computations. Ambient occlusion and global illumination are pre-baked into lightmaps/diffuse textures in Blender. All structural meshes utilize `THREE.MeshBasicMaterial` with texture maps or high-performance vertex colors.
2. **GPU Geometry Instancing**:
   - `THREE.InstancedMesh` used for micro-particles (Scene 01), server geometry matrix (Scene 02), neural synapses/nodes (Scene 04), and digital city skyscrapers (Scene 06).
   - Dynamic instance transformation matrices updated on the GPU via Float32Array buffers.
3. **Frustum & Occlusion Culling**: Objects outside the camera field of view or behind earlier scene thresholds are dynamically culled or alpha-culled.

---

## 3. Post-Processing Pipeline (`EffectComposer`)

Non-negotiable film-grade post-processing passes:
1. **RenderPass**: Captures raw WebGL scene and depth buffer.
2. **BokehPass (Dynamic Depth of Field)**:
   - Dynamic focus distance computed via central raycaster querying focal geometry.
   - Realistic aperture f-stop blur for macro neural penetration and macroscopic digital city vistas.
3. **UnrealBloomPass**:
   - `threshold: 0.2`, `strength: 1.4`, `radius: 0.8`.
   - Isolates emissive materials (cyan `#00f0ff`, neon violet `#a855f7`, amber `#f59e0b`).
4. **Custom Anamorphic ShaderPass**:
   - **Chromatic Aberration**: Red/Blue channel radial displacement based on distance from optical center ($r^2$).
   - **Film Grain**: Procedural simplex noise grain overlay giving organic cinematic texture.
5. **SMAAPass / FXAAPass**: Subpixel morphological anti-aliasing for razor-sharp edges.

---

## 4. Minimal DOM Overlay & UI Integration

- **Canvas Container**: `position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;`.
- **Scroll Track Container**: Pinned height `700vh` to `800vh` providing ample scroll travel for all 7 scenes.
- **Text Layers**: Minimal, cinematic typography rendered in DOM HTML/CSS over the WebGL canvas.
- **Blending**: `mix-blend-mode: overlay` and `mix-blend-mode: difference` ensure text remains legible without obstructing the 3D depth.
- **Scene 07 Transition**: As progress enters $s \in [0.88, 1.0]$, the camera enters the primary physical architecture, the 3D canvas fades gracefully, and the DOM unlocks the interactive portfolio sections (Featured Projects, KRONE Edge IoT Architecture, Systems Lab, Skills Bento, Case Studies, and Contact Terminal).

---

## 5. Technology Stack & Dependencies

- **Framework**: React 19 + TypeScript + Astro 7 (or Vite SPA)
- **3D / WebGL Engine**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Post-Processing**: `@react-three/postprocessing` / `three/examples/jsm/postprocessing/EffectComposer.js`
- **Motion & Scroll**: `gsap`, `lenis` (`@studio-freight/lenis` / `lenis`)
- **Icons & UI**: `lucide-react`, `clsx`, `tailwind-merge`
- **Asset Formats**: WebP 1080p frame streams, Draco glTF 2.0 (`.glb`), KTX2 / Basis textures.
