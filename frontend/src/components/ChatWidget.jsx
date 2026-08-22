import React, { useState } from 'react';
import { Send, Zap, Code2, Sparkles, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

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
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`API endpoint unavailable (HTTP ${response.status}). Check VITE_API_BASE_URL or backend host.`);
      }

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
    <div className="card-surface p-5 mb-6 font-sans shadow-2xs">
      
      {/* Title & Pipeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E6E0D2]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#1C1917]">Natural-Language AI Query Engine</h2>
              <span className="badge-mono text-[10px]">
                Groq + Gemini
              </span>
            </div>
            <p className="text-xs text-[#57534E] font-medium mt-0.5">
              Translates queries to SQL, accesses domain tables, and synthesizes actionable recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-xs text-[#57534E] font-semibold flex items-center gap-1 mr-1">
          <Zap className="w-3.5 h-3.5 text-[#1C1917]" />
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
      <div className="bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] p-3.5 h-[320px] overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            
            {/* Avatar Icon */}
            <div className={`p-1.5 rounded-md shrink-0 ${
              msg.role === 'user'
                ? 'bg-[#1C1917] text-white font-bold'
                : 'bg-[#FAF8F3] text-[#1C1917] border border-[#E6E0D2] shadow-2xs'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Message Content Bubble */}
            <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#1C1917] text-white shadow-2xs font-medium'
                : 'bg-[#FAF8F3] border border-[#E6E0D2] text-[#1C1917] shadow-2xs font-medium'
            }`}>
              
              {/* Message Text */}
              <div className="whitespace-pre-line font-sans">
                {msg.text}
              </div>

              {/* Groq Text-to-SQL Block */}
              {msg.groqSql && (
                <div className="mt-2 pt-2 border-t border-[#E6E0D2]">
                  <button
                    onClick={() => setShowSqlIndex(showSqlIndex === idx ? null : idx)}
                    className="flex items-center justify-between w-full px-2.5 py-1 bg-[#F0EBE1] border border-[#E6E0D2] rounded text-[10px] font-mono text-[#1C1917] hover:bg-[#FAF8F3] transition-colors"
                  >
                    <span className="flex items-center gap-1 font-bold">
                      <Code2 className="w-3 h-3 text-[#1C1917]" />
                      Groq Generated SQL
                    </span>
                    {showSqlIndex === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showSqlIndex === idx && (
                    <div className="mt-1.5 p-2 bg-[#1C1917] text-[#FAF8F3] rounded text-[10px] font-mono border border-[#292524] overflow-x-auto">
                      <code>{msg.groqSql}</code>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center space-x-2 text-[#57534E] text-xs py-1 font-mono font-semibold">
            <div className="w-2 h-2 bg-[#1C1917] rounded-full animate-ping" />
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
          className="flex-1 bg-white border border-[#E6E0D2] text-[#1C1917] placeholder-[#78716C] text-xs rounded-md px-3 py-2 focus:outline-none focus:border-[#1C1917] font-bold"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputQuery.trim()}
          className="btn-primary text-xs py-2 px-4"
        >
          <span>Query</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
