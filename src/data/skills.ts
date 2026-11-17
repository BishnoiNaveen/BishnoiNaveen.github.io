/**
 * src/data/skills.ts — Master Technical Competencies & Evidence Dataset
 * Author: Naveen Bishnoi
 * Standard: 5 Verified Engineering Pillars from Production Experience & Real-World Projects
 */

export interface SkillItem {
  id: string;
  name: string;
  domainId: 'ai-automation' | 'python-analytics' | 'cloud-backend' | 'databases-systems' | 'fullstack-web';
  level: string;
  description: string;
  evidenceRepo: string;
  evidenceProof: string;
  repoUrl?: string;
  verifiedInvariants: string[];
  tags: string[];
}

export interface SkillDomain {
  id: 'ai-automation' | 'python-analytics' | 'cloud-backend' | 'databases-systems' | 'fullstack-web';
  title: string;
  subtitle: string;
  lead: string;
  badge: string;
  color: string;
  skills: SkillItem[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: 'ai-automation',
    title: 'AI-Driven Automation & Tooling',
    subtitle: 'Agentic LLM Workflows & Structured JSON Pipelines',
    lead: 'Constructing robust agentic pipelines, structured JSON outputs, prompt engineering, and modern AI development acceleration.',
    badge: 'Domain 01 · AI Systems',
    color: 'from-blue-500 to-indigo-600',
    skills: [
      {
        id: 'agentic-workflows',
        name: 'Agentic LLM Workflows & Tool Calling',
        domainId: 'ai-automation',
        level: 'Production Engineering',
        description: 'Designing autonomous multi-step reasoning loops, deterministic tool execution, and context-aware fallback cascades.',
        evidenceRepo: 'smart-task-system',
        evidenceProof: 'Dual AI service adapters (Google Gemini & OpenAI APIs) with fallback redundancy',
        repoUrl: 'https://github.com/BishnoiNaveen/smart-task-system',
        verifiedInvariants: ['Dual API Fallback', 'Automated Task Decomposition', 'Deterministic JSON Output'],
        tags: ['Agentic LLM', 'Gemini API', 'OpenAI', 'Cursor', 'Claude', 'ChatGPT']
      },
      {
        id: 'multilingual-json',
        name: 'Multilingual Structured JSON Extraction',
        domainId: 'ai-automation',
        level: 'Production Invariant',
        description: 'Extracting structured operational data from complex multilingual field service reports (Hindi/English technician notes).',
        evidenceRepo: 'KRONE Production',
        evidenceProof: 'Boosted data ingestion speed and eliminated manual key-person billing dependencies',
        verifiedInvariants: ['Zero Billing Schema Corruption', 'Multilingual Hindi/English Extraction', 'High-Speed Parsing'],
        tags: ['JSON Schema', 'Prompt Engineering', 'Data Normalization', 'AI Pipelines']
      }
    ]
  },
  {
    id: 'python-analytics',
    title: 'Python & Forensic Data Analytics',
    subtitle: 'High-Throughput Reconciliation & Audit Pipelines',
    lead: 'Building enterprise data pipelines with pandas and NumPy, automated workbooks, and forensic ledger reconciliation.',
    badge: 'Domain 02 · Python & Data',
    color: 'from-emerald-500 to-teal-600',
    skills: [
      {
        id: 'master-reporting-engine',
        name: 'Autonomous 34-Column Master Reporting Engine',
        domainId: 'python-analytics',
        level: 'Production Engineering',
        description: 'Automated Python engine consolidating field technician logs, trip odometers, and billing summaries with 100% financial accuracy.',
        evidenceRepo: 'KRONE Production',
        evidenceProof: 'Reconciled 350+ historical records across 520+ service jobs with 100% financial audit accuracy',
        verifiedInvariants: ['34-Column Financial Ledger', 'Zero Calculation Discrepancies', 'pandas & NumPy Vectorized Ops'],
        tags: ['Python', 'pandas', 'NumPy', 'Data Reconciliation', 'Forensic Auditing']
      },
      {
        id: 'automated-workbooks',
        name: 'Automated CSV/Excel Workbooks & Billing Exports',
        domainId: 'python-analytics',
        level: 'Production Invariant',
        description: 'Generating multi-sheet reconciled audit spreadsheets with dynamic formatting, automated tax calculations, and formula validation.',
        evidenceRepo: 'gas-agency-management-system',
        evidenceProof: 'Automated CSV/PDF reports with customer ledgers and stock balance verification',
        repoUrl: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
        verifiedInvariants: ['Zero Decimal Drift', 'Formula Validation', 'Double-Entry Balance Verification'],
        tags: ['Excel Automation', 'CSV Pipelines', 'Data Cleansing', 'OpenPyXL']
      }
    ]
  },
  {
    id: 'cloud-backend',
    title: 'Cloud, Backend & Server Setups',
    subtitle: 'Serverless Edge, Microservices & Environment Isolation',
    lead: 'Deploying high-availability edge microservices, serverless APIs, automated background crons, and zero-trust credential hygiene.',
    badge: 'Domain 03 · Cloud & Edge',
    color: 'from-purple-500 to-violet-600',
    skills: [
      {
        id: 'cloudflare-workers-edge',
        name: 'Cloudflare Workers (Serverless Edge)',
        domainId: 'cloud-backend',
        level: 'Production Engineering',
        description: 'Architected and deployed internal portal infrastructure (KIN OneHub intranet) running with sub-10ms global edge latency.',
        evidenceRepo: 'KRONE Production',
        evidenceProof: 'Serverless edge runtime connected to Supabase PostgreSQL with automated document storage bucket',
        verifiedInvariants: ['Edge Cold-Start < 5ms', 'Environment Isolation', 'Zero Local State Dependency'],
        tags: ['Cloudflare Workers', 'Edge Computing', 'Serverless', 'TypeScript', 'Wrangler']
      },
      {
        id: 'enterprise-billing-portal',
        name: 'Enterprise Billing & Invoicing Systems',
        domainId: 'cloud-backend',
        level: 'Production Invariant',
        description: 'Architected automated billing platform (billing.kroneindia.com) for high-capacity baling machinery across tier-1 enterprise clients.',
        evidenceRepo: 'KRONE Production',
        evidenceProof: 'Automated proforma and tax invoices for Reliance Industries, Bio Fuel Corp, VERBIO, Landforce (HSN 998599, 18% IGST)',
        verifiedInvariants: ['Cryptographic Double-Billing Prevention', 'HSN 998599 Tax Invariants', 'Automated GST Proforma'],
        tags: ['Enterprise Billing', 'REST APIs', 'Supabase', 'Prisma ORM', 'IGST Compliance']
      }
    ]
  },
  {
    id: 'databases-systems',
    title: 'Databases & Systems Programming',
    subtitle: 'Relational 3NF Normalization & 50Hz Telematics',
    lead: 'Engineering C systems cores, normalized relational database schemas, SocketCAN telematics, and crash-resilient storage.',
    badge: 'Domain 04 · Systems & DB',
    color: 'from-amber-500 to-orange-600',
    skills: [
      {
        id: 'c99-core-engine',
        name: 'C99 Systems Core & Binary Search Indexing',
        domainId: 'databases-systems',
        level: 'Core Architecture',
        description: 'High-performance C99 core engine utilizing custom binary file persistence and binary search indexing for O(log N) record retrieval.',
        evidenceRepo: 'gas-agency-management-system',
        evidenceProof: 'O(log N) record retrieval across 10,000+ consumer records with zero dynamic heap leak',
        repoUrl: 'https://github.com/BishnoiNaveen/gas-agency-management-system',
        verifiedInvariants: ['O(log N) Binary Search', 'Valgrind 0-Byte Leak', 'POSIX Atomic Rename File Commit'],
        tags: ['C99', 'POSIX Syscalls', 'Binary File I/O', 'Data Structures', 'Linux']
      },
      {
        id: 'socketcan-telematics',
        name: 'SocketCAN 50Hz Telematics & Fieldy FSM',
        domainId: 'databases-systems',
        level: 'Production Engineering',
        description: 'Engineered live Telematics View monitoring real-time GPS reverse-geocoded navigation and 50Hz SocketCAN machinery telemetry across 326+ assets.',
        evidenceRepo: 'KRONE Production',
        evidenceProof: 'Integrated Fieldy FSM cloud microservices across 199+ API endpoints (Accounting, Job, Tracking, Attendance)',
        verifiedInvariants: ['50Hz Continuous Stream', 'GPS Reverse Geocoding', '326+ Assets Concurrently Tracked'],
        tags: ['SocketCAN', 'Fieldy FSM', 'CAN Bus', 'IoT Telematics', 'Linux/Bash']
      },
      {
        id: 'relational-db-3nf',
        name: 'PostgreSQL, MySQL & 3NF Schema Normalization',
        domainId: 'databases-systems',
        level: 'Production Invariant',
        description: 'Designing normalized 3NF relational schemas, complex SQL queries, index optimization, and transactional ACID guarantees.',
        evidenceRepo: 'smart-task-system & GAMS',
        evidenceProof: 'Prisma ORM migrations and normalized MySQL schemas with foreign keys and ACID transactions',
        verifiedInvariants: ['3NF Normalization', 'ACID Transactions', 'Zero Orphaned Foreign Keys'],
        tags: ['PostgreSQL', 'MySQL', 'Supabase', 'Prisma ORM', 'SQLite', 'Complex SQL']
      }
    ]
  },
  {
    id: 'fullstack-web',
    title: 'Full-Stack Web Technologies',
    subtitle: 'Modern TypeScript, Next.js, React & API Architectures',
    lead: 'Building fast, accessible, responsive full-stack applications with clean MVC architecture and comprehensive test coverage.',
    badge: 'Domain 05 · Full-Stack',
    color: 'from-cyan-500 to-blue-600',
    skills: [
      {
        id: 'nextjs-fullstack',
        name: 'Next.js, TypeScript & React.js',
        domainId: 'fullstack-web',
        level: 'Production Engineering',
        description: 'Building full-stack web applications with Next.js App Router, TypeScript, server actions, and responsive Tailwind styling.',
        evidenceRepo: 'smart-task-system',
        evidenceProof: 'MVC architecture with JWT auth guards, RESTful API routes, and background reminder worker',
        repoUrl: 'https://github.com/BishnoiNaveen/smart-task-system',
        verifiedInvariants: ['Strict TypeScript Typing', 'Sub-100ms API Latency', 'Node-Cron Background Worker'],
        tags: ['Next.js', 'TypeScript', 'React.js', 'Tailwind CSS', 'Node.js', 'Express.js']
      },
      {
        id: 'web-portals-ui',
        name: 'Responsive Web Portals & Form Validation',
        domainId: 'fullstack-web',
        level: 'Production Invariant',
        description: 'Developing high-conversion portals with interactive equipment booking flows, subsidy calculation modals, and clean UI components.',
        evidenceRepo: 'agribridge-india',
        evidenceProof: 'Client-side state handling and form validation routines for machine service bookings and inquiry pipelines',
        repoUrl: 'https://github.com/BishnoiNaveen/agribridge-india',
        verifiedInvariants: ['100% Mobile Responsive', 'Frictionless Booking Pipeline', 'Client-Side Form Sanitization'],
        tags: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Vite', 'Postman', 'Swagger/OpenAPI']
      }
    ]
  }
];
