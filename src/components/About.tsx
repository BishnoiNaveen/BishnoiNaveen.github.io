import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="w-full flex flex-col gap-32 py-24" id="about">
      {/* WHO I AM */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <h2 className="editorial-headline text-[#1D1D1F] dark:text-[#F5F5F7] mb-8">WHO I AM</h2>
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-xl leading-relaxed text-[#6E6E73] dark:text-[#86868B] font-light">
                I am a software engineer with a deep focus on crafting intelligent systems and refined user experiences. My work spans across the entire stack, but my true passion lies where complex engineering meets intuitive design.
              </p>
              <p className="text-xl leading-relaxed text-[#6E6E73] dark:text-[#86868B] font-light mt-6">
                I believe that software should not just function; it should feel inevitable. Every architectural decision, every line of code, and every interaction is an opportunity to reduce friction and bring clarity to chaos.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-square rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img src="/images/portfolio_hero.jpg" alt="Naveen Bishnoi" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW I THINK */}
      <section className="w-full bg-[#111111] dark:bg-black py-32 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="editorial-headline mb-24 text-white">HOW I THINK</h2>
          
          <div className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline border-b border-white/10 pb-8">
              <span className="text-6xl md:text-8xl font-bold text-white/20">01</span>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">UNDERSTAND</h3>
                <p className="text-xl text-white/60 font-light">Before writing a single line of code, the true nature of the problem must be understood. This means asking the hard questions and finding the root cause rather than treating the symptoms.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline border-b border-white/10 pb-8">
              <span className="text-6xl md:text-8xl font-bold text-white/20">02</span>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">ARCHITECT</h3>
                <p className="text-xl text-white/60 font-light">Design systems that scale gracefully. Architecture is about making the right trade-offs today so that the system can evolve tomorrow without collapsing under its own weight.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline border-b border-white/10 pb-8">
              <span className="text-6xl md:text-8xl font-bold text-white/20">03</span>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">BUILD</h3>
                <p className="text-xl text-white/60 font-light">Execute with precision. Write clean, maintainable, and self-documenting code. The best code is code that doesn't need to be explained.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline border-b border-white/10 pb-8">
              <span className="text-6xl md:text-8xl font-bold text-white/20">04</span>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">VERIFY</h3>
                <p className="text-xl text-white/60 font-light">Test rigorously. A system is only as good as its reliability. Edge cases are where systems fail; they must be anticipated and handled.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline">
              <span className="text-6xl md:text-8xl font-bold text-white/20">05</span>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">SHIP</h3>
                <p className="text-xl text-white/60 font-light">Deploy with confidence. Delivering a polished, performance-optimized product into the hands of users is the ultimate goal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <h2 className="editorial-headline text-[#1D1D1F] dark:text-[#F5F5F7] mb-16">EXPERTISE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-[#0071E3] mb-8 border-b border-black/10 dark:border-white/10 pb-4">SYSTEMS</h3>
            <ul className="flex flex-col gap-4 text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              <li>Cloud Architecture (AWS, GCP)</li>
              <li>Distributed Systems</li>
              <li>PostgreSQL, MongoDB</li>
              <li>Docker, Kubernetes</li>
              <li>CI/CD Pipelines</li>
              <li>System Design</li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-[#0071E3] mb-8 border-b border-black/10 dark:border-white/10 pb-4">AI & AUTOMATION</h3>
            <ul className="flex flex-col gap-4 text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              <li>Machine Learning Pipelines</li>
              <li>Large Language Models (LLMs)</li>
              <li>Prompt Engineering</li>
              <li>Workflow Automation</li>
              <li>Data Processing</li>
              <li>Python, TensorFlow, PyTorch</li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-[#0071E3] mb-8 border-b border-black/10 dark:border-white/10 pb-4">PRODUCT ENGINEERING</h3>
            <ul className="flex flex-col gap-4 text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              <li>React, Next.js</li>
              <li>TypeScript, Node.js</li>
              <li>UI/UX Implementation</li>
              <li>Performance Optimization</li>
              <li>Web Accessibility (a11y)</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
