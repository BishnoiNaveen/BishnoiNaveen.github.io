import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeComponent() {
  const experienceJSON = {
    "engineer": "Naveen Bishnoi",
    "role": "AI Systems & Cloud Backend Engineer",
    "location": "Punjab / Delhi NCR, India",
    "contact": {
      "phone": "+91 9478334329",
      "email": "0029bishnoinaveen@gmail.com",
      "linkedin": "https://www.linkedin.com/in/naveen-bishnoi-b0b00941a/",
      "github": "https://github.com/BishnoiNaveen"
    },
    "focus": ["AI Systems & Automation", "Cloud Backend & Edge Microservices", "Data Engineering & Telematics"],
    "experience": [
      {
        "company": "KRONE Agriculture India Pvt. Ltd.",
        "title": "AI Systems & Cloud Backend Engineer",
        "period": "July 2026 – Present (5 Months)",
        "modules": [
          "Enterprise Billing Engine (billing.kroneindia.com for Reliance, Bio Fuel Corp, VERBIO, Landforce)",
          "KIN OneHub Employee Intranet on Cloudflare Workers edge & Supabase PostgreSQL",
          "Fieldy FSM Microservices (199+ REST endpoints) & 50Hz SocketCAN telematics across 326+ assets",
          "Forensic Python (pandas, NumPy) reporting engine reconciling 520+ service jobs with 100% financial accuracy"
        ]
      },
      {
        "company": "ITTECHXPERT",
        "title": "Full-Stack Software Engineering Intern",
        "period": "June 2025 – July 2025 (Abohar, Punjab)",
        "modules": [
          "Core Java, PHP, MySQL 3NF database design",
          "Accelerated development workflows using AI tooling (Cursor, Claude, ChatGPT)"
        ]
      }
    ],
    "education": {
      "degree": "Bachelor of Computer Applications (BCA)",
      "institution": "Panjab University (DAV College Abohar)",
      "batch": "2026"
    },
    "certifications": [
      "IBM Python for Data Science (Credly: ea12611d-75c0-4282-8bf5-baaf48aa0cca)",
      "Deloitte Data Analytics Job Simulation (Forage: wMeKLdvmcywB24F9m)"
    ],
    "tech_stack": {
      "languages": ["Python", "TypeScript", "JavaScript", "C99", "SQL", "HTML5/CSS3"],
      "frameworks": ["FastAPI", "Next.js", "Astro", "React", "Node.js", "Express", "Tailwind CSS"],
      "cloud_data": ["PostgreSQL", "Supabase", "Cloudflare Workers", "Prisma ORM", "Docker", "SocketCAN"]
    }
  };

  return (
    <div className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
      
      {/* Left Column: Human Narrative */}
      <div className="flex flex-col">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
        >
          Curriculum <br/><span className="text-zinc-500">Vitae.</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="prose prose-invert prose-lg text-zinc-400"
        >
          <p className="font-light leading-relaxed mb-6">
            AI Systems & Cloud Backend Engineer with 5+ months production experience at KRONE Agriculture India and an engineering internship at ITTECHXPERT.
          </p>
          <p className="font-light leading-relaxed mb-12">
            Final year Bachelor of Computer Applications (BCA) candidate at Panjab University (Batch 2026). Specializing in AI-driven automation, edge microservices, forensic data reconciliation, and high-performance full-stack systems.
          </p>

          <a 
            href="/naveen_bishnoi_resume.pdf" 
            download="naveen_bishnoi_resume.pdf" 
            target="_blank" 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors"
          >
            Download naveen_bishnoi_resume.pdf
          </a>
        </motion.div>
      </div>

      {/* Right Column: Code/Terminal View */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto shadow-2xl relative"
      >
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        
        <pre className="text-zinc-300 whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceJSON, null, 2)
            .replace(/"(.*?)":/g, '<span class="text-emerald-400">"$1"</span>:')
            .replace(/"(.*?)"/g, '<span class="text-zinc-400">"$1"</span>')
          }}></code>
        </pre>
      </motion.div>

    </div>
  );
}