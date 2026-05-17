'use client';

import type { GridSize, GameMode, GridCell as GridCellType } from '@/types';
import { GridCell } from './GridCell';
import { useTranslations } from 'next-intl';

interface GridProps {
  cells: GridCellType[];
  size: GridSize;
  mode: GameMode;
  completedIndices: Set<number>;
  onCellClick: (index: number) => void;
  lastWrongIndex: number | null;
}

export function Grid({ cells, size, mode, completedIndices, onCellClick, lastWrongIndex }: GridProps) {
  const t = useTranslations('game');

  return (
    <div
      className="grid gap-1.5 md:gap-2 w-full max-w-[min(90vw,500px)] mx-auto"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.map((cell) => {
        let state: 'idle' | 'correct' | 'wrong' | 'completed' = 'idle';
        if (completedIndices.has(cell.index)) state = 'completed';
        else if (lastWrongIndex === cell.index) state = 'wrong';

        let label: string | undefined;
        if (mode === 'dualColor' && cell.group) {
          label = `${cell.group === 'red' ? t('red') : t('blue')}${cell.value}`;
        }

        return (
          <GridCell
            key={cell.index}
            value={cell.value}
            color={cell.color}
            state={state}
            gridSize={size}
            onClick={() => onCellClick(cell.index)}
            label={label}
          />
        );
      })}
    </div>
  );
}
