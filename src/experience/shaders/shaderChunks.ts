/**
 * src/experience/shaders/shaderChunks.ts
 * Reusable GLSL shader chunks for the cinematic experience.
 * Imported into custom shaderMaterials via `onBeforeCompile` or raw ShaderMaterial.
 */

export const shaderChunks = {
  // ─────────────────────────────────────────────────────────────
  // NOISE & UTILITIES
  // ─────────────────────────────────────────────────────────────
  simplexNoise: `
    // Simplex 3D Noise by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // FRESNEL / EDGE GLOW
  // ─────────────────────────────────────────────────────────────
  fresnel: `
    float fresnel(vec3 viewDir, vec3 normal, float power, float bias) {
      return bias + (1.0 - bias) * pow(1.0 - max(0.0, dot(normalize(viewDir), normal)), power);
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // PULSE / BREATHING ANIMATION
  // ─────────────────────────────────────────────────────────────
  pulse: `
    float pulse(float time, float speed, float amplitude, float offset) {
      return 1.0 + sin(time * speed + offset) * amplitude;
    }
    float pulseSaw(float time, float speed, float offset) {
      return fract(time * speed + offset);
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // VOLUMETRIC / ATMOSPHERIC
  // ─────────────────────────────────────────────────────────────
  volumetricFog: `
    float volumetricFog(float depth, float density, float falloff) {
      return 1.0 - exp(-density * pow(depth, falloff));
    }
    vec3 applyFog(vec3 color, float depth, vec3 fogColor, float density, float falloff) {
      float fog = volumetricFog(depth, density, falloff);
      return mix(color, fogColor, fog);
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // HOLOGRAM / SCANLINE
  // ─────────────────────────────────────────────────────────────
  hologram: `
    float scanline(vec2 uv, float time, float speed, float thickness) {
      float line = fract(uv.y * 100.0 + time * speed);
      return step(line, thickness);
    }
    float vignette(vec2 uv, float intensity) {
      float d = length(uv - 0.5) * 2.0;
      return 1.0 - smoothstep(0.5, 1.0, d) * intensity;
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // MORPH / DISPLACEMENT
  // ─────────────────────────────────────────────────────────────
  morphDisplace: `
    float morphFactor(float progress, float start, float duration) {
      return clamp((progress - start) / duration, 0.0, 1.0);
    }
    vec3 displaceVertex(vec3 pos, vec3 normal, float factor, float amplitude, float time) {
      float noise = snoise(pos * 0.5 + time * 0.3);
      return pos + normal * factor * amplitude * noise;
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // IRIS / APERTURE
  // ─────────────────────────────────────────────────────────────
  irisAperture: `
    float irisShape(vec2 uv, float aperture, float blades) {
      float angle = atan(uv.y, uv.x);
      float r = length(uv);
      float blade = floor(angle * blades / (3.14159 * 2.0) + 0.5);
      float bladeAngle = blade * (3.14159 * 2.0) / blades;
      float d = r * cos(angle - bladeAngle);
      return smoothstep(aperture - 0.02, aperture + 0.02, d);
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // CIRCUIT / EMISSIVE PATTERNS
  // ─────────────────────────────────────────────────────────────
  circuitPattern: `
    float circuit(vec2 uv, float time, float scale) {
      uv *= scale;
      vec2 gv = fract(uv) - 0.5;
      vec2 id = floor(uv);
      float n = snoise(vec3(id, time * 0.1));
      float lines = step(abs(gv.x), 0.02) + step(abs(gv.y), 0.02);
      return lines * step(n, 0.3);
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // NEURAL / AXON PULSE
  // ─────────────────────────────────────────────────────────────
  neuralPulse: `
    float neuralPulse(float t, float speed, float width) {
      // Sharp pulse with exponential falloff
      float p = fract(t * speed);
      return exp(-abs(p - 0.5) * width) * step(p, 0.5);
    }
    vec3 neuralColor(float intensity, vec3 baseColor, vec3 pulseColor) {
      return mix(baseColor, pulseColor, smoothstep(0.3, 1.0, intensity));
    }
  `,

  // ─────────────────────────────────────────────────────────────
  // WARP / SPEED STREAK
  // ─────────────────────────────────────────────────────────────
  warpStreak: `
    vec3 warpStreak(vec3 pos, vec3 viewDir, float time, float speed) {
      float streak = pow(max(0.0, dot(normalize(pos), viewDir)), 50.0);
      float pulse = sin(pos.z * 0.5 + time * speed) * 0.5 + 0.5;
      return vec3(streak * pulse);
    }
  `,
};

// Uniforms shared across multiple custom materials
export const commonUniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uCameraPosition: { value: [0, 0, 0] },
  uResolution: { value: [1920, 1080] },
  uPixelRatio: { value: 1 },
};