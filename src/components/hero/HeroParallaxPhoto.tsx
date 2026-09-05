import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { springPresets } from '../../lib/springs';

interface HeroParallaxPhotoProps {
  imageSrc?: string;
  altText?: string;
  className?: string;
}

export default function HeroParallaxPhoto({
  imageSrc = '/images/portfolio_hero.jpg',
  altText = 'Naveen Bishnoi — Software Architect & AI Systems Engineer',
  className = '',
}: HeroParallaxPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Raw normalized mouse coordinates [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics springs for fluid organic movement
  const springX = useSpring(mouseX, { mass: 0.6, stiffness: 220, damping: 24 });
  const springY = useSpring(mouseY, { mass: 0.6, stiffness: 220, damping: 24 });

  // 3D Transform mappings
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const glareOpacity = useTransform(springY, [-0.5, 0.5], [0.15, 0.35]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[460px] mx-auto perspective-[1200px] select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Ambient Atmospheric Glow (Soft, restrained Apple-style background aura) */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[var(--color-accent)]/10 via-[var(--color-accent-secondary)]/5 to-transparent blur-2xl opacity-60 -z-10 transition-opacity duration-700"
      />

      {/* Main Magazine Frame with Physical 3D Tilt */}
      <motion.div
        style={{
          rotateX: isFinePointer ? rotateX : 0,
          rotateY: isFinePointer ? rotateY : 0,
          x: isFinePointer ? translateX : 0,
          y: isFinePointer ? translateY : 0,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springPresets.cinematic}
        className="relative aspect-[4/5] w-full rounded-[28px] md:rounded-[32px] overflow-hidden bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[0_24px_54px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_28px_64px_-16px_rgba(0,0,0,0.7)] specular-hairline"
      >
        {/* Actual High-Res Portrait Photography */}
        <img
          src={imageSrc}
          alt={altText}
          width={900}
          height={1125}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-top filter contrast-[1.03] brightness-[0.98] dark:brightness-[0.92] transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: isHovered && isFinePointer ? 'scale(1.025)' : 'scale(1)',
          }}
        />

        {/* Specular Glare / Light Reflection Overlay */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/30 via-white/5 to-transparent mix-blend-overlay"
        />

        {/* Subtle Vignette & Bottom Depth Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/70 dark:via-black/20"
        />

        {/* Floating Identity & Status Pill */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-3 rounded-2xl bg-[rgba(255,255,255,0.75)] dark:bg-[rgba(18,18,21,0.75)] backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-tight text-[var(--color-text-primary)]">
              Naveen Bishnoi
            </span>
            <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
              Systems Architect · KRONE
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent)]" />
            </span>
            <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">
              Online
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
