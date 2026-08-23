import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { useMagnetic } from '../hooks/useMagnetic';
import { 
  Terminal, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Layers,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export const HeroInteractiveCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // 3D Perspective Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Buoyant spring physics for tilt
  const springX = useSpring(mouseX, springPresets.buoyant);
  const springY = useSpring(mouseY, springPresets.buoyant);

  // Transform coordinates to degree tilts
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  // Magnetic hook for CTAs
  const magneticPrimary = useMagnetic<HTMLAnchorElement>(0.25);
  const magneticSecondary = useMagnetic<HTMLAnchorElement>(0.25);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }, [mouseX, mouseY, shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleCopyCode = () => {
    const code = `// Hermes Multi-Agent Orchestrator
const hermes = new AgentConsensusEngine({
  protocol: 'Byzantine_Fault_Tolerant',
  invariants: ['Zero_False_Positive_AST', 'CAN_50Hz_ISOBUS'],
  sla: { p99LatencyMs: 25, offlineBufferHours: 72 }
});
await hermes.executeTopologicalDAG(taskPlan);`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
      {/* Left Column: Heading & Live Status Badges & Magnetic CTAs */}
      <div className="lg:col-span-6 flex flex-col items-start gap-6 text-left">
        {/* Live Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.snappy}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Open to Select Architectures</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.snappy, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium backdrop-blur-md"
          >
            <Activity className="w-3 h-3 text-violet-400" />
            <span>KRONE Edge Telematics</span>
          </motion.div>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.buoyant}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-300">
              Autonomous Systems
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.buoyant, delay: 0.1 }}
            className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed mt-2"
          >
            Architecting production-grade multi-agent swarms, high-throughput IoT edge telemetry, and zero-compromise fluid interfaces with WWDC spring physics.
          </motion.p>
        </div>

        {/* Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.buoyant, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <motion.a
            ref={magneticPrimary.ref}
            style={shouldReduceMotion ? {} : magneticPrimary.style}
            href="#workflows"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <span>Explore Workflows</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.a
            ref={magneticSecondary.ref}
            style={shouldReduceMotion ? {} : magneticSecondary.style}
            href="#hermes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-200 bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/10 hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Hermes Telemetry</span>
          </motion.a>
        </motion.div>

        {/* Live Architecture Micro-Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 w-full max-w-md">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">Sensors</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">50 Hz</div>
            <div className="text-[11px] text-gray-400">ISOBUS / CAN</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">Consensus</div>
            <div className="text-xl font-bold text-violet-400 font-mono mt-0.5">&lt; 25ms</div>
            <div className="text-[11px] text-gray-400">BFT Quorum</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">Lighthouse</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">100/100</div>
            <div className="text-[11px] text-gray-400">Pure Fluidity</div>
          </div>
        </div>
      </div>

      {/* Right Column: 3D Interactive Tilt Card */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="lg:col-span-6 perspective-[1200px] w-full flex justify-center py-4"
      >
        <motion.div
          style={
            shouldReduceMotion
              ? {}
              : {
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }
          }
          className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden group"
        >
          {/* Dynamic Specular Glare Layer */}
          {!shouldReduceMotion && (
            <motion.div
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12) 0%, transparent 60%)`,
              }}
              className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-75 transition-opacity"
            />
          )}

          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-gray-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                hermes_core.ts
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-colors"
              aria-label="Copy Code Snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Code / Architecture Invariants */}
          <div className="font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <div className="text-gray-500">// Hermes Autonomous Multi-Agent Consensus</div>
            <div>
              <span className="text-fuchsia-400">const</span>{' '}
              <span className="text-blue-300">hermes</span> ={' '}
              <span className="text-fuchsia-400">new</span>{' '}
              <span className="text-emerald-400">AgentConsensusEngine</span>({'{'}
            </div>
            <div className="pl-4">
              <span className="text-violet-300">protocol</span>:{' '}
              <span className="text-amber-300">'Byzantine_Fault_Tolerant'</span>,
            </div>
            <div className="pl-4">
              <span className="text-violet-300">invariants</span>: [
              <span className="text-amber-300">'Zero_False_Positive_AST'</span>,{' '}
              <span className="text-amber-300">'CAN_50Hz_ISOBUS'</span>],
            </div>
            <div className="pl-4">
              <span className="text-violet-300">sla</span>: {'{ '}
              <span className="text-cyan-300">p99LatencyMs</span>: <span className="text-amber-400">25</span>,{' '}
              <span className="text-cyan-300">offlineBufferHours</span>: <span className="text-amber-400">72</span> {'}'}
            </div>
            <div>{'}'});</div>
            <div className="pt-1">
              <span className="text-fuchsia-400">await</span>{' '}
              <span className="text-blue-300">hermes</span>.
              <span className="text-indigo-400">executeTopologicalDAG</span>(taskPlan);
            </div>
          </div>

          {/* Active Live Micro-Feed Status */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Zap size={16} />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-gray-400">Active Turn</div>
                <div className="text-xs font-semibold text-white font-mono">Turn #1,540</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-gray-400">Quorum State</div>
                <div className="text-xs font-semibold text-emerald-300 font-mono">Consensus OK</div>
              </div>
            </div>
          </div>

          {/* Interactive Tilt Prompt */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-400" />
              WWDC 2018 Fluid Buoyant Spring
            </span>
            <span>Hover to Tilt</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroInteractiveCanvas;
