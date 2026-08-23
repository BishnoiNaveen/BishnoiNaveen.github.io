import React, { useState, useEffect, useMemo } from 'react';
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
  VectorRecallResult,
  WorkingMemoryEntry
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
  Terminal
} from 'lucide-react';

const STATUS_CONFIG: Record<AgentStatus, { label: string; bg: string; text: string; dot: string; glow: string }> = {
  IDLE: {
    label: 'Idle',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    glow: 'rgba(148, 163, 184, 0.2)',
  },
  PLANNING: {
    label: 'Planning DAG',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  EXECUTING_TOOL: {
    label: 'Executing Tool',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  AWAITING_CONSENSUS: {
    label: 'Quorum Vote',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-400',
    dot: 'bg-fuchsia-400',
    glow: 'rgba(217, 70, 239, 0.3)',
  },
  REFLECTING: {
    label: 'Reflecting',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    dot: 'bg-violet-400',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  TERMINATED: {
    label: 'Terminated',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-400',
    glow: 'rgba(239, 68, 68, 0.2)',
  },
  ERROR: {
    label: 'Error',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    glow: 'rgba(244, 63, 94, 0.3)',
  },
};

type InspectorTab = 'memory' | 'router' | 'quorum' | 'json';
type MemorySubTab = 'working' | 'episodic' | 'knowledge';

export const HermesTelemetryDashboard: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<InspectorTab>('memory');
  const [activeMemorySubTab, setActiveMemorySubTab] = useState<MemorySubTab>('episodic');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(hermesTelemetryRecords[0]?.agentId || '');
  const [simulatedTurn, setSimulatedTurn] = useState<number>(1540);
  const [tick, setTick] = useState<number>(0);

  // Live simulation tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveStream) {
      interval = setInterval(() => {
        setTick((prev) => prev + 1);
        setSimulatedTurn((prev) => prev + 1);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveStream]);

  // Dynamic metrics with micro-fluctuations during live stream
  const aggregateMetrics = useMemo(() => {
    const totalTokens = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalTokens, 0) + tick * 145;
    const totalCost = hermesTelemetryRecords.reduce((acc, a) => acc + a.tokenMetrics.totalCostUsd, 0) + tick * 0.002;
    const avgLatency = Math.round(
      hermesTelemetryRecords.reduce((acc, a) => acc + a.latency.ttftMs, 0) / hermesTelemetryRecords.length
    );
    const activeAgentsCount = hermesTelemetryRecords.filter(a => a.status !== 'IDLE' && a.status !== 'TERMINATED').length;

    return {
      totalTokens: totalTokens.toLocaleString(),
      totalCost: totalCost.toFixed(3),
      avgLatency: `${avgLatency} ms`,
      activeAgentsCount: `${activeAgentsCount} / ${hermesTelemetryRecords.length}`,
    };
  }, [tick]);

  const selectedAgent = useMemo(() => {
    return hermesTelemetryRecords.find(a => a.agentId === selectedAgentId) || hermesTelemetryRecords[0];
  }, [selectedAgentId]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6">
      {/* Dashboard Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveStream ? 'bg-emerald-400 opacity-75' : 'bg-gray-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveStream ? 'bg-emerald-500' : 'bg-gray-500'}`} />
            </span>
            <span>HERMES AGENTIC TELEMETRY RUNTIME</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="text-violet-400" />
            <span>Multi-Agent Swarm & Memory Telemetry</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Real-time telemetry stream, 3-tier memory recall (Working, Qdrant Vector, Knowledge Graph), dynamic LLM router arbitration, and BFT quorum consensus.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
              isLiveStream
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {isLiveStream ? <Radio size={14} className="animate-pulse text-emerald-400" /> : <Play size={14} />}
            <span>{isLiveStream ? 'Live Feed Active' : 'Feed Paused'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Animated Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Tokens Processed</span>
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-2">
            {aggregateMetrics.totalTokens}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <TrendingUp size={12} />
            <span>~88 tokens/sec avg</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Total Swarm Cost</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono mt-2">
            ${aggregateMetrics.totalCost}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-mono">
            <span>Cached: ~55% savings</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Avg TTFT Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-2">
            {aggregateMetrics.avgLatency}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1 font-mono">
            <span>Target: &lt; 300ms SLA</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={springPresets.snappy}
          className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Swarm Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-2">
            {aggregateMetrics.activeAgentsCount}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            <span>Consensus: 100% OK</span>
          </div>
        </motion.div>
      </div>

      {/* Multi-Agent Swarm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {hermesTelemetryRecords.map((agent) => {
          const isSelected = selectedAgentId === agent.agentId;
          const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.IDLE;

          return (
            <motion.div
              key={agent.agentId}
              layout
              onClick={() => setSelectedAgentId(agent.agentId)}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              transition={springPresets.snappy}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-violet-950/40 border-violet-400/80 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-violet-400'
                  : 'bg-slate-900/70 hover:bg-slate-900/90 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono text-gray-400 font-medium">
                    {agent.agentId.split('-')[0].toUpperCase()}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {agent.agentName}
                  </h4>
                </div>

                {/* Pulsing Status Dot */}
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                  <span>{status.label}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 line-clamp-2">
                {agent.currentTask}
              </div>

              {/* Agent Mini Metrics */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{agent.activeModel.split('-')[0]}</span>
                <span className="text-cyan-300 font-semibold">{agent.latency.totalLatencyMs}ms</span>
                <span className="text-violet-300">${agent.tokenMetrics.totalCostUsd.toFixed(2)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Tab Navigation Toolbar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('memory')}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            activeTab === 'memory' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <Database size={15} className={activeTab === 'memory' ? 'text-violet-400' : 'text-gray-400'} />
            <span>3-Tier Memory System</span>
          </div>
          {activeTab === 'memory' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/40 rounded-xl"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('router')}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            activeTab === 'router' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <GitBranch size={15} className={activeTab === 'router' ? 'text-violet-400' : 'text-gray-400'} />
            <span>Dynamic LLM Router Matrix</span>
          </div>
          {activeTab === 'router' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/40 rounded-xl"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('quorum')}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            activeTab === 'quorum' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <ShieldCheck size={15} className={activeTab === 'quorum' ? 'text-violet-400' : 'text-gray-400'} />
            <span>Quorum Consensus Engine</span>
          </div>
          {activeTab === 'quorum' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/40 rounded-xl"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            activeTab === 'json' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <Terminal size={15} className={activeTab === 'json' ? 'text-violet-400' : 'text-gray-400'} />
            <span>JSON State Tree</span>
          </div>
          {activeTab === 'json' && (
            <motion.div
              layoutId="active-hermes-tab"
              className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/40 rounded-xl"
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
            />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'memory' && (
          <motion.div
            key="tab-memory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-6"
          >
            {/* Memory Sub-Tab Pills */}
            <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10 w-fit text-left">
              <button
                onClick={() => setActiveMemorySubTab('working')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeMemorySubTab === 'working'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Working Memory ({hermesMemorySystem.workingMemory.activeContextTokens.toLocaleString()} tk)
              </button>
              <button
                onClick={() => setActiveMemorySubTab('episodic')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeMemorySubTab === 'episodic'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                2. Episodic Vector Recall (Qdrant)
              </button>
              <button
                onClick={() => setActiveMemorySubTab('knowledge')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeMemorySubTab === 'knowledge'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Semantic Knowledge Graph ({hermesMemorySystem.semanticKnowledgeGraph.totalTriples} triples)
              </button>
            </div>

            {/* Sub-Tab 1: Working Memory */}
            {activeMemorySubTab === 'working' && (
              <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 shadow-xl text-left flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">Active Context Window</h4>
                    <p className="text-xs text-gray-400">Real-time cache and dynamic memory state entries</p>
                  </div>
                  <span className="text-xs font-mono text-violet-300 font-bold">
                    {Math.round((hermesMemorySystem.workingMemory.activeContextTokens / hermesMemorySystem.workingMemory.maxContextTokens) * 100)}% Capacity Used
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(hermesMemorySystem.workingMemory.activeContextTokens / hermesMemorySystem.workingMemory.maxContextTokens) * 100}%` }}
                    transition={springPresets.buoyant}
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  />
                </div>

                {/* Working Memory Key-Value Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {hermesMemorySystem.workingMemory.entries.map((entry, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between font-mono text-violet-300 font-semibold">
                        <span>{entry.key}</span>
                        <span className="text-gray-500 text-[10px]">{entry.tokens} tokens</span>
                      </div>
                      <div className="text-gray-300 font-mono text-[11px] break-words bg-black/50 p-2 rounded">
                        {entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Episodic Vector Recall */}
            {activeMemorySubTab === 'episodic' && (
              <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 shadow-xl text-left flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">Qdrant Vector Recall Results</h4>
                    <p className="text-xs text-gray-400 font-mono">
                      Provider: {hermesMemorySystem.episodicMemory.vectorStoreProvider} • Dim: {hermesMemorySystem.episodicMemory.dimension} • Embeddings: {hermesMemorySystem.episodicMemory.totalEmbeddings.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {(hermesMemorySystem.episodicMemory?.recentRetrievals || []).map((retrieval) => {
                    const similarityPct = Math.round(retrieval.similarityScore * 100);
                    return (
                      <div key={retrieval.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">
                              {retrieval.collection}
                            </span>
                            <span className="text-[11px] font-mono text-gray-500">
                              {retrieval.embeddingModel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-bold">
                              {similarityPct}% Match
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              (cos: {retrieval.similarityScore.toFixed(3)})
                            </span>
                          </div>
                        </div>

                        {/* Animated Cosine Similarity Bar */}
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${similarityPct}%` }}
                            transition={springPresets.buoyant}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          />
                        </div>

                        <p className="text-xs text-gray-300 font-mono leading-relaxed bg-black/50 p-2.5 rounded-lg border border-white/5">
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
              <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 shadow-xl text-left flex flex-col gap-6">
                <div>
                  <h4 className="text-base font-bold text-white">Semantic Knowledge Graph Triples</h4>
                  <p className="text-xs text-gray-400">Entity nodes and weighted semantic directional links</p>
                </div>

                {/* Entity Tags */}
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase mb-2">Entity Nodes</div>
                  <div className="flex flex-wrap gap-2">
                    {hermesMemorySystem.semanticKnowledgeGraph.entities.map((entity) => (
                      <div
                        key={entity.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono"
                      >
                        <span className="text-gray-400 text-[10px]">[{entity.type}]</span>
                        <span className="text-white font-semibold">{entity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relations Cards */}
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase mb-2">Active Triples</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hermesMemorySystem.semanticKnowledgeGraph.relations.map((rel, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <span className="text-violet-300">{rel.from}</span>
                          <span className="text-gray-500 font-bold">--[{rel.relation}]--&gt;</span>
                          <span className="text-cyan-300">{rel.to}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-4 text-left"
          >
            {hermesRouterLogs.map((log) => (
              <div key={log.requestId} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-violet-300">
                      REQ: {log.requestId}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      Domain: {log.promptClassification.domain}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                      Complexity: {log.promptClassification.complexity}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Quality: {log.executionResult.qualityScore}/1.0
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <div>Selected Model: <span className="text-white font-bold">{log.routingDecision.selectedModel}</span> ({log.routingDecision.provider})</div>
                    <div>Arbitration Reasoning: <span className="text-gray-300 italic font-sans">{log.routingDecision.reasoning}</span></div>
                    <div>Fallback Chain: <span className="text-cyan-300">{log.fallbackChain.join(' → ')}</span></div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual Duration:</span>
                      <span className="text-white font-bold">{log.executionResult.actualDurationMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual Cost:</span>
                      <span className="text-emerald-400 font-bold">${log.executionResult.actualCostUsd.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fallback Triggered:</span>
                      <span className={log.executionResult.fallbackTriggered ? 'text-amber-400' : 'text-emerald-400'}>
                        {String(log.executionResult.fallbackTriggered)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Quorum Consensus Engine */}
        {activeTab === 'quorum' && (
          <motion.div
            key="tab-quorum"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springPresets.buoyant}
            className="flex flex-col gap-4 text-left"
          >
            {hermesQuorumSessions.map((session) => (
              <div key={session.sessionId} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <div className="text-xs font-mono text-violet-400 font-semibold">{session.protocol}</div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{session.targetDecision}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Consensus Reached
                    </span>
                  </div>
                </div>

                {/* Votes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {session.votes.map((v, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{v.agentName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          v.vote === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {v.vote} (conf: {v.confidence})
                        </span>
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed italic">
                        "{v.critique}"
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 text-xs font-mono text-gray-400 flex items-center justify-between">
                  <span>Coordination Overhead: {session.coordinationOverheadMs}ms</span>
                  <span className="text-emerald-300 font-bold">Outcome: {session.finalDecision}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 4: JSON State Tree */}
        {activeTab === 'json' && (
          <motion.div
            key="tab-json"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springPresets.buoyant}
          >
            <JsonGraphInspector 
              data={{
                telemetry: hermesTelemetryRecords,
                taskGraph: hermesTaskGraph,
                memorySystem: hermesMemorySystem,
                routerLogs: hermesRouterLogs,
                quorumSessions: hermesQuorumSessions
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

export default HermesTelemetryDashboard;
