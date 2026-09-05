/**
 * src/experience/shaders/materials.ts
 * Custom PBR and ShaderMaterial instances for cinematic scenes.
 * All materials are memoized and reusable across quality tiers.
 */

import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderChunks, commonUniforms } from './shaderChunks';

// Register custom materials with R3F so they can be used in JSX
declare module '@react-three/fiber' {
  interface ThreeElements {
    quantumCoreMaterial: React.ThreeElements['meshPhysicalMaterial'];
    circuitMonolithMaterial: React.ThreeElements['meshPhysicalMaterial'];
    irisApertureMaterial: React.ThreeElements['shaderMaterial'];
    neuralNodeMaterial: React.ThreeElements['shaderMaterial'];
    axonLineMaterial: React.ThreeElements['shaderMaterial'];
    neuralPulseMaterial: React.ThreeElements['shaderMaterial'];
    warpStreakMaterial: React.ThreeElements['shaderMaterial'];
    morphPillarMaterial: React.ThreeElements['shaderMaterial'];
    cityBuildingMaterial: React.ThreeElements['meshPhysicalMaterial'];
    cityWireframeMaterial: React.ThreeElements['shaderMaterial'];
    portalArchMaterial: React.ThreeElements['meshPhysicalMaterial'];
    portalFlareMaterial: React.ThreeElements['shaderMaterial'];
  }
}

// ─────────────────────────────────────────────────────────────
// SCENE 01: QUANTUM CORE MATERIAL (subsurface + emission)
// ─────────────────────────────────────────────────────────────
const quantumCoreVertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const quantumCoreFragment = /* glsl */`
  ${shaderChunks.fresnel}
  ${shaderChunks.pulse}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uCoreColor;
  uniform vec3 uGlowColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, vNormal, 3.0, 0.15);
    float p = pulse(uTime, 2.0, 0.15, 0.0);
    vec3 color = mix(uCoreColor, uGlowColor, f * p);
    float alpha = uOpacity * (0.6 + f * 0.4);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 02: CIRCUIT MONOLITH MATERIAL (emissive circuit traces)
// ─────────────────────────────────────────────────────────────
const circuitMonolithVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const circuitMonolithFragment = /* glsl */`
  ${shaderChunks.circuitPattern}
  ${shaderChunks.fresnel}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBaseColor;
  uniform vec3 uCircuitColor;
  uniform vec3 uGlowColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, normalize(vNormal), 2.0, 0.2);
    float circuit = circuitPattern(vUv * 10.0, uTime, 1.0);
    vec3 color = mix(uBaseColor, uCircuitColor, circuit);
    color = mix(color, uGlowColor, f * 0.5);
    float alpha = uOpacity * (0.7 + circuit * 0.3);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 03: IRIS APERTURE MATERIAL (mechanical iris blades)
// ─────────────────────────────────────────────────────────────
const irisApertureVertex = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const irisApertureFragment = /* glsl */`
  ${shaderChunks.irisAperture}
  uniform float uTime;
  uniform float uAperture; // 0 = closed, 1 = open
  uniform vec3 uBladeColor;
  uniform vec3 uGlowColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    // Center UV at 0
    vec2 centeredUv = vUv - 0.5;
    float blades = 6.0;
    float bladeAngle = 3.14159 * 2.0 / blades;
    float angle = atan(centeredUv.y, centeredUv.x);
    float bladeIndex = floor(angle / bladeAngle + 0.5);
    float bladeCenter = bladeIndex * bladeAngle;
    float distFromBlade = length(centeredUv) * cos(angle - bladeCenter);
    float bladeWidth = mix(0.02, 0.15, 1.0 - uAperture);
    float inBlade = smoothstep(bladeWidth, bladeWidth + 0.01, abs(distFromBlade));
    vec3 color = mix(uBladeColor, uGlowColor, 1.0 - inBlade);
    float alpha = uOpacity * (1.0 - inBlade * 0.9);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 04: NEURAL NODE MATERIAL (pulsing bioluminescent)
// ─────────────────────────────────────────────────────────────
const neuralNodeVertex = /* glsl */`
  ${shaderChunks.fresnel}
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const neuralNodeFragment = /* glsl */`
  ${shaderChunks.fresnel}
  ${shaderChunks.pulse}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBaseColor;
  uniform vec3 uPulseColor;
  uniform float uNodeId;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, vNormal, 4.0, 0.1);
    float p = pulse(uTime, 2.5, 0.2, uNodeId * 0.3);
    vec3 color = mix(uBaseColor, uPulseColor, f * p);
    float alpha = uOpacity * (0.5 + f * 0.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 04: AXON LINE MATERIAL (glowing connections)
// ─────────────────────────────────────────────────────────────
const axonLineFragment = /* glsl */`
  ${shaderChunks.neuralPulse}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uPulseColor;
  void main() {
    // Lines don't have varying position easily, so we use gl_FragCoord
    float pulse = neuralPulse(uTime, 0.8, 20.0);
    vec3 color = neuralColor(pulse, uColor, uPulseColor);
    gl_FragColor = vec4(color, uOpacity * pulse * 2.0);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 04: NEURAL PULSE MATERIAL (traveling signal)
// ─────────────────────────────────────────────────────────────
const neuralPulseVertex = /* glsl */`
  varying float vPulsePhase;
  void main() {
    vPulsePhase = 0.0; // Will be set via instance matrix
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const neuralPulseFragment = /* glsl */`
  ${shaderChunks.fresnel}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uCoreColor;
  varying float vPulsePhase;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vec3(0.0));
    float f = fresnel(viewDir, vec3(0.0, 0.0, 1.0), 3.0, 0.0);
    vec3 color = mix(uColor, uCoreColor, f);
    gl_FragColor = vec4(color, uOpacity);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 05: WARP STREAK MATERIAL (high-velocity streaks)
