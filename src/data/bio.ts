/**
 * src/data/bio.ts — Master Biographical & Career Narrative Dataset
 * Author: Naveen Bishnoi
 * Standard: Radical Honesty, 3-Tier Career Delineation, Systems Craftsmanship
 */

export interface TimelineEntry {
  id: string;
  tier: 1 | 2 | 3;
  tierLabel: 'Corporate Engineering' | 'Academic Foundation' | 'Open-Source Systems Leadership';
  title: string;
  organization: string;
  location: string;
  period: string;
  badge: string;
  summary: string;
  responsibilities: string[];
  keyInvariants: string[];
  technologies: string[];
  verifiedProof?: {
    label: string;
    url?: string;
  };
}

export interface PhilosophyPrinciple {
  number: string;
  title: string;
  subtitle: string;
  lead: string;
  description: string;
  invariant: string;
}

export interface BioData {
  name: string;
  headline: string;
  subtitle: string;
  location: string;
  timezone: string;
  email: string;
  github: string;
  linkedin: string;
  leadQuote: string;
  narrativeSections: {
    id: string;
    title: string;
    paragraphs: string[];
  }[];
  principles: PhilosophyPrinciple[];
  timeline: TimelineEntry[];
}

export const bioData: BioData = {
  name: 'Naveen Bishnoi',
  headline: 'Software Architect & AI Systems Engineer',
  subtitle: 'Building high-assurance distributed systems, low-level POSIX invariants, and autonomous multi-agent orchestration engines.',
  location: 'India',
  timezone: 'IST (UTC+5:30)',
  email: '0029bishnoinaveen@gmail.com',
  github: 'https://github.com/BishnoiNaveen',
  linkedin: 'https://linkedin.com/in/naveen-bishnoi',
  leadQuote: 'From bare-metal POSIX C memory allocations to distributed autonomous agent swarms: software built with mathematical invariants and physical depth.',
  
  narrativeSections: [
    {
      id: 'origin-systems',
      title: '01. The Foundation of Invariants',
      paragraphs: [
        'My journey into software engineering did not start with high-level web frameworks or cloud abstractions; it began in the uncompromising discipline of low-level C memory registers and POSIX operating system internals. When working with raw memory pointers, atomic inode swaps, and hardware interrupts, there is no garbage collector or runtime safety net to mask conceptual flaws.',
        'This formative experience established my permanent engineering philosophy: software must be constructed on mathematical invariants rather than hopeful assertions. Whether architecting a 50Hz CAN bus telematics ingest pipeline at KRONE or designing a topological DAG scheduler for autonomous AI agents, I treat state transitions, memory boundaries, and failover pathways with absolute physical determinism.'
      ]
    },
    {
      id: 'krone-edge',
      title: '02. Industrial Edge & Telematics at KRONE',
      paragraphs: [
        'At KRONE Agriculture India, I engineer real-time telematics and edge computing architectures operating in harsh agricultural environments. Agricultural machinery cannot afford data loss when operating across intermittent cellular connectivity in rural farmlands.',
        'To solve this, I designed offline-first SQLite ring buffers capable of retaining up to 72 hours of high-frequency (50Hz) CAN bus sensor packets without buffer overflows, paired with an atomic cellular burst synchronization engine that guarantees zero packet loss and strict ordering on reconnect.'
      ]
    },
    {
      id: 'agentic-autonomy',
      title: '03. Autonomous AI & Cognitive Orchestration',
      paragraphs: [
        'Modern AI engineering is suffering from a fragility crisis: monolithic prompts, unbounded looping heuristics, and non-deterministic side effects. To address this, I design multi-agent architectures that operate as formal state machines.',
        'In open-source systems like AEONIS OPS and Ultron Framework, autonomous agents do not execute arbitrary commands. They operate across Byzantine Fault Tolerant (BFT) consensus quorums, evaluate code modifications through Abstract Syntax Tree (AST) forward/backward taint analysis, and resolve task dependencies through cycle-free topological graphs.'
      ]
    },
    {
      id: 'craftsmanship',
      title: '04. The Standard of Software Craftsmanship',
      paragraphs: [
        'True craftsmanship means caring about every layer of the computing stack — from sub-16ms layout rendering and WCAG AAA color contrast in the browser, to 0-byte memory leaks in Valgrind and zero-downtime canary rollbacks in Kubernetes.',
        'I build software for longevity, resilience, and clarity. Code is an asset only when its invariants are verified, its error modes are bounded, and its architecture can be explained from first principles.'
      ]
    }
  ],

  principles: [
    {
      number: '01',
      title: 'Invariants Over Assertions',
      subtitle: 'Mathematical State Guarantees',
      lead: 'Define physical invariants that make invalid states unrepresentable.',
      description: 'Dynamic assertions check for bugs after they happen. Strict state machines, algebraic types, and atomic operations prevent corrupt state from ever being instantiated in memory or on disk.',
      invariant: '∀ s ∈ States : Valid(s) ∧ (s → s′ ⟹ Valid(s′))'
    },
    {
      number: '02',
      title: 'Zero Dynamic Leaks',
      subtitle: 'Deterministic Resource Reclamation',
      lead: 'Every allocated resource must have a deterministic lifecycle and bounded scope.',
      description: 'From heap memory in C (proven with 0-byte Valgrind clean exits) to file descriptors, database connections, and event listeners in TypeScript, resource acquisition is always paired with unconditional cleanup.',
      invariant: 'Alloc(R) ⟹ ∃! Free(R) within bounded lifetime T'
    },
    {
      number: '03',
      title: 'Deterministic Automation',
      subtitle: 'Multi-Agent Consensus & Reversible Actions',
      lead: 'AI autonomy must be bounded by cryptographic consensus and formal verification.',
      description: 'Autonomous multi-agent swarms must never execute blind mutating actions. Every deployment, code patch, or infrastructure mutation requires BFT quorum consensus, AST taint verification, and automated rollback triggers.',
      invariant: 'Quorum(3f+1) ∧ AST_Clean(Patch) ⟹ Safe_Deploy(Target)'
    }
  ],

  timeline: [
    {
      id: 'krone-telematics',
      tier: 1,
      tierLabel: 'Corporate Engineering',
      title: 'Software Engineer — IoT & Edge Telematics',
      organization: 'KRONE Agriculture India',
      location: 'India',
      period: '2023 — Present',
      badge: 'Corporate Engineering',
      summary: 'Engineering edge telematics, high-throughput SocketCAN data pipelines, and distributed diagnostic services for smart agricultural fleet machinery.',
      responsibilities: [
        'Architected 50Hz Linux SocketCAN edge ingest service processing real-time telemetry packets from machine ECUs.',
        'Engineered 72-hour offline SQLite ring buffer with atomic burst sync over cellular LTE/4G networks.',
        'Built real-time diagnostic dashboard and predictive maintenance alerting system for fleet operators.'
      ],
      keyInvariants: [
        '50Hz CAN Bus Telematics Ingest',
        '72h Offline SQLite Circular Ring Buffer',
        'Zero Packet Loss During LTE Network Drops'
      ],
      technologies: ['C/C++', 'Python', 'Linux SocketCAN', 'SQLite', 'Docker', 'IoT Edge', 'MQTT'],
      verifiedProof: {
        label: 'Corporate Employment (KRONE Agriculture India)'
      }
    },
    {
      id: 'bca-degree',
      tier: 2,
      tierLabel: 'Academic Foundation',
      title: 'Bachelor of Computer Applications (BCA)',
      organization: 'Academic Computer Science Graduate',
      location: 'India',
      period: 'Graduated',
      badge: 'Academic Foundation',
      summary: 'Rigorous foundation in computer systems, operating systems, data structures, algorithms, relational database theory, and low-level software architecture.',
      responsibilities: [
        'Mastered core systems fundamentals: memory segmentation, process scheduling, POSIX system calls, and computer architecture.',
        'Constructed custom relational database parsers, B-tree indexing prototypes, and memory allocators.',
        'Graduated with honors in Computer Applications and Software Engineering.'
      ],
      keyInvariants: [
        'Core Operating Systems & Memory Management',
        'Advanced Data Structures & Graph Algorithms',
        'Relational Database Invariants & SQL Schema Design'
      ],
      technologies: ['C', 'C++', 'Java', 'Operating Systems', 'Data Structures', 'SQL', 'Unix/Linux'],
      verifiedProof: {
        label: 'BCA Degree in Computer Applications'
      }
    },
    {
      id: 'opensource-systems',
      tier: 3,
      tierLabel: 'Open-Source Systems Leadership',
      title: 'Systems Lead & Principal Open-Source Architect',
      organization: 'Open-Source Systems Projects (GAMS, AEONIS, Ultron, Sentinel)',
      location: 'Distributed',
      period: '2023 — Present',
      badge: 'Open-Source Systems Leadership',
      summary: 'Architected and open-sourced four high-assurance systems projects spanning POSIX atomic storage, multi-agent consensus quorums, topological DAG engines, and AST taint security analyzers.',
      responsibilities: [
        'GAMS: Engineered POSIX C storage engine using atomic rename() inode swapping with Valgrind 0-byte memory leak verification.',
        'AEONIS OPS: Implemented Byzantine Fault Tolerant (BFT) 4-agent consensus engine and AST taint sentry for autonomous CI/CD.',
        'Ultron Framework: Built dynamic topological DAG scheduler with Kahn cycle detection and 3-tier vector memory architecture.',
        'Sentinel AI: Synthesized AST static taint security analyzer generating verified surgical code diffs for SAIF compliance.'
      ],
      keyInvariants: [
        'POSIX rename() Atomic Inode File Swapping',
        'Kahn Algorithm O(V+E) Cycle Detection in Agent DAGs',
        'Byzantine Fault Tolerant Quorum Sign-Off (3f+1)'
      ],
      technologies: ['Rust', 'C', 'TypeScript', 'LangGraph', 'Astro 7', 'React 19', 'Kafka', 'Qdrant'],
      verifiedProof: {
        label: 'GitHub Public Code Repositories',
        url: 'https://github.com/BishnoiNaveen'
      }
    }
  ]
};
