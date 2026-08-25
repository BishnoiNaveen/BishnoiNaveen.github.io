import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springPresets, instantTransition, mechanicalClick } from '../../lib/springs';
import MagneticButton from '../ui/MagneticButton';

export default function ContactTerminal() {
  const [copied, setCopied] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const emailAddress = '0029bishnoinaveen@gmail.com';
  const shouldReduceMotion = useReducedMotion();

  // Live Timezone Clock (IST · Asia/Kolkata)
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setCurrentTime(formatter.format(new Date()));
      } catch {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch {
      // Fallback
    }
    // Fallback: open mailto
    window.location.href = `mailto:${emailAddress}`;
  };

  const buttonSpring = shouldReduceMotion ? instantTransition : springPresets.snappy;

  return (
    <div className="w-full flex flex-col gap-10 text-[var(--color-text-primary)]">
      {/* DIRECT COMMUNICATION CARD */}
      <div className="p-6 sm:p-10 md:p-14 lg:p-16 rounded-[28px] sm:rounded-[36px] bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-lg)] relative overflow-hidden flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[var(--color-border-subtle)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border)] mb-6 select-none">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
              <span className="type-badge-label text-[var(--color-text-secondary)] text-[11px] font-semibold tracking-[0.08em] uppercase">
                Chapter 08 · Direct Communication &amp; Verified Signature
              </span>
            </div>

            <h2 className="type-headline-chapter text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)] leading-[1.05]">
              Architecting High-Assurance Systems. Let&apos;s Build Together.
            </h2>

            <p className="type-body-editorial text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] mt-4 sm:mt-6 leading-relaxed">
              Available for systems architecture advisory, distributed multi-agent initiatives, and high-performance engineering leadership. Every inquiry receives a verified response within 24 hours.
            </p>
          </div>

          {/* Timezone Live Clock Tile */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--color-border-subtle)] flex flex-col gap-2 w-full sm:w-auto lg:min-w-[240px] shrink-0">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE CLOCK
              </span>
              <span>IST (UTC+5:30)</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[var(--color-text-primary)] tracking-tight">
              {currentTime || '12:00:00 PM'}
            </div>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              Location: India · KRONE Edge Engineering
            </span>
          </div>
        </div>

        {/* INTERACTIVE CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
          {/* 1-Click Copy Email Button with Mechanical Click Compression */}
          <motion.button
            type="button"
            onClick={handleCopyEmail}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : mechanicalClick}
            transition={buttonSpring}
            aria-label="Copy verified email address to clipboard"
            className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-2xl bg-[var(--color-text-primary)] text-[var(--color-canvas)] font-bold text-xs sm:text-sm md:text-base transition-opacity hover:opacity-90 shadow-md cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 flex-wrap sm:flex-nowrap"
          >
            <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-mono break-all sm:break-normal">{emailAddress}</span>
            <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/20 text-[var(--color-canvas)] font-semibold shrink-0">
              {copied ? '✓ COPIED!' : 'CLICK TO COPY'}
            </span>
          </motion.button>

          {/* Download Verified Resume */}
          <motion.a
            href="/Naveen_Bishnoi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : mechanicalClick}
            transition={buttonSpring}
            aria-label="Download verified resume PDF"
            className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 min-h-[48px] rounded-2xl bg-[var(--material-2-glass-bg)] backdrop-blur-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold text-xs sm:text-sm md:text-base hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Resume (PDF)</span>
          </motion.a>
        </div>

        {/* SLA & INTEGRITY ATTRIBUTIONS */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2 font-medium">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Response SLA Guarantee &lt; 24 Hours</span>
          </div>
          <span className="text-[var(--color-border)]">|</span>
          <div className="flex items-center gap-2">
            <span>PGP / Direct Email Routing Verified</span>
          </div>
          <span className="text-[var(--color-border)]">|</span>
          <div className="flex items-center gap-2">
            <span>Primary Focus: Systems &amp; Autonomous AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
