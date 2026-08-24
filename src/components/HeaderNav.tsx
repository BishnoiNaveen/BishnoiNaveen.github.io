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
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav 
        className={`pointer-events-auto flex items-center gap-6 px-6 py-3 rounded-full transition-all duration-500 ${
          isScrolled 
            ? 'floating-nav' 
            : 'bg-transparent'
        }`}
      >
        <a href="/" className="font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity">
          NB
        </a>
        
        <div className="h-4 w-px bg-current opacity-20 hidden md:block"></div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#work" className="hover:opacity-70 transition-opacity">Work</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">About</a>
          <a href="#lab" className="hover:opacity-70 transition-opacity">Lab</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
        </div>

        <a 
          href="/Naveen_Bishnoi_Resume.pdf" 
          target="_blank" 
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity ml-2"
        >
          Resume
        </a>
      </nav>
    </div>
  );
}
