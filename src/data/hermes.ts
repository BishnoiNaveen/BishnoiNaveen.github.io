import type { 
  AgentTelemetryRecord, 
  HermesTaskGraph, 
  HermesMemorySystem, 
  RouterDecision,
  QuorumSession 
} from '../types/hermes';

export const hermesTelemetryRecords: AgentTelemetryRecord[] = [
  {
    agentId: 'hermes-orchestrator-01',
    agentName: 'Hermes Master Orchestrator',
    role: 'Hierarchical Task Decomposition & DAG Scheduler',
    status: 'PLANNING',
    currentTask: 'Topological dependency resolution for microservice telemetry canary rollout',
    activeTurn: 42,
    uptimeSeconds: 86420,
    tokenMetrics: {
      promptTokens: 142500,
      completionTokens: 38200,
      cachedTokens: 89400,
      totalTokens: 180700,
      totalCostUsd: 0.842,
      tokensPerSec: 88.4
    },
    latency: {
      ttftMs: 240,
      inferenceDurationMs: 1450,
      toolExecutionMs: 320,
      memoryRetrievalMs: 28,
      totalLatencyMs: 2038
    },
    activeModel: 'claude-3-5-sonnet-20241022',
    activeTemperature: 0.2,
    lastHeartbeat: '2026-08-23T09:14:02Z'
  },
  {
    agentId: 'sentinel-security-02',
    agentName: 'Sentinel AST Security Sentry',
    role: 'Abstract Syntax Tree Taint & Vulnerability Auditor',
    status: 'EXECUTING_TOOL',
    currentTask: 'Forward taint traversal from HTTP request sinks to SQL query builder',
    activeTurn: 89,
    uptimeSeconds: 172800,
    tokenMetrics: {
      promptTokens: 215400,
      completionTokens: 42100,
      cachedTokens: 164000,
      totalTokens: 257500,
      totalCostUsd: 1.140,
      tokensPerSec: 104.2
    },
    latency: {
      ttftMs: 195,
      inferenceDurationMs: 980,
      toolExecutionMs: 1250,
      memoryRetrievalMs: 18,
      totalLatencyMs: 2443
    },
    activeModel: 'gpt-4o',
    activeTemperature: 0.0,
    lastHeartbeat: '2026-08-23T09:14:05Z'
  },
  {
    agentId: 'synthesis-qa-03',
    agentName: 'Synthesis QA & Mutation Agent',
    role: 'Automated Property-Based Test & Edge-Case Synthesizer',
    status: 'REFLECTING',
    currentTask: 'Evaluating boundary conditions for crop yield geospatial polygon calculations',
    activeTurn: 124,
    uptimeSeconds: 259200,
    tokenMetrics: {
      promptTokens: 310800,
      completionTokens: 68400,
      cachedTokens: 240000,
      totalTokens: 379200,
      totalCostUsd: 1.820,
      tokensPerSec: 92.6
    },
    latency: {
      ttftMs: 280,
      inferenceDurationMs: 2100,
      toolExecutionMs: 840,
      memoryRetrievalMs: 42,
      totalLatencyMs: 3262
    },
    activeModel: 'claude-3-5-sonnet-20241022',
    activeTemperature: 0.4,
    lastHeartbeat: '2026-08-23T09:14:01Z'
  },
  {
    agentId: 'krone-edge-telemetry-04',
    agentName: 'KRONE Edge Telematics Sentry',
    role: 'CAN-Bus / ISOBUS High-Frequency Ingestion Monitor',
    status: 'EXECUTING_TOOL',
    currentTask: 'Spectral FFT windowing over cutting cylinder vibration transducers',
    activeTurn: 1540,
    uptimeSeconds: 604800,
    tokenMetrics: {
      promptTokens: 42000,
      completionTokens: 8200,
      cachedTokens: 34000,
      totalTokens: 50200,
      totalCostUsd: 0.082,
      tokensPerSec: 145.0
    },
    latency: {
      ttftMs: 65,
      inferenceDurationMs: 320,
      toolExecutionMs: 14,
      memoryRetrievalMs: 8,
      totalLatencyMs: 407
    },
    activeModel: 'hermes-llama-3-8b-edge',
    activeTemperature: 0.1,
    lastHeartbeat: '2026-08-23T09:14:07Z'
  },
  {
    agentId: 'quorum-arbiter-05',
    agentName: 'Quorum Byzantine Arbiter',
    role: 'Multi-Agent Consensus & Release Protocol Enforcer',
    status: 'AWAITING_CONSENSUS',
    currentTask: 'Aggregating cryptographic votes for production deployment gate',
    activeTurn: 58,
    uptimeSeconds: 86400,
    tokenMetrics: {
      promptTokens: 184000,
      completionTokens: 29500,
      cachedTokens: 120000,
      totalTokens: 213500,
      totalCostUsd: 2.450,
      tokensPerSec: 64.8
    },
    latency: {
      ttftMs: 420,
      inferenceDurationMs: 3100,
      toolExecutionMs: 45,
      memoryRetrievalMs: 35,
      totalLatencyMs: 3600
    },
    activeModel: 'claude-3-opus-20240229',
    activeTemperature: 0.0,
    lastHeartbeat: '2026-08-23T09:14:04Z'
  },
  {
    agentId: 'lakehouse-stream-worker-06',
    agentName: 'Medallion Lakehouse Operator',
    role: 'Flink Stream Coordinator & ClickHouse Sync Daemon',
    status: 'IDLE',
    currentTask: 'Standing by for 10-second Flink 2PC checkpoint confirmation',
    activeTurn: 310,
    uptimeSeconds: 345600,
    tokenMetrics: {
      promptTokens: 78000,
      completionTokens: 14200,
      cachedTokens: 52000,
      totalTokens: 92200,
      totalCostUsd: 0.165,
      tokensPerSec: 120.5
    },
    latency: {
      ttftMs: 140,
      inferenceDurationMs: 620,
      toolExecutionMs: 120,
      memoryRetrievalMs: 15,
      totalLatencyMs: 895
    },
    activeModel: 'gpt-4o-mini',
    activeTemperature: 0.0,
    lastHeartbeat: '2026-08-23T09:14:06Z'
  }
];

