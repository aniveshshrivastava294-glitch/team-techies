import React, { useState } from 'react';
import { Search, Sparkles, Building2, Bus, Zap, Wrench, ShieldAlert } from 'lucide-react';

export default function ConversationalHero({ onExecuteQuery }) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const quickCapabilities = [
    { label: 'Book Science Lab 102 for 2 PM', icon: Building2, colorClass: 'text-blue-600' },
    { label: 'Show active HVAC tickets', icon: Wrench, colorClass: 'text-amber-700' },
    { label: 'Check Shuttle 2 GPS delay', icon: Bus, colorClass: 'text-amber-800' },
    { label: 'Audit library overnight power', icon: Zap, colorClass: 'text-emerald-600' },
    { label: 'List capacity overbooking alerts', icon: ShieldAlert, colorClass: 'text-rose-600' }
  ];

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query || query.trim() === '' || isExecuting) return;

    setIsExecuting(true);
    setLastResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLastResult(data.gemini?.answer || 'Action dispatched.');
      } else {
        setLastResult(`⚠️ Execution issue: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      setLastResult(`❌ Network error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <section className="card-surface p-6 mb-6 font-sans shadow-2xs relative overflow-hidden">
      
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
          <h2 className="text-xs font-mono font-bold text-[#1D4ED8] uppercase tracking-wider">
            Natural-Language Campus Command AI
          </h2>
        </div>
        <span className="badge-blue text-[10px]">
          Groq SQL + Gemini Synthesis
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight mb-1">
        Direct Operations Search & Autonomous Tool Dispatch
      </h1>
      <p className="text-xs text-[#57534E] font-medium mb-4 max-w-3xl">
        Type any operational instruction or query. The Omni-Agent automatically queries SQL tables, inspects telemetry, reserves classrooms, or opens dispatches.
      </p>

      {/* Main Omnibox Form */}
      <form onSubmit={handleSearchSubmit} className="relative mb-3">
        <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Book Non-AC classroom CR-301 for tomorrow 11 AM' or 'Which shuttle is overloaded?'"
          className="w-full bg-[#FAF8F3] border border-[#E6E0D2] rounded-md pl-10 pr-32 py-2.5 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#1D4ED8] font-bold shadow-2xs"
        />
        <button
          type="submit"
          disabled={isExecuting || !query.trim()}
          className="btn-primary-blue absolute right-1.5 top-1.5 bottom-1.5 text-xs px-4"
        >
          <span>{isExecuting ? 'Executing...' : 'Dispatch AI'}</span>
        </button>
      </form>

      {/* Quick Tool Capability Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono text-[#78716C] uppercase font-bold mr-1">
          Quick Actions:
        </span>
        {quickCapabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setQuery(cap.label);
              }}
              className="btn-secondary text-[11px] py-1 px-2.5 flex items-center space-x-1.5"
            >
              <Icon className={`w-3 h-3 ${cap.colorClass}`} />
              <span>{cap.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Execution Response Box */}
      {lastResult && (
        <div className="mt-4 p-3 bg-[#F0EBE1] rounded-md border border-[#E6E0D2] text-xs font-mono text-[#1C1917] space-y-1">
          <div className="font-bold flex items-center justify-between border-b border-[#E6E0D2] pb-1">
            <span className="flex items-center gap-1 text-[#1D4ED8]">
              <Sparkles className="w-3.5 h-3.5" />
              Omni-Agent Output:
            </span>
            <button onClick={() => setLastResult(null)} className="text-[#78716C] hover:text-[#1C1917]">×</button>
          </div>
          <p className="whitespace-pre-line text-[#1C1917] font-semibold pt-1">{lastResult}</p>
        </div>
      )}

    </section>
  );
}
