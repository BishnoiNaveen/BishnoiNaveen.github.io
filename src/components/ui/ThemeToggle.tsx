import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { getResolvedTheme, toggleTheme, subscribeToThemeChange, type ResolvedTheme } from '../../lib/theme';
import { springPresets, instantTransition } from '../../lib/springs';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    setResolvedTheme(getResolvedTheme());

    const unsubscribe = subscribeToThemeChange((_, nextResolved) => {
      setResolvedTheme(nextResolved);
    });

    return unsubscribe;
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const next = toggleTheme();
    setResolvedTheme(next);
  };

  const isDark = mounted ? resolvedTheme === 'dark' : false;
  const activeSpring = shouldReduceMotion ? instantTransition : springPresets.snappy;

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      transition={activeSpring}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
            transition={activeSpring}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-[#2997FF]" aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
            transition={activeSpring}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-[#FF9500]" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
