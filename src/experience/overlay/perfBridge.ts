/**
 * src/experience/overlay/perfBridge.ts
 * Shared mutable perf stats bridge between the R3F Canvas (producer) and the
 * DOM-side PerfHUD (consumer). A plain module ref (not React state) so the
 * per-frame write does NOT trigger React re-renders; the HUD reads it on its
 * own requestAnimationFrame loop.
 */

export interface PerfState {
  fps: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export const perfState: PerfState = {
  fps: 0,
  calls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
};
