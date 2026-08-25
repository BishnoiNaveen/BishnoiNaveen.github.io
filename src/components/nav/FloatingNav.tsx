import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, ArrowUpRight } from 'lucide-react';
import { springPresets } from '../../lib/springs';
import ThemeToggle from '../ui/ThemeToggle';
import MobileNavSheet, { type NavItem } from './MobileNavSheet';

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
  { label: 'Resume', href: '/Naveen_Bishnoi_Resume.pdf', isExternal: true },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>('#hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Scroll spy & scrolled threshold listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Section Observer for Scroll Spy
    const sectionIds = ['hero', 'manifesto', 'work', 'projects', 'about', 'skills', 'lab', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) {
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find highest intersecting entry
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top boundary
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const topEntry = visibleEntries[0];
          const id = topEntry.target.id;
          if (id === 'projects') setActiveSection('#work');
          else if (id === 'manifesto' || id === 'skills') setActiveSection('#about');
          else setActiveSection(`#${id}`);
        }
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetEl = document.querySelector(href) || (href === '#work' ? document.querySelector('#projects') : null);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href);
      } else {
        // If target element is not on current page, navigate to root with anchor
        window.location.href = `/${href}`;
      }
    }
  };

  return (
    <>
      <header
        role="banner"
        className="fixed top-4 md:top-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <nav
          role="navigation"
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-6 px-3.5 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(18,18,21,0.85)] backdrop-blur-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.95)] dark:border-[rgba(255,255,255,0.12)]'
              : 'bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(18,18,21,0.72)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.80)] dark:border-[rgba(255,255,255,0.08)]'
          }`}
        >
          {/* Logo Pill */}
          <motion.a
            href="/#hero"
            whileTap={{ scale: 0.95 }}
            transition={springPresets.snappy}
            onClick={(e) => {
              // On the home page, behave as in-page smooth scroll; elsewhere
              // the real href="/#hero" re-enters the cinematic journey.
              if (window.location.pathname === '/') {
                e.preventDefault();
                handleNavClick('#hero');
              }
            }}
            aria-label="Naveen Bishnoi — Return to top / cinematic intro"
            className="group relative flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-bold tracking-tight text-[var(--color-text-primary)] hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer select-none"
          >
            <span className="font-extrabold tracking-tighter text-sm">NB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] group-hover:scale-125 transition-transform" />
          </motion.a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.href;
              const isHovered = hoveredIndex === index;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!item.isExternal && item.href.startsWith('#')) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative px-3.5 py-2 min-h-[44px] flex items-center rounded-full text-xs font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer ${
                    isActive
                      ? 'text-[var(--color-text-primary)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={springPresets.glide}
                      className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10 shadow-sm -z-10"
                    />
                  )}

                  {/* Hover Pill Background */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      transition={springPresets.snappy}
                      className="absolute inset-0 rounded-full bg-black/[0.03] dark:bg-white/[0.05] -z-10"
                    />
                  )}

                  <span className="inline-flex items-center gap-1">
                    {item.label}
                    {item.isExternal && <ArrowUpRight className="w-3 h-3 opacity-60" />}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[var(--color-hairline)] mx-0.5 hidden md:block" />

          {/* Theme Toggle & Mobile Trigger */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <motion.button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              whileTap={{ scale: 0.92 }}
              transition={springPresets.snappy}
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileSheetOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Sheet */}
      <MobileNavSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        items={NAV_ITEMS}
        activeSection={activeSection}
        onItemClick={handleNavClick}
      />
    </>
  );
}
