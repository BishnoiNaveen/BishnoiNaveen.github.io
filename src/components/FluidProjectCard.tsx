import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import type { Project, ProjectStatus } from '../types/project';
import { 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FlaskConical
} from 'lucide-react';
import { GithubIcon } from './icons';

interface FluidProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const STATUS_BADGES: Record<ProjectStatus, { bg: string; text: string; label: string; icon: React.ComponentType<{ size?: number }> }> = {
  live: {
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-300',
    label: 'Live',
    icon: CheckCircle2,
  },
  beta: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-300',
    label: 'Beta',
    icon: Sparkles,
  },
  planning: {
    bg: 'bg-violet-500/10 border-violet-500/30',
    text: 'text-violet-300',
    label: 'Architecture',
    icon: FlaskConical,
  },
  completed: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-300',
    label: 'Completed',
    icon: CheckCircle2,
  },
};

export const FluidProjectCard: React.FC<FluidProjectCardProps> = ({ project, onSelect }) => {
  const shouldReduceMotion = useReducedMotion();
  const statusConfig = STATUS_BADGES[project.status] || STATUS_BADGES.completed;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      transition={shouldReduceMotion ? { duration: 0 } : springPresets.morph}
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
      className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 hover:border-violet-500/40 p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-950/30 backdrop-blur-xl flex flex-col justify-between gap-5 transition-colors cursor-pointer text-left overflow-hidden"
      onClick={() => onSelect(project)}
    >
      {/* Top Banner & Status */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400 font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            {project.category}
          </span>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusConfig.bg} ${statusConfig.text}`}>
            <StatusIcon size={12} />
            <span>{project.statusLabel || statusConfig.label}</span>
          </div>
        </div>

        {/* Project Title & Subtitle */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Architectural Layer invariant pill if present */}
        {project.architecturalLayer && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-black/40 p-2 rounded-lg border border-white/5">
            <Layers className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="truncate">{project.architecturalLayer}</span>
          </div>
        )}
      </div>

      {/* Highlights Preview */}
      {project.highlights && project.highlights.length > 0 && (
        <ul className="text-xs text-gray-400 space-y-1 my-1 border-t border-white/5 pt-3 list-none">
          {project.highlights.slice(0, 2).map((hl, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
              <span className="truncate">{hl}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer Tech Stack Chips & Action Links */}
      <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-gray-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 text-gray-500">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* External Links */}
        <div className="flex items-center justify-between text-xs pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {project.github !== null && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                aria-label={`${project.title} GitHub Repository`}
              >
                <GithubIcon size={14} />
              </a>
            )}
            {project.live !== null && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-emerald-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                aria-label={`${project.title} Live URL`}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <span className="text-[11px] font-semibold text-violet-400 group-hover:text-violet-300">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FluidProjectCard;
