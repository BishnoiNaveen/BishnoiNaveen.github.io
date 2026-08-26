/**
 * src/experience/scenes/Scene07Portfolio.tsx
 * Scene 07: The Inner Sanctum (s in [0.88, 1.00])
 * 
 * Features:
 * - Grand architectural entrance portico with geometric portal arches
 * - Radiant optical breakthrough flare and light tunnel
 * - Smooth transition from 3D camera travel into executive portfolio interface
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';

export default function Scene07Portfolio() {
  const progress = useTimeline((s) => s.progress);

  // Compute scene visibility window (0.84 to 1.00)
  const opacity = useMemo(() => {
    if (progress < 0.84) return 0;
    return Math.min(1, (progress - 0.84) / 0.08);
  }, [progress]);

  const portalGroupRef = useRef<THREE.Group>(null);
  const flareRingRef = useRef<THREE.Mesh>(null);
  const portalArchesRef = useRef<THREE.Group>(null);

  // 7 Concentric Portal Arches leading inwards
  const archCount = 7;
  const archSpacings = useMemo(() => {
    return Array.from({ length: archCount }, (_, i) => ({
      z: -120 - i * 3.5,
      scale: 1.0 - i * 0.08,
      color: i % 2 === 0 ? '#00f0ff' : '#8b5cf6',
    }));
  }, [archCount]);

  useFrame((state) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // Rotate flare burst ring
    if (flareRingRef.current) {
      flareRingRef.current.rotation.z = time * 0.4;
      const pulse = 1.0 + Math.sin(time * 4) * 0.1;
      flareRingRef.current.scale.set(pulse, pulse, 1);
    }
  });

  if (opacity <= 0) return null;

  return (
    <group name="scene-07-portfolio" position={[0, 0, 0]}>
      {/* Grand Entrance Portico Arches */}
      <group ref={portalArchesRef}>
        {archSpacings.map((arch, idx) => (
          <group key={idx} position={[0, 1.5, arch.z]} scale={[arch.scale, arch.scale, 1]}>
            {/* Top Beam */}
            <mesh position={[0, 5, 0]}>
              <boxGeometry args={[14, 1.2, 1.2]} />
              <meshBasicMaterial
                color="#0f172a"
                transparent
                opacity={0.9 * opacity}
              />
            </mesh>
            <mesh position={[0, 5, 0]}>
              <boxGeometry args={[14.1, 1.25, 1.25]} />
              <meshBasicMaterial
                color={arch.color}
                wireframe
                transparent
                opacity={0.7 * opacity}
              />
            </mesh>

            {/* Left Pillar */}
            <mesh position={[-6.5, 0, 0]}>
              <boxGeometry args={[1.2, 10, 1.2]} />
              <meshBasicMaterial
                color="#0f172a"
                transparent
                opacity={0.9 * opacity}
              />
            </mesh>
            <mesh position={[-6.5, 0, 0]}>
              <boxGeometry args={[1.25, 10.1, 1.25]} />
              <meshBasicMaterial
                color={arch.color}
                wireframe
                transparent
                opacity={0.7 * opacity}
              />
            </mesh>

            {/* Right Pillar */}
            <mesh position={[6.5, 0, 0]}>
              <boxGeometry args={[1.2, 10, 1.2]} />
              <meshBasicMaterial
                color="#0f172a"
                transparent
                opacity={0.9 * opacity}
              />
            </mesh>
            <mesh position={[6.5, 0, 0]}>
              <boxGeometry args={[1.25, 10.1, 1.25]} />
              <meshBasicMaterial
                color={arch.color}
                wireframe
                transparent
                opacity={0.7 * opacity}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Terminal Core Light Flare at End of Portico */}
      <group position={[0, 1.5, -145]}>
        <mesh ref={flareRingRef}>
          <ringGeometry args={[1.5, 7.0, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>

        <mesh position={[0, 0, -0.5]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.9 * opacity}
          />
        </mesh>
      </group>
    </group>
  );
}
