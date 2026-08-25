import React from 'react';
import { motion } from 'framer-motion';
import { bioData } from '../data/bio';
import { springPresets } from '../lib/springs';

export default function ResumeComponent() {
  const resumeJsonSchema = {
    engineer: "Naveen Bishnoi",
    role: "Software Architect & AI Systems Engineer",
    location: "India",
    timezone: "IST (UTC+5:30)",
    email: "0029bishnoinaveen@gmail.com",
    trajectory_tiers: [
      {
        tier: 1,
        classification: "Corporate Engineering",
        organization: "KRONE Agriculture India",
        title: "Software Engineer — IoT & Edge Telematics",
        period: "2023 — Present",
        invariants: [
          "50Hz Linux SocketCAN edge ingest",
          "72h offline SQLite circular ring buffer",
          "Zero packet loss over cellular LTE dropouts"
        ]
      },
      {
        tier: 2,
        classification: "Academic Foundation",
        organization: "Academic Computer Science Graduate",
        title: "Bachelor of Computer Applications (BCA)",
        period: "Graduated",
        invariants: [
          "Core Operating Systems & Memory Management",
          "Relational Database Invariants & SQL Schema Design",
          "Advanced Graph Algorithms & Data Structures"
        ]
      },
      {
        tier: 3,
        classification: "Open-Source Systems Leadership",
        organization: "Distributed Open-Source Projects",
        title: "Systems Lead (GAMS, AEONIS, Ultron, Sentinel)",
        period: "2023 — Present",
        invariants: [
          "POSIX rename() atomic inode file swapping",
          "Byzantine Fault Tolerant (3f+1) consensus quorum",
          "Kahn topological DAG cycle detection engine",
          "Static AST taint analysis & surgical diff synthesis"
        ]
      }
    ],
    verified_invariants: {
      valgrind_memory_leak: "0 bytes lost (clean exit)",
      lighthouse_score: "100/100 across all categories",
      inp_latency: "< 16ms interaction response",
      cls_stability: "0.000 layout shift"
    }
  };

  return (
    <div className="w-full max-w-[96rem] mx-auto flex flex-col gap-16 text-[var(--color-text-primary)]">
      {/* HEADER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-[var(--color-border)] mb-6 select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
            <span className="type-badge-label text-[var(--color-text-secondary)] text-[11px] font-semibold tracking-[0.08em] uppercase">
              Curriculum Vitae · Systems &amp; AI Engineering
            </span>
          </div>

          <h1 className="type-headline-chapter text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)] leading-[1.05]">
            Naveen Bishnoi
          </h1>
          <p className="type-subhead-lead text-xl text-[var(--color-text-secondary)] mt-2 font-medium">
            Software Architect &amp; AI Systems Engineer · KRONE Agriculture India
          </p>
        </div>

        {/* PDF Download Button */}
        <div className="self-start lg:self-auto">
          <a
            href="/Naveen_Bishnoi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--color-accent)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Verified Resume PDF</span>
          </a>
        </div>
      </div>

      {/* 2-COLUMN SCHEMA & TIMELINE VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: 3-Tier Human Timeline */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)] pb-4 border-b border-[var(--color-border-subtle)]">
            Verified Trajectory Tiers
          </h2>

          {bioData.timeline.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-sm)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  Tier {item.tier} · {item.tierLabel}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {item.period}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {item.organization}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {item.summary}
              </p>

              <div className="pt-2 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-primary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: High-Precision JSON Machine Invariants */}
        <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-28">
          <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)] pb-4 border-b border-[var(--color-border-subtle)]">
            Machine Invariants Schema
          </h2>

          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--material-1-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft-md)] font-mono text-xs overflow-x-auto relative">
            <div className="flex gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            </div>

            <pre className="text-[var(--color-text-secondary)] leading-relaxed">
              <code>{JSON.stringify(resumeJsonSchema, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