export const hermesTaskGraph: HermesTaskGraph = {
  graphId: 'hermes-dag-run-98421',
  rootGoal: 'Execute autonomous AST vulnerability audit, synthetic test verification, and canary deployment for KRONE Telematics Stream Engine',
  initiatedAt: '2026-08-23T09:10:00Z',
  totalNodes: 6,
  completedNodes: 4,
  nodes: [
    {
      id: 'node-ast-audit',
      label: 'AST Taint & Vulnerability Scan',
      agentId: 'sentinel-security-02',
      status: 'COMPLETED',
      dependencies: [],
      durationMs: 2800,
      retryCount: 0,
      payloadSummary: 'Scanned 14 files, 1,840 AST nodes; verified 0 unparameterized SQL sinks and 0 hardcoded secrets'
    },
    {
      id: 'node-synth-tests',
      label: 'Synthesize Property Mutation Tests',
      agentId: 'synthesis-qa-03',
      status: 'COMPLETED',
      dependencies: ['node-ast-audit'],
      durationMs: 4200,
      retryCount: 0,
      payloadSummary: 'Synthesized 12 property tests for Delaunay triangulation edge-cases; 100% pass on mutation matrix'
    },
    {
      id: 'node-sandbox-build',
      label: 'Sandboxed Docker Build & Typecheck',
      agentId: 'hermes-orchestrator-01',
      status: 'COMPLETED',
      dependencies: ['node-synth-tests'],
      durationMs: 1250,
      retryCount: 0,
      payloadSummary: 'Executed astro check & cargo test in isolated container; 0 errors, 0 warnings'
    },
    {
      id: 'node-quorum-vote',
      label: 'Byzantine Quorum Consensus Gate',
      agentId: 'quorum-arbiter-05',
      status: 'COMPLETED',
      dependencies: ['node-sandbox-build'],
      durationMs: 1800,
      retryCount: 0,
      payloadSummary: '4 of 4 agents approved release (Architect, Security, QA, Performance) with 96.5% mean confidence'
    },
    {
      id: 'node-canary-deploy',
      label: 'Deploy 5% Traffic Canary Slice',
      agentId: 'hermes-orchestrator-01',
      status: 'IN_PROGRESS',
      dependencies: ['node-quorum-vote'],
      durationMs: 45000,
      retryCount: 0,
      payloadSummary: 'Istio VirtualService updated; routing 5% production traffic; Prometheus Sentry window active'
    },
    {
      id: 'node-promote-gitops',
      label: 'Promote 100% Traffic & Merge PR',
      agentId: 'sentinel-security-02',
      status: 'PENDING',
      dependencies: ['node-canary-deploy'],
      durationMs: 0,
      retryCount: 0,
      payloadSummary: 'Awaiting completion of 300s Prometheus verification window before auto-merging PR #142'
    }
  ],
  edges: [
    {
      id: 'edge-1-2',
      source: 'node-ast-audit',
      target: 'node-synth-tests',
      type: 'data_dependency'
    },
    {
      id: 'edge-2-3',
      source: 'node-synth-tests',
      target: 'node-sandbox-build',
      type: 'data_dependency'
    },
    {
      id: 'edge-3-4',
      source: 'node-sandbox-build',
      target: 'node-quorum-vote',
      type: 'control_flow'
    },
    {
      id: 'edge-4-5',
      source: 'node-quorum-vote',
      target: 'node-canary-deploy',
      type: 'conditional_branch'
    },
    {
      id: 'edge-5-6',
      source: 'node-canary-deploy',
      target: 'node-promote-gitops',
      type: 'data_dependency'
    }
  ]
};

