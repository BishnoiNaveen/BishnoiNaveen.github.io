import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Cpu,
  Volume2,
  Play,
  RotateCcw,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { springPresets } from '../../lib/springs';

export default function InteractivePlayground() {
  const [activeToy, setActiveToy] = useState<'canbus' | 'swarm' | 'audio'>('canbus');

  // ----------------------------------------------------
  // TOY 1: CAN-Bus Tractor Telemetry Simulator State
  // ----------------------------------------------------
  const [rpm, setRpm] = useState<number>(1850);
  const [hydraulics, setHydraulics] = useState<number>(205);
  const [speed, setSpeed] = useState<number>(14.2);
  const [packetsIngested, setPacketsIngested] = useState<number>(14820);
  const [busState, setBusState] = useState<'nominal' | 'network_drop' | 'error_injected'>('nominal');
  const [bufferedCount, setBufferedCount] = useState<number>(0);

  // Live telemetry pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (busState === 'nominal') {
        setRpm(1840 + Math.floor(Math.random() * 25));
        setHydraulics(204 + Math.floor(Math.random() * 4));
        setPacketsIngested((p) => p + 50);
      } else if (busState === 'network_drop') {
        setBufferedCount((c) => c + 50);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [busState]);

  const handleSimulateDrop = () => {
    setBusState('network_drop');
  };

  const handleInjectError = () => {
    setBusState('error_injected');
    setTimeout(() => {
      setBusState('nominal');
    }, 3500);
  };

  const handleFlushAndRecover = () => {
    setBusState('nominal');
    setPacketsIngested((p) => p + bufferedCount);
    setBufferedCount(0);
  };

  // ----------------------------------------------------
  // TOY 2: Ultron Multi-Agent Swarm Visualizer State
  // ----------------------------------------------------
  const [swarmState, setSwarmState] = useState<'idle' | 'planning' | 'verifying' | 'synthesizing' | 'consensus'>('idle');
  const [activeStepText, setActiveStepText] = useState<string>('System Idle · Ready for Autonomous Dispatch');

  const handleDispatchSwarm = () => {
    setSwarmState('planning');
    setActiveStepText('Planner Agent decomposing goal into topological DAG tasks...');

    setTimeout(() => {
      setSwarmState('verifying');
      setActiveStepText('AST Taint Sentry auditing command parameters for code injection...');
    }, 1200);

    setTimeout(() => {
      setSwarmState('synthesizing');
      setActiveStepText('Synthesis Node producing patch with proven memory bounds...');
    }, 2400);

    setTimeout(() => {
      setSwarmState('consensus');
      setActiveStepText('BFT Quorum achieved: 4/4 nodes signed execution receipt!');
    }, 3600);
  };

  const handleResetSwarm = () => {
    setSwarmState('idle');
    setActiveStepText('System Idle · Ready for Autonomous Dispatch');
  };

  // ----------------------------------------------------
  // TOY 3: Web Audio Tactile Tone Synthesizer
  // ----------------------------------------------------
  const playTone = (freq: number, type: OscillatorType = 'sine', duration = 0.04) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  return (
    <section id="toys" aria-label="Interactive Engineering Playground" className="relative py-20 px-6 md:px-12 lg:px-16 contain-layout">
      <div className="max-w-[96rem] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/10 mb-4 select-none">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--color-text-secondary)]">
                Chapter 04 · Interactive Engineering Playground
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)]">
              Interactive Systems Toys.
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-2 max-w-2xl font-normal">
              Directly interact with live micro-simulators of Naveen&apos;s real-world architectures: CAN-bus tractor telematics, multi-agent BFT consensus, and tactile sound design.
            </p>
          </div>

          {/* Toy Navigation Tabs */}
          <div className="p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 flex items-center gap-1 self-start md:self-auto">
            {[
              { id: 'canbus', label: 'CAN-Bus Telematics', icon: Radio },
              { id: 'swarm', label: 'Ultron AI Swarm', icon: Cpu },
              { id: 'audio', label: 'Haptic Audio FX', icon: Volume2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeToy === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playTone(600, 'sine', 0.02);
                    setActiveToy(tab.id as any);
                  }}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isActive
                      ? 'text-[var(--color-text-primary)] font-bold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeToyTab"
                      transition={springPresets.snappy}
                      className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-black/[0.06] dark:border-white/15 -z-10"
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TOY 1: CAN-BUS TRACTOR TELEMATICS SIMULATOR          */}
        {/* ---------------------------------------------------- */}
        {activeToy === 'canbus' && (
          <div className="p-6 sm:p-10 rounded-[32px] bg-white/80 dark:bg-[#0c0f1d]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/8">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--color-accent)]">
                  KRONE Agricultural Edge Telemetry Harness
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mt-0.5">
                  50Hz Ingestion &amp; Crash-Proof WAL Buffer
                </h3>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 self-start sm:self-auto">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    busState === 'nominal'
                      ? 'bg-emerald-500 animate-pulse'
                      : busState === 'network_drop'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-rose-500 animate-ping'
                  }`}
                />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  {busState === 'nominal' && 'STATUS: STREAMING (50Hz)'}
                  {busState === 'network_drop' && 'STATUS: OFFLINE WAL BUFFERING'}
                  {busState === 'error_injected' && 'STATUS: CRC ERROR FILTERED'}
                </span>
              </div>
            </div>

            {/* Live Telemetry Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Harvester RPM
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[var(--color-accent)] my-1">
                  {rpm}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Nominal Band (1800-1900)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Hydraulic Pressure
                </span>
                <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 my-1">
                  {hydraulics} bar
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  Proportional Valve Closed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Packets Ingested
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1">
                  {packetsIngested.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  0 Drops · Inode Swapped
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Edge WAL Buffer
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-500 my-1">
                  {bufferedCount} pkts
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {bufferedCount > 0 ? 'Pending Atomic Sync' : 'Buffer Flushed'}
                </span>
              </div>
            </div>

            {/* Interactive Test Action Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/[0.06] dark:border-white/8">
              <button
                type="button"
                onClick={() => {
                  playTone(450, 'square', 0.04);
                  handleSimulateDrop();
                }}
                disabled={busState === 'network_drop'}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold tracking-tight transition-all cursor-pointer disabled:opacity-40"
              >
                Simulate Field Network Drop
              </button>

              <button
                type="button"
                onClick={() => {
                  playTone(300, 'sawtooth', 0.05);
                  handleInjectError();
                }}
                disabled={busState !== 'nominal'}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-bold tracking-tight transition-all cursor-pointer disabled:opacity-40"
              >
                Inject Corrupted CAN Frame
              </button>

              <button
                type="button"
                onClick={() => {
                  playTone(880, 'sine', 0.06);
                  handleFlushAndRecover();
                }}
                disabled={busState === 'nominal' && bufferedCount === 0}
                className="px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[#0077ED] text-white text-xs font-bold tracking-tight transition-all cursor-pointer shadow-sm disabled:opacity-40"
              >
                Recover Link &amp; Atomic Inode Flush
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TOY 2: ULTRON MULTI-AGENT SWARM VISUALIZER           */}
        {/* ---------------------------------------------------- */}
        {activeToy === 'swarm' && (
          <div className="p-6 sm:p-10 rounded-[32px] bg-white/80 dark:bg-[#0c0f1d]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/8">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                  Ultron Autonomous Multi-Agent Swarm
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mt-0.5">
                  BFT Consensus &amp; AST Taint Verification
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playTone(700, 'sine', 0.03);
                    handleDispatchSwarm();
                  }}
                  disabled={swarmState !== 'idle' && swarmState !== 'consensus'}
                  className="px-4 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[#0077ED] text-white text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5" />
                  Dispatch Mission
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTone(500, 'sine', 0.02);
                    handleResetSwarm();
                  }}
                  className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Agent Swarm Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'planning',
                  title: '1. Planner Agent',
                  desc: 'Topological DAG Kahn Sorter',
                  status: swarmState === 'planning' ? 'Active Decomposing' : swarmState !== 'idle' ? 'Done' : 'Standby',
                  color: '#0071e3',
                },
                {
                  id: 'verifying',
                  title: '2. Security Sentry',
                  desc: 'AST Taint & Injection Sentry',
                  status: swarmState === 'verifying' ? 'Active Auditing' : swarmState === 'synthesizing' || swarmState === 'consensus' ? 'Taint-Free Verified' : 'Standby',
                  color: '#8020e8',
                },
                {
                  id: 'synthesizing',
                  title: '3. Synthesizer Agent',
                  desc: 'Deterministic Code Bounds',
                  status: swarmState === 'synthesizing' ? 'Active Compiling' : swarmState === 'consensus' ? 'Invariants Proven' : 'Standby',
                  color: '#f59e0b',
                },
                {
                  id: 'consensus',
                  title: '4. Byzantine Verifier',
                  desc: '4/4 BFT Quorum Consensus',
                  status: swarmState === 'consensus' ? 'Quorum Verified 4/4' : 'Awaiting Signatures',
                  color: '#10b981',
                },
              ].map((node) => {
                const isCurrent = swarmState === node.id;
                return (
                  <div
                    key={node.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] shadow-md'
                        : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.05] dark:border-white/8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        {node.title}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: isCurrent ? node.color : '#94a3b8',
                          boxShadow: isCurrent ? `0 0 10px ${node.color}` : 'none',
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-mono mb-2">
                      {node.desc}
                    </p>
                    <div className="text-xs font-semibold" style={{ color: node.color }}>
                      {node.status}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Step Status Log */}
            <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/8 flex items-center gap-3">
              <Activity className="w-4 h-4 text-[var(--color-accent)] animate-pulse shrink-0" />
              <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                {activeStepText}
              </span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TOY 3: HAPTIC AUDIO FX SYNTHESIZER                   */}
        {/* ---------------------------------------------------- */}
        {activeToy === 'audio' && (
          <div className="p-6 sm:p-10 rounded-[32px] bg-white/80 dark:bg-[#0c0f1d]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-8">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                WWDC Fluid Interface Sound Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mt-0.5">
                Apple-Grade Web Audio Synthesizer
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-normal">
                Click any key below to synthesize genuine hardware tactile micro-clicks and feedback chimes using the native Web Audio API (zero external sound files needed).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Soft Press', freq: 650, wave: 'sine', dur: 0.025 },
                { label: 'Spring Snap', freq: 900, wave: 'triangle', dur: 0.035 },
                { label: 'Commit Tick', freq: 1100, wave: 'sine', dur: 0.02 },
                { label: 'Success Chime', freq: 1400, wave: 'sine', dur: 0.08 },
              ].map((sound, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => playTone(sound.freq, sound.wave as OscillatorType, sound.dur)}
                  className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] hover:bg-[var(--color-accent)]/10 border border-black/[0.06] dark:border-white/10 hover:border-[var(--color-accent)]/30 text-center transition-all cursor-pointer flex flex-col items-center gap-1 group active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">
                    {sound.label}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    {sound.freq} Hz · {sound.wave}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
