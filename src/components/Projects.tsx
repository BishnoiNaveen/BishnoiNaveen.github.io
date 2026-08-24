import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const isEven = index % 2 === 0;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="w-full relative py-12">
      <div className={`max-w-[100rem] mx-auto px-6 md:px-12 flex flex-col-reverse ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
        
        {/* Text Content */}
        <div className="flex-[0.8] flex flex-col items-start z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.19, 1.0, 0.22, 1.0] }}
            className="w-full"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl md:text-5xl font-black text-white/10">{project.id}</span>
              <div className="h-px bg-white/20 flex-1"></div>
              <span className="text-zinc-500 font-bold tracking-widest uppercase text-xs md:text-sm">
                {project.subtitle}
              </span>
            </div>
            
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              {project.title}
            </h3>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-light">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {project.tech.map((t: string) => (
                <span key={t} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-zinc-300 shadow-xl">
                  {t}
                </span>
              ))}
            </div>

            <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-white font-bold text-sm tracking-[0.2em] uppercase transition-all overflow-hidden w-max">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500">
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <span className="relative">
                <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></span>
                View Case Study
              </span>
            </a>
          </motion.div>
        </div>
        
        {/* Image Content with Parallax */}
        <div className="flex-[1.2] w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
          >
            <motion.div style={{ y: yImage }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100" 
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

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
      <div className="w-full max-w-[100rem] mx-auto px-6 md:px-12 mb-16 md:mb-32 overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: 100, rotateX: 45 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="text-[12vw] lg:text-[8rem] font-black text-white tracking-tighter leading-[0.85] uppercase"
        >
          Selected<br />Work
        </motion.h2>
      </div>

      <div className="w-full flex flex-col gap-24 md:gap-40 lg:gap-56">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
