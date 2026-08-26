import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { playHoverSound, playClickSound } from '../utils/sound';
import { springPresets, instantTransition, mechanicalClick } from '../lib/springs';

export default function Magnetic({
  children,
  className = '',
  maxRadius = 24,
  strength = 0.28,
}: {
  children: React.ReactNode;
  className?: string;
  maxRadius?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const rawX = (clientX - (left + width / 2)) * strength;
    const rawY = (clientY - (top + height / 2)) * strength;

    const distance = Math.hypot(rawX, rawY);
    if (distance > maxRadius && distance > 0) {
      const ratio = maxRadius / distance;
      setPosition({ x: rawX * ratio, y: rawY * ratio });
    } else {
      setPosition({ x: rawX, y: rawY });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={playHoverSound}
      onClick={playClickSound}
      animate={shouldReduceMotion ? { x: 0, y: 0 } : { x: position.x, y: position.y }}
      whileTap={shouldReduceMotion ? undefined : mechanicalClick}
      transition={shouldReduceMotion ? instantTransition : springPresets.magnetic}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