export const hermesMemorySystem: HermesMemorySystem = {
  workingMemory: {
    activeContextTokens: 18420,
    maxContextTokens: 128000,
    entries: [
      {
        key: 'system_protocol_manifest',
        value: 'Hermes Autonomous Coordination Engine v2.4.0 — Byzantine Fault Tolerant Release Protocol active.',
        tokens: 420,
        updatedAt: '2026-08-23T09:00:00Z'
      },
      {
        key: 'active_pull_request_metadata',
        value: 'PR #142: "feat(telematics): Add real-time ISOBUS torque jitter calculation & PostGIS spatial Delaunay triangulation"',
        tokens: 850,
        updatedAt: '2026-08-23T09:10:05Z'
      },
      {
        key: 'ast_security_audit_verdict',
        value: 'PASSED: 0 taint leaks, 0 unparameterized SQL calls, 0 hardcoded secrets. Compliant with SAIF Tier 3.',
        tokens: 1240,
        updatedAt: '2026-08-23T09:10:33Z'
      },
      {
        key: 'synthetic_mutation_test_summary',
        value: '12 test cases synthesized covering empty coordinate arrays, NaN moisture readings, and extreme PTO torque spikes (5000Nm).',
        tokens: 2100,
        updatedAt: '2026-08-23T09:11:15Z'
      },
      {
        key: 'quorum_signatures',
        value: 'ArchitectAgent: 0x9f4a... (APPROVE), SecurityAgent: 0x3d8c... (APPROVE), QAAgent: 0x7e2b... (APPROVE), PerfAgent: 0x11fa... (APPROVE)',
        tokens: 940,
        updatedAt: '2026-08-23T09:12:00Z'
      },
      {
        key: 'canary_sentry_prometheus_window',
        value: 'Traffic Split: 95% stable / 5% canary. P99 Latency: 14.2ms (SLA < 25ms). 5xx Error Rate: 0.000%. Active samples: 48,200 requests.',
        tokens: 1680,
        updatedAt: '2026-08-23T09:13:45Z'
      }
    ]
  },
  episodicMemory: {
    vectorStoreProvider: 'Qdrant Distributed Cluster (v1.9.2)',
    totalEmbeddings: 148920,
    dimension: 1536,
    recentRetrievals: [
      {
        id: 'vec-rec-0914',
        documentSnippet: 'Pattern: SocketCAN frame decoding with PGN 0x18FEF1 for engine speed & PTO torque normalization in Rust.',
        similarityScore: 0.942,
        collection: 'krone_isobus_firmware_episodes',
        embeddingModel: 'text-embedding-3-small',
        sourceSessionId: 'session-rust-can-2026-04',
        timestamp: '2026-08-23T09:10:02Z'
      },
      {
        id: 'vec-rec-0915',
        documentSnippet: 'Pattern: Istio VirtualService canary traffic weight shift with Prometheus P99 latency automated rollback rule.',
        similarityScore: 0.894,
        collection: 'aeonis_devops_playbooks',
        embeddingModel: 'text-embedding-3-small',
        sourceSessionId: 'session-istio-canary-2026-06',
        timestamp: '2026-08-23T09:10:14Z'
      },
      {
        id: 'vec-rec-0916',
        documentSnippet: 'Pattern: Write-Ahead Logging (WAL) and atomic POSIX rename() inode swapping in C for crash-resilient CSV persistence.',
        similarityScore: 0.865,
        collection: 'gams_c_engine_architecture',
        embeddingModel: 'text-embedding-3-small',
        sourceSessionId: 'session-c-gams-2026-02',
        timestamp: '2026-08-23T09:10:28Z'
      },
      {
        id: 'vec-rec-0917',
        documentSnippet: 'Pattern: Apache Flink tumbling window state management for 5-minute telemetry aggregations with exactly-once checkpoints.',
        similarityScore: 0.828,
        collection: 'lakehouse_data_engineering',
        embeddingModel: 'text-embedding-3-small',
        sourceSessionId: 'session-flink-lakehouse-2026-07',
        timestamp: '2026-08-23T09:10:45Z'
      }
    ]
  },
  semanticKnowledgeGraph: {
    totalTriples: 2450,
    entities: [
      { id: 'ent-krone-ecu', label: 'KRONE Agricultural Telematics ECU', type: 'System' },
      { id: 'ent-isobus-can', label: 'ISOBUS / J1939 CAN-Bus Protocol', type: 'Rule' },
      { id: 'ent-sentinel-ai', label: 'Sentinel AI Security Agent', type: 'Agent' },
      { id: 'ent-hermes-quorum', label: 'Hermes Byzantine Quorum Engine', type: 'System' },
      { id: 'ent-timescaledb', label: 'TimescaleDB Geospatial Hypertables', type: 'Service' },
      { id: 'ent-clickhouse-olap', label: 'ClickHouse Medallion Lakehouse', type: 'Service' },
      { id: 'ent-gams-core', label: 'GAMS C Transactional State Engine', type: 'System' },
      { id: 'ent-sonnet-model', label: 'Claude 3.5 Sonnet (20241022)', type: 'Model' },
      { id: 'ent-gpt4o-model', label: 'GPT-4o Omnimodal (Deterministic 0.0)', type: 'Model' },
      { id: 'ent-schema-telemetry', label: 'KroneTelemetryPacketProtobufV1', type: 'DataSchema' }
    ],
    relations: [
      { from: 'ent-krone-ecu', to: 'ent-isobus-can', relation: 'Implements', weight: 1.0 },
      { from: 'ent-krone-ecu', to: 'ent-schema-telemetry', relation: 'SerializesTo', weight: 0.95 },
      { from: 'ent-schema-telemetry', to: 'ent-timescaledb', relation: 'StreamsInto', weight: 0.90 },
      { from: 'ent-sentinel-ai', to: 'ent-gpt4o-model', relation: 'PoweredBy', weight: 0.98 },
      { from: 'ent-sentinel-ai', to: 'ent-hermes-quorum', relation: 'ParticipatesIn', weight: 0.92 },
      { from: 'ent-hermes-quorum', to: 'ent-sonnet-model', relation: 'CoordinatedBy', weight: 0.94 },
      { from: 'ent-gams-core', to: 'ent-isobus-can', relation: 'FollowsDeterministicFSM', weight: 0.85 },
      { from: 'ent-clickhouse-olap', to: 'ent-schema-telemetry', relation: 'MaterializesFrom', weight: 0.88 }
    ]
  }
};

