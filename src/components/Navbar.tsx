import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  TrendingUp, 
  Calendar, 
  Users, 
  Zap, 
  RotateCcw,
  Plus
} from 'lucide-react';
import type { StrategyId } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStrategyId: StrategyId | null;
  setSelectedStrategyId: (id: StrategyId | null) => void;
  onOpenQuickUpdate: () => void;
  onOpenNewAction: () => void;
  onResetData: () => void;
  overdueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  setSelectedStrategyId,
  onOpenQuickUpdate,
  onOpenNewAction,
  onResetData,
  overdueCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'strategies', label: 'Strategies', icon: Target },
    { id: 'actions', label: 'Actions', icon: CheckSquare, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'kpis', label: 'KPI Tracker', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline (Q0-Q4)', icon: Calendar },
    { id: 'owners', label: 'Owners', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-slate-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedStrategyId(null);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-[2px] shadow-md group-hover:shadow-sky-500/20 transition-all">
              <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center font-extrabold text-white text-lg tracking-wider">
                B
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-lg tracking-tight font-sans">BARDO STRATEGY</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  GEN 27.28
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Real Action Plan Implementation Tracker
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'strategies') {
                      setSelectedStrategyId('membership');
                    }
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-500/90 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenQuickUpdate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
              title="Weekly EB Quick Update Mode (10 sec updates)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Quick Update</span>
            </button>

            <button
              onClick={onOpenNewAction}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md hover:shadow-sky-500/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Action</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'strategies') {
                    setSelectedStrategyId('membership');
                  }
                }}
                className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
