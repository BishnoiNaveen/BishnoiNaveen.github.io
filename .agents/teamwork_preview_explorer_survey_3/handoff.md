# Handoff Report: Workflows & Hermes Data Architecture and UI Specifications

**Agent**: `teamwork_preview_explorer_survey_3`  
**Role**: Workflows & Hermes Data Architect / Survey Explorer 3  
**Date**: 2026-08-23  
**Status**: COMPLETE (Hard Handoff)  
**Target Milestone**: Milestone 3 & Milestone 4 (Data Models & Interactive UI Components)

---

## 1. Observation

### 1.1 Existing Codebase & Context
Direct inspection of the repository revealed the following characteristics:
- **`package.json`**: Current dependencies are minimal (`"astro": "^7.1.6"`, `"gsap": "^3.12.7"`). The redesign plans to add React (`@astrojs/react`, `react`, `react-dom`), Tailwind CSS (`@tailwindcss/vite` or `@astrojs/tailwind`), Lucide icons (`lucide-react`), and Framer Motion (`framer-motion`).
- **`src/data/projects.ts`**: Contains 6 projects (`Gas Agency Management System`, `Smart Task System`, `Naveen Bishnoi Portfolio`, `AEONIS OPS`, `Ultron Framework`, `Sentinel AI Security`).
- **Naveen Bishnoi's Domain Profile**:
  - AI Automation Engineer & Software Architect at KRONE AGRICULTURE INDIA PVT LTD.
  - Core competencies in: Edge-to-cloud agricultural IoT/telematics, multi-agent orchestration (AEONIS OPS, Ultron), AI code security agents (Sentinel AI), distributed data pipelines, and systems-level C/Python/TypeScript engineering.
- **`ORIGINAL_REQUEST.md` Requirements R2**:
  > *"Create deep, detailed sections for the user's 'Workflows' and 'Hermes data'. Structure this data locally using MDX, JSON, or TS files, and render it seamlessly within the new fluid UI architecture."*

---

## 2. Logic Chain

1. **Problem Definition**: The portfolio needs to showcase Naveen's high-level architectural depth through tangible, deeply technical data rather than generic marketing bullet points. Workflows and Hermes Data are the two primary vehicles for demonstrating this expertise.
2. **Workflows Rationale**: Engineering workflows must span Naveen's 5 core domains:
   - **Agricultural IoT & Telematics**: Highlighting real-world enterprise edge processing at KRONE.
   - **Autonomous Multi-Agent CI/CD (AEONIS OPS)**: Demonstrating autonomous DevOps pipelines with self-healing and security scanning.
   - **Agentic Task Decomposition (Ultron Framework)**: Showing dynamic DAG planning, tool execution, and vector memory retrieval.
   - **Medallion Stream Lakehouse**: Highlighting big data streaming, schema validation, and real-time analytics.
   - **Enterprise State Machine (Gas Agency GAMS)**: Demonstrating transactional consistency, RBAC, and double-entry accounting.
3. **Hermes Data Rationale**: "Hermes" is Naveen's autonomous agent telemetry and coordination framework. To deliver an exceptional user experience, Hermes data must model:
   - Live Agent Telemetry (execution state, token burn, latency percentiles).
   - Task Dependency Graphs (DAG nodes, status, execution paths).
   - Hierarchical Memory Systems (Working context, Episodic vector recall with similarity %, Semantic Knowledge Graph).
   - Dynamic LLM Routing Logs (complexity heuristics, cost/latency arbitration, fallback chains).
   - Multi-Agent Consensus/Quorum protocols.
4. **Data Architecture Decision**:
   - Use **Astro Content Collections** (`src/content/workflows/`, `src/content/hermes/`) with strict **Zod schemas** for long-form case studies and MDX content.
   - Use **TypeScript Data Modules** (`src/data/workflows.ts`, `src/data/hermes-*.ts`) for typed runtime collections consumed by interactive React islands.
5. **Interactive UI Decision**:
   - Build React islands powered by **Framer Motion** with explicit Apple-style WWDC 2018 spring physics (`damping: 28, stiffness: 300, mass: 0.8`).
   - Implement interactive timeline scrubbers, animated SVG data flow lines, live filter controls, syntax-highlighted JSON/schema tree inspectors, and real-time simulated telemetry feeds.

