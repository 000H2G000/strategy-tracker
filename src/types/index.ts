export type StrategyId = 'membership' | 'exchange' | 'external';

export type StatusType = 'NOT STARTED' | 'IN PROGRESS' | 'BLOCKED' | 'DONE';

export type QuarterId = 'Q0' | 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Strategy {
  id: StrategyId;
  name: string;
  tagline: string;
  color: string;
  accentClass: string;
  badgeBg: string;
  why: string;
  how: string;
  strategicAreas: string[];
}

export interface StrategicArea {
  id: string;
  strategyId: StrategyId;
  name: string;
  description?: string;
  initiatives: string[];
}

export interface Initiative {
  id: string;
  areaId: string;
  strategyId: StrategyId;
  title: string;
  description?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  strategyId: StrategyId;
  strategicAreaId: string;
  initiativeId?: string;
  owner: string;
  quarterId: QuarterId;
  startDate?: string;
  deadline: string;
  status: StatusType;
  customProgress?: number; // Optional override; otherwise calculated from status
  kpiId?: string;
  targetMetric?: string;
  currentMetricValue?: string;
  notes?: string;
  evidenceUrl?: string;
  lastUpdated: string;
  createdAt: string;
}

export type KpiUnit = '%' | '#' | 'TND' | 'Boolean' | 'Custom';

export interface KPI {
  id: string;
  name: string;
  strategyId: StrategyId;
  strategicAreaId?: string;
  owner: string;
  currentValue: number;
  targetValue: number;
  unit: KpiUnit;
  unitLabel?: string;
  higherIsBetter: boolean;
  lastUpdated: string;
}

export interface QuarterInfo {
  id: QuarterId;
  name: string;
  period: string;
  isCurrent?: boolean;
  events: string[];
}

export interface AlertItem {
  id: string;
  type: 'OVERDUE' | 'AT_RISK' | 'NO_UPDATE' | 'UNASSIGNED' | 'LOW_PROGRESS';
  severity: 'high' | 'medium' | 'low';
  title: string;
  subtitle: string;
  actionId?: string;
  strategyId?: StrategyId;
  dateInfo?: string;
}

export interface OwnerStats {
  owner: string;
  totalActions: number;
  completedActions: number;
  inProgressActions: number;
  blockedActions: number;
  overdueActions: number;
  atRiskActions: number;
  completionPercentage: number;
}
