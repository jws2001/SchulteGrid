'use client';

import type { GridSize, GameMode } from '@/types';
import { GRID_SIZES } from '@/lib/constants';
import { useTranslations } from 'next-intl';

interface GameControlsProps {
  currentSize: GridSize;
  currentMode: GameMode;
  isPlaying: boolean;
  onSizeChange: (size: GridSize) => void;
  onModeChange: (mode: GameMode) => void;
  onRestart: () => void;
}

const MODES: GameMode[] = ['normal', 'reverse', 'colorInterference', 'dualColor'];

export function GameControls({ currentSize, currentMode, isPlaying, onSizeChange, onModeChange, onRestart }: GameControlsProps) {
  const t = useTranslations('game');

  const modeLabels: Record<GameMode, string> = {
    normal: t('modeNormal'),
    reverse: t('modeReverse'),
    colorInterference: t('modeColor'),
    dualColor: t('modeDual'),
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {GRID_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            disabled={isPlaying}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentSize === size
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {size}×{size}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            disabled={isPlaying}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentMode === mode
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-5 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors cursor-pointer"
        >
          {t('restart')}
        </button>
      </div>
    </div>
  );
}
