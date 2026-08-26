import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

const MATERIAL_LAYERS = [
  {
    level: 'Level 4',
    name: 'Modal Architecture Sheet',
    spec: 'rgba(255, 255, 255, 0.94) · blur(48px)',
    purpose: 'Deep case study inspector dialog with focus lock',
    color: '#0071E3',
  },
  {
    level: 'Level 3',
    name: 'Floating Pill Navigation Dock',
    spec: 'rgba(255, 255, 255, 0.78) · blur(40px)',
    purpose: 'Persistent header dock with magnetic fluid spring tracking',
    color: '#5856D6',
  },
  {
    level: 'Level 2',
    name: 'visionOS Restrained Glass Panels',
    spec: 'rgba(255, 255, 255, 0.68) · blur(32px)',
    purpose: 'Interactive controls, preview frames, and bento tiles',
    color: '#34C759',
  },
  {
    level: 'Level 1',
    name: 'Solid Content Surfaces',
    spec: '#FFFFFF / #121215 · 1px border · Soft Shadow',
    purpose: 'Static editorial long-form text & case studies (0KB JS)',
    color: '#FF9500',
  },
  {
    level: 'Level 0',
    name: 'Global Canvas Layer',
    spec: '#F5F5F7 Light / #08080A Dark',
    purpose: 'High-contrast base background with subtle atmospheric tint',
    color: '#86868B',
  },
];

export default function PortfolioExplodedVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(0);

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] inline-block"></span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Astro 7 Islands + visionOS 5-Level Material Hierarchy
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[11px] font-mono font-semibold">
            Lighthouse 100/100 Matrix
          </span>
        </div>
      </div>

      {/* 5-Level Material Hierarchy Stack */}
      <div className="flex flex-col gap-2.5 mb-6">
        {MATERIAL_LAYERS.map((layer, idx) => {
          const isSelected = selectedLayer === idx;
          return (
            <motion.button
              key={layer.level}
              type="button"
              onClick={() => setSelectedLayer(idx)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={springPresets.snappy}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] shadow-sm'
                  : 'border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 hover:border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shrink-0"
                  style={{ backgroundColor: layer.color }}
                >
                  {layer.level}
                </span>
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                    {layer.name}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-mono">
                    {layer.purpose}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0">
                {layer.spec}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Lighthouse 100 Matrix Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
        {[
          { label: 'Performance', score: '100', metric: 'FCP < 0.6s' },
          { label: 'Accessibility', score: '100', metric: 'WCAG 2.2 AAA' },
          { label: 'Best Practices', score: '100', metric: '0 Console Errors' },
          { label: 'SEO', score: '100', metric: 'Full Meta Graph' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--color-success)] flex items-center justify-center text-sm font-bold text-[var(--color-success)] mb-1">
              {item.score}
            </div>
            <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.label}</span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{item.metric}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
