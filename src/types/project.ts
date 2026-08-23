export type ProjectCategory = 'Live' | 'Antigravity Labs' | 'Open Source' | 'Autonomous & AI' | 'Systems & IoT' | 'Data & Lakehouse';

export type ProjectDomain = 'Autonomous & AI' | 'Systems & IoT' | 'Data & Lakehouse';

export type ProjectStatus = 'live' | 'planning' | 'beta' | 'completed';

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
  icon?: string;
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
}
