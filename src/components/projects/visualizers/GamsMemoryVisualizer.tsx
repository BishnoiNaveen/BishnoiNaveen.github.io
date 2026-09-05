import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

const COMMIT_STEPS = [
  {
    step: 1,
    name: 'WAL Binary Journal',
    syscall: 'write(wal_fd, &entry, sizeof(WALEntry))',
    description: 'Append-only binary log with CRC32 checksum recorded before disk buffer mutation.',
    status: 'RECORDED',
    color: '#0071E3',
  },
  {
    step: 2,
    name: 'Temporary Inode Buffer',
    syscall: 'open(".tmp_ledger.dat", O_CREAT) -> fsync(tmp_fd)',
    description: 'Write complete contiguous ledger state struct to new filesystem inode; flush hardware cache.',
    status: 'FLUSHED',
    color: '#34C759',
  },
  {
    step: 3,
    name: 'Atomic POSIX Inode Swap',
    syscall: 'rename(".tmp_ledger.dat", "live_ledger.dat")',
    description: 'Kernel updates directory dentry pointer atomically in a single clock cycle. Zero window of partial write.',
    status: 'SWAPPED',
    color: '#5856D6',
  },
  {
    step: 4,
    name: 'Parent Directory Sync',
    syscall: 'fsync(parent_dir_fd)',
    description: 'Ensures directory entry pointer is written to non-volatile storage blocks across power loss.',
    status: 'COMMITTED',
    color: '#FF9500',
  },
];

export default function GamsMemoryVisualizer() {
  const [activeStep, setActiveStep] = useState(2); // Step 3 by default (Atomic Inode Swap)

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
          </div>
          <span className="text-xs font-mono font-medium text-[var(--color-text-secondary)] ml-2">
            gams_kernel_v1.0.4 · posix_inode_swapper.c
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></span>
            Valgrind: 0 Bytes Leaked
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Step Engine + Terminal Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step Sequence & FSM State */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-1">
            POSIX Atomic Commit Sequence
          </div>
          {COMMIT_STEPS.map((item, idx) => {
            const isActive = activeStep === idx;
            const isDone = activeStep >= idx;
            return (
              <motion.button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={springPresets.snappy}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] shadow-sm'
                    : 'border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 hover:border-[var(--color-border)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                        isDone
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {item.step}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-black/5 dark:bg-white/10 text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-[var(--color-text-muted)] truncate mb-1">
                  {item.syscall}
                </div>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={springPresets.snappy}
                    className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right: Live Terminal Emulator & Inode Transition Map */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
            Active Syscall Execution
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[#111114] text-[#E4E4E7] p-4 font-mono text-xs overflow-x-auto shadow-inner flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="text-zinc-500 mb-2">
                // System Call Trace · Thread ID: 0x7FFF8A4
              </div>
              <div className="text-emerald-400 font-semibold mb-1">
                &gt; {COMMIT_STEPS[activeStep].syscall}
              </div>
              <div className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                {COMMIT_STEPS[activeStep].description}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between text-zinc-400">
                <span>Inode Swap Pointer:</span>
                <span className="text-blue-400 font-bold">
                  {activeStep >= 2 ? '0x8F4A2C -> LIVE_DENTRY' : '0x8F4A2C -> TMP_DENTRY'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Double-Entry Balance:</span>
                <span className="text-emerald-400 font-bold">INVARIANT_VERIFIED (0 Diff)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Crash Tolerance Window:</span>
                <span className="text-purple-400 font-bold">0.0000 ms (Zero Partial State)</span>
              </div>
            </div>
          </div>

          {/* Memory Struct Visualizer */}
          <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[var(--color-text-secondary)] font-medium">Memory Allocation:</span>
              <span className="text-[var(--color-accent)] font-semibold">sizeof(LedgerRecord) = 256B</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['0x00: Head', '0x40: Rec1', '0x80: Rec2', '0xC0: CRC'].map((block, i) => (
                <div
                  key={block}
                  className={`p-2 rounded text-center text-[10px] font-mono border transition-all ${
                    activeStep >= i
                      ? 'bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-text-primary)] font-bold'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-[var(--color-text-muted)]'
                  }`}
                >
                  {block}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
