import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Handles no-JS environments gracefully
  
  // PERFORMANCE FIX: Bypassing React state for 120fps mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth springs for the inner dot
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });
  
  // Slower springs for the outer ring (creates the trailing effect)
  const ringSpringX = useSpring(mouseX, { stiffness: 200, damping: 20, mass: 0.5 });
  const ringSpringY = useSpring(mouseY, { stiffness: 200, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Only apply cursor-none when JS successfully executes
    document.body.style.cursor = 'none';
    setIsVisible(true);
    
    const updateMousePosition = (e: MouseEvent) => {
      // GPU-accelerated value updates without triggering React re-renders
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto'; // Cleanup
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null; // Fallback for serverside / no-js

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] flex items-center justify-center origin-center"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full mix-blend-difference pointer-events-none z-[9998] origin-center"
        style={{ x: ringSpringX, y: ringSpringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}
