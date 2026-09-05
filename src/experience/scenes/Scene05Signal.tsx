/**
 * src/experience/scenes/Scene05Signal.tsx
 * Scene 05: The Signal & Morph (s in [0.60, 0.74])
 * 
 * Features:
 * - High-velocity leading photon electrical signal
 * - Warp particle streaks streaming past camera along z-axis
 * - Dynamic structural morph: Neural axon columns elongate and transform
 *   into monolithic skyscraper pylons as progress advances towards the city
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';

export default function Scene05Signal() {
  const progress = useTimeline((s) => s.progress);

  // Compute scene visibility window (0.56 to 0.78)
  const opacity = useMemo(() => {
    if (progress < 0.56) return 0;
    if (progress <= 0.62) return (progress - 0.56) / 0.06;
    if (progress <= 0.72) return 1;
    if (progress <= 0.78) return Math.max(0, 1 - (progress - 0.72) / 0.06);
    return 0;
  }, [progress]);

  // Morph factor: 0.0 (pure neural lines) to 1.0 (tower pillars)
  const morphFactor = useMemo(() => {
    if (progress < 0.60) return 0;
    return Math.min(1, (progress - 0.60) / 0.14);
  }, [progress]);

  const streakCount = 180;
  const streaksRef = useRef<THREE.InstancedMesh>(null);
  const leadSignalRef = useRef<THREE.Group>(null);
  const morphPillarsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate warp streak vectors
  const streakData = useMemo(() => {
    const data = [];
    for (let i = 0; i < streakCount; i++) {
      const radius = 2 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = -25 - Math.random() * 45;
      const length = 4 + Math.random() * 8;
      const speed = 25 + Math.random() * 30;
      data.push({ x, y, z, length, speed, initialZ: z });
    }
    return data;
  }, [streakCount]);

  // Pre-generate morphing pillar coordinates
  const pillarCount = 36;
  const pillarData = useMemo(() => {
    const data = [];
    for (let i = 0; i < pillarCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (5 + (i % 4) * 3);
      const z = -30 - Math.floor(i / 2) * 2.2;
      const baseHeight = 3;
      const targetHeight = 18 + Math.random() * 12;
      data.push({ x, z, baseHeight, targetHeight });
    }
    return data;
  }, [pillarCount]);

  useFrame((state, delta) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // 1. Animate Warp Streaks
    if (streaksRef.current) {
      const mesh = streaksRef.current;
      for (let i = 0; i < streakCount; i++) {
        const s = streakData[i];
        // Move streak rapidly towards camera
        s.z += s.speed * delta;
        if (s.z > -20) {
          s.z = -70 - Math.random() * 10;
        }

        dummy.position.set(s.x, s.y, s.z);
        dummy.scale.set(0.04, 0.04, s.length);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // 2. Animate Leading Photon Pulse
    if (leadSignalRef.current) {
      const signalZ = -28 - (progress - 0.60) * 250;
      leadSignalRef.current.position.set(
        Math.sin(time * 6) * 1.2,
        Math.cos(time * 5) * 1.0,
        signalZ
      );
    }

    // 3. Animate Morphing Columns (Nodes expanding into skyscraper pylons)
    if (morphPillarsRef.current) {
      const mesh = morphPillarsRef.current;
      for (let i = 0; i < pillarCount; i++) {
        const p = pillarData[i];
        const height = THREE.MathUtils.lerp(p.baseHeight, p.targetHeight, morphFactor);
        const width = THREE.MathUtils.lerp(0.2, 1.2, morphFactor);

        dummy.position.set(p.x, -5 + height / 2, p.z);
        dummy.scale.set(width, height, width);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  if (opacity <= 0) return null;

  return (
    <group name="scene-05-signal" position={[0, 0, 0]}>
      {/* High-Velocity Leading Photon Signal */}
      <group ref={leadSignalRef} position={[0, 0, -35]}>
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95 * opacity}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>
      </group>

      {/* Warp Speed Streaks */}
      <instancedMesh
        ref={streaksRef}
        args={[undefined, undefined, streakCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.8 * opacity}
        />
      </instancedMesh>

      {/* Morphing Structural Pylons */}
      <instancedMesh
        ref={morphPillarsRef}
        args={[undefined, undefined, pillarCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#1e1b4b"
          wireframe
          transparent
          opacity={0.65 * opacity}
        />
      </instancedMesh>
    </group>
  );
}
