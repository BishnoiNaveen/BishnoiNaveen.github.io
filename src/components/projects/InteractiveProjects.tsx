import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronRight, CheckCircle2, ShieldCheck, Terminal, Cpu, Radio, Database, Cloud, ZoomIn, Share2, Check } from 'lucide-react';
import { springPresets } from '../../lib/springs';
import ImageLightboxModal from '../ui/ImageLightboxModal';

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface Project {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  icon: typeof Radio;
  accentColor: string;
  description: string;
  highlights: string[];
  tags: string[];
  githubUrl: string;
  architectureUrl?: string;
  image: string;
  interactiveType: 'krone' | 'gams' | 'ultron' | 'aeonis';
}

const PROJECTS: Project[] = [
  {
    id: 'krone',
    title: 'KRONE Edge Telematics Engine',
    tagline: 'Agricultural IoT & Edge Telemetry Ingest',
    badge: 'Production · KRONE Fleet',
    icon: Radio,
    accentColor: '#0071E3',
    image: '/images/krone-telematics.jpg',
    description:
      'High-frequency IoT runtime deployed on heavy agricultural machinery. Ingests 50Hz ISO 11783 CAN-bus telemetry, buffering data locally via an offline write-ahead log (WAL) protocol to guarantee zero packet loss across remote farming fields.',
    highlights: [
      'Ingests 50Hz CAN-bus telemetry over J1939 protocols',
      'Guarantees 0% packet loss during 72-hour cellular blackouts',
      'Bi-directional MQTT synchronization to cloud timeseries database',
    ],
    tags: ['C++', 'Go', 'CAN-Bus', 'MQTT', 'Protobuf', 'Docker', 'InfluxDB'],
    githubUrl: 'https://github.com/BishnoiNaveen/krone-iot-telematics',
    architectureUrl: 'https://github.com/BishnoiNaveen',
    interactiveType: 'krone',
  },
  {
    id: 'gams',
    title: 'GAMS Storage Core',
    tagline: 'POSIX-Compliant Engine & Low-Level Storage',
    badge: 'Verified · 0-Byte Leak',
    icon: Database,
    accentColor: '#10B981',
    image: '/images/gas_agency_system.jpg',
    description:
      'High-assurance persistent storage engine written in C. Features atomic directory entry pointer swaps for crash consistency, deterministic heap memory allocations, and verified 0-byte leaks under automated Valgrind profiling.',
    highlights: [
      'Atomic directory inode swaps (zero partial write window)',
      'Deterministic memory allocator with zero heap fragmentation',
      'Crash recovery in < 2ms via binary WAL replay',
    ],
    tags: ['C', 'Linux / POSIX', 'Valgrind', 'CMake', 'System Calls', 'WAL'],
    githubUrl: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
    architectureUrl: 'https://github.com/BishnoiNaveen',
    interactiveType: 'gams',
  },
  {
    id: 'ultron',
    title: 'Ultron Automation Engine',
    tagline: 'Distributed Systems & Task Orchestration',
    badge: 'Distributed Swarm',
    icon: Cpu,
    accentColor: '#8020E8',
    image: '/images/ultron_framework.jpg',
    description:
      'Distributed workflow orchestration engine executing topological dependency graphs (DAG). Features sandboxed isolated worker processes, exponential backoff retries, and real-time telemetry streaming.',
    highlights: [
      'Kahn algorithm topological sort with cycle prevention',
      'Isolated Docker worker runtimes with resource quotas',
      'Persistent checkpointing & resumable state machines',
    ],
    tags: ['TypeScript', 'Node.js', 'Redis', 'RabbitMQ', 'Temporal', 'Docker'],
    githubUrl: 'https://github.com/BishnoiNaveen/Ultron',
    architectureUrl: 'https://github.com/BishnoiNaveen',
    interactiveType: 'ultron',
  },
  {
    id: 'aeonis',
    title: 'Aeonis Cloud Infrastructure',
    tagline: 'Cloud Platform & Site Reliability Engineering',
    badge: 'Multi-Region High Availability',
    icon: Cloud,
    accentColor: '#0284C7',
    image: '/images/aeonis_ops.jpg',
    description:
      'Multi-region cloud infrastructure management platform providing automated failover orchestration, continuous health probes, and real-time observability telemetry.',
    highlights: [
      'Multi-region automated failover under 500ms threshold',
      'Infrastructure as Code using Terraform & Kubernetes operators',
      'End-to-end distributed tracing with Prometheus & Grafana',
    ],
    tags: ['Rust', 'Kubernetes', 'Terraform', 'gRPC', 'Prometheus', 'AWS'],
    githubUrl: 'https://github.com/BishnoiNaveen/AEONIS-OPS',
    architectureUrl: 'https://github.com/BishnoiNaveen',
    interactiveType: 'aeonis',
  },
];

export default function InteractiveProjects() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageAlt: string;
    title: string;
    subtitle: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageAlt: '',
    title: '',
    subtitle: '',
  });
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedProjectId(id);
    setTimeout(() => setCopiedProjectId(null), 1500);
  };

  return (
    <div className="space-y-8">
      {/* 2x2 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {PROJECTS.map((project) => {
          const Icon = project.icon;
          const isExpanded = expandedProject === project.id;

          return (
            <motion.article
              key={project.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-[#0c101d]/85 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-[var(--color-accent)]/30 dark:hover:border-[var(--color-accent)]/40 transition-all duration-300"
            >
              {/* Subtle Card Ambient Glow on Hover */}
              <div
                aria-hidden="true"
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${project.accentColor}25 0%, transparent 70%)`,
                }}
              />

              {/* Card Visual Media Banner with Lightbox Trigger */}
              <div
                onClick={() =>
                  setLightboxData({
                    isOpen: true,
                    imageUrl: project.image,
                    imageAlt: project.title,
                    title: project.title,
                    subtitle: project.tagline,
                  })
                }
                title="Click to zoom architecture visual"
                className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-5 bg-slate-900 border border-black/[0.06] dark:border-white/10 shadow-inner cursor-zoom-in group/img"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover Zoom Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[1px]">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom Diagram</span>
                  </span>
                </div>

                {/* Floating Top Domain Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-medium select-none">
                  <Icon className="w-3.5 h-3.5" style={{ color: project.accentColor }} />
                  <span>{project.tagline}</span>
                </div>

                {/* Floating Top Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-medium select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{project.badge}</span>
                </div>
              </div>

              {/* Card Header & Content */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-3">
                  {project.title}
                </h3>

                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-normal">
                  {project.description}
                </p>

                {/* Key Architectural Highlights */}
                <div className="space-y-2 mb-6">
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Tech Stack & Action Links */}
              <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-4">
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/8 text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>

                    {project.architectureUrl && (
                      <a
                        href={project.architectureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
                      >
                        <span>Architecture</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* 1-Click Share Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(project.id, e)}
                      title="Copy deep link anchor to clipboard"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    >
                      {copiedProjectId === project.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 text-[11px] font-mono font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span className="text-[11px] font-mono">Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Full-Screen Image Lightbox */}
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={lightboxData.imageUrl}
        imageAlt={lightboxData.imageAlt}
        title={lightboxData.title}
        subtitle={lightboxData.subtitle}
      />
    </div>
  );
}
