import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  ArrowUp, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Radio, 
  ExternalLink 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, XIcon } from './icons';

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/BishnoiNaveen',
    icon: <GithubIcon size={18} />,
    color: '#1D1D1F',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/naveen-bishnoi-b0b00941a',
    icon: <LinkedinIcon size={18} />,
    color: '#0071E3',
  },
  {
    label: 'Email',
    href: 'mailto:0029bishnoinaveen@gmail.com',
    icon: <Mail size={18} />,
    color: '#EA4335',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bishnoi_.naveen?igsh=MTRiYzlzY28zemcwNA==',
    icon: <InstagramIcon size={18} />,
    color: '#E4405F',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/BishnoiNaveen',
    icon: <XIcon size={16} />,
    color: '#1D1D1F',
  }
];

const NAV_LINKS = [
  { label: 'Workflows', href: '#workflows' },
  { label: 'Hermes AI', href: '#hermes' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const Footer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full border-t border-black/[0.08] bg-white/50 backdrop-blur-2xl py-14 sm:py-16 px-4 sm:px-6 relative z-10" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Top Row: Brand Lockup, Status Pill, Social Channels & Back to Top */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold tracking-tight text-[#1D1D1F]">
                Naveen<span className="apple-gradient-text">.</span>
              </span>
              
              {/* Availability Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-700 text-xs font-semibold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for Select Architectures</span>
              </div>
            </div>

            <p className="text-sm text-[#86868B] max-w-md">
              AI Automation Engineer & Software Architect. Turning logic into seamless, production-grade applications.
            </p>
          </div>

          {/* Social Channels & Back to Top Button */}
          <div className="flex flex-wrap items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.label} profile`}
                className="p-3 text-[#424245] hover:text-[#1D1D1F] bg-white/80 hover:bg-white active:bg-white border border-black/[0.06] hover:border-black/[0.12] rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {link.icon}
              </a>
            ))}

            {/* Back to Top Capsule Glass Button */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#1D1D1F] bg-white/80 hover:bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-sm hover:shadow-md backdrop-blur-xl transition-all ml-1 cursor-pointer"
              aria-label="Back to Top of Page"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} className="text-[#0071E3]" />
            </motion.button>
          </div>
        </div>

        {/* Middle Row: Navigation Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-black/[0.06]">
          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#424245]" aria-label="Footer Navigation">
            {NAV_LINKS.map((nav) => (
              <a
                key={nav.label}
                href={nav.href}
                className="hover:text-[#0071E3] transition-colors"
              >
                {nav.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs font-mono text-[#86868B]">
            <Sparkles size={13} className="text-[#0071E3]" />
            <span>Apple visionOS Design System</span>
          </div>
        </div>

        {/* Bottom Row: Copyright & System Credits */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#86868B] font-mono pt-4 border-t border-black/[0.04]">
          <p>
            &copy; {currentYear} Naveen Bishnoi. Engineered with precision & radical honesty.
          </p>
          <p className="flex items-center gap-1">
            Built with <span className="font-semibold text-[#1D1D1F]">Astro</span> + <span className="font-semibold text-[#0071E3]">React 19</span> + <span className="font-semibold text-[#AF52DE]">Framer Motion</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
