import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

const DAG_STAGES = [
  {
    stage: 1,
    name: 'Topological Decompose',
    tasks: ['Parse Objective', 'Vector Recall (Qdrant)', 'Cycle Check'],
    status: 'COMPLETED',
    duration: '18ms',
  },
  {
    stage: 2,
    name: 'Parallel Analysis Swarm',
    tasks: ['AST Code Auditor', 'Dependency Resolver', 'Schema Validator'],
    status: 'COMPLETED',
    duration: '45ms',
  },
  {
    stage: 3,
    name: 'Sandboxed Runner',
    tasks: ['Docker Tool Runner [512MB]', 'Bash Tool Isolation', 'Unit Probe'],
    status: 'ACTIVE',
    duration: '120ms',
  },
  {
    stage: 4,
    name: 'Reflexion & Memory',
    tasks: ['Output Arbiter', 'Episodic Summarize', 'Knowledge Graph Persist'],
    status: 'PENDING',
    duration: '32ms',
  },
];

export default function UltronDagVisualizer() {
  const [selectedStage, setSelectedStage] = useState(2);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] inline-block"></span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Ultron DAG Task Engine &amp; 3-Tier Memory
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[11px] font-mono font-semibold">
            Kahn Sort: 0 Cycles Detected
          </span>
        </div>
      </div>

      {/* DAG Stage Scrubber */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {DAG_STAGES.map((s, idx) => {
          const isSelected = selectedStage === idx;
          const isDone = selectedStage >= idx;
          return (
            <motion.button
              key={s.stage}
              type="button"
              onClick={() => setSelectedStage(idx)}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={springPresets.snappy}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] shadow-sm'
                  : 'border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 hover:border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[var(--color-text-muted)] mb-1">
                <span>STAGE 0{s.stage}</span>
                <span
                  className={`px-1.5 py-0.2 rounded ${
                    isDone
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)]'
                  }`}
                >
                  {s.duration}
                </span>
              </div>
              <div className="text-xs font-bold text-[var(--color-text-primary)] mb-2">
                {s.name}
              </div>
              <div className="flex flex-col gap-1">
                {s.tasks.map((task) => (
                  <span
                    key={task}
                    className="text-[10px] font-mono text-[var(--color-text-secondary)] truncate flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]"></span>
                    {task}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 3-Tier Memory Hierarchy Inspector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-muted)] mb-1">
            Tier 1: Active Context
          </div>
          <div className="text-xs font-bold text-[var(--color-text-primary)]">In-Memory Prompt Buffer</div>
          <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">16k Tokens · 0ms Recall</div>
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-muted)] mb-1">
            Tier 2: Episodic Store
          </div>
          <div className="text-xs font-bold text-[var(--color-text-primary)]">Qdrant Vector DB</div>
          <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">Cosine Sim &gt; 0.85 · 42ms</div>
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-muted)] mb-1">
            Tier 3: Semantic Graph
          </div>
          <div className="text-xs font-bold text-[var(--color-text-primary)]">RDF Entity Knowledge Graph</div>
          <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">Relational Triples · Persistent</div>
        </div>
      </div>
    </div>
  );
}
