/**
 * src/experience/camera/CameraController.tsx
 * High-Precision Continuous Spline Camera Controller with Physics Drag
 * 
 * Features:
 * - Exponential lerp drag for physical camera weight (no instant snapping)
 * - Seamless tracking along 3D CatmullRomCurve3 across all 7 scenes
 * - Tangent lookAhead combined with focal LookAt spline target
 * - Dynamic FOV modulation per scene
 * - Subtle pointer parallax damping
 */

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline, SCENE_DEFINITIONS, getSceneIndex } from '../timeline/CinematicTimeline';
import { getCameraPositionAt, getCameraTangentAt, getLookAtPositionAt } from './splineData';

export interface CameraControllerProps {
  lerpFactor?: number;
  lookAheadDistance?: number;
  enableMouseParallax?: boolean;
}

export default function CameraController({
  lerpFactor = 0.06,
  lookAheadDistance = 5.0,
  enableMouseParallax = true,
}: CameraControllerProps) {
  const { camera } = useThree();
  const currentProgressRef = useRef<number>(0);
  const targetProgress = useTimeline((s) => s.targetProgress);
  const setProgress = useTimeline((s) => s.setProgress);
  const reducedMotion = useTimeline((s) => s.reducedMotion);

  // Mouse parallax coordinates
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Reusable vectors to eliminate per-frame garbage collection
  const tempPos = useRef(new THREE.Vector3());
  const tempTangent = useRef(new THREE.Vector3());
  const tempLookAt = useRef(new THREE.Vector3());
  const currentCamPos = useRef(new THREE.Vector3(0, 0, 45));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 20));

  useEffect(() => {
    if (!enableMouseParallax) return;

    const handlePointerMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normalizedX * 0.4;
      mouseRef.current.targetY = normalizedY * 0.3;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [enableMouseParallax]);

  useFrame((_, delta) => {
    const effectiveDelta = Math.min(delta, 0.1);
    const speed = reducedMotion ? 1.0 : Math.min(1.0, lerpFactor * (effectiveDelta * 60));

    // Smoothly drag progress towards target progress
    currentProgressRef.current = THREE.MathUtils.lerp(
      currentProgressRef.current,
      targetProgress,
      speed
    );

    // Sync global timeline state
    setProgress(currentProgressRef.current);

    const p = currentProgressRef.current;
    const sceneIdx = getSceneIndex(p);
    const scene = SCENE_DEFINITIONS[sceneIdx];

    // 1. Calculate base camera position along spline
    getCameraPositionAt(p, tempPos.current);
    getCameraTangentAt(p, tempTangent.current);
    getLookAtPositionAt(p, tempLookAt.current);

    // 2. Mouse Parallax interpolation
    if (enableMouseParallax && !reducedMotion) {
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, 0.05);
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, 0.05);

      tempPos.current.x += mouseRef.current.x;
      tempPos.current.y += mouseRef.current.y;
    }

    // 3. Smooth Camera Position
    currentCamPos.current.lerp(tempPos.current, speed);
    camera.position.copy(currentCamPos.current);

    // 4. Smooth LookAt Calculation (Blend Spline LookAt + LookAhead tangent)
    const blendedLookAt = tempLookAt.current.clone().add(
      tempTangent.current.clone().multiplyScalar(lookAheadDistance * 0.3)
    );
    currentLookAt.current.lerp(blendedLookAt, speed);
    camera.lookAt(currentLookAt.current);

    // 5. Dynamic FOV
    if (camera instanceof THREE.PerspectiveCamera && scene) {
      const targetFov = scene.fov;
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, speed * 0.5);
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
