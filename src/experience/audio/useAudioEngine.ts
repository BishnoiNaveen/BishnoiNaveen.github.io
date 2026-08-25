/**
 * src/experience/audio/useAudioEngine.ts
 * Optional cinematic audio — procedural WebAudio ambience. OFF by default.
 *
 * Rules (from brief): NO autoplay. Requires explicit user interaction. A single
 * SOUND ON/OFF toggle gates everything. We synthesize a soft drone + a motion-
 * reactive shimmer so there is zero runtime dependency on third-party audio URLs.
 */

import { useEffect, useRef } from 'react';
import { useTimeline } from '../timeline/CinematicTimeline';

export function useAudioEngine(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const droneRef = useRef<OscillatorNode | null>(null);
  const shimmerRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const progress = useTimeline((s) => s.progress);

  useEffect(() => {
    // Teardown on disable / unmount
    const teardown = () => {
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
      ctxRef.current = null;
      masterRef.current = null;
      droneRef.current = null;
      shimmerRef.current = null;
      lfoRef.current = null;
    };

    if (!enabled) {
      teardown();
      return;
    }

    // Lazily create on first enable (which is always a user gesture in our UI)
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Low drone
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 55;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.18;
    drone.connect(droneGain).connect(master);
    drone.start();

    // Shimmer (motion-reactive)
    const shimmer = ctx.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.value = 220;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.05;
    shimmer.connect(shimmerGain).connect(master);
    shimmer.start();

    // Slow LFO modulating shimmer for life
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain).connect(shimmer.frequency);
    lfo.start();

    droneRef.current = drone;
    shimmerRef.current = shimmer;
    lfoRef.current = lfo;

    // Fade in
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);

    return teardown;
  }, [enabled]);

  // Motion-reactive: drive shimmer pitch from scroll progress
  useEffect(() => {
    const ctx = ctxRef.current;
    const shimmer = shimmerRef.current;
    if (!ctx || !shimmer) return;
    const target = 180 + Math.sin(progress * Math.PI * 6) * 60 + progress * 120;
    shimmer.frequency.setTargetAtTime(target, ctx.currentTime, 0.2);
  }, [progress]);
}
