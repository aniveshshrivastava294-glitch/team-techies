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
    <div className="py-6 px-4 sm:px-6 relative text-center space-y-5 inst-card p-6 border border-stone-300 dark:border-stone-800 my-4">
      
      <div className="max-w-3xl mx-auto space-y-4 relative z-10">
        
        {/* Institutional Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-700 dark:text-stone-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#B5654A]" />
          <span>Campus Orbit Assistant</span>
        </div>

        {/* High-Contrast Serif Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-sans font-medium">
            Search anything in plain English — book classrooms, inspect shuttle schedules, or manage leave requests.
          </p>
        </div>

        {/* Crisp Bordered Search Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-2xl mx-auto pt-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Book room CS-301 for tomorrow 10 AM..."
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:border-[#B5654A] rounded pl-11 pr-28 py-3 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none transition-colors font-sans shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 inst-button-primary text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="font-mono text-[11px]">Thinking...</span>
              ) : (
                <>
                  <span className="font-sans font-semibold text-xs">Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setQuery(pill.query); handleAskAgent(pill.query); }}
              className="px-3 py-1 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1 font-mono"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Execution Output Box */}
        {agentResult && (
          <div className="mt-4 p-4 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-left space-y-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <span className="text-xs font-mono font-bold text-[#B5654A] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assistant Response</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase inst-badge-sage">
                  Action: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-sans whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>

            {agentResult.toolDetails && (
              <div className="bg-stone-100 dark:bg-stone-950 p-2.5 rounded border border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                <span className="text-stone-800 dark:text-stone-300 block font-sans font-semibold mb-1">Details:</span>
                <p className="truncate">{JSON.stringify(agentResult.toolDetails, null, 2)}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
