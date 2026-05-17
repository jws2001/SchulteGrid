import type { GridSize, GridCell, GameMode } from '@/types';
import { INTERFERENCE_COLORS, DUAL_COLOR_RED, DUAL_COLOR_BLUE } from './constants';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateGrid(size: GridSize, mode: GameMode): GridCell[] {
  const total = size * size;

  if (mode === 'dualColor') {
    const half = Math.floor(total / 2);
    const redValues = Array.from({ length: half }, (_, i) => i + 1);
    const blueValues = Array.from({ length: total - half }, (_, i) => i + 1);

    const cells: GridCell[] = [
      ...redValues.map((v) => ({ value: v, index: 0, color: DUAL_COLOR_RED, group: 'red' as const })),
      ...blueValues.map((v) => ({ value: v, index: 0, color: DUAL_COLOR_BLUE, group: 'blue' as const })),
    ];

    const shuffled = shuffle(cells);
    return shuffled.map((cell, i) => ({ ...cell, index: i }));
  }

  const values = shuffle(Array.from({ length: total }, (_, i) => i + 1));

  return values.map((value, index) => {
    const cell: GridCell = { value, index };

    if (mode === 'colorInterference') {
      cell.color = INTERFERENCE_COLORS[Math.floor(Math.random() * INTERFERENCE_COLORS.length)];
    }

    return cell;
  });
}

export function generateSequence(cells: GridCell[], mode: GameMode): number[] {
  if (mode === 'dualColor') {
    const redCells = cells.filter((c) => c.group === 'red').sort((a, b) => a.value - b.value);
    const blueCells = cells.filter((c) => c.group === 'blue').sort((a, b) => a.value - b.value);

    const sequence: number[] = [];
    const maxLen = Math.max(redCells.length, blueCells.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < redCells.length) sequence.push(redCells[i].index);
      if (i < blueCells.length) sequence.push(blueCells[i].index);
    }
    return sequence;
  }

  const sorted = [...cells].sort((a, b) =>
    mode === 'reverse' ? b.value - a.value : a.value - b.value
  );
  return sorted.map((c) => c.index);
}
