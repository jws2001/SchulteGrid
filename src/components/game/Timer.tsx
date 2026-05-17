'use client';

import { formatTime } from '@/lib/utils';

interface TimerProps {
  elapsedMs: number;
  isRunning: boolean;
}

export function Timer({ elapsedMs, isRunning }: TimerProps) {
  return (
    <div className="text-center">
      <div className={`text-3xl md:text-4xl font-mono font-bold tabular-nums ${isRunning ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
        {formatTime(elapsedMs)}
      </div>
    </div>
  );
}
