'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommandTile } from './CommandTile';
import { Send, Terminal, User, Cpu } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Orion online. Direct link established. Awaiting command, Bryan.', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await res.json();
      
      if (data.reply) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("Chat link failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommandTile title="Secure Terminal" icon={<Terminal className="w-5 h-5" />}>
      <div className="flex flex-col h-[450px]">
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.role === 'assistant' ? (
                  <><Cpu className="w-3 h-3 text-blue-500" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Orion</span></>
                ) : (
                  <><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Architect</span><User className="w-3 h-3 text-slate-400" /></>
                )}
              </div>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
              <span className="text-[8px] text-slate-600 mt-1 font-mono uppercase">{msg.timestamp}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-blue-500 animate-pulse">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="relative mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Awaiting directive..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </CommandTile>
  );
}
