'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GridSize, GameMode, GameRecord } from '@/types';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { useSettings } from '@/contexts/SettingsContext';
import { Grid } from '@/components/game/Grid';
import { Timer } from '@/components/game/Timer';
import { GameControls } from '@/components/game/GameControls';
import { CompletionModal } from '@/components/game/CompletionModal';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('game');
  const { settings } = useSettings();
  const { state, clickCell, restart, changeSize, changeMode, saveRecord, isRunning } = useGame(
    settings.lastGridSize,
    settings.lastMode
  );
  const { elapsedMs, reset: resetTimer } = useTimer(isRunning);
  const { playCorrect, playWrong, playComplete } = useSound();
  const [lastWrongIndex, setLastWrongIndex] = useState<number | null>(null);
  const [completionData, setCompletionData] = useState<{ record: GameRecord; isNewBest: boolean } | null>(null);
  const prevPhaseRef = useRef(state.phase);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevPhaseRef.current !== 'completed' && state.phase === 'completed') {
      const result = saveRecord();
      if (result) {
        setCompletionData(result);
        if (settings.soundEnabled) playComplete();
      }
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, saveRecord, settings.soundEnabled, playComplete]);

  const handleCellClick = useCallback((index: number) => {
    if (state.phase === 'completed') return;

    const expectedIndex = state.sequence[state.currentIndex];
    const isCorrect = index === expectedIndex;

    if (isCorrect) {
      if (settings.soundEnabled) playCorrect();
      setLastWrongIndex(null);
    } else {
      if (settings.soundEnabled) playWrong();
      setLastWrongIndex(index);
      setTimeout(() => setLastWrongIndex((prev) => (prev === index ? null : prev)), 300);
    }

    clickCell(index);
  }, [state.phase, state.sequence, state.currentIndex, clickCell, settings.soundEnabled, playCorrect, playWrong]);

  const handleRestart = useCallback(() => {
    restart();
    resetTimer();
    setCompletionData(null);
    setLastWrongIndex(null);
  }, [restart, resetTimer]);

  const handleSizeChange = useCallback((size: GridSize) => {
    changeSize(size);
    resetTimer();
    setCompletionData(null);
    setLastWrongIndex(null);
  }, [changeSize, resetTimer]);

  const handleModeChange = useCallback((mode: GameMode) => {
    changeMode(mode);
    resetTimer();
    setCompletionData(null);
    setLastWrongIndex(null);
  }, [changeMode, resetTimer]);

  const progress = state.sequence.length > 0
    ? Math.round((state.currentIndex / state.sequence.length) * 100)
    : 0;

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
        <Timer elapsedMs={0} isRunning={false} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      <Timer elapsedMs={state.phase === 'completed' && state.startTime && state.endTime ? state.endTime - state.startTime : elapsedMs} isRunning={isRunning} />

      {state.phase !== 'idle' && (
        <div className="w-full max-w-[500px]">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>{t('progress')}</span>
            <span>{state.currentIndex}/{state.sequence.length}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {state.phase === 'idle' && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('startHint', { start: '1' })}{state.mode === 'reverse' ? t('startHintReverse') : ''}
        </p>
      )}

      <Grid
        cells={state.cells}
        size={state.gridSize}
        mode={state.mode}
        completedIndices={state.completedIndices}
        onCellClick={handleCellClick}
        lastWrongIndex={lastWrongIndex}
      />

      <GameControls
        currentSize={state.gridSize}
        currentMode={state.mode}
        isPlaying={isRunning}
        onSizeChange={handleSizeChange}
        onModeChange={handleModeChange}
        onRestart={handleRestart}
      />

      {completionData && (
        <CompletionModal
          record={completionData.record}
          isNewBest={completionData.isNewBest}
          onRestart={handleRestart}
          onClose={() => setCompletionData(null)}
        />
      )}
    </div>
  );
}
