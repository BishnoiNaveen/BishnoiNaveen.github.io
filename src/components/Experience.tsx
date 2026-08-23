import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  Briefcase, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Calendar, 
  Building2, 
  Zap, 
  Code2, 
  Cloud, 
  Database, 
  Activity, 
  ArrowRight,
  Target,
  Sliders,
  Scale
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  role: string;
  organization: string;
  tag: string;
  tagType: 'production' | 'architecture' | 'ai' | 'milestone';
  description: string;
  invariants: string[];
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2024 - Present',
    role: 'AI Automation Engineer & Systems Architect',
    organization: 'KRONE Agriculture India Pvt Ltd',
    tag: 'Production Edge IoT',
    tagType: 'production',
    description: 'Architected edge-to-cloud agricultural telematics, 50Hz ISOBUS/CAN ingestion, and real-time ONNX vibration anomaly detection. Engineered 72-hour offline store-and-forward sync protocol over cellular MQTT.',
    invariants: ['<25ms Edge Anomaly SLA', 'Zero-Loss 72hr Ring Buffer', 'Delaunay Yield Triangulation']
  },
  {
    year: '2024 - 2025',
    role: 'Autonomous Operations Architect',
    organization: 'AEONIS OPS Pipeline',
    tag: 'Multi-Agent Security',
    tagType: 'architecture',
    description: 'Designed hierarchical multi-agent CI/CD platform with AST taint tracking, automated mutation testing, and Byzantine-fault-tolerant quorum gates preventing vulnerable commits.',
    invariants: ['Zero False-Negative AST Taint', '4/4 Byzantine Consensus Gate', 'Automated Istio Rollback']
  },
  {
    year: '2025',
    role: 'Framework Designer & Agentic Engineer',
    organization: 'Ultron Multi-Agent Engine',
    tag: 'Agentic DAG Runtime',
    tagType: 'ai',
    description: 'Engineered directed acyclic graph (DAG) task scheduler with topological cycle detection, 3-tier memory (Context, Qdrant vectors, RDF graphs), and isolated Docker sandboxes.',
    invariants: ['Acyclic DAG Topological Sort', '100% Sandbox Container Isolation', 'Reflexion Loop Self-Repair']
  },
  {
    year: '2024 - 2025',
    role: 'Systems Programmer & FSM Architect',
    organization: 'Gas Agency Management System (GAMS)',
    tag: 'Transactional C Core',
    tagType: 'milestone',
    description: 'Architected bare-metal inventory state machine in C featuring double-entry balance verification, atomic POSIX temp-file inode renaming, and 0 byte memory leakage verified via Valgrind.',
    invariants: ['Double-Entry Balance Verification', 'Atomic Inode Renaming (POSIX)', '0 Byte Dynamic Memory Leak']
  }
];

interface Philosophy {
  id: string;
  number: string;
  title: string;
  headline: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  keyTakeaway: string;
}

const PHILOSOPHIES: Philosophy[] = [
  {
    id: 'architecture-first',
    number: '01',
    title: 'Architecture First',
    headline: 'System Design Precedes Implementation',
    description: 'Every project begins with explicit domain boundary mapping, schema invariants, and API contracts. Code is written only after state transitions and failure modes are mathematically verified.',
    icon: Layers,
    color: '#0071E3',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#0071E3]',
    badgeBorder: 'border-blue-200',
    keyTakeaway: 'Modular boundaries & zero contract drift',
  },
  {
    id: 'radical-honesty',
    number: '02',
    title: 'Radical Honesty',
    headline: 'Transparent Lifecycle States & Zero Mocks',
    description: 'Project stages (Live, Beta, Architecture, Planning) are labeled with uncompromising transparency. Zero fabricated metrics, zero synthetic benchmarks — only genuine engineering and real data.',
    icon: ShieldCheck,
    color: '#34C759',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    keyTakeaway: 'Genuine metrics & verifiable deliverables',
  },
  {
    id: 'ai-augmented',
    number: '03',
    title: 'AI-Augmented Developer',
    headline: 'Force Multiplier with Intentional Verification',
    description: 'AI agents are leveraged as force multipliers for rapid exploration and boilerplate elimination. Every single line of synthesized code is rigorously reviewed, tested, and grounded in domain intent.',
    icon: Zap,
    color: '#AF52DE',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    keyTakeaway: '10x leverage with 100% human accountability',
  },
];

interface CompetencySkill {
  name: string;
  fluency: number; // 0-100
  level: string;
  context: string;
  description: string;
  techs: string[];
}

