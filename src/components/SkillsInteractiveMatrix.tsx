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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-6 text-left">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0071E3] text-xs font-semibold tracking-wider uppercase w-fit shadow-sm">
          <Code2 size={14} />
          <span>Technical Arsenal Matrix</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
          Engineering Expertise & Competencies
        </h2>
        <p className="text-base text-[#424245] max-w-2xl">
          Deep technical proficiencies across distributed AI systems, embedded vehicle telematics, and Apple-grade fluid interfaces.
        </p>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none self-start">
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = activeCategoryId === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                isSelected ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <div className="flex items-center gap-2 relative z-10">
                <Icon size={15} className={isSelected ? 'text-[#0071E3]' : 'text-[#86868B]'} />
                <span>{cat.name}</span>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="active-skill-category-pill"
                  className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
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
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-xs sm:text-sm text-[#1D1D1F] font-mono flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#0071E3] shrink-0" />
            <span className="font-semibold">{activeCategory.headline}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCategory.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springPresets.buoyant, delay: index * 0.05 }}
                className="p-6 rounded-[28px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,113,227,0.08)] flex flex-col justify-between gap-4 transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                      {skill.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
                    {skill.experience}
                  </div>

                  <p className="text-xs sm:text-sm text-[#424245] mt-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Spring-Animated Proficiency Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-black/[0.05] h-2 rounded-full overflow-hidden p-0.5 border border-black/[0.03]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.buoyant}
                      className="h-full bg-gradient-to-r from-[#0071E3] via-[#AF52DE] to-[#34C759] rounded-full shadow-[0_0_8px_rgba(0,113,227,0.4)]"
                    />
                  </div>
                </div>

                {/* Technologies Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/[0.06]">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-black/[0.03] border border-black/[0.06] text-[#424245] font-medium"
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
