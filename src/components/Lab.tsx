import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Lab() {
  return (
    <section className="w-full py-24 bg-[#F5F5F7] dark:bg-[#111111]" id="lab">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="editorial-headline text-[#1D1D1F] dark:text-[#F5F5F7] mb-4">LAB</h2>
            <p className="text-xl text-[#6E6E73] dark:text-[#86868B] font-light max-w-xl">
              A space for unconstrained technical exploration, experiments, and prototypes that push the boundaries of what's possible.
            </p>
          </div>
          <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all mb-2">
            View All Experiments
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lab Item 1 */}
          <div className="group relative aspect-video bg-black/5 dark:bg-white/5 overflow-hidden rounded-2xl flex flex-col justify-end p-8 transition-transform hover:-translate-y-2 duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img src="/images/lab-agent.jpg" alt="Autonomous AI Agents" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 z-0" />
            <div className="relative z-20 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-xs font-mono text-white/70 uppercase tracking-widest mb-2 block">Experiment 01</span>
              <h3 className="text-2xl font-bold text-white mb-2">Autonomous Multi-Agent Swarms</h3>
              <p className="text-white/80 font-light text-sm">Testing emergent behaviors in decentralized agent networks.</p>
            </div>
          </div>

          {/* Lab Item 2 */}
          <div className="group relative aspect-video bg-black/5 dark:bg-white/5 overflow-hidden rounded-2xl flex flex-col justify-end p-8 transition-transform hover:-translate-y-2 duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img src="/images/lab-webgl.jpg" alt="WebGL Fluids" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 z-0" />
            <div className="relative z-20 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-xs font-mono text-white/70 uppercase tracking-widest mb-2 block">Experiment 02</span>
              <h3 className="text-2xl font-bold text-white mb-2">WebGL Fluid Dynamics</h3>
              <p className="text-white/80 font-light text-sm">Real-time simulation of fluid dynamics using WebGL compute shaders.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
