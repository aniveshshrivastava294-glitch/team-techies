import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="py-6 px-4 sm:px-6 relative text-center space-y-4 inst-card my-4 bg-[#F7EFE4] border border-[#E8DCC8] shadow-xs">
      
      <div className="max-w-3xl mx-auto space-y-3.5 relative z-10 font-sans">
        
        {/* Subtle Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FDF8F2] border border-[#E8DCC8] rounded-full text-[#2B1D12] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#BC4800]" />
          <span>Operations Intelligence</span>
        </div>

        {/* Clean Plain Sans Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#2B1D12] tracking-tight">
            How can we assist your campus operations today?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A4A] max-w-xl mx-auto font-normal">
            Natural language operations across classrooms, transit, facilities, and academic leave.
          </p>
        </div>

        {/* Crisp Bordered Search Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskAgent(); }} className="relative max-w-2xl mx-auto pt-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#6B5A4A] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Book room CS-301 for tomorrow 10 AM..."
              className="w-full bg-[#FDF8F2] border border-[#E8DCC8] focus:border-[#BC4800] rounded-lg pl-10 pr-28 py-2.5 text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none transition-colors font-sans"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1 top-1 bottom-1 px-4 inst-button-primary text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="text-xs">Thinking...</span>
              ) : (
                <>
                  <span className="font-medium text-xs">Ask</span>
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
              className="px-3 py-1 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Execution Output Box */}
        {agentResult && (
          <div className="mt-4 p-4 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] text-left space-y-2">
            <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-2">
              <span className="text-xs font-semibold text-[#BC4800] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assistant Response</span>
              </span>
              {agentResult.toolExecuted && (
                <span className="px-2.5 py-0.5 text-xs font-medium inst-badge-sage">
                  Action: {agentResult.toolExecuted}
                </span>
              )}
            </div>

            <p className="text-xs text-[#2B1D12] leading-relaxed font-sans whitespace-pre-line">
              {agentResult.gemini?.answer || agentResult.query}
            </p>

            {agentResult.toolDetails && (
              <div className="bg-[#F7EFE4] p-2.5 rounded-lg border border-[#E8DCC8] text-xs text-[#6B5A4A]">
                <span className="text-[#2B1D12] block font-semibold mb-1">Details:</span>
                <p className="truncate">{JSON.stringify(agentResult.toolDetails, null, 2)}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

