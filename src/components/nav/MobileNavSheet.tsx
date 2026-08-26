import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { X, FileText, ArrowUpRight } from 'lucide-react';
import { springPresets, instantTransition, mechanicalClick } from '../../lib/springs';
import ThemeToggle from '../ui/ThemeToggle';

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  activeSection: string;
  onItemClick: (href: string) => void;
}

export default function MobileNavSheet({
  isOpen,
  onClose,
  items,
  activeSection,
  onItemClick,
}: MobileNavSheetProps) {
  const shouldReduceMotion = useReducedMotion();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 250) {
      onClose();
    }
  };

  const sheetTransition = shouldReduceMotion ? instantTransition : springPresets.sheet;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? instantTransition : { duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md"
          />

          {/* Sheet Drawer */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={sheetTransition}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(18,18,21,0.92)] backdrop-blur-3xl border-t border-[var(--color-border)] shadow-[0_-16px_40px_rgba(0,0,0,0.15)] px-6 pt-4 pb-10"
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
            </div>

            {/* Header / Brand & Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
                  Naveen Bishnoi
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--color-text-secondary)] font-mono">
                  v2.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                  transition={springPresets.snappy}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile Menu Navigation">
              {items.map((item) => {
                const isActive = activeSection === item.href || (item.href === '#hero' && activeSection === '');
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={springPresets.snappy}
                    onClick={(e) => {
                      if (!item.isExternal && item.href.startsWith('#')) {
                        e.preventDefault();
                        onItemClick(item.href);
                        onClose();
                      } else {
                        onClose();
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-medium transition-colors min-h-[48px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-white font-semibold shadow-sm'
                        : 'text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isExternal ? (
                      <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--color-text-secondary)]'}`} />
                    ) : (
                      <span className={`text-xs font-mono ${isActive ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                        {item.href}
                      </span>
                    )}
                  </motion.a>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-3">
              <motion.a
                href="/Naveen_Bishnoi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={shouldReduceMotion ? undefined : mechanicalClick}
                transition={springPresets.snappy}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] font-semibold text-sm shadow-md transition-opacity hover:opacity-90 min-h-[48px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </motion.a>
              <div className="text-center text-xs text-[var(--color-text-muted)] font-mono">
                0029bishnoinaveen@gmail.com
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
