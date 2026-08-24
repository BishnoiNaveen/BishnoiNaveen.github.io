import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CanvasBackground from './CanvasBackground';
import Magnetic from './Magnetic';

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const yText = useTransform(scrollY, [0, 1000], [0, 200]);
  const yImage = useTransform(scrollY, [0, 1000], [0, 100]);
  const scaleImage = useTransform(scrollY, [0, 1000], [1, 1.1]);

  const nameVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.19, 1.0, 0.22, 1.0],
        staggerChildren: 0.1 
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }
    }
  };

  return (
    <div className="w-full min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      
      <div className="max-w-[100rem] mx-auto w-full px-6 md:px-12 flex flex-col items-center justify-center relative z-10 pt-20">
        
        {/* Animated Status Pill */}
        <Magnetic>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-none"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">Press Cmd+K for Terminal</span>
          </motion.div>
        </Magnetic>

        {/* Center Typography & Parallax Image */}
        <div className="relative w-full flex justify-center items-center h-[50vh] md:h-[60vh] mt-4 mb-8 pointer-events-none">
          
          {/* Background Parallax Image - Fixed to look abstract & mathematical instead of 'weird/fake' */}
          <motion.div 
            style={{ y: yImage, scale: scaleImage }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md md:max-w-2xl aspect-[4/5] md:aspect-[16/9] rounded-[2rem] overflow-hidden opacity-20 md:opacity-30 z-0 border border-white/5 mix-blend-luminosity"
          >
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" 
              alt="Abstract Architectural Wireframe"
              className="w-full h-full object-cover grayscale contrast-150 brightness-50"
            />
          </motion.div>

          {/* Foreground Text */}
          <motion.div 
            style={{ y: yText }}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-center flex flex-col items-center"
          >
            {/* ACCESSIBILITY FIX: Screen readers will read this, but it is visually hidden */}
            <h1 className="sr-only">Naveen Bishnoi</h1>

            {/* VISUAL PRESENTATION: Hidden from screen readers */}
            <div aria-hidden="true" className="text-[15vw] md:text-[12vw] font-black tracking-tighter leading-[0.8] text-white mix-blend-difference flex overflow-hidden">
              {['N', 'A', 'V', 'E', 'E', 'N'].map((char, i) => (
                <motion.span key={i} variants={letterVariants} className="inline-block transform-gpu">{char}</motion.span>
              ))}
            </div>
            <div aria-hidden="true" className="text-[15vw] md:text-[12vw] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 flex overflow-hidden -mt-2">
              {['B', 'I', 'S', 'H', 'N', 'O', 'I'].map((char, i) => (
                <motion.span key={i} variants={letterVariants} className="inline-block transform-gpu">{char}</motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="text-lg md:text-2xl text-zinc-400 font-light max-w-3xl text-center leading-relaxed mb-12 mix-blend-difference z-10"
        >
          Software Architect & <span className="text-white font-medium">Agentic AI Engineer</span> crafting autonomous systems, generative workflows, and high-performance digital experiences.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-10"
        >
          <Magnetic>
            <a 
              href="/projects" 
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all duration-500 overflow-hidden cursor-none"
            >
              <div className="absolute inset-0 w-full h-full bg-zinc-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              <span className="relative z-10">Explore Work</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
          </Magnetic>
        </motion.div>

      </div>
    </div>
  );
}