---

## 3. Caveats & Design Considerations

1. **Bundle Size & Lighthouse Performance**:
   - Heavy 3D or graph libraries (e.g. Three.js or Cytoscape) should NOT be used for simple DAG graphs. Instead, use optimized SVG + Framer Motion spring layouts to ensure Lighthouse performance stays >= 90.
   - React components must be mounted using Astro's `client:visible` or `client:idle` directives so non-critical visualizers do not block initial First Contentful Paint (FCP).
2. **Data Consistency**:
   - The TypeScript interfaces in `src/types/` must strictly align with the Zod schemas in `src/content/config.ts`.
3. **Accessibility (WCAG 2.2 AA)**:
   - All interactive stepper buttons, filter chips, and JSON viewers must have full keyboard navigation (`Tab`, `Enter`, `Space`, `ArrowKeys`) and ARIA labels.
   - Respect `prefers-reduced-motion` across all Framer Motion springs by providing instant fallback states.

---

## 4. Conclusion & Complete Specifications

### 4.1 Directory Structure Specification

```text
src/
├── content/
│   ├── config.ts                         # Astro Content Collections Zod Schema Registry
│   ├── workflows/                        # MDX Case Studies
│   │   ├── agricultural-telematics.mdx
│   │   ├── aeonis-ops-cicd.mdx
│   │   ├── ultron-agentic-pipeline.mdx
│   │   ├── medallion-data-stream.mdx
│   │   └── gams-transaction-machine.mdx
│   └── hermes/                           # Hermes Architecture & Telemetry Specs
│       ├── hermes-core-spec.mdx
│       ├── multi-agent-protocol.mdx
│       └── memory-routing-engine.mdx
├── data/
│   ├── workflows.ts                      # 5 Comprehensive Workflow Objects
│   ├── hermes-telemetry.ts               # Agent Telemetry & Session Metrics
│   ├── hermes-task-graphs.ts             # DAG Task Graph Topologies & Nodes
│   ├── hermes-memory-dump.ts             # Working, Episodic Vector & Knowledge Graph Data
│   └── hermes-router-logs.ts             # Dynamic LLM Router Logs & Cost Analytics
├── types/
│   ├── workflow.ts                       # TypeScript Interfaces for Workflows & Steps
│   └── hermes.ts                         # TypeScript Interfaces for Hermes Framework
└── components/
    ├── workflows/
    │   ├── WorkflowSection.astro         # Astro container for Workflows section
    │   ├── WorkflowVisualizer.tsx        # React Island: Interactive DAG & Node Stepper
    │   ├── WorkflowCard.tsx              # React: Fluid expandable workflow preview card
    │   └── WorkflowStepDrawer.tsx        # React: Apple-style spring slide-over detail drawer
    └── hermes/
        ├── HermesSection.astro           # Astro container for Hermes Telemetry section
        ├── HermesTelemetryDashboard.tsx  # React Island: Live agent telemetry & metric gauges
        ├── HermesTaskGraphViewer.tsx     # React Island: Interactive SVG Task DAG
        ├── HermesMemoryInspector.tsx     # React Island: Multi-tier memory explorer
        ├── HermesRouterMatrix.tsx        # React Island: Dynamic LLM decision tree
        └── JsonGraphInspector.tsx        # React: Reusable fluid JSON tree & copy viewer
```

---

### 4.2 TypeScript Type Definitions

