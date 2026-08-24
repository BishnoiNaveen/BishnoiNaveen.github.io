import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Lab() {
  return (
    <section className="w-full py-32 bg-[#09090b]" id="lab">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">THE LAB</h2>
            <p className="text-xl text-zinc-400 font-light max-w-2xl">
              An unconstrained space for technical exploration, prototyping, and pushing the boundaries of autonomous agents and interactive experiences.
            </p>
          </div>
          <a href="https://github.com/BishnoiNaveen" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 text-white font-semibold text-sm tracking-wide uppercase transition-all mb-2">
            <span className="border-b border-transparent group-hover:border-white transition-colors pb-1">View All Experiments</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lab Item 1 */}
          <div className="group relative aspect-[16/10] bg-zinc-900 overflow-hidden rounded-2xl flex flex-col justify-end p-8 sm:p-12 transition-transform hover:-translate-y-2 duration-700 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>
            <img src="/images/lab-agent.jpg" alt="Autonomous AI Agents" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-[2s] ease-out z-0" />
            <div className="relative z-20 translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-700">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Experiment 01</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Multi-Agent Swarms</h3>
              <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">Testing emergent reasoning and consensus protocols in decentralized AI agent networks.</p>
            </div>
          </div>

          {/* Lab Item 2 */}
          <div className="group relative aspect-[16/10] bg-zinc-900 overflow-hidden rounded-2xl flex flex-col justify-end p-8 sm:p-12 transition-transform hover:-translate-y-2 duration-700 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>
            <img src="/images/lab-webgl.jpg" alt="WebGL Fluids" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-[2s] ease-out z-0" />
            <div className="relative z-20 translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-700">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Experiment 02</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">WebGL Fluid Dynamics</h3>
              <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">Real-time GPU simulation of fluid dynamics using WebGL compute shaders and rendering pipelines.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
