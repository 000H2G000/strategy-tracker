import React, { useState } from 'react';
import { TrendingUp, Plus, Check, Edit2, User, Clock } from 'lucide-react';
import type { KPI, Strategy, StrategyId, KpiUnit } from '../types';
import { getKpiAchievement } from '../utils/calculations';

interface KpiTrackerProps {
  kpis: KPI[];
  strategies: Strategy[];
  onSaveKpi: (updated: KPI) => void;
  onAddKpi: (newKpi: KPI) => void;
}

export const KpiTracker: React.FC<KpiTrackerProps> = ({
  kpis,
  strategies,
  onSaveKpi,
  onAddKpi,
}) => {
  const [filterStrategy, setFilterStrategy] = useState<StrategyId | 'ALL'>('ALL');
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // New KPI modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStrategy, setNewStrategy] = useState<StrategyId>('membership');
  const [newOwner, setNewOwner] = useState('VP TM');
  const [newCurrent, setNewCurrent] = useState(0);
  const [newTarget, setNewTarget] = useState(100);
  const [newUnit, setNewUnit] = useState<KpiUnit>('%');

  const filteredKpis = kpis.filter((k) => {
    if (filterStrategy !== 'ALL' && k.strategyId !== filterStrategy) return false;
    return true;
  });

  const handleInlineSave = (kpi: KPI) => {
    const updated: KPI = {
      ...kpi,
      currentValue: editValue,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    onSaveKpi(updated);
    setEditingKpiId(null);
  };

  const handleCreateKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: KPI = {
      id: `kpi-${Date.now()}`,
      name: newName.trim(),
      strategyId: newStrategy,
      owner: newOwner,
      currentValue: Number(newCurrent),
      targetValue: Number(newTarget),
      unit: newUnit,
      higherIsBetter: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddKpi(created);
    setIsAddOpen(false);
    setNewName('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <span>LIGHTWEIGHT KPI TRACKER</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track quantitative metrics & achievement ratios alongside strategic implementation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter strategy */}
          <select
            value={filterStrategy}
            onChange={(e) => setFilterStrategy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-navy-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Pillars</option>
            <option value="membership">Membership KPIs</option>
            <option value="exchange">Exchange KPIs</option>
            <option value="external">External Relevance KPIs</option>
          </select>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add KPI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKpis.map((kpi) => {
          const strat = strategies.find((s) => s.id === kpi.strategyId);
          const achievement = getKpiAchievement(kpi);
          const isEditing = editingKpiId === kpi.id;

          return (
            <div
              key={kpi.id}
              className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-lg space-y-4 relative overflow-hidden"
            >
              {/* Pillar top border accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: strat?.color || '#F59E0B' }}
              />

              {/* Title & Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <span 
                    className="px-2.5 py-0.5 rounded text-[10px] font-extrabold border uppercase"
                    style={{
                      color: strat?.color || '#F59E0B',
                      borderColor: `${strat?.color}40`,
                      backgroundColor: `${strat?.color}15`
                    }}
                  >
                    {strat?.name}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-2">{kpi.name}</h3>
                </div>

                <span className="text-xl font-black text-emerald-400">
                  {achievement.formatted}
                </span>
              </div>

              {/* Values & Quick Inline Edit */}
              <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">CURRENT / TARGET</span>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-navy-900 border border-sky-500 text-white font-mono text-sm font-bold"
                      />
                      <button
                        onClick={() => handleInlineSave(kpi)}
                        className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-400"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-slate-200 mt-0.5">
                      <span className="text-lg font-black text-white font-mono">{kpi.currentValue.toLocaleString()}</span>
                      <span className="text-slate-400 font-normal"> / {kpi.targetValue.toLocaleString()} {kpi.unit}</span>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditingKpiId(kpi.id);
                      setEditValue(kpi.currentValue);
                    }}
                    className="p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="Update current value"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Achievement Ratio</span>
                  <span className="text-slate-200 font-bold">{achievement.rawPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${achievement.displayPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3 text-slate-500" />
                  <span>{kpi.owner}</span>
                </div>
                <div className="flex items-center space-x-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{kpi.lastUpdated}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD KPI MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-700/80 p-6 shadow-2xl space-y-4 bg-navy-900">
            <h3 className="text-lg font-black text-white">ADD NEW KPI</h3>
            
            <form onSubmit={handleCreateKpi} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">KPI NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. % LPS or B2B Revenue"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">STRATEGY</label>
                  <select
                    value={newStrategy}
                    onChange={(e) => setNewStrategy(e.target.value as StrategyId)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white"
                  >
                    <option value="membership">Membership</option>
                    <option value="exchange">Exchange</option>
                    <option value="external">External Relevance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">OWNER</label>
                  <input
                    type="text"
                    required
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">CURRENT</label>
                  <input
                    type="number"
                    required
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">TARGET</label>
                  <input
                    type="number"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">UNIT</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as KpiUnit)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white"
                  >
                    <option value="%">%</option>
                    <option value="#">#</option>
                    <option value="TND">TND</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Create KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
