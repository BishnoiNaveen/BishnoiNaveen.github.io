import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Magnetic from './Magnetic';

const skills = [
  {
    category: "Cognitive Architectures",
    items: ["Agentic AI Systems", "Autonomous Looping Prompts", "ReAct Frameworks", "Multi-Agent Orchestration"]
  },
  {
    category: "Generative Workflows",
    items: ["Prompt Architecture", "RAG / Graph RAG", "LLM Fine-Tuning", "Semantic Caching"]
  },
  {
    category: "Graphical & System Engineering",
    items: ["Node-based Workflows", "Distributed Systems", "Kafka / Event-driven", "High-performance APIs"]
  }
];

export default function HomeSkills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section className="w-full py-32 relative z-10" ref={ref}>
      <div className="max-w-[100rem] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          <div className="lg:col-span-5 flex flex-col justify-start">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-tight"
            >
              Engineering <br/><span className="text-zinc-500">Autonomy.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="mt-6 text-zinc-400 text-lg leading-relaxed max-w-md"
            >
              I don't just write code; I architect autonomous cognitive systems. From looping generative prompts to advanced graphical engineering, I build software that thinks.
            </motion.p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {skills.map((skillGroup, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase border-b border-white/10 pb-4">
                  {skillGroup.category}
                </h3>
                <ul className="flex flex-col gap-3 mt-2">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="text-lg md:text-xl font-medium tracking-tight hover:text-emerald-400 transition-colors cursor-default">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
