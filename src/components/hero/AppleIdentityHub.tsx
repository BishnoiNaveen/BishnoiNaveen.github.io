import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Radio, Zap, Layers, Sparkles, Terminal } from 'lucide-react';
import { springPresets } from '../../lib/springs';

type SystemMode = 'edge' | 'swarm' | 'core';

interface TelemetryMetrics {
  title: string;
  badge: string;
  stat1: { label: string; value: string; sub: string };
  stat2: { label: string; value: string; sub: string };
  stat3: { label: string; value: string; sub: string };
  status: string;
  activeNode: string;
}

const SYSTEM_METRICS: Record<SystemMode, TelemetryMetrics> = {
  edge: {
    title: 'KRONE Agricultural Telematics Engine',
    badge: 'Real-Time Edge Ingest',
    stat1: { label: 'CAN Bus Stream', value: '50 Hz', sub: 'Deterministic Loop' },
    stat2: { label: 'Event Ingest', value: '14.8k/s', sub: 'Zero Packet Loss' },
    stat3: { label: 'Disk Commit', value: 'Atomic', sub: 'POSIX Inode Swap' },
    status: 'OPTIMAL · 99.99% UPTIME',
    activeNode: 'NODE: KRONE-IN-HARVEST-01',
  },
  swarm: {
    title: 'Ultron Autonomous Multi-Agent Swarm',
    badge: 'Deterministic AI Orchestration',
    stat1: { label: 'Consensus', value: 'BFT-4', sub: 'Byzantine Quorum' },
    stat2: { label: 'DAG Resolution', value: 'Topological', sub: 'Kahn Cycle-Free' },
    stat3: { label: 'AST Sentry', value: 'Armed', sub: 'Taint-Tracked AST' },
    status: 'SWARM ACTIVE · 4 AGENTS SYNCED',
    activeNode: 'DISPATCHER: ULTRON-CORE-BFT',
  },
  core: {
    title: 'High-Assurance POSIX & Rust Engine',
    badge: 'Memory Invariants Enforced',
    stat1: { label: 'Memory Audit', value: '0 Bytes', sub: 'Valgrind Verified' },
    stat2: { label: 'Heap Footprint', value: '1.8 MB', sub: 'Fixed Allocation' },
    stat3: { label: 'Crash Recovery', value: '< 2 ms', sub: 'WAL Replay Invariant' },
    status: 'ALL INVARIANTS PROVEN',
    activeNode: 'ENGINE: GAMS-POSIX-STORAGE',
  },
};

export default function AppleIdentityHub() {
  const [activeMode, setActiveMode] = useState<SystemMode>('edge');
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse physics for 3D spring tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 25,
    stiffness: 300,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 25,
    stiffness: 300,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const current = SYSTEM_METRICS[activeMode];

  return (
    <div className="relative w-full max-w-lg mx-auto select-none" style={{ perspective: '1200px' }}>
      {/* Outer ambient glow */}
      <div
        className="absolute -inset-4 rounded-[40px] opacity-40 blur-3xl pointer-events-none transition-all duration-700 -z-10"
        style={{
          background:
            activeMode === 'edge'
              ? 'radial-gradient(circle, rgba(0,113,227,0.3) 0%, rgba(52,199,89,0.2) 60%, transparent 80%)'
              : activeMode === 'swarm'
              ? 'radial-gradient(circle, rgba(128,32,232,0.3) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(52,199,89,0.3) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)',
        }}
      />

      {/* 3D Spring Tilt Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-[32px] p-6 sm:p-8 bg-white/85 dark:bg-[#0c0f1d]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/12 shadow-[0_16px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300"
      >
        {/* Specular hairline top light */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/30 to-transparent pointer-events-none" />

        {/* Card Header & Status */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--color-text-secondary)]">
              {current.status}
            </span>
          </div>

          <div className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider">
            {current.activeNode}
          </div>
        </div>

        {/* Dynamic Holographic Monogram Core */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          {/* Orbiting Ring 1 */}
          <div
            className="absolute w-48 h-48 rounded-full border border-dashed border-[var(--color-accent)]/20 animate-spin-slow pointer-events-none"
            style={{ animationDuration: '30s' }}
          />

          {/* Orbiting Ring 2 */}
          <div
            className="absolute w-40 h-40 rounded-full border border-dotted border-[var(--color-accent)]/30 pointer-events-none"
            style={{ animation: 'spin-slow 20s linear infinite reverse' }}
          />

          {/* Central Monogram Emblem */}
          <div className="relative z-10 w-28 h-28 rounded-3xl flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-black/[0.08] dark:border-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
            {/* Animated glowing inner ring */}
            <div className="absolute inset-1 rounded-[22px] bg-gradient-to-tr from-[var(--color-accent)]/10 via-transparent to-[var(--color-accent)]/20 pointer-events-none" />

            <div className="relative text-3xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-[var(--color-accent)] to-slate-700 dark:from-white dark:via-blue-300 dark:to-slate-300 bg-clip-text text-transparent">
              NB
            </div>
            <div className="text-[9px] font-mono tracking-widest uppercase font-bold text-[var(--color-accent)] mt-0.5">
              ARCHITECT
            </div>
          </div>

          {/* Role Pill */}
          <div className="mt-4 text-center">
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Naveen Bishnoi
            </h3>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">
              Software Architect &amp; Systems Engineer · KRONE AG
            </p>
          </div>
        </div>

        {/* Interactive System Mode Switcher */}
        <div className="p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 grid grid-cols-3 gap-1 mb-6">
          {(
            [
              { id: 'edge', label: 'Edge Telematics', icon: Radio },
              { id: 'swarm', label: 'Ultron Swarm', icon: Cpu },
              { id: 'core', label: 'Systems Core', icon: ShieldCheck },
            ] as const
          ).map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`relative py-2 px-2 rounded-xl text-[11px] font-semibold tracking-tight transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  isActive
                    ? 'text-[var(--color-text-primary)] font-bold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeroModePill"
                    transition={springPresets.snappy}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-black/[0.06] dark:border-white/15 -z-10"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />
                <span className="truncate w-full text-center">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Invariant Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {[current.stat1, current.stat2, current.stat3].map((stat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col items-center text-center transition-colors"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                {stat.label}
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight text-[var(--color-accent)] my-0.5">
                {stat.value}
              </span>
              <span className="text-[9px] font-medium text-[var(--color-text-secondary)] leading-tight">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Verification Footer */}
        <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/8 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Deterministic Invariants
          </span>
          <span className="text-[var(--color-accent)] font-semibold">
            {current.badge}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
