import React from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { springPresets } from '../../lib/springs';

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
}: MagneticButtonProps) {
  const { ref, style } = useMagnetic<HTMLDivElement>(strength);

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-full select-none cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wide gap-1.5',
    md: 'px-6 py-3 text-sm tracking-normal gap-2.5',
    lg: 'px-8 py-4 text-base tracking-tight gap-3 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-[var(--color-accent)] hover:bg-[#0077ed] text-white font-bold shadow-[0_4px_16px_rgba(0,113,227,0.35)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.45)]',
    secondary:
      'bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[var(--color-text-primary)] border border-black/[0.08] dark:border-white/10 backdrop-blur-xl shadow-sm',
    glass:
      'bg-white/80 dark:bg-white/[0.07] hover:bg-white dark:hover:bg-white/[0.14] text-[var(--color-text-primary)] border border-black/[0.08] dark:border-white/15 hover:border-black/20 dark:hover:border-white/30 backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)]',
    ghost:
      'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
  }[variant];

  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={springPresets.snappy}
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
