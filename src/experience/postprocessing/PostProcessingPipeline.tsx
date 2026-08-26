/**
 * src/experience/postprocessing/PostProcessingPipeline.tsx
 * Film-Grade Cinematic Post-Processing Pipeline
 * 
 * Includes:
 * - Selective Unreal Bloom for emissive neon traces & synaptic firing
 * - Depth of Field (Bokeh) dynamically calibrated to current scene
 * - Anamorphic Chromatic Aberration and Vignette
 * - Organic Film Grain (Noise)
 * - SMAA Anti-Aliasing
 */

import React, { useMemo } from 'react';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Noise,
  SMAA,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';
import { useTimeline, SCENE_DEFINITIONS } from '../timeline/CinematicTimeline';

export interface PostProcessingPipelineProps {
  enabled?: boolean;
}

export default function PostProcessingPipeline({ enabled = true }: PostProcessingPipelineProps) {
  const currentSceneIndex = useTimeline((s) => s.currentSceneIndex);
  const progress = useTimeline((s) => s.progress);
  const reducedMotion = useTimeline((s) => s.reducedMotion);

  const scene = SCENE_DEFINITIONS[currentSceneIndex] || SCENE_DEFINITIONS[0];

  // Dynamic chromatic aberration offset based on scroll velocity/scene transition
  const chromaticOffset = useMemo(() => {
    // Spike aberration during robot penetration (0.35 - 0.44) and signal warp (0.60 - 0.74)
    if ((progress >= 0.35 && progress <= 0.44) || (progress >= 0.60 && progress <= 0.74)) {
      return new THREE.Vector2(0.0035, 0.0035);
    }
    return new THREE.Vector2(0.0012, 0.0012);
  }, [progress]);

  // Dynamic bloom intensity based on scene
  const bloomIntensity = useMemo(() => {
    if (progress >= 0.44 && progress <= 0.74) return 1.6; // High intensity for brain & signal
    if (progress >= 0.88) return 2.0; // Breakthrough light flare
    return 1.2;
  }, [progress]);

  if (!enabled || reducedMotion) {
    return null;
  }

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* 1. Selective Emissive Bloom */}
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />

      {/* 2. Dynamic Depth of Field */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.15}
        bokehScale={2.5}
      />

      {/* 3. Anamorphic Chromatic Aberration */}
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.3}
      />

      {/* 4. Film Grain Texture */}
      <Noise
        opacity={0.035}
        blendFunction={BlendFunction.OVERLAY}
      />

      {/* 5. Cinematic Vignette */}
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.85}
      />

      {/* 6. SMAA Anti-Aliasing */}
      <SMAA />
    </EffectComposer>
  );
}
