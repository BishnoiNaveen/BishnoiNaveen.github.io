import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Cloud, 
  Code2, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Database,
  Radio
} from 'lucide-react';

interface SkillItem {
  name: string;
  proficiency: number; // 0 to 100
  experience: string;
  description: string;
  technologies: string[];
}

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  headline: string;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-agents',
    name: 'AI & Autonomous Agents',
    icon: Sparkles,
    headline: 'Multi-Agent Swarm Orchestration, AST Code Auditing & LLM Router Engines',
    skills: [
      {
        name: 'Multi-Agent Swarm Orchestration',
        proficiency: 96,
        experience: 'Production Frameworks',
        description: 'Hierarchical task decomposition, Byzantine-fault-tolerant quorum consensus, and dynamic DAG scheduling.',
        technologies: ['Hermes Runtime', 'LangChain', 'Ultron Framework', 'Task Graphs'],
      },
      {
        name: 'AST Security & Vulnerability Auditing',
        proficiency: 92,
        experience: 'Automated CI/CD Gates',
        description: 'Abstract Syntax Tree taint tracking, SQL/command injection verification, and automated patch synthesis.',
        technologies: ['Sentinel AI', 'Babel AST', 'Tree-sitter', 'OWASP Top 10'],
      },
      {
        name: 'Vector Retrieval & 3-Tier Memory',
        proficiency: 94,
        experience: 'Enterprise Scale',
        description: 'Semantic vector recall, Cosine similarity metric normalization, and knowledge graph triple extraction.',
        technologies: ['Qdrant', 'TimescaleDB', 'Semantic Triples', 'Embeddings'],
      },
      {
        name: 'LLM Fine-Tuning & Quantization',
        proficiency: 88,
        experience: 'Edge & Cloud Models',
        description: 'Unsloth FastLanguageModel acceleration, LoRA adapters, and GGUF 4-bit edge model deployment.',
        technologies: ['Unsloth', 'Llama-3', 'GGUF', 'HuggingFace'],
      },
    ],
  },
  {
    id: 'systems-embedded',
    name: 'Systems & Embedded',
    icon: Cpu,
    headline: 'Low-Latency ISOBUS/CAN Ingestion, Embedded Rust, C/C++ Systems & ONNX Edge Inference',
    skills: [
      {
        name: 'Embedded Telematics & ISOBUS',
        proficiency: 95,
        experience: 'KRONE Edge Agriculture',
        description: '50Hz CAN-bus frame parsing, J1939 PGN/SPN decoding, and RTK GPS spatial integration.',
        technologies: ['SocketCAN', 'J1939', 'ISOBUS', 'C / C++'],
      },
      {
        name: 'High-Performance Rust',
        proficiency: 90,
        experience: 'Telemetry Runtimes',
        description: 'Zero-cost abstractions, memory safety, thread concurrency, and sub-millisecond data ring buffers.',
        technologies: ['Rust', 'Tokio', 'SocketCAN-rs', 'Serde'],
      },
      {
        name: 'Edge Anomaly ML Inference',
        proficiency: 91,
        experience: 'Sub-25ms Real-Time',
        description: 'ONNX runtime deployment on vehicle ECUs for mechanical vibration and torque overload detection.',
        technologies: ['ONNX Runtime', 'FFT Windowing', 'Edge Anomaly', 'Python'],
      },
      {
        name: 'System Software Architecture',
        proficiency: 93,
        experience: 'Transactional Storage',
        description: 'Crash-tolerant storage, atomic temp-file inode renaming, and double-entry balance verification.',
        technologies: ['GAMS C Engine', 'POSIX APIs', 'Linux Syscalls', 'File I/O'],
      },
    ],
  },
  {
    id: 'cloud-data',
    name: 'Cloud & Data Engineering',
    icon: Cloud,
    headline: 'High-Throughput Streaming, Geospatial PostGIS, Kafka, and Resilient Storage',
    skills: [
      {
        name: 'Stream Processing & Event Pipelines',
        proficiency: 94,
        experience: '12.5k msg/sec Fleetwide',
        description: 'Apache Kafka partitioning, MQTT/TLS ingestion gateways, and store-and-forward offline buffering.',
        technologies: ['Apache Kafka', 'MQTT', 'TimescaleDB', 'Redis'],
      },
      {
        name: 'Geospatial Analytics & Yield Mapping',
        proficiency: 92,
        experience: 'Precision Ag Geospatial',
        description: 'PostGIS spatial indexing, Delaunay polygon triangulation, and ton/hectare mass balancing.',
        technologies: ['PostGIS', 'GeoJSON', 'Spatial SQL', 'TimescaleDB'],
      },
      {
        name: 'Data Warehousing & Cloud ELT',
        proficiency: 89,
        experience: 'Modern Data Pipelines',
        description: 'Medallion lakehouse architecture (Bronze/Silver/Gold) with automated dbt/Dataform pipelines.',
        technologies: ['BigQuery', 'Dataform', 'PostgreSQL', 'Docker'],
      },
      {
        name: 'Offline-Resilient Cloud Sync',
        proficiency: 95,
        experience: '72hr Store-and-Forward',
        description: 'Atomic SQLite ring-buffer synchronization upon 4G/LTE cellular reconnect without message loss.',
        technologies: ['SQLite Ring Buffer', 'Sync Protocol', 'Idempotency', 'gRPC'],
      },
    ],
  },
  {
    id: 'architecture-security',
    name: 'Architecture & Security',
    icon: ShieldCheck,
    headline: 'Apple-Grade WWDC Fluid UX, WCAG 2.2 AA Accessibility & Zero-Compromise Invariants',
    skills: [
      {
        name: 'Apple Fluid UI & Spring Physics',
        proficiency: 98,
        experience: 'WWDC 2018 Standards',
        description: 'Physical spring presets (mass, stiffness, damping), direct gestural manipulation, and FLIP layouts.',
        technologies: ['Framer Motion', 'React 19', 'Astro Islands', 'Tailwind CSS'],
      },
      {
        name: 'Enterprise Security & Hardening',
        proficiency: 93,
        experience: 'SAIF & OWASP Compliance',
        description: 'Strict input sanitization, rate limiting, BFT consensus validation, and automated pull-request patching.',
        technologies: ['Master Security', 'OWASP Top 10', 'SAIF', 'AST Taint Tracking'],
      },
      {
        name: 'Web Performance & Accessibility',
        proficiency: 99,
        experience: 'Lighthouse 100/100',
        description: 'Zero-JS static HTML baseline, WCAG 2.2 AA semantic landmarks, and prefers-reduced-motion support.',
        technologies: ['Astro', 'Lighthouse 100', 'WCAG 2.2 AA', 'Semantic HTML5'],
      },
      {
        name: 'Clean Domain-Driven Architecture',
        proficiency: 95,
        experience: 'Distributed Systems',
        description: 'Hexagonal boundaries, strict separation of concerns, immutable state transitions, and testability.',
        technologies: ['Hexagonal Arch', 'TDD / E2E', 'Contract Testing', 'TypeScript'],
      },
    ],
  },
];

export const SkillsInteractiveMatrix: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(SKILL_CATEGORIES[0].id);

  const activeCategory = SKILL_CATEGORIES.find(c => c.id === activeCategoryId) || SKILL_CATEGORIES[0];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6 text-left">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
          <Code2 size={14} />
          <span>TECHNICAL MATRIX</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineering Expertise & Competencies
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Deep technical proficiencies across distributed AI systems, embedded vehicle telematics, and Apple-grade fluid interfaces.
        </p>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = activeCategoryId === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 relative z-10">
                <Icon size={16} className={isSelected ? 'text-violet-300' : 'text-gray-400'} />
                <span>{cat.name}</span>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="active-skill-category-pill"
                  className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-500/50 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={springPresets.buoyant}
          className="flex flex-col gap-6"
        >
          {/* Category Headline Banner */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-gray-300 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{activeCategory.headline}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCategory.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springPresets.buoyant, delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 hover:border-violet-500/30 shadow-xl backdrop-blur-xl flex flex-col justify-between gap-4 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {skill.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-400 mt-1">
                    {skill.experience}
                  </div>

                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Spring-Animated Proficiency Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.buoyant}
                      className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    />
                  </div>
                </div>

                {/* Technologies Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SkillsInteractiveMatrix;
