import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Radio, Activity } from 'lucide-react';

export default function LiveStatusWidget() {
  const [time, setTime] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-1 text-xs font-mono text-[var(--color-text-secondary)]">
      {/* Live Pinging Radar */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>IST RUNTIME</span>
      </div>

      {/* Real-time Clock */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 font-medium">
        <Clock className="w-3 h-3 text-[var(--color-accent)]" />
        <span className="tabular-nums font-semibold">{isClient ? time : '15:00:00'} IST</span>
      </div>

      {/* Geographic Coordinates */}
      <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 font-medium">
        <MapPin className="w-3 h-3 text-neutral-400" />
        <span>New Delhi (UTC+5:30)</span>
      </div>

      {/* Fleet Edge Telemetry */}
      <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 font-medium">
        <Activity className="w-3 h-3 text-emerald-500" />
        <span>CAN Ingest: 50Hz Stable</span>
      </div>
    </div>
  );
}
