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
          className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-6 px-3.5 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300 bg-[#0a0d17]/85 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.7)] ${
            isScrolled
              ? 'border-cyan-500/30 shadow-[0_12px_40px_rgba(6,182,212,0.15)]'
              : ''
          }`}
        >
          {/* Logo Pill */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            aria-label="Naveen Bishnoi — Return to top"
            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-tight text-[var(--color-text-primary)] hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <span className="font-extrabold tracking-tighter text-sm">NB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] group-hover:scale-125 transition-transform" />
          </a>

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
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
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
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)] -z-10"
                    />
                  )}

                  {/* Hover Pill Background */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      transition={{ type: 'spring', mass: 0.5, stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] -z-10"
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
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileSheetOpen}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <Menu className="w-4 h-4" />
            </button>
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
