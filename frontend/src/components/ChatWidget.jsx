import React, { useState } from 'react';
import { Send, Zap, Code2, Sparkles, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';

export default function ChatWidget() {
  const [inputQuery, setInputQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your Campus Orbit AI Operations Assistant. Ask me any cross-domain question combining Classrooms, Events, Maintenance, Energy, Attendance, or Transportation.\n\nTry clicking one of the quick prompts below!",
      groqSql: null
    }
  ]);
  const [showSqlIndex, setShowSqlIndex] = useState(null);

  const quickPrompts = [
    "Find wasted energy slots",
    "Show classrooms with open HVAC issues",
    "List room capacity violations",
    "Analyze transit delays vs peak events"
  ];

  const handleSend = async (queryText) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit || textToSubmit.trim() === '' || isSubmitting) return;

    const userMsg = { role: 'user', text: textToSubmit };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const botMsg = {
          role: 'assistant',
          text: data.gemini?.answer || 'Response generated.',
          groqSql: data.groq?.sql,
          intent: data.groq?.intent,
          providerGroq: data.groq?.provider,
          providerGemini: data.gemini?.provider,
          dataCount: data.dataCount
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: `⚠️ Error executing query pipeline: ${data.error || 'Server error'}` }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `❌ Network Error: Could not connect to Express AI layer (${err.message}).` }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-enterprise p-5 mb-6 font-sans">
      
      {/* Title & Pipeline Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-blue-50 border border-blue-200 text-[#2563EB]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Natural-Language AI Query Engine</h2>
              <span className="badge-pill badge-info text-[10px]">
                Groq + Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Translates queries to SQL, accesses domain tables, and synthesizes actionable recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
          Quick Prompts:
        </span>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            disabled={isSubmitting}
            className="btn-secondary text-[11px] py-1 px-2.5"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-[#F8FAFC] rounded-md border border-[#E2E8F0] p-3.5 h-[320px] overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            
            {/* Avatar Icon */}
            <div className={`p-1.5 rounded shrink-0 ${
              msg.role === 'user'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#2563EB] border border-[#E2E8F0]'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Message Content Bubble */}
            <div className={`max-w-[85%] rounded-md p-3 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-slate-800 shadow-xs'
            }`}>
              
              {/* Message Text */}
              <div className="whitespace-pre-line font-sans">
                {msg.text}
              </div>

              {/* Groq Text-to-SQL Block */}
              {msg.groqSql && (
                <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => setShowSqlIndex(showSqlIndex === idx ? null : idx)}
                    className="flex items-center justify-between w-full px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-mono text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-1 font-semibold">
                      <Code2 className="w-3 h-3 text-[#2563EB]" />
                      Groq Generated SQL
                    </span>
                    {showSqlIndex === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showSqlIndex === idx && (
                    <div className="mt-1.5 p-2 bg-slate-900 rounded text-[10px] font-mono text-emerald-400 overflow-x-auto">
                      <code>{msg.groqSql}</code>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs py-1 font-mono">
            <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-ping" />
            <span>AI pipeline executing Groq SQL translation and Gemini synthesis...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask operational questions e.g. 'Which rooms have high energy consumption?'"
          disabled={isSubmitting}
          className="flex-1 bg-white border border-[#E2E8F0] text-slate-900 placeholder-slate-400 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#2563EB]"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputQuery.trim()}
          className="btn-primary text-xs py-1.5 px-4"
        >
          <span>Query</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
