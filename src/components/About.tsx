import React from 'react';

export default function About() {
  return (
    <div className="w-full flex flex-col pt-32 pb-24 border-t border-white/5" id="about">
      {/* WHO I AM */}
      <section className="w-full max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
          <div className="flex-1 w-full">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-panel group relative">
              <img src="/images/portfolio_hero.jpg" alt="Naveen Bishnoi" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out grayscale hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
            </div>
          </div>
          
          <div className="flex-[1.5] flex flex-col justify-center pt-8">
            <h2 className="editorial-headline text-white mb-12">WHO I AM</h2>
            <div className="prose prose-xl dark:prose-invert max-w-none">
              <p className="text-2xl leading-relaxed text-zinc-300 font-light">
                I am Naveen Bishnoi, an AI Automation Engineer & Software Architect. My expertise lies in designing multi-agent systems, event-driven architectures, and high-throughput pipelines that scale effortlessly.
              </p>
              <p className="text-2xl leading-relaxed text-zinc-400 font-light mt-8">
                I believe that complex technical problems require elegant, restrained solutions. From architecting autonomous supply chain orchestration to building real-time IoT fleet telemetry, my focus is always on delivering systems that are highly reliable and brilliantly simple.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-6 border-b border-white/10 pb-4">Frameworks & Languages</h3>
                <ul className="flex flex-col gap-3 text-lg font-light text-zinc-300">
                  <li>React & Astro</li>
                  <li>TypeScript & Node.js</li>
                  <li>Python & FastAPI</li>
                  <li>Framer Motion</li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-6 border-b border-white/10 pb-4">Data & AI Agents</h3>
                <ul className="flex flex-col gap-3 text-lg font-light text-zinc-300">
                  <li>LangChain & Autogen</li>
                  <li>PostgreSQL & Redis</li>
                  <li>Kafka Event Streams</li>
                  <li>Vector Databases</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I THINK */}
      <section className="w-full mt-48 py-32 bg-black border-y border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-violet-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-24 tracking-tight">THE PROCESS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            <div className="flex flex-col border-t border-white/10 pt-8">
              <span className="text-6xl font-black text-white/5 mb-6">01</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">UNDERSTAND</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">Extracting the true nature of the problem from the noise. I focus on the root cause to ensure the architecture solves the actual business need.</p>
            </div>
            
            <div className="flex flex-col border-t border-white/10 pt-8">
              <span className="text-6xl font-black text-white/5 mb-6">02</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">ARCHITECT</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">Designing systems that scale gracefully. Establishing the core invariants and making the right trade-offs so the system can evolve without collapsing.</p>
            </div>
            
            <div className="flex flex-col border-t border-white/10 pt-8">
              <span className="text-6xl font-black text-white/5 mb-6">03</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">BUILD</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">Executing with precision. Writing clean, maintainable, and self-documenting code across the entire stack, from database to UI.</p>
            </div>
            
            <div className="flex flex-col border-t border-white/10 pt-8">
              <span className="text-6xl font-black text-white/5 mb-6">04</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">VERIFY</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">Testing rigorously. Edge cases are where systems fail; they must be anticipated, handled, and verified through empirical metrics.</p>
            </div>
            
            <div className="flex flex-col border-t border-white/10 pt-8">
              <span className="text-6xl font-black text-white/5 mb-6">05</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">SHIP</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">Deploying with confidence. Delivering a polished, highly performant product into production with zero downtime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
