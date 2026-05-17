'use client';

import { memo, useState, useEffect } from 'react';
import type { GridSize, CellState } from '@/types';

interface GridCellProps {
  value: number;
  color?: string;
  state: CellState;
  gridSize: GridSize;
  onClick: () => void;
  label?: string;
}

export const GridCell = memo(function GridCell({ value, color, state, gridSize, onClick, label }: GridCellProps) {
  const [animating, setAnimating] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (state === 'correct') {
      setAnimating('correct');
      const t = setTimeout(() => setAnimating(null), 300);
      return () => clearTimeout(t);
    }
  }, [state]);

  const handleClick = () => {
    if (state === 'completed') return;
    onClick();
  };

  const sizeClass = {
    3: 'text-3xl md:text-4xl',
    4: 'text-2xl md:text-3xl',
    5: 'text-xl md:text-2xl',
    6: 'text-lg md:text-xl',
    7: 'text-base md:text-lg',
  }[gridSize];

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex items-center justify-center
        rounded-lg font-bold select-none
        transition-all duration-150 cursor-pointer
        min-w-[44px] min-h-[44px] aspect-square
        ${sizeClass}
        ${'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600'}
        ${state === 'completed'
          ? 'text-gray-900 dark:text-gray-100'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 active:scale-95'
        }
        ${animating === 'correct' ? 'animate-pop bg-green-50 dark:bg-green-900/20' : ''}
        ${animating === 'wrong' ? 'animate-shake bg-red-50 dark:bg-red-900/20' : ''}
      `}
      style={color ? { color } : undefined}
      disabled={state === 'completed'}
      aria-label={label || `${value}`}
    >
      {value}
    </button>
  );
});
