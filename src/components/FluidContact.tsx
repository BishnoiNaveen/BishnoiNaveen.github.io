import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  Mail, 
  Copy, 
  Check, 
  FileText, 
  ArrowUpRight, 
  Sparkles, 
  Send, 
  MessageSquare, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './icons';

export const FluidContact: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const emailAddress = 'naveenbishnoi108@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-6 text-left">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
          <Mail size={14} />
          <span>DIRECT DISPATCH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Let's Build Something Resilient
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Open to technical leadership, AI agent system architecture, distributed engineering, and mission-critical collaborations.
        </p>
      </div>

      {/* Main Grid: Email Card & Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Email Direct Action Card */}
        <motion.div
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          transition={springPresets.buoyant}
          className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col justify-between gap-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 w-fit">
                <Mail size={24} />
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Response SLA: &lt; 24h</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Direct Email Dispatch</h3>
              <p className="text-xs text-gray-400 mt-1">
                Reach out directly for architectural consultation, autonomous pipeline design, or full-time opportunities.
              </p>
            </div>

            {/* Email Box & Quick Copy */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-gray-200">
              <span className="truncate mr-2 select-all">{emailAddress}</span>

              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-sans text-xs font-semibold shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                aria-label="Copy email address to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send size={14} />
              <span>Launch Mail Client</span>
            </a>

            <a
              href="/Naveen_Bishnoi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <FileText size={14} />
              <span>Download Resume</span>
              <ArrowUpRight size={13} className="opacity-60" />
            </a>
          </div>
        </motion.div>

        {/* Right Side: Social & Location Connect Cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* GitHub Card */}
          <motion.a
            href="https://github.com/BishnoiNaveen"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : { y: -3, x: 2 }}
            transition={springPresets.snappy}
            className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 border border-white/10 hover:border-violet-500/40 shadow-lg backdrop-blur-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-gray-200 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                <GithubIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">GitHub</div>
                <div className="text-xs text-gray-400">@BishnoiNaveen</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* LinkedIn Card */}
          <motion.a
            href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : { y: -3, x: 2 }}
            transition={springPresets.snappy}
            className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 border border-white/10 hover:border-violet-500/40 shadow-lg backdrop-blur-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-gray-200 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                <LinkedinIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">LinkedIn</div>
                <div className="text-xs text-gray-400">Naveen Bishnoi</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* Instagram Card */}
          <motion.a
            href="https://www.instagram.com/bishnoi_.naveen?igsh=MTRiYzlzY28zemcwNA=="
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : { y: -3, x: 2 }}
            transition={springPresets.snappy}
            className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 border border-white/10 hover:border-violet-500/40 shadow-lg backdrop-blur-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/5 text-gray-200 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                <InstagramIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">Instagram</div>
                <div className="text-xs text-gray-400">@bishnoi_.naveen</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* Location & Timezone Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-violet-400" />
              <span>India / Global Remote</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <Clock size={14} className="text-emerald-400" />
              <span>IST (UTC+5:30)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification on Copy */}
      <AnimatePresence>
        {copiedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={springPresets.snappy}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl shadow-emerald-950/50 backdrop-blur-xl"
          >
            <Check size={16} className="text-emerald-400" />
            <span className="text-xs font-semibold">Email copied to clipboard ({emailAddress})</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FluidContact;