#### File: `src/types/workflow.ts`
```typescript
export type WorkflowCategory = 
  | 'Agricultural Automation'
  | 'DevOps & Multi-Agent'
  | 'Agentic Systems'
  | 'Data Engineering'
  | 'System Architecture';

export type ArchitectureType = 
  | 'Directed Acyclic Graph (DAG)'
  | 'Event-Driven Pipeline'
  | 'Finite State Machine'
  | 'Hierarchical Multi-Agent';

export type StepType = 
  | 'trigger' 
  | 'compute' 
  | 'agent' 
  | 'validation' 
  | 'storage' 
  | 'emission';

export type FailureStrategy = 
  | 'retry_with_backoff' 
  | 'circuit_break' 
  | 'fallback_subroutine' 
  | 'human_escalation';

export interface WorkflowIO {
  name: string;
  type: string;
  description: string;
  example?: string;
}

export interface FailurePolicy {
  strategy: FailureStrategy;
  maxRetries?: number;
  backoffFactor?: number;
  fallbackStepId?: string;
  alertChannel?: string;
}

export interface CodeSnippet {
  language: 'python' | 'typescript' | 'rust' | 'sql' | 'yaml';
  filename: string;
  code: string;
}

export interface StepTelemetry {
  p50DurationMs: number;
  p99DurationMs: number;
  avgMemoryMb: number;
  successRatePercent: number;
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  name: string;
  role: string;
  description: string;
  type: StepType;
  inputs: WorkflowIO[];
  outputs: WorkflowIO[];
  failurePolicy: FailurePolicy;
  codeSnippet?: CodeSnippet;
  telemetry: StepTelemetry;
  tags: string[];
}

export interface WorkflowMetric {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  description: string;
}

export interface Workflow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: WorkflowCategory;
  architectureType: ArchitectureType;
  summary: string;
  deepDive: string;
  throughput: string;
  latencySLA: string;
  reliabilityTarget: string;
  techStack: string[];
  metrics: WorkflowMetric[];
  steps: WorkflowStep[];
  relatedProjectIds: string[];
  featured: boolean;
}
```

#### File: `src/types/hermes.ts`
```typescript
export type AgentStatus = 
  | 'IDLE'
  | 'PLANNING'
  | 'EXECUTING_TOOL'
  | 'AWAITING_CONSENSUS'
  | 'REFLECTING'
  | 'TERMINATED'
  | 'ERROR';

export type TaskStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'FAILED';

export interface TokenMetrics {
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  tokensPerSec: number;
}

export interface LatencyBreakdown {
  ttftMs: number;               // Time to first token
  inferenceDurationMs: number;  // Model generation time
  toolExecutionMs: number;      // Sandbox tool invocation
  memoryRetrievalMs: number;    // Vector search latency
  totalLatencyMs: number;       // End-to-end turn time
}

export interface AgentTelemetryRecord {
  agentId: string;
  agentName: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  activeTurn: number;
  uptimeSeconds: number;
  tokenMetrics: TokenMetrics;
  latency: LatencyBreakdown;
  activeModel: string;
  activeTemperature: number;
  lastHeartbeat: string;
}

export interface HermesTaskNode {
  id: string;
  label: string;
  agentId: string;
  status: TaskStatus;
  dependencies: string[];
  durationMs: number;
  retryCount: number;
  payloadSummary: string;
}

export interface HermesTaskEdge {
  id: string;
  source: string;
  target: string;
  type: 'data_dependency' | 'control_flow' | 'conditional_branch';
}

export interface HermesTaskGraph {
  graphId: string;
  rootGoal: string;
  initiatedAt: string;
  completedAt?: string;
  totalNodes: number;
  completedNodes: number;
  nodes: HermesTaskNode[];
  edges: HermesTaskEdge[];
}

export interface WorkingMemoryEntry {
  key: string;
  value: string;
  tokens: number;
  updatedAt: string;
}

export interface VectorRecallResult {
  id: string;
  documentSnippet: string;
  similarityScore: number;       // 0.0 - 1.0 (cosine similarity)
  collection: string;
  embeddingModel: string;
  sourceSessionId: string;
  timestamp: string;
}

export interface KnowledgeEntity {
  id: string;
  label: string;
  type: 'System' | 'Service' | 'Rule' | 'Agent' | 'DataSchema';
}

export interface KnowledgeRelation {
  from: string;
  to: string;
  relation: string;
  weight: number;
}

export interface HermesMemorySystem {
  workingMemory: {
    activeContextTokens: number;
    maxContextTokens: number;
    entries: WorkingMemoryEntry[];
  };
  episodicMemory: {
    vectorStoreProvider: string;
    totalEmbeddings: number;
    dimension: number;
    recentRetrievals: VectorRecallResult[];
  };
  semanticKnowledgeGraph: {
    totalTriples: number;
    entities: KnowledgeEntity[];
    relations: KnowledgeRelation[];
  };
}

export interface RouterDecision {
  requestId: string;
  timestamp: string;
  promptClassification: {
    domain: string;
    complexity: 'Low' | 'Medium' | 'High' | 'Extreme';
    contextLengthTokens: number;
    requiresCodeExecution: boolean;
  };
  routingDecision: {
    selectedModel: string;
    provider: string;
    reasoning: string;
    estimatedCostUsd: number;
    targetLatencyMs: number;
  };
  fallbackChain: string[];
  executionResult: {
    actualDurationMs: number;
    actualCostUsd: number;
    qualityScore: number;
    fallbackTriggered: boolean;
  };
}

export interface QuorumVote {
  agentId: string;
  agentName: string;
  vote: 'APPROVE' | 'REJECT' | 'AMEND';
  confidence: number;
  critique: string;
}

export interface QuorumSession {
  sessionId: string;
  protocol: 'Byzantine_Fault_Tolerant_Voting' | 'Majority_Consensus' | 'Hierarchical_Judge';
  targetDecision: string;
  votes: QuorumVote[];
  consensusReached: boolean;
  finalDecision: string;
  coordinationOverheadMs: number;
}
```

