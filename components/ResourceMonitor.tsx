'use client';

import React, { useState, useEffect } from 'react';
import { CommandTile } from './CommandTile';
import { Cpu, Zap, Box, RefreshCw } from 'lucide-react';

interface Resource {
  name: string;
  usage: number; 
  total: number;
  unit: string;
  color: string;
}

export default function ResourceMonitor() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        const liveResources: Resource[] = [
          { 
            name: 'GCP CREDIT', 
            usage: data.resources.gcp, 
            total: 300, 
            unit: 'USD', 
            color: 'bg-emerald-500' 
          },
          { 
            name: 'API CALLS', 
            usage: data.resources.api_calls, 
            total: 1000, 
            unit: 'DAILY', 
            color: 'bg-blue-500' 
          },
          { 
            name: 'SYSTEM MEMORY', 
            usage: data.resources.memory, 
            total: 100, 
            unit: '%', 
            color: 'bg-indigo-500' 
          },
        ];
        setResources(liveResources);
      } catch (err) {
        console.error("Vitals fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
    const interval = setInterval(fetchVitals, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CommandTile title="System Vitals" icon={<Cpu className={`w-6 h-6 text-blue-500 ${loading ? 'animate-pulse' : ''}`} />}>
      <div className="space-y-6">
        {resources.map((resource) => (
          <div key={resource.name} className="flex flex-col gap-2 p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            
            <div className="flex justify-between items-end mb-2 relative z-10">
              <span className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase flex items-center gap-2">
                <Box className="w-3 h-3 text-slate-600" />
                {resource.name}
              </span>
              <span className="text-xs text-white font-mono font-bold">
                {resource.usage} <span className="text-slate-600">/</span> {resource.total} <span className="text-[10px] text-slate-500">{resource.unit}</span>
              </span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
              <div
                className={`h-full ${resource.color} shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min((resource.usage / (resource.total || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CommandTile>
  );
}
