import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  FileText, 
  Menu, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Workflow, 
  Cpu, 
  Layers, 
  Sparkles, 
  User, 
  Mail, 
  Home 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', href: '#hero', icon: Home },
  { id: 'workflows', label: 'Workflows', href: '#workflows', icon: Workflow },
  { id: 'hermes', label: 'Hermes', href: '#hermes', icon: Cpu },
  { id: 'projects', label: 'Projects', href: '#projects', icon: Layers },
  { id: 'skills', label: 'Skills', href: '#skills', icon: Sparkles },
  { id: 'about', label: 'About', href: '#about', icon: User },
  { id: 'contact', label: 'Contact', href: '#contact', icon: Mail },
];

export const HeaderNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll spy for sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      setIsScrolled(window.scrollY > 40);

      // Check section offsets
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: shouldReduceMotion ? 'auto' : 'smooth'
      });
      setActiveSection(targetId);
      setMobileMenuOpen(false);
    }
  }, [shouldReduceMotion]);

  return (
    <>
      {/* Floating Apple-Style Dock Pill */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : springPresets.cinematic}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 transition-colors duration-300"
        style={{
          background: isScrolled
            ? 'rgba(15, 17, 26, 0.78)'
            : 'rgba(15, 17, 26, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid transparent',
          boxShadow: isScrolled
            ? '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)'
            : 'none',
        }}
        role="banner"
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, '#hero')}
          className="flex items-center gap-2 text-white font-semibold text-base sm:text-lg tracking-tight group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg px-1.5 py-0.5"
          aria-label="Naveen Bishnoi Portfolio"
        >
          <span className="font-mono text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 group-hover:border-violet-500/50 transition-colors">
            &lt;NB/&gt;
          </span>
          <span className="font-bold text-gray-100 group-hover:text-white transition-colors">
            Naveen<span className="text-violet-400">.</span>
          </span>
        </a>

        {/* Desktop Navigation Floating Pill */}
        <nav
          className="hidden lg:flex items-center bg-white/[0.04] p-1 rounded-full border border-white/[0.08] shadow-inner shadow-black/20"
          aria-label="Main Navigation"
        >
          <ul className="flex items-center gap-0.5 m-0 p-0 list-none" role="list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredNav === item.id;
              const Icon = item.icon;

              return (
                <li key={item.id} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isActive
                        ? 'text-white'
                        : isHovered
                        ? 'text-gray-200'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{item.label}</span>
                  </a>

                  {/* Active Pill Gliding Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 z-0 bg-violet-600/30 border border-violet-400/40 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                    />
                  )}

                  {/* Hover Subtle Pill Indicator */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      className="absolute inset-0 z-0 bg-white/[0.06] rounded-full"
                      transition={shouldReduceMotion ? { duration: 0 } : springPresets.snappy}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls & External CTAs */}
        <div className="flex items-center gap-3">
          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-1.5 border-r border-white/10 pr-3">
            <a
              href="https://github.com/BishnoiNaveen"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-violet-300 hover:bg-white/5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-violet-300 hover:bg-white/5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>

          {/* Resume Download Button */}
          <a
            href="/Naveen_Bishnoi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-label="Download Naveen Bishnoi's Resume (PDF)"
          >
            <FileText size={13} />
            <span>Resume</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-sheet"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Animated Gestural Navigation Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-over Drawer / Sheet */}
            <motion.div
              id="mobile-nav-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ y: '-100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y < -60 || info.velocity.y < -200) {
                  setMobileMenuOpen(false);
                }
              }}
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.sheet}
              className="fixed top-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto bg-slate-900/95 border-b border-white/10 shadow-2xl backdrop-blur-2xl rounded-b-3xl px-6 pt-20 pb-8 flex flex-col gap-6 lg:hidden"
            >
              {/* Drag Handle Bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-2" />

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2" aria-label="Mobile Navigation List">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className={`flex items-center justify-between p-3.5 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </motion.a>
                  );
                })}
              </nav>

              {/* Mobile Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <a
                  href="/Naveen_Bishnoi_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-violet-600 rounded-xl shadow-lg shadow-violet-600/30"
                >
                  <FileText size={16} />
                  <span>Download Full Resume (PDF)</span>
                  <ExternalLink size={14} className="opacity-70" />
                </a>

                <div className="flex items-center justify-around py-2">
                  <a
                    href="https://github.com/BishnoiNaveen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                  >
                    <GithubIcon size={18} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                  >
                    <LinkedinIcon size={18} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderNav;
