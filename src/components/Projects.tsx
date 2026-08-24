import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Projects() {
  return (
    <div className="w-full flex flex-col gap-32 py-24" id="work">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="editorial-headline text-[#1D1D1F] dark:text-[#F5F5F7]">SELECTED WORK</h2>
      </div>

      {/* PROJECT 01: Image Right, Text Left */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col items-start">
            <span className="text-[#0071E3] font-semibold tracking-widest uppercase text-sm mb-4">01</span>
            <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-6 tracking-tight">Hermes</h3>
            <p className="text-lg text-[#6E6E73] dark:text-[#86868B] mb-8 leading-relaxed max-w-lg">
              A high-performance trading algorithm and portfolio management system, processing real-time market data to optimize asset allocation with mathematical precision.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">Python</span>
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">PostgreSQL</span>
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">Pandas</span>
            </div>
            <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all">
              View Case Study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel"
            >
              <img src="/images/hermes-agent.jpg" alt="Hermes Project" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJECT 02: Full-screen visual, text overlay */}
      <section className="w-full relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/aeonis-ops.jpg" alt="AEONIS" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-white/70 font-semibold tracking-widest uppercase text-sm mb-4">02</span>
            <h3 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">AEONIS</h3>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              A comprehensive orchestration platform that unifies disparate data streams into a cohesive analytics dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium backdrop-blur-md">React</span>
              <span className="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium backdrop-blur-md">Node.js</span>
              <span className="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium backdrop-blur-md">AWS</span>
            </div>
            <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-white font-semibold text-sm tracking-wide uppercase transition-all">
              View Case Study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* PROJECT 03: Image Left, Text Right */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel"
            >
              <img src="/images/gams-terminal.jpg" alt="GAMS" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          <div className="flex-1 flex flex-col items-start">
            <span className="text-[#0071E3] font-semibold tracking-widest uppercase text-sm mb-4">03</span>
            <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-6 tracking-tight">GAMS</h3>
            <p className="text-lg text-[#6E6E73] dark:text-[#86868B] mb-8 leading-relaxed max-w-lg">
              Next-generation identity management protocol designed for decentralized networks, ensuring secure authentication and authorization.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">Rust</span>
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">Web3</span>
              <span className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium">Cryptography</span>
            </div>
            <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all">
              View Case Study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
      
      {/* PROJECT 04: Horizontal scrolling / Wide aspect */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-[#0071E3] font-semibold tracking-widest uppercase text-sm mb-4">04</span>
            <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-6 tracking-tight">Krone Telematics</h3>
            <p className="text-lg text-[#6E6E73] dark:text-[#86868B] max-w-2xl mx-auto">
              Real-time vehicle tracking and analytics platform for fleet management.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[21/9] rounded-3xl overflow-hidden glass-panel"
          >
            <img src="/images/krone-telematics.jpg" alt="Krone Telematics" className="w-full h-full object-cover" />
          </motion.div>
          <div className="mt-8 flex justify-center">
            <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all">
              View Case Study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
