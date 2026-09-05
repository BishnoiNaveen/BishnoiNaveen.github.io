/**
 * src/experience/scenes/Scene01Boot.tsx
 * Scene 01: The Void Boot (s in [0.00, 0.14])
 * 
 * Features:
 * - Deep obsidian void atmosphere (#030712)
 * - 250+ instanced drifting micro-particles with sine wave physics
 * - Central quantum seed with dual pulsing wireframe geodesics
 * - Dynamic alpha fadeout as camera transitions to Scene 02
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline, getSceneProgress } from '../timeline/CinematicTimeline';

export default function Scene01Boot() {
  const progress = useTimeline((s) => s.progress);
  const sceneProgress = getSceneProgress(progress, 0);

  // Instanced particles setup
  const particleCount = 280;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const outerIcosaRef = useRef<THREE.Mesh>(null);

  // Pre-generate randomized particle vectors and oscillation offsets
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = 25 + (Math.random() - 0.5) * 30;
      const scale = 0.04 + Math.random() * 0.12;
      const speed = 0.2 + Math.random() * 0.8;
      const phase = Math.random() * Math.PI * 2;
      data.push({ x, y, z, scale, speed, phase });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Rotate core geodesics
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.15;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.y = -time * 0.25;
      innerIcosaRef.current.rotation.z = time * 0.1;
      const pulse = 1.0 + Math.sin(time * 2.0) * 0.08;
      innerIcosaRef.current.scale.set(pulse, pulse, pulse);
    }
    if (outerIcosaRef.current) {
      outerIcosaRef.current.rotation.x = time * 0.1;
      outerIcosaRef.current.rotation.z = -time * 0.15;
    }

    // Animate instanced particles
    if (instancedMeshRef.current) {
      const mesh = instancedMeshRef.current;
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        const driftY = p.y + Math.sin(time * p.speed + p.phase) * 0.6;
        const driftX = p.x + Math.cos(time * p.speed * 0.7 + p.phase) * 0.4;
        const driftZ = p.z + Math.sin(time * 0.3 + p.phase) * 0.5;

        dummy.position.set(driftX, driftY, driftZ);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  // Calculate overall visibility based on total progress
  const opacity = progress <= 0.16 ? 1.0 : Math.max(0, 1.0 - (progress - 0.16) / 0.06);

  if (opacity <= 0) return null;

  return (
    <group name="scene-01-boot" position={[0, 0, 0]}>
      {/* Central Quantum Seed */}
      <group ref={coreRef} position={[0, 0.5, 30]}>
        {/* Inner Solid Pulsing Core */}
        <mesh ref={innerIcosaRef}>
          <octahedronGeometry args={[0.8, 1]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>

        {/* Outer Wireframe Geodesic */}
        <mesh ref={outerIcosaRef}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.5 * opacity}
          />
        </mesh>

        {/* Core Glow Point */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9 * opacity}
          />
        </mesh>
      </group>

      {/* Instanced Micro-Particles */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, particleCount]}
      >
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.7 * opacity}
        />
      </instancedMesh>
    </group>
  );
}
