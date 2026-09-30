import React, { useState, useEffect } from 'react';
import { X, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ActionItem, StatusType } from '../types';
import confetti from 'canvas-confetti';

interface QuickUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionItem[];
  initialActionId?: string;
  onSaveAction: (updatedAction: ActionItem) => void;
}

export const QuickUpdateModal: React.FC<QuickUpdateModalProps> = ({
  isOpen,
  onClose,
  actions,
  initialActionId,
  onSaveAction,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form state
  const [status, setStatus] = useState<StatusType>('IN PROGRESS');
  const [customProgress, setCustomProgress] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  // Synchronize index when opened
  useEffect(() => {
    if (initialActionId && actions.length > 0) {
      const foundIdx = actions.findIndex((a) => a.id === initialActionId);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      }
    }
  }, [initialActionId, actions, isOpen]);

  const currentAction = actions[currentIndex] || actions[0];

  // Update form fields when currentAction changes
  useEffect(() => {
    if (currentAction) {
      setStatus(currentAction.status);
      setCustomProgress(currentAction.customProgress);
      setNotes(currentAction.notes || '');
      setEvidenceUrl(currentAction.evidenceUrl || '');
      setJustSaved(false);
    }
  }, [currentAction, currentIndex]);

  if (!isOpen || !currentAction) return null;

  const handleSave = (andNext: boolean = true) => {
    const updated: ActionItem = {
      ...currentAction,
      status,
      customProgress: customProgress !== undefined ? Number(customProgress) : undefined,
      notes,
      evidenceUrl: evidenceUrl.trim() ? evidenceUrl.trim() : undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onSaveAction(updated);

    if (status === 'DONE') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setJustSaved(true);

    if (andNext && currentIndex < actions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setJustSaved(false);
      }, 300);
    } else if (!andNext) {
      setTimeout(() => onClose(), 400);
    }
  };

  const handleStatusSelect = (newStatus: StatusType) => {
    setStatus(newStatus);
    if (newStatus === 'DONE') setCustomProgress(100);
    else if (newStatus === 'IN PROGRESS') setCustomProgress(50);
    else if (newStatus === 'BLOCKED') setCustomProgress(25);
    else if (newStatus === 'NOT STARTED') setCustomProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border-2 border-amber-500/40 p-6 shadow-2xl space-y-5 bg-gradient-to-b from-navy-850 to-navy-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">RAPID WEEKLY UPDATE</h3>
              <p className="text-[11px] text-amber-300/80 font-mono">
                Item {currentIndex + 1} of {actions.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Action Info */}
        <div className="p-4 rounded-xl bg-navy-950/90 border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            {currentAction.strategyId.toUpperCase()} • {currentAction.owner}
          </span>
          <h4 className="text-base font-bold text-white pt-1">{currentAction.title}</h4>
          <p className="text-xs text-slate-400 font-mono">Deadline: {currentAction.deadline} • Quarter: {currentAction.quarterId}</p>
        </div>

        {/* Status Quick Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">STATUS</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['NOT STARTED', 'IN PROGRESS', 'BLOCKED', 'DONE'] as StatusType[]).map((s) => {
              const isSel = status === s;
              let styleClass = 'border-slate-700 text-slate-400 bg-navy-900';
              if (isSel) {
                if (s === 'DONE') styleClass = 'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-md';
                else if (s === 'IN PROGRESS') styleClass = 'border-sky-500 bg-sky-950 text-sky-300 shadow-md';
                else if (s === 'BLOCKED') styleClass = 'border-red-500 bg-red-950 text-red-300 shadow-md';
                else styleClass = 'border-slate-500 bg-slate-800 text-slate-200';
              }

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusSelect(s)}
                  className={`py-2 px-2 rounded-xl text-xs font-black border transition-all text-center ${styleClass}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Progress Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-300">PROGRESS</label>
            <span className="font-mono font-black text-sky-400 text-sm">
              {customProgress !== undefined ? customProgress : (status === 'DONE' ? 100 : status === 'IN PROGRESS' ? 50 : status === 'BLOCKED' ? 25 : 0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={customProgress !== undefined ? customProgress : (status === 'DONE' ? 100 : status === 'IN PROGRESS' ? 50 : status === 'BLOCKED' ? 25 : 0)}
            onChange={(e) => setCustomProgress(Number(e.target.value))}
            className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Short Note */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">WEEKLY UPDATE NOTE</label>
          <input
            type="text"
            placeholder="e.g. 65% completed, slides submitted, meeting done..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Evidence Link (Optional) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">EVIDENCE / PROOF LINK (OPTIONAL)</label>
          <input
            type="url"
            placeholder="e.g. https://drive.google.com/..."
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Navigation & Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center space-x-1">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentIndex === actions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(actions.length - 1, prev + 1))}
              className="p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
            >
              Save & Close
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md"
            >
              <span>{justSaved ? 'Saved!' : 'Save & Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
