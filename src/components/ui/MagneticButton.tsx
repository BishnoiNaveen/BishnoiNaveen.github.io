import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { springPresets, instantTransition, mechanicalClick } from '../../lib/springs';

export interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  ariaLabel?: string;
  strength?: number;
  maxRadius?: number;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel,
  download,
  ariaLabel,
  strength = 0.28,
  maxRadius = 24,
}: MagneticButtonProps) {
  const { ref, style } = useMagnetic<HTMLDivElement>(strength, maxRadius);
  const shouldReduceMotion = useReducedMotion();

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-full select-none cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2.5 min-h-[44px] text-xs tracking-wide gap-1.5',
    md: 'px-6 py-3 min-h-[44px] text-sm tracking-normal gap-2.5',
    lg: 'px-8 py-4 min-h-[48px] text-base tracking-tight gap-3 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#1D1D1F] text-white dark:bg-[#FFFFFF] dark:text-[#1D1D1F] hover:bg-black dark:hover:bg-[#F0F0F2] shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.12)]',
    secondary:
      'bg-black/5 dark:bg-white/10 text-[var(--color-text-primary)] hover:bg-black/10 dark:hover:bg-white/15 border border-[var(--color-border)]',
    glass:
      'bg-[rgba(255,255,255,0.70)] dark:bg-[rgba(24,24,27,0.70)] backdrop-blur-xl text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] shadow-sm hover:shadow-md',
    ghost:
      'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10',
  }[variant];

  const content = (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : mechanicalClick}
      transition={shouldReduceMotion ? instantTransition : springPresets.snappy}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      ref={ref}
      style={style}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          download={download}
          aria-label={ariaLabel}
          className="inline-block text-inherit no-underline focus:outline-none"
        >
          {content}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className="inline-block bg-transparent p-0 border-0 text-inherit focus:outline-none"
        >
          {content}
        </button>
      )}
    </motion.div>
  );
}
