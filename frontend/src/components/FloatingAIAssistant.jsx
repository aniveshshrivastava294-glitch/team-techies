import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export default function FloatingAIAssistant({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome ${currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'} to Campus Orbit! I am your Campus AI Assistant. Ask me to book rooms, check bus schedules, open tickets, or apply for leave directly!`,
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
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-md transition-all flex items-center justify-center cursor-pointer"
        title="Open Campus Orbit AI Assistant"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Floating Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white border border-slate-200 rounded-lg shadow-lg flex flex-col overflow-hidden font-sans">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Campus Orbit Assistant
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Executive AI Agent
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-lg p-3 text-xs shadow-2xs font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-lg p-3 text-xs shadow-2xs'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {msg.toolExecuted && (
                    <div className="pt-1.5 border-t border-slate-100 text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Executed: {msg.toolExecuted}</span>
                    </div>
                  )}

                  <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5 shadow-2xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start font-mono text-xs text-slate-500">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuery(pill)}
                className="btn-secondary text-[10px] py-0.5 px-2 hover:text-blue-600"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Omni-Agent to execute any task..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="btn-primary text-xs p-2 rounded-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
