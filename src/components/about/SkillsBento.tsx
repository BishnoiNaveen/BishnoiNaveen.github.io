import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { skillDomains, allSkillsList, type SkillItem, type SkillDomain } from '../../data/skills';
import { springPresets, instantTransition } from '../../lib/springs';

export default function SkillsBento() {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [activeSkillModal, setActiveSkillModal] = useState<SkillItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const displayedDomains = selectedDomain === 'all'
    ? skillDomains
    : skillDomains.filter((d) => d.id === selectedDomain);

  const morphTransition = shouldReduceMotion ? instantTransition : springPresets.morph;
  const buoyantTransition = shouldReduceMotion ? instantTransition : springPresets.buoyant;

  return (
    <div className="w-full flex flex-col gap-12 text-[var(--color-text-primary)]">
      {/* SECTION HEADER & DOMAIN FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border)] mb-4 select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
            <span className="type-badge-label text-[var(--color-text-secondary)] text-[11px] font-semibold tracking-[0.08em] uppercase">
              Chapter 06 · Technical Competencies Bento
            </span>
          </div>
          <h2 className="type-headline-chapter text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)]">
            Architectural Domains &amp; Verified Evidence.
          </h2>
          <p className="type-body-editorial text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl">
            Organized strictly by systems engineering domain with verified repository evidence tags. Zero arbitrary percentage progress bars.
          </p>
        </div>

        {/* Filter Pills with Apple Morphing Active Indicator */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[var(--color-border-subtle)] self-start md:self-auto">
          <motion.button
            type="button"
            onClick={() => setSelectedDomain('all')}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={springPresets.snappy}
            className={`relative px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              selectedDomain === 'all'
                ? 'text-[var(--color-text-primary)] font-bold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {selectedDomain === 'all' && (
              <motion.div
                layoutId="activeSkillsDomainPill"
                transition={morphTransition}
                className="absolute inset-0 rounded-xl bg-[var(--material-1-bg)] shadow-sm border border-[var(--color-border)] -z-10"
              />
            )}
            <span className="relative z-10">All Domains ({allSkillsList.length})</span>
          </motion.button>
          {skillDomains.map((domain) => {
            const isActive = selectedDomain === domain.id;
            return (
              <motion.button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomain(domain.id)}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={springPresets.snappy}
                className={`relative px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  isActive
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillsDomainPill"
                    transition={morphTransition}
                    className="absolute inset-0 rounded-xl bg-[var(--material-1-bg)] shadow-sm border border-[var(--color-border)] -z-10"
                  />
                )}
                <span className="relative z-10">{domain.title.split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BENTO GRID OF DOMAINS & SKILL TILES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayedDomains.map((domain) => (
          <motion.div
            key={domain.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={springPresets.buoyant}
            className="p-8 sm:p-10 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] flex flex-col justify-between gap-8 hover:border-[var(--color-accent)]/30 transition-colors"
          >
            {/* Domain Header */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  {domain.badge}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {domain.skills.length} Competencies
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-2">
                {domain.title}
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                {domain.lead}
              </p>
            </div>

            {/* Skill Tiles List */}
            <div className="flex flex-col gap-4">
              {domain.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--color-border-subtle)] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
                      <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                        {skill.name}
                      </h4>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/15">
                      {skill.level}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Codebase Evidence Tag */}
                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                        REPO PROOF:
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {skill.evidenceRepo}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                      {skill.evidenceProof}
                    </div>
                  </div>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
