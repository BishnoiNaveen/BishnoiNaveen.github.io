import React, { useState, useEffect } from 'react';

export default function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav 
        className={`pointer-events-auto flex items-center gap-8 px-8 py-4 rounded-full transition-all duration-700 ${
          isScrolled 
            ? 'floating-nav' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        <a href="/" className="font-bold text-white tracking-tight hover:text-white/80 transition-colors">
          NB.
        </a>
        
        <div className="h-4 w-px bg-white/20 hidden md:block"></div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#lab" className="hover:text-white transition-colors">Lab</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="h-4 w-px bg-white/20 hidden md:block"></div>

        <a 
          href="/Naveen_Bishnoi_Resume.pdf" 
          target="_blank" 
          className="text-sm font-medium text-white hover:text-white/80 transition-colors ml-2"
        >
          Resume
        </a>
      </nav>
    </div>
  );
}
