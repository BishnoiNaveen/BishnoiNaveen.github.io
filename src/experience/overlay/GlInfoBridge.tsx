/**
 * src/experience/overlay/GlInfoBridge.tsx
 * Lives INSIDE the R3F <Canvas>. Each frame it copies the real renderer
 * stats (gl.info) into the shared perfState ref consumed by the DOM PerfHUD.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { perfState } from './perfBridge';

export default function GlInfoBridge() {
  const gl = useThree((s) => s.gl);
  useFrame(() => {
    const info = gl.info;
    perfState.calls = info.render.calls;
    perfState.triangles = info.render.triangles;
    perfState.geometries = info.memory.geometries;
    perfState.textures = info.memory.textures;
  });
  return null;
}
