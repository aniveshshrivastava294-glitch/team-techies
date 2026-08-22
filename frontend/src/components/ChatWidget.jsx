import React, { useState } from 'react';
import { Send, Zap, Code2, Sparkles, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';

export default function ChatWidget() {
  const [inputQuery, setInputQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your Campus Operations AI Assistant. Ask any operational question combining Classrooms, Events, Maintenance, Energy, Attendance, or Transportation.\n\nTry clicking one of the quick prompts below!",
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
          { role: 'assistant', text: `Error executing query pipeline: ${data.error || 'Server error'}` }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `Network Error: Could not connect to AI service (${err.message}).` }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inst-card p-6 border border-[#E2DED4] bg-[#DCD7CC] shadow-xs mb-6 font-sans">
      
      {/* Title & Pipeline Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E2DED4]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#3E5C76]/15 border border-[#3E5C76]/30 rounded-lg text-[#3E5C76]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1F2A38] tracking-tight flex items-center gap-2">
              Natural-Language AI Assistant
              <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-ochre">
                Groq + Gemini
              </span>
            </h2>
            <p className="text-xs text-[#8A8578] mt-0.5">
              Translates operational requests to structured queries and provides actionable synthesized insights
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-[#8A8578] font-medium flex items-center gap-1 mr-1">
          <Zap className="w-3.5 h-3.5 text-[#3E5C76]" />
          Quick Queries:
        </span>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            disabled={isSubmitting}
            className="px-3 py-1 bg-[#F5F4F0] hover:bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4] rounded-full text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-[#F5F4F0] rounded-xl border border-[#E2DED4] p-4 h-[360px] overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            
            {/* Avatar Icon */}
            <div className={`p-2 rounded-lg shrink-0 ${
              msg.role === 'user'
                ? 'bg-[#3E5C76] text-white'
                : 'bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4]'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Message Content Bubble */}
            <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#3E5C76] text-white rounded-tr-none shadow-2xs'
                : 'bg-[#DCD7CC] border border-[#E2DED4] text-[#1F2A38] rounded-tl-none shadow-2xs'
            }`}>
              
              {/* Message Markdown Text */}
              <div className="whitespace-pre-line">
                {msg.text}
              </div>

              {/* Groq Text-to-SQL Collapsible Block */}
              {msg.groqSql && (
                <div className="mt-3 pt-3 border-t border-[#E2DED4]">
                  <button
                    onClick={() => setShowSqlIndex(showSqlIndex === idx ? null : idx)}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 bg-[#F5F4F0] hover:bg-[#DCD7CC] border border-[#E2DED4] rounded-md text-xs text-[#3E5C76] transition-colors cursor-pointer font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#3E5C76]" />
                      Generated Database Query
                    </span>
                    {showSqlIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSqlIndex === idx && (
                    <div className="mt-2 p-3 bg-[#F5F4F0] text-[#1F2A38] rounded-lg border border-[#E2DED4] text-xs font-mono overflow-x-auto">
                      <div className="text-[11px] text-[#C48A2E] mb-1 font-sans">
                        Intent: {msg.intent || 'Text-to-SQL'} | Provider: {msg.providerGroq || 'Groq'}
                      </div>
                      <code>{msg.groqSql}</code>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center space-x-3 text-[#8A8578] text-xs py-2">
            <div className="p-2 bg-[#DCD7CC] rounded-lg animate-pulse">
              <Bot className="w-3.5 h-3.5 text-[#3E5C76]" />
            </div>
            <div className="flex items-center space-x-2 bg-[#DCD7CC] px-3 py-2 rounded-lg border border-[#E2DED4]">
              <div className="w-1.5 h-1.5 bg-[#3E5C76] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#3E5C76] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#3E5C76] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[#8A8578] font-medium ml-1">Analyzing cross-domain datasets...</span>
            </div>
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
          placeholder="Ask e.g. 'Which rooms have high energy consumption during off-hours?'"
          disabled={isSubmitting}
          className="flex-1 bg-[#F5F4F0] border border-[#E2DED4] text-[#1F2A38] placeholder-[#8A8578]/60 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#3E5C76] transition-colors font-sans"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputQuery.trim()}
          className="px-4 py-2.5 inst-button-primary text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}

