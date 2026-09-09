import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Volume2, VolumeX, X } from 'lucide-react';
import { sound } from '../../lib/sound';

export default function KeyboardHintBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  useEffect(() => {
    setSoundActive(sound.isEnabled());

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(false);
      } else if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sound.toggle();
    setSoundActive(updated);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-5 right-5 z-40 hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-xs text-[var(--color-text-primary)] font-medium select-none pointer-events-auto"
        >
          {/* Command Palette Trigger */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-secondary)]">
            <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold text-[var(--color-text-primary)]">
              ⌘K
            </span>
            <span>Commands</span>
          </div>

          <span className="text-black/20 dark:text-white/20">·</span>

          {/* Tab Shortcuts */}
          <div className="flex items-center gap-1 font-mono text-[11px] text-[var(--color-text-secondary)]">
            <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold text-[var(--color-text-primary)]">
              1,2,3
            </span>
            <span>Cockpit</span>
          </div>

          <span className="text-black/20 dark:text-white/20">·</span>

          {/* Tactile Audio Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundActive ? 'Mute acoustic UI feedback' : 'Enable acoustic UI feedback'}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label={soundActive ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-blue-500" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
          </button>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss keyboard hints"
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
