export type ProjectCategory = 'Live' | 'Antigravity Labs' | 'Open Source';

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  status: 'live' | 'planning' | 'beta';
  statusLabel: string;
  category: ProjectCategory;
  highlights: string[];
  github: string | null;
  live: string | null;
}

export const projects: Project[] = [
  {
    title: 'Gas Agency Management System',
    subtitle: 'Enterprise-Grade Inventory Console',
    description: 'A robust console-based Gas Agency Management System (GAMS) built in C. Features complete LPG inventory control, customer bookings, delivery tracking, billing, CSV reporting, and a secure admin dashboard.',
    techStack: ['C', 'File I/O', 'Data Structures', 'Algorithms'],
    status: 'live',
    statusLabel: 'Completed',
    category: 'Open Source',
    highlights: [
      'Efficient CSV-based persistence layer',
      'Role-based access control (Admin/User)',
      'Optimized memory management',
    ],
    github: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
    live: null,
  },
  {
    title: 'Smart Task System',
    subtitle: 'Intelligent Workflow Manager',
    description: 'A dynamic task management architecture designed for seamless tracking and execution. Focuses on intuitive UI and responsive state management for high-efficiency workflows.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'DOM Manipulation'],
    status: 'live',
    statusLabel: 'Completed',
    category: 'Open Source',
    highlights: [
      'Client-side state persistence',
      'Event-driven architecture',
      'Responsive design patterns',
    ],
    github: 'https://github.com/BishnoiNaveen/smart-task-system',
    live: null,
  },
  {
    title: 'Naveen Bishnoi Portfolio',
    subtitle: 'High-Performance Personal Architecture',
    description: 'A production-grade portfolio engineered with Astro, Vanilla CSS, and GSAP. Designed to achieve a perfect 100/100 Lighthouse score while delivering a rich, interactive UI/UX.',
    techStack: ['Astro', 'TypeScript', 'CSS', 'GSAP'],
    status: 'live',
    statusLabel: 'Live',
    category: 'Live',
    highlights: [
      'Lighthouse 100/100 target',
      'WCAG 2.2 AA accessibility',
      'Schema.org structured data & full SEO',
    ],
    github: 'https://github.com/BishnoiNaveen/BishnoiNaveen',
    live: 'https://naveenbishnoi.com',
  },
  {
    title: 'AEONIS OPS',
    subtitle: 'AI-Powered Operations Platform',
    description: 'A comprehensive architecture for autonomous DevOps workflows. Designed to orchestrate CI/CD pipelines, infrastructure provisioning, and monitoring using sophisticated AI agents.',
    techStack: ['Python', 'System Design', 'AI Agents', 'DevOps'],
    status: 'planning',
    statusLabel: 'Architecture Stage',
    category: 'Antigravity Labs',
    highlights: [
      'Multi-agent orchestration architecture',
      'Autonomous pipeline management design',
      'Infrastructure-as-Code integration patterns',
    ],
    github: 'https://github.com/BishnoiNaveen/AEONIS-OPS',
    live: null,
  },
  {
    title: 'Ultron Framework',
    subtitle: 'Autonomous Enterprise Orchestration',
    description: 'An advanced agent framework designed for enterprise automation. Coordinates multiple AI agents to execute complex, multi-step workflows without human intervention.',
    techStack: ['Python', 'LangChain', 'LLMs', 'API Design'],
    status: 'beta',
    statusLabel: 'Beta Testing',
    category: 'Open Source',
    highlights: [
      'Plugin-based agent architecture',
      'Task decomposition engine design',
      'Enterprise-grade error handling patterns',
    ],
    github: 'https://github.com/BishnoiNaveen/Ultron',
    live: null,
  },
  {
    title: 'Sentinel AI Security',
    subtitle: 'Automated Code Auditing Agent',
    description: 'A specialized AI agent that continuously monitors repositories for OWASP Top 10 vulnerabilities, automatically generating surgical pull requests to patch security flaws.',
    techStack: ['TypeScript', 'GitHub Actions', 'Security', 'OpenAI'],
    status: 'planning',
    statusLabel: 'In Development',
    category: 'Antigravity Labs',
    highlights: [
      'Real-time repository threat analysis',
      'Automated AST parsing and patching',
      'Strict adherence to SAIF standards',
    ],
    github: 'https://github.com/BishnoiNaveen/SentinelAI',
    live: null,
  }
];
