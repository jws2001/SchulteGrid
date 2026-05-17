export type GridSize = 3 | 4 | 5 | 6 | 7;

export type GameMode = 'normal' | 'reverse' | 'colorInterference' | 'dualColor';

export type GamePhase = 'idle' | 'playing' | 'completed';

export type CellState = 'idle' | 'correct' | 'wrong' | 'completed';

export interface GridCell {
  value: number;
  index: number;
  color?: string;
  group?: 'red' | 'blue';
}

export interface GameState {
  phase: GamePhase;
  gridSize: GridSize;
  mode: GameMode;
  cells: GridCell[];
  sequence: number[];
  currentIndex: number;
  totalClicks: number;
  correctClicks: number;
  completedIndices: Set<number>;
  startTime: number | null;
  endTime: number | null;
}

export interface GameRecord {
  id: string;
  date: string;
  gridSize: GridSize;
  mode: GameMode;
  totalTimeMs: number;
  accuracy: number;
  avgTimePerCellMs: number;
  totalClicks: number;
  correctClicks: number;
}

export interface PersonalBest {
  bestTimeMs: number;
  date: string;
  accuracy: number;
}

export interface PersonalBests {
  [key: string]: PersonalBest;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  lastGridSize: GridSize;
  lastMode: GameMode;
}

export interface TrainingStats {
  totalSessions: number;
  totalTimeMs: number;
}
