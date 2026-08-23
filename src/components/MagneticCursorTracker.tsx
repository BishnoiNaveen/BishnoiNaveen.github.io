import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';

export const MagneticCursorTracker: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Magnetic spring follower
  const springX = useSpring(cursorX, springPresets.magnetic);
  const springY = useSpring(cursorY, springPresets.magnetic);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad)
    if (typeof window === 'undefined' || !window.matchMedia || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    if (shouldReduceMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Check hover on clickable/interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, [role="button"], input, [data-interactive]');
        setIsHovered(!!isInteractive);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isHovered ? 1.6 : 1,
      }}
      transition={springPresets.snappy}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:block"
    >
      {/* Outer Follower Ring */}
      <div 
        className={`rounded-full border transition-colors duration-200 ${
          isHovered
            ? 'w-10 h-10 border-violet-400 bg-violet-500/15 shadow-[0_0_20px_rgba(139,92,246,0.5)]'
            : 'w-7 h-7 border-white/30 bg-white/[0.03]'
        }`}
      />
    </motion.div>
  );
};

export default MagneticCursorTracker;