---

### 4.3 Content Collection Schema Specification

#### File: `src/content/config.ts`
```typescript
import { defineCollection, z } from 'astro:content';

const workflowsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    category: z.enum([
      'Agricultural Automation',
      'DevOps & Multi-Agent',
      'Agentic Systems',
      'Data Engineering',
      'System Architecture'
    ]),
    architectureType: z.enum([
      'Directed Acyclic Graph (DAG)',
      'Event-Driven Pipeline',
      'Finite State Machine',
      'Hierarchical Multi-Agent'
    ]),
    summary: z.string(),
    throughput: z.string(),
    latencySLA: z.string(),
    reliabilityTarget: z.string(),
    techStack: z.array(z.string()),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      delta: z.string().optional(),
      trend: z.enum(['up', 'down', 'neutral']).optional(),
      description: z.string(),
    })),
    relatedProjectIds: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

const hermesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    specId: z.string(),
    title: z.string(),
    version: z.string(),
    layer: z.enum(['Telemetry', 'Orchestration', 'Memory', 'Routing', 'Security']),
    abstract: z.string(),
    benchmarks: z.record(z.string(), z.string()),
    lastUpdated: z.string(),
  }),
});

export const collections = {
  workflows: workflowsCollection,
  hermes: hermesCollection,
};
```

---

### 4.4 Comprehensive Data Models (The 5 Workflows & Hermes Specs)

#### 1. Workflow 1: Edge-to-Cloud Agricultural Telematics & Yield Optimization
- **Category**: `Agricultural Automation`
- **Domain**: KRONE Agricultural Telematics, ISOBUS/CAN-bus ingestion, real-time edge anomaly detection, GPS yield mapping.
- **Steps**:
  1. `CAN-Bus & ISOBUS Telemetry Capture`: Ingestion from onboard sensors (moisture, crop density, PTO torque, ground speed) at 50Hz via embedded Rust runtime.
  2. `Edge Pre-Processing & Anomaly Detection`: Lightweight ONNX edge model running on-tractor for instant clog detection and cutting cylinder vibration spikes.
  3. `Resilient Cellular MQTT Sync`: Store-and-forward edge buffer with dynamic compression transmitting telemetry over 4G/LTE to cloud broker.
  4. `Kafka Stream Decoupling & Schema Registry`: Ingestion into Apache Kafka with Protobuf schema validation and partitioned topic routing.
  5. `TimescaleDB Analytical Aggregation`: Continuous rollups of hourly fuel efficiency, field boundary polygons, and yield ton/hectare maps.
  6. `Yield Map Geo-Visualization & Fleet Alert Emission`: Push notifications to farm managers via WebSockets with spatial GeoJSON overlays.

