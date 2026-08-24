import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeComponent() {
  const experienceJSON = {
    "role": "Software Architect & AI Engineer",
    "location": "India",
    "focus": ["Agentic AI", "Generative Systems", "High-Performance APIs"],
    "experience": [
      {
        "company": "KRONE Agriculture",
        "title": "Software Engineer",
        "period": "Present",
        "impact": "Architected IoT telemetry pipelines and predictive analytics for fleet management."
      },
      {
        "company": "AEONIS OPS",
        "title": "Lead Developer",
        "period": "Previous",
        "impact": "Built autonomous supply chain orchestration systems using React and Node.js."
      }
    ],
    "tech_stack": {
      "languages": ["Python", "TypeScript", "SQL"],
      "frameworks": ["React", "Astro", "FastAPI", "LangChain"],
      "systems": ["Kafka", "Docker", "PostgreSQL", "Redis"]
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
            I specialize in bridging the gap between raw algorithmic power and human-centric design. 
            My work focuses on building <strong>Autonomous Systems</strong> and <strong>Agentic AI</strong> architectures that scale securely.
          </p>
          <p className="font-light leading-relaxed mb-12">
            Beyond writing code, I focus on system design, data orchestration, and crafting highly optimized user interfaces that feel instantaneous.
          </p>

          <a href="/Naveen_Bishnoi_Resume.pdf" target="_blank" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors">
            Download PDF
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

      {/* Deep Scrolling Section: Core Philosophy */}
      <div className="col-span-1 lg:col-span-2 mt-24 border-t border-white/10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">01. Autonomous By Default</h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              I believe software should not just react; it should think. My architectures prioritize self-healing, multi-agent consensus, and automated failovers before a human ever receives an alert.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">02. Uncompromising Performance</h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              Latency is a product killer. From sub-200ms Kafka streams to 120fps WebGL interfaces, I engineer systems that feel instantaneous at every layer of the stack.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">03. Radical Transparency</h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              No black boxes. I design AI systems and architectures with absolute observability, ensuring every decision, token, and latency spike is logged, analyzed, and understood.
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
