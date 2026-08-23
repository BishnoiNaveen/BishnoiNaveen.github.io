import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate,
  useReducedMotion,
  useInView 
} from 'framer-motion';
import { springPresets } from '../lib/springs';
import { useMagnetic } from '../hooks/useMagnetic';
import { 
  Terminal, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Gauge,
  Radio,
  Server,
  Cpu
} from 'lucide-react';

// ————————————————————————————————————————————————————————————
// Sub-Component: Live Animated Stat Counter
// ————————————————————————————————————————————————————————————
interface BentoStatProps {
  prefix?: string;
  targetValue: number;
  suffix?: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accentColor: string;
  delay?: number;
}

const BentoStatCard: React.FC<BentoStatProps> = ({
  prefix = '',
  targetValue,
  suffix = '',
  label,
  sublabel,
  icon,
  accentColor,
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(shouldReduceMotion ? targetValue : 0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    mass: 0.8,
    stiffness: 85,
    damping: 16,
    restDelta: 0.01
  });

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      const timer = setTimeout(() => {
        motionValue.set(targetValue);
      }, delay * 1000);
      return () => clearTimeout(timer);
    } else if (shouldReduceMotion) {
      setDisplayValue(targetValue);
    }
  }, [isInView, motionValue, targetValue, delay, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue, shouldReduceMotion]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...springPresets.buoyant, delay }}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
      className="group relative rounded-2xl bg-white/60 backdrop-blur-xl border-t border-l border-white/90 border-r border-b border-black/[0.06] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] hover:bg-white/80 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Specular Inner Glare Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B] flex items-center gap-1.5">
          {label}
        </div>
        <div 
          className="p-1.5 rounded-lg bg-slate-100/80 text-[#1D1D1F] group-hover:scale-110 transition-transform duration-300"
          style={{ color: accentColor }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1 my-1">
        {prefix && (
          <span className="text-lg font-bold text-[#1D1D1F] font-mono">{prefix}</span>
        )}
        <span className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] font-mono tracking-tight">
          {displayValue}
        </span>
        {suffix && (
          <span className="text-base font-bold text-[#424245] font-mono">{suffix}</span>
        )}
      </div>

      <div className="text-[11px] font-medium text-[#86868B] group-hover:text-[#424245] transition-colors leading-tight">
        {sublabel}
      </div>
    </motion.div>
  );
};

