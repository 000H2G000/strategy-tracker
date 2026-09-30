import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StrategyDetail } from './components/StrategyDetail';
import { ActionsList } from './components/ActionsList';
import { QuickUpdateModal } from './components/QuickUpdateModal';
import { ActionEditModal } from './components/ActionEditModal';
import { KpiTracker } from './components/KpiTracker';
import { TimelineView } from './components/TimelineView';
import { OwnerAccountability } from './components/OwnerAccountability';

import { SEED_STRATEGIES, SEED_AREAS, SEED_QUARTERS, SEED_OWNERS } from './data/seedData';
import { ActionItem, KPI, StrategyId, StatusType } from './types';
import { loadActions, saveActions, loadKPIs, saveKPIs, resetToSeedData } from './services/storage';
import { isActionOverdue } from './utils/calculations';

export function App() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyId | null>('membership');

  // Modal States
  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);
  const [quickUpdateActionId, setQuickUpdateActionId] = useState<string | undefined>(undefined);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from local storage
  useEffect(() => {
    const loadedActs = loadActions();
    const loadedKpis = loadKPIs();
    setActions(loadedActs);
    setKpis(loadedKpis);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Actions CRUD Handlers
  const handleSaveAction = (savedAction: ActionItem) => {
    setActions((prev) => {
      const idx = prev.findIndex((a) => a.id === savedAction.id);
      let updatedList: ActionItem[];
      if (idx !== -1) {
        updatedList = [...prev];
        updatedList[idx] = savedAction;
      } else {
        updatedList = [savedAction, ...prev];
      }
      saveActions(updatedList);
      return updatedList;
    });
    showToast('Action item updated successfully!');
  };

  const handleDeleteAction = (actionId: string) => {
    setActions((prev) => {
      const updatedList = prev.filter((a) => a.id !== actionId);
      saveActions(updatedList);
      return updatedList;
    });
    showToast('Action deleted.');
  };

  const handleQuickStatusChange = (actionId: string, status: StatusType) => {
    setActions((prev) => {
      const updatedList = prev.map((a) => {
        if (a.id === actionId) {
          let customProg: number | undefined = undefined;
          if (status === 'DONE') customProg = 100;
          else if (status === 'IN PROGRESS') customProg = 50;
          else if (status === 'BLOCKED') customProg = 25;
          else if (status === 'NOT STARTED') customProg = 0;

          return {
            ...a,
            status,
            customProgress: customProg,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return a;
      });
      saveActions(updatedList);
      return updatedList;
    });
    showToast(`Status updated to ${status}`);
  };

  // KPI Handlers
  const handleSaveKpi = (updatedKpi: KPI) => {
    setKpis((prev) => {
      const updatedList = prev.map((k) => (k.id === updatedKpi.id ? updatedKpi : k));
      saveKPIs(updatedList);
      return updatedList;
    });
    showToast('KPI value updated!');
  };

  const handleAddKpi = (newKpi: KPI) => {
    setKpis((prev) => {
      const updatedList = [newKpi, ...prev];
      saveKPIs(updatedList);
      return updatedList;
    });
    showToast('New KPI added!');
  };

  // Reset Demo Data Handler
  const handleResetData = () => {
    if (confirm('Reset tracker to default Bardo Action Plan 27.28 demo data?')) {
      const { actions: resetActs, kpis: resetKpis } = resetToSeedData();
      setActions(resetActs);
      setKpis(resetKpis);
      showToast('Reset to original Bardo 27.28 seed data!');
    }
  };

  // Navigation Trigger Helpers
  const handleOpenQuickUpdate = (actionId?: string) => {
    setQuickUpdateActionId(actionId);
    setIsQuickUpdateOpen(true);
  };

  const handleOpenNewAction = (strategyId?: StrategyId, areaId?: string) => {
    setEditingAction(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditAction = (action: ActionItem) => {
    setEditingAction(action);
    setIsEditModalOpen(true);
  };

  const handleSelectStrategy = (stratId: StrategyId) => {
    setSelectedStrategyId(stratId);
    setActiveTab('strategies');
  };

  const handleSelectOwner = (owner: string) => {
    setActiveTab('actions');
  };

  const overdueCount = actions.filter((a) => isActionOverdue(a)).length;

  const currentStrategy = SEED_STRATEGIES.find((s) => s.id === selectedStrategyId) || SEED_STRATEGIES[0];

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-2xl animate-bounce border border-sky-400/50">
          {toastMessage}
        </div>
      )}

      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedStrategyId={selectedStrategyId}
        setSelectedStrategyId={setSelectedStrategyId}
        onOpenQuickUpdate={() => handleOpenQuickUpdate()}
        onOpenNewAction={() => handleOpenNewAction()}
        onResetData={handleResetData}
        overdueCount={overdueCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <Dashboard
            strategies={SEED_STRATEGIES}
            areas={SEED_AREAS}
            actions={actions}
            kpis={kpis}
            onSelectStrategy={handleSelectStrategy}
            onOpenQuickUpdate={handleOpenQuickUpdate}
            onOpenEditAction={handleOpenEditAction}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* STRATEGIES TAB */}
        {activeTab === 'strategies' && (
          <StrategyDetail
            strategy={currentStrategy}
            strategies={SEED_STRATEGIES}
            areas={SEED_AREAS}
            actions={actions}
            onSelectStrategy={setSelectedStrategyId}
            onOpenNewAction={handleOpenNewAction}
            onOpenQuickUpdate={handleOpenQuickUpdate}
            onOpenEditAction={handleOpenEditAction}
          />
        )}

        {/* ACTIONS TAB */}
        {activeTab === 'actions' && (
          <ActionsList
            actions={actions}
            strategies={SEED_STRATEGIES}
            areas={SEED_AREAS}
            owners={SEED_OWNERS}
            onOpenNewAction={() => handleOpenNewAction()}
            onOpenQuickUpdate={handleOpenQuickUpdate}
            onOpenEditAction={handleOpenEditAction}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}

        {/* KPIS TAB */}
        {activeTab === 'kpis' && (
          <KpiTracker
            kpis={kpis}
            strategies={SEED_STRATEGIES}
            onSaveKpi={handleSaveKpi}
            onAddKpi={handleAddKpi}
          />
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <TimelineView
            quarters={SEED_QUARTERS}
            actions={actions}
            onOpenQuickUpdate={handleOpenQuickUpdate}
            onOpenEditAction={handleOpenEditAction}
          />
        )}

        {/* OWNERS TAB */}
        {activeTab === 'owners' && (
          <OwnerAccountability
            owners={SEED_OWNERS}
            actions={actions}
            onSelectOwner={handleSelectOwner}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BARDO STRATEGY TRACKER • Generation 27.28</span>
          <span className="text-[11px] text-slate-600">AIESEC in Bardo • Real Action Plan Execution</span>
        </div>
      </footer>

      {/* QUICK UPDATE MODAL */}
      <QuickUpdateModal
        isOpen={isQuickUpdateOpen}
        onClose={() => setIsQuickUpdateOpen(false)}
        actions={actions}
        initialActionId={quickUpdateActionId}
        onSaveAction={handleSaveAction}
      />

      {/* EDIT / CREATE ACTION MODAL */}
      <ActionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        action={editingAction}
        strategies={SEED_STRATEGIES}
        areas={SEED_AREAS}
        kpis={kpis}
        owners={SEED_OWNERS}
        onSave={handleSaveAction}
        onDelete={handleDeleteAction}
      />

    </div>
  );
}

export default App;
