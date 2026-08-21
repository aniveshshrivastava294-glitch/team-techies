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
    <div className="w-full rounded-2xl bg-black/90 border border-cyan-500/20 backdrop-blur-2xl px-4 py-2.5 flex items-center justify-between gap-4 font-mono text-xs text-white shadow-xl overflow-hidden relative">
      
      {/* Left Badge */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-black/80 pr-3 border-r border-white/10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
        </span>
        <span className="font-extrabold text-[11px] text-cyan-300 tracking-wider flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          ORBIT TELEMETRY FEED
        </span>
      </div>

      {/* Center Scrolling Ticker */}
      <div className="overflow-hidden relative w-full flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 text-zinc-300 font-medium hover:text-cyan-300 transition-colors cursor-pointer">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Stats & Clock */}
      <div className="flex items-center gap-3 shrink-0 z-10 bg-black/80 pl-3 border-l border-white/10 text-[11px]">
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold">
          <Wifi className="w-3.5 h-3.5" />
          <span>{networkSpeed}</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-300 font-bold px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeStr || '12:00:00'}</span>
        </div>
      </div>

    </div>
  );
}
