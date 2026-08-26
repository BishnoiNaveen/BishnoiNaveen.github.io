/**
 * src/experience/scenes/Scene03Robot.tsx
 * Scene 03: The Humanoid Titan (s in [0.28, 0.44])
 * 
 * Features:
 * - Gigantic humanoid AI exoskeleton (head chassis, optical visor, reactor chest)
 * - Triple counter-rotating gimbal aperture rings
 * - Dynamic iris aperture expansion: as camera approaches (s > 0.36), the chest/cranial
 *   aperture slides open, allowing physical camera penetration into the neural core
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';

export default function Scene03Robot() {
  const progress = useTimeline((s) => s.progress);

  // Compute scene visibility window (0.24 to 0.48)
  const opacity = useMemo(() => {
    if (progress < 0.24) return 0;
    if (progress <= 0.30) return (progress - 0.24) / 0.06;
    if (progress <= 0.42) return 1;
    if (progress <= 0.48) return Math.max(0, 1 - (progress - 0.42) / 0.06);
    return 0;
  }, [progress]);

  // Aperture expansion factor based on camera proximity (0.34 to 0.44)
  const apertureOpen = useMemo(() => {
    if (progress < 0.34) return 0;
    return Math.min(1, (progress - 0.34) / 0.08);
  }, [progress]);

  const robotGroupRef = useRef<THREE.Group>(null);
  const ringInnerRef = useRef<THREE.Mesh>(null);
  const ringMidRef = useRef<THREE.Mesh>(null);
  const ringOuterRef = useRef<THREE.Mesh>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const leftArmorRef = useRef<THREE.Group>(null);
  const rightArmorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // Rotate gimbal aperture rings
    if (ringInnerRef.current) {
      ringInnerRef.current.rotation.z = time * 0.8;
      ringInnerRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (ringMidRef.current) {
      ringMidRef.current.rotation.z = -time * 0.5;
      ringMidRef.current.rotation.y = Math.cos(time * 0.4) * 0.2;
    }
    if (ringOuterRef.current) {
      ringOuterRef.current.rotation.z = time * 0.3;
    }

    // Visor pulse
    if (visorRef.current) {
      const visorPulse = 0.8 + Math.sin(time * 3.0) * 0.2;
      (visorRef.current.material as THREE.MeshBasicMaterial).opacity = visorPulse * opacity;
    }

    // De-interlocking armor plates slide outward as camera approaches
    const separation = apertureOpen * 2.8;
    if (leftArmorRef.current) {
      leftArmorRef.current.position.x = -1.2 - separation;
    }
    if (rightArmorRef.current) {
      rightArmorRef.current.position.x = 1.2 + separation;
    }
  });

  if (opacity <= 0) return null;

  return (
    <group ref={robotGroupRef} name="scene-03-robot" position={[0, 1.2, 0]}>
      {/* 1. Cranial Head Chassis */}
      <group position={[0, 2.5, 0]}>
        {/* Head Shell */}
        <mesh>
          <boxGeometry args={[1.6, 1.8, 1.4]} />
          <meshBasicMaterial
            color="#0f172a"
            wireframe={false}
            transparent
            opacity={0.9 * opacity}
          />
        </mesh>

        {/* Wireframe Outline */}
        <mesh>
          <boxGeometry args={[1.62, 1.82, 1.42]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>

        {/* Cyan Optical Visor */}
        <mesh ref={visorRef} position={[0, 0.2, 0.72]}>
          <boxGeometry args={[1.2, 0.25, 0.1]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.9 * opacity}
          />
        </mesh>
      </group>

      {/* 2. Central Chest Reactor & Aperture Rings */}
      <group position={[0, 0, 0]}>
        {/* Glowing Singularity Core */}
        <mesh position={[0, 0, -0.2]}>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.95 * opacity}
          />
        </mesh>

        {/* Inner Aperture Ring */}
        <mesh ref={ringInnerRef}>
          <torusGeometry args={[1.1, 0.04, 16, 48]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.8 * opacity}
          />
        </mesh>

        {/* Middle Gimbal Ring */}
        <mesh ref={ringMidRef}>
          <torusGeometry args={[1.6, 0.05, 16, 48]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.7 * opacity}
          />
        </mesh>

        {/* Outer Gimbal Ring */}
        <mesh ref={ringOuterRef}>
          <torusGeometry args={[2.2, 0.06, 16, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>
      </group>

      {/* 3. Articulated Exoskeleton Armor Plates (Sliding Doors) */}
      <group ref={leftArmorRef} position={[-1.2, 0, 0.3]}>
        <mesh>
          <boxGeometry args={[1.4, 2.8, 0.4]} />
          <meshBasicMaterial
            color="#1e293b"
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.42, 2.82, 0.42]} />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.5 * opacity}
          />
        </mesh>
      </group>

      <group ref={rightArmorRef} position={[1.2, 0, 0.3]}>
        <mesh>
          <boxGeometry args={[1.4, 2.8, 0.4]} />
          <meshBasicMaterial
            color="#1e293b"
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.42, 2.82, 0.42]} />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.5 * opacity}
          />
        </mesh>
      </group>

      {/* 4. Torso Structural Backbone Columns */}
      <mesh position={[0, -2.5, -0.5]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 16]} />
        <meshBasicMaterial
          color="#334155"
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
    </group>
  );
}
