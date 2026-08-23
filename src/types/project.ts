export type ProjectCategory = 'Live' | 'Antigravity Labs' | 'Open Source';

export type ProjectStatus = 'live' | 'planning' | 'beta' | 'completed';

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
}

export interface Project {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  statusLabel: string;
  category: ProjectCategory;
  highlights: string[];
  github: string | null;
  live: string | null;
  image?: string;
  metrics?: ProjectMetric[];
  featured?: boolean;
  architecturalLayer?: string;
  systemInvariants?: string[];
}
