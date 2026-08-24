/**
 * src/lib/springs.ts — Single Source of Truth for Apple Fluid Spring Physics
 * Based on Apple WWDC 2018 Fluid Interface Principles (Session 803)
 */
import type { Transition } from 'framer-motion';

export const springPresets = {
  // Snappy micro-interactions (buttons, toggles, chips)
  snappy: {
    type: 'spring',
    mass: 0.6,
    stiffness: 450,
    damping: 28,
    restDelta: 0.001,
  } satisfies Transition,

  // Fluid UI gliding (navigation pill, tabs, active indicators)
  glide: {
    type: 'spring',
    mass: 0.8,
    stiffness: 380,
    damping: 30,
    restDelta: 0.001,
  } satisfies Transition,

  // Responsive buoyancy (cards, preview containers, floating widgets)
  buoyant: {
    type: 'spring',
    mass: 1.0,
    stiffness: 300,
    damping: 26,
    restDelta: 0.001,
  } satisfies Transition,

  // Continuous spatial morphing (FLIP shared layout expansions)
  morph: {
    type: 'spring',
    mass: 1.1,
    stiffness: 280,
    damping: 26,
    restDelta: 0.001,
  } satisfies Transition,

  // Cinematic view shifts (modals, sheets, page transitions)
  cinematic: {
    type: 'spring',
    mass: 1.2,
    stiffness: 220,
    damping: 26,
    restDelta: 0.001,
  } satisfies Transition,

  // Sheet & Drawer presentation / gestural dismiss
  sheet: {
    type: 'spring',
    mass: 1.0,
    stiffness: 320,
    damping: 32,
    restDelta: 0.001,
  } satisfies Transition,

  // Magnetic cursor tracker
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
