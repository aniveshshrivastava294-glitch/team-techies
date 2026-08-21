import React, { useState, useEffect } from 'react';
import { Activity, Radio, Zap, Shield, Sparkles, Clock, Wifi } from 'lucide-react';

export default function LiveCampusTicker() {
  const [timeStr, setTimeStr] = useState('');
  const [networkSpeed, setNetworkSpeed] = useState('10.4 Gbps');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const tickerItems = [
    "⚡ Solar Grid Substation Alpha operating at 98.4% capacity (415V Stable)",
    "🚌 City Bus #101 arrived at Main Transit Gate • 38/50 Occupied",
    "🏛️ Auditorium 1 Climate Control calibrated to 22.0°C (CS-402 Lecture in session)",
    "🔒 Quantum Satellite Telemetry Link Verified • 0 Faults Reported Across Mesh",
    "🔧 Elevators & Lifts: Tower B Lift #3 Tension Calibration Scheduled for 16:00",
    "🌱 Campus Carbon Footprint Offset: 1.4 Tons Reduced Today"
  ];

  return (
    <div className="w-full rounded border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 px-4 py-2 flex items-center justify-between gap-4 font-mono text-xs text-stone-800 dark:text-stone-200 shadow-xs overflow-hidden relative font-sans">
      
      {/* Left Badge */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-stone-100 dark:bg-stone-900 pr-3 border-r border-stone-300 dark:border-stone-800 font-mono">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5C6E3F]" />
        </span>
        <span className="font-bold text-[10px] text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#B5654A]" />
          SYSTEM STATUS FEED
        </span>
      </div>

      {/* Center Scrolling Ticker */}
      <div className="overflow-hidden relative w-full flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 font-sans text-xs hover:text-[#B5654A] transition-colors cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5654A]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Stats & Clock */}
      <div className="flex items-center gap-3 shrink-0 z-10 bg-stone-100 dark:bg-stone-900 pl-3 border-l border-stone-300 dark:border-stone-800 text-[11px] font-mono">
        <div className="hidden sm:flex items-center gap-1.5 text-[#5C6E3F] font-bold">
          <Wifi className="w-3.5 h-3.5" />
          <span>{networkSpeed}</span>
        </div>

        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-bold px-2 py-0.5 bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded">
          <Clock className="w-3.5 h-3.5 text-[#B5654A]" />
          <span>{timeStr || '12:00:00'}</span>
        </div>
      </div>

    </div>
  );
}
