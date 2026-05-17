import type { GridSize, GameMode } from '@/types';

export const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7];

export const INTERFERENCE_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

export const DUAL_COLOR_RED = '#ef4444';
export const DUAL_COLOR_BLUE = '#3b82f6';

export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  fontSize: 'medium' as const,
  soundEnabled: true,
  lastGridSize: 5 as GridSize,
  lastMode: 'normal' as GameMode,
};

export const STORAGE_KEYS = {
  records: 'schulte_records',
  personalBests: 'schulte_personal_bests',
  settings: 'schulte_settings',
  trainingStats: 'schulte_training_stats',
};

export const MAX_RECORDS = 500;
