/**
 * src/data/bio.ts — Master Biographical & Career Narrative Dataset
 * Author: Naveen Bishnoi
 * Standard: Radical Honesty, Verified Production Engineering, Systems Craftsmanship
 */

export interface TimelineEntry {
  id: string;
  tier: 1 | 2 | 3;
  tierLabel: 'Corporate Engineering' | 'Academic Foundation' | 'Industrial Internship';
  title: string;
  organization: string;
  location: string;
  period: string;
  badge: string;
  summary: string;
  responsibilities: string[];
  keyInvariants: string[];
  technologies: string[];
  verifiedProof?: {
    label: string;
    url?: string;
  };
}

export interface PhilosophyPrinciple {
  number: string;
  title: string;
  subtitle: string;
  lead: string;
  description: string;
  invariant: string;
}

export interface BioData {
  name: string;
  headline: string;
  subtitle: string;
  location: string;
  timezone: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  leadQuote: string;
  summary: string;
  narrativeSections: {
    id: string;
    title: string;
    paragraphs: string[];
  }[];
  principles: PhilosophyPrinciple[];
  timeline: TimelineEntry[];
}

export const bioData: BioData = {
  name: 'Naveen Bishnoi',
  headline: 'AI Systems & Cloud Backend Engineer | Python Automation & Systems Specialist',
  subtitle: 'Building automated enterprise billing portals, serverless internal intranet systems, 50Hz machine telematics microservices, and AI-driven Python pipelines.',
  location: 'Punjab / Delhi NCR, India',
  timezone: 'IST (UTC+5:30)',
  phone: '+91 9478334329',
  email: '0029bishnoinaveen@gmail.com',
  github: 'https://github.com/BishnoiNaveen',
  linkedin: 'https://www.linkedin.com/in/naveen-bishnoi-b0b00941a/',
  website: 'https://bishnoinaveen.github.io',
  leadQuote: 'From low-level systems logic and Python scripts to real-world edge telematics and cloud microservices: building software that runs quietly, reliably, and without guesswork.',
  summary: 'Results-driven AI Systems and Cloud Backend Engineer with 5+ months of mission-critical production experience at KRONE Agriculture India and a foundational software engineering internship at ITTECHXPERT. Proven track record architecting automated enterprise billing portals, serverless internal intranet systems (KIN OneHub), and real-time machinery telematics monitoring solutions via Fieldy FSM REST microservices. Industry-certified by IBM (Python for Data Science) and Deloitte (Data Analytics & Forensic Technology). Deep expertise in Python automation, relational database engineering (PostgreSQL, MySQL, Supabase), API integrations, and agentic LLM workflows. Final-year Bachelor of Computer Applications (BCA) candidate at Panjab University (Batch 2026).',

  narrativeSections: [
    {
      id: 'origin-systems',
      title: '01. Plain Engineering & Real-World Grounding',
      paragraphs: [
        'My journey into software engineering started with a simple belief: code is only good if it solves a real business problem without breaking down in production. Whether writing C systems code or automated Python scripts, I focus on clean logic, solid error handling, and predictable behavior.',
        'At Panjab University (DAV College Abohar), I built a deep foundation in relational database management, data structures, operating systems, and computer networks. This academic training taught me how memory, filesystems, and network packets work under the hood.'
      ]
    },
    {
      id: 'krone-production',
      title: '02. Production Engineering at KRONE Agriculture India',
      paragraphs: [
        'At KRONE Agriculture India, I have worked across the entire engineering lifecycle: from serverless edge portals and enterprise billing systems to live machinery telematics.',
        'I architected the enterprise billing platform (billing.kroneindia.com) for high-capacity harvesting machinery across tier-1 enterprise clients like Reliance Industries Limited, Bio Fuel Corporation, VERBIO, and Landforce. This system automated monthly proforma and tax invoices with HSN 998599, 18% IGST, and cryptographic double-billing prevention.',
        'I also deployed the KIN OneHub employee intranet on Cloudflare Workers (serverless edge) with Supabase PostgreSQL and automated document storage, and integrated 199+ Fieldy FSM REST endpoints to monitor 50Hz SocketCAN telematics across 326+ commercial assets in real-time.'
      ]
    },
    {
      id: 'python-automation',
      title: '03. Python Automation & Data Accuracy',
      paragraphs: [
        'One of my major contributions at KRONE was engineering an autonomous 34-column Python reporting engine using pandas and NumPy. It automatically consolidated technician field logs, trip odometers, and billing summaries across 520+ service jobs, reconciling 350+ historical records with 100% financial audit accuracy.',
        'Additionally, I developed structured JSON pipelines to process complex multilingual field service reports (Hindi/English technician notes), removing manual key-person billing dependencies and dramatically speeding up data processing.'
      ]
    },
    {
      id: 'software-craft',
      title: '04. Craftsmanship & Security Hygiene',
      paragraphs: [
        'Good software requires strict discipline. I enforce environment-isolated credential vaults, automated cron background synchronizations, and pre-deployment validation test suites protecting API gateways, production tokens, and database service roles.',
        'I write plain, maintainable code with clear documentation so any engineer can step in and understand it immediately. No unnecessary buzzwords, no bloated complexity — just clean, reliable software.'
      ]
    }
  ],

  principles: [
    {
      number: '01',
      title: 'Zero Guesswork',
      subtitle: 'Empirical Verification First',
      lead: 'Never assume software behavior — test it with real data and verify state on disk.',
      description: 'Whether it is a financial tax invoice calculation or an odometer reading from a harvester CAN bus, every data point must be verified against source records before mutating state.',
      invariant: 'Verify(Source_Record) ∧ Audit_Clean(Data) ⟹ Commit(Database)'
    },
    {
      number: '02',
      title: 'Reliable Under Network Drops',
      subtitle: 'Offline-First & Graceful Recovery',
      lead: 'Systems running in the field must expect connection failures and handle them cleanly.',
      description: 'Harvesters and field technicians operate in rural areas where network coverage fluctuates. Services must buffer data safely, prevent duplicate writes, and sync atomically upon reconnection.',
      invariant: 'Network_Drop ⟹ Buffer_Locally(Ring_Buffer) ∧ Zero_Loss(Packets)'
    },
    {
      number: '03',
      title: 'Security & Secret Hygiene',
      subtitle: 'Environment Isolation & Role Guards',
      lead: 'Production tokens, service roles, and API gateways must stay strictly isolated.',
      description: 'Enforce environment-isolated credential vaults, automated background token rotations, and tight schema-level row permissions to guarantee financial and operational data security.',
      invariant: 'Vault_Isolated(Keys) ∧ RBAC_Enforced(User) ⟹ Authorized_Access'
    }
  ],

  timeline: [
    {
      id: 'krone-agriculture',
      tier: 1,
      tierLabel: 'Corporate Engineering',
      title: 'AI Systems & Cloud Backend Automation Engineer',
      organization: 'KRONE Agriculture India Pvt. Ltd.',
      location: 'Punjab / Gurugram, India',
      period: 'July 2026 — Present (5 Months)',
      badge: 'Production Engineering',
      summary: 'Architecting automated enterprise billing portals, serverless internal intranet systems (KIN OneHub), and real-time machinery telematics monitoring solutions via Fieldy FSM REST microservices.',
      responsibilities: [
        'Architected and engineered an automated enterprise billing and invoicing platform (billing.kroneindia.com) for high-capacity harvesting/baling machinery across tier-1 enterprise clients (Reliance Industries Limited, Bio Fuel Corporation, VERBIO, Landforce), automating monthly proforma and tax invoices with HSN 998599, 18% IGST, and cryptographic double-billing prevention.',
        'Set up and deployed internal portal infrastructure, including the KIN OneHub employee intranet on Cloudflare Workers (serverless edge) with a Supabase PostgreSQL backend and automated document storage bucket (kin-documents), unifying internal service dispatch, field reporting, and operational records.',
        'Configured and integrated the Krone Green Portal with Fieldy FSM cloud microservices (Accounting, Job, Tracking, and Attendance across 199+ API endpoints); engineered the live Telematics View monitoring real-time GPS reverse-geocoded navigation, customer site check-in/out timestamps, and 50Hz SocketCAN machinery telemetry across 326+ commercial assets.',
        'Built an automated Python (pandas, NumPy) reporting engine consolidating technician logs, trip odometers, and billing summaries across 520+ service jobs, reconciling 350+ historical records with 100% financial audit accuracy.',
        'Designed structured JSON data extraction workflows for processing complex multilingual field service reports (Hindi/English technician notes), boosting data ingestion speed and eliminating manual key-person billing dependencies.',
        'Enforced environment-isolated credential vaults, automated cron background synchronizations, and pre-deployment validation test suites protecting API gateways, production tokens, and Supabase service roles.'
      ],
      keyInvariants: [
        'Automated Enterprise Invoicing (HSN 998599, 18% IGST)',
        '326+ Machines Real-Time 50Hz SocketCAN Telematics',
        '520+ Service Jobs Reconciled with 100% Financial Accuracy'
      ],
      technologies: ['Python', 'pandas', 'NumPy', 'Cloudflare Workers', 'Supabase PostgreSQL', 'Prisma ORM', 'Fieldy FSM REST APIs', 'SocketCAN 50Hz', 'Docker', 'Linux/Bash'],
      verifiedProof: {
        label: 'Production Deployment & Employment Verification'
      }
    },
    {
      id: 'ittechxpert',
      tier: 3,
      tierLabel: 'Industrial Internship',
      title: 'Intern Developer & AI Development Assistant',
      organization: 'ITTECHXPERT',
      location: 'Abohar, Punjab, India',
      period: 'June 2025 — July 2025',
      badge: 'Software Internship',
      summary: 'Hands-on enterprise software development building clean client-facing web modules, relational database schemas, and AI-assisted engineering workflows.',
      responsibilities: [
        'Built clean, modular client-facing frontend and backend features using Java, PHP, MySQL, HTML5, and CSS3 for business enterprise client applications.',
        'Utilized modern AI development environments (Cursor, Claude, ChatGPT) to write clean boilerplate code, accelerate debugging, and automate unit test routines.',
        'Designed normalized 3NF MySQL database tables and executed optimized SQL queries for customer invoicing, account records, and billing summaries.'
      ],
      keyInvariants: [
        'Normalized 3NF MySQL Schema Design',
        'AI-Assisted Accelerated Development & Unit Testing',
        'Enterprise Invoicing & Customer Ledger Queries'
      ],
      technologies: ['Java', 'PHP', 'MySQL', 'HTML5', 'CSS3', 'SQL', 'Cursor', 'Claude', 'ChatGPT'],
      verifiedProof: {
        label: 'Official ITTECHXPERT Certificate (Grade: Excellent)'
      }
    },
    {
      id: 'bca-degree',
      tier: 2,
      tierLabel: 'Academic Foundation',
      title: 'Bachelor of Computer Applications (BCA) – Final Year',
      organization: 'DAV College Abohar (Panjab University, Chandigarh)',
      location: 'Punjab, India',
      period: '2023 — 2026 (Batch 2026)',
      badge: 'Academic Foundation',
      summary: 'Rigorous foundation in computer science, database management systems (DBMS), data structures, algorithms, operating systems, and computer networks.',
      responsibilities: [
        'Completed advanced coursework: Database Management Systems (DBMS), Advanced SQL Querying, Data Structures & Algorithms, Python Programming, Computer Networks, Operating Systems, Artificial Intelligence Fundamentals.',
        'Built practical engineering projects including the Gas Agency Management System (C99 core ERP) and Smart Task System (Next.js full-stack app).',
        'Maintained strong academic standing across all semesters.'
      ],
      keyInvariants: [
        'Core Operating Systems & Memory Management',
        'Relational Database Invariants & SQL Schema Design',
        'Data Structures, Algorithms & Computational Complexity'
      ],
      technologies: ['C/C++', 'Python', 'Java', 'SQL', 'PostgreSQL', 'Data Structures', 'Linux'],
      verifiedProof: {
        label: 'Panjab University BCA Enrollment & Transcripts'
      }
    }
  ]
};
