import React from 'react';
import { ArrowRight, Compass, FileText } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';

export default function HeroActionButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-12">
      <MagneticButton
        href="#work"
        variant="primary"
        size="lg"
        ariaLabel="Explore Featured Engineering Works"
      >
        <span>Explore Work</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </MagneticButton>

      <MagneticButton
        href="#manifesto"
        variant="glass"
        size="lg"
        ariaLabel="Inspect System Architecture Thesis"
      >
        <Compass className="w-4 h-4 text-[var(--color-accent)]" />
        <span>Inspect Architecture</span>
      </MagneticButton>

      <MagneticButton
        href="/Naveen_Bishnoi_Resume.pdf"
        target="_blank"
        variant="secondary"
        size="lg"
        ariaLabel="Download Naveen Bishnoi Resume PDF"
      >
        <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
        <span>Resume</span>
      </MagneticButton>
    </div>
  );
}
