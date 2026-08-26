import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

const SENSOR_STREAMS = [
  { name: 'Crop Moisture', rate: '50 Hz', value: '14.2%', status: 'NOMINAL', icon: '💧' },
  { name: 'Bale Density', rate: '50 Hz', value: '184 kg/m³', status: 'OPTIMAL', icon: '🌾' },
  { name: 'Hydraulic Pressure', rate: '50 Hz', value: '210 bar', status: 'STABLE', icon: '⚙️' },
  { name: 'Engine Torque Load', rate: '50 Hz', value: '78.4%', status: 'HIGH-YIELD', icon: '🚜' },
];

export default function KroneTelemetryVisualizer() {
  const [isBlackout, setIsBlackout] = useState(false);
  const [bufferUsage, setBufferUsage] = useState(14.8);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isBlackout) {
      const interval = setInterval(() => {
        setBufferUsage((prev) => (prev < 90 ? +(prev + 0.4).toFixed(1) : 90));
      }, 400);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setBufferUsage((prev) => (prev > 14.8 ? +(prev - 1.2).toFixed(1) : 14.8));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isBlackout]);

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-success)] animate-ping"></div>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            KRONE ISOBUS / J1939 CAN Pipeline
          </span>
          <span className="text-xs font-mono text-[var(--color-text-muted)] hidden sm:inline">
            · can0 @ 250 kbps
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setIsBlackout(!isBlackout)}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={springPresets.snappy}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors cursor-pointer ${
              isBlackout
                ? 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/40'
                : 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/40'
            }`}
          >
            {isBlackout ? 'Mode: 72h Cellular Blackout (Active)' : 'Mode: LTE Connected (Burst Stream)'}
          </motion.button>
        </div>
      </div>

      {/* 4-Stage Architectural Pipeline Schematic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            stage: '01. Ingest',
            title: 'SocketCAN Kernel',
            sub: '50Hz Raw J1939 Ingest',
            badge: '< 150ns Parse',
            color: 'var(--color-accent)',
          },
          {
            stage: '02. Filter',
            title: 'Rust DSP Sentry',
            sub: 'Real-Time Anomaly Check',
            badge: '< 5ms SLA',
            color: '#34C759',
          },
          {
            stage: '03. Buffer',
            title: 'SQLite Ring Buffer',
            sub: '72-Hour Circular Storage',
            badge: `${bufferUsage}% Full`,
            color: isBlackout ? '#FF9500' : '#5856D6',
          },
          {
            stage: '04. Egress',
            title: 'Cellular Sync',
            sub: isBlackout ? 'Queued (Offline)' : 'Protobuf Burst (65% Save)',
            badge: isBlackout ? 'PAUSED' : 'ACTIVE',
            color: isBlackout ? '#86868B' : '#0071E3',
          },
        ].map((node) => (
          <div
            key={node.stage}
            className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[var(--color-text-muted)] mb-1">
              <span>{node.stage}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ color: node.color, backgroundColor: `${node.color}15` }}
              >
                {node.badge}
              </span>
            </div>
            <div className="text-xs font-bold text-[var(--color-text-primary)]">{node.title}</div>
            <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">{node.sub}</div>
          </div>
        ))}
      </div>

      {/* Live Telemetry Channel Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SENSOR_STREAMS.map((s) => (
          <div
            key={s.name}
            className="p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--material-1-bg)] flex flex-col"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-base">{s.icon}</span>
              <span className="text-[10px] font-mono font-semibold text-[var(--color-text-muted)]">
                {s.rate}
              </span>
            </div>
            <div className="text-sm font-bold text-[var(--color-text-primary)]">{s.value}</div>
            <div className="text-[11px] text-[var(--color-text-secondary)] truncate">{s.name}</div>
          </div>
        ))}
      </div>

      {/* Offline Ring Buffer Status Bar */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[var(--color-text-secondary)]">
          Circular Flash Retention: <strong className="text-[var(--color-text-primary)]">72.0 Hours Guaranteed</strong>
        </span>
        <span className="text-[var(--color-success)] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>
          Packet Loss Invariant: 0 Dropped
        </span>
      </div>
    </div>
  );
}
