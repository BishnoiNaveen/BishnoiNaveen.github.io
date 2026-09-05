import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

export default function LabComponent() {
  const experiments = [
    {
      id: "EXP-01",
      title: "Multi-Agent Consensus Swarm",
      status: "Active",
      description: "A sandbox environment testing how multiple LLM agents negotiate and reach consensus on complex supply-chain routing problems without human intervention."
    },
    {
      id: "EXP-02",
      title: "Semantic Cache Proxy",
      status: "Deployed",
      description: "Custom reverse-proxy that intercepts LLM API calls and serves vector-matched responses from Redis in <20ms, cutting token costs by 40%."
    },
    {
      id: "EXP-03",
      title: "WebGL Shader Pipelines",
      status: "Archived",
      description: "Writing raw GLSL shaders to render 3D data-visualizations directly in the browser using mathematical distance fields."
    }
  ];

  return (
    <div className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-12 pb-24 text-white">
      
      <header className="mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-6"
        >
          The <span className="text-zinc-500">Lab.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl text-zinc-400 font-light max-w-2xl"
        >
          An isolated environment for experimental cognitive architectures, agentic workflows, and high-performance engineering prototypes.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
            className="group p-8 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-emerald-500/50 transition-colors duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-1000"></div>
            
            <div className="flex justify-between items-start mb-12">
              <span className="text-xs font-mono text-zinc-500 tracking-widest">{exp.id}</span>
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${exp.status === 'Active' ? 'border-emerald-500/30 text-emerald-400' : 'border-zinc-700 text-zinc-500'}`}>
                {exp.status}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{exp.title}</h3>
            <p className="text-zinc-400 font-light leading-relaxed mb-12">
              {exp.description}
            </p>

            <div className="mt-auto flex items-center justify-between text-zinc-500 group-hover:text-white transition-colors cursor-pointer">
              <span className="text-sm font-bold uppercase tracking-widest">Inspect Source</span>
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}