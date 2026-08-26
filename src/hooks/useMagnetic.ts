import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springPresets, instantTransition } from '../lib/springs';

export interface UseMagneticOptions {
  strength?: number;
  maxRadius?: number;
}

/**
 * Hook for Apple-style fluid magnetic cursor and hover physics.
 * Adheres to direct manipulation, interruptibility, 24px radius constraint,
 * and strict fine-pointer / reduced-motion accessibility.
 * 
 * @param strength Fraction of pointer displacement to pull the element (default: 0.28)
 * @param maxRadius Maximum radial bounding displacement in pixels (default: 24)
 * @returns ref to attach to the target DOM element and spring-driven style transform values
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strengthOrOptions: number | UseMagneticOptions = 0.28,
  maxRadiusParam: number = 24
) {
  const strength =
    typeof strengthOrOptions === 'object'
      ? strengthOrOptions.strength ?? 0.28
      : strengthOrOptions;

  const maxRadius =
    typeof strengthOrOptions === 'object'
      ? strengthOrOptions.maxRadius ?? 24
      : maxRadiusParam;

  const ref = useRef<T | null>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, shouldReduceMotion ? instantTransition : springPresets.magnetic);
  const springY = useSpring(y, shouldReduceMotion ? instantTransition : springPresets.magnetic);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Strict reduced motion check
    if (shouldReduceMotion) {
      x.set(0);
      y.set(0);
      return;
    }

    // Ensure we only bind listeners on devices with fine pointer (mouse/trackpad) and not reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        x.set(0);
        y.set(0);
        return;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rawDeltaX = (e.clientX - centerX) * strength;
      const rawDeltaY = (e.clientY - centerY) * strength;

      // Constrain displacement to maximum bounding radius (24px default)
      const distance = Math.hypot(rawDeltaX, rawDeltaY);
      if (distance > maxRadius && distance > 0) {
        const ratio = maxRadius / distance;
        x.set(rawDeltaX * ratio);
        y.set(rawDeltaY * ratio);
      } else {
        x.set(rawDeltaX);
        y.set(rawDeltaY);
      }
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
  }, [strength, maxRadius, shouldReduceMotion, x, y]);

  return {
    ref,
    style: {
      x: shouldReduceMotion ? 0 : springX,
      y: shouldReduceMotion ? 0 : springY,
    },
  };
}

