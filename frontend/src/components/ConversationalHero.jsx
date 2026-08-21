import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConversationalHero({ currentUser }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const suggestionPills = [
    { label: "Book AC Room for 2 PM", query: "Book an AC room for 14:00 - 15:30 today" },
    { label: "Campus Bus Telemetry", query: "Show active bus routes and overcrowding status" },
    { label: "Faculty Leave Request", query: "I need to apply for casual leave for tomorrow" },
    { label: "Approve Pending Requests", query: "Approve pending leave requests for faculty" }
  ];

  const handleAskAgent = async (promptText) => {
    const q = promptText || query;
    if (!q || q.trim() === '') return;

    setIsLoading(true);
    setAgentResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userRole: currentUser?.role || 'faculty',
          departmentDomain: currentUser?.department_domain || 'general'
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setAgentResult(data);
      }
    } catch (err) {
      console.error('Hero agent error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 relative text-center space-y-6">
      
      {/* Faint Nebula Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-5 relative z-10">
        
        {/* Floating Minimalist Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 stroke-[1.5]" />
          <span>Autonomous Orbit Assistant</span>
        </div>

        {/* High-Contrast Seamless Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What do you need to orchestrate today?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-medium">
            Natural language enterprise command bar. Execute venue reservations, track live shuttle telemetry & manage faculty requests.
          </p>
        </div>

        {/* Sleek Borderless Translucent Search Pill */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-5 pointer-events-none stroke-[1.75]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Reserve CS-301 Audi for tomorrow 10 AM..."
              className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus:border-cyan-500/50 backdrop-blur-2xl rounded-full pl-12 pr-32 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all font-medium shadow-2xl"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-all border border-white/15 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 hover:border-cyan-400/50"
            >
              {isLoading ? (
                <span className="font-mono text-[11px]">Executing...</span>
              ) : (
                <>
                  <span className="font-mono text-[11px]">Query AI</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Floating Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setQuery(pill.query); handleAskAgent(pill.query); }}
              className="px-3.5 py-1.5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 font-mono"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Agent Execution Output Floating Banner */}
        {agentResult && (
          <div className="mt-6 p-6 rounded-3xl bg-white/[0.02] border border-cyan-500/30 backdrop-blur-2xl text-left space-y-3 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-300 stroke-[1.5]" />
                <span>Agent Execution Output</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Executed: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed font-sans font-medium whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>

            {agentResult.toolDetails && (
              <div className="bg-black/60 p-3 rounded-2xl border border-white/5 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-300 block font-sans font-semibold mb-1">State Update Parameters:</span>
                <p className="truncate">{JSON.stringify(agentResult.toolDetails, null, 2)}</p>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Section Divider */}
      <div className="divider-galaxy mt-8" />
    </div>
  );
}
