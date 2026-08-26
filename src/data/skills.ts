/**
 * src/data/skills.ts — Master Technical Competencies & Evidence Dataset
 * Standard: 4 Architectural Domains, Verifiable Codebase Evidence Tags, Strictly NO Percentage Bars
 */

export interface SkillItem {
  id: string;
  name: string;
  domainId: 'systems' | 'ai' | 'frontend' | 'infrastructure';
  level: string; // Architectural classification e.g. "Core Architecture", "Production Invariant", "Deep Systems"
  description: string;
  evidenceRepo: string;
  evidenceProof: string;
  repoUrl?: string;
  verifiedInvariants: string[];
  tags: string[];
}

export interface SkillDomain {
  id: 'systems' | 'ai' | 'frontend' | 'infrastructure';
  title: string;
  subtitle: string;
  lead: string;
  badge: string;
  skills: SkillItem[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: 'systems',
    title: 'Systems & Core Architecture',
    subtitle: 'Low-Level Invariants & Memory Determinism',
    lead: 'Architecting zero-overhead systems software, POSIX-compliant file persistence, and hardware-interfaced edge telematics.',
    badge: 'Domain 01 · Systems',
    skills: [
      {
        id: 'c-posix',
        name: 'C / POSIX Systems & Memory Safety',
        domainId: 'systems',
        level: 'Production Invariant',
        description: 'Low-level systems programming with explicit heap management, zero dynamic memory leaks, and atomic filesystem primitives.',
        evidenceRepo: 'gas-agency-management-system',
        evidenceProof: 'Atomic Inode Swap & 0-Byte Leak (Valgrind verified)',
        repoUrl: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
        verifiedInvariants: ['rename() Atomic Inode Swap', 'Valgrind 0-Byte Leak', 'O_SYNC File Guarantees'],
        tags: ['C99', 'POSIX.1-2008', 'Valgrind', 'Memory Safety', 'Linux']
      },
      {
        id: 'socketcan-edge',
        name: 'Linux SocketCAN & Edge Telematics',
        domainId: 'systems',
        level: 'Core Architecture',
        description: 'Industrial CAN bus protocol decoding, 50Hz raw frame filtering, and circular buffer persistence for agricultural IoT.',
        evidenceRepo: 'krone-telematics-edge',
        evidenceProof: '50Hz Raw SocketCAN Ingest with 72h SQLite Ring Buffer',
        verifiedInvariants: ['50Hz Continuous Ingest', 'Circular Inode Buffer', 'LTE Disconnect Resiliency'],
        tags: ['SocketCAN', 'IoT Edge', 'SQLite', 'C/C++', 'Industrial Telematics']
      },
      {
        id: 'rust-concurrency',
        name: 'Rust & Systems Invariants',
        domainId: 'systems',
        level: 'Deep Systems',
        description: 'Memory-safe concurrent pipelines, thread affinity, and deterministic resource lifecycles via affine type systems.',
        evidenceRepo: 'ultron-agent-engine',
        evidenceProof: 'Thread-Safe Lock-Free Task Queue & Rayon Scheduling',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['Send + Sync Thread Safety', 'Zero-Cost Abstractions', 'Compile-Time Lifetimes'],
        tags: ['Rust', 'Concurrency', 'Tokio', 'Lock-Free Queues', 'Systems']
      }
    ]
  },
  {
    id: 'ai',
    title: 'AI Automation & Agent Orchestration',
    subtitle: 'Autonomous Swarms, BFT Quorums & AST Sentry',
    lead: 'Constructing multi-agent consensus protocols, acyclic task decomposition engines, and static AST security analyzers.',
    badge: 'Domain 02 · AI Agents',
    skills: [
      {
        id: 'agent-dag',
        name: 'Dynamic Topological DAG Scheduling',
        domainId: 'ai',
        level: 'Production Invariant',
        description: 'Kahn algorithm cycle detection, dependency-ordered task dispatching, and dynamic sub-task decomposition for autonomous agents.',
        evidenceRepo: 'Ultron',
        evidenceProof: 'Topological Sort & Cycle Detection (O(V+E) Kahn engine)',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['O(V+E) Kahn Cycle Detection', 'Parallel Branch Dispatching', 'Dynamic Backtracking'],
        tags: ['LangGraph', 'Topological Sort', 'DAG', 'Agentic Workflows', 'Python']
      },
      {
        id: 'bft-quorum',
        name: 'Byzantine Fault Tolerant Multi-Agent Quorum',
        domainId: 'ai',
        level: 'Core Architecture',
        description: 'Cryptographic consensus verification across autonomous code-generation, security-auditing, and QA agents before production merges.',
        evidenceRepo: 'AEONIS-OPS',
        evidenceProof: 'Byzantine Fault Tolerant Quorum (3f+1 consensus gate)',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['3f+1 Byzantine Quorum', 'Ed25519 Sign-off', 'Canary Rollback Guard'],
        tags: ['Multi-Agent', 'BFT Consensus', 'Distributed Systems', 'LangChain']
      },
      {
        id: 'ast-taint',
        name: 'Abstract Syntax Tree (AST) Security Sentry',
        domainId: 'ai',
        level: 'Deep Systems',
        description: 'Static source-to-sink taint analysis, control-flow graph traversal, and automated surgical code patch synthesis.',
        evidenceRepo: 'Sentinel-AI',
        evidenceProof: 'Forward Taint Traversal Tree & Surgical AST Diff Synthesizer',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['Zero False-Negative Taint Paths', 'Surgical Patch Synthesis', 'SAIF Compliance'],
        tags: ['AST', 'Taint Analysis', 'Static Analysis', 'Security', 'TypeScript']
      },
      {
        id: 'vector-memory',
        name: '3-Tier Semantic & Vector Memory Architecture',
        domainId: 'ai',
        level: 'Core Architecture',
        description: 'HNSW vector indexing, short-term context buffers, and persistent episodic memory graphs for long-running agent swarms.',
        evidenceRepo: 'Ultron',
        evidenceProof: 'Qdrant HNSW Vector Memory with Sub-50ms Retrieval',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['HNSW Cosine Similarity', 'Sub-50ms Vector Retrieval', 'Episodic Graph Pruning'],
        tags: ['Qdrant', 'HNSW', 'Vector DB', 'Semantic Memory', 'Embeddings']
      }
    ]
  },
  {
    id: 'frontend',
    title: 'Full-Stack Craft & Architecture',
    subtitle: 'Astro 7 Islands & visionOS Spatial Materials',
    lead: 'Engineering zero-layout-shift web architectures, fluid harmonic spring physics, and high-contrast editorial typography.',
    badge: 'Domain 03 · Full-Stack',
    skills: [
      {
        id: 'astro-islands',
        name: 'Astro 7 Component Islands & Static Performance',
        domainId: 'frontend',
        level: 'Production Invariant',
        description: 'Zero-JS static HTML baseline with selective React 19 island hydration, achieving perfect 100/100 Lighthouse audits.',
        evidenceRepo: 'BishnoiNaveen.github.io',
        evidenceProof: '100/100 Lighthouse & Sub-16ms INP with 0.000 CLS',
        repoUrl: 'https://github.com/BishnoiNaveen/BishnoiNaveen.github.io',
        verifiedInvariants: ['CLS = 0.000', '100/100 Lighthouse', 'Sub-16ms Input Latency'],
        tags: ['Astro 7', 'React 19', 'TypeScript', 'Performance', 'Vite']
      },
      {
        id: 'visionos-physics',
        name: 'visionOS Spatial Materials & Harmonic Springs',
        domainId: 'frontend',
        level: 'Core Architecture',
        description: 'Mathematical harmonic oscillator physics (mass-spring-damper systems) with 5-level material depth hierarchy and WCAG AAA contrast.',
        evidenceRepo: 'BishnoiNaveen.github.io',
        evidenceProof: '7 WWDC Harmonic Spring Presets (zeta in [0.3, 1.6])',
        repoUrl: 'https://github.com/BishnoiNaveen/BishnoiNaveen.github.io',
        verifiedInvariants: ['Harmonic Damping Bounds', 'WCAG AAA 16:1 Contrast', 'Reduced-Motion Engine'],
        tags: ['Framer Motion 13', 'Spring Physics', 'visionOS Glass', 'Design Systems']
      },
      {
        id: 'typescript-architecture',
        name: 'Type-Safe Distributed Web Architecture',
        domainId: 'frontend',
        level: 'Deep Systems',
        description: 'End-to-end type invariants, discriminated unions, exhaustive switch checking, and strict schema validation.',
        evidenceRepo: 'BishnoiNaveen.github.io',
        evidenceProof: 'Strict Type-Safe Data Schemas & Zero Any Types',
        repoUrl: 'https://github.com/BishnoiNaveen/BishnoiNaveen.github.io',
        verifiedInvariants: ['Strict Null Checks', 'Exhaustive Union Matching', 'Zero Unsafe Casts'],
        tags: ['TypeScript 5', 'Zod', 'Discriminated Unions', 'Architecture']
      }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & Data Pipelines',
    subtitle: 'Distributed Streaming & GitOps Resiliency',
    lead: 'Operating event-driven stream processing, distributed time-series databases, and automated canary deployment gates.',
    badge: 'Domain 04 · Infrastructure',
    skills: [
      {
        id: 'kafka-streams',
        name: 'Apache Kafka & Distributed Event Streaming',
        domainId: 'infrastructure',
        level: 'Production Invariant',
        description: 'High-throughput event partitioning, exactly-once stream processing semantics, and durable consumer group coordination.',
        evidenceRepo: 'AEONIS-OPS',
        evidenceProof: 'Partitioned Multi-Broker Event Bus with Avro Schemas',
        verifiedInvariants: ['Exactly-Once Semantics', 'Consumer Rebalance Safety', 'Durable Retention'],
        tags: ['Apache Kafka', 'Event-Driven', 'Avro', 'Distributed Streaming']
      },
      {
        id: 'timescale-flink',
        name: 'TimescaleDB & Apache Flink Telematics Analytics',
        domainId: 'infrastructure',
        level: 'Core Architecture',
        description: 'Time-series hypertables, continuous aggregates, and sliding-window event stream processing for machine telemetry.',
        evidenceRepo: 'krone-telematics-edge',
        evidenceProof: 'Continuous Hypertables & Sliding-Window Rollups',
        verifiedInvariants: ['Hypertables Chunk Partitioning', 'Sliding-Window Aggregation', 'Sub-10ms Queries'],
        tags: ['TimescaleDB', 'PostgreSQL', 'Apache Flink', 'Time-Series']
      },
      {
        id: 'gitops-ci-cd',
        name: 'GitOps CI/CD & Automated Canary Sentry',
        domainId: 'infrastructure',
        level: 'Deep Systems',
        description: 'Declarative container orchestration, Docker multi-stage builds, Istio canary traffic splitting, and automated metric rollbacks.',
        evidenceRepo: 'AEONIS-OPS',
        evidenceProof: 'Istio Canary Traffic Splitter with Automated Rollback Sentry',
        repoUrl: 'https://github.com/BishnoiNaveen',
        verifiedInvariants: ['Zero-Downtime Rollout', 'Automated Metric Threshold Rollback', 'Hermetic Builds'],
        tags: ['Docker', 'Kubernetes', 'Istio', 'GitHub Actions', 'Prometheus']
      }
    ]
  }
];

export const allSkillsList: SkillItem[] = skillDomains.flatMap(d => d.skills);
