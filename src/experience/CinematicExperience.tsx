/**
 * src/experience/CinematicExperience.tsx
 * Master 3D WebGL Continuous Camera Journey Experience
 * 
 * Orchestrates:
 * 1. Fixed R3F WebGL Canvas with continuous CatmullRom spline camera trajectory
 * 2. 7 Procedural Scenes (Void Boot -> AI World -> Robot -> Brain -> Signal -> City -> Portfolio)
 * 3. Film-Grade Post-Processing Pipeline (Bloom, DoF, Chromatic Aberration, Grain, SMAA)
 * 4. Decoupled Minimal DOM Overlays with mix-blend-mode telemetry HUD
 * 5. Lenis Smooth Scroll & GSAP ScrollTrigger pinned track binding (0.0 to 1.0)
 * 6. Smooth unpinning and transition into executive portfolio showcase
 */

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

import CameraController from './camera/CameraController';
import Scene01Boot from './scenes/Scene01Boot';
import Scene02AIWorld from './scenes/Scene02AIWorld';
import Scene03Robot from './scenes/Scene03Robot';
import Scene04Brain from './scenes/Scene04Brain';
import Scene05Signal from './scenes/Scene05Signal';
import Scene06City from './scenes/Scene06City';
import Scene07Portfolio from './scenes/Scene07Portfolio';
import PostProcessingPipeline from './postprocessing/PostProcessingPipeline';
import CinematicOverlay from './overlay/CinematicOverlay';
import { useTimeline } from './timeline/CinematicTimeline';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CinematicExperienceProps {
  scrollTrackHeight?: string;
  enablePostProcessing?: boolean;
  className?: string;
}

export default function CinematicExperience({
  scrollTrackHeight = '700vh',
  enablePostProcessing = true,
  className = '',
}: CinematicExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const progress = useTimeline((s) => s.progress);
  const setTargetProgress = useTimeline((s) => s.setTargetProgress);
  const setReducedMotion = useTimeline((s) => s.setReducedMotion);

  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // Check WebGL availability
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Setup Lenis Smooth Scroll & GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined' || !trackRef.current) return;

    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Create ScrollTrigger Timeline mapped strictly 0.0 -> 1.0
    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setTargetProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setTargetProgress]);

  // Skip function to jump straight to executive portfolio
  const handleSkip = () => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const scrollTarget = window.scrollY + trackRect.height;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(scrollTarget, { duration: 1.5 });
    } else {
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  // Compute fixed canvas container opacity.
  // The 3D world stays fully visible through the journey, then dissolves
  // completely into the editorial portfolio UI as progress reaches 1.0.
  const canvasOpacity =
    progress >= 0.95 ? Math.max(0, 1.0 - (progress - 0.95) * 20) : 1.0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* 1. Fixed 3D WebGL Canvas Layer */}
      <div
        className="fixed inset-0 w-screen h-screen pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          zIndex: 0,
          opacity: canvasOpacity,
        }}
      >
        {hasWebGL ? (
          <Canvas
            gl={{
              antialias: false,
              powerPreference: 'high-performance',
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
            camera={{ position: [0, 0, 45], fov: 45, near: 0.1, far: 250 }}
            className="w-full h-full block"
          >
            <color attach="background" args={['#030712']} />
            <ambientLight intensity={0.25} />

            {/* Continuous Camera Spline Controller */}
            <CameraController />

            {/* 7 Procedural 3D Scenes */}
            <Scene01Boot />
            <Scene02AIWorld />
            <Scene03Robot />
            <Scene04Brain />
            <Scene05Signal />
            <Scene06City />
            <Scene07Portfolio />

            {/* Film-Grade Post-Processing Pipeline */}
            <PostProcessingPipeline enabled={enablePostProcessing} />
          </Canvas>
        ) : (
          <div className="w-full h-full bg-[#030712] flex items-center justify-center text-cyan-400 font-mono text-xs">
            [WEBGL FALLBACK: 2D CORE ACTIVE]
          </div>
        )}

        {/* Synchronized HUD & Narrative DOM Overlays */}
        <CinematicOverlay progress={progress} onSkip={handleSkip} />
      </div>

      {/* 2. Scroll Track Container (Provides physical scroll delta for scrubbing) */}
      <div
        ref={trackRef}
        style={{ height: scrollTrackHeight }}
        className="relative w-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
