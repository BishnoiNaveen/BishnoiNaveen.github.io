import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between min-h-[85vh] gap-12 lg:gap-8 pt-24 pb-12">
      {/* Left Column - Typography */}
      <div className="flex-1 flex flex-col justify-center items-start z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h2 className="text-sm md:text-base font-semibold tracking-widest uppercase text-gray-500 mb-2">
            Naveen Bishnoi
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-headline text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-[0.9]"
        >
          I BUILD SOFTWARE<br />
          THAT TURNS<br />
          COMPLEX PROBLEMS<br />
          INTO SIMPLE SYSTEMS.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-6 w-full"
        >
          <p className="text-lg md:text-xl font-medium text-[#6E6E73] dark:text-[#86868B] max-w-lg">
            Developer &middot; AI Automation &middot; Systems
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mt-4">
            <a 
              href="#work" 
              className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all"
            >
              Explore Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="https://github.com/BishnoiNaveen" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm tracking-wide uppercase transition-all"
            >
              GitHub
              <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Photography */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full max-w-md lg:max-w-lg xl:max-w-xl relative flex justify-end items-center"
      >
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-panel group shadow-2xl">
          <img 
            src="/images/portfolio_hero.jpg" 
            alt="Naveen Bishnoi"
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Subtle gradient overlay to ensure the image blends nicely */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7]/30 to-transparent pointer-events-none dark:from-[#111111]/30"></div>
        </div>
      </motion.div>
    </div>
  );
}
