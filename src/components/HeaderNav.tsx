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

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const NAV_ITEMS: NavItem[] = [
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

  // Scroll spy with passive scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 30);

          const scrollPosition = scrollY + 180;
          for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
            const item = NAV_ITEMS[i];
            const el = document.getElementById(item.id);
            if (el) {
              const top = el.getBoundingClientRect().top + scrollY;
              if (scrollPosition >= top) {
                setActiveSection(item.id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll during open mobile menu
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

  // Smooth scroll handler with offset
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 90;
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
      {/* Outer Floating Dock Positioning Wrapper */}
      <div className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        {/* Floating Apple-Style visionOS Glass Pill */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : springPresets.cinematic}
          className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-300 flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 ${
            isScrolled
              ? 'bg-white/85 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.09),0_0_1px_1px_rgba(255,255,255,0.8)]'
              : 'bg-white/70 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.05),0_0_1px_1px_rgba(255,255,255,0.6)]'
          }`}
          style={{
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.90)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.50)',
            borderRight: '1px solid rgba(0, 0, 0, 0.04)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          }}
          role="banner"
        >
          {/* Brand Emblem & Name */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              onClick={(e) => scrollToSection(e, '#hero')}
              className="flex items-center gap-2 text-[#1D1D1F] font-semibold text-sm sm:text-base tracking-tight group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-full p-1 transition-transform active:scale-95"
              aria-label="Naveen Bishnoi Portfolio - Return to top"
            >
              <span className="font-mono text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full border border-[#0071E3]/20 group-hover:bg-[#0071E3]/15 transition-colors">
                &lt;NB/&gt;
              </span>
              <span className="font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors hidden xs:inline-block">
                Naveen<span className="text-[#0071E3]">.</span>
              </span>
            </a>

            {/* Live Status Indicator Pill (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-medium tracking-tight">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available</span>
            </div>
          </div>

          {/* Desktop Navigation Floating Segmented Dock */}
          <nav
            className="hidden lg:flex items-center bg-black/[0.03] p-1 rounded-full border border-black/[0.04] shadow-inner"
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
                      className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                        isActive
                          ? 'text-white'
                          : isHovered
                          ? 'text-[#1D1D1F]'
                          : 'text-[#424245] hover:text-[#1D1D1F]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#86868B]'}`} />
                      <span>{item.label}</span>
                    </a>

                    {/* Active Sliding Capsule Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="visionos-active-pill"
                        className="absolute inset-0 z-0 bg-[#0071E3] rounded-full shadow-[0_2px_10px_rgba(0,113,227,0.35)]"
                        transition={shouldReduceMotion ? { duration: 0 } : springPresets.glide}
                      />
                    )}

                    {/* Subtle Hover Indicator */}
                    {!isActive && isHovered && (
                      <motion.div
                        layoutId="visionos-hover-pill"
                        className="absolute inset-0 z-0 bg-black/[0.04] rounded-full"
                        transition={shouldReduceMotion ? { duration: 0 } : springPresets.snappy}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Controls & External CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Social Links (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center gap-1.5 border-r border-black/[0.08] pr-2.5">
              <a
                href="https://github.com/BishnoiNaveen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#424245] hover:text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                aria-label="GitHub Profile (opens in new tab)"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#424245] hover:text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                aria-label="LinkedIn Profile (opens in new tab)"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>

            {/* Apple Primary Action Button: Resume */}
            <a
              href="/Naveen_Bishnoi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.32)] transition-all hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
              aria-label="Download Naveen Bishnoi Resume (PDF, opens in new tab)"
            >
              <FileText size={13} />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1D1D1F] hover:text-[#0071E3] bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sheet"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile visionOS Translucent Glass Sheet Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Ambient Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-md lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-Down visionOS Glass Sheet */}
            <motion.div
              id="mobile-nav-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ y: '-100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y < -50 || info.velocity.y < -200) {
                  setMobileMenuOpen(false);
                }
              }}
              transition={shouldReduceMotion ? { duration: 0 } : springPresets.sheet}
              className="fixed top-0 left-0 right-0 z-50 max-h-[92vh] overflow-y-auto bg-white/90 border-b border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.14)] rounded-b-[32px] px-6 pt-20 pb-8 flex flex-col gap-6 lg:hidden"
              style={{
                backdropFilter: 'blur(48px) saturate(180%)',
                WebkitBackdropFilter: 'blur(48px) saturate(180%)',
              }}
            >
              {/* Drag Handle Bar Indicator */}
              <div className="w-12 h-1.5 bg-black/15 rounded-full mx-auto -mt-2 mb-1" />

              {/* Live Status Pill for Mobile */}
              <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold w-fit mx-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for New Opportunities</span>
              </div>

              {/* Navigation Links List */}
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Section Navigation">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035 }}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-base font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20 shadow-sm'
                          : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-[#0071E3] text-white' : 'bg-black/[0.04] text-[#424245]'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : 'text-gray-400'}`} />
                    </motion.a>
                  );
                })}
              </nav>

              {/* Mobile Sheet Footer Actions */}
              <div className="pt-4 border-t border-black/[0.08] flex flex-col gap-3">
                <a
                  href="/Naveen_Bishnoi_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] rounded-2xl shadow-lg shadow-[#0071E3]/25 transition-all"
                >
                  <FileText size={16} />
                  <span>Download Full Resume (PDF)</span>
                  <ExternalLink size={14} className="opacity-70" />
                </a>

                <div className="flex items-center justify-around pt-2">
                  <a
                    href="https://github.com/BishnoiNaveen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-[#424245] hover:text-[#0071E3] p-2 rounded-lg hover:bg-black/[0.04] transition-colors"
                  >
                    <GithubIcon size={18} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-[#424245] hover:text-[#0071E3] p-2 rounded-lg hover:bg-black/[0.04] transition-colors"
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
