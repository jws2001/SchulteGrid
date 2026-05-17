'use client';

import type { GameRecord, GameMode } from '@/types';
import { formatTime } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface CompletionModalProps {
  record: GameRecord;
  isNewBest: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export function CompletionModal({ record, isNewBest, onRestart, onClose }: CompletionModalProps) {
  const t = useTranslations('game');
  const tCommon = useTranslations('common');

  const modeLabels: Record<GameMode, string> = {
    normal: t('modeNormal'),
    reverse: t('modeReverse'),
    colorInterference: t('modeColor'),
    dualColor: t('modeDual'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isNewBest && (
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold">
              {t('newBest')}
            </span>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          {t('completed')}
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t('mode')}</span>
            <span className="font-medium">{record.gridSize}×{record.gridSize} · {modeLabels[record.mode]}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t('time')}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{formatTime(record.totalTimeMs)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t('accuracy')}</span>
            <span className="font-medium">{(record.accuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t('avgPerCell')}</span>
            <span className="font-medium">{formatTime(record.avgTimePerCellMs)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {tCommon('close')}
          </button>
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('playAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}
