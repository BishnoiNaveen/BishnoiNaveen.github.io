import React, { useEffect, useRef } from 'react';

export default function AmbientAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Generate lightweight shimmering starlight particles
    const particleCount = Math.min(60, Math.floor(width / 25));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.3 - 0.1, // gently drift upward
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle shimmering particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Soft twinkle pulse
        const twinkle = Math.sin(time + p.phase) * 0.15;
        const currentAlpha = Math.max(0.05, Math.min(0.8, p.baseAlpha + twinkle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 160, 255, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 113, 227, 0.4)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
    >
      {/* Primary Luminous Radial Mesh (Top Center) */}
      <div
        className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-60 dark:opacity-35 blur-[120px] transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 113, 227, 0.22) 0%, rgba(128, 32, 232, 0.14) 45%, transparent 75%)',
        }}
      />

      {/* Secondary Ambient Accent (Top Right) */}
      <div
        className="absolute top-[10%] -right-[150px] w-[600px] h-[600px] rounded-full opacity-40 dark:opacity-25 blur-[140px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
          animationDuration: '8s',
        }}
      />

      {/* Tertiary Ambient Accent (Middle Left) */}
      <div
        className="absolute top-[45%] -left-[200px] w-[700px] h-[700px] rounded-full opacity-35 dark:opacity-20 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0, 113, 227, 0.1) 60%, transparent 75%)',
        }}
      />

      {/* Deep Canvas Particle Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70 dark:opacity-90" />
    </div>
  );
}
