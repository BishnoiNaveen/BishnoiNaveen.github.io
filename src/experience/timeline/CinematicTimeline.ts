/**
 * src/experience/timeline/CinematicTimeline.ts
 * Global State & Timeline Coordinator for 7-Scene Continuous Camera Journey
 */

import { create } from 'zustand';
import type { QualityTier } from '../quality/useQualityTier';

export interface SceneMeta {
  id: string;
  name: string;
  startProgress: number;
  endProgress: number;
  focalDistance: number;
  fov: number;
  eyebrow: string;
  headline: string;
  subtitle: string;
  telemetry: string;
}

export const SCENE_DEFINITIONS: SceneMeta[] = [
  {
    id: 'scene-01-boot',
    name: 'The Void Boot',
    startProgress: 0.00,
    endProgress: 0.14,
    focalDistance: 40.0,
    fov: 45,
    eyebrow: 'SYS.BOOT // KERNEL v7.4.2',
    headline: 'INITIALIZING NEURAL CORE...',
    subtitle: 'From bare-metal POSIX memory allocations to distributed autonomous agent swarms',
    telemetry: 'COORDINATES: 28.6139° N, 77.2090° E // BUFFER: 100% OK',
  },
  {
    id: 'scene-02-ai-world',
    name: 'The AI Megalith',
    startProgress: 0.14,
    endProgress: 0.28,
    focalDistance: 30.0,
    fov: 50,
    eyebrow: 'ENVIRONMENT // SECTOR 0',
    headline: 'THE DISTRIBUTED AI UNIVERSE',
    subtitle: 'Autonomous Systems · BFT Consensus · Edge Telematics',
    telemetry: 'SECTOR: 0x00 // TOPOLOGY: DISTRIBUTED HASH // NODES: ONLINE',
  },
  {
    id: 'scene-03-robot',
    name: 'The Humanoid Titan',
    startProgress: 0.28,
    endProgress: 0.44,
    focalDistance: 12.0,
    fov: 48,
    eyebrow: 'STRUCTURAL SCAN // TARGET LOCKED',
    headline: 'HUMANOID AI PLATFORM',
    subtitle: 'Deep Hardware-Software Convergence · Low-Level Kernel Architecture',
    telemetry: 'TARGET: TITAN CHASSIS // APERTURE: DE-INTERLOCKING // CORE: LOCKED',
  },
  {
    id: 'scene-04-brain',
    name: 'The Synaptic Brain',
    startProgress: 0.44,
    endProgress: 0.60,
    focalDistance: 8.0,
    fov: 55,
    eyebrow: 'NEURAL CORE // ACTIVE LINK',
    headline: 'HIGH-FREQUENCY SYNAPTIC MATRIX',
    subtitle: '84 Fibonacci Synaptic Nodes · 3D Glowing Axon Pathways',
    telemetry: 'LATENCY: 0.12ms · INGEST: 50Hz · SAFETY: POSIX ATOMIC',
  },
  {
    id: 'scene-05-signal',
    name: 'The Signal & Morph',
    startProgress: 0.60,
    endProgress: 0.74,
    focalDistance: 15.0,
    fov: 60,
    eyebrow: 'DYNAMIC MORPH // PHASE TRANSITION',
    headline: 'SIGNAL VELOCITY ACCELERATION',
    subtitle: 'Synaptic Nodes Transforming to Digital Infrastructure',
    telemetry: 'PHOTON VELOCITY: 0.98c · STREAM: ENCRYPTED · CHANNELS: 128',
  },
  {
    id: 'scene-06-city',
    name: 'The Digital Metropolis',
    startProgress: 0.74,
    endProgress: 0.88,
    focalDistance: 45.0,
    fov: 52,
    eyebrow: 'METROPOLIS // PORTFOLIO TOPOLOGY',
    headline: 'ARCHITECTURAL ECOSYSTEM',
    subtitle: 'Every Tower Houses a Core Production Discipline',
    telemetry: 'TOWERS: 4 MEGALITHS // PROJECTS · SYSTEMS LAB · RESUME · TERMINAL',
  },
  {
    id: 'scene-07-portfolio',
    name: 'The Inner Sanctum',
    startProgress: 0.88,
    endProgress: 1.00,
    focalDistance: 10.0,
    fov: 45,
    eyebrow: 'PORTFOLIO // INNER SANCTUM',
    headline: 'EXECUTIVE SHOWCASE UNLOCKED',
    subtitle: 'Entering Naveen Bishnoi\'s Production Portfolio & Systems Lab',
    telemetry: 'BREAKTHROUGH: 100% · ACCESS: GRANTED · ROLE: LEAD ARCHITECT',
  },
];

export interface TimelineState {
  progress: number;
  targetProgress: number;
  currentSceneIndex: number;
  isCinematicActive: boolean;
  isCanvasVisible: boolean;
  reducedMotion: boolean;
  soundEnabled: boolean;
  quality: QualityTier;
  setProgress: (p: number) => void;
  setTargetProgress: (p: number) => void;
  setCinematicActive: (active: boolean) => void;
  setCanvasVisible: (visible: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setQuality: (q: QualityTier) => void;
}

export function getSceneIndex(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = SCENE_DEFINITIONS.length - 1; i >= 0; i--) {
    if (p >= SCENE_DEFINITIONS[i].startProgress) {
      return i;
    }
  }
  return 0;
}

export function getSceneProgress(progress: number, sceneIndex: number): number {
  const scene = SCENE_DEFINITIONS[sceneIndex];
  if (!scene) return 0;
  const range = scene.endProgress - scene.startProgress;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (progress - scene.startProgress) / range));
}

export const useTimeline = create<TimelineState>((set) => ({
  progress: 0,
  targetProgress: 0,
  currentSceneIndex: 0,
  isCinematicActive: true,
  isCanvasVisible: true,
  reducedMotion: false,
  soundEnabled: false,
  quality: 'high',
  setProgress: (p) => {
    const clamped = Math.max(0, Math.min(1, p));
    const sceneIdx = getSceneIndex(clamped);
    set({ progress: clamped, currentSceneIndex: sceneIdx });
  },
  setTargetProgress: (p) => {
    const clamped = Math.max(0, Math.min(1, p));
    set({ targetProgress: clamped });
  },
  setCinematicActive: (active) => set({ isCinematicActive: active }),
  setCanvasVisible: (visible) => set({ isCanvasVisible: visible }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setQuality: (q) => set({ quality: q }),
}));
