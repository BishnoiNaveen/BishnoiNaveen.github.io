/**
 * src/experience/quality/useQualityTier.ts
 * Performance Engineer deliverable — adaptive quality tier detection.
 *
 * Detects device capability once on mount (and on significant viewport/DPR
 * changes) and exposes a single `tier` ('high' | 'medium' | 'low') plus
 * derived knobs the rest of the experience reads from:
 *   - dpr:       render resolution cap
 *   - particles: global particle multiplier (0..1)
 *   - postfx:    whether the film-grade post pipeline should run
 *
 * The site must NEVER become a blank WebGL page: on any detection failure we
 * default to 'medium' (safe, still beautiful).
 */

import { useEffect, useMemo, useState } from 'react';

export type QualityTier = 'high' | 'medium' | 'low';

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  particleScale: number;
  postfx: boolean;
  /** Coarse flag — used to reduce geometry counts on mobile. */
  isMobile: boolean;
}

function detectTier(): QualitySettings {
  if (typeof window === 'undefined') {
    return { tier: 'medium', dpr: [1, 1.5], particleScale: 0.6, postfx: true, isMobile: false };
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches || /Mobi|Android/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  const dpr = window.devicePixelRatio || 1;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Heuristic score
  let score = 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  if (mem >= 8) score += 2;
  else if (mem >= 4) score += 1;
  if (dpr <= 2) score += 1;
  if (isMobile) score -= 2;

  let tier: QualityTier;
  if (reducedMotion) tier = 'low';
  else if (score >= 5) tier = 'high';
  else if (score >= 3) tier = 'medium';
  else tier = 'low';

  const presets: Record<QualityTier, Omit<QualitySettings, 'tier' | 'isMobile'>> = {
    high: { dpr: [1, Math.min(dpr, 2)], particleScale: 1.0, postfx: true },
    medium: { dpr: [1, Math.min(dpr, 1.5)], particleScale: 0.6, postfx: true },
    low: { dpr: [1, 1], particleScale: 0.3, postfx: false },
  };

  return { tier, isMobile, ...presets[tier] };
}

export function useQualityTier(): QualitySettings {
  const [settings, setSettings] = useState<QualitySettings>(() => detectTier());

  useEffect(() => {
    const recompute = () => setSettings(detectTier());
    const mq = window.matchMedia('(max-width: 768px)');
    mq.addEventListener?.('change', recompute);
    window.addEventListener('resize', recompute);
    return () => {
      mq.removeEventListener?.('change', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, []);

  return useMemo(() => settings, [settings]);
}

export default useQualityTier;

/** Global particle multiplier per tier (read by every scene). */
export const PARTICLE_SCALE: Record<QualityTier, number> = {
  high: 1.0,
  medium: 0.6,
  low: 0.3,
};

export function getParticleScale(tier: QualityTier): number {
  return PARTICLE_SCALE[tier] ?? 0.6;
}
