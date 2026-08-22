import React, { useState, useEffect } from 'react';
import { Radio, Clock, Wifi } from 'lucide-react';

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
    "Solar Grid Substation Alpha operating at 98.4% capacity (415V Stable)",
    "City Bus #101 arrived at Main Transit Gate • 38/50 Occupied",
    "Auditorium 1 Climate Control calibrated to 22.0°C (CS-402 Lecture in session)",
    "Campus Satellite Telemetry Link Verified • 0 Faults Reported Across Mesh",
    "Elevators & Lifts: Tower B Lift #3 Tension Calibration Scheduled for 16:00",
    "Campus Carbon Footprint Offset: 1.4 Tons Reduced Today"
  ];

  return (
    <div className="w-full rounded-xl border border-[#E2DED4] bg-[#DCD7CC] px-4 py-2 flex items-center justify-between gap-4 font-sans text-xs text-[#1F2A38] shadow-xs overflow-hidden relative">
      
      {/* Left Badge */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-[#DCD7CC] pr-3 border-r border-[#E2DED4]">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4E7A51]" />
        </span>
        <span className="font-semibold text-xs text-[#1F2A38] flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#3E5C76]" />
          Live Campus Feed
        </span>
      </div>

      {/* Center Scrolling Ticker */}
      <div className="overflow-hidden relative w-full flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 text-[#8A8578] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C48A2E]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Stats & Clock */}
      <div className="flex items-center gap-3 shrink-0 z-10 bg-[#DCD7CC] pl-3 border-l border-[#E2DED4] text-xs">
        <div className="hidden sm:flex items-center gap-1.5 text-[#4E7A51] font-medium">
          <Wifi className="w-3.5 h-3.5" />
          <span>{networkSpeed}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#1F2A38] font-medium px-2.5 py-0.5 bg-[#F5F4F0] border border-[#E2DED4] rounded-full">
          <Clock className="w-3.5 h-3.5 text-[#3E5C76]" />
          <span>{timeStr || '12:00:00'}</span>
        </div>
      </div>

    </div>
  );
}

