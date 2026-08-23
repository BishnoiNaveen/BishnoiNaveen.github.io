import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { projects } from '../data/projects';
import type { Project, ProjectCategory } from '../types/project';
import { FluidProjectCard } from './FluidProjectCard';
import { 
  Layers, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';
import { GithubIcon } from './icons';

type FilterCategory = 'All' | ProjectCategory;

const CATEGORIES: FilterCategory[] = ['All', 'Live', 'Antigravity Labs', 'Open Source'];

export const ProjectsFilterGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6">
      {/* Section Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
            <Layers size={14} />
            <span>ARCHITECTURAL PORTFOLIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Featured Systems & Applications
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Production-grade distributed engines, multi-agent frameworks, and high-performance applications with mathematical invariants.
          </p>
        </div>

        {/* Category Filter Pills with Glide Spring */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="relative z-10">{cat}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-category-pill"
                    className="absolute inset-0 z-0 bg-violet-600 border border-violet-400/50 rounded-lg shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FLIP Layout Animated Projects Grid */}
      <motion.div
        layout
        transition={shouldReduceMotion ? { duration: 0 } : springPresets.morph}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <FluidProjectCard
              key={project.title}
              project={project}
              onSelect={(p) => setExpandedProject(p)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Full Detail Modal with Morph / Cinematic Spring */}
      <AnimatePresence>
        {expandedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProject(null)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`Project details for ${expandedProject.title}`}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={shouldReduceMotion ? { duration: 0 } : springPresets.cinematic}
                className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl pointer-events-auto flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
                      <span>{expandedProject.category}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{expandedProject.statusLabel || expandedProject.status}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {expandedProject.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {expandedProject.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedProject(null)}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">Overview</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {expandedProject.description}
                  </p>
                </div>

                {/* Architectural Invariants */}
                {expandedProject.systemInvariants && expandedProject.systemInvariants.length > 0 && (
                  <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                      <ShieldCheck size={16} />
                      <span>Mathematical System Invariants</span>
                    </div>
                    <ul className="text-xs text-gray-300 font-mono space-y-1.5 list-disc list-inside">
                      {expandedProject.systemInvariants.map((inv, i) => (
                        <li key={i}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Highlights */}
                {expandedProject.highlights && expandedProject.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">Engineering Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {expandedProject.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300 p-2.5 rounded-lg bg-black/30 border border-white/5">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-3 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    {expandedProject.github !== null && (
                      <a
                        href={expandedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <GithubIcon size={15} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {expandedProject.live !== null && (
                      <a
                        href={expandedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                      >
                        <ExternalLink size={15} />
                        <span>Launch Live System</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsFilterGrid;
