import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { workflowsData } from '../data/workflows';
import type { Workflow, WorkflowStep, StepType } from '../types/workflow';
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
  ArrowRight,
  Boxes,
  Terminal,
  FileCode2,
  Share2
} from 'lucide-react';

const STEP_TYPE_ICONS: Record<StepType, React.ComponentType<{ className?: string; size?: number }>> = {
  trigger: Radio,
  compute: Cpu,
  agent: Zap,
  validation: ShieldCheck,
  storage: Database,
  emission: Activity,
};

const STEP_TYPE_COLORS: Record<StepType, { bg: string; text: string; border: string; iconBg: string }> = {
  trigger: {
    bg: 'bg-amber-500/[0.08]',
    text: 'text-amber-700',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  compute: {
    bg: 'bg-cyan-500/[0.08]',
    text: 'text-cyan-700',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-100 text-cyan-600',
  },
  agent: {
    bg: 'bg-purple-500/[0.08]',
    text: 'text-[#AF52DE]',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-100 text-[#AF52DE]',
  },
  validation: {
    bg: 'bg-emerald-500/[0.08]',
    text: 'text-emerald-700',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  storage: {
    bg: 'bg-blue-500/[0.08]',
    text: 'text-[#0071E3]',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-100 text-[#0071E3]',
  },
  emission: {
    bg: 'bg-rose-500/[0.08]',
    text: 'text-rose-700',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-100 text-rose-600',
  },
};

export const Workflows: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflowsData[0]?.id || '');
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [activeScrubberIndex, setActiveScrubberIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active workflow object
  const currentWorkflow = useMemo<Workflow>(() => {
    return workflowsData.find((w) => w.id === selectedWorkflowId) || workflowsData[0];
  }, [selectedWorkflowId]);

  // Scrubber timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveScrubberIndex((prev) => {
          return (prev + 1) % currentWorkflow.steps.length;
        });
      }, 2400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentWorkflow.steps.length]);

  // Reset scrubber & selection when workflow changes
  useEffect(() => {
    setActiveScrubberIndex(0);
    setSelectedStep(null);
  }, [selectedWorkflowId]);

  // Keyboard shortcut listener (Escape to close drawer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStep(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopySnippet = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, []);

  const handleNextStep = () => {
    if (!selectedStep) return;
    const currentIndex = currentWorkflow.steps.findIndex((s) => s.id === selectedStep.id);
    if (currentIndex < currentWorkflow.steps.length - 1) {
      setSelectedStep(currentWorkflow.steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (!selectedStep) return;
    const currentIndex = currentWorkflow.steps.findIndex((s) => s.id === selectedStep.id);
    if (currentIndex > 0) {
      setSelectedStep(currentWorkflow.steps[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 py-8 px-4 sm:px-6">
      
      {/* Section Header & Flow Selector Tabs */}
      <div className="flex flex-col gap-6 text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0071E3] text-xs font-semibold tracking-wider uppercase w-fit shadow-sm">
              <Boxes className="w-3.5 h-3.5" />
              <span>Multi-Agent Topologies & Enterprise Systems</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.1]">
              Architectural Workflows & <span className="apple-gradient-text">Execution DAGs</span>
            </h2>
            <p className="text-base sm:text-lg text-[#424245] leading-relaxed">
              Step-by-step pipeline visualization across 5 enterprise domains with typed I/O contracts, failure recovery invariants, and verifiable code execution.
            </p>
          </div>

          {/* Scrubber Play/Pause Simulation Controls */}
          <div className="flex items-center gap-2.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] self-start lg:self-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] rounded-full transition-all shadow-[0_2px_10px_rgba(0,113,227,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
              aria-label={isPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause Pulse' : 'Simulate Pulse'}</span>
            </button>
            <span className="text-xs font-mono text-[#86868B] px-3 font-semibold hidden sm:inline">
              Step {activeScrubberIndex + 1} of {currentWorkflow.steps.length}
            </span>
          </div>
        </div>

        {/* Apple Segmented Bar: 5 Workflow Topologies Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none">
          {workflowsData.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;
            return (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                  isSelected ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <span>{wf.title.split(' ')[0]}</span>
                  <span className="text-[11px] font-normal opacity-60">({wf.category.split(' ')[0]})</span>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="active-workflow-pill"
                    className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
                    transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Workflow Overview Card (VisionOS Glass Card) */}
      <motion.div
        key={currentWorkflow.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.buoyant}
        className="rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-6 text-left"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-black/[0.06] pb-6">
          <div className="flex flex-col gap-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0071E3] font-semibold">
              <span>{currentWorkflow.architectureType}</span>
              <span>•</span>
              <span className="text-[#86868B]">{currentWorkflow.category}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
              {currentWorkflow.title}
            </h3>
            <p className="text-sm sm:text-base text-[#424245] leading-relaxed mt-1">
              {currentWorkflow.summary}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-50/80 px-5 py-3.5 rounded-2xl border border-black/[0.05] shadow-sm">
            <div>
              <div className="text-[10px] text-[#86868B] uppercase font-mono font-semibold">Throughput</div>
              <div className="text-sm font-bold text-[#1D1D1F] font-mono mt-0.5">{currentWorkflow.throughput.split(' ')[0]}</div>
            </div>
            <div className="border-l border-black/[0.08] pl-4">
              <div className="text-[10px] text-[#86868B] uppercase font-mono font-semibold">Latency SLA</div>
              <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{currentWorkflow.latencySLA.split(',')[0]}</div>
            </div>
            <div className="border-l border-black/[0.08] pl-4">
              <div className="text-[10px] text-[#86868B] uppercase font-mono font-semibold">Reliability</div>
              <div className="text-xs sm:text-sm font-bold text-[#AF52DE] font-mono mt-0.5">{currentWorkflow.reliabilityTarget.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#86868B] mr-1 font-semibold">Stack:</span>
          {currentWorkflow.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-3 py-1 rounded-xl bg-black/[0.03] border border-black/[0.06] text-[#424245] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* DAG Interactive Pipeline Visualizer */}
      <div className="relative rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-6 text-left">
        
        {/* Scrubber Progress Slider */}
        <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-black/[0.05]">
          <Sliders className="w-4 h-4 text-[#0071E3] shrink-0" />
          <span className="text-xs text-[#86868B] font-mono font-semibold shrink-0">Stage Scrubber:</span>
          <input
            type="range"
            min={0}
            max={currentWorkflow.steps.length - 1}
            value={activeScrubberIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setActiveScrubberIndex(parseInt(e.target.value, 10));
            }}
            className="w-full h-2 bg-black/[0.08] rounded-lg appearance-none cursor-pointer accent-[#0071E3]"
            aria-label="Workflow step scrubber slider"
          />
          <span className="text-xs font-mono font-bold text-[#0071E3] shrink-0">
            {currentWorkflow.steps[activeScrubberIndex]?.name.slice(0, 26)}...
          </span>
        </div>

        {/* Pipeline Nodes Grid with Animated Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
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
                className={`relative rounded-[24px] p-5 cursor-pointer border transition-all duration-300 flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#0071E3] shadow-[0_8px_30px_rgba(0,113,227,0.18)] ring-2 ring-[#0071E3]'
                    : isScrubberActive
                    ? 'bg-white border-[#0071E3]/60 shadow-[0_8px_24px_rgba(0,113,227,0.12)] ring-1 ring-[#0071E3]/40'
                    : 'bg-white/80 hover:bg-white border-black/[0.06] hover:border-black/[0.12] shadow-sm'
                }`}
              >
                {/* Active Node Pulsing Beacon */}
                {isScrubberActive && (
                  <motion.div
                    layoutId="workflow-pulse-beacon"
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#0071E3] shadow-[0_0_12px_#0071E3]"
                    transition={springPresets.glide}
                  />
                )}

                {/* Node Top Row: Icon + Step Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colors.iconBg} shadow-sm`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#86868B] font-semibold">
                        Step {step.stepNumber} • {step.type}
                      </div>
                      <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug">
                        {step.name}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#424245] line-clamp-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Node Telemetry Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] text-[11px] font-mono text-[#86868B]">
                  <span className="text-[#86868B]">P99: {step.telemetry.p99DurationMs}ms</span>
                  <span className="text-emerald-700 font-semibold">{step.telemetry.successRatePercent}% SLA</span>
                  <span className="text-[#0071E3] font-semibold flex items-center gap-0.5 hover:underline">
                    Inspect <ChevronRight size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Step Flow Bar Indicator */}
        <div className="flex items-center justify-between text-xs text-[#86868B] font-mono pt-3 border-t border-black/[0.06]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            Click any step to open Apple visionOS Slide-over Inspector
          </span>
          <span className="font-semibold">{currentWorkflow.steps.length} Pipeline Steps Total</span>
        </div>
      </div>

      {/* Slide-over Step Detail Drawer (VisionOS Light Mode Glass Sheet) */}
      <AnimatePresence>
        {selectedStep && (
          <>
            {/* Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
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
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-white/95 backdrop-blur-3xl border-l border-white shadow-[0_32px_72px_-16px_rgba(0,0,0,0.20)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left"
            >
              {/* Drawer Top Navigation & Controls */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0071E3] font-bold">
                      Step {selectedStep.stepNumber} of {currentWorkflow.steps.length}
                    </span>
                    <span className="text-xs font-mono text-[#86868B] uppercase font-semibold">
                      {selectedStep.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevStep}
                      disabled={selectedStep.stepNumber === 1}
                      className="p-2 text-[#424245] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-30 rounded-xl transition-colors"
                      aria-label="Previous step"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={selectedStep.stepNumber === currentWorkflow.steps.length}
                      className="p-2 text-[#424245] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-30 rounded-xl transition-colors"
                      aria-label="Next step"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedStep(null)}
                      className="p-2 text-[#424245] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] rounded-xl ml-1 transition-colors"
                      aria-label="Close step drawer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Step Title & Role */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                    {selectedStep.name}
                  </h3>
                  <div className="text-xs font-mono text-[#0071E3] font-semibold mt-1">
                    Role: {selectedStep.role}
                  </div>
                  <p className="text-sm text-[#424245] mt-2.5 leading-relaxed">
                    {selectedStep.description}
                  </p>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-black/[0.05]">
                  <div>
                    <div className="text-[10px] text-[#86868B] font-mono uppercase font-semibold">P50 Latency</div>
                    <div className="text-sm font-bold text-[#1D1D1F] font-mono mt-0.5">{selectedStep.telemetry.p50DurationMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#86868B] font-mono uppercase font-semibold">P99 Latency</div>
                    <div className="text-sm font-bold text-[#0071E3] font-mono mt-0.5">{selectedStep.telemetry.p99DurationMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#86868B] font-mono uppercase font-semibold">RAM Footprint</div>
                    <div className="text-sm font-bold text-[#AF52DE] font-mono mt-0.5">{selectedStep.telemetry.avgMemoryMb} MB</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#86868B] font-mono uppercase font-semibold">Success SLA</div>
                    <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">{selectedStep.telemetry.successRatePercent}%</div>
                  </div>
                </div>

                {/* Failure Resilience & Recovery Policy */}
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2 font-mono uppercase">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Failure Resilience & Recovery Policy</span>
                  </div>
                  <div className="text-xs text-[#1D1D1F] font-mono space-y-1">
                    <div>Strategy: <span className="text-[#0071E3] font-bold">{selectedStep.failurePolicy.strategy}</span></div>
                    {selectedStep.failurePolicy.maxRetries !== undefined && (
                      <div>Max Retries: <span className="text-emerald-700 font-bold">{selectedStep.failurePolicy.maxRetries} (backoff: {selectedStep.failurePolicy.backoffFactor}x)</span></div>
                    )}
                    {selectedStep.failurePolicy.alertChannel && (
                      <div>Alert Channel: <span className="text-purple-700 font-bold">{selectedStep.failurePolicy.alertChannel}</span></div>
                    )}
                  </div>
                </div>

                {/* I/O Contracts */}
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider font-mono">
                    I/O Contracts
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedStep.inputs.map((inp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-black/[0.05] text-xs">
                        <div className="flex items-center justify-between font-mono text-[#0071E3] font-semibold">
                          <span>IN: {inp.name}</span>
                          <span className="text-[#86868B] text-[11px]">{inp.type}</span>
                        </div>
                        <div className="text-[#424245] text-[11px] mt-1">{inp.description}</div>
                        {inp.example && (
                          <div className="mt-1.5 font-mono text-[10px] text-emerald-800 bg-white p-2 rounded-lg border border-black/[0.04] overflow-x-auto shadow-sm">
                            {inp.example}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedStep.outputs.map((out, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-black/[0.05] text-xs">
                        <div className="flex items-center justify-between font-mono text-cyan-700 font-semibold">
                          <span>OUT: {out.name}</span>
                          <span className="text-[#86868B] text-[11px]">{out.type}</span>
                        </div>
                        <div className="text-[#424245] text-[11px] mt-1">{out.description}</div>
                        {out.example && (
                          <div className="mt-1.5 font-mono text-[10px] text-cyan-800 bg-white p-2 rounded-lg border border-black/[0.04] overflow-x-auto shadow-sm">
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
                      <div className="flex items-center gap-2 text-xs font-mono text-[#1D1D1F] font-semibold">
                        <Code2 size={15} className="text-[#0071E3]" />
                        <span>{selectedStep.codeSnippet.filename}</span>
                        <span className="text-[#86868B]">({selectedStep.codeSnippet.language})</span>
                      </div>
                      <button
                        onClick={() => handleCopySnippet(selectedStep.codeSnippet!.code)}
                        className="flex items-center gap-1 text-xs text-[#424245] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] px-2.5 py-1 rounded-lg border border-black/[0.06] transition-colors"
                      >
                        {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/[0.03] border border-black/[0.06] overflow-x-auto text-xs font-mono text-[#1D1D1F] leading-relaxed max-h-64 shadow-inner">
                      <pre>
                        <code>{selectedStep.codeSnippet.code}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between mt-4">
                <span className="text-xs font-mono text-[#86868B]">WWDC Fluid Spring Physics</span>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="apple-btn-primary text-xs"
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

export default Workflows;
