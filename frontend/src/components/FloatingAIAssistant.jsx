import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export default function FloatingAIAssistant({ currentUser, currentContext = 'General Workspace' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome ${currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'} to Campus Orbit! I am your 3D Omni-Agent. Ask me to book rooms, check bus schedules, open tickets, or approve leave requests directly!`,
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
            text: `Issue: ${data.error || 'Failed to process request.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Network exception: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = [
    "Book an AC room for 2 PM",
    "Check bus fleet schedule",
    "Apply for casual leave",
    "Approve pending requests"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 3D Glowing Vector Sphere Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 sphere-glow flex items-center justify-center cursor-pointer border-2 border-white/40 relative group transition-transform hover:scale-110 active:scale-95"
          title="Open Campus Orbit 3D Omni-Agent"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          </span>
        </button>
      )}

      {/* Expanded Glassmorphism Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[540px] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-2xl">
          
          {/* Header */}
          <div className="p-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 flex items-center justify-center text-white shadow-lg">
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
              className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-900/60 border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-xs p-3 text-xs shadow-lg'
                    : 'glass-card text-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs shadow-lg'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {msg.toolExecuted && (
                    <div className="pt-1.5 border-t border-white/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Executed: {msg.toolExecuted}</span>
                    </div>
                  )}

                  <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="glass-card text-slate-400 rounded-2xl rounded-tl-xs p-3 text-xs italic">
                  Executing Agentic Tool...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-white/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuery(pill)}
                className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-full text-[10px] whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Omni-Agent to execute any task..."
              className="flex-1 bg-slate-950/80 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all cursor-pointer disabled:opacity-40 shadow-md shadow-blue-600/30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
