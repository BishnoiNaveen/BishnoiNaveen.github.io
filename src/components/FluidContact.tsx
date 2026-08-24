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
  const emailAddress = '0029bishnoinaveen@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-6 text-left">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#0071E3] font-bold uppercase tracking-wider mb-1.5">
          <Mail size={14} className="text-[#0071E3]" />
          <span>Direct Dispatch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
          Let's Build Something Resilient
        </h2>
        <p className="text-sm sm:text-base text-[#424245] mt-1.5 max-w-2xl leading-relaxed">
          Open to technical leadership, AI agent system architecture, distributed engineering, and mission-critical collaborations.
        </p>
      </div>

      {/* Main Grid: Email Card & Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Email Direct Action Card */}
        <motion.div
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          transition={springPresets.buoyant}
          className="md:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white/70 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_-8px_rgba(0,113,227,0.12)] transition-all flex flex-col justify-between gap-6"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-50 text-[#0071E3] border border-blue-200/60 w-fit shadow-sm">
                <Mail size={24} />
              </div>
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Response SLA: &lt; 24h</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1D1D1F]">Direct Email Dispatch</h3>
              <p className="text-xs sm:text-sm text-[#424245] mt-1 leading-relaxed">
                Reach out directly for architectural consultation, autonomous pipeline design, or full-time opportunities.
              </p>
            </div>

            {/* Email Box & Quick Copy */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.06] font-mono text-xs sm:text-sm text-[#1D1D1F] shadow-inner">
              <span className="truncate mr-2 select-all font-medium">{emailAddress}</span>

              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-sans text-xs font-semibold shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] shadow-sm"
                aria-label="Copy email address to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-white" />
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
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/[0.06]">
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] shadow-[0_4px_14px_rgba(0,113,227,0.32)] transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <Send size={14} />
              <span>Launch Mail Client</span>
            </a>

            <a
              href="/Naveen_Bishnoi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#1D1D1F] bg-white/80 hover:bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
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
            className="p-4 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] hover:border-[#0071E3]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,113,227,0.10)] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-black/[0.03] text-[#424245] group-hover:text-[#0071E3] group-hover:bg-blue-50 transition-colors">
                <GithubIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">GitHub</div>
                <div className="text-xs text-[#86868B]">@BishnoiNaveen</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* LinkedIn Card */}
          <motion.a
            href="https://www.linkedin.com/in/naveen-bishnoi-b0b00941a"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : { y: -3, x: 2 }}
            transition={springPresets.snappy}
            className="p-4 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] hover:border-[#0071E3]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,113,227,0.10)] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-black/[0.03] text-[#424245] group-hover:text-[#0071E3] group-hover:bg-blue-50 transition-colors">
                <LinkedinIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">LinkedIn</div>
                <div className="text-xs text-[#86868B]">Naveen Bishnoi</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* Instagram Card */}
          <motion.a
            href="https://www.instagram.com/bishnoi_.naveen?igsh=MTRiYzlzY28zemcwNA=="
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : { y: -3, x: 2 }}
            transition={springPresets.snappy}
            className="p-4 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-2xl border-t border-l border-white/90 border-r border-b border-black/[0.06] hover:border-[#0071E3]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,113,227,0.10)] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-black/[0.03] text-[#424245] group-hover:text-[#0071E3] group-hover:bg-blue-50 transition-colors">
                <InstagramIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">Instagram</div>
                <div className="text-xs text-[#86868B]">@bishnoi_.naveen</div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </motion.a>

          {/* Location & Timezone Card */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-between text-xs text-[#424245]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#0071E3]" />
              <span>India / Global Remote</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <Clock size={14} className="text-emerald-700" />
              <span className="font-medium text-emerald-800">IST (UTC+5:30)</span>
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/90 border border-emerald-500/30 text-[#1D1D1F] shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          >
            <Check size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold">Email copied to clipboard ({emailAddress})</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FluidContact;
