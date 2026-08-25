/**
 * src/experience/scenes/Scene04Brain.tsx
 * Scene 04: The Synaptic Brain (s in [0.44, 0.60])
 * 
 * Features:
 * - 84+ Fibonacci spherical synaptic nodes (InstancedMesh) distributed along a 3D neural matrix
 * - Procedural Bezier axon interconnect pathways
 * - Bioluminescent electrical pulses firing across synaptic connections
 * - Invariant core clusters (Cyan #00f0ff, Violet #8b5cf6, Amber #f59e0b)
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeline } from '../timeline/CinematicTimeline';
import { useQualityTier, getParticleScale } from '../quality/useQualityTier';

export default function Scene04Brain() {
  const progress = useTimeline((s) => s.progress);
  const tier = useQualityTier();

  // Compute scene visibility window (0.40 to 0.64)
  const opacity = useMemo(() => {
    if (progress < 0.40) return 0;
    if (progress <= 0.46) return (progress - 0.40) / 0.06;
    if (progress <= 0.58) return 1;
    if (progress <= 0.64) return Math.max(0, 1 - (progress - 0.58) / 0.06);
    return 0;
  }, [progress]);

  const baseNodeCount = 96; // 84+ Fibonacci nodes
  const nodeCount = Math.max(24, Math.round(baseNodeCount * getParticleScale(tier.tier)));
  const nodesMeshRef = useRef<THREE.InstancedMesh>(null);
  const pulsesMeshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 1. Generate Fibonacci Spherical Neural Nodes
  const { nodePositions, axons, pulseCount } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < nodeCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const radius = 6 + (Math.sin(i * 0.4) * 2.5);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = -14 + radius * Math.cos(phi) * 1.5;

      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes with k-nearest neighbors
    const linePoints: THREE.Vector3[] = [];
    const axonPairs: { from: THREE.Vector3; to: THREE.Vector3; speed: number; offset: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const p1 = positions[i];
      let connections = 0;

      for (let j = i + 1; j < nodeCount; j++) {
        const p2 = positions[j];
        const dist = p1.distanceTo(p2);

        if (dist < 4.5 && connections < 3) {
          linePoints.push(p1, p2);
          axonPairs.push({
            from: p1,
            to: p2,
            speed: 0.8 + Math.random() * 1.2,
            offset: Math.random() * Math.PI * 2,
          });
          connections++;
        }
      }
    }

    return {
      nodePositions: positions,
      axons: axonPairs,
      pulseCount: axonPairs.length,
    };
  }, [nodeCount]);

  // Pre-create LineSegments geometry
  const linesGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const flatPoints: number[] = [];
    for (const axon of axons) {
      flatPoints.push(axon.from.x, axon.from.y, axon.from.z);
      flatPoints.push(axon.to.x, axon.to.y, axon.to.z);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(flatPoints, 3));
    return geom;
  }, [axons]);

  useFrame((state) => {
    if (opacity <= 0) return;
    const time = state.clock.getElapsedTime();

    // 1. Update Synaptic Nodes (pulsing scale & glow)
    if (nodesMeshRef.current) {
      const mesh = nodesMeshRef.current;
      for (let i = 0; i < nodeCount; i++) {
        const pos = nodePositions[i];
        const pulse = 0.15 + Math.sin(time * 2.5 + i * 0.3) * 0.05;

        dummy.position.copy(pos);
        dummy.scale.set(pulse, pulse, pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // 2. Update Bioluminescent Signal Pulses traveling along axons
    if (pulsesMeshRef.current) {
      const mesh = pulsesMeshRef.current;
      for (let i = 0; i < pulseCount; i++) {
        const axon = axons[i];
        const t = (Math.sin(time * axon.speed + axon.offset) + 1) / 2; // 0 to 1 back and forth
        const currentPos = new THREE.Vector3().lerpVectors(axon.from, axon.to, t);

        dummy.position.copy(currentPos);
        dummy.scale.set(0.08, 0.08, 0.08);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  if (opacity <= 0) return null;

  return (
    <group name="scene-04-brain" position={[0, 0, 0]}>
      {/* Synaptic Nodes Instanced Mesh */}
      <instancedMesh
        ref={nodesMeshRef}
        args={[undefined, undefined, nodeCount]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.9 * opacity}
        />
      </instancedMesh>

      {/* Axon Interconnect Pathways */}
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.45 * opacity}
        />
      </lineSegments>

      {/* Bioluminescent Firing Pulses */}
      <instancedMesh
        ref={pulsesMeshRef}
        args={[undefined, undefined, pulseCount]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95 * opacity}
        />
      </instancedMesh>
    </group>
  );
}
