import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  vote: 'APPROVE' | 'REJECT';
  confidence: number;
  sig: string;
}

export default function AeonisConsensusVisualizer() {
  const [rogueMode, setRogueMode] = useState(false);

  const agents: AgentNode[] = [
    {
      id: 'agent_1',
      name: 'Architect Agent',
      role: 'API Contract & Invariants',
      vote: 'APPROVE',
      confidence: 0.98,
      sig: 'ed25519:8f9a..4b12',
    },
    {
      id: 'agent_2',
      name: 'Security Sentry',
      role: 'AST Taint Traversal',
      vote: rogueMode ? 'REJECT' : 'APPROVE',
      confidence: rogueMode ? 0.99 : 0.95,
      sig: 'ed25519:7c21..9e33',
    },
    {
      id: 'agent_3',
      name: 'QA Auditor',
      role: 'Sandbox Regression',
      vote: 'APPROVE',
      confidence: 0.96,
      sig: 'ed25519:3d88..1a04',
    },
    {
      id: 'agent_4',
      name: 'Deploy Sentry',
      role: 'Istio Canary Rollback',
      vote: 'APPROVE',
      confidence: 0.99,
      sig: 'ed25519:5e44..6f89',
    },
  ];

  const approvedCount = agents.filter((a) => a.vote === 'APPROVE').length;
  const quorumSatisfied = approvedCount >= 3; // BFT 3f+1 requirement (>= 3 out of 4)

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] inline-block"></span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            AEONIS BFT Consensus &amp; Canary Sentry
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRogueMode(!rogueMode)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
              rogueMode
                ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/40'
                : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border)]'
            }`}
          >
            {rogueMode ? 'Adversarial Sentry Injected (3/4 Quorum)' : 'Inject Adversarial Agent'}
          </button>
        </div>
      </div>

      {/* 4-Agent Consensus Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {agents.map((agent) => {
          const isApprove = agent.vote === 'APPROVE';
          return (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.01 }}
              transition={springPresets.snappy}
              className={`p-4 rounded-xl border transition-all ${
                isApprove
                  ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/[0.04]'
                  : 'border-[#FF3B30]/30 bg-[#FF3B30]/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-sm font-bold text-[var(--color-text-primary)]">
                    {agent.name}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">
                    {agent.role}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isApprove
                      ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                      : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                  }`}
                >
                  {agent.vote}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
                <span>Confidence: {(agent.confidence * 100).toFixed(0)}%</span>
                <span className="truncate max-w-[120px]">{agent.sig}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quorum Gate Result & Canary Telemetry Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-1">
            Quorum Verification Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                quorumSatisfied ? 'bg-[var(--color-success)]' : 'bg-[#FF3B30]'
              }`}
            ></span>
            <span className="text-sm font-bold text-[var(--color-text-primary)]">
              {quorumSatisfied ? 'Byzantine Quorum Approved (3f+1 Satisfied)' : 'Quorum Rejected'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-mono">
            {approvedCount}/4 Signatures Verified · Release Gate Cleared
          </p>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-1">
            Istio Canary Sentry (5% Traffic)
          </div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[var(--color-text-secondary)]">Error Rate:</span>
            <span className="text-[var(--color-success)] font-bold">0.03% (&lt; 0.50% SLA)</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[var(--color-success)] h-1.5 rounded-full"
              style={{ width: '6%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
