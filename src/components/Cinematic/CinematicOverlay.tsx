/**
 * src/components/Cinematic/CinematicOverlay.tsx
 * Synchronized HUD & Narrative Typography Across 4 Acts
 * 
 * Act 1 (0.00 - 0.25): Cyber Void & Intro Hero ("NAVEEN BISHNOI", "Scroll to Initialize Neural Dive")
 * Act 2 (0.25 - 0.60): Deep AI Dive HUD ("DEEP NEURAL LINK ACTIVE", "Synaptic Lattice 4.8 THz", Live Telemetry)
 * Act 3 (0.60 - 0.85): Singularity Pass-Through ("SINGULARITY PASS-THROUGH", "Kernel Memory Safe · 0ms Latency")
 * Act 4 (0.85 - 1.00): Light Breakthrough Flare & Horizon Reveal ("TRANSITIONING TO RESUME & PORTFOLIO")
 */

import React, { useMemo } from 'react';

export interface CinematicOverlayProps {
  progress: number; // 0.0 to 1.0
  onSkip?: () => void;
}

export default function CinematicOverlay({ progress, onSkip }: CinematicOverlayProps) {
  const p = Math.max(0, Math.min(1, progress));

  // Compute opacities and transforms for each act
  const act1Opacity = useMemo(() => {
    if (p <= 0.20) return 1;
    if (p <= 0.28) return Math.max(0, 1 - (p - 0.20) / 0.08);
    return 0;
  }, [p]);

  const act2Opacity = useMemo(() => {
    if (p < 0.25) return 0;
    if (p <= 0.32) return (p - 0.25) / 0.07;
    if (p <= 0.52) return 1;
    if (p <= 0.60) return Math.max(0, 1 - (p - 0.52) / 0.08);
    return 0;
  }, [p]);

  const act3Opacity = useMemo(() => {
    if (p < 0.58) return 0;
    if (p <= 0.65) return (p - 0.58) / 0.07;
    if (p <= 0.78) return 1;
    if (p <= 0.86) return Math.max(0, 1 - (p - 0.78) / 0.08);
    return 0;
  }, [p]);

  const act4Opacity = useMemo(() => {
    if (p < 0.84) return 0;
    return Math.min(1, (p - 0.84) / 0.10);
  }, [p]);

  // Breakthrough Optical Radial Flare Intensity (0.82 to 1.0)
  const flareIntensity = useMemo(() => {
    if (p < 0.82) return 0;
    return Math.min(1, (p - 0.82) / 0.18);
  }, [p]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
      {/* Top Telemetry Header Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-cyan-400/80 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold tracking-wider text-cyan-300">CORE.TELEMETRY</span>
          </div>
          <span className="hidden sm:inline-block text-gray-400">
            FRAME: {Math.min(120, Math.max(1, Math.round(p * 119) + 1))} / 120
          </span>
          <span className="hidden md:inline-block text-cyan-400/60">|</span>
          <span className="hidden md:inline-block text-cyan-300/80">
            DIVE DEPTH: {(p * 100).toFixed(1)}%
          </span>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400/40 text-white text-xs font-mono tracking-wider backdrop-blur-lg transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Skip to Executive Resume"
          >
            <span>SKIP TO RESUME</span>
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

      {/* ACT 1: INTRO CYBER VOID */}
      <div
        style={{
          opacity: act1Opacity,
          transform: `translate3d(0, ${-p * 40}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Chapter 01 · Neural Interface</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4 drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          NAVEEN BISHNOI
        </h1>

        <p className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300 mb-6">
          Principal AI &amp; Systems Architect
        </p>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed mb-10">
          From bare-metal POSIX memory allocations to distributed autonomous agent swarms:
          software built with mathematical invariants and physical depth.
        </p>

        {/* Scroll CTA Indicator */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-mono tracking-[0.2em] text-cyan-400/90 uppercase animate-pulse">
            Scroll to Initialize Neural Dive
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* ACT 2: DEEP AI DIVE HUD */}
      <div
        style={{
          opacity: act2Opacity,
          transform: `translate3d(0, ${-(p - 0.35) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col justify-between p-8 sm:p-16 max-w-7xl mx-auto pointer-events-none"
      >
        {/* Top Left HUD Status */}
        <div className="self-start mt-12 sm:mt-16 max-w-md bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-cyan-500/30 text-left shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>DEEP NEURAL LINK ACTIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            Synaptic Lattice 4.8 THz
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
            Real-time telemetry stream ingesting distributed CAN bus frames, synchronizing 84 autonomous axon nodes with sub-millisecond deterministic latency.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-cyan-300/90 pt-2 border-t border-cyan-500/20">
            <div>▸ NODES: 84 / 84 ACTIVE</div>
            <div>▸ LATENCY: 0.12 ms</div>
            <div>▸ FREQ: 50Hz INGEST</div>
            <div>▸ BUFFER: 72h RING</div>
          </div>
        </div>

        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-400/20 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dashed border-violet-400/30 animate-spin" style={{ animationDuration: '24s' }}></div>
          <div className="w-4 h-4 rounded-full bg-cyan-400/80 animate-ping"></div>
          <div className="absolute top-0 text-[10px] font-mono text-cyan-400 tracking-widest">▲ TARGET LOCK</div>
        </div>

        {/* Bottom Right HUD Status */}
        <div className="self-end max-w-md bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-violet-500/30 text-right shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-end gap-2 text-xs font-mono font-bold text-violet-400 mb-2">
            <span>CONSENSUS GATE // 3f+1</span>
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
          </div>
          <div className="text-lg font-bold text-white mb-1">
            BFT Quorum &amp; Memory Safety
          </div>
          <p className="text-xs text-gray-300 mb-3">
            Multi-agent Byzantine Fault Tolerant sign-off across code generation, security sentry, and automated test runners.
          </p>
          <div className="text-[11px] font-mono text-violet-300">
            VALGRIND CERTIFIED: 0 BYTES LOST
          </div>
        </div>
      </div>

      {/* ACT 3: SINGULARITY PASS-THROUGH */}
      <div
        style={{
          opacity: act3Opacity,
          transform: `translate3d(0, ${-(p - 0.70) * 30}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
          <span>Core Penetration // Singularity Layer</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
          SINGULARITY PASS-THROUGH
        </h2>

        <p className="text-base sm:text-xl font-mono text-cyan-300 mb-8 font-semibold">
          Kernel Memory Safe · 0ms Latency · BFT Consensus (3f+1)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-500/30">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-1">INVARIANT 01</div>
            <div className="text-sm font-bold text-white mb-1">POSIX Atomic Swap</div>
            <div className="text-xs text-gray-300">rename() syscall ensures zero partial state writes.</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-violet-500/30">
            <div className="text-xs font-mono text-violet-400 font-bold mb-1">INVARIANT 02</div>
            <div className="text-sm font-bold text-white mb-1">Kahn DAG Sentry</div>
            <div className="text-xs text-gray-300">O(V+E) cycle detection guarantees deadlock-free dispatch.</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-amber-500/30">
            <div className="text-xs font-mono text-amber-400 font-bold mb-1">INVARIANT 03</div>
            <div className="text-sm font-bold text-white mb-1">Edge Ingest 50Hz</div>
            <div className="text-xs text-gray-300">SocketCAN filter ring buffer prevents telemetry dropouts.</div>
          </div>
        </div>
      </div>

      {/* ACT 4: HORIZON BREAKTHROUGH & RESUME REVEAL */}
      <div
        style={{
          opacity: act4Opacity,
          transform: `translate3d(0, ${-(p - 0.90) * 20}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Breakthrough Detected · Entering Physical Realm</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_50px_rgba(255,255,255,0.7)]">
          TRANSITIONING TO RESUME &amp; PORTFOLIO
        </h2>

        <p className="text-base sm:text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
          Neural Dive Complete. Unveiling production-grade systems architecture, verified case studies, and live interactive simulators.
        </p>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>CONTINUE SCROLLING TO EXPLORE EXECUTIVE SHOWCASE ↓</span>
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
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 transition-all duration-75"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </div>
  );
}
