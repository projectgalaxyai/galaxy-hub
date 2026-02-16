'use client';

import React from 'react';
import { CommandTile } from './CommandTile';
import { ShieldCheck, Crosshair, Map, Activity, Zap } from 'lucide-react';

interface AgentStatus {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'sleeping';
  icon: React.ReactNode;
}

const agents: AgentStatus[] = [
  { name: 'Hunter', role: 'BDR Lead', status: 'active', icon: <Crosshair className="text-red-500 w-5 h-5" /> },
  { name: 'Guardian', role: 'QA & E2E', status: 'idle', icon: <ShieldCheck className="text-blue-500 w-5 h-5" /> },
  { name: 'Navigator', role: 'Chief of Staff', status: 'sleeping', icon: <Map className="text-emerald-500 w-5 h-5" /> },
];

export default function FleetStatus() {
  return (
    <CommandTile title="Fleet Status" icon={<Activity className="text-blue-500 w-6 h-6 animate-pulse" />}>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-slate-950 p-3 rounded-xl shadow-inner border border-slate-800/50">
                {agent.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest text-white">{agent.name}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{agent.role}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
                  agent.status === 'idle' ? 'bg-amber-500' : 'bg-slate-600'
                }`} />
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  agent.status === 'active' ? 'text-green-400' : 
                  agent.status === 'idle' ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CommandTile>
  );
}
