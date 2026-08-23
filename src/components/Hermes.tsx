import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  hermesTelemetryRecords, 
  hermesTaskGraph, 
  hermesMemorySystem, 
  hermesRouterLogs, 
  hermesQuorumSessions 
} from '../data/hermes';
import type { 
  AgentTelemetryRecord, 
  AgentStatus, 
  RouterDecision, 
  QuorumSession, 
  QuorumVote,
  VectorRecallResult,
  WorkingMemoryEntry,
  KnowledgeEntity,
  KnowledgeRelation
} from '../types/hermes';
import { JsonGraphInspector } from './JsonGraphInspector';
import { 
  Activity, 
  Cpu, 
  Database, 
  Radio, 
  Play, 
  Pause, 
  ShieldCheck, 
  Layers, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  GitBranch,
  Network,
  Share2,
  Terminal,
  Bot,
  RefreshCw,
  Sliders,
  Check,
  X,
  Boxes,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

const STATUS_CONFIG: Record<AgentStatus, { label: string; bg: string; text: string; dot: string }> = {
  IDLE: {
    label: 'Idle',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
  },
  PLANNING: {
    label: 'Planning DAG',
    bg: 'bg-blue-50',
    text: 'text-[#0071E3]',
    dot: 'bg-[#0071E3]',
  },
  EXECUTING_TOOL: {
    label: 'Executing Tool',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  AWAITING_CONSENSUS: {
    label: 'Quorum Vote',
    bg: 'bg-purple-50',
    text: 'text-[#AF52DE]',
    dot: 'bg-[#AF52DE]',
  },
  REFLECTING: {
    label: 'Reflecting',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  TERMINATED: {
    label: 'Terminated',
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
  ERROR: {
    label: 'Error',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
  },
};

type InspectorTab = 'memory' | 'router' | 'quorum' | 'json';
type MemorySubTab = 'working' | 'episodic' | 'knowledge';

export const Hermes: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<InspectorTab>('memory');
  const [activeMemorySubTab, setActiveMemorySubTab] = useState<MemorySubTab>('episodic');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(hermesTelemetryRecords[0]?.agentId || '');
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<AgentTelemetryRecord | null>(null);
  const [memorySearchQuery, setMemorySearchQuery] = useState<string>('');
  const [tick, setTick] = useState<number>(0);

  // Quorum Simulator State
  const [simulatedSessions, setSimulatedSessions] = useState<QuorumSession[]>(hermesQuorumSessions);
  const [isSimulatingVote, setIsSimulatingVote] = useState<boolean>(false);
  const [simulatedVoteProgress, setSimulatedVoteProgress] = useState<number>(0);

  // Live simulation tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveStream) {
      interval = setInterval(() => {
        setTick((prev) => prev + 1);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveStream]);

  // Aggregate metrics with live fluctuations
  const aggregateMetrics = useMemo(() => {
    const totalTokens = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalTokens, 0) + tick * 145;
    const totalCost = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalCostUsd, 0) + tick * 0.0018;
    const avgLatency = Math.round(
      hermesTelemetryRecords.reduce((acc, a) => acc + a.latency.ttftMs, 0) / hermesTelemetryRecords.length
    );
    const activeAgentsCount = hermesTelemetryRecords.filter((a) => a.status !== 'IDLE' && a.status !== 'TERMINATED').length;

    return {
      totalTokens: totalTokens.toLocaleString(),
      totalCost: totalCost.toFixed(3),
      avgLatency: `${avgLatency} ms`,
      activeAgentsCount: `${activeAgentsCount} / ${hermesTelemetryRecords.length}`,
    };
  }, [tick]);

  const selectedAgent = useMemo(() => {
    return hermesTelemetryRecords.find((a) => a.agentId === selectedAgentId) || hermesTelemetryRecords[0];
  }, [selectedAgentId]);

  // Memory Search Filter
  const filteredWorkingMemory = useMemo(() => {
    if (!memorySearchQuery) return hermesMemorySystem.workingMemory.entries;
    const q = memorySearchQuery.toLowerCase();
    return hermesMemorySystem.workingMemory.entries.filter(
      (e) => e.key.toLowerCase().includes(q) || e.value.toLowerCase().includes(q)
    );
  }, [memorySearchQuery]);

  const filteredVectorRetrievals = useMemo(() => {
    if (!memorySearchQuery) return hermesMemorySystem.episodicMemory.recentRetrievals;
    const q = memorySearchQuery.toLowerCase();
    return hermesMemorySystem.episodicMemory.recentRetrievals.filter(
      (r) =>
        r.collection.toLowerCase().includes(q) ||
        r.documentSnippet.toLowerCase().includes(q) ||
        r.embeddingModel.toLowerCase().includes(q)
    );
  }, [memorySearchQuery]);

  const filteredKnowledgeTriples = useMemo(() => {
    if (!memorySearchQuery) return hermesMemorySystem.semanticKnowledgeGraph.relations;
    const q = memorySearchQuery.toLowerCase();
    return hermesMemorySystem.semanticKnowledgeGraph.relations.filter(
      (rel) =>
        rel.from.toLowerCase().includes(q) ||
        rel.to.toLowerCase().includes(q) ||
        rel.relation.toLowerCase().includes(q)
    );
  }, [memorySearchQuery]);

  // Quorum Simulator Action
  const triggerQuorumSimulation = () => {
    if (isSimulatingVote) return;
    setIsSimulatingVote(true);
    setSimulatedVoteProgress(1);

    setTimeout(() => setSimulatedVoteProgress(2), 600);
    setTimeout(() => setSimulatedVoteProgress(3), 1200);
    setTimeout(() => {
      setSimulatedVoteProgress(4);
      const newSession: QuorumSession = {
        sessionId: `quorum-session-live-${Date.now().toString().slice(-5)}`,
        protocol: 'Byzantine_Fault_Tolerant_Voting',
        targetDecision: 'Automated Microservice Canary Rollout & Cryptographic Sign-Off',
        consensusReached: true,
        finalDecision: 'APPROVED_BY_BFT_CONSENSUS',
        coordinationOverheadMs: 1120 + Math.floor(Math.random() * 200),
        votes: [
          {
            agentId: 'hermes-orchestrator-01',
            agentName: 'Hermes Master Orchestrator',
            vote: 'APPROVE',
            confidence: 0.98,
            critique: 'Topological DAG constraints verified with zero cyclic dependencies.'
          },
          {
            agentId: 'sentinel-security-02',
            agentName: 'Sentinel AST Security Sentry',
            vote: 'APPROVE',
            confidence: 0.99,
            critique: 'Zero taint propagation across HTTP boundary sinks. SAIF Tier 3 validated.'
          },
          {
            agentId: 'synthesis-qa-03',
            agentName: 'Synthesis QA & Mutation Agent',
            vote: 'APPROVE',
            confidence: 0.96,
            critique: 'All 14 mutation tests passing; boundary edge invariants verified.'
          },
          {
            agentId: 'krone-edge-telemetry-04',
            agentName: 'KRONE Edge Telematics Sentry',
            vote: 'APPROVE',
            confidence: 0.94,
            critique: 'CAN-Bus ingestion buffer latency <25ms confirmed over SocketCAN.'
          }
        ]
      };
      setSimulatedSessions((prev) => [newSession, ...prev]);
      setIsSimulatingVote(false);
      setSimulatedVoteProgress(0);
    }, 1800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 py-8 px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#AF52DE] text-xs font-semibold tracking-wider uppercase w-fit shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent Runtime</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.1]">
            Hermes Agentic Swarm & <span className="apple-gradient-text">Memory Telemetry</span>
          </h2>
          <p className="text-base sm:text-lg text-[#424245] leading-relaxed">
            Real-time telemetry stream across 6 specialized autonomous agents, 3-tier memory recall (Working Buffer, Qdrant Vector, Knowledge Graph), and Byzantine fault tolerant quorum consensus.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3 self-start lg:self-end">
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
              isLiveStream
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-[0_2px_12px_rgba(52,199,89,0.25)]'
                : 'bg-white/80 border-black/[0.08] text-[#424245] hover:bg-white'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveStream ? 'bg-emerald-400 opacity-75' : 'bg-gray-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveStream ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </span>
            <span>{isLiveStream ? 'Live Swarm Active' : 'Swarm Paused'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards (4 Apple Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-5 rounded-[24px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between text-[#86868B] text-xs font-mono font-semibold">
            <span>Tokens Processed</span>
            <Zap className="w-4 h-4 text-[#AF52DE]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] font-mono mt-2 tracking-tight">
            {aggregateMetrics.totalTokens}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-mono font-semibold">
            <TrendingUp size={12} />
            <span>~88 tokens/sec velocity</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-5 rounded-[24px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between text-[#86868B] text-xs font-mono font-semibold">
            <span>Total Swarm Cost</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono mt-2 tracking-tight">
            ${aggregateMetrics.totalCost}
          </div>
          <div className="text-[11px] text-[#86868B] flex items-center gap-1 mt-1 font-mono font-medium">
            <span>Cached tokens: ~55% savings</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-5 rounded-[24px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between text-[#86868B] text-xs font-mono font-semibold">
            <span>Avg TTFT Latency</span>
            <Clock className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0071E3] font-mono mt-2 tracking-tight">
            {aggregateMetrics.avgLatency}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-mono font-medium">
            <span>SLA target: &lt;300ms</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-5 rounded-[24px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between text-[#86868B] text-xs font-mono font-semibold">
            <span>Swarm Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] font-mono mt-2 tracking-tight">
            {aggregateMetrics.activeAgentsCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-mono font-semibold">
            <span>Byzantine Quorum: 100% OK</span>
          </div>
        </motion.div>
      </div>

      {/* 6 Specialized Autonomous Agents Grid */}
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#86868B] uppercase tracking-wider font-bold">
            <Bot className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>6 Specialized Autonomous Agents</span>
          </div>
          <span className="text-xs font-mono text-[#86868B]">Click any agent to inspect live state</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hermesTelemetryRecords.map((agent) => {
            const isSelected = selectedAgentId === agent.agentId;
            const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.IDLE;

            return (
              <motion.div
                key={agent.agentId}
                layout
                onClick={() => {
                  setSelectedAgentId(agent.agentId);
                  setSelectedAgentDetail(agent);
                }}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                transition={springPresets.snappy}
                className={`p-5 rounded-[28px] border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#0071E3] shadow-[0_8px_24px_rgba(0,113,227,0.15)] ring-2 ring-[#0071E3]'
                    : 'bg-white/70 hover:bg-white backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono text-[#86868B] uppercase font-semibold">
                      {agent.agentId.split('-')[0].toUpperCase()} • {agent.role.split(' ')[0]}
                    </div>
                    <h4 className="text-base font-bold text-[#1D1D1F] mt-0.5 leading-snug">
                      {agent.agentName}
                    </h4>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 border border-black/[0.05] ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                    <span>{status.label}</span>
                  </div>
                </div>

                {/* Current Task */}
                <p className="text-xs text-[#424245] line-clamp-2 leading-relaxed">
                  {agent.currentTask}
                </p>

                {/* Agent Mini Telemetry Footer */}
                <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] font-mono text-[#86868B]">
                  <span className="text-[#1D1D1F] font-semibold">{agent.activeModel.split('-')[0]}</span>
                  <span className="text-[#0071E3] font-semibold">{agent.latency.totalLatencyMs}ms</span>
                  <span className="text-emerald-700 font-semibold">${agent.tokenMetrics.totalCostUsd.toFixed(3)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Tab Navigation Toolbar (Apple Segmented Bar) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none self-start">
        <button
          onClick={() => setActiveTab('memory')}
          className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
            activeTab === 'memory' ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <Database size={15} className={activeTab === 'memory' ? 'text-[#0071E3]' : 'text-[#86868B]'} />
            <span>3-Tier Memory System</span>
          </div>
          {activeTab === 'memory' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('router')}
          className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
            activeTab === 'router' ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <GitBranch size={15} className={activeTab === 'router' ? 'text-[#0071E3]' : 'text-[#86868B]'} />
            <span>Dynamic LLM Router Matrix</span>
          </div>
          {activeTab === 'router' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('quorum')}
          className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
            activeTab === 'quorum' ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <ShieldCheck size={15} className={activeTab === 'quorum' ? 'text-[#0071E3]' : 'text-[#86868B]'} />
            <span>Quorum Consensus Simulator</span>
          </div>
          {activeTab === 'quorum' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
            activeTab === 'json' ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <Terminal size={15} className={activeTab === 'json' ? 'text-[#0071E3]' : 'text-[#86868B]'} />
            <span>JSON State Tree</span>
          </div>
          {activeTab === 'json' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: 3-Tier Memory System */}
        {activeTab === 'memory' && (
          <motion.div
            key="tab-memory"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-6"
          >
            {/* Memory Search Filter Bar & Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Sub-Tab Selector */}
              <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-sm overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveMemorySubTab('working')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeMemorySubTab === 'working'
                      ? 'bg-[#0071E3] text-white shadow-sm'
                      : 'text-[#424245] hover:text-[#1D1D1F]'
                  }`}
                >
                  1. Working Memory ({hermesMemorySystem.workingMemory.activeContextTokens.toLocaleString()} tk)
                </button>
                <button
                  onClick={() => setActiveMemorySubTab('episodic')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeMemorySubTab === 'episodic'
                      ? 'bg-[#0071E3] text-white shadow-sm'
                      : 'text-[#424245] hover:text-[#1D1D1F]'
                  }`}
                >
                  2. Episodic Vector Recall (Qdrant)
                </button>
                <button
                  onClick={() => setActiveMemorySubTab('knowledge')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeMemorySubTab === 'knowledge'
                      ? 'bg-[#0071E3] text-white shadow-sm'
                      : 'text-[#424245] hover:text-[#1D1D1F]'
                  }`}
                >
                  3. Knowledge Graph ({hermesMemorySystem.semanticKnowledgeGraph.totalTriples} triples)
                </button>
              </div>

              {/* Real-Time Memory Search Input */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="text"
                  value={memorySearchQuery}
                  onChange={(e) => setMemorySearchQuery(e.target.value)}
                  placeholder="Search memory entries / vectors..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white/80 border border-black/[0.08] rounded-full text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] shadow-sm transition-all"
                />
                {memorySearchQuery && (
                  <button
                    onClick={() => setMemorySearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Tab 1: Working Memory Buffer */}
            {activeMemorySubTab === 'working' && (
              <div className="rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-left flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-[#1D1D1F]">Active Context Working Buffer</h4>
                    <p className="text-xs text-[#86868B] mt-0.5">Real-time cache and dynamic memory state entries</p>
                  </div>
                  <span className="text-xs font-mono text-[#0071E3] font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 w-fit">
                    {Math.round((hermesMemorySystem.workingMemory.activeContextTokens / hermesMemorySystem.workingMemory.maxContextTokens) * 100)}% Capacity Used (18.4k / 128k)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/[0.05] h-2.5 rounded-full overflow-hidden p-0.5 border border-black/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(hermesMemorySystem.workingMemory.activeContextTokens / hermesMemorySystem.workingMemory.maxContextTokens) * 100}%` }}
                    transition={springPresets.buoyant}
                    className="h-full bg-gradient-to-r from-[#0071E3] to-[#AF52DE] rounded-full shadow-[0_0_8px_rgba(0,113,227,0.4)]"
                  />
                </div>

                {/* Working Memory Key-Value Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWorkingMemory.map((entry, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between font-mono text-[#0071E3] font-bold">
                        <span>{entry.key}</span>
                        <span className="text-[#86868B] text-[10px] bg-white px-2 py-0.5 rounded border border-black/[0.04]">{entry.tokens} tokens</span>
                      </div>
                      <div className="text-[#1D1D1F] font-mono text-[11px] break-words bg-white p-3 rounded-xl border border-black/[0.04] shadow-sm leading-relaxed">
                        {entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Episodic Vector Recall (Qdrant) */}
            {activeMemorySubTab === 'episodic' && (
              <div className="rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-left flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-[#1D1D1F]">Qdrant Episodic Vector Recall</h4>
                    <p className="text-xs text-[#86868B] font-mono mt-0.5">
                      Cluster: {hermesMemorySystem.episodicMemory.vectorStoreProvider} • Dim: {hermesMemorySystem.episodicMemory.dimension} • Total Embeddings: {hermesMemorySystem.episodicMemory.totalEmbeddings.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 w-fit">
                    HNSW Cosine Index • 1536-dim
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {filteredVectorRetrievals.map((retrieval) => {
                    const similarityPct = Math.round(retrieval.similarityScore * 100);
                    return (
                      <div key={retrieval.id} className="p-5 rounded-2xl bg-slate-50 border border-black/[0.05] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071E3] font-bold border border-blue-200/60">
                              {retrieval.collection}
                            </span>
                            <span className="text-[11px] font-mono text-[#86868B]">
                              {retrieval.embeddingModel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-700 font-bold">
                              {similarityPct}% Match
                            </span>
                            <span className="text-[11px] text-[#86868B] font-mono">
                              (cos: {retrieval.similarityScore.toFixed(3)})
                            </span>
                          </div>
                        </div>

                        {/* Animated Match Progress Bar */}
                        <div className="w-full bg-black/[0.04] h-2 rounded-full overflow-hidden p-0.5 border border-black/[0.03]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${similarityPct}%` }}
                            transition={springPresets.buoyant}
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#00C7BE] rounded-full shadow-[0_0_8px_rgba(52,199,89,0.4)]"
                          />
                        </div>

                        <p className="text-xs text-[#1D1D1F] font-mono leading-relaxed bg-white p-3.5 rounded-xl border border-black/[0.04] shadow-sm">
                          "{retrieval.documentSnippet}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Semantic Knowledge Graph */}
            {activeMemorySubTab === 'knowledge' && (
              <div className="rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-left flex flex-col gap-6">
                <div>
                  <h4 className="text-xl font-bold text-[#1D1D1F]">Semantic Knowledge Graph Triples</h4>
                  <p className="text-xs text-[#86868B] mt-0.5">2,450 entity nodes and weighted semantic directional links</p>
                </div>

                {/* Entity Tags */}
                <div>
                  <div className="text-xs font-mono text-[#86868B] uppercase font-bold mb-2.5">Core Entity Nodes</div>
                  <div className="flex flex-wrap gap-2">
                    {hermesMemorySystem.semanticKnowledgeGraph.entities.map((entity) => (
                      <div
                        key={entity.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-black/[0.05] text-xs font-mono shadow-sm"
                      >
                        <span className="text-[#86868B] text-[10px]">[{entity.type}]</span>
                        <span className="text-[#1D1D1F] font-bold">{entity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relations Cards */}
                <div>
                  <div className="text-xs font-mono text-[#86868B] uppercase font-bold mb-2.5">Active Triples</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredKnowledgeTriples.map((rel, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.05] text-xs font-mono flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2 text-[#1D1D1F]">
                          <span className="text-[#0071E3] font-bold">{rel.from}</span>
                          <span className="text-[#AF52DE] font-semibold text-[11px]">--[{rel.relation}]--&gt;</span>
                          <span className="text-cyan-700 font-bold">{rel.to}</span>
                        </div>
                        <span className="text-[10px] text-[#86868B] bg-white px-2 py-0.5 rounded border border-black/[0.04] font-semibold">
                          w: {rel.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Dynamic LLM Router Matrix */}
        {activeTab === 'router' && (
          <motion.div
            key="tab-router"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-5 text-left"
          >
            {hermesRouterLogs.map((log) => (
              <div key={log.requestId} className="p-6 rounded-[28px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#0071E3] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                      REQ: {log.requestId}
                    </span>
                    <span className="text-xs font-mono text-[#86868B]">
                      Domain: <strong className="text-[#1D1D1F]">{log.promptClassification.domain}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-50 text-[#AF52DE] font-semibold border border-purple-200/60">
                      Complexity: {log.promptClassification.complexity}
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                      Quality Score: {log.executionResult.qualityScore}/1.0
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
                  <div className="space-y-2">
                    <div>Selected Model: <span className="text-[#1D1D1F] font-extrabold">{log.routingDecision.selectedModel}</span> ({log.routingDecision.provider})</div>
                    <div>Arbitration Reasoning: <span className="text-[#424245] italic font-sans">{log.routingDecision.reasoning}</span></div>
                    <div>Fallback Chain: <span className="text-[#0071E3] font-semibold">{log.fallbackChain.join(' → ')}</span></div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-black/[0.05] space-y-1.5 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Actual Duration:</span>
                      <span className="text-[#1D1D1F] font-bold">{log.executionResult.actualDurationMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Execution Cost:</span>
                      <span className="text-emerald-700 font-bold">${log.executionResult.actualCostUsd.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Fallback Triggered:</span>
                      <span className={log.executionResult.fallbackTriggered ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                        {String(log.executionResult.fallbackTriggered)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Quorum Consensus Engine & Live Simulator */}
        {activeTab === 'quorum' && (
          <motion.div
            key="tab-quorum"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-6 text-left"
          >
            {/* Quorum Simulator Action Bar */}
            <div className="p-6 rounded-[28px] bg-gradient-to-r from-blue-50/80 via-purple-50/60 to-emerald-50/80 border border-black/[0.06] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#0071E3] uppercase font-bold flex items-center gap-1.5">
                  <Fingerprint size={14} />
                  <span>Byzantine Fault Tolerant (3f+1) Consensus Protocol</span>
                </div>
                <h4 className="text-lg font-bold text-[#1D1D1F] mt-1">
                  Cryptographic Multi-Agent Validator Quorum
                </h4>
                <p className="text-xs text-[#424245] mt-0.5">
                  Requires unanimous or 3f+1 validator threshold across Architect, Security Sentry, QA and Performance.
                </p>
              </div>

              <button
                onClick={triggerQuorumSimulation}
                disabled={isSimulatingVote}
                className="apple-btn-primary text-xs shrink-0 self-start sm:self-center"
              >
                {isSimulatingVote ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Collecting Quorum Signatures ({simulatedVoteProgress}/4)...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run Quorum Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Quorum Sessions List */}
            {simulatedSessions.map((session) => (
              <div key={session.sessionId} className="p-6 rounded-[28px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                  <div>
                    <div className="text-xs font-mono text-[#0071E3] font-semibold">{session.protocol}</div>
                    <h4 className="text-base font-bold text-[#1D1D1F] mt-0.5">{session.targetDecision}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Consensus Reached
                    </span>
                  </div>
                </div>

                {/* Votes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.votes.map((v, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] text-xs flex flex-col gap-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1D1D1F]">{v.agentName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          v.vote === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {v.vote} (conf: {v.confidence})
                        </span>
                      </div>
                      <p className="text-[#424245] text-[11px] leading-relaxed italic bg-white p-2.5 rounded-xl border border-black/[0.04]">
                        "{v.critique}"
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#86868B] flex items-center justify-between">
                  <span>Coordination Overhead: <strong>{session.coordinationOverheadMs}ms</strong></span>
                  <span className="text-emerald-700 font-bold">Outcome: {session.finalDecision}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 4: JSON State Tree */}
        {activeTab === 'json' && (
          <motion.div
            key="tab-json"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springPresets.buoyant}
          >
            <JsonGraphInspector 
              data={{
                telemetry: hermesTelemetryRecords,
                taskGraph: hermesTaskGraph,
                memorySystem: hermesMemorySystem,
                routerLogs: hermesRouterLogs,
                quorumSessions: simulatedSessions
              }}
              title="Hermes Full Autonomous Swarm State"
              maxHeight="520px"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hermes;
