import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, ArrowUpRight, Search, FileDown } from 'lucide-react';
import { springPresets } from '../../lib/springs';
import ThemeToggle from '../ui/ThemeToggle';
import MobileNavSheet, { type NavItem } from './MobileNavSheet';
import CommandPalette from '../ui/CommandPalette';

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Credentials', href: '/credentials' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export default function FloatingNav() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <>
      <header
        role="banner"
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none"
      >
        <nav
          role="navigation"
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-5 px-3.5 sm:px-5 py-2.5 rounded-full transition-all duration-300 bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] ${
            isScrolled
              ? 'border-blue-500/40 shadow-[0_12px_36px_rgba(37,99,235,0.15)] scale-[0.98]'
              : ''
          }`}
        >
          {/* Logo Pill */}
          <a
            href="/"
            aria-label="Naveen Bishnoi — Home"
            className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold tracking-tight text-[var(--color-text-primary)] hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="font-extrabold tracking-tighter text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">NB.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {NAV_ITEMS.map((item, index) => {
              const itemCleanHref = item.href.replace(/\/$/, '') || '/';
              const isActive = currentPath === itemCleanHref;
              const isHovered = hoveredIndex === index;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={springPresets.glide}
                      className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 shadow-sm -z-10"
                    />
                  )}

                  {/* Hover Pill Background */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      transition={{ type: 'spring', mass: 0.5, stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.08] -z-10"
                    />
                  )}

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-black/[0.08] dark:bg-white/15 mx-0.5 hidden lg:block" />

          {/* Actions & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Resume Download Pill */}
            <a
              href="/naveen_bishnoi_resume.pdf"
              download="naveen_bishnoi_resume.pdf"
              title="Download Resume as naveen_bishnoi_resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Search and quick actions (⌘K)"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] font-mono px-1 py-0.2 rounded bg-black/[0.05] dark:bg-white/10">⌘K</span>
            </button>

            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileSheetOpen}
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Mobile Drawer Sheet */}
      <MobileNavSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        items={NAV_ITEMS}
        activeSection={currentPath}
        onItemClick={() => setIsMobileSheetOpen(false)}
      />
    </>
  );
}
