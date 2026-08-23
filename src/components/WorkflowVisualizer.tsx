import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { workflowsData } from '../data/workflows';
import type { Workflow, WorkflowStep, StepType, FailureStrategy } from '../types/workflow';
import { 
  Zap, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Database, 
  Radio, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Copy, 
  Check, 
  Activity, 
  Clock, 
  Gauge, 
  AlertTriangle,
  Code2,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const STEP_TYPE_ICONS: Record<StepType, React.ComponentType<{ className?: string; size?: number }>> = {
  trigger: Radio,
  compute: Cpu,
  agent: Zap,
  validation: ShieldCheck,
  storage: Database,
  emission: Activity,
};

const STEP_TYPE_COLORS: Record<StepType, { bg: string; text: string; border: string; glow: string }> = {
  trigger: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  compute: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  agent: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  validation: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  storage: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  emission: {
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-300',
    border: 'border-fuchsia-500/30',
    glow: 'rgba(217, 70, 239, 0.3)',
  },
};

export const WorkflowVisualizer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflowsData[0]?.id || '');
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [activeScrubberIndex, setActiveScrubberIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active workflow object
  const currentWorkflow = useMemo<Workflow>(() => {
    return workflowsData.find(w => w.id === selectedWorkflowId) || workflowsData[0];
  }, [selectedWorkflowId]);

  // Scrubber timer simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveScrubberIndex((prev) => {
          const next = (prev + 1) % currentWorkflow.steps.length;
          return next;
        });
      }, 2200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentWorkflow.steps.length]);

  // Clamp scrubber index when workflow changes
  React.useEffect(() => {
    setActiveScrubberIndex(0);
    setSelectedStep(null);
  }, [selectedWorkflowId]);

  const handleCopySnippet = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, []);

  const handleNextStep = () => {
    if (!selectedStep) return;
    const currentIndex = currentWorkflow.steps.findIndex(s => s.id === selectedStep.id);
    if (currentIndex < currentWorkflow.steps.length - 1) {
      setSelectedStep(currentWorkflow.steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (!selectedStep) return;
    const currentIndex = currentWorkflow.steps.findIndex(s => s.id === selectedStep.id);
    if (currentIndex > 0) {
      setSelectedStep(currentWorkflow.steps[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6">
      {/* Workflow Category & Selector Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span className="text-violet-400 font-mono text-xl">&lt;DAG/&gt;</span>
              <span>Enterprise Systems & Multi-Agent Workflows</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Direct pipeline visualization across 5 mission-critical topologies with live telemetry, failure invariants, and execution code.
            </p>
          </div>

          {/* Scrubber Play/Pause Controls */}
          <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label={isPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'Pause Flow' : 'Simulate Pulse'}</span>
            </button>
            <span className="text-xs text-gray-400 px-2 font-mono hidden sm:inline">
              Step {activeScrubberIndex + 1}/{currentWorkflow.steps.length}
            </span>
          </div>
        </div>

        {/* Workflow Tab Selector with Glide Spring */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {workflowsData.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;
            return (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <span>{wf.title.split(' ')[0]}</span>
                  <span className="text-[11px] font-normal opacity-60">({wf.category.split(' ')[0]})</span>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="active-workflow-pill"
                    className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/50 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Workflow Overview Banner */}
      <motion.div
        key={currentWorkflow.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.buoyant}
        className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col gap-5 text-left"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
              <span>{currentWorkflow.architectureType}</span>
              <span>•</span>
              <span className="text-gray-400">{currentWorkflow.category}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentWorkflow.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl">
              {currentWorkflow.summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 shrink-0 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Throughput</div>
              <div className="text-xs font-bold text-white font-mono">{currentWorkflow.throughput.split(' ')[0]}</div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <div className="text-[10px] text-gray-400 uppercase font-mono">Latency SLA</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">{currentWorkflow.latencySLA.split(',')[0]}</div>
            </div>
            <div className="border-l border-white/10 pl-4">
              <div className="text-[10px] text-gray-400 uppercase font-mono">Reliability</div>
              <div className="text-xs font-bold text-violet-400 font-mono">{currentWorkflow.reliabilityTarget.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-gray-400 mr-1">Stack:</span>
          {currentWorkflow.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* DAG Interactive Pipeline Visualizer */}
      <div className="relative rounded-2xl bg-slate-950/90 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col gap-6">
        {/* Scrubber Progress Slider */}
        <div className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
          <Sliders className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="text-xs text-gray-400 font-mono shrink-0">Stage Scrubber:</span>
          <input
            type="range"
            min={0}
            max={currentWorkflow.steps.length - 1}
            value={activeScrubberIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setActiveScrubberIndex(parseInt(e.target.value, 10));
            }}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
            aria-label="Workflow step scrubber slider"
          />
          <span className="text-xs font-mono font-bold text-violet-300 shrink-0">
            {currentWorkflow.steps[activeScrubberIndex]?.name.slice(0, 24)}...
          </span>
        </div>

        {/* DAG Nodes Grid / Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 text-left">
          {currentWorkflow.steps.map((step, index) => {
            const isScrubberActive = index === activeScrubberIndex;
            const isSelected = selectedStep?.id === step.id;
            const Icon = STEP_TYPE_ICONS[step.type] || Activity;
            const colors = STEP_TYPE_COLORS[step.type] || STEP_TYPE_COLORS.compute;

            return (
              <motion.div
                key={step.id}
                layout
                onClick={() => setSelectedStep(step)}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                transition={springPresets.snappy}
                className={`relative rounded-xl p-5 cursor-pointer border transition-all duration-200 flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-400/80 shadow-[0_0_25px_rgba(139,92,246,0.35)] ring-1 ring-violet-400'
                    : isScrubberActive
                    ? 'bg-slate-900/90 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Node Active Glow Pulsing Beacon */}
                {isScrubberActive && (
                  <motion.div
                    layoutId="node-pulse-beacon"
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]"
                    transition={springPresets.glide}
                  />
                )}

                {/* Node Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} border ${colors.border}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                        Step {step.stepNumber} • {step.type}
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-violet-300">
                        {step.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Role & Description */}
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Node Telemetry Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-gray-400">
                  <span className="text-gray-500">P99: {step.telemetry.p99DurationMs}ms</span>
                  <span className="text-emerald-400 font-semibold">{step.telemetry.successRatePercent}% SLA</span>
                  <span className="text-violet-400 flex items-center gap-0.5">
                    Inspect <ChevronRight size={12} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Tip Banner */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-mono pt-2 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Click any step node to open Apple-style Slide-over Inspector
          </span>
          <span>{currentWorkflow.steps.length} Steps Total</span>
        </div>
      </div>

      {/* Slide-over Step Detail Drawer */}
      <AnimatePresence>
        {selectedStep && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Step Inspection: ${selectedStep.name}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.sheet}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-slate-900/95 border-l border-white/15 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left"
            >
              {/* Drawer Top Navigation & Close */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold">
                      Step {selectedStep.stepNumber} of {currentWorkflow.steps.length}
                    </span>
                    <span className="text-xs font-mono text-gray-400 uppercase">
                      {selectedStep.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={selectedStep.stepNumber === 1}
                      className="p-1.5 text-gray-400 hover:text-white bg-white/5 disabled:opacity-30 rounded-lg"
                      aria-label="Previous step"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={selectedStep.stepNumber === currentWorkflow.steps.length}
                      className="p-1.5 text-gray-400 hover:text-white bg-white/5 disabled:opacity-30 rounded-lg"
                      aria-label="Next step"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedStep(null)}
                      className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg ml-2"
                      aria-label="Close step drawer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Step Title & Description */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedStep.name}
                  </h3>
                  <div className="text-xs font-mono text-violet-300 mt-1">
                    Role: {selectedStep.role}
                  </div>
                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                    {selectedStep.description}
                  </p>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono">P50 Latency</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedStep.telemetry.p50DurationMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono">P99 Latency</div>
                    <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{selectedStep.telemetry.p99DurationMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono">Avg Memory</div>
                    <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">{selectedStep.telemetry.avgMemoryMb} MB</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono">Success Rate</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{selectedStep.telemetry.successRatePercent}%</div>
                  </div>
                </div>

                {/* Failure Policy Invariants */}
                <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Failure Resilience & Recovery Policy</span>
                  </div>
                  <div className="text-xs text-gray-300 font-mono space-y-1">
                    <div>Strategy: <span className="text-violet-300">{selectedStep.failurePolicy.strategy}</span></div>
                    {selectedStep.failurePolicy.maxRetries !== undefined && (
                      <div>Max Retries: <span className="text-cyan-300">{selectedStep.failurePolicy.maxRetries} (backoff: {selectedStep.failurePolicy.backoffFactor}x)</span></div>
                    )}
                    {selectedStep.failurePolicy.alertChannel && (
                      <div>Alert Channel: <span className="text-amber-300">{selectedStep.failurePolicy.alertChannel}</span></div>
                    )}
                  </div>
                </div>

                {/* Inputs & Outputs Data Contracts */}
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                    I/O Contracts
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedStep.inputs.map((inp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                        <div className="flex items-center justify-between font-mono text-violet-300 font-medium">
                          <span>IN: {inp.name}</span>
                          <span className="text-gray-400 text-[11px]">{inp.type}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-1">{inp.description}</div>
                        {inp.example && (
                          <div className="mt-1 font-mono text-[10px] text-emerald-300/80 bg-black/50 p-1.5 rounded overflow-x-auto">
                            {inp.example}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedStep.outputs.map((out, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                        <div className="flex items-center justify-between font-mono text-cyan-300 font-medium">
                          <span>OUT: {out.name}</span>
                          <span className="text-gray-400 text-[11px]">{out.type}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-1">{out.description}</div>
                        {out.example && (
                          <div className="mt-1 font-mono text-[10px] text-emerald-300/80 bg-black/50 p-1.5 rounded overflow-x-auto">
                            {out.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Snippet Inspector */}
                {selectedStep.codeSnippet && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                        <Code2 size={14} className="text-violet-400" />
                        <span>{selectedStep.codeSnippet.filename}</span>
                        <span className="text-gray-500">({selectedStep.codeSnippet.language})</span>
                      </div>
                      <button
                        onClick={() => handleCopySnippet(selectedStep.codeSnippet!.code)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 transition-colors"
                      >
                        {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono text-gray-200 leading-relaxed max-h-60">
                      <pre>
                        <code>{selectedStep.codeSnippet.code}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">WWDC 2018 Sheet Physics</span>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
                >
                  Done Inspecting
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowVisualizer;
