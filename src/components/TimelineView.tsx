import React, { useState } from 'react';
import { Calendar, Flag, CheckCircle2, Clock, Zap } from 'lucide-react';
import { QuarterInfo, ActionItem, QuarterId } from '../types';
import { getActionProgress, isActionOverdue } from '../utils/calculations';

interface TimelineViewProps {
  quarters: QuarterInfo[];
  actions: ActionItem[];
  onOpenQuickUpdate: (actionId?: string) => void;
  onOpenEditAction: (action: ActionItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  quarters,
  actions,
  onOpenQuickUpdate,
  onOpenEditAction,
}) => {
  const [selectedQuarterId, setSelectedQuarterId] = useState<QuarterId>('Q1');

  const selectedQuarter = quarters.find((q) => q.id === selectedQuarterId) || quarters[1];
  const quarterActions = actions.filter((a) => a.quarterId === selectedQuarterId);

  const completedCount = quarterActions.filter((a) => a.status === 'DONE').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-sky-400" />
          <span>ACTION PLAN QUARTER TIMELINE (Q0 - Q4)</span>
        </h1>
        <p className="text-xs text-slate-400">
          LC Year 27.28 timeline & milestone progression across all 5 quarters.
        </p>
      </div>

      {/* Quarter Timeline Bar (Q0 -> Q1 -> Q2 -> Q3 -> Q4) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {quarters.map((q) => {
          const isSelected = q.id === selectedQuarterId;
          const qActs = actions.filter((a) => a.quarterId === q.id);
          const qDone = qActs.filter((a) => a.status === 'DONE').length;

          return (
            <button
              key={q.id}
              onClick={() => setSelectedQuarterId(q.id)}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                isSelected
                  ? 'bg-navy-800 border-sky-400 shadow-xl ring-1 ring-sky-400'
                  : 'bg-navy-900/70 border-slate-800 hover:border-slate-700 hover:bg-navy-850'
              }`}
            >
              {q.isCurrent && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-sky-500 text-white animate-pulse">
                  Current
                </span>
              )}

              <div className="text-xs font-mono font-bold text-sky-400">{q.id}</div>
              <div className="text-sm font-black text-white truncate mt-0.5">{q.name.split('-')[1] || q.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">{q.period}</div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                <span>{qActs.length} actions</span>
                <span className="text-emerald-400">{qDone} done</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quarter Details Panel */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 space-y-6">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-black rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {selectedQuarter.id}
              </span>
              <h2 className="text-xl font-extrabold text-white">{selectedQuarter.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Timeline Period: {selectedQuarter.period}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Completion Rate</span>
              <span className="text-lg font-black text-emerald-400">
                {quarterActions.length > 0 ? Math.round((completedCount / quarterActions.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Official LC Events & Milestones Pills */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Flag className="w-4 h-4 text-amber-400" />
            <span>Key Quarter Events & Milestones</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {selectedQuarter.events.map((evt) => (
              <span
                key={evt}
                className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-200 text-xs font-semibold shadow-sm flex items-center space-x-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{evt}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Assigned Strategic Actions for this Quarter */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Assigned Strategic Actions ({quarterActions.length})</span>
          </h3>

          {quarterActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No actions scheduled specifically for {selectedQuarter.id}.
            </div>
          ) : (
            <div className="space-y-3">
              {quarterActions.map((act) => {
                const prog = getActionProgress(act);
                const overdue = isActionOverdue(act);

                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-navy-950 text-sky-400 border border-slate-800">
                          {act.strategyId.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-bold text-white">{act.title}</h4>
                      </div>

                      <p className="text-xs text-slate-400">
                        Owner: <strong className="text-slate-200">{act.owner}</strong> • Deadline: <strong className={overdue ? 'text-red-400 font-bold' : 'text-slate-300'}>{act.deadline}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className="text-xs font-mono font-bold text-white">{prog}%</span>
                      <button
                        onClick={() => onOpenQuickUpdate(act.id)}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenEditAction(act)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-navy-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