// ─────────────────────────────────────────────────────────────
const warpStreakVertex = /* glsl */`
  varying vec3 vWorldPosition;
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const warpStreakFragment = /* glsl */`
  ${shaderChunks.warpStreak}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float streak = pow(max(0.0, dot(normalize(vWorldPosition), viewDir)), 30.0);
    float pulse = sin(vWorldPosition.z * 0.3 + uTime * 15.0) * 0.5 + 0.5;
    float intensity = streak * pulse;
    vec3 color = mix(uColor, uGlowColor, intensity);
    gl_FragColor = vec4(color, uOpacity * intensity);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 05: MORPH PILLAR MATERIAL (vertex displacement)
// ─────────────────────────────────────────────────────────────
const morphPillarVertex = /* glsl */`
  ${shaderChunks.morphDisplace}
  uniform float uTime;
  uniform float uMorphFactor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 displaced = displaceVertex(position, normal, uMorphFactor, 0.5, uTime);
    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const morphPillarFragment = /* glsl */`
  ${shaderChunks.fresnel}
  ${shaderChunks.circuitPattern}
  uniform float uTime;
  uniform float uOpacity;
  uniform float uMorphFactor;
  uniform vec3 uBaseColor;
  uniform vec3 uGlowColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, vNormal, 2.0, 0.15);
    float circuit = circuitPattern(vWorldPosition.xz * 0.5, uTime, 1.0) * uMorphFactor;
    vec3 color = mix(uBaseColor, uGlowColor, f + circuit * 0.5);
    float alpha = uOpacity * (0.6 + f * 0.3 + circuit * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 06: CITY BUILDING MATERIAL (PBR with window emissive)
// ─────────────────────────────────────────────────────────────
const cityBuildingVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cityBuildingFragment = /* glsl */`
  ${shaderChunks.fresnel}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBaseColor;
  uniform vec3 uWindowColor;
  uniform vec3 uGlowColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, normalize(vNormal), 1.5, 0.2);
    // Procedural window grid
    vec2 windowUv = vUv * vec2(20.0, 40.0);
    vec2 windowGrid = fract(windowUv) - 0.5;
    float windows = step(max(abs(windowGrid.x), abs(windowGrid.y)), 0.35);
    // Random window states
    float windowId = floor(windowUv.y) * 20.0 + floor(windowUv.x);
    float windowState = fract(sin(windowId * 12.9898) * 43758.5453);
    windows *= step(windowState, 0.7); // 70% lit
    vec3 color = mix(uBaseColor, uWindowColor, windows * 0.8);
    color = mix(color, uGlowColor, f * 0.3);
    float alpha = uOpacity * (0.9 - windows * 0.1);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 06: CITY WIREFRAME MATERIAL (animated scanlines)
// ─────────────────────────────────────────────────────────────
const cityWireframeFragment = /* glsl */`
  ${shaderChunks.hologram}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    float scan = scanline(vUv * vec2(1.0, 50.0), uTime, 0.5, 0.3);
    float vign = vignette(vUv * 0.5 + 0.5, 0.3);
    vec3 color = uColor * scan * vign;
    gl_FragColor = vec4(color, uOpacity * scan * 0.8);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 07: PORTAL ARCH MATERIAL (architectural PBR)
// ─────────────────────────────────────────────────────────────
const portalArchVertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalArchFragment = /* glsl */`
  ${shaderChunks.fresnel}
  ${shaderChunks.circuitPattern}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uMetalColor;
  uniform vec3 uAccentColor;
  uniform vec3 uGlowColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, vNormal, 3.0, 0.1);
    float circuit = circuitPattern(vUv * vec2(5.0, 20.0), uTime, 1.0);
    vec3 color = mix(uMetalColor, uAccentColor, circuit * 0.5);
    color = mix(color, uGlowColor, f * 0.4);
    float alpha = uOpacity * (0.8 + f * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// SCENE 07: PORTAL FLARE MATERIAL (volumetric light tunnel)
// ─────────────────────────────────────────────────────────────
const portalFlareVertex = /* glsl */`
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFlareFragment = /* glsl */`
  ${shaderChunks.fresnel}
  ${shaderChunks.volumetricFog}
  ${shaderChunks.pulse}
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uCoreColor;
  uniform vec3 uOuterColor;
  uniform vec3 uFogColor;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float f = fresnel(viewDir, vec3(0.0, 0.0, 1.0), 8.0, 0.0);
    float p = pulse(uTime, 4.0, 0.15, 0.0);
    float depth = length(vWorldPosition);
    float fog = volumetricFog(depth, 0.02, 1.5);
    vec3 color = mix(uOuterColor, uCoreColor, f * p);
    color = applyFog(color, depth, uFogColor, 0.02, 1.5);
    float alpha = uOpacity * (f * p) * (1.0 - fog * 0.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// REGISTER ALL CUSTOM MATERIALS
// ─────────────────────────────────────────────────────────────

// Scene 01: Quantum Core
extend({
  quantumCoreMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: quantumCoreVertex,
      fragmentShader: quantumCoreFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uCoreColor: { value: new THREE.Color('#00f0ff') },
        uGlowColor: { value: new THREE.Color('#ffffff') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 02: Circuit Monolith
extend({
  circuitMonolithMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: circuitMonolithVertex,
      fragmentShader: circuitMonolithFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uBaseColor: { value: new THREE.Color('#0f172a') },
        uCircuitColor: { value: new THREE.Color('#00f0ff') },
        uGlowColor: { value: new THREE.Color('#8b5cf6') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: true,
      ...props,
    }),
});

// Scene 03: Iris Aperture
extend({
  irisApertureMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: irisApertureVertex,
      fragmentShader: irisApertureFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uAperture: { value: 0 },
        uBladeColor: { value: new THREE.Color('#1e293b') },
        uGlowColor: { value: new THREE.Color('#00f0ff') },
        uOpacity: { value: 1 },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      ...props,
    }),
});

// Scene 04: Neural Node
extend({
  neuralNodeMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: neuralNodeVertex,
      fragmentShader: neuralNodeFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uBaseColor: { value: new THREE.Color('#00f0ff') },
        uPulseColor: { value: new THREE.Color('#ffffff') },
        uNodeId: { value: 0 },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 04: Axon Lines
extend({
  axonLineMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: axonLineFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#8b5cf6') },
        uPulseColor: { value: new THREE.Color('#ffffff') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 04: Neural Pulse (traveling)
extend({
  neuralPulseMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: neuralPulseVertex,
      fragmentShader: neuralPulseFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#ffffff') },
        uCoreColor: { value: new THREE.Color('#f59e0b') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 05: Warp Streak
extend({
  warpStreakMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: warpStreakVertex,
      fragmentShader: warpStreakFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#00f0ff') },
        uGlowColor: { value: new THREE.Color('#ffffff') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 05: Morph Pillar
extend({
  morphPillarMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: morphPillarVertex,
      fragmentShader: morphPillarFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uMorphFactor: { value: 0 },
        uBaseColor: { value: new THREE.Color('#1e1b4b') },
        uGlowColor: { value: new THREE.Color('#00f0ff') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: true,
      ...props,
    }),
});

// Scene 06: City Building
extend({
  cityBuildingMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: cityBuildingVertex,
      fragmentShader: cityBuildingFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uBaseColor: { value: new THREE.Color('#090d16') },
        uWindowColor: { value: new THREE.Color('#00f0ff') },
        uGlowColor: { value: new THREE.Color('#8b5cf6') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: true,
      ...props,
    }),
});

// Scene 06: City Wireframe
extend({
  cityWireframeMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: cityBuildingVertex,
      fragmentShader: cityWireframeFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color('#1e293b') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      ...props,
    }),
});

// Scene 07: Portal Arch
extend({
  portalArchMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: portalArchVertex,
      fragmentShader: portalArchFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uMetalColor: { value: new THREE.Color('#0f172a') },
        uAccentColor: { value: new THREE.Color('#00f0ff') },
        uGlowColor: { value: new THREE.Color('#ffffff') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: true,
      ...props,
    }),
});

// Scene 07: Portal Flare
extend({
  portalFlareMaterial: (props: any) =>
    new THREE.ShaderMaterial({
      vertexShader: portalFlareVertex,
      fragmentShader: portalFlareFragment,
      uniforms: {
        uTime: commonUniforms.uTime,
        uOpacity: { value: 1 },
        uCoreColor: { value: new THREE.Color('#ffffff') },
        uOuterColor: { value: new THREE.Color('#00f0ff') },
        uFogColor: { value: new THREE.Color('#030712') },
        ...props.uniforms,
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      ...props,
    }),
});

// Export for direct import if needed
export {};