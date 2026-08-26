/**
 * src/lib/springs.ts — Single Source of Truth for Apple Fluid Spring Physics
 * Based on Apple WWDC 2018 Fluid Interface Principles (Session 803)
 * Calibrated for Framer Motion and physical mass-spring-damper harmonic oscillators.
 */
import type { Transition } from 'framer-motion';

export interface SpringConfig {
  type: 'spring';
  mass: number;
  stiffness: number;
  damping: number;
  restDelta: number;
}

export const springPresets = {
  // Snappy: instant response for buttons, toggles, chips, active feedback
  snappy: {
    type: 'spring',
    mass: 0.6,
    stiffness: 450,
    damping: 28,
    restDelta: 0.001,
  } satisfies Transition,

  // Glide: Apple standard benchmark for navigation dock and tab pills
  glide: {
    type: 'spring',
    mass: 0.8,
    stiffness: 380,
    damping: 30,
    restDelta: 0.001,
  } satisfies Transition,

  // Buoyant: Spatial lift for cards and bento widgets on hover
  buoyant: {
    type: 'spring',
    mass: 1.0,
    stiffness: 300,
    damping: 26,
    restDelta: 0.001,
  } satisfies Transition,

  // Morph: Shared layout transitions across categories, tabs, and FLIP expansions
  morph: {
    type: 'spring',
    mass: 1.1,
    stiffness: 280,
    damping: 26,
    restDelta: 0.001,
  } satisfies Transition,

  // Cinematic: Smooth authoritative entrance for modal sheets, chapter reveals, and overlays
  cinematic: {
    type: 'spring',
    mass: 1.2,
    stiffness: 220,
    damping: 24,
    restDelta: 0.001,
  } satisfies Transition,

  // Sheet: Mobile drawer presentation and drag-to-dismiss gesture tracking
  sheet: {
    type: 'spring',
    mass: 1.0,
    stiffness: 320,
    damping: 32,
    restDelta: 0.001,
  } satisfies Transition,

  // Magnetic: Fluid pointer tracking and button gravitational pull
  magnetic: {
    type: 'spring',
    mass: 0.5,
    stiffness: 260,
    damping: 20,
    restDelta: 0.001,
  } satisfies Transition,
} as const;

export type SpringPresetName = keyof typeof springPresets;

export interface SpringPresets {
  snappy: Transition;
  glide: Transition;
  buoyant: Transition;
  morph: Transition;
  cinematic: Transition;
  sheet: Transition;
  magnetic: Transition;
}

// Named exports for convenient direct imports
export const snappy = springPresets.snappy;
export const glide = springPresets.glide;
export const buoyant = springPresets.buoyant;
export const morph = springPresets.morph;
export const cinematic = springPresets.cinematic;
export const sheet = springPresets.sheet;
export const magnetic = springPresets.magnetic;

/**
 * Get a spring preset by name with fallback to 'glide'
 */
export function getSpring(name: SpringPresetName): Transition {
  return springPresets[name] ?? springPresets.glide;
}

/**
 * Universal Reduced-Motion Transition (Duration: 0)
 * Bypasses all physical animations when reduced motion is preferred.
 */
export const instantTransition: Transition = {
  type: 'tween',
  duration: 0,
};

/**
 * Get an accessible transition respecting the user's reduced-motion preference.
 */
export function getAccessibleSpring(name: SpringPresetName, prefersReducedMotion = false): Transition {
  if (prefersReducedMotion) {
    return instantTransition;
  }
  return springPresets[name] ?? springPresets.glide;
}

/**
 * Apple WWDC 2018 Standard Mechanical Click Compression Constants
 */
export const mechanicalClick = {
  scale: 0.97,
} as const;

export const cardTap = {
  scale: 0.985,
} as const;

/**
 * Compute the damping ratio zeta = damping / (2 * sqrt(mass * stiffness))
 */
export function computeDampingRatio(mass: number, stiffness: number, damping: number): number {
  return damping / (2 * Math.sqrt(mass * stiffness));
}

