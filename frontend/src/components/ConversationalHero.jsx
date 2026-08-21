import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Calendar, Bus, Ticket, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConversationalHero({ currentUser }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const suggestionPills = [
    { label: "Book an AC Room for 2 PM", query: "Book an AC room for 14:00 - 15:30 today" },
    { label: "Check Campus Bus Schedule", query: "Show active bus routes and overcrowding status" },
    { label: "Apply for Faculty Leave", query: "I need to apply for casual leave for tomorrow" },
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
    <div className="glass-panel p-8 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Friendly Conversational Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agentic AI Assistant Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What do you need help with today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Ask in plain English. The AI agent can automatically book venues, check bus schedules, open tickets, or approve leave requests for you.
          </p>
        </div>

        {/* Large Friendly Search & Action Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Book an AC room for tomorrow at 2 PM..."
              className="w-full bg-slate-950/90 border-2 border-slate-800 focus:border-blue-500/80 rounded-2xl pl-12 pr-32 py-4 text-sm text-white placeholder-slate-500 shadow-xl focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Executing...</span>
              ) : (
                <>
                  <span>Ask AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(pill.query); handleAskAgent(pill.query); }}
              className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Agentic Execution Result Banner */}
        {agentResult && (
          <div className="mt-4 p-5 bg-slate-950/90 border border-blue-500/40 rounded-2xl text-left space-y-3 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Agent Execution Output ({agentResult.gemini?.provider || 'Gemini Agent'})</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  Tool Executed: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>

            {agentResult.toolDetails && (
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-slate-400 block font-sans font-semibold mb-1">State Update:</span>
                <p>{JSON.stringify(agentResult.toolDetails, null, 2)}</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