export const hermesRouterLogs: RouterDecision[] = [
  {
    requestId: 'req-route-0842',
    timestamp: '2026-08-23T09:10:12Z',
    promptClassification: {
      domain: 'Security & AST Taint Analysis',
      complexity: 'High',
      contextLengthTokens: 14820,
      requiresCodeExecution: true
    },
    routingDecision: {
      selectedModel: 'gpt-4o',
      provider: 'OpenAI API Direct',
      reasoning: 'Strict deterministic JSON output requirement (temp: 0.0) with zero-shot taint analysis across multiple Python/TypeScript AST files.',
      estimatedCostUsd: 0.088,
      targetLatencyMs: 1200
    },
    fallbackChain: ['claude-3-5-sonnet-20241022', 'gpt-4o-mini'],
    executionResult: {
      actualDurationMs: 980,
      actualCostUsd: 0.084,
      qualityScore: 0.99,
      fallbackTriggered: false
    }
  },
  {
    requestId: 'req-route-0843',
    timestamp: '2026-08-23T09:10:45Z',
    promptClassification: {
      domain: 'Synthetic Mutation Test Generation',
      complexity: 'Extreme',
      contextLengthTokens: 24500,
      requiresCodeExecution: true
    },
    routingDecision: {
      selectedModel: 'claude-3-5-sonnet-20241022',
      provider: 'Anthropic Claude Engine',
      reasoning: 'Highest reasoning and property-based test code synthesis capability for complex Delaunay triangulation and geometric boundary edge cases.',
      estimatedCostUsd: 0.145,
      targetLatencyMs: 2400
    },
    fallbackChain: ['gpt-4o', 'deepseek-coder-v2'],
    executionResult: {
      actualDurationMs: 2100,
      actualCostUsd: 0.138,
      qualityScore: 0.98,
      fallbackTriggered: false
    }
  },
  {
    requestId: 'req-route-0844',
    timestamp: '2026-08-23T09:11:30Z',
    promptClassification: {
      domain: 'Real-Time Telemetry Anomaly Classification',
      complexity: 'Low',
      contextLengthTokens: 1200,
      requiresCodeExecution: false
    },
    routingDecision: {
      selectedModel: 'hermes-llama-3-8b-edge',
      provider: 'On-Device Local vLLM Inference',
      reasoning: 'Ultra-low latency SLA (< 50ms) required for on-tractor baling chamber pressure classification without incurring cloud egress cost.',
      estimatedCostUsd: 0.000,
      targetLatencyMs: 40
    },
    fallbackChain: ['gpt-4o-mini'],
    executionResult: {
      actualDurationMs: 34,
      actualCostUsd: 0.000,
      qualityScore: 0.96,
      fallbackTriggered: false
    }
  },
  {
    requestId: 'req-route-0845',
    timestamp: '2026-08-23T09:12:00Z',
    promptClassification: {
      domain: 'Byzantine Quorum Consensus Arbitration',
      complexity: 'Extreme',
      contextLengthTokens: 38200,
      requiresCodeExecution: false
    },
    routingDecision: {
      selectedModel: 'claude-3-opus-20240229',
      provider: 'Anthropic Claude Engine',
      reasoning: 'Supreme multi-agent synthesis, critical policy reasoning, and invariant verification across divergent agent critiques.',
      estimatedCostUsd: 0.420,
      targetLatencyMs: 3800
    },
    fallbackChain: ['claude-3-5-sonnet-20241022', 'gpt-4o'],
    executionResult: {
      actualDurationMs: 3100,
      actualCostUsd: 0.395,
      qualityScore: 1.00,
      fallbackTriggered: false
    }
  }
];

