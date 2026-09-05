/**
 * src/experience/shaders/UniformSync.tsx
 * Global uniform synchronization — updates all shader uniforms (uTime, uProgress, uCameraPosition)
 * each frame from the R3F render loop.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useTimeline } from '../timeline/CinematicTimeline';
import { commonUniforms } from './shaderChunks';
import * as THREE from 'three';
import React from 'react';

export function UniformSync() {
  const { clock, camera } = useThree();
  const progress = useTimeline((s) => s.progress);

  useFrame(() => {
    // Update common uniforms every frame
    commonUniforms.uTime.value = clock.getElapsedTime();
    commonUniforms.uProgress.value = progress;
    commonUniforms.uCameraPosition.value.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
  });

  return null;
}

// Hook for scene-specific uniform updates (e.g., morphFactor, aperture)
export function useShaderUniforms() {
  const { clock } = useThree();
  const progress = useTimeline((s) => s.progress);

  return {
    time: clock.getElapsedTime(),
    progress,
    // Scene-specific computed uniforms
    morphFactor: progress < 0.60 ? 0 : Math.min(1, (progress - 0.60) / 0.14),
    apertureOpen: progress < 0.34 ? 0 : Math.min(1, (progress - 0.34) / 0.08),
    neuralPulsePhase: clock.getElapsedTime() * 0.8,
  };
}