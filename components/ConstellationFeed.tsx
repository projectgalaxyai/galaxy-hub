'use client';

import React, { useState, useEffect } from 'react';
import { CommandTile } from './CommandTile';
import { Radar, Terminal, RefreshCw } from 'lucide-react';

interface FeedItem {
  id: string;
  source: string;
  message: string;
  timestamp: string;
  type: 'log' | 'lead' | 'alert';
}

export default function ConstellationFeed() {
  const [logs, setLogs] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setLogs(data.logs || []);
        setError(null);
      } catch (err) {
        setError('Lost contact with ground control.');
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <CommandTile title="Mission Feed" icon={<Radar className={`text-blue-500 w-6 h-6 ${loading ? 'animate-spin-slow' : ''}`} />}>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar h-full">
        {error ? (
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono p-4 border border-red-500/20 bg-red-500/10 rounded-lg">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {error}
          </div>
        ) : (
          logs.map((item) => (
            <div key={item.id} className="group relative flex flex-col p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-blue-500/50" />
                  {item.source}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{item.timestamp}</span>
              </div>
              <span className="text-sm font-medium text-slate-200 tracking-wide font-sans">{item.message}</span>
              {item.type === 'lead' && (
                <div className="absolute right-0 top-0 h-full w-1 bg-green-500 rounded-r-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
              {item.type === 'alert' && (
                <div className="absolute right-0 top-0 h-full w-1 bg-amber-500 rounded-r-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))
        )}
      </div>
    </CommandTile>
  );
}