#### 2. Workflow 2: AEONIS OPS Autonomous Multi-Agent CI/CD & Self-Healing Pipeline
- **Category**: `DevOps & Multi-Agent`
- **Domain**: AI-driven DevOps, Sentinel AST security analysis, synthetic test generation, canary verification, automated rollbacks.
- **Steps**:
  1. `Git Push / Webhook Ingestion`: Intercepts developer commits and dispatches ephemeral agent workspace container.
  2. `Sentinel AST Security Analysis`: Abstract Syntax Tree parsing scanning for OWASP Top 10 vulnerabilities, hardcoded secrets, and unsafe SQL interpolations.
  3. `Synthetic Regression Test Generation`: LLM code agent synthesizes boundary-condition unit and integration tests based on AST diffs.
  4. `Hermes Quorum Build Verification`: Multi-agent reviewer consensus evaluates code quality, typing soundness, and architectural invariants.
  5. `Canary Deployment & Metric Sentinel`: 5% traffic roll-out with automated Prometheus sentry tracking p99 latency and error rates.
  6. `Self-Healing Rollback or Automated Promotion`: Automated GitOps promotion to 100% traffic or sub-second zero-downtime rollback upon anomaly detection.

#### 3. Workflow 3: Ultron Autonomous Agentic Task Decomposition & Execution Engine
- **Category**: `Agentic Systems`
- **Domain**: Hierarchical AI agent coordination, dynamic DAG planning, tool execution sandbox, episodic memory retrieval.
- **Steps**:
  1. `Intent Parsing & Goal Clarification`: User goal ingested and normalized into structured JSON task constraints.
  2. `Dynamic DAG Decomposition`: Orchestrator agent generates multi-node Directed Acyclic Graph with explicit parallel execution paths.
  3. `Episodic Vector Memory Retrieval`: Cosine similarity query against Qdrant vector database to recall previously successful tool patterns.
  4. `Sandboxed Tool Execution & Verification`: WASM/Docker isolated execution of terminal commands, web search, code compilation, and API calls.
  5. `Multi-Agent Debate & Consensus`: Challenger agent critiques intermediate results; arbiter resolves conflicting outputs.
  6. `Artifact Emission & Telemetry Logging`: Emits final production artifacts, updates semantic knowledge graph, and exports trace logs.

#### 4. Workflow 4: High-Throughput IoT Data Engineering & Medallion Stream Lakehouse
- **Category**: `Data Engineering`
- **Domain**: Medallion architecture (Bronze/Silver/Gold), stream processing, schema evolution, real-time feature store.
- **Steps**:
  1. `High-Volume Telemetry Ingest`: Ingestion of 15,000+ sensor events/sec via Apache Flink distributed streaming engine.
  2. `Bronze Layer (Raw Immutable Storage)`: Writing compressed Parquet files to Cloud Storage with timestamped ingestion partitions.
  3. `Silver Layer (Deduplication & Cleansing)`: Stream deduplication, outlier clipping, missing value interpolation, and JSON parsing.
  4. `Gold Layer (Analytical Dimensions & Feature Store)`: Computing 5-minute rolling averages, machine health indices, and ML feature tables.
  5. `ClickHouse Real-Time OLAP Materialization`: Sub-10ms queryable column-oriented materialization for fleet analytics.
  6. `Live Grafana & Stream API Serving`: Real-time streaming to dashboards and operational monitoring webhooks.

#### 5. Workflow 5: Enterprise GAMS Transactional State Machine
- **Category**: `System Architecture`
- **Domain**: C-based Gas Agency Management System (GAMS), double-entry ledger, RBAC security, atomic CSV persistence.
- **Steps**:
  1. `User Authentication & RBAC Verification`: Cryptographic session token validation against Admin/Staff/Auditor permissions.
  2. `Transactional Order Entry`: Request validation against cylinder stock allocation and customer quota limits.
  3. `Double-Entry Ledger Balancing`: Simultaneous debit of inventory register and credit of customer account with rollback guardrails.
  4. `Atomic File I/O & Inode Swapping`: Safe write-ahead logging (WAL) and temp-file atomic rename to prevent corruption upon crash.
  5. `Audit Event Logging & CSV Serialization`: Structured logging of user IP, timestamp, transaction ID, and cryptographic hash of state.
  6. `Receipt & Reconciliation Generation`: Formatted text/CSV invoice generation and automated daily summary export.

