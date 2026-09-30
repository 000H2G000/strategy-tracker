import type { ActionItem, KPI, StrategyId, StrategicArea, OwnerStats, AlertItem } from '../types';

export const CURRENT_REF_DATE = new Date('2026-09-30');

/**
 * Calculates progress for an individual action item.
 */
export function getActionProgress(action: ActionItem): number {
  if (typeof action.customProgress === 'number') {
    return Math.min(100, Math.max(0, action.customProgress));
  }
  switch (action.status) {
    case 'DONE':
      return 100;
    case 'IN PROGRESS':
      return 50;
    case 'BLOCKED':
      return 25;
    case 'NOT STARTED':
    default:
      return 0;
  }
}

/**
 * Calculates average progress for a list of actions.
 */
export function calculateAverageProgress(actions: ActionItem[]): number {
  if (!actions || actions.length === 0) return 0;
  const total = actions.reduce((sum, act) => sum + getActionProgress(act), 0);
  return Math.round((total / actions.length) * 10) / 10;
}

/**
 * Calculates strategic area progress based on its actions.
 */
export function getAreaProgress(areaId: string, actions: ActionItem[]): number {
  const areaActions = actions.filter((act) => act.strategicAreaId === areaId);
  return calculateAverageProgress(areaActions);
}

/**
 * Calculates strategy progress based on its actions.
 */
export function getStrategyProgress(strategyId: StrategyId, actions: ActionItem[]): number {
  const strategyActions = actions.filter((act) => act.strategyId === strategyId);
  return calculateAverageProgress(strategyActions);
}

/**
 * Calculates overall strategy implementation: average of all 3 strategy progress percentages.
 */
export function getOverallImplementation(actions: ActionItem[]): number {
  const membershipProgress = getStrategyProgress('membership', actions);
  const exchangeProgress = getStrategyProgress('exchange', actions);
  const externalProgress = getStrategyProgress('external', actions);

  const avg = (membershipProgress + exchangeProgress + externalProgress) / 3;
  return Math.round(avg * 10) / 10;
}

/**
 * Calculates KPI achievement percentage.
 */
export function getKpiAchievement(kpi: KPI): { rawPercent: number; displayPercent: number; formatted: string } {
  if (!kpi.targetValue || kpi.targetValue === 0) {
    return { rawPercent: 0, displayPercent: 0, formatted: '0%' };
  }

  let ratio = kpi.currentValue / kpi.targetValue;
  if (!kpi.higherIsBetter) {
    ratio = kpi.targetValue / kpi.currentValue;
  }

  const rawPercent = Math.round(ratio * 1000) / 10;
  const displayPercent = Math.min(100, Math.max(0, rawPercent));
  
  return {
    rawPercent,
    displayPercent,
    formatted: `${rawPercent}%`,
  };
}

/**
 * Checks if a date string is overdue relative to reference date.
 */
export function isActionOverdue(action: ActionItem, refDate: Date = CURRENT_REF_DATE): boolean {
  if (action.status === 'DONE') return false;
  const deadlineDate = new Date(action.deadline);
  return deadlineDate < refDate;
}

/**
 * Checks if action is due within 7 days relative to reference date.
 */
export function isActionAtRisk(action: ActionItem, refDate: Date = CURRENT_REF_DATE): boolean {
  if (action.status === 'DONE' || isActionOverdue(action, refDate)) return false;
  const deadlineDate = new Date(action.deadline);
  const sevenDaysLater = new Date(refDate);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  return deadlineDate >= refDate && deadlineDate <= sevenDaysLater;
}

/**
 * Checks if action has no update for > 14 days.
 */
export function isActionNoUpdate(action: ActionItem, refDate: Date = CURRENT_REF_DATE): boolean {
  if (action.status === 'DONE') return false;
  const lastUpdateDate = new Date(action.lastUpdated);
  const fourteenDaysAgo = new Date(refDate);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return lastUpdateDate < fourteenDaysAgo;
}

/**
 * Returns alert info for an action.
 */
export function getActionAlert(action: ActionItem, refDate: Date = CURRENT_REF_DATE): 'OVERDUE' | 'AT_RISK' | 'NO_UPDATE' | 'ON_TRACK' {
  if (action.status === 'DONE') return 'ON_TRACK';
  if (isActionOverdue(action, refDate)) return 'OVERDUE';
  if (isActionAtRisk(action, refDate)) return 'AT_RISK';
  if (isActionNoUpdate(action, refDate)) return 'NO_UPDATE';
  return 'ON_TRACK';
}

