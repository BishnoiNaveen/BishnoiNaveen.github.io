import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project, CaseStudy, CaseStudySection } from '../../types/project';
import { springPresets } from '../../lib/springs';
import MagneticButton from '../ui/MagneticButton';

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabKey =
  | 'problem'
  | 'idea'
  | 'systemArchitecture'
  | 'buildAndInvariants'
  | 'verificationAndProof'
  | 'lessonsLearned'
  | 'measurableOutcome';

const TAB_CONFIG: { key: TabKey; label: string; number: string }[] = [
  { key: 'problem', label: 'Problem Statement', number: '01' },
  { key: 'idea', label: 'Mental Model & Idea', number: '02' },
  { key: 'systemArchitecture', label: 'System Architecture', number: '03' },
  { key: 'buildAndInvariants', label: 'Build & Invariants', number: '04' },
  { key: 'verificationAndProof', label: 'Verification & Proof', number: '05' },
  { key: 'lessonsLearned', label: 'Lessons & Trade-Offs', number: '06' },
  { key: 'measurableOutcome', label: 'Measurable Outcomes', number: '07' },
];

export default function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('problem');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Reset to first tab when new project opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab('problem');
    }
  }, [isOpen, project?.id]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = useCallback((text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    }
  }, []);

  if (!isOpen || !project) return null;

  const caseStudy = project.caseStudy;
  const currentSection: CaseStudySection | undefined = caseStudy ? caseStudy[activeTab] : undefined;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        {/* Backdrop (Level 4 Dimming) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springPresets.snappy}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window (Level 4 visionOS Glass Sheet) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={springPresets.cinematic}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl md:rounded-[32px] border border-white/80 dark:border-white/15 bg-[var(--material-1-bg)]/95 dark:bg-[#121215]/95 backdrop-blur-[48px] shadow-[0_32px_72px_-16px_rgba(0,0,0,0.35)] overflow-hidden z-10 my-auto"
        >
          {/* Top Mobile Drag Handle Bar */}
          <div className="md:hidden w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20"></div>
          </div>

          {/* Modal Header */}
          <div className="p-6 md:p-8 pb-4 border-b border-[var(--color-border-subtle)] flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-mono font-bold uppercase tracking-wider">
                  {project.domain || project.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-xs font-mono">
                  {project.statusLabel}
                </span>
              </div>
              <h2
                id="case-study-title"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)]"
              >
                {project.title}
              </h2>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-1">
                {project.subtitle}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer shrink-0"
              aria-label="Close Case Study Modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 7-Tab Anatomy Navigation Strip */}
          <div className="px-6 md:px-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/40 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 py-3 min-w-max">
              {TAB_CONFIG.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-3.5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white dark:text-black font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCaseStudyTabPill"
                        transition={springPresets.morph}
                        className="absolute inset-0 rounded-full bg-[var(--color-accent)] dark:bg-white"
                      />
                    )}
                    <span className="relative z-10 text-[10px] opacity-80">{tab.number}</span>
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Body Content Area (Scrollable) */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 max-h-[60vh]">
            {currentSection ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springPresets.snappy}
                className="space-y-6"
              >
                {/* Section Summary Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-accent)]/[0.06] border border-[var(--color-accent)]/20">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-1">
                    {currentSection.summary}
                  </h3>
                </div>

                {/* Main Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] font-normal">
                  {currentSection.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Highlights List */}
                {currentSection.highlights && currentSection.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      Key Highlights &amp; Observations
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentSection.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[var(--color-text-primary)] p-3 rounded-xl bg-[var(--color-canvas)]/60 border border-[var(--color-border-subtle)]"
                        >
                          <svg className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Invariants List */}
                {currentSection.invariants && currentSection.invariants.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      Enforced System Invariants
                    </h4>
                    <div className="space-y-2">
                      {currentSection.invariants.map((inv, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 text-xs sm:text-sm font-mono text-[var(--color-text-primary)] flex items-start gap-2.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0 mt-1.5"></span>
                          <span>{inv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Diagram Steps */}
                {currentSection.diagram && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      {currentSection.diagram.caption}
                    </h4>
                    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)]/80 font-mono text-xs space-y-2">
                      {currentSection.diagram.steps?.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[var(--color-text-primary)]">
                          <span className="text-[var(--color-accent)] font-bold">↳</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics Table */}
                {currentSection.metrics && currentSection.metrics.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      Empirical Metrics &amp; Benchmarks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSection.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 flex flex-col"
                        >
                          <span className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                            {m.label}
                          </span>
                          <span className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] mb-1">
                            {m.value}
                          </span>
                          {m.description && (
                            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                              {m.description}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Snippets */}
                {currentSection.codeSnippets && currentSection.codeSnippets.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      Verified Implementation Code Snippet
                    </h4>
                    {currentSection.codeSnippets.map((snippet, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[var(--color-border)] bg-[#111114] text-[#E4E4E7] overflow-hidden shadow-inner"
                      >
                        <div className="px-4 py-2.5 bg-[#18181B] border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-mono text-zinc-400">
                            {snippet.filename} ({snippet.language})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(snippet.code, idx)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-300 transition-colors cursor-pointer"
                          >
                            {copiedIndex === idx ? 'Copied ✓' : 'Copy Code'}
                          </button>
                        </div>
                        <pre className="p-4 font-mono text-xs overflow-x-auto leading-relaxed text-zinc-300">
                          <code>{snippet.code}</code>
                        </pre>
                        {snippet.explanation && (
                          <div className="px-4 py-2.5 bg-[#18181B]/50 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                            💡 {snippet.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-8 text-center text-[var(--color-text-secondary)]">
                Case study details for this section are being prepared.
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="p-4 sm:p-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {project.github && (
                <MagneticButton
                  href={project.github}
                  target="_blank"
                  variant="secondary"
                  size="sm"
                  ariaLabel="View GitHub Repository"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </MagneticButton>
              )}
              {project.live && (
                <MagneticButton
                  href={project.live}
                  target={project.live.startsWith('http') ? '_blank' : '_self'}
                  variant="primary"
                  size="sm"
                  ariaLabel="View Live Implementation"
                >
                  <span>View Live</span>
                </MagneticButton>
              )}
            </div>

            <div className="text-xs font-mono text-[var(--color-text-muted)]">
              ESC to close · 7-Part Engineering Anatomy
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
