import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConversationalHero({ currentUser }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const suggestionPills = [
    { label: "Reserve a Classroom", query: "Book room CS-301 for 2 PM today" },
    { label: "Inspect Bus Telemetry", query: "Show active bus routes and schedules" },
    { label: "Apply for Leave", query: "I need to apply for casual leave for tomorrow" },
    { label: "Approve Access Requests", query: "Approve pending leave requests for faculty" }
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
    <div className="card-onyx p-6 space-y-4 font-sans text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Header Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 badge-amber mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Omni-Agent Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-50 tracking-tight flex items-center justify-center gap-2">
            <span>How can Campus AI assist your operations today?</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto">
            Execute actions in plain English — reserve classrooms, inspect shuttle telemetry, or approve staff access.
          </p>
        </div>

        {/* Borderless Search Input Pill (Resting on bg-zinc-900) */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-xl mx-auto pt-1">
          <div className="relative flex items-center bg-zinc-900 rounded-full border border-zinc-800 focus-within:border-amber-500/50 p-1.5 transition-colors shadow-none">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="How can we assist you? e.g. Reserve CS-301 for tomorrow 10 AM..."
              className="w-full bg-transparent border-0 rounded-full pl-10 pr-24 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none text-center"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 btn-amber-primary text-xs px-4 rounded-full"
            >
              {isLoading ? (
                <span className="font-mono text-[11px]">Processing...</span>
              ) : (
                <>
                  <span>Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Action Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setQuery(pill.query); handleAskAgent(pill.query); }}
              className="btn-onyx-secondary text-[11px] py-1 px-3"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Agent Execution Result Drawer */}
        {agentResult && (
          <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-left space-y-2.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Omni-Agent Response</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="badge-emerald text-[10px]">
                  Executed: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
