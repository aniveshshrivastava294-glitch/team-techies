import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, ArrowRight, Bot, User, CheckCircle2, CornerDownLeft } from 'lucide-react';

export default function FloatingAIAssistant({ currentUser, currentContext = 'General Workspace' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'}! I am your Omni-Agent assistant for Campus Orbit. Ask me to book rooms, check bus schedules, open tickets, or approve leave requests directly!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputQuery || inputQuery.trim() === '') return;

    const userText = inputQuery.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const updatedMessages = [
      ...chatMessages,
      { sender: 'user', text: userText, timestamp: timeStr }
    ];
    setChatMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          userRole: currentUser?.role || 'faculty',
          departmentDomain: currentUser?.department_domain || 'general'
        })
      });

      const data = await res.json();

      if (data.status === 'success') {
        const aiText = data.gemini?.answer || 'Action completed successfully.';
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: aiText,
            toolExecuted: data.toolExecuted,
            toolDetails: data.toolDetails,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Sorry, I encountered an issue: ${data.error || 'Failed to process prompt.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Network error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = [
    "Book an AC room for 2 PM",
    "Check campus bus schedule",
    "Apply for casual leave",
    "Approve pending leave"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Circular Vector Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-blue-400/40 relative group"
          title="Open Campus Orbit Omni-Agent"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          
          {/* Subtle Pulse Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          </span>
        </button>
      )}

      {/* Expanded Sleek Chat Interface Overlay */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-xl">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Campus Orbit Omni-Agent</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {currentUser?.role ? `${currentUser.role.replace('_', ' ').toUpperCase()} Context` : 'Universal Assistant'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950/80 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-xs p-3 text-xs shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs shadow-md'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Tool Execution Badge */}
                  {msg.toolExecuted && (
                    <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Executed: {msg.toolExecuted}</span>
                    </div>
                  )}

                  <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-xs p-3 text-xs italic">
                  Omni-Agent processing prompt & executing tool...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-900 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => { setInputQuery(pill); }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Omni-Agent to execute any task..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
