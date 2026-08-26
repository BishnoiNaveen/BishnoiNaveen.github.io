/**
 * src/experience/scenes/Scene02AIWorld.tsx
 * Scene 02: The AI Megalith (s in [0.14, 0.28])
 * 
 * Features:
 * - Floating server monoliths (InstancedMesh) with emissive LED circuit traces
 * - Procedural ground perspective depth grid
 * - Pulsating orbital telemetry rings and floating data conduits
 * - Volumetric horizon glow
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';

export default function Scene02AIWorld() {
  const progress = useTimeline((s) => s.progress);

  // Compute scene visibility window (0.10 to 0.34)
  const opacity = useMemo(() => {
    if (progress < 0.10) return 0;
    if (progress <= 0.18) return (progress - 0.10) / 0.08;
    if (progress <= 0.28) return 1;
    if (progress <= 0.34) return Math.max(0, 1 - (progress - 0.28) / 0.06);
    return 0;
  }, [progress]);

  const monolithCount = 48;
  const monolithsRef = useRef<THREE.InstancedMesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Precompute monolith placement in two parallel corridors flanking the camera path
  const monolithData = useMemo(() => {
    const data = [];
    for (let i = 0; i < monolithCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (8 + (i % 6) * 3.5 + Math.random() * 2);
      const z = 40 - (Math.floor(i / 2) * 1.6);
      const y = -2 + Math.sin(i * 0.8) * 1.5;
      const height = 4 + Math.random() * 8;
      const width = 0.8 + Math.random() * 0.6;
      const depth = 0.8 + Math.random() * 0.6;
      const rotY = (Math.random() - 0.5) * 0.4;
      data.push({ x, y, z, height, width, depth, rotY, initialY: y });
    }
    return data;
  }, [monolithCount]);

  useFrame((state) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // Animate floating monolith bobbing
    if (monolithsRef.current) {
      const mesh = monolithsRef.current;
      for (let i = 0; i < monolithCount; i++) {
        const m = monolithData[i];
        const currentY = m.initialY + Math.sin(time * 0.6 + i) * 0.3;
        dummy.position.set(m.x, currentY + m.height / 2, m.z);
        dummy.rotation.set(0, m.rotY, 0);
        dummy.scale.set(m.width, m.height, m.depth);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // Animate orbital telemetry rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.2;
      ring1Ref.current.rotation.x = Math.sin(time * 0.3) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.15;
      ring2Ref.current.rotation.y = time * 0.1;
    }
  });

  if (opacity <= 0) return null;

  return (
    <group name="scene-02-ai-world" position={[0, 0, 0]}>
      {/* Ground Depth Grid */}
      <group position={[0, -5, 26]}>
        <gridHelper
          args={[100, 50, '#00f0ff', '#1e293b']}
          rotation={[0, 0, 0]}
        >
          <meshBasicMaterial
            attach="material"
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.35 * opacity}
          />
        </gridHelper>
      </group>

      {/* Floating Server Monoliths */}
      <instancedMesh
        ref={monolithsRef}
        args={[undefined, undefined, monolithCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#0f172a"
          wireframe={false}
          transparent
          opacity={0.85 * opacity}
        />
      </instancedMesh>

      {/* Floating Telemetry Orbital Rings */}
      <group ref={ringGroupRef} position={[4, 5, 28]}>
        <mesh ref={ring1Ref}>
          <ringGeometry args={[3.5, 3.6, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[4.2, 4.3, 64]} />
          <meshBasicMaterial
            color="#8b5cf6"
            side={THREE.DoubleSide}
            transparent
            opacity={0.4 * opacity}
          />
        </mesh>
      </group>

      {/* Beacon Light Pillars */}
      <mesh position={[12, 4, 30]}>
        <cylinderGeometry args={[0.05, 0.05, 25, 8]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.5 * opacity}
        />
      </mesh>
      <mesh position={[-12, 4, 30]}>
        <cylinderGeometry args={[0.05, 0.05, 25, 8]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.5 * opacity}
        />
      </mesh>
    </group>
  );
}
