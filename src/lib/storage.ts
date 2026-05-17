import type { GameRecord, PersonalBest, PersonalBests, AppSettings, TrainingStats } from '@/types';
import { STORAGE_KEYS, MAX_RECORDS, DEFAULT_SETTINGS } from './constants';

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getRecords(): GameRecord[] {
  return getItem<GameRecord[]>(STORAGE_KEYS.records, []);
}

export function addRecord(record: GameRecord): void {
  const records = getRecords();
  records.unshift(record);
  if (records.length > MAX_RECORDS) records.length = MAX_RECORDS;
  setItem(STORAGE_KEYS.records, records);

  const stats = getTrainingStats();
  stats.totalSessions += 1;
  stats.totalTimeMs += record.totalTimeMs;
  setItem(STORAGE_KEYS.trainingStats, stats);
}

export function getPersonalBests(): PersonalBests {
  return getItem<PersonalBests>(STORAGE_KEYS.personalBests, {});
}

export function updatePersonalBest(record: GameRecord): boolean {
  const bests = getPersonalBests();
  const key = `${record.gridSize}_${record.mode}`;
  const current = bests[key];

  if (!current || record.totalTimeMs < current.bestTimeMs) {
    bests[key] = {
      bestTimeMs: record.totalTimeMs,
      date: record.date,
      accuracy: record.accuracy,
    };
    setItem(STORAGE_KEYS.personalBests, bests);
    return true;
  }
  return false;
}

export function getSettings(): AppSettings {
  return getItem<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = getSettings();
  setItem(STORAGE_KEYS.settings, { ...current, ...settings });
}

export function getTrainingStats(): TrainingStats {
  return getItem<TrainingStats>(STORAGE_KEYS.trainingStats, { totalSessions: 0, totalTimeMs: 0 });
}

export function getStreakDays(): number {
  const records = getRecords();
  if (records.length === 0) return 0;

  const days = new Set(records.map((r) => r.date.slice(0, 10)));
  const sortedDays = [...days].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  if (sortedDays[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (sortedDays[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