interface CompetencyDomain {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  headline: string;
  skills: CompetencySkill[];
}

const COMPETENCY_DOMAINS: CompetencyDomain[] = [
  {
    id: 'agentic-ai',
    name: 'Agentic & AI Swarms',
    icon: Sparkles,
    headline: 'Autonomous Multi-Agent Coordination, AST Code Auditing & LLM Router Engines',
    skills: [
      {
        name: 'Multi-Agent Swarm Orchestration',
        fluency: 96,
        level: 'Expert / Production',
        context: 'Hermes Coordination Runtime',
        description: 'Hierarchical task DAG decomposition, Byzantine fault tolerant quorum consensus, and dynamic tool execution routing.',
        techs: ['Hermes Runtime', 'LangChain', 'Ultron DAG', 'Byzantine Quorum']
      },
      {
        name: 'AST Security & Vulnerability Auditing',
        fluency: 92,
        level: 'Advanced',
        context: 'Sentinel Sentry Engine',
        description: 'Abstract Syntax Tree taint tracking, SQL/command injection verification, and automated pull request patch synthesis.',
        techs: ['Sentinel AI', 'Babel AST', 'Tree-sitter', 'OWASP Top 10']
      },
      {
        name: 'Vector Recall & 3-Tier Memory',
        fluency: 94,
        level: 'Expert',
        context: 'Qdrant & Graph Store',
        description: 'Semantic vector recall (148k embeddings), Cosine similarity normalization, and RDF knowledge graph triple extraction.',
        techs: ['Qdrant', 'TimescaleDB', 'Semantic Triples', 'Embeddings']
      },
      {
        name: 'LLM Fine-Tuning & Quantization',
        fluency: 88,
        level: 'Advanced',
        context: 'Edge & Cloud Models',
        description: 'Unsloth FastLanguageModel acceleration, LoRA adapters, and GGUF 4-bit edge model deployment with sub-50ms latency.',
        techs: ['Unsloth', 'Llama-3', 'GGUF', 'LoRA / vLLM']
      }
    ]
  },
  {
    id: 'systems-iot',
    name: 'Systems & IoT Telematics',
    icon: Cpu,
    headline: 'Low-Latency ISOBUS/CAN Ingestion, Embedded Rust, C/C++ Systems & ONNX Edge Inference',
    skills: [
      {
        name: 'Embedded Telematics & ISOBUS',
        fluency: 95,
        level: 'Expert / Edge Ag',
        context: 'KRONE Combine ECU',
        description: '50Hz SocketCAN frame parsing, J1939 PGN/SPN decoding, and RTK GPS spatial integration for precision agriculture.',
        techs: ['SocketCAN', 'J1939', 'ISOBUS', 'C / C++']
      },
      {
        name: 'High-Performance Rust',
        fluency: 90,
        level: 'Advanced',
        context: 'Telemetry Runtimes',
        description: 'Zero-cost abstractions, memory safety, async concurrency with Tokio, and sub-millisecond data ring buffers.',
        techs: ['Rust', 'Tokio', 'SocketCAN-rs', 'Serde']
      },
      {
        name: 'Edge Anomaly ML Inference',
        fluency: 91,
        level: 'Advanced',
        context: 'Sub-25ms Real-Time',
        description: 'ONNX runtime deployment on vehicle ECUs for mechanical vibration FFT windowing and torque overload detection.',
        techs: ['ONNX Runtime', 'FFT Windowing', 'Edge Anomaly', 'Python']
      },
      {
        name: 'System Software Architecture',
        fluency: 93,
        level: 'Expert',
        context: 'Transactional Storage',
        description: 'Crash-tolerant storage, atomic temp-file inode renaming, and double-entry balance verification with zero leaks.',
        techs: ['GAMS C Engine', 'POSIX APIs', 'Linux Syscalls', 'File I/O']
      }
    ]
  },
  {
    id: 'cloud-data',
    name: 'Cloud & Data Engineering',
    icon: Cloud,
    headline: 'High-Throughput Streaming, Geospatial PostGIS, Kafka, and Resilient Storage',
    skills: [
      {
        name: 'Stream Processing & Event Pipelines',
        fluency: 94,
        level: 'Expert',
        context: '12.5k msg/s Fleetwide',
        description: 'Apache Kafka partitioning, MQTT/TLS ingestion gateways, and store-and-forward offline buffering.',
        techs: ['Apache Kafka', 'MQTT', 'TimescaleDB', 'Redis']
      },
      {
        name: 'Geospatial Analytics & Yield Mapping',
        fluency: 92,
        level: 'Advanced',
        context: 'Precision Ag Geospatial',
        description: 'PostGIS spatial indexing, Delaunay polygon triangulation, and ton/hectare mass balancing.',
        techs: ['PostGIS', 'GeoJSON', 'Spatial SQL', 'TimescaleDB']
      },
      {
        name: 'Data Warehousing & Cloud ELT',
        fluency: 89,
        level: 'Advanced',
        context: 'Modern Data Pipelines',
        description: 'Medallion lakehouse architecture (Bronze/Silver/Gold) with automated dbt/Dataform pipelines.',
        techs: ['BigQuery', 'Dataform', 'PostgreSQL', 'Docker']
      },
      {
        name: 'Offline-Resilient Cloud Sync',
        fluency: 95,
        level: 'Expert',
        context: '72hr Store-and-Forward',
        description: 'Atomic SQLite ring-buffer synchronization upon 4G/LTE cellular reconnect without message loss.',
        techs: ['SQLite Ring Buffer', 'Sync Protocol', 'Idempotency', 'gRPC']
      }
    ]
  },
  {
    id: 'languages-arch',
    name: 'Core Languages & Architecture',
    icon: Code2,
    headline: 'Apple-Grade WWDC Fluid UX, WCAG 2.2 AA Accessibility & Zero-Compromise Invariants',
    skills: [
      {
        name: 'Apple Fluid UI & Spring Physics',
        fluency: 98,
        level: 'Mastery / WWDC 2018',
        context: 'visionOS & iOS 18 Design',
        description: 'Physical spring presets (mass, stiffness, damping), direct gestural manipulation, and FLIP layouts.',
        techs: ['Framer Motion', 'React 19', 'Astro Islands', 'Tailwind CSS']
      },
      {
        name: 'Enterprise Security & Hardening',
        fluency: 93,
        level: 'Expert',
        context: 'SAIF & OWASP Compliance',
        description: 'Strict input sanitization, rate limiting, BFT consensus validation, and automated pull-request patching.',
        techs: ['Master Security', 'OWASP Top 10', 'SAIF Tier 3', 'AST Taint']
      },
      {
        name: 'Web Performance & Accessibility',
        fluency: 99,
        level: 'Mastery / 100/100',
        context: 'Lighthouse & WCAG AA',
        description: 'Zero-JS static HTML baseline, WCAG 2.2 AA semantic landmarks, and prefers-reduced-motion support.',
        techs: ['Astro', 'Lighthouse 100', 'WCAG 2.2 AA', 'Semantic HTML5']
      },
      {
        name: 'Clean Domain-Driven Architecture',
        fluency: 95,
        level: 'Expert',
        context: 'Distributed Systems',
        description: 'Hexagonal boundaries, strict separation of concerns, immutable state transitions, and contract testing.',
        techs: ['Hexagonal Arch', 'TDD / E2E', 'Contract Testing', 'TypeScript']
      }
    ]
  }
];

