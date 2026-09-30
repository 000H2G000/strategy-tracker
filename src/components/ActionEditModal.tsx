import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Link } from 'lucide-react';
import type { ActionItem, Strategy, StrategicArea, KPI, StrategyId, QuarterId, StatusType } from '../types';

interface ActionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ActionItem | null;
  strategies: Strategy[];
  areas: StrategicArea[];
  kpis: KPI[];
  owners: string[];
  onSave: (action: ActionItem) => void;
  onDelete?: (actionId: string) => void;
}

export const ActionEditModal: React.FC<ActionEditModalProps> = ({
  isOpen,
  onClose,
  action,
  strategies: _strategies,
  areas,
  kpis,
  owners,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strategyId, setStrategyId] = useState<StrategyId>('membership');
  const [strategicAreaId, setStrategicAreaId] = useState('');
  const [initiativeId, setInitiativeId] = useState('');
  const [owner, setOwner] = useState('VP TM');
  const [quarterId, setQuarterId] = useState<QuarterId>('Q1');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<StatusType>('NOT STARTED');
  const [customProgress, setCustomProgress] = useState<string>('');
  const [kpiId, setKpiId] = useState('');
  const [notes, setNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  useEffect(() => {
    if (action) {
      setTitle(action.title || '');
      setDescription(action.description || '');
      setStrategyId(action.strategyId || 'membership');
      setStrategicAreaId(action.strategicAreaId || '');
      setInitiativeId(action.initiativeId || '');
      setOwner(action.owner || 'VP TM');
      setQuarterId(action.quarterId || 'Q1');
      setStartDate(action.startDate || '');
      setDeadline(action.deadline || '');
      setStatus(action.status || 'NOT STARTED');
      setCustomProgress(action.customProgress !== undefined ? String(action.customProgress) : '');
      setKpiId(action.kpiId || '');
      setNotes(action.notes || '');
      setEvidenceUrl(action.evidenceUrl || '');
    } else {
      // Defaults for new action
      setTitle('');
      setDescription('');
      setStrategyId('membership');
      setStrategicAreaId(areas.find((a) => a.strategyId === 'membership')?.id || '');
      setInitiativeId('');
      setOwner('VP TM');
      setQuarterId('Q1');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDeadline(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setStatus('NOT STARTED');
      setCustomProgress('');
      setKpiId('');
      setNotes('');
      setEvidenceUrl('');
    }
  }, [action, isOpen, areas]);

  const availableAreas = areas.filter((a) => a.strategyId === strategyId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedAction: ActionItem = {
      id: action ? action.id : `act-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      strategyId,
      strategicAreaId: strategicAreaId || availableAreas[0]?.id || 'area-dev-member',
      initiativeId: initiativeId.trim() || undefined,
      owner,
      quarterId,
      startDate: startDate || undefined,
      deadline: deadline || new Date().toISOString().split('T')[0],
      status,
      customProgress: customProgress !== '' ? Number(customProgress) : undefined,
      kpiId: kpiId || undefined,
      notes: notes.trim() || undefined,
      evidenceUrl: evidenceUrl.trim() || undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: action ? action.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(updatedAction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-slate-700/80 p-6 shadow-2xl space-y-6 my-8 bg-gradient-to-b from-navy-850 to-navy-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <h3 className="text-xl font-black text-white">
            {action ? 'EDIT ACTION ITEM' : 'NEW STRATEGIC ACTION'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">ACTION TITLE *</label>
            <input
              type="text"
              required
              placeholder="e.g. Conduct functional O2O check-ins with all team leads"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">DESCRIPTION</label>
            <textarea
              rows={2}
              placeholder="Detailed explanation of execution steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Hierarchy: Strategy & Strategic Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">STRATEGIC PILLAR</label>
              <select
                value={strategyId}
                onChange={(e) => {
                  const newStrat = e.target.value as StrategyId;
                  setStrategyId(newStrat);
                  const firstArea = areas.find((a) => a.strategyId === newStrat);
                  if (firstArea) setStrategicAreaId(firstArea.id);
                }}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-bold"
              >
                <option value="membership">MEMBERSHIP (Empower the Next)</option>
                <option value="exchange">EXCHANGE (Lead the Growth)</option>
                <option value="external">EXTERNAL RELEVANCE (Build What Lasts)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">STRATEGIC AREA</label>
              <select
                value={strategicAreaId}
                onChange={(e) => setStrategicAreaId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {availableAreas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Initiative & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">INITIATIVE (OPTIONAL)</label>
              <input
                type="text"
                placeholder="e.g. Individual Development Plans"
                value={initiativeId}
                onChange={(e) => setInitiativeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">PRIMARY OWNER *</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-semibold"
              >
                {owners.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quarter, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">QUARTER</label>
              <select
                value={quarterId}
                onChange={(e) => setQuarterId(e.target.value as QuarterId)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="Q0">Q0 (Jul - Aug)</option>
                <option value="Q1">Q1 (Sep - Nov)</option>
                <option value="Q2">Q2 (Dec - Feb)</option>
                <option value="Q3">Q3 (Mar - May)</option>
                <option value="Q4">Q4 (Jun - Aug)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">DEADLINE *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>
          </div>

          {/* Status & Custom Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">STATUS</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusType)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 font-bold"
              >
                <option value="NOT STARTED">NOT STARTED (0%)</option>
                <option value="IN PROGRESS">IN PROGRESS (50%)</option>
                <option value="BLOCKED">BLOCKED (25%)</option>
                <option value="DONE">DONE (100%)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">CUSTOM OVERRIDE PROGRESS % (OPTIONAL)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Leave blank for automatic status progress"
                value={customProgress}
                onChange={(e) => setCustomProgress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* KPI linkage */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">LINKED KPI (OPTIONAL)</label>
            <select
              value={kpiId}
              onChange={(e) => setKpiId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="">-- No KPI linked --</option>
              {kpis.map((k) => (
                <option key={k.id} value={k.id}>{k.name} ({k.unit})</option>
              ))}
            </select>
          </div>

          {/* Evidence URL */}
          <div>
            <label className="font-bold text-slate-300 block mb-1 flex items-center space-x-1">
              <Link className="w-3.5 h-3.5 text-sky-400" />
              <span>EVIDENCE / PROOF LINK (URL)</span>
            </label>
            <input
              type="url"
              placeholder="e.g. Google Drive, Notion, Form URL"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">PROGRESS NOTES / REASONING</label>
            <textarea
              rows={2}
              placeholder="Add short updates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            {action && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this action permanently?')) {
                    onDelete(action.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-1 text-red-400 hover:text-red-300 px-3 py-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-navy-800 border border-slate-700 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Action</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
