'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, Activity, Settings, HelpCircle, Layers, Radar } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'Deals', href: '/deals', icon: Briefcase },
  { name: 'Constellation', href: '/constellation', icon: Radar },
  { name: 'Workflows', href: '/workflows', icon: Layers },
];

const secondaryNavigation: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Documentation', href: '/docs', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 h-full border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800/60 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm shadow-blue-500/20">
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <span className="text-sm font-black text-white tracking-widest uppercase italic">Project Galaxy</span>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                isActive 
                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}
            >
              <item.icon className={twMerge("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.name}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Nav */}
      <div className="px-3 py-4 border-t border-slate-800/50 space-y-1 bg-slate-900/20 shrink-0">
        {secondaryNavigation.map((item) => {
           const isActive = pathname === item.href;
           return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group',
                isActive 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
        <div className="mt-4 px-3 pb-2">
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            v0.9.5 // Orion
          </div>
        </div>
      </div>
    </div>
  );
}