/**
 * Computes all items for the ATTENTION NEEDED dashboard section.
 */
export function getAttentionNeededItems(actions: ActionItem[], areas: StrategicArea[], refDate: Date = CURRENT_REF_DATE): AlertItem[] {
  const alerts: AlertItem[] = [];

  // 1. Overdue actions
  actions.forEach((act) => {
    if (isActionOverdue(act, refDate)) {
      const deadlineDate = new Date(act.deadline);
      const diffDays = Math.ceil((refDate.getTime() - deadlineDate.getTime()) / (1000 * 3600 * 24));
      alerts.push({
        id: `alert-overdue-${act.id}`,
        type: 'OVERDUE',
        severity: 'high',
        title: act.title,
        subtitle: `Overdue by ${diffDays} day${diffDays > 1 ? 's' : ''} • Owner: ${act.owner}`,
        actionId: act.id,
        strategyId: act.strategyId,
        dateInfo: act.deadline,
      });
    }
  });

  // 2. Unassigned actions
  actions.forEach((act) => {
    if (!act.owner || act.owner.trim() === '' || act.owner === 'Unassigned') {
      alerts.push({
        id: `alert-unassigned-${act.id}`,
        type: 'UNASSIGNED',
        severity: 'high',
        title: act.title,
        subtitle: `No owner assigned! Strategy: ${act.strategyId.toUpperCase()}`,
        actionId: act.id,
        strategyId: act.strategyId,
      });
    }
  });

  // 3. Actions due within 7 days
  actions.forEach((act) => {
    if (isActionAtRisk(act, refDate)) {
      const deadlineDate = new Date(act.deadline);
      const diffDays = Math.ceil((deadlineDate.getTime() - refDate.getTime()) / (1000 * 3600 * 24));
      alerts.push({
        id: `alert-risk-${act.id}`,
        type: 'AT_RISK',
        severity: 'medium',
        title: act.title,
        subtitle: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'} • Owner: ${act.owner}`,
        actionId: act.id,
        strategyId: act.strategyId,
        dateInfo: act.deadline,
      });
    }
  });

  // 4. Stale update (> 14 days)
  actions.forEach((act) => {
    if (isActionNoUpdate(act, refDate) && !isActionOverdue(act, refDate)) {
      alerts.push({
        id: `alert-noupdate-${act.id}`,
        type: 'NO_UPDATE',
        severity: 'medium',
        title: act.title,
        subtitle: `No update recorded in over 14 days • Last updated ${act.lastUpdated}`,
        actionId: act.id,
        strategyId: act.strategyId,
      });
    }
  });

  // 5. Low progress strategic areas (< 40%)
  areas.forEach((area) => {
    const prog = getAreaProgress(area.id, actions);
    if (prog < 40) {
      alerts.push({
        id: `alert-lowarea-${area.id}`,
        type: 'LOW_PROGRESS',
        severity: 'low',
        title: `Low Progress in "${area.name}"`,
        subtitle: `Current progress is only ${prog}%`,
        strategyId: area.strategyId,
      });
    }
  });

  return alerts;
}

/**
 * Calculates owner stats for accountability dashboard.
 */
export function getOwnerStatistics(ownerName: string, actions: ActionItem[], refDate: Date = CURRENT_REF_DATE): OwnerStats {
  const ownerActions = actions.filter((act) => act.owner.toLowerCase() === ownerName.toLowerCase());
  const total = ownerActions.length;
  
  if (total === 0) {
    return {
      owner: ownerName,
      totalActions: 0,
      completedActions: 0,
      inProgressActions: 0,
      blockedActions: 0,
      overdueActions: 0,
      atRiskActions: 0,
      completionPercentage: 0,
    };
  }

  const completed = ownerActions.filter((act) => act.status === 'DONE').length;
  const inProgress = ownerActions.filter((act) => act.status === 'IN PROGRESS').length;
  const blocked = ownerActions.filter((act) => act.status === 'BLOCKED').length;
  const overdue = ownerActions.filter((act) => isActionOverdue(act, refDate)).length;
  const atRisk = ownerActions.filter((act) => isActionAtRisk(act, refDate)).length;

  const pct = Math.round((completed / total) * 100);

  return {
    owner: ownerName,
    totalActions: total,
    completedActions: completed,
    inProgressActions: inProgress,
    blockedActions: blocked,
    overdueActions: overdue,
    atRiskActions: atRisk,
    completionPercentage: pct,
  };
}
