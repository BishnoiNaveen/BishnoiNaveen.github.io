/**
 * src/types/project.ts — Comprehensive Project & Case Study Type Definitions
 * Supports 7-part engineering case study anatomy:
 * Problem -> Idea -> System Architecture -> Build & Invariants -> Verification & Proof -> Lessons -> Measurable Outcome
 */

export type ProjectCategory =
  | 'Live'
  | 'Antigravity Labs'
  | 'Open Source'
  | 'Autonomous & AI'
  | 'Systems & IoT'
  | 'Data & Lakehouse';

export type ProjectDomain = 'Autonomous & AI' | 'Systems & IoT' | 'Data & Lakehouse';

export type ProjectStatus = 'live' | 'planning' | 'beta' | 'completed';

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
  explanation?: string;
}

export interface CaseStudySection {
  title: string;
  slug: string;
  summary: string;
  content: string[];
  invariants?: string[];
  codeSnippets?: CodeSnippet[];
  metrics?: ProjectMetric[];
  highlights?: string[];
  diagram?: {
    type: string;
    caption: string;
    steps?: string[];
  };
}

export interface CaseStudy {
  problem: CaseStudySection;
  idea: CaseStudySection;
  systemArchitecture: CaseStudySection;
  buildAndInvariants: CaseStudySection;
  verificationAndProof: CaseStudySection;
  lessonsLearned: CaseStudySection;
  measurableOutcome: CaseStudySection;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  statusLabel: string;
  category: ProjectCategory;
  domain?: ProjectDomain;
  highlights: string[];
  github: string | null;
  live: string | null;
  image: string;
  metrics?: ProjectMetric[];
  featured?: boolean;
  architecturalLayer?: string;
  systemInvariants?: string[];
  architectureDecisions?: string[];
  keyInvariantsRationale?: string;
  caseStudy?: CaseStudy;
}