// ————————————————————————————————————————————————————————————
// Main Component: Hero
// ————————————————————————————————————————————————————————————
export const Hero: React.FC = () => {
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
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45) 0%, transparent 65%)`;

  // Magnetic hook for CTAs
  const magneticPrimary = useMagnetic<HTMLAnchorElement>(0.25);
  const magneticSecondary = useMagnetic<HTMLAnchorElement>(0.25);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
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

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.warn('Clipboard write failed:', err);
      });
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-8 px-4 sm:px-6">
      
      {/* Left Column: Eyebrows, Headline, Sub-headline, CTAs & Bento Stats */}
      <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
        
        {/* Live Availability & Telemetry Glass Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.snappy}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-500/20 text-emerald-700 text-xs font-semibold backdrop-blur-md shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for Select Architectures</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.snappy, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-500/20 text-[#0071E3] text-xs font-semibold backdrop-blur-md shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>KRONE Telematics • 50Hz CAN</span>
          </motion.div>
        </div>

        {/* High-Impact Apple Headline Lockup */}
        <div className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.buoyant}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.035em] text-[#1D1D1F] leading-[1.05]"
          >
            Engineering <br />
            Autonomous Systems.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0071E3] via-[#AF52DE] to-[#FF2D55]">
              Redefining Intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.buoyant, delay: 0.12 }}
            className="text-base sm:text-lg lg:text-xl text-[#424245] max-w-2xl font-normal leading-relaxed mt-2"
          >
            Architecting production-grade multi-agent swarms, high-throughput IoT edge telemetry, and zero-compromise fluid interfaces with WWDC spring physics.
          </motion.p>
        </div>

        {/* Apple Capsule CTAs (Primary Blue + Glass Secondary) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.buoyant, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 pt-1"
        >
          <motion.a
            ref={magneticPrimary.ref}
            style={shouldReduceMotion ? {} : magneticPrimary.style}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            href="#workflows"
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] shadow-[0_4px_18px_rgba(0,113,227,0.35)] hover:shadow-[0_8px_26px_rgba(0,113,227,0.45)] border border-white/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
          >
            <span>Explore Workflows</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.a
            ref={magneticSecondary.ref}
            style={shouldReduceMotion ? {} : magneticSecondary.style}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            href="#hermes"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold text-[#1D1D1F] bg-white/70 hover:bg-white/90 active:bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
          >
            <Cpu className="w-4 h-4 text-[#0071E3]" />
            <span>Hermes Telemetry</span>
          </motion.a>
        </motion.div>

        {/* Bento Quick-Stats Grid (4 Interactive Live Metric Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full pt-4">
          <BentoStatCard
            targetValue={50}
            suffix="Hz"
            label="Telematics"
            sublabel="ISOBUS / CAN Ingest"
            icon={<Radio size={16} />}
            accentColor="#0071E3"
            delay={0.25}
          />
          <BentoStatCard
            prefix="< "
            targetValue={25}
            suffix="ms"
            label="Consensus"
            sublabel="BFT Quorum Finality"
            icon={<Zap size={16} />}
            accentColor="#AF52DE"
            delay={0.30}
          />
          <BentoStatCard
            targetValue={100}
            suffix="/100"
            label="Lighthouse"
            sublabel="Zero CLS • Fluid 60fps"
            icon={<Gauge size={16} />}
            accentColor="#34C759"
            delay={0.35}
          />
          <BentoStatCard
            targetValue={100}
            suffix="%"
            label="Resilience"
            sublabel="72h SQLite Ring Buffer"
            icon={<Server size={16} />}
            accentColor="#FF9500"
            delay={0.40}
          />
        </div>
      </div>

      {/* Right Column: 3D Interactive Hermes Architecture Card */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="lg:col-span-5 perspective-[1200px] w-full flex justify-center py-2"
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
          className="relative w-full max-w-md sm:max-w-lg rounded-[28px] bg-white/75 border-t border-l border-white/95 border-r border-b border-black/[0.08] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-2xl overflow-hidden group"
        >
          {/* Dynamic Specular Glare Reflection Layer */}
          {!shouldReduceMotion && (
            <motion.div
              style={{
                background: glareBackground,
              }}
              className="pointer-events-none absolute inset-0 z-20 rounded-[28px] opacity-80 transition-opacity"
            />
          )}

          {/* Window Top Controls & Title */}
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
              <span className="ml-2 text-xs font-mono text-[#86868B] flex items-center gap-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-[#0071E3]" />
                hermes_core.ts
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-[#424245] hover:text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] active:bg-black/[0.12] px-2.5 py-1 rounded-lg border border-black/[0.06] transition-colors"
              aria-label="Copy Code Snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#86868B]" />
                  <span className="font-medium">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* High-Contrast Syntax Highlighted Code Viewer */}
          <div className="font-mono text-xs text-[#1D1D1F] leading-relaxed overflow-x-auto p-3.5 rounded-xl bg-slate-900/[0.03] border border-black/[0.04] space-y-1">
            <div className="text-[#86868B] italic">// Hermes Multi-Agent Consensus Protocol</div>
            <div>
              <span className="text-[#AF52DE] font-semibold">const</span>{' '}
              <span className="text-[#0071E3] font-semibold">hermes</span> ={' '}
              <span className="text-[#AF52DE] font-semibold">new</span>{' '}
              <span className="text-[#00C7BE] font-semibold">AgentConsensusEngine</span>({'{'}
            </div>
            <div className="pl-4">
              <span className="text-[#6366F1]">protocol</span>:{' '}
              <span className="text-[#D97706]">'Byzantine_Fault_Tolerant'</span>,
            </div>
            <div className="pl-4">
              <span className="text-[#6366F1]">invariants</span>: [
              <span className="text-[#D97706]">'Zero_False_Positive_AST'</span>,{' '}
              <span className="text-[#D97706]">'CAN_50Hz_ISOBUS'</span>],
            </div>
            <div className="pl-4">
              <span className="text-[#6366F1]">sla</span>: {'{ '}
              <span className="text-[#0071E3]">p99LatencyMs</span>: <span className="text-[#D97706] font-semibold">25</span>,{' '}
              <span className="text-[#0071E3]">offlineBufferHours</span>: <span className="text-[#D97706] font-semibold">72</span> {'}'}
            </div>
            <div>{'}'});</div>
            <div className="pt-1">
              <span className="text-[#AF52DE] font-semibold">await</span>{' '}
              <span className="text-[#0071E3] font-semibold">hermes</span>.
              <span className="text-[#2563EB] font-semibold">executeTopologicalDAG</span>(taskPlan);
            </div>
          </div>

          {/* Active Live Micro-Feed Status */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-black/[0.04]">
              <div className="p-2 rounded-lg bg-violet-100 text-[#AF52DE]">
                <Zap size={16} />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-[#86868B] font-medium">Active Turn</div>
                <div className="text-xs font-bold text-[#1D1D1F] font-mono">Turn #1,540</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-500/10">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={16} />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-emerald-800 font-medium">Quorum State</div>
                <div className="text-xs font-bold text-emerald-700 font-mono">Consensus OK</div>
              </div>
            </div>
          </div>

          {/* Card Footer: Buoyant Micro-Label */}
          <div className="mt-3.5 flex items-center justify-between text-[11px] text-[#86868B] font-mono">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#0071E3]" />
              WWDC 2018 Fluid Buoyant Spring
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1A6]">Hover to Tilt</span>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Hero;
