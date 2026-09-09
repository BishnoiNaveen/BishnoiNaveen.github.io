import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Radio, Database, Cpu, Activity, ShieldCheck, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { springPresets } from '../../lib/springs';

type TabMode = 'telematics' | 'storage' | 'swarm';

export default function InteractiveCockpit() {
  const [activeTab, setActiveTab] = useState<TabMode>('telematics');
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [walBuffer, setWalBuffer] = useState<number>(14.8);
  const [packetCount, setPacketCount] = useState<number>(84290);
  const [storageStep, setStorageStep] = useState<number>(3); // Atomic Inode Swap
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse physics for 3D spring tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 25,
    stiffness: 300,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    damping: 25,
    stiffness: 300,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Simulate continuous live packet count
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((p) => p + 50);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate buffer fill/drain on blackout toggle
  useEffect(() => {
    if (isBlackout) {
      const interval = setInterval(() => {
        setWalBuffer((prev) => (prev < 88 ? +(prev + 1.2).toFixed(1) : 88));
      }, 500);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setWalBuffer((prev) => (prev > 14.8 ? +(prev - 3.5).toFixed(1) : 14.8));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isBlackout]);

  // Keyboard navigation for Cockpit tabs (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === '1') setActiveTab('telematics');
      else if (e.key === '2') setActiveTab('storage');
      else if (e.key === '3') setActiveTab('swarm');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ perspective: '1200px' }}>
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute -inset-3 rounded-[36px] opacity-35 dark:opacity-25 blur-3xl pointer-events-none transition-all duration-700 -z-10"
        style={{
          background:
            activeTab === 'telematics'
              ? 'radial-gradient(circle, rgba(0,113,227,0.35) 0%, rgba(16,185,129,0.2) 60%, transparent 80%)'
              : activeTab === 'storage'
              ? 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(128,32,232,0.35) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)',
        }}
      />

      {/* 3D Glass Cockpit Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-3xl p-5 sm:p-7 bg-white/85 dark:bg-[#0c101d]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/12 shadow-[0_16px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-200"
      >
        {/* Specular hairline top reflection */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />

        {/* Top Status & Cockpit Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-tight text-[var(--color-text-primary)]">
              LIVE SYSTEMS RUNTIME
            </span>
          </div>

          <div className="text-[11px] font-mono text-[var(--color-text-muted)] bg-black/[0.03] dark:bg-white/[0.06] px-2.5 py-1 rounded-full border border-black/[0.05] dark:border-white/10">
            {packetCount.toLocaleString()} pkts ingested
          </div>
        </div>

        {/* Cockpit Mode Selector Tabs */}
        <div className="p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 grid grid-cols-3 gap-1 mb-5">
          {(
            [
              { id: 'telematics', label: 'CAN-Bus IoT', icon: Radio, shortcut: '1' },
              { id: 'storage', label: 'POSIX Storage', icon: Database, shortcut: '2' },
              { id: 'swarm', label: 'Ultron DAG', icon: Cpu, shortcut: '3' },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                title={`Press '${tab.shortcut}' to switch`}
                className={`relative py-2 px-2 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  isActive
                    ? 'text-[var(--color-text-primary)] font-bold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCockpitTabPill"
                    transition={springPresets.snappy}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-black/[0.06] dark:border-white/15 -z-10"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />
                <span className="truncate">{tab.label}</span>
                <span className="hidden sm:inline text-[9px] font-mono opacity-50 px-1 rounded bg-black/5 dark:bg-white/10">
                  {tab.shortcut}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: KRONE CAN-Bus Telematics */}
        <AnimatePresence mode="wait">
          {activeTab === 'telematics' && (
            <motion.div
              key="telematics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Sensor Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Crop Moisture', rate: '50 Hz', value: '14.2%', status: 'NOMINAL' },
                  { name: 'Bale Density', rate: '50 Hz', value: '184 kg/m³', status: 'OPTIMAL' },
                  { name: 'Hydraulic Press', rate: '50 Hz', value: '210 bar', status: 'STABLE' },
                  { name: 'Engine Torque', rate: '50 Hz', value: '78.4%', status: 'NOMINAL' },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                      <span>{s.name}</span>
                      <span className="text-[var(--color-accent)] font-semibold">{s.rate}</span>
                    </div>
                    <div className="text-lg font-bold text-[var(--color-text-primary)] mt-1 tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-[9px] font-mono font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ● {s.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Mode Toggle: 72h Blackout Simulation */}
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    {isBlackout ? (
                      <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {isBlackout ? 'Rural Cellular Blackout' : 'LTE Cloud Stream Active'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBlackout(!isBlackout)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isBlackout
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/20'
                    }`}
                  >
                    {isBlackout ? 'Reconnect LTE' : 'Simulate Blackout'}
                  </button>
                </div>

                {/* WAL Buffer Bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)] mb-1">
                    <span>WAL Disk Buffer (Zero-Loss)</span>
                    <span>{walBuffer}% / 4GB Ring</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        isBlackout ? 'bg-amber-500' : 'bg-gradient-to-r from-[var(--color-accent)] to-emerald-400'
                      }`}
                      animate={{ width: `${walBuffer}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: POSIX Storage Core (GAMS) */}
          {activeTab === 'storage' && (
            <motion.div
              key="storage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5"
            >
              <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--color-text-primary)]">
                  <span>gams_storage_core.c</span>
                  <span className="text-emerald-500 font-bold">Valgrind: 0 Leaks</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Atomic directory entry pointer swap prevents state corruption during sudden kernel panic or power loss.
                </p>
              </div>

              {/* 4 Steps Inode Flow */}
              <div className="space-y-2">
                {[
                  { step: 1, name: 'WAL Append Journal', call: 'write(wal_fd, &entry, size)', status: 'SYNCED' },
                  { step: 2, name: 'Temp Inode Flush', call: 'fsync(tmp_fd)', status: 'FLUSHED' },
                  { step: 3, name: 'Atomic Inode Swap', call: 'rename(".tmp_db", "live_db")', status: 'ATOMIC' },
                  { step: 4, name: 'Parent Dir Fsync', call: 'fsync(parent_dir_fd)', status: 'COMMITTED' },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setStorageStep(s.step)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${
                      storageStep === s.step
                        ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40 text-[var(--color-text-primary)]'
                        : 'bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/6 text-[var(--color-text-muted)] hover:border-black/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-black/[0.05] dark:bg-white/10 flex items-center justify-center font-bold text-[10px]">
                        {s.step}
                      </span>
                      <div>
                        <span className="font-semibold block text-[11px] text-[var(--color-text-primary)]">
                          {s.name}
                        </span>
                        <span className="text-[9px] text-[var(--color-text-muted)]">{s.call}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--color-accent)]">{s.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tab 3: Ultron Task Swarm DAG */}
          {activeTab === 'swarm' && (
            <motion.div
              key="swarm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--color-text-muted)]">Kahn Topological Scheduler</span>
                <span className="text-emerald-500 font-bold">0 Cyclic Dependencies</span>
              </div>

              <div className="space-y-2">
                {[
                  { name: '1. Objective Decompose', worker: 'Worker-Alpha', time: '18ms', status: 'COMPLETE' },
                  { name: '2. AST Security Verification', worker: 'Worker-Beta', time: '42ms', status: 'COMPLETE' },
                  { name: '3. Docker Sandbox Execution', worker: 'Worker-Isolated', time: '115ms', status: 'ACTIVE' },
                  { name: '4. Memory Reflexion Commit', worker: 'Worker-Gamma', time: '28ms', status: 'QUEUED' },
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/8 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)] text-[11px]">{task.name}</div>
                      <div className="text-[10px] font-mono text-[var(--color-text-muted)]">{task.worker}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          task.status === 'ACTIVE'
                            ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] animate-pulse'
                            : task.status === 'COMPLETE'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-black/[0.05] dark:bg-white/10 text-[var(--color-text-muted)]'
                        }`}
                      >
                        {task.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cockpit Footer Invariant */}
        <div className="mt-5 pt-3.5 border-t border-black/[0.06] dark:border-white/8 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Deterministic Invariants Proven
          </span>
          <span className="text-[var(--color-accent)] font-semibold">KRONE AG &middot; Production</span>
        </div>
      </motion.div>
    </div>
  );
}
