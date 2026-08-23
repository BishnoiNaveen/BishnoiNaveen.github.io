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
  type: 'System' | 'Service' | 'Rule' | 'Agent' | 'DataSchema' | 'Model';
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
