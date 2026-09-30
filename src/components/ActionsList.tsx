import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Zap, 
  ExternalLink, 
  ArrowUpDown, 
  AlertTriangle,
  User
} from 'lucide-react';
import type { ActionItem, Strategy, StrategicArea, StrategyId, QuarterId, StatusType } from '../types';
import { getActionProgress, isActionOverdue, isActionAtRisk } from '../utils/calculations';

interface ActionsListProps {
  actions: ActionItem[];
  strategies: Strategy[];
  areas: StrategicArea[];
  owners: string[];
  onOpenNewAction: () => void;
  onOpenQuickUpdate: (actionId?: string) => void;
  onOpenEditAction: (action: ActionItem) => void;
  onQuickStatusChange: (actionId: string, status: StatusType) => void;
}

export const ActionsList: React.FC<ActionsListProps> = ({
  actions,
  strategies,
  areas,
  owners,
  onOpenNewAction,
  onOpenQuickUpdate,
  onOpenEditAction,
  onQuickStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [strategyFilter, setStrategyFilter] = useState<StrategyId | 'ALL'>('ALL');
  const [quarterFilter, setQuarterFilter] = useState<QuarterId | 'ALL'>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'ALL'>('ALL');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [areaFilter, setAreaFilter] = useState<string>('ALL');

  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'status'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered strategic areas dependent on strategyFilter
  const availableAreas = useMemo(() => {
    if (strategyFilter === 'ALL') return areas;
    return areas.filter((a) => a.strategyId === strategyFilter);
  }, [areas, strategyFilter]);

  // Filter & Sort Logic
  const filteredActions = useMemo(() => {
    return actions.filter((act) => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(term);
        const matchesOwner = act.owner.toLowerCase().includes(term);
        const matchesDesc = act.description?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesOwner && !matchesDesc) return false;
      }

      // Strategy
      if (strategyFilter !== 'ALL' && act.strategyId !== strategyFilter) return false;

      // Quarter
      if (quarterFilter !== 'ALL' && act.quarterId !== quarterFilter) return false;

      // Owner
      if (ownerFilter !== 'ALL' && act.owner !== ownerFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && act.status !== statusFilter) return false;

      // Overdue
      if (overdueOnly && !isActionOverdue(act)) return false;

      // Area
      if (areaFilter !== 'ALL' && act.strategicAreaId !== areaFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        const dA = new Date(a.deadline).getTime();
        const dB = new Date(b.deadline).getTime();
        return sortOrder === 'asc' ? dA - dB : dB - dA;
      }
      if (sortBy === 'progress') {
        const pA = getActionProgress(a);
        const pB = getActionProgress(b);
        return sortOrder === 'asc' ? pA - pB : pB - pA;
      }
      if (sortBy === 'status') {
        return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, [actions, searchTerm, strategyFilter, quarterFilter, ownerFilter, statusFilter, overdueOnly, areaFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'deadline' | 'progress' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ACTION PLAN TRACKER ({filteredActions.length})
          </h1>
          <p className="text-xs text-slate-400">
            View, filter, sort and rapidly update all Bardo strategic actions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenQuickUpdate()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 fill-amber-400/20 text-amber-400" />
            <span>Weekly Quick Mode</span>
          </button>

          <button
            onClick={onOpenNewAction}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-700/60 space-y-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action title, description, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          
          {/* Strategy */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">STRATEGY</label>
            <select
              value={strategyFilter}
              onChange={(e) => {
                setStrategyFilter(e.target.value as any);
                setAreaFilter('ALL');
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Strategies</option>
              <option value="membership">Membership</option>
              <option value="exchange">Exchange</option>
              <option value="external">External Relevance</option>
            </select>
          </div>

          {/* Quarter */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">QUARTER</label>
            <select
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value as any)}
              className="w-full py-1.5 px-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Quarters</option>
              <option value="Q0">Q0</option>
              <option value="Q1">Q1 (Current)</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">OWNER</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Owners</option>
              {owners.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">STATUS</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-1.5 px-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT STARTED">Not Started</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">STRATEGIC AREA</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Areas</option>
              {availableAreas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Overdue Toggle */}
          <div className="flex flex-col justify-end">
            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                overdueOnly
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue Only</span>
            </button>
          </div>

        </div>
      </div>

      {/* ACTIONS TABLE */}
      <div className="rounded-2xl glass-panel border border-slate-700/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="bg-navy-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-3">Strategy</th>
                <th className="py-3 px-3">Strategic Area</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-2">Quarter</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('deadline')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                  onClick={() => toggleSort('progress')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Progress</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Proof</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/80">
              {filteredActions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No actions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredActions.map((action) => {
                  const prog = getActionProgress(action);
                  const overdue = isActionOverdue(action);
                  const atRisk = isActionAtRisk(action);
                  const strat = strategies.find((s) => s.id === action.strategyId);
                  const area = areas.find((a) => a.id === action.strategicAreaId);

                  return (
                    <tr
                      key={action.id}
                      className={`hover:bg-navy-800/60 transition-colors ${
                        overdue ? 'bg-red-950/20' : ''
                      }`}
                    >
                      {/* Title & description */}
                      <td className="py-3.5 px-4 font-semibold text-white max-w-xs">
                        <div className="flex items-center space-x-2">
                          <span className="line-clamp-2">{action.title}</span>
                        </div>
                        {action.notes && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                            Note: {action.notes}
                          </p>
                        )}
                      </td>

                      {/* Strategy Badge */}
                      <td className="py-3.5 px-3">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{
                            color: strat?.color || '#3B82F6',
                            borderColor: `${strat?.color}40`,
                            backgroundColor: `${strat?.color}15`
                          }}
                        >
                          {strat?.name}
                        </span>
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-3 text-slate-300 max-w-[140px] truncate">
                        {area?.name || action.strategicAreaId}
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-3 font-medium text-slate-200">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{action.owner || 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* Quarter */}
                      <td className="py-3.5 px-2">
                        <span className="px-2 py-0.5 rounded bg-navy-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          {action.quarterId}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`font-mono ${overdue ? 'text-red-400 font-bold' : atRisk ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}>
                          {action.deadline}
                        </span>
                        {overdue && <span className="ml-1 text-[10px] text-red-400 font-bold">🔴</span>}
                        {atRisk && <span className="ml-1 text-[10px] text-amber-400 font-bold">🟠</span>}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-3">
                        <select
                          value={action.status}
                          onChange={(e) => onQuickStatusChange(action.id, e.target.value as StatusType)}
                          className={`py-1 px-2 rounded text-[10px] font-bold border focus:outline-none cursor-pointer ${
                            action.status === 'DONE' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' :
                            action.status === 'IN PROGRESS' ? 'bg-sky-950/80 text-sky-300 border-sky-700/60' :
                            action.status === 'BLOCKED' ? 'bg-red-950/80 text-red-300 border-red-700/60' :
                            'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="NOT STARTED">NOT STARTED</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="BLOCKED">BLOCKED</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-bold text-white font-mono">{prog}%</span>
                          <div className="w-12 h-1.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="h-full bg-sky-400 rounded-full" 
                              style={{ width: `${prog}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Evidence Link */}
                      <td className="py-3.5 px-3 text-center">
                        {action.evidenceUrl ? (
                          <a
                            href={action.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex p-1.5 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 border border-sky-500/30 transition-all"
                            title="View Evidence Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[10px]">None</span>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onOpenQuickUpdate(action.id)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all"
                          title="Quick Update"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditAction(action)}
                          className="px-2 py-1 rounded-lg bg-navy-800 text-slate-300 hover:bg-slate-700 text-[11px] font-semibold border border-slate-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
