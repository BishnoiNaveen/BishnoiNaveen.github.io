/**
 * src/components/Cinematic/CinematicSection.tsx
 * 400vh Scroll-Jacking Track with Lenis Smooth Momentum & GSAP ScrollTrigger
 * 
 * Synchronizes:
 * - 400vh tall scroll track with 100vh sticky viewport
 * - Lenis RAF smooth scrolling
 * - GSAP ScrollTrigger timeline mapping scroll to 0.0 -> 1.0 progress
 * - HTML5 Canvas 120-frame WebP sequence scrubbing (ScrollCanvas)
 * - 4-Act narrative HUD and optical radial light flare (CinematicOverlay)
 * - Seamless fade-out to executive resume & portfolio at progress > 0.95
 */

import React, { useEffect, useRef, useState } from 'react';
import ScrollCanvas from './ScrollCanvas';
import CinematicOverlay from './CinematicOverlay';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Initialize Lenis + GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Setup ScrollTrigger for 400vh Track
    let st: ScrollTrigger | null = null;
    if (containerRef.current) {
      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }

    return () => {
      if (st) st.kill();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // Smooth scroll skip to next chapter (#manifesto or #work)
  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      const target = document.getElementById('manifesto') || document.getElementById('work');
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: -60, duration: 1.5 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // If user has reduced motion enabled, render high-impact static view
  if (isReducedMotion) {
    return (
      <div className="relative w-full min-h-screen bg-[#030712] text-white flex items-center justify-center p-8">
        <ScrollCanvas scrollProgress={0.4} totalFrames={120} />
        <CinematicOverlay progress={0.4} onSkip={handleSkip} />
      </div>
    );
  }

  // Calculate exit fade opacity as progress approaches 1.0 (0.95 -> 1.0)
  const exitOpacity = scrollProgress >= 0.94 ? Math.max(0, 1 - (scrollProgress - 0.94) / 0.06) : 1;

  return (
    <div
      ref={containerRef}
      id="cinematic-dive-track"
      className="relative w-full h-[400vh] bg-[#030712]"
      style={{ contain: 'paint layout' }}
    >
      {/* Pinned Sticky Viewport (100vh) */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{
          opacity: exitOpacity,
          transition: 'opacity 0.1s linear',
        }}
      >
        {/* HTML5 Canvas Frame Scrubber */}
        <ScrollCanvas
          scrollProgress={scrollProgress}
          totalFrames={120}
          className="absolute inset-0 z-0"
        />

        {/* 4-Act Synchronized Narrative HUD Overlay */}
        <CinematicOverlay
          progress={scrollProgress}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}
