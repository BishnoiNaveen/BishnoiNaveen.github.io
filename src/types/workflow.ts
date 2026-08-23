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
  language: 'python' | 'typescript' | 'rust' | 'sql' | 'c' | 'yaml' | 'json';
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
