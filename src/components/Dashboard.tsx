import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  UserX, 
  ArrowUpRight, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import type { Strategy, ActionItem, KPI, StrategicArea, StrategyId } from '../types';
import { 
  getStrategyProgress, 
  getOverallImplementation, 
  getAttentionNeededItems, 
  getKpiAchievement,
  CURRENT_REF_DATE
} from '../utils/calculations';

interface DashboardProps {
  strategies: Strategy[];
  areas: StrategicArea[];
  actions: ActionItem[];
  kpis: KPI[];
  onSelectStrategy: (id: StrategyId) => void;
  onOpenQuickUpdate: (actionId?: string) => void;
  onOpenEditAction: (action: ActionItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  strategies,
  areas,
  actions,
  kpis,
  onSelectStrategy,
  onOpenQuickUpdate,
  onOpenEditAction,
  onNavigateTab
}) => {
  const overallProgress = getOverallImplementation(actions);
  const attentionItems = getAttentionNeededItems(actions, areas, CURRENT_REF_DATE);

  // Filter Q1 actions for current quarter highlight
  const q1Actions = actions.filter((a) => a.quarterId === 'Q1');
  const q1Done = q1Actions.filter((a) => a.status === 'DONE').length;
  const q1InProgress = q1Actions.filter((a) => a.status === 'IN PROGRESS').length;
  const q1Overdue = attentionItems.filter((item) => item.type === 'OVERDUE').length;
  const q1AtRisk = attentionItems.filter((item) => item.type === 'AT_RISK').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-850 via-navy-800 to-slate-900 border border-slate-700/60 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Action Plan Tracker
              </span>
              <span className="text-xs text-slate-400 font-mono">LC Year 27.28</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              BARDO 27.28 STRATEGY TRACKER
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-300 max-w-2xl">
              Real-time strategic execution tracking for AIESEC in Bardo. Turn pride into consistent development, growth and external relevance.
            </p>
          </div>

          <button
            onClick={() => onOpenQuickUpdate()}
            className="self-start md:self-center flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span>EB Weekly Quick Update</span>
          </button>
        </div>
      </div>

      {/* 3 LARGE STRATEGY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Target className="w-5 h-5 text-sky-400" />
            <span>Strategic Pillars</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Click any card to view detailed initiatives</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strat) => {
            const prog = getStrategyProgress(strat.id, actions);
            const stratActions = actions.filter((a) => a.strategyId === strat.id);
            const completedCount = stratActions.filter((a) => a.status === 'DONE').length;
            const totalCount = stratActions.length;

            return (
              <div
                key={strat.id}
                onClick={() => onSelectStrategy(strat.id)}
                className={`group relative overflow-hidden rounded-2xl glass-panel p-6 cursor-pointer transition-all duration-300 hover:border-slate-500/60 ${
                  strat.id === 'membership' ? 'hover:shadow-red-500/10' :
                  strat.id === 'exchange' ? 'hover:shadow-sky-500/10' :
                  'hover:shadow-amber-500/10'
                } hover:-translate-y-1`}
              >
                {/* Top accent bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                  style={{ backgroundColor: strat.color }}
                />

                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 text-xs font-black tracking-wider rounded-md border ${strat.badgeBg}`}>
                    {strat.name}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 group-hover:text-white transition-colors">
                    <span className="text-xs font-semibold">View</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-1">
                  "{strat.tagline}"
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  {strat.why}
                </p>

                {/* Progress calculation */}
                <div className="space-y-2 pt-2 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Implementation</span>
                    <span className="text-white text-lg font-black" style={{ color: strat.color }}>
                      {prog}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-700/40">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${prog}%`,
                        backgroundColor: strat.color,
                        boxShadow: `0 0 12px ${strat.color}80`
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>{completedCount} / {totalCount} actions completed</span>
                    <span className="text-slate-300 font-semibold">{totalCount - completedCount} remaining</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OVERALL STRATEGY IMPLEMENTATION */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-lg bg-gradient-to-r from-navy-850 to-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">
              Overall Strategy Implementation
            </h3>
            <p className="text-xs text-slate-400">
              Automatically calculated from all strategic pillar actions across Gen 27.28
            </p>
          </div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300">
            {overallProgress}%
          </div>
        </div>

        <div className="relative w-full h-4 bg-navy-950 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-sky-400 to-amber-400 transition-all duration-1000 shadow-md"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* THIS QUARTER (Q1 Summary) */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">THIS QUARTER — Q1</h3>
              <p className="text-xs text-slate-400">Foundation & Launch (Sep - Nov 2026)</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>Full Timeline (Q0-Q4)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white">{q1Actions.length}</span>
            <span className="text-[11px] text-slate-400 font-medium">Total Actions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-2xl font-black">{q1Done}</span>
            </div>
            <span className="text-[11px] text-emerald-300/80 font-medium">Actions Completed</span>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-sky-400">
              <PlayCircle className="w-3.5 h-3.5" />
              <span className="text-2xl font-black">{q1InProgress}</span>
            </div>
            <span className="text-[11px] text-sky-300/80 font-medium">In Progress</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-2xl font-black">{q1AtRisk}</span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium">At Risk (7 Days)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-1 text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-2xl font-black">{q1Overdue}</span>
            </div>
            <span className="text-[11px] text-red-300/80 font-medium">Overdue</span>
          </div>
        </div>
      </div>

      {/* ATTENTION NEEDED SECTION (CRITICAL REQUIREMENT) */}
      <div className="rounded-2xl glass-panel p-6 border-2 border-red-500/30 bg-gradient-to-b from-navy-850 to-navy-900 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>ATTENTION NEEDED</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                  {attentionItems.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Actionable slipped items: Overdue actions, unassigned owners, items due within 7 days & low progress areas.
              </p>
            </div>
          </div>
        </div>

        {attentionItems.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-sm">All strategic actions are on track!</p>
            <p className="text-xs text-emerald-300/70">No overdue, unassigned, or at-risk items detected.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attentionItems.map((item) => {
              let badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
              let icon = <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;

              if (item.type === 'AT_RISK') {
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                icon = <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
              } else if (item.type === 'NO_UPDATE') {
                badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
                icon = <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
              } else if (item.type === 'UNASSIGNED') {
                badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                icon = <UserX className="w-4 h-4 text-purple-400 flex-shrink-0" />;
              }

              const matchedAction = item.actionId ? actions.find((a) => a.id === item.actionId) : null;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-navy-900/90 border border-slate-800 hover:border-slate-700 transition-all gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">{icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
                    </div>
                  </div>

                  {matchedAction && (
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => onOpenQuickUpdate(matchedAction.id)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                      >
                        Quick Update
                      </button>
                      <button
                        onClick={() => onOpenEditAction(matchedAction)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-navy-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KPI PERFORMANCE OVERVIEW */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">KPI PERFORMANCE HIGHLIGHTS</h3>
              <p className="text-xs text-slate-400">Key performance metrics across pillars (current vs target)</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('kpis')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All KPIs ({kpis.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.slice(0, 6).map((kpi) => {
            const achievement = getKpiAchievement(kpi);
            const strat = strategies.find((s) => s.id === kpi.strategyId);

            return (
              <div
                key={kpi.id}
                className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{kpi.name}</span>
                  <span 
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded border"
                    style={{
                      color: strat?.color || '#3B82F6',
                      borderColor: `${strat?.color}40`,
                      backgroundColor: `${strat?.color}15`
                    }}
                  >
                    {strat?.name}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-semibold text-slate-300">
                    <span className="text-lg font-black text-white">{kpi.currentValue.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-normal"> / {kpi.targetValue.toLocaleString()} {kpi.unit}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400">
                    {achievement.formatted}
                  </span>
                </div>

                <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${achievement.displayPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
