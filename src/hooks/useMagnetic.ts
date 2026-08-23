import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { springPresets } from '../lib/springs';

/**
 * Hook for Apple-style fluid magnetic cursor and hover physics.
 * Adheres to direct manipulation, interruptibility, and fine pointer constraints.
 * 
 * @param strength Fraction of mouse displacement to pull the element (default: 0.35)
 * @returns ref to attach to the target DOM element and spring-driven style transform values
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength: number = 0.35) {
  const ref = useRef<T | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springPresets.magnetic);
  const springY = useSpring(y, springPresets.magnetic);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ensure we only bind listeners on devices with fine pointer (mouse/trackpad)
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, x, y]);

  return { ref, style: { x: springX, y: springY } };
}
