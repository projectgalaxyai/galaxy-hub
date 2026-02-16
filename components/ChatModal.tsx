'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User, Cpu, X, Activity, Shield } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Orion Secure Terminal established. Awaiting tactical directive, Bryan.', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const waitForResponse = async () => {
    // Poll the server every 2 seconds to see if the M4 has pushed a reply
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await fetch('/api/chat');
        const data = await res.json();
        
        // If the M4 has updated the lastResponse, display it
        if (data.lastResponse && data.lastResponse !== "Signal received. M4 processing...") {
          const assistantMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.lastResponse,
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, assistantMsg]);
          setLoading(false);
          if (pollingInterval.current) clearInterval(pollingInterval.current);
        }
      } catch (err) {
        console.error("Polling failed");
      }
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Send the message to the cloud relay
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });
      
      // Start waiting for the M4 to respond
      waitForResponse();
      
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: 'err', 
        role: 'assistant', 
        content: "Neural Link severed. Re-establish connection.", 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl h-[650px] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black italic tracking-widest uppercase text-white">Project Galaxy Terminal</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Neural Link: ACTIVE</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 transition-all border border-slate-700 hover:border-red-500/30">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/grid.svg')] bg-fixed opacity-95">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex items-center gap-2 mb-1.5 px-1">
                {msg.role === 'assistant' ? (
                  <><Cpu className="w-3 h-3 text-blue-500" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Orion</span></>
                ) : (
                  <><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Architect</span><User className="w-3 h-3 text-slate-400" /></>
                )}
              </div>
              <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none border border-blue-400/30' : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
              <span className="text-[8px] text-slate-600 mt-2 font-mono uppercase tracking-[0.2em]">{msg.timestamp}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-blue-500 animate-pulse px-2 bg-blue-500/5 py-2 rounded-lg border border-blue-500/10 w-fit">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">M4 Processing...</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-950/80 border-t border-slate-800 backdrop-blur-xl">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text" autoFocus value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Inject tactical directive..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 px-6 pr-14 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-2xl group-hover:border-slate-700"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-blue-500 hover:text-blue-400 transition-all hover:scale-110 active:scale-95">
              <Send className="w-5 h-5 fill-current opacity-20 group-hover:opacity-100" />
            </button>
          </form>
          <div className="mt-3 flex gap-4">
             <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-600 uppercase tracking-widest"><Shield className="w-2.5 h-2.5" /> Direct Neural Link</div>
          </div>
        </div>
      </div>
    </div>
  );
}
