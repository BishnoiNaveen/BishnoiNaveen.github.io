/**
 * src/experience/overlay/PerfHUD.tsx
 * Performance Engineer deliverable — live WebGL instrumentation.
 *
 * MUST be rendered inside the R3F <Canvas> (uses useFrame / useThree).
 * Reads real renderer stats from gl.info every frame:
 *   - FPS (rolling average from frame deltas)
 *   - draw calls   (gl.info.render.calls)
 *   - triangles    (gl.info.render.triangles)
 *   - geometries   (gl.info.memory.geometries)
 *   - textures     (gl.info.memory.textures)
 *   - active quality tier + adaptive DPR
 *
 * Decorative (aria-hidden). Visibility is controlled by the store `statsOn`
 * flag, toggled by the STATS button in CinematicOverlay.
 */

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTimeline } from '../timeline/CinematicTimeline';
import { useQualityTier } from '../quality/useQualityTier';

export default function PerfHUD() {
  const gl = useThree((s) => s.gl);
  const tier = useQualityTier();
  const statsOn = useTimeline((s) => s.statsOn);

  const fpsRef = useRef(0);
  const lastRef = useRef(performance.now());
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useFrame(() => {
    const now = performance.now();
    const dt = now - lastRef.current;
    lastRef.current = now;
    if (dt > 0) {
      const inst = 1000 / dt;
      fpsRef.current = fpsRef.current === 0 ? inst : fpsRef.current * 0.9 + inst * 0.1;
    }
  });

  useEffect(() => {
    if (!statsOn) return;
    const tick = () => {
      const el = labelRef.current;
      if (el) {
        const info = gl.info;
        el.textContent =
          `FPS ${Math.round(fpsRef.current)}  |  DRAW ${info.render.calls}  |  ` +
          `TRIS ${(info.render.triangles / 1000).toFixed(1)}k  |  GEO ${info.memory.geometries}  |  ` +
          `TEX ${info.memory.textures}  |  Q ${tier.tier} @${tier.dpr}`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [statsOn, gl, tier.tier, tier.dpr]);

  if (!statsOn) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 right-4 z-30 pointer-events-none font-mono text-[10px] tracking-wide text-cyan-300/80 select-none"
    >
      <div className="px-3 py-1.5 rounded-lg bg-black/55 border border-white/10 backdrop-blur-md">
        <span ref={labelRef}>FPS -- | measuring…</span>
      </div>
    </div>
  );
}
