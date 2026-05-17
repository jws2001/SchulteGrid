'use client';

import { useReducer, useCallback } from 'react';
import type { GridSize, GameMode, GameState, GameRecord } from '@/types';
import { generateGrid, generateSequence } from '@/lib/grid';
import { addRecord, updatePersonalBest } from '@/lib/storage';
import { generateId } from '@/lib/utils';

type GameAction =
  | { type: 'CLICK_CELL'; index: number }
  | { type: 'RESTART' }
  | { type: 'CHANGE_SIZE'; size: GridSize }
  | { type: 'CHANGE_MODE'; mode: GameMode }
  | { type: 'SET_END_TIME'; time: number };

function createInitialState(size: GridSize, mode: GameMode): GameState {
  const cells = generateGrid(size, mode);
  const sequence = generateSequence(cells, mode);
  return {
    phase: 'idle',
    gridSize: size,
    mode,
    cells,
    sequence,
    currentIndex: 0,
    totalClicks: 0,
    correctClicks: 0,
    completedIndices: new Set(),
    startTime: null,
    endTime: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CLICK_CELL': {
      const { index } = action;
      const isFirstClick = state.phase === 'idle';
      const now = performance.now();

      const expectedIndex = state.sequence[state.currentIndex];
      const isCorrect = index === expectedIndex;

      if (!isCorrect) {
        return {
          ...state,
          phase: isFirstClick ? 'playing' : state.phase,
          startTime: isFirstClick ? now : state.startTime,
          totalClicks: state.totalClicks + 1,
        };
      }

      const newCompleted = new Set(state.completedIndices);
      newCompleted.add(index);
      const newIndex = state.currentIndex + 1;
      const isComplete = newIndex >= state.sequence.length;

      return {
        ...state,
        phase: isComplete ? 'completed' : 'playing',
        startTime: isFirstClick ? now : state.startTime,
        endTime: isComplete ? now : null,
        currentIndex: newIndex,
        totalClicks: state.totalClicks + 1,
        correctClicks: state.correctClicks + 1,
        completedIndices: newCompleted,
      };
    }

    case 'RESTART': {
      return createInitialState(state.gridSize, state.mode);
    }

    case 'CHANGE_SIZE': {
      return createInitialState(action.size, state.mode);
    }

    case 'CHANGE_MODE': {
      return createInitialState(state.gridSize, action.mode);
    }

    case 'SET_END_TIME': {
      return { ...state, endTime: action.time };
    }

    default:
      return state;
  }
}

export function useGame(initialSize: GridSize, initialMode: GameMode) {
  const [state, dispatch] = useReducer(gameReducer, { size: initialSize, mode: initialMode },
    ({ size, mode }) => createInitialState(size, mode)
  );

  const clickCell = useCallback((index: number) => {
    dispatch({ type: 'CLICK_CELL', index });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const changeSize = useCallback((size: GridSize) => {
    dispatch({ type: 'CHANGE_SIZE', size });
  }, []);

  const changeMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'CHANGE_MODE', mode });
  }, []);

  const saveRecord = useCallback((): { record: GameRecord; isNewBest: boolean } | null => {
    if (state.phase !== 'completed' || !state.startTime || !state.endTime) return null;

    const totalTimeMs = state.endTime - state.startTime;
    const record: GameRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      gridSize: state.gridSize,
      mode: state.mode,
      totalTimeMs,
      accuracy: state.correctClicks / state.totalClicks,
      avgTimePerCellMs: totalTimeMs / state.sequence.length,
      totalClicks: state.totalClicks,
      correctClicks: state.correctClicks,
    };

    addRecord(record);
    const isNewBest = updatePersonalBest(record);
    return { record, isNewBest };
  }, [state]);

  return {
    state,
    clickCell,
    restart,
    changeSize,
    changeMode,
    saveRecord,
    isRunning: state.phase === 'playing',
  };
}
