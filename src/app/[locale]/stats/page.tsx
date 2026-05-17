'use client';

import { useState, useEffect } from 'react';
import type { GameRecord, GridSize, GameMode } from '@/types';
import { getRecords, getPersonalBests, getTrainingStats, getStreakDays } from '@/lib/storage';
import { formatTime } from '@/lib/utils';
import { GRID_SIZES } from '@/lib/constants';
import { useTranslations, useLocale } from 'next-intl';

export default function StatsPage() {
  const t = useTranslations('stats');
  const tGame = useTranslations('game');
  const locale = useLocale();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBests, setPersonalBests] = useState<Record<string, { bestTimeMs: number; date: string }>>({});
  const [filterSize, setFilterSize] = useState<GridSize | 'all'>('all');

  useEffect(() => {
    setRecords(getRecords());
    const stats = getTrainingStats();
    setTotalSessions(stats.totalSessions);
    setTotalTime(stats.totalTimeMs);
    setStreak(getStreakDays());
    setPersonalBests(getPersonalBests());
  }, []);

  const filteredRecords = filterSize === 'all'
    ? records
    : records.filter((r) => r.gridSize === filterSize);

  const recentRecords = filteredRecords.slice(0, 50);

  const gameModeLabel = (mode: GameMode) => {
    const labels: Record<GameMode, string> = {
      normal: tGame('modeNormal'),
      reverse: tGame('modeReverse'),
      colorInterference: tGame('modeColor'),
      dualColor: tGame('modeDual'),
    };
    return labels[mode];
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h2>

      {/* Overview cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('totalSessions')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalTime > 3600000 ? `${(totalTime / 3600000).toFixed(1)}h` : `${Math.round(totalTime / 60000)}m`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('totalTime')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('streak')}</div>
        </div>
      </div>

      {/* Personal Bests */}
      {Object.keys(personalBests).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('personalBest')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(personalBests).map(([key, best]) => {
              const [size, mode] = key.split('_') as [string, GameMode];
              return (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {size}×{size} · {gameModeLabel(mode)}
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatTime(best.bestTimeMs)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend */}
      {records.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">{t('trend')}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <SimpleTrendChart records={records.slice(0, 30)} earliestLabel={t('earliest')} latestLabel={t('latest')} />
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('history')}</h3>
          <select
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value === 'all' ? 'all' : Number(e.target.value) as GridSize)}
            className="text-sm bg-gray-100 dark:bg-gray-700 border-none rounded-md px-2 py-1 text-gray-700 dark:text-gray-300"
          >
            <option value="all">{t('all')}</option>
            {GRID_SIZES.map((s) => (
              <option key={s} value={s}>{s}×{s}</option>
            ))}
          </select>
        </div>

        {recentRecords.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">{t('noRecords')}</p>
        ) : (
          <div className="space-y-2">
            {recentRecords.map((r) => (
              <div key={r.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {r.gridSize}×{r.gridSize} · {gameModeLabel(r.mode)}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')} {new Date(r.date).toLocaleTimeString(locale === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800 dark:text-gray-100">{formatTime(r.totalTimeMs)}</div>
                  <div className="text-xs text-gray-400">{(r.accuracy * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleTrendChart({ records, earliestLabel, latestLabel }: { records: GameRecord[]; earliestLabel: string; latestLabel: string }) {
  if (records.length < 2) return null;

  const data = [...records].reverse();
  const times = data.map((r) => r.totalTimeMs / 1000);
  const max = Math.max(...times);
  const min = Math.min(...times);
  const range = max - min || 1;

  const width = 100;
  const height = 40;
  const points = times.map((t, i) => {
    const x = (i / (times.length - 1)) * width;
    const y = height - ((t - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          className="text-blue-500"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{earliestLabel}</span>
        <span>{latestLabel}</span>
      </div>
    </div>
  );
}
