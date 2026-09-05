import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { springPresets } from '../../lib/springs';
import MagneticButton from '../ui/MagneticButton';
import GamsMemoryVisualizer from './visualizers/GamsMemoryVisualizer';
import KroneTelemetryVisualizer from './visualizers/KroneTelemetryVisualizer';
import AeonisConsensusVisualizer from './visualizers/AeonisConsensusVisualizer';
import UltronDagVisualizer from './visualizers/UltronDagVisualizer';
import SentinelAstDiffVisualizer from './visualizers/SentinelAstDiffVisualizer';
import PortfolioExplodedVisualizer from './visualizers/PortfolioExplodedVisualizer';

interface ProjectEditorialRowProps {
  project: Project;
  index: number;
  onOpenCaseStudy: (project: Project) => void;
}

export default function ProjectEditorialRow({
  project,
  index,
  onOpenCaseStudy,
}: ProjectEditorialRowProps) {
  const isEven = index % 2 === 0;
  const projectNumber = String(index + 1).padStart(2, '0');

  // Select bespoke art-directed visualizer based on project id
  const renderVisualizer = () => {
    switch (project.id) {
      case 'gams':
        return <GamsMemoryVisualizer />;
      case 'krone-iot':
        return <KroneTelemetryVisualizer />;
      case 'aeonis-ops':
        return <AeonisConsensusVisualizer />;
      case 'ultron':
        return <UltronDagVisualizer />;
      case 'sentinel-ai':
        return <SentinelAstDiffVisualizer />;
      case 'portfolio':
        return <PortfolioExplodedVisualizer />;
      default:
        return null;
    }
  };

  return (
    <article
      id={`project-${project.id}`}
      aria-label={`${project.title} Case Study`}
      className="w-full py-16 md:py-24 lg:py-32 border-b border-[var(--color-border-subtle)] last:border-b-0"
    >
      <div className="max-w-[96rem] mx-auto w-full">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
            isEven ? '' : 'lg:grid-flow-dense'
          }`}
        >
          {/* Text & Narrative Editorial Column */}
          <div
            className={`lg:col-span-5 flex flex-col items-start ${
              isEven ? 'lg:order-1' : 'lg:col-start-8 lg:order-2'
            }`}
          >
            {/* Project Chapter Badge & Number */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-black/15 dark:text-white/15 font-mono tracking-tighter">
                {projectNumber}
              </span>
              <div className="h-px w-8 bg-[var(--color-border)]"></div>
              <span className="type-badge-label px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[11px] font-semibold tracking-[0.08em] uppercase">
                {project.domain || project.category}
              </span>
            </div>

            {/* Headline & Subtitle */}
            <h3 className="type-title-project text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)] mb-3 leading-[1.1]">
              {project.title}
            </h3>
            <div className="text-sm sm:text-base font-mono font-medium text-[var(--color-accent)] mb-6">
              {project.subtitle}
            </div>

            {/* Editorial Description */}
            <p className="type-body-editorial text-base sm:text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Invariants & Highlights List */}
            {project.systemInvariants && project.systemInvariants.length > 0 && (
              <div className="w-full mb-8 p-4 sm:p-5 rounded-2xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-sm)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>System Invariants &amp; Guarantees</span>
                </div>
                <ul className="space-y-2">
                  {project.systemInvariants.slice(0, 3).map((inv, i) => (
                    <li key={i} className="text-xs sm:text-sm text-[var(--color-text-primary)] flex items-start gap-2 font-mono">
                      <span className="text-[var(--color-accent)] font-bold shrink-0 mt-0.5">↳</span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/5 dark:bg-white/10 text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Metrics Chips / Stats */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-8">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-2.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/40 flex flex-col"
                  >
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] truncate">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[var(--color-text-primary)]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Magnetic Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton
                onClick={() => onOpenCaseStudy(project)}
                variant="primary"
                size="md"
                ariaLabel={`Inspect Architecture & Case Study for ${project.title}`}
              >
                <span>Inspect Architecture &amp; Case Study</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </MagneticButton>

              {project.github && (
                <MagneticButton
                  href={project.github}
                  target="_blank"
                  variant="glass"
                  size="md"
                  ariaLabel={`View GitHub Repository for ${project.title}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Code</span>
                </MagneticButton>
              )}

              {project.live && (
                <MagneticButton
                  href={project.live}
                  target={project.live.startsWith('http') ? '_blank' : '_self'}
                  variant="ghost"
                  size="md"
                  ariaLabel={`Live View for ${project.title}`}
                >
                  <span>{project.live.startsWith('http') ? 'Live Demo' : 'Report'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </MagneticButton>
              )}
            </div>
          </div>

          {/* Visualizer Art-Direction Canvas Column */}
          <div
            className={`lg:col-span-7 w-full ${
              isEven ? 'lg:order-2' : 'lg:col-start-1 lg:order-1'
            }`}
          >
            {renderVisualizer()}
          </div>
        </div>
      </div>
    </article>
  );
}
