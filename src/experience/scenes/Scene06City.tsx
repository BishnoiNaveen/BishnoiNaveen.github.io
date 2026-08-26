/**
 * src/experience/scenes/Scene06City.tsx
 * Scene 06: The Digital Metropolis (s in [0.74, 0.88])
 * 
 * Features:
 * - Sprawling cybernetic city with 120+ procedural skyscraper monoliths (InstancedMesh)
 * - 4 Grand Megalithic Pillars representing core portfolio disciplines:
 *   1. Tower 1: Flagship Projects
 *   2. Tower 2: Systems Lab & Distributed Simulators
 *   3. Tower 3: Verified Engineering Pedigree & Resume
 *   4. Tower 4: Communication Hub & Terminal
 * - Radiant street grid channels & skyward beacon laser streams
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';

export default function Scene06City() {
  const progress = useTimeline((s) => s.progress);

  // Compute scene visibility window (0.70 to 0.92)
  const opacity = useMemo(() => {
    if (progress < 0.70) return 0;
    if (progress <= 0.76) return (progress - 0.70) / 0.06;
    if (progress <= 0.86) return 1;
    if (progress <= 0.92) return Math.max(0, 1 - (progress - 0.86) / 0.06);
    return 0;
  }, [progress]);

  const buildingCount = 128;
  const buildingsMeshRef = useRef<THREE.InstancedMesh>(null);
  const wireframesMeshRef = useRef<THREE.InstancedMesh>(null);
  const beaconPillarsRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate city layout (grid of towers with varied heights and footprints)
  const cityData = useMemo(() => {
    const data = [];
    const rows = 16;
    const cols = 8;
    const spacingX = 8;
    const spacingZ = 6;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Leave a central highway canyon for camera flyover
        const side = c < cols / 2 ? -1 : 1;
        const colOffset = Math.abs(c - cols / 2) + 0.5;
        const x = side * (colOffset * spacingX + 4);
        const z = -65 - r * spacingZ;
        const width = 3 + Math.random() * 3.5;
        const depth = 3 + Math.random() * 3.5;
        const height = 12 + Math.random() * 32 + (r % 3 === 0 ? 15 : 0);
        data.push({ x, z, width, height, depth });
      }
    }
    return data;
  }, []);

  // 4 Grand Portfolio Pillar Megaliths coordinates
  const pillars = useMemo(
    () => [
      { name: 'Projects Megalith', x: -16, z: -85, height: 48, color: '#00f0ff' },
      { name: 'Systems Lab Megalith', x: 16, z: -85, height: 46, color: '#8b5cf6' },
      { name: 'Resume Megalith', x: -14, z: -105, height: 52, color: '#f59e0b' },
      { name: 'Contact Hub', x: 14, z: -105, height: 50, color: '#10b981' },
    ],
    []
  );

  useFrame((state) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // Populate building matrices
    if (buildingsMeshRef.current && wireframesMeshRef.current) {
      const mesh = buildingsMeshRef.current;
      const wireMesh = wireframesMeshRef.current;

      for (let i = 0; i < cityData.length; i++) {
        const b = cityData[i];
        dummy.position.set(b.x, -10 + b.height / 2, b.z);
        dummy.scale.set(b.width, b.height, b.depth);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        wireMesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      wireMesh.instanceMatrix.needsUpdate = true;
    }

    // Pulse beacon laser beams
    if (beaconPillarsRef.current) {
      beaconPillarsRef.current.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          const pulse = 0.6 + Math.sin(time * 3 + idx) * 0.4;
          (child.material as THREE.MeshBasicMaterial).opacity = pulse * opacity;
        }
      });
    }
  });

  if (opacity <= 0) return null;

  return (
    <group name="scene-06-city" position={[0, 0, 0]}>
      {/* City Ground Neon Grid */}
      <group position={[0, -10, -90]}>
        <gridHelper
          args={[140, 70, '#00f0ff', '#1e1b4b']}
          rotation={[0, 0, 0]}
        >
          <meshBasicMaterial
            attach="material"
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.4 * opacity}
          />
        </gridHelper>
      </group>

      {/* Instanced Solid Skyscraper Bodies */}
      <instancedMesh
        ref={buildingsMeshRef}
        args={[undefined, undefined, cityData.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#090d16"
          transparent
          opacity={0.9 * opacity}
        />
      </instancedMesh>

      {/* Instanced Cybernetic Wireframe Outlines */}
      <instancedMesh
        ref={wireframesMeshRef}
        args={[undefined, undefined, cityData.length]}
      >
        <boxGeometry args={[1.01, 1.01, 1.01]} />
        <meshBasicMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.5 * opacity}
        />
      </instancedMesh>

      {/* 4 Grand Portfolio Discipline Towers */}
      {pillars.map((p, idx) => (
        <group key={idx} position={[p.x, -10, p.z]}>
          {/* Main Monolith Body */}
          <mesh position={[0, p.height / 2, 0]}>
            <boxGeometry args={[6, p.height, 6]} />
            <meshBasicMaterial
              color="#0f172a"
              transparent
              opacity={0.95 * opacity}
            />
          </mesh>

          {/* Accent Wireframe */}
          <mesh position={[0, p.height / 2, 0]}>
            <boxGeometry args={[6.1, p.height + 0.1, 6.1]} />
            <meshBasicMaterial
              color={p.color}
              wireframe
              transparent
              opacity={0.7 * opacity}
            />
          </mesh>

          {/* Skyward Beacon Laser Beam */}
          <mesh position={[0, p.height + 25, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 50, 8]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={0.8 * opacity}
            />
          </mesh>
        </group>
      ))}

      {/* Beacon Laser Cluster */}
      <group ref={beaconPillarsRef}>
        <mesh position={[-6, 15, -75]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.5 * opacity}
          />
        </mesh>
        <mesh position={[6, 15, -75]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.5 * opacity}
          />
        </mesh>
      </group>
    </group>
  );
}
