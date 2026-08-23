import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { projects } from '../data/projects';
import type { Project, ProjectDomain } from '../types/project';
import { 
  Layers, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  Code2,
  Activity,
  Zap,
  Cpu,
  Database,
  Terminal,
  Info,
  Server,
  Lock,
  Boxes
} from 'lucide-react';
import { GithubIcon } from './icons';

type FilterCategory = 'All' | 'Autonomous & AI' | 'Systems & IoT' | 'Data & Lakehouse';

const FILTER_CATEGORIES: FilterCategory[] = [
  'All',
  'Autonomous & AI',
  'Systems & IoT',
  'Data & Lakehouse',
];

const STATUS_CONFIGS: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  live: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Live / Production',
  },
  beta: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Beta Engine',
  },
  planning: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-700',
    border: 'border-violet-500/30',
    dot: 'bg-violet-500',
    label: 'Architecture Stage',
  },
  completed: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500',
    label: 'Completed System',
  },
};

export const Projects: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter projects by domain / category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(
      (p) => p.domain === selectedCategory || p.category === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 py-8 px-4 sm:px-6">
      {/* Section Header & Apple Segmented Control */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0071E3] text-xs font-semibold tracking-wider uppercase w-fit shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            <span>Proven Systems Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.1]">
            Featured Systems & <span className="apple-gradient-text">Architectural Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-[#424245] leading-relaxed">
            High-throughput distributed engines, autonomous multi-agent pipelines, and low-latency systems built with uncompromising mathematical invariants.
          </p>
        </div>

        {/* Category Filter Pills (Apple Segmented Bar) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none self-start lg:self-end">
          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                  isSelected ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <span className="relative z-10">{cat}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-project-category"
                    className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
                    transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid (Apple visionOS 32px Glass Cards) */}
      <motion.div
        layout
        transition={shouldReduceMotion ? { duration: 0 } : springPresets.morph}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const statusConfig = STATUS_CONFIGS[project.status] || STATUS_CONFIGS.completed;
            const topMetric = project.metrics && project.metrics.length > 0 ? project.metrics[0] : null;

            return (
              <motion.article
                key={project.id || project.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={shouldReduceMotion ? { duration: 0 } : springPresets.buoyant}
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
                onClick={() => setActiveProject(project)}
                className="group relative rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_54px_-8px_rgba(0,113,227,0.12)] hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between overflow-hidden text-left"
              >
                {/* Edge-to-Edge Project Image Preview */}
                <div className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden mb-5 bg-slate-100 border border-black/[0.06] shadow-inner group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Specular Inner Glare Overlay */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/40 rounded-[24px] pointer-events-none" />

                  {/* Gradient bottom shadow on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Category Pill Tag (Floating Glass) */}
                  <div className="absolute top-3.5 left-3.5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1D1D1F] border border-white/80 shadow-sm flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>{project.domain || project.category}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm flex items-center gap-1.5 bg-white/85 ${statusConfig.text} border-white/80`}>
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                    <span>{project.statusLabel}</span>
                  </div>

                  {/* Live Metric Badge Overlay at bottom of image */}
                  {topMetric && (
                    <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-mono text-white flex items-center justify-between border border-white/20 shadow-sm">
                      <span className="text-gray-300 text-[11px] uppercase tracking-wider">{topMetric.label}:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                        {topMetric.value}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-3">
                  {/* Title & External Hint */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#86868B] font-medium mt-1">
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-black/[0.04] group-hover:bg-[#0071E3] text-[#86868B] group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#424245] leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Architectural Invariant Tag */}
                  {project.architecturalLayer && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-black/[0.05] text-xs font-mono text-[#1D1D1F] shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                      <span className="truncate font-medium">{project.architecturalLayer}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Tech Stack Chips & Action Link */}
                <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-black/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-black/[0.03] border border-black/[0.06] text-[#424245] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/[0.02] text-[#86868B]">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Action Row */}
                  <div 
                    className="flex items-center justify-between pt-1" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#424245] hover:text-[#1D1D1F] bg-black/[0.03] hover:bg-black/[0.08] rounded-full transition-colors border border-black/[0.06]"
                          aria-label={`${project.title} Source Code on GitHub`}
                        >
                          <GithubIcon size={14} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#0071E3] hover:text-white bg-blue-50 hover:bg-[#0071E3] rounded-full transition-colors border border-blue-200/60"
                          aria-label={`${project.title} Live URL`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProject(project)}
                      className="text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] flex items-center gap-1 group/btn"
                    >
                      <span>Deep Dive</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Interactive Apple visionOS Deep-Dive Modal Drawer */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xl"
              aria-hidden="true"
            />

            {/* Modal Dialog Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.cinematic}
              className="relative w-full max-w-3xl bg-white/95 backdrop-blur-3xl border-t border-l border-white border-r border-b border-black/[0.08] rounded-[32px] shadow-[0_32px_72px_-16px_rgba(0,0,0,0.18)] p-6 sm:p-8 flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Modal Banner Image */}
              <div className="relative w-full aspect-[21/9] rounded-[24px] overflow-hidden bg-slate-100 border border-black/[0.06] shadow-sm">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Floating Dismiss Button */}
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-2.5 text-white bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full transition-colors border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Banner Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
                    <span>{activeProject.domain || activeProject.category}</span>
                    <span>•</span>
                    <span className="text-emerald-300 font-semibold">{activeProject.statusLabel}</span>
                  </div>
                  <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeProject.title}
                  </h3>
                </div>
              </div>

              {/* Subtitle & High-Level Description */}
              <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-[#0071E3]">
                  {activeProject.subtitle}
                </div>
                <p className="text-sm sm:text-base text-[#424245] leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Live Metrics Grid */}
              {activeProject.metrics && activeProject.metrics.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#86868B] font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Empirical Metrics & SLA Benchmarks</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeProject.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] flex flex-col gap-1 shadow-sm"
                      >
                        <span className="text-[11px] font-mono text-[#86868B] uppercase tracking-wider">{metric.label}</span>
                        <span className="text-base sm:text-lg font-extrabold text-[#1D1D1F] font-mono text-[#0071E3]">{metric.value}</span>
                        {metric.description && (
                          <span className="text-[10px] text-[#424245] leading-tight mt-0.5">{metric.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mathematical System Invariants */}
              {activeProject.systemInvariants && activeProject.systemInvariants.length > 0 && (
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0071E3] uppercase tracking-wider font-mono">
                    <ShieldCheck size={16} />
                    <span>Mathematical System Invariants</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-[#1D1D1F] space-y-2 list-none">
                    {activeProject.systemInvariants.map((inv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#0071E3] shrink-0 mt-0.5" />
                        <span className="font-mono text-xs">{inv}</span>
                      </li>
                    ))}
                  </ul>
                  {activeProject.keyInvariantsRationale && (
                    <div className="mt-2 pt-3 border-t border-blue-200/60 text-xs text-[#424245] leading-relaxed flex items-start gap-2">
                      <Info size={14} className="text-[#0071E3] shrink-0 mt-0.5" />
                      <span>{activeProject.keyInvariantsRationale}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Architectural Decisions */}
              {activeProject.architectureDecisions && activeProject.architectureDecisions.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#86868B] font-bold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Architectural Strategy & Design Decisions</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeProject.architectureDecisions.map((dec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-black/[0.05] text-xs text-[#424245] flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0071E3] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          0{i + 1}
                        </span>
                        <span className="leading-relaxed">{dec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Engineering Highlights */}
              {activeProject.highlights && activeProject.highlights.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#86868B] font-bold">
                    Key Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProject.highlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#424245] p-2.5 rounded-xl bg-white border border-black/[0.06] shadow-sm"
                      >
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technology Stack Tags */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#86868B] font-bold">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 border border-black/[0.06] text-[#1D1D1F] font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-black/[0.08]">
                <div className="flex items-center gap-3">
                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-btn-secondary text-xs"
                    >
                      <GithubIcon size={16} />
                      <span>Inspect Repository</span>
                    </a>
                  )}
                  {activeProject.live && (
                    <a
                      href={activeProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-btn-primary text-xs"
                    >
                      <ExternalLink size={16} />
                      <span>Launch Live Platform</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
