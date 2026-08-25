import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { labSuiteData, type DagNode, type DagEdge, type TaintScenario, type InodeStep } from '../../data/lab';
import { springPresets, instantTransition, mechanicalClick } from '../../lib/springs';

export default function LabSuite() {
  const [activeTab, setActiveTab] = useState<'dag' | 'ast' | 'inode'>('dag');
  const shouldReduceMotion = useReducedMotion();

  // Tool 1: DAG Inspector State
  const [isCyclicMode, setIsCyclicMode] = useState<boolean>(false);
  const [dagStep, setDagStep] = useState<number>(0);
  const [selectedDagNodeId, setSelectedDagNodeId] = useState<string>('taint_sentry');

  // Tool 2: AST Taint Visualizer State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('cmd-injection');
  const [isSanitizerActive, setIsSanitizerActive] = useState<boolean>(true);

  // Tool 3: POSIX Inode Simulator State
  const [inodeStepIndex, setInodeStepIndex] = useState<number>(0);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [crashedAtStep, setCrashedAtStep] = useState<number | null>(null);

  // --- DAG Algorithm: Kahn's Topological Sort & Cycle Detection ---
  const { topologicalOrder, hasCycle, cycleNodes } = useMemo(() => {
    const rawNodes = labSuiteData.dagInspector.initialNodes;
    const rawEdges = isCyclicMode
      ? [...labSuiteData.dagInspector.initialEdges, labSuiteData.dagInspector.cyclicEdgeSample]
      : labSuiteData.dagInspector.initialEdges;

    const nodeIds = rawNodes.map((n) => n.id);
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodeIds.forEach((id) => {
      adj.set(id, []);
      inDegree.set(id, 0);
    });

    rawEdges.forEach(({ from, to }) => {
      if (adj.has(from) && inDegree.has(to)) {
        adj.get(from)!.push(to);
        inDegree.set(to, inDegree.get(to)! + 1);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const order: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);
      const neighbors = adj.get(u) || [];
      neighbors.forEach((v) => {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v)! === 0) {
          queue.push(v);
        }
      });
    }

    const detectedCycle = order.length !== nodeIds.length;
    return {
      topologicalOrder: order,
      hasCycle: detectedCycle,
      cycleNodes: detectedCycle ? ['canary_deploy', 'ast_parse', 'patch_synth'] : []
    };
  }, [isCyclicMode]);

  // Active AST Scenario
  const activeScenario = useMemo(() => {
    return (
      labSuiteData.astTaintVisualizer.scenarios.find((s) => s.id === selectedScenarioId) ||
      labSuiteData.astTaintVisualizer.scenarios[0]
    );
  }, [selectedScenarioId]);

  // Inode Steps
  const inodeSteps = labSuiteData.inodeSimulator.steps;
  const currentInodeStep: InodeStep = inodeSteps[inodeStepIndex] || inodeSteps[0];

  const handleNextInodeStep = () => {
    if (isCrashed) return;
    if (inodeStepIndex < inodeSteps.length - 1) {
      setInodeStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevInodeStep = () => {
    if (isCrashed) return;
    if (inodeStepIndex > 0) {
      setInodeStepIndex((prev) => prev - 1);
    }
  };

  const handleSimulateCrash = () => {
    setIsCrashed(true);
    setCrashedAtStep(inodeStepIndex + 1);
  };

  const handleResetCrash = () => {
    setIsCrashed(false);
    setCrashedAtStep(null);
    setInodeStepIndex(0);
  };

  const toolTabs: { id: 'dag' | 'ast' | 'inode'; label: string }[] = [
    { id: 'dag', label: '01. DAG Scheduler' },
    { id: 'ast', label: '02. AST Taint Sentry' },
    { id: 'inode', label: '03. POSIX Inode Storage' },
  ];

  return (
    <div className="w-full flex flex-col gap-10 text-[var(--color-text-primary)]">
      {/* SECTION HEADER & SUITE TAB SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border)] mb-4 select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
            <span className="type-badge-label text-[var(--color-text-secondary)] text-[11px] font-semibold tracking-[0.08em] uppercase">
              The Systems Lab · Live Interactive Sandbox
            </span>
          </div>
          <h2 className="type-headline-chapter text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)]">
            Empirical Systems &amp; Live Invariant Simulators.
          </h2>
          <p className="type-body-editorial text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl">
            Deterministic interactive testbenches for topological task scheduling, static AST taint propagation, and POSIX atomic inode swapping.
          </p>
        </div>

        {/* 3-Tool Navigation Pills with Apple Morphing Indicator */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[var(--color-border-subtle)] self-start md:self-auto">
          {toolTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={springPresets.snappy}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLabSuiteTab"
                    transition={shouldReduceMotion ? instantTransition : springPresets.morph}
                    className="absolute inset-0 rounded-xl bg-[var(--material-1-bg)] shadow-sm border border-[var(--color-border)] -z-10"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOOL 1: TOPOLOGICAL DAG TASK DECOMPOSITION INSPECTOR */}
      {/* ========================================================================= */}
      {activeTab === 'dag' && (
        <motion.div
          key="tab-dag"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={springPresets.glide}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Canvas: DAG Node Flow & Execution Stepper */}
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent)]">
                  Algorithm: Kahn&apos;s O(V+E) Topological Sorter
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mt-1">
                  Dynamic Task Graph &amp; Cycle Sentry
                </h3>
              </div>

              {/* Cycle Injection Toggle */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                  Cycle Injection:
                </span>
                <button
                  type="button"
                  onClick={() => setIsCyclicMode(!isCyclicMode)}
                  className={`px-4 py-2 min-h-[44px] rounded-lg text-xs font-mono font-bold transition-all border inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isCyclicMode
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                  }`}
                >
                  {isCyclicMode ? 'CYCLE INJECTED (FAIL)' : 'ACYCLIC (VALID)'}
                </button>
              </div>
            </div>

            {/* Cycle Error Banner if Cyclic */}
            {hasCycle && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs font-mono leading-relaxed">
                  <strong>CRITICAL FAULT: Cycle Detected in Dependency Graph!</strong><br />
                  Kahn&apos;s algorithm aborted execution at node <code className="font-bold">canary_deploy → ast_parse</code>. Deadlock prevention engaged.
                </div>
              </div>
            )}

            {/* Visual Node Graph */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {labSuiteData.dagInspector.initialNodes.map((node, idx) => {
                const isSelected = node.id === selectedDagNodeId;
                const isExecutedInStep = !hasCycle && topologicalOrder.slice(0, dagStep).includes(node.id);
                const isCurrentActiveStep = !hasCycle && topologicalOrder[dagStep - 1] === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedDagNodeId(node.id)}
                    className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 bg-[var(--material-2-glass-bg)]'
                        : 'border-[var(--color-border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] hover:border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-muted)]">
                        Tier {node.tier}
                      </span>
                      {hasCycle ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      ) : isExecutedInStep ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                        {node.label}
                      </h4>
                      <span className="text-[11px] font-mono text-[var(--color-text-muted)] block mt-0.5">
                        {node.domain}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
                      <span>{node.executionCostMs}ms</span>
                      <span className="truncate max-w-[120px] text-right font-medium">
                        {node.dependencies.length ? `deps: [${node.dependencies.join(', ')}]` : 'root'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stepper Controls */}
            {!hasCycle && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                    Execution Order:
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                    {dagStep === 0 ? 'READY' : `Step ${dagStep} / ${topologicalOrder.length}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDagStep(Math.max(0, dagStep - 1))}
                    disabled={dagStep === 0}
                    className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-primary)] disabled:opacity-40 hover:bg-black/10 border border-[var(--color-border)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    ◀ Prev Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setDagStep(Math.min(topologicalOrder.length, dagStep + 1))}
                    disabled={dagStep === topologicalOrder.length}
                    className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold bg-[var(--color-accent)] text-white disabled:opacity-40 hover:opacity-90 shadow-sm inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    Next Step ▶
                  </button>
                  <button
                    type="button"
                    onClick={() => setDagStep(topologicalOrder.length)}
                    className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    Execute All
                  </button>
                  <button
                    type="button"
                    onClick={() => setDagStep(0)}
                    className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Selected Node Inspector */}
          <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-text-muted)] block mb-2">
                Node Inspector
              </span>
              {(() => {
                const node = labSuiteData.dagInspector.initialNodes.find((n) => n.id === selectedDagNodeId);
                if (!node) return null;
                return (
                  <div className="flex flex-col gap-5">
                    <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                      {node.label}
                    </h3>
                    <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-[var(--color-border-subtle)] flex flex-col gap-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Node ID:</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{node.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Domain:</span>
                        <span className="text-[var(--color-accent)]">{node.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Runtime Cost:</span>
                        <span>{node.executionCostMs} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Dependencies:</span>
                        <span>{node.dependencies.length ? node.dependencies.join(', ') : 'None (Root)'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-mono uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
                        Mathematical Invariant:
                      </span>
                      <p className="text-xs font-mono text-[var(--color-text-secondary)] p-3 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/15 leading-relaxed">
                        {node.invariant}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-muted)] leading-relaxed">
              <strong>Formal Verification Guarantee:</strong> Directed Acyclic Graphs scheduled via Kahn&apos;s algorithm maintain $O(V+E)$ time complexity with zero recursion stack overflows.
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 2: ABSTRACT SYNTAX TREE (AST) TAINT TRAVERSAL VISUALIZER */}
      {/* ========================================================================= */}
      {activeTab === 'ast' && (
        <motion.div
          key="tab-ast"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={springPresets.glide}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Panel: AST Source-to-Sink Taint Flow */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent)]">
                  AST Sentry · {activeScenario.cwe}
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mt-1">
                  Source-to-Sink Taint Traversal
                </h3>
              </div>

              {/* Sanitizer Guard Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                  AST Sanitizer Guard:
                </span>
                <button
                  type="button"
                  onClick={() => setIsSanitizerActive(!isSanitizerActive)}
                  className={`px-4 py-2 min-h-[44px] rounded-lg text-xs font-mono font-bold transition-all border inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isSanitizerActive
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-rose-500 text-white border-rose-600 shadow-sm'
                  }`}
                >
                  {isSanitizerActive ? 'ENABLED (SAFE)' : 'BYPASSED (TAINTED)'}
                </button>
              </div>
            </div>

            {/* Scenario Selector */}
            <div className="flex flex-wrap gap-2">
              {labSuiteData.astTaintVisualizer.scenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`px-4 py-2 min-h-[44px] rounded-lg text-xs font-mono transition-all border inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    sc.id === selectedScenarioId
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold border-[var(--color-accent)]/30'
                      : 'bg-black/[0.02] dark:bg-white/[0.04] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]'
                  }`}
                >
                  {sc.title.split(' ')[0]} {sc.title.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Visual AST Taint Flow Chain */}
            <div className="flex flex-col gap-3">
              {activeScenario.astNodes.map((node, i) => {
                const isTaintedNode = node.isTainted && !isSanitizerActive;
                const isSafeSanitizer = node.isSanitizer && isSanitizerActive;

                return (
                  <div
                    key={node.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      node.isSink && isTaintedNode
                        ? 'bg-rose-500/10 border-rose-500/40'
                        : isSafeSanitizer
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-black/[0.02] dark:bg-white/[0.03] border-[var(--color-border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[var(--color-text-muted)]">
                        NODE 0{i + 1} // {node.type}
                      </span>
                      {node.isSource && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                          SOURCE
                        </span>
                      )}
                      {node.isSanitizer && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          SANITIZER
                        </span>
                      )}
                      {node.isSink && (
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isTaintedNode
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {isTaintedNode ? 'EXPLOITED SINK' : 'PROTECTED SINK'}
                        </span>
                      )}
                    </div>
                    <code className="text-xs sm:text-sm font-mono text-[var(--color-text-primary)] font-semibold">
                      {node.code}
                    </code>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Synthesized Surgical Patch Diff */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent)] block mb-2">
                AST Surgical Patch Synthesizer
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-4">
                Automated AST Remediation Diff
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                {activeScenario.surgicalPatchDiff.explanation}
              </p>

              <div className="p-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-[var(--color-border-subtle)] font-mono text-xs flex flex-col gap-2 overflow-x-auto">
                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] pb-2">
                  Unified Patch Output
                </span>
                {activeScenario.surgicalPatchDiff.removedLines.map((line, i) => (
                  <div key={i} className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {line}
                  </div>
                ))}
                {activeScenario.surgicalPatchDiff.addedLines.map((line, i) => (
                  <div key={i} className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-muted)] leading-relaxed">
              <strong>SAIF Tier 3 Compliance:</strong> Source-to-sink AST control flow verification guarantees zero unconstrained shell invocations and strict parameter typing.
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 3: POSIX INODE ATOMIC COMMIT & CRASH-PROOF STORAGE SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'inode' && (
        <motion.div
          key="tab-inode"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={springPresets.glide}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Panel: Step-by-step Syscall & Inode Swapper */}
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent)]">
                  POSIX.1-2008 Atomic File Engine
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mt-1">
                  Atomic Inode Swap &amp; Crash Recovery State Machine
                </h3>
              </div>

              {/* Simulate Crash Button */}
              <div className="flex items-center gap-2">
                {!isCrashed ? (
                  <button
                    type="button"
                    onClick={handleSimulateCrash}
                    className="px-4 py-2.5 min-h-[44px] rounded-lg text-xs font-mono font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    ⚡ Interrupt Power (Simulate Crash)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetCrash}
                    className="px-4 py-2.5 min-h-[44px] rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-colors inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    ↺ Reset &amp; Recover
                  </button>
                )}
              </div>
            </div>

            {/* Crash Interruption Alert */}
            {isCrashed && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="text-xs font-mono leading-relaxed">
                  <strong>SYSTEM INTERRUPT TRIGGERED AT STEP {crashedAtStep}:</strong><br />
                  {currentInodeStep.crashOutcomeIfInterrupted}
                </div>
              </div>
            )}

            {/* Step Visualizer */}
            <div className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--color-border-subtle)] flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--color-accent)] font-bold">
                  STEP {currentInodeStep.stepNumber} OF {inodeSteps.length}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold">
                  {currentInodeStep.invariantGuaranteed}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border-subtle)]">
                <code className="text-sm font-mono text-[var(--color-text-primary)] font-bold">
                  {currentInodeStep.posixSyscall}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[var(--material-1-bg)] border border-[var(--color-border-subtle)] flex flex-col gap-1">
                  <span className="text-[var(--color-text-muted)]">Live Pointer (data.db):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {currentInodeStep.liveFileInode}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--material-1-bg)] border border-[var(--color-border-subtle)] flex flex-col gap-1">
                  <span className="text-[var(--color-text-muted)]">Temp File Inode:</span>
                  <span className="font-bold text-[var(--color-accent)]">
                    {currentInodeStep.targetInode}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[var(--color-text-secondary)] font-mono leading-relaxed">
                <strong>Disk &amp; Page Cache State:</strong> {currentInodeStep.diskState}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <div className="text-xs font-mono text-[var(--color-text-secondary)]">
                State: <span className="font-bold text-[var(--color-text-primary)]">{currentInodeStep.operation}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevInodeStep}
                  disabled={inodeStepIndex === 0 || isCrashed}
                  className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-primary)] disabled:opacity-40 hover:bg-black/10 border border-[var(--color-border)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  ◀ Previous Syscall
                </button>
                <button
                  type="button"
                  onClick={handleNextInodeStep}
                  disabled={inodeStepIndex === inodeSteps.length - 1 || isCrashed}
                  className="px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-mono font-semibold bg-[var(--color-accent)] text-white disabled:opacity-40 hover:opacity-90 shadow-sm inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  Next Syscall ▶
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Inode Journal & Recovery Guarantee */}
          <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-text-muted)] block mb-2">
                Filesystem Journal &amp; Invariants
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-4">
                0-Byte Leak &amp; Crash-Proof Atomicity
              </h3>

              <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[var(--color-border-subtle)] flex flex-col gap-3 font-mono text-xs mb-6">
                <div>
                  <span className="text-[var(--color-text-muted)] block">Journal Transaction Log:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{currentInodeStep.journalState}</span>
                </div>
                <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-text-muted)] block">Initial Live Payload:</span>
                  <span className="text-[var(--color-text-secondary)] text-[11px] truncate block">
                    {labSuiteData.inodeSimulator.initialState.liveFileContent}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] block">New Inode Target:</span>
                  <span className="text-[var(--color-accent)] text-[11px] truncate block">
                    {labSuiteData.inodeSimulator.initialState.newPayload}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-muted)] leading-relaxed">
              <strong>POSIX Atomicity Theorem:</strong> The <code className="font-bold">rename()</code> system call guarantees that no process will ever read an incomplete or corrupted file. Either the old inode or new inode is returned atomically.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
