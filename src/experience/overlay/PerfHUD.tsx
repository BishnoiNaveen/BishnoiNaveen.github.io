/**
 * src/experience/overlay/PerfHUD.tsx
 * Performance Engineer deliverable — live WebGL instrumentation (DOM overlay).
 *
 * Lives OUTSIDE the R3F <Canvas> (pure DOM), so it must not use useThree/useFrame.
 * Reads the shared perfState ref (updated each frame by GlInfoBridge inside the
 * Canvas) plus the active quality tier. Decorative (aria-hidden).
 *
 * Visibility is controlled by the store `statsOn` flag (STATS button).
 */

import { useEffect, useRef } from 'react';
import { useTimeline } from '../timeline/CinematicTimeline';
import { useQualityTier } from '../quality/useQualityTier';
import { perfState } from './perfBridge';

export default function PerfHUD() {
  const tier = useQualityTier();
  const statsOn = useTimeline((s) => s.statsOn);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const fpsRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    if (!statsOn) return;
    const tick = () => {
      const now = performance.now();
      const dt = now - lastRef.current;
      lastRef.current = now;
      if (dt > 0) {
        const inst = 1000 / dt;
        fpsRef.current = fpsRef.current === 0 ? inst : fpsRef.current * 0.9 + inst * 0.1;
      }
      const el = labelRef.current;
      if (el) {
        el.textContent =
          `FPS ${Math.round(fpsRef.current)}  |  DRAW ${perfState.calls}  |  ` +
          `TRIS ${(perfState.triangles / 1000).toFixed(1)}k  |  GEO ${perfState.geometries}  |  ` +
          `TEX ${perfState.textures}  |  Q ${tier.tier} @${tier.dpr}`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [statsOn, tier.tier, tier.dpr]);

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
