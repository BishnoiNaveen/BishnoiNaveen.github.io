import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Honest UX Fix: Don't show preloader on every single page navigation
    if (sessionStorage.getItem('site_loaded')) {
      setLoading(false);
      return;
    }

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    let current = 0;
    const updateProgress = () => {
      current += Math.random() * 15;
      if (current >= 100) {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          document.body.style.overflow = '';
          sessionStorage.setItem('site_loaded', 'true');
        }, 500); // Hold at 100% briefly
      } else {
        setProgress(Math.floor(current));
        requestAnimationFrame(updateProgress);
      }
    };
    
    // Slight delay before starting count for dramatic effect
    setTimeout(() => {
      requestAnimationFrame(updateProgress);
    }, 200);

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090b] text-white"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-black tracking-tighter"
            >
              {progress}%
            </motion.div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="mt-8 text-xs font-bold tracking-[0.3em] uppercase"
            >
              Initializing Systems
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
