import type { ActionItem, KPI } from '../types';
import { SEED_ACTIONS, SEED_KPIS } from '../data/seedData';

const ACTIONS_STORAGE_KEY = 'bardo_strategy_actions_v1';
const KPIS_STORAGE_KEY = 'bardo_strategy_kpis_v1';

export function loadActions(): ActionItem[] {
  try {
    const data = localStorage.getItem(ACTIONS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load actions from localStorage', err);
  }
  // Fallback to seed data
  saveActions(SEED_ACTIONS);
  return SEED_ACTIONS;
}

export function saveActions(actions: ActionItem[]): void {
  try {
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));
  } catch (err) {
    console.error('Failed to save actions to localStorage', err);
  }
}

export function loadKPIs(): KPI[] {
  try {
    const data = localStorage.getItem(KPIS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load KPIs from localStorage', err);
  }
  saveKPIs(SEED_KPIS);
  return SEED_KPIS;
}

export function saveKPIs(kpis: KPI[]): void {
  try {
    localStorage.setItem(KPIS_STORAGE_KEY, JSON.stringify(kpis));
  } catch (err) {
    console.error('Failed to save KPIs to localStorage', err);
  }
}

export function resetToSeedData(): { actions: ActionItem[]; kpis: KPI[] } {
  localStorage.removeItem(ACTIONS_STORAGE_KEY);
  localStorage.removeItem(KPIS_STORAGE_KEY);
  saveActions(SEED_ACTIONS);
  saveKPIs(SEED_KPIS);
  return { actions: SEED_ACTIONS, kpis: SEED_KPIS };
}
