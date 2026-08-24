import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: "01",
      title: "KRONE IoT Telemetry",
      subtitle: "Predictive Analytics & Fleet Management",
      description: "Architected a real-time IoT fleet telemetry platform capable of ingesting high-throughput sensor data. Implemented predictive analytics to reduce downtime and optimize asset allocation across global fleets.",
      tech: ["Python", "Kafka", "PostgreSQL", "FastAPI"],
      image: "/images/krone-telematics.jpg"
    },
    {
      id: "02",
      title: "AEONIS OPS",
      subtitle: "Autonomous Supply Chain Orchestration",
      description: "Designed a comprehensive orchestration platform that unifies disparate data streams into a cohesive analytics dashboard. Utilizes multi-agent logic to automate complex supply chain decisions in real-time.",
      tech: ["React", "TypeScript", "Node.js", "Redis"],
      image: "/images/aeonis-ops.jpg"
    },
    {
      id: "03",
      title: "Ultron Framework",
      subtitle: "Multi-Agent Consensus & Execution",
      description: "Developed a distributed execution DAG framework for autonomous AI agents. Enabled complex reasoning and consensus mechanisms across isolated agent nodes for high-reliability automated workflows.",
      tech: ["LangChain", "Autogen", "Python", "Vector DB"],
      image: "/images/hermes-agent.jpg"
    },
    {
      id: "04",
      title: "Medallion Stream",
      subtitle: "Real-Time Event Architecture",
      description: "Built a massive-scale event-driven architecture designed to process millions of concurrent events. Ensured sub-second latency for mission-critical operations and real-time dashboard updates.",
      tech: ["System Architecture", "React", "Docker", "AWS"],
      image: "/images/gams-terminal.jpg" 
    }
  ];

  return (
    <div className="w-full flex flex-col pt-24 md:pt-32 pb-24" id="work">
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 mb-16 md:mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="editorial-headline text-white text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]"
        >
          SELECTED<br />WORK
        </motion.h2>
      </div>

      <div className="w-full flex flex-col gap-24 md:gap-32 lg:gap-48">
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={project.id} className="w-full relative">
              <div className={`max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col-reverse ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                
                {/* Text Content */}
                <div className="flex-1 flex flex-col items-start z-10 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <span className="text-zinc-500 font-bold tracking-widest uppercase text-xs md:text-sm mb-6 block border-b border-white/10 pb-4 w-full">
                      {project.id} &mdash; {project.subtitle}
                    </span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-8 md:mb-10 leading-relaxed font-light">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] md:text-xs font-medium text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 text-white font-semibold text-xs md:text-sm tracking-wide uppercase transition-all">
                      <span className="border-b border-transparent group-hover:border-white transition-colors pb-1">View Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </a>
                  </motion.div>
                </div>
                
                {/* Image Content */}
                <div className="flex-1 w-full">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden glass-panel group"
                  >
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700"></div>
                  </motion.div>
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
