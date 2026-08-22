import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export default function FloatingAIAssistant({ currentUser, currentContext = 'General Workspace' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome ${currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'} to CampusOrbit. I am your operations assistant. Ask me to check room availability, view transport schedules, or look up campus telemetry.`,
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
      {/* Floating Action Trigger Button - Simple flat/subtle shadowed circle, no glow ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#3E5C76] hover:bg-[#2E4459] text-white rounded-full shadow-md border border-[#E2DED4] transition-colors flex items-center justify-center cursor-pointer"
        title="Open Campus Operations Assistant"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Floating Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-[#DCD7CC] border border-[#E2DED4] rounded-2xl shadow-xl flex flex-col overflow-hidden font-sans">
          
          {/* Header */}
          <div className="p-3.5 bg-[#F5F4F0] border-b border-[#E2DED4] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#3E5C76]/15 text-[#3E5C76] border border-[#3E5C76]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F2A38]">
                  Campus Operations Assistant
                </h3>
                <p className="text-xs text-[#8A8578]">
                  Natural Language Query
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#8A8578] hover:text-[#1F2A38] rounded-lg hover:bg-[#DCD7CC] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F5F4F0]/60">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#3E5C76]/15 border border-[#3E5C76]/30 text-[#3E5C76] flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#3E5C76] text-white rounded-2xl rounded-tr-xs p-3 text-xs shadow-2xs'
                    : 'bg-[#F5F4F0] text-[#1F2A38] border border-[#E2DED4] rounded-2xl rounded-tl-xs p-3 text-xs shadow-2xs'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {msg.toolExecuted && (
                    <div className="pt-1.5 border-t border-[#E2DED4] text-xs text-[#4E7A51] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7A51]" />
                      <span>Executed: {msg.toolExecuted}</span>
                    </div>
                  )}

                  <span className={`block text-[10px] ${msg.sender === 'user' ? 'text-amber-100' : 'text-[#8A8578]'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#E2DED4] text-[#1F2A38] flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#3E5C76]/15 border border-[#3E5C76]/30 text-[#3E5C76] flex items-center justify-center shrink-0 text-xs mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#F5F4F0] border border-[#E2DED4] text-[#8A8578] rounded-2xl rounded-tl-xs p-3 text-xs italic">
                  Analyzing request...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div className="px-3 py-2 bg-[#DCD7CC] border-t border-[#E2DED4] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuery(pill)}
                className="px-2.5 py-1 bg-[#F5F4F0] hover:bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4] rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#F5F4F0] border-t border-[#E2DED4] flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask operations assistant..."
              className="flex-1 bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-3.5 py-2 text-xs text-[#1F2A38] placeholder-[#8A8578]/60 focus:outline-none focus:border-[#3E5C76] font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 inst-button-primary rounded-lg transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