export const hermesQuorumSessions: QuorumSession[] = [
  {
    sessionId: 'quorum-session-canary-gate-98421',
    protocol: 'Byzantine_Fault_Tolerant_Voting',
    targetDecision: 'Production Canary Deployment Approval for KRONE Telematics Stream v4.12',
    votes: [
      {
        agentId: 'architect-agent',
        agentName: 'System Architect Persona',
        vote: 'APPROVE',
        confidence: 0.96,
        critique: 'Data contracts in Protobuf v1 adhere to backwards compatibility invariants. Kafka partition keys correctly isolate tractor UUIDs.'
      },
      {
        agentId: 'sentinel-security-02',
        agentName: 'Sentinel Security Sentry',
        vote: 'APPROVE',
        confidence: 0.99,
        critique: 'Zero taint paths from input frame decoders to database sinks. Inode swap mechanism in storage layer prevents partial writes.'
      },
      {
        agentId: 'synthesis-qa-03',
        agentName: 'Synthesis QA Agent',
        vote: 'APPROVE',
        confidence: 0.95,
        critique: 'Mutation score is 100% across all 12 synthesized property tests. Boundary condition on empty GPS array handled gracefully.'
      },
      {
        agentId: 'performance-agent',
        agentName: 'Performance Engineer Persona',
        vote: 'APPROVE',
        confidence: 0.92,
        critique: 'P99 on-edge inference latency measured at 14.2ms, well beneath the 25ms SLA budget. Memory footprint stable at 24.8MB.'
      }
    ],
    consensusReached: true,
    finalDecision: 'APPROVED_FOR_CANARY_DEPLOYMENT (Consensus: 4/4 Unanimous)',
    coordinationOverheadMs: 1420
  },
  {
    sessionId: 'quorum-session-sql-hotfix-89102',
    protocol: 'Majority_Consensus',
    targetDecision: 'Hotfix Patch Synthesis for SQL Parameterization Vulnerability in Legacy Module',
    votes: [
      {
        agentId: 'sentinel-security-02',
        agentName: 'Sentinel Security Sentry',
        vote: 'APPROVE',
        confidence: 0.99,
        critique: 'Direct string interpolation removed; replaced with positional bind parameter ? in query builder.'
      },
      {
        agentId: 'architect-agent',
        agentName: 'System Architect Persona',
        vote: 'AMEND',
        confidence: 0.88,
        critique: 'Recommend using named parameters (:customer_id) rather than positional ? for long-term schema maintainability.'
      },
      {
        agentId: 'synthesis-qa-03',
        agentName: 'Synthesis QA Agent',
        vote: 'APPROVE',
        confidence: 0.94,
        critique: 'Unit test suite with SQL injection payloads (1=1, OR TRUE) successfully neutralized.'
      }
    ],
    consensusReached: true,
    finalDecision: 'APPROVED_WITH_NAMED_PARAMETER_AMENDMENT (Consensus: 3/3 with Amendment)',
    coordinationOverheadMs: 980
  }
];
