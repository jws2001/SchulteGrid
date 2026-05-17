'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { clearAllData } from '@/lib/storage';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = () => {
    clearAllData();
    setShowConfirm(false);
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h2>

      <div className="space-y-4">
        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-100">{t('darkMode')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('darkModeDesc')}</div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  theme === 'dark' ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="font-medium text-gray-800 dark:text-gray-100 mb-3">{t('fontSize')}</div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  settings.fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size === 'small' ? t('fontSmall') : size === 'medium' ? t('fontMedium') : t('fontLarge')}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-100">{t('sound')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('soundDesc')}</div>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.soundEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-100">{t('clearData')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('clearDataDesc')}</div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              {t('clear')}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{t('confirmClear')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('confirmClearDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium cursor-pointer"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium cursor-pointer"
              >
                {t('confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
