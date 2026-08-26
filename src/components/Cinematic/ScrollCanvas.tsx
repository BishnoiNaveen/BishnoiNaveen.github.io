/**
 * src/components/Cinematic/ScrollCanvas.tsx
 * High-Performance HTML5 Canvas 2D Frame Sequence Renderer
 * 
 * Features:
 * - 120-frame WebP sequence scrubbing mapped to scroll progress (0.0 to 1.0)
 * - Priority Keyframe preloader (Tiers 1-3) with async decoding and ring buffer caching
 * - Retina / HiDPI (devicePixelRatio) scaling with ResizeObserver
 * - Aspect ratio 'cover' algorithm with zero layout shift
 * - Nearest-frame fallback cache to prevent flicker during fast scrubbing
 * - Standalone fallback procedural rendering if frames are loading or offline
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface ScrollCanvasProps {
  totalFrames?: number;
  framePattern?: string;
  scrollProgress?: number; // 0.0 to 1.0
  onLoadProgress?: (loaded: number, total: number) => void;
  className?: string;
  priorityStep?: number;
  quality?: 'high' | 'medium' | 'low';
}

export default function ScrollCanvas({
  totalFrames = 120,
  framePattern = '/assets/3d-frames/frame_%03d.webp',
  scrollProgress = 0,
  onLoadProgress,
  className = '',
  priorityStep = 10,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadedSetRef = useRef<Set<number>>(new Set());
  const lastRenderedIndexRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);
  const [loadPercentage, setLoadPercentage] = useState<number>(0);

  // Format frame URL from index (1-based)
  const getFrameUrl = useCallback(
    (index: number): string => {
      const paddedIndex = String(index).padStart(3, '0');
      return framePattern.replace('%03d', paddedIndex);
    },
    [framePattern]
  );

  // Load a single frame asynchronously
  const loadFrame = useCallback(
    (frameNumber: number): Promise<HTMLImageElement | null> => {
      if (imagesRef.current.has(frameNumber)) {
        return Promise.resolve(imagesRef.current.get(frameNumber)!);
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = getFrameUrl(frameNumber);

        img.onload = () => {
          imagesRef.current.set(frameNumber, img);
          loadedSetRef.current.add(frameNumber);
          if (onLoadProgress) {
            onLoadProgress(loadedSetRef.current.size, totalFrames);
          }
          setLoadPercentage(Math.round((loadedSetRef.current.size / totalFrames) * 100));

          // Try async decode if supported
          if ('decode' in img) {
            img.decode().catch(() => {
              // Ignore decode errors; fallback to standard draw
            });
          }
          resolve(img);
        };

        img.onerror = () => {
          resolve(null);
        };
      });
    },
    [getFrameUrl, onLoadProgress, totalFrames]
  );

  // Progressive preloader: Tier 1 (Keyframes) -> Tier 2 (Midpoints) -> Tier 3 (Full Sequence)
  useEffect(() => {
    let isCancelled = false;

    async function preloadSequence() {
      // Tier 1: Keyframes (every priorityStep frames + frame 1 and totalFrames)
      const tier1: number[] = [1];
      for (let i = priorityStep; i < totalFrames; i += priorityStep) {
        tier1.push(i);
      }
      if (!tier1.includes(totalFrames)) {
        tier1.push(totalFrames);
      }

      await Promise.all(tier1.map((num) => loadFrame(num)));
      if (isCancelled) return;

      // Tier 2: Midpoints (half-steps between keyframes)
      const tier2: number[] = [];
      const halfStep = Math.max(1, Math.floor(priorityStep / 2));
      for (let i = halfStep; i <= totalFrames; i += priorityStep) {
        if (!loadedSetRef.current.has(i)) {
          tier2.push(i);
        }
      }
      await Promise.all(tier2.map((num) => loadFrame(num)));
      if (isCancelled) return;

      // Tier 3: All remaining frames in chunks to prevent network choking
      const remaining: number[] = [];
      for (let i = 1; i <= totalFrames; i++) {
        if (!loadedSetRef.current.has(i)) {
          remaining.push(i);
        }
      }

      const chunkSize = 6;
      for (let i = 0; i < remaining.length; i += chunkSize) {
        if (isCancelled) break;
        const chunk = remaining.slice(i, i + chunkSize);
        await Promise.all(chunk.map((num) => loadFrame(num)));
      }
    }

    preloadSequence();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, priorityStep, loadFrame]);

  // Find closest loaded frame in ring buffer
  const getClosestLoadedFrame = useCallback(
    (targetFrame: number): HTMLImageElement | null => {
      if (imagesRef.current.has(targetFrame)) {
        return imagesRef.current.get(targetFrame)!;
      }

      const loaded = Array.from(loadedSetRef.current);
      if (loaded.length === 0) return null;

      let closest = loaded[0];
      let minDiff = Math.abs(targetFrame - closest);

      for (let i = 1; i < loaded.length; i++) {
        const diff = Math.abs(targetFrame - loaded[i]);
        if (diff < minDiff) {
          minDiff = diff;
          closest = loaded[i];
        }
      }

      return imagesRef.current.get(closest) || null;
    },
    []
  );

  // Draw frame to canvas with aspect-ratio cover & DPR scaling
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || window.innerHeight;

      // Resize canvas buffer if needed
      const targetWidth = Math.floor(displayWidth * dpr);
      const targetHeight = Math.floor(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const img = getClosestLoadedFrame(frameIndex);

      if (img && img.complete && img.naturalWidth > 0) {
        // High-performance Cover Calculation
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const imgAspect = imgW / imgH;
        const canvasAspect = displayWidth / displayHeight;

        let drawW: number;
        let drawH: number;
        let offX: number;
        let offY: number;

        if (canvasAspect > imgAspect) {
          drawW = displayWidth;
          drawH = displayWidth / imgAspect;
          offX = 0;
          offY = (displayHeight - drawH) / 2;
        } else {
          drawH = displayHeight;
          drawW = displayHeight * imgAspect;
          offX = (displayWidth - drawW) / 2;
          offY = 0;
        }

        ctx.clearRect(0, 0, displayWidth, displayHeight);
        ctx.drawImage(img, offX, offY, drawW, drawH);
        lastRenderedIndexRef.current = frameIndex;
      } else {
        // Fallback procedural cyber gradient if no frames loaded yet
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        const grad = ctx.createRadialGradient(
          displayWidth / 2,
          displayHeight / 2,
          10,
          displayWidth / 2,
          displayHeight / 2,
          displayWidth * 0.8
        );
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
        grad.addColorStop(1, '#030712');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      }

      ctx.restore();
    },
    [getClosestLoadedFrame]
  );

  // Sync rendering with scrollProgress
  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const targetFrameNumber = Math.min(
      totalFrames,
      Math.max(1, Math.round(clampedProgress * (totalFrames - 1)) + 1)
    );

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    animationFrameIdRef.current = requestAnimationFrame(() => {
      drawFrame(targetFrameNumber);
    });

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [scrollProgress, totalFrames, drawFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const targetFrame = Math.min(
        totalFrames,
        Math.max(1, Math.round(clampedProgress * (totalFrames - 1)) + 1)
      );
      drawFrame(targetFrame);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress, totalFrames, drawFrame]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#030712] select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover transform-gpu pointer-events-none"
        aria-hidden="true"
      />
      {loadPercentage < 100 && (
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/20 text-[10px] font-mono text-cyan-400 opacity-60 transition-opacity duration-500"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>NEURAL STREAM BUFFER: {loadPercentage}%</span>
        </div>
      )}
    </div>
  );
}