---

### 4.5 Interactive UI Components & Apple-Style Fluid Specifications

#### 1. `<WorkflowVisualizer />` (React + Framer Motion)
- **Fluid Mechanics**:
  - **Shared Layout Transitions**: `layoutId="step-indicator"`, `layoutId="active-pill"`.
  - **Spring Parameters**:
    - Damping: `28`
    - Stiffness: `300`
    - Mass: `0.8`
    - Velocity: Inherited directly from user gesture/drag or scroll momentum.
  - **Direct Manipulation**: Draggable progress scrubber with boundary clamping and haptic-like visual resistance.
  - **SVG Animated Flow**: SVG path connector with dynamic dash-offset animation representing live data flow between nodes.
  - **Interactive Drawer**: Fluid slide-over sheet displaying step I/O schemas, failure policies, and syntax-highlighted code.

#### 2. `<HermesTelemetryDashboard />` (React + Framer Motion)
- **Features**:
  - **Live Agent Status Cards**: Status indicators with animated glow halos (`scale: [1, 1.05, 1]`, `opacity: [0.6, 1, 0.6]`).
  - **Fluid Rolling Digit Counters**: `framer-motion` spring-driven numbers for token count, latency ms, and total USD cost.
  - **Interactive Telemetry Filter**: Live search and status filtering (`All`, `Active`, `Consensus`, `Idle`) with instant layout morphing.
  - **Simulated Real-Time Stream**: Toggleable "Live Feed" mode appending simulated agent trace events every 2.5 seconds with pause/resume controls.

#### 3. `<HermesMemoryInspector />`
- **Features**:
  - **Three-Tab Segmented Controller**: Apple-style glass segmented picker (`Working Memory`, `Episodic Vectors`, `Knowledge Graph`).
  - **Vector Cosine Similarity Visualizer**: Interactive horizontal bar with spring-animated fill and color gradient (Green: >0.85, Yellow: 0.70-0.85, Orange: <0.70).
  - **Semantic Graph Entity Explorer**: Clean clickable entity-relationship cards showing bidirectional graph links.

#### 4. `<HermesRouterMatrix />`
- **Features**:
  - **Prompt Complexity Classifier**: Visual heuristic scale showing Domain, Token Length, Reasoning Depth, and Coding requirements.
  - **Dynamic Model Selection Visualizer**: Step-by-step route arbitration highlighting why a specific LLM (e.g. Claude 3.5 Sonnet vs GPT-4o vs Llama-3-70B) was chosen based on cost vs latency SLA.

#### 5. `<JsonGraphInspector />`
- **Features**:
  - Deep recursive JSON viewer with collapsable object/array nodes.
  - Syntax highlighted keys, strings, numbers, booleans, and nulls.
  - 1-Click Copy with toast notification and copy count tracker.
  - Filter / Search input highlighting matching keys in real-time.

---

## 5. Verification Method

To independently verify the schemas, data integrity, and component functionality:

1. **TypeScript Compilation & Schema Typecheck**:
   ```powershell
   npx astro check
   ```
   *Expected Result*: 0 type errors across `src/types/workflow.ts`, `src/types/hermes.ts`, and data files.

2. **Astro Content Collection Validation**:
   ```powershell
   npx astro build
   ```
   *Expected Result*: All `.mdx` files in `src/content/workflows/` and `src/content/hermes/` parse and pass Zod schema validation.

3. **Framer Motion Spring Audit**:
   - Inspect all Framer Motion motion components (`motion.div`, `motion.button`, `AnimatePresence`).
   - Confirm explicit `transition={{ type: "spring", damping: 28, stiffness: 300 }}` is applied rather than static CSS transitions for interactive state changes.

4. **Lighthouse Performance Test**:
   ```powershell
   npx lighthouse http://localhost:4321/ --view --output=json
   ```
   *Expected Result*: Performance score >= 90; Accessibility score >= 95.
