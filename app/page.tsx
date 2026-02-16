import FleetStatus from '@/components/FleetStatus';
import ConstellationFeed from '@/components/ConstellationFeed';
import ResourceMonitor from '@/components/ResourceMonitor';
import ChatWindow from '@/components/ChatWindow';
import { Sidebar } from '@/components/Sidebar';
import { ArrowRight, Activity, Zap, Command, Menu } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="fixed top-[-20%] left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header / Breadcrumb */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <span className="text-slate-500">Mission Control</span>
              <span className="text-slate-700">/</span>
              <span className="text-blue-500">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              System Online
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-[0_0_15px_-5px_rgba(59,130,246,0.6)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                BA
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 text-left">
            <div>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white leading-none mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Bryan</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium tracking-wide">
                Orion is tracking <span className="text-white font-bold">3 active directives</span>. Fleet status is green.
              </p>
            </div>
            <button className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 active:translate-y-0">
              <Zap className="w-4 h-4 fill-current" />
              Quick Action
            </button>
          </div>

          {/* Main Grid: Multi-Column Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            
            {/* Left Column: Fleet & Resources (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <FleetStatus />
              <ResourceMonitor />
            </div>

            {/* Center Column: Secure Terminal (5 cols) */}
            <div className="lg:col-span-5">
              <ChatWindow />
            </div>

            {/* Right Column: Mission Feed (4 cols) */}
            <div className="lg:col-span-4 h-full min-h-[400px]">
              <ConstellationFeed />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