export const Experience: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeDomainId, setActiveDomainId] = useState<string>(COMPETENCY_DOMAINS[0].id);

  const activeDomain = COMPETENCY_DOMAINS.find((d) => d.id === activeDomainId) || COMPETENCY_DOMAINS[0];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 py-8 px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col gap-3 text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0071E3] text-xs font-semibold tracking-wider uppercase w-fit shadow-sm">
          <Compass className="w-3.5 h-3.5" />
          <span>Journey & Philosophy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.1]">
          Engineering Journey, <span className="apple-gradient-text">Philosophies & Competencies</span>
        </h2>
        <p className="text-base sm:text-lg text-[#424245] leading-relaxed">
          Built on first principles: system-level architectural thinking, radical honesty in engineering lifecycle stages, and verified AI augmentation.
        </p>
      </div>

      {/* Bento Grid Layer 1: 3 Core Engineering Philosophies (3-Column Apple Glass Cards) */}
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-2 text-xs font-mono text-[#86868B] uppercase tracking-wider font-bold">
          <Target className="w-3.5 h-3.5 text-[#0071E3]" />
          <span>3 Foundational Engineering Pillars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHILOSOPHIES.map((ph, idx) => {
            const Icon = ph.icon;
            return (
              <motion.div
                key={ph.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springPresets.buoyant, delay: idx * 0.08 }}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                className="group relative rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_-8px_rgba(0,113,227,0.10)] transition-all flex flex-col justify-between gap-6 overflow-hidden text-left"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Bar: Icon + Number */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${ph.color}15`, color: ph.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-black/10 group-hover:text-black/20 transition-colors">
                      {ph.number}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                      {ph.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#86868B] mt-0.5">
                      {ph.headline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#424245] leading-relaxed">
                    {ph.description}
                  </p>
                </div>

                {/* Key Takeaway Badge */}
                <div className={`px-3.5 py-2 rounded-xl border ${ph.badgeBg} ${ph.badgeText} ${ph.badgeBorder} text-xs font-mono font-medium flex items-center gap-2`}>
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span className="truncate">{ph.keyTakeaway}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Layer 2: Career Journey & Systems Evolution Timeline */}
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-2 text-xs font-mono text-[#86868B] uppercase tracking-wider font-bold">
          <Briefcase className="w-3.5 h-3.5 text-[#0071E3]" />
          <span>Career Journey & Systems Evolution Timeline</span>
        </div>

        <div className="rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {TIMELINE_EVENTS.map((event, idx) => (
              <motion.div
                key={event.organization}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springPresets.buoyant, delay: idx * 0.08 }}
                className="relative flex flex-col justify-between gap-4 p-5 rounded-2xl bg-white/80 border border-black/[0.05] shadow-sm hover:shadow-md transition-shadow text-left"
              >
                {/* Year & Tag Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                      {event.year}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/[0.04] text-[#424245]">
                      {event.tag}
                    </span>
                  </div>

                  <div className="mt-1">
                    <h4 className="text-base font-bold text-[#1D1D1F] leading-snug">
                      {event.organization}
                    </h4>
                    <p className="text-xs text-[#86868B] font-medium mt-0.5">
                      {event.role}
                    </p>
                  </div>

                  <p className="text-xs text-[#424245] leading-relaxed mt-1">
                    {event.description}
                  </p>
                </div>

                {/* Invariants Chips */}
                <div className="flex flex-col gap-1.5 pt-3 border-t border-black/[0.06]">
                  <span className="text-[10px] font-mono text-[#86868B] uppercase tracking-wider font-semibold">
                    Core Invariants:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {event.invariants.map((inv, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50/70 border border-blue-200/50 text-[#0071E3]"
                      >
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Layer 3: Interactive Technical Competencies Matrix Across 4 Domains */}
      <div className="flex flex-col gap-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#86868B] uppercase tracking-wider font-bold">
              <Code2 className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Interactive Technical Competencies Matrix</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
              16 Granular Proficiencies Across 4 Engineering Domains
            </h3>
          </div>

          {/* Domain Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none self-start sm:self-end">
            {COMPETENCY_DOMAINS.map((domain) => {
              const isSelected = activeDomainId === domain.id;
              const Icon = domain.icon;

              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                    isSelected ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <Icon size={15} className={isSelected ? 'text-[#0071E3]' : 'text-[#86868B]'} />
                    <span>{domain.name}</span>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="active-experience-domain"
                      className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04]"
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Domain Headline Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-xs sm:text-sm text-[#1D1D1F] font-mono flex items-center gap-2.5 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#0071E3] shrink-0" />
          <span className="font-semibold">{activeDomain.headline}</span>
        </div>

        {/* Competencies 4-Card Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springPresets.buoyant}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activeDomain.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springPresets.buoyant, delay: index * 0.05 }}
                className="p-6 sm:p-7 rounded-[28px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,113,227,0.08)] flex flex-col justify-between gap-5 transition-shadow text-left"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-[#1D1D1F]">
                      {skill.name}
                    </h4>
                    <span className="text-xs font-mono font-extrabold text-[#0071E3] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-sm">
                      {skill.fluency}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-emerald-700 font-semibold">{skill.level}</span>
                    <span className="text-[#86868B]">•</span>
                    <span className="text-[#86868B]">{skill.context}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#424245] leading-relaxed mt-1">
                    {skill.description}
                  </p>
                </div>

                {/* Animated Fluency Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-black/[0.05] h-2 rounded-full overflow-hidden p-0.5 border border-black/[0.03]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.fluency}%` }}
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.buoyant}
                      className="h-full bg-gradient-to-r from-[#0071E3] via-[#AF52DE] to-[#34C759] rounded-full shadow-[0_0_8px_rgba(0,113,227,0.4)]"
                    />
                  </div>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-black/[0.06]">
                  {skill.techs.map((tech) => (
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Experience;
