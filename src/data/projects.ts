import type { Project, ProjectCategory } from '../types/project';

export type { Project, ProjectCategory };

export const projects: Project[] = [
  {
    id: 'gams',
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
    image: '/images/gas_agency_system.jpg',
    featured: true,
    architecturalLayer: 'Transactional C Core & Storage Inode Swapper',
    systemInvariants: [
      'Double-entry inventory balancing before commit',
      'Atomic temp-file inode renaming for crash tolerance',
      'Zero dynamic memory leakage across session lifecycle'
    ]
  },
  {
    id: 'smart-task',
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
    image: '/images/smart_task_system.jpg',
    featured: false,
    architecturalLayer: 'Reactive DOM State Machine',
    systemInvariants: [
      'LocalStorage transactional synchronization',
      'Sub-16ms layout rendering lifecycle'
    ]
  },
  {
    id: 'portfolio',
    title: 'Naveen Bishnoi Portfolio',
    subtitle: 'High-Performance Personal Architecture',
    description: 'A production-grade portfolio engineered with Astro, React 19, Framer Motion, and Hermes data layer. Designed to achieve a 100/100 Lighthouse score while delivering a rich, interactive Apple Fluid UI.',
    techStack: ['Astro', 'React 19', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
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
    image: '/images/portfolio_hero.jpg',
    featured: true,
    architecturalLayer: 'Astro Island Architecture + WWDC 2018 Fluid Springs',
    systemInvariants: [
      'Zero-JS static HTML baseline',
      'Sub-50ms TTFT across interactive islands'
    ]
  },
  {
    id: 'aeonis-ops',
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
    image: '/images/aeonis_ops.jpg',
    featured: true,
    architecturalLayer: 'Distributed Multi-Agent Consensus Runtime',
    systemInvariants: [
      'Sentinel AST verification gate before deployment',
      'Self-healing automated canary rollback'
    ]
  },
  {
    id: 'ultron',
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
    image: '/images/ultron_framework.jpg',
    featured: true,
    architecturalLayer: 'Dynamic DAG Task Decomposition & Execution Engine',
    systemInvariants: [
      'Cyclic dependency detection before DAG execution',
      'Isolated sandbox containerization for tool calls'
    ]
  },
  {
    id: 'sentinel-ai',
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
    image: '/images/sentinel_ai.jpg',
    featured: true,
    architecturalLayer: 'AST Security Sentry & Surgical Patch Synthesizer',
    systemInvariants: [
      'Zero false-negative AST taint tracking for SQL/Command injections',
      'Hermes Quorum review before pull request synthesis'
    ]
  }
];
