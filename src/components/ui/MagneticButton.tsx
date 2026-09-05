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
      'bg-white text-zinc-950 hover:bg-zinc-100 font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]',
    secondary:
      'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 hover:text-white border border-white/10 backdrop-blur-xl',
    glass:
      'bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 hover:border-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
    ghost:
      'text-zinc-400 hover:text-white hover:bg-white/[0.06]',
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
