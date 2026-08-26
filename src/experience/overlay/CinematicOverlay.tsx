/**
 * src/experience/overlay/CinematicOverlay.tsx
 * Minimal DOM Overlays Synchronized Across 7 Continuous Scenes
 * 
 * Styled with mix-blend-mode: overlay & difference for Swiss/sci-fi typography.
 * Smooth GSAP / React opacity transitions per scene range defined in SCENE_MAP.md.
 */

import React, { useMemo } from 'react';
import { useTimeline, SCENE_DEFINITIONS, getSceneIndex } from '../timeline/CinematicTimeline';

export interface CinematicOverlayProps {
  progress?: number;
  onSkip?: () => void;
}

export default function CinematicOverlay({ progress: propProgress, onSkip }: CinematicOverlayProps) {
  const storeProgress = useTimeline((s) => s.progress);
  const p = Math.max(0, Math.min(1, propProgress !== undefined ? propProgress : storeProgress));
  const activeIndex = getSceneIndex(p);

  // Compute opacities for all 7 scenes
  const opacities = useMemo(() => {
    return SCENE_DEFINITIONS.map((scene, idx) => {
      const { startProgress, endProgress } = scene;
      const range = endProgress - startProgress;
      const fadeInWindow = range * 0.25;
      const fadeOutWindow = range * 0.25;

      if (p < startProgress) return 0;
      if (idx === SCENE_DEFINITIONS.length - 1) {
        // Last scene fades in and stays visible or transitions
        if (p < startProgress + fadeInWindow) {
          return (p - startProgress) / fadeInWindow;
        }
        return 1;
      }
      if (p < startProgress + fadeInWindow) {
        return (p - startProgress) / fadeInWindow;
      }
      if (p <= endProgress - fadeOutWindow) {
        return 1;
      }
      if (p <= endProgress) {
        return Math.max(0, 1 - (p - (endProgress - fadeOutWindow)) / fadeOutWindow);
      }
      return 0;
    });
  }, [p]);

  // Breakthrough Optical Radial Flare Intensity (0.86 to 1.0)
  const flareIntensity = useMemo(() => {
    if (p < 0.86) return 0;
    return Math.min(1, (p - 0.86) / 0.14);
  }, [p]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
      {/* Top Telemetry Header Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-cyan-400/90 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-cyan-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold tracking-wider text-cyan-300">
              SCENE 0{activeIndex + 1} // {SCENE_DEFINITIONS[activeIndex]?.name.toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:inline-block text-gray-400 font-mono">
            SPLINE: {(p * 100).toFixed(1)}%
          </span>
          <span className="hidden md:inline-block text-cyan-400/40">|</span>
          <span className="hidden md:inline-block text-cyan-300/70 font-mono">
            {SCENE_DEFINITIONS[activeIndex]?.telemetry}
          </span>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400/40 text-white text-xs font-mono tracking-wider backdrop-blur-lg transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Skip to Executive Portfolio"
          >
            <span>SKIP TO SHOWCASE</span>
            <svg
              className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* SCENE 01: THE VOID BOOT */}
      <div
        style={{
          opacity: opacities[0],
          transform: `translate3d(0, ${-p * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{SCENE_DEFINITIONS[0].eyebrow}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4 drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          NAVEEN BISHNOI
        </h1>

        <p className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300 mb-6">
          Lead AI &amp; Edge Systems Architect
        </p>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed mb-10">
          {SCENE_DEFINITIONS[0].subtitle}
        </p>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-mono tracking-[0.2em] text-cyan-400/90 uppercase animate-pulse">
            [ SCROLL TO COMMENCE CAMERA JOURNEY ]
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* SCENE 02: THE AI MEGALITH */}
      <div
        style={{
          opacity: opacities[1],
          transform: `translate3d(0, ${-(p - 0.20) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col justify-between p-8 sm:p-16 max-w-7xl mx-auto pointer-events-none"
      >
        <div className="self-start mt-12 sm:mt-16 max-w-md bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-cyan-500/30 text-left shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{SCENE_DEFINITIONS[1].eyebrow}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            {SCENE_DEFINITIONS[1].headline}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {SCENE_DEFINITIONS[1].subtitle}
          </p>
        </div>
      </div>

      {/* SCENE 03: THE HUMANOID TITAN */}
      <div
        style={{
          opacity: opacities[2],
          transform: `translate3d(0, ${-(p - 0.35) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
          <span>{SCENE_DEFINITIONS[2].eyebrow}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
          {SCENE_DEFINITIONS[2].headline}
        </h2>
        <p className="text-sm sm:text-base font-mono text-cyan-300 max-w-xl">
          {SCENE_DEFINITIONS[2].subtitle}
        </p>
      </div>

      {/* SCENE 04: THE SYNAPTIC BRAIN */}
      <div
        style={{
          opacity: opacities[3],
          transform: `translate3d(0, ${-(p - 0.50) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 max-w-7xl mx-auto pointer-events-none"
      >
        <div className="self-start max-w-lg bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/30 text-left shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{SCENE_DEFINITIONS[3].eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {SCENE_DEFINITIONS[3].headline}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-4">
            {SCENE_DEFINITIONS[3].subtitle}
          </p>
          <div className="text-[11px] font-mono text-cyan-300/90 pt-3 border-t border-cyan-500/20">
            {SCENE_DEFINITIONS[3].telemetry}
          </div>
        </div>
      </div>

      {/* SCENE 05: THE SIGNAL & MORPH */}
      <div
        style={{
          opacity: opacities[4],
          transform: `translate3d(0, ${-(p - 0.65) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{SCENE_DEFINITIONS[4].eyebrow}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-[0_0_40px_rgba(0,240,255,0.5)]">
          {SCENE_DEFINITIONS[4].headline}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 font-mono max-w-2xl">
          {SCENE_DEFINITIONS[4].subtitle}
        </p>
      </div>

      {/* SCENE 06: THE DIGITAL METROPOLIS */}
      <div
        style={{
          opacity: opacities[5],
          transform: `translate3d(0, ${-(p - 0.80) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col justify-between p-8 sm:p-16 max-w-7xl mx-auto pointer-events-none"
      >
        <div className="self-end mt-12 sm:mt-16 max-w-md bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-amber-500/30 text-right shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-end gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
            <span>{SCENE_DEFINITIONS[5].eyebrow}</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            {SCENE_DEFINITIONS[5].headline}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            {SCENE_DEFINITIONS[5].subtitle}
          </p>
        </div>
      </div>

      {/* SCENE 07: THE INNER SANCTUM */}
      <div
        style={{
          opacity: opacities[6],
          transform: `translate3d(0, ${-(p - 0.94) * 20}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{SCENE_DEFINITIONS[6].eyebrow}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_50px_rgba(255,255,255,0.7)]">
          {SCENE_DEFINITIONS[6].headline}
        </h2>

        <p className="text-base sm:text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
          {SCENE_DEFINITIONS[6].subtitle}
        </p>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>CONTINUE SCROLLING TO EXPLORE EXECUTIVE PORTFOLIO ↓</span>
        </div>
      </div>

      {/* OPTICAL RADIAL LIGHT FLARE OVERLAY */}
      {flareIntensity > 0 && (
        <div
          aria-hidden="true"
          style={{
            opacity: flareIntensity,
            transform: `scale(${1 + flareIntensity * 0.5})`,
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
          }}
          className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(0,240,255,0.6)_35%,rgba(168,85,247,0.3)_65%,transparent_85%)]"
        />
      )}

      {/* Bottom Subtle Progress Track */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 via-amber-400 to-emerald-400 transition-all duration-75"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </div>
  );
}
