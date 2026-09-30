import React from 'react';
import { Users } from 'lucide-react';
import type { ActionItem } from '../types';
import { getOwnerStatistics, CURRENT_REF_DATE } from '../utils/calculations';

interface OwnerAccountabilityProps {
  owners: string[];
  actions: ActionItem[];
  onSelectOwner: (owner: string) => void;
}

export const OwnerAccountability: React.FC<OwnerAccountabilityProps> = ({
  owners,
  actions,
  onSelectOwner,
}) => {
  const statsList = owners.map((owner) => getOwnerStatistics(owner, actions, CURRENT_REF_DATE))
    .filter((s) => s.totalActions > 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Users className="w-6 h-6 text-sky-400" />
          <span>OWNER ACCOUNTABILITY DASHBOARD</span>
        </h1>
        <p className="text-xs text-slate-400">
          Track individual EB & SMT leader ownership, action progress, completion ratios, and overdue items.
        </p>
      </div>

      {/* Owner Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsList.map((stat) => {
          return (
            <div
              key={stat.owner}
              className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-lg space-y-4 hover:border-slate-600 transition-all"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-sm">
                    {stat.owner.replace('VP ', '')}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{stat.owner}</h3>
                    <p className="text-xs text-slate-400 font-mono">{stat.totalActions} Assigned Actions</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{stat.completionPercentage}%</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Completion</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${stat.completionPercentage}%` }}
                />
              </div>

              {/* Breakdown tiles */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800">
                  <span className="font-black text-emerald-400 block">{stat.completedActions}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Done</span>
                </div>

                <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800">
                  <span className="font-black text-sky-400 block">{stat.inProgressActions}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">In Prog</span>
                </div>

                <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800">
                  <span className="font-black text-amber-400 block">{stat.atRiskActions}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">At Risk</span>
                </div>

                <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800">
                  <span className={`font-black block ${stat.overdueActions > 0 ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}>
                    {stat.overdueActions}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Overdue</span>
                </div>
              </div>

              {/* Filter button */}
              <button
                onClick={() => onSelectOwner(stat.owner)}
                className="w-full py-2 rounded-xl bg-navy-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                View {stat.owner}'s Actions ({stat.totalActions})
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
