import React, { useState } from 'react';
import { 
  HelpCircle, 
  Compass, 
  Plus, 
  Zap, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { Strategy, StrategicArea, ActionItem, StrategyId } from '../types';
import { getStrategyProgress, getAreaProgress, getActionProgress, isActionOverdue } from '../utils/calculations';

interface StrategyDetailProps {
  strategy: Strategy;
  strategies: Strategy[];
  areas: StrategicArea[];
  actions: ActionItem[];
  onSelectStrategy: (id: StrategyId) => void;
  onOpenNewAction: (strategyId?: StrategyId, areaId?: string) => void;
  onOpenQuickUpdate: (actionId?: string) => void;
  onOpenEditAction: (action: ActionItem) => void;
}

export const StrategyDetail: React.FC<StrategyDetailProps> = ({
  strategy,
  strategies,
  areas,
  actions,
  onSelectStrategy,
  onOpenNewAction,
  onOpenQuickUpdate,
  onOpenEditAction,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const stratProgress = getStrategyProgress(strategy.id, actions);
  const strategyAreas = areas.filter((a) => a.strategyId === strategy.id);
  
  const strategyActions = actions.filter((a) => {
    if (a.strategyId !== strategy.id) return false;
    if (selectedAreaId && a.strategicAreaId !== selectedAreaId) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Strategy Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-3 overflow-x-auto">
        {strategies.map((s) => {
          const isActive = s.id === strategy.id;
          const prog = getStrategyProgress(s.id, actions);

          return (
            <button
              key={s.id}
              onClick={() => {
                onSelectStrategy(s.id);
                setSelectedAreaId(null);
              }}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-navy-800 text-white shadow-md border-2'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/50 border border-transparent'
              }`}
              style={{
                borderColor: isActive ? s.color : 'transparent',
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span>{s.name}</span>
              <span 
                className="px-2 py-0.5 rounded-full text-[11px] font-extrabold"
                style={{ backgroundColor: `${s.color}20`, color: s.color }}
              >
                {prog}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero Banner */}
      <div 
        className="rounded-2xl glass-panel p-6 sm:p-8 border shadow-xl relative overflow-hidden"
        style={{ borderColor: `${strategy.color}40` }}
      >
        <div 
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: strategy.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span 
                className="px-3 py-1 text-xs font-black tracking-wider uppercase rounded-md border"
                style={{
                  color: strategy.color,
                  borderColor: `${strategy.color}40`,
                  backgroundColor: `${strategy.color}15`
                }}
              >
                PILLAR 0{strategy.id === 'membership' ? '1' : strategy.id === 'exchange' ? '2' : '3'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Bardo Action Plan 27.28</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {strategy.name}
            </h1>
            <p className="text-lg font-bold" style={{ color: strategy.color }}>
              "{strategy.tagline}"
            </p>
          </div>

          {/* Large Progress Indicator */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-navy-950/80 border border-slate-800 self-start md:self-center">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strategy Progress</div>
              <div className="text-3xl font-black text-white" style={{ color: strategy.color }}>
                {stratProgress}%
              </div>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke={strategy.color}
                  strokeWidth="6"
                  strokeDasharray={163}
                  strokeDashoffset={163 - (163 * stratProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* WHY & HOW Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/50">
          <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800">
            <div className="flex items-center space-x-2 text-red-400 mb-2">
              <HelpCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black tracking-wider uppercase text-slate-300">WHY?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {strategy.why}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800">
            <div className="flex items-center space-x-2 text-sky-400 mb-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-black tracking-wider uppercase text-slate-300">HOW?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {strategy.how}
            </p>
          </div>
        </div>
      </div>

      {/* STRATEGIC AREAS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            STRATEGIC AREAS
          </h2>
          {selectedAreaId && (
            <button
              onClick={() => setSelectedAreaId(null)}
              className="text-xs font-semibold text-sky-400 hover:underline"
            >
              Show all areas ({strategyAreas.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategyAreas.map((area) => {
            const areaProg = getAreaProgress(area.id, actions);
            const isSelected = selectedAreaId === area.id;
            const areaActionsCount = actions.filter((a) => a.strategicAreaId === area.id).length;

            return (
              <div
                key={area.id}
                onClick={() => setSelectedAreaId(isSelected ? null : area.id)}
                className={`p-5 rounded-xl glass-panel cursor-pointer transition-all border ${
                  isSelected 
                    ? 'border-sky-400 bg-navy-800 shadow-md' 
                    : 'border-slate-800 hover:border-slate-700 hover:bg-navy-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{area.name}</h3>
                  <span className="text-sm font-black text-slate-200">{areaProg}%</span>
                </div>

                {area.description && (
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{area.description}</p>
                )}

                <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800 mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${areaProg}%`,
                      backgroundColor: strategy.color,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{areaActionsCount} action{areaActionsCount === 1 ? '' : 's'}</span>
                  <span className="text-sky-400 font-semibold">{isSelected ? 'Filter active' : 'Click to filter'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INITIATIVES & ACTIONS LIST */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>INITIATIVES & ACTIONS</span>
              {selectedAreaId && (
                <span className="text-xs font-normal text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  Filtered by area
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Track progress, status, owners, deadlines, and proof of execution.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenNewAction(strategy.id, selectedAreaId || undefined)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-[11px] text-slate-400 bg-navy-900/60 p-2.5 rounded-lg border border-slate-800/80 overflow-x-auto">
          <span className="font-bold text-slate-300">Status Symbols:</span>
          <span className="flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>DONE (100%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-sky-400 font-bold">◐</span>
            <span>IN PROGRESS (50%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-amber-400 font-bold">🔴</span>
            <span>BLOCKED / OVERDUE</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-slate-500 font-bold">○</span>
            <span>NOT STARTED (0%)</span>
          </span>
        </div>

        {strategyActions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">
            No actions defined for this selection yet.
          </div>
        ) : (
          <div className="space-y-3">
            {strategyActions.map((action) => {
              const prog = getActionProgress(action);
              const overdue = isActionOverdue(action);
              const isExpanded = expandedActionId === action.id;

              let statusIcon = <span className="text-slate-500 font-bold text-base">○</span>;
              let statusClass = 'text-slate-400 bg-slate-800/50 border-slate-700';

              if (action.status === 'DONE') {
                statusIcon = <span className="text-emerald-400 font-bold text-base">✓</span>;
                statusClass = 'text-emerald-300 bg-emerald-950/50 border-emerald-700/50';
              } else if (action.status === 'IN PROGRESS') {
                statusIcon = <span className="text-sky-400 font-bold text-base">◐</span>;
                statusClass = 'text-sky-300 bg-sky-950/50 border-sky-700/50';
              } else if (action.status === 'BLOCKED' || overdue) {
                statusIcon = <span className="text-red-400 font-bold text-base">🔴</span>;
                statusClass = 'text-red-300 bg-red-950/50 border-red-700/50';
              }

              return (
                <div
                  key={action.id}
                  className={`rounded-xl border transition-all ${
                    overdue 
                      ? 'border-red-500/40 bg-red-950/10' 
                      : 'border-slate-800 bg-navy-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-0.5">{statusIcon}</div>
                      
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{action.title}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${statusClass}`}>
                            {overdue ? 'OVERDUE' : action.status}
                          </span>
                          {action.initiativeId && (
                            <span className="text-[10px] text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-slate-800">
                              {action.initiativeId}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>Owner: <strong className="text-slate-200">{action.owner}</strong></span>
                          <span>Quarter: <strong className="text-slate-200">{action.quarterId}</strong></span>
                          <span>Deadline: <strong className={overdue ? 'text-red-400 font-bold' : 'text-slate-300'}>{action.deadline}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end md:self-center">
                      <div className="text-right">
                        <span className="text-sm font-black text-white">{prog}%</span>
                        <div className="w-20 h-1.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="h-full bg-sky-400 rounded-full" 
                            style={{ width: `${prog}%` }} 
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenQuickUpdate(action.id)}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
                        title="Quick Update"
                      >
                        <Zap className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                        className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:bg-slate-700 transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Tray */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-navy-950/40 text-xs space-y-3">
                      {action.description && (
                        <p className="text-slate-300"><strong className="text-slate-400">Description:</strong> {action.description}</p>
                      )}

                      {action.notes && (
                        <p className="text-slate-300"><strong className="text-slate-400">Latest Note:</strong> {action.notes}</p>
                      )}

                      {action.evidenceUrl && (
                        <div className="flex items-center space-x-2 text-sky-400">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <a href={action.evidenceUrl} target="_blank" rel="noreferrer" className="hover:underline font-semibold">
                            Proof / Evidence Link ({action.evidenceUrl})
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/50">
                        <span>Last updated: {action.lastUpdated}</span>
                        <button
                          onClick={() => onOpenEditAction(action)}
                          className="text-sky-400 hover:underline font-bold"
                        >
                          Edit Full Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
