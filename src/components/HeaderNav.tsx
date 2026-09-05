import React, { useState, useEffect } from 'react';

export default function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 md:top-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav 
        className={`pointer-events-auto flex items-center justify-between md:justify-center gap-4 md:gap-8 px-6 md:px-8 py-4 rounded-full transition-all duration-700 w-full max-w-4xl ${
          isScrolled || isMobileMenuOpen
            ? 'floating-nav' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        <a href="/" className="font-bold text-white tracking-tight hover:text-white/80 transition-colors text-lg">
          NB.
        </a>
        
        <div className="h-4 w-px bg-white/20 hidden md:block"></div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="/resume" className="hover:text-white transition-colors">Resume</a>
          <a href="/projects" className="hover:text-white transition-colors">Projects</a>
          <a href="/lab" className="hover:text-white transition-colors">Lab</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="h-4 w-px bg-white/20 hidden md:block"></div>

        <a 
          href="/Naveen_Bishnoi_Resume.pdf" 
          target="_blank" 
          className="hidden md:block text-sm font-medium text-white hover:text-white/80 transition-colors ml-2"
        >
          Download PDF
        </a>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 pointer-events-auto shadow-2xl md:hidden">
          <a href="/" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="/resume" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Resume</a>
          <a href="/projects" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
          <a href="/lab" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Lab</a>
          <a href="/contact" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <div className="w-full h-px bg-white/10"></div>
          <a href="/Naveen_Bishnoi_Resume.pdf" target="_blank" className="text-lg font-medium text-white flex items-center gap-2">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
