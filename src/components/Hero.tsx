import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background large text for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap select-none pointer-events-none tracking-tighter">
        ENGINEER
      </div>

      <div className="max-w-[90rem] mx-auto w-full px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 z-10">
        
        {/* Left Side: Typography */}
        <div className="flex-1 flex flex-col items-start justify-center pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-zinc-300 uppercase tracking-widest">Available for new opportunities</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8"
          >
            NAVEEN <br />
            BISHNOI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-zinc-400 font-light max-w-xl leading-relaxed mb-12"
          >
            Software Architect & AI Automation Engineer crafting high-performance systems and intelligent digital experiences.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6"
          >
            <a 
              href="#work" 
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              Explore Selected Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="https://github.com/BishnoiNaveen" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-center gap-3 px-6 py-4 text-zinc-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span className="font-medium">GitHub</span>
            </a>
          </motion.div>
        </div>

        {/* Right Side: Massive Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full lg:h-[80vh] flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-lg lg:max-w-none aspect-[3/4] lg:aspect-auto lg:h-[90%] rounded-3xl overflow-hidden glass-panel group">
            <img 
              src="/images/portfolio_hero.jpg" 
              alt="Naveen Bishnoi"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out grayscale-[20%]"
            />
            {/* Elegant lighting overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
