import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConversationalHero({ currentUser }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const suggestionPills = [
    { label: "Book a Classroom", query: "Book room CS-301 for 2 PM today" },
    { label: "Check Bus Schedules", query: "Show active bus routes and schedules" },
    { label: "Apply for Leave", query: "I need to apply for casual leave for tomorrow" },
    { label: "Approve Leave Requests", query: "Approve pending leave requests for faculty" }
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
    <div className="card-enterprise p-5 space-y-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-3 text-center">
        
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>How can we assist your campus operations today?</span>
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Execute actions in plain English — reserve classrooms, inspect shuttle telemetry, or approve staff requests.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-xl mx-auto pt-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Book room CS-301 for tomorrow 10 AM..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] rounded-md pl-10 pr-24 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1 top-1 bottom-1 btn-primary text-xs px-3"
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

        {/* Suggestion Quick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setQuery(pill.query); handleAskAgent(pill.query); }}
              className="btn-secondary text-[11px] py-1 px-2.5"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Agent Execution Result Box */}
        {agentResult && (
          <div className="mt-3 p-3.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-left space-y-2">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
              <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assistant Response</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="badge-pill badge-success">
                  Executed: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
