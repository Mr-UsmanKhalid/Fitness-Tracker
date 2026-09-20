import React, { useState } from 'react';
import { Sun, Moon, Monitor, Ruler, Bell, RotateCcw } from 'lucide-react';
import { getPreferences, savePreferences } from '../utils/preferences';
import { useTheme } from '../components/theme';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { toast } from '../utils/toast';

const THEME_OPTIONS = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
];

const NOTIFICATION_TOGGLES = [
  { key: 'email', label: 'Email notifications', description: 'Receive updates via email' },
  { key: 'push', label: 'Push notifications', description: 'Receive in-app alerts' },
  { key: 'workoutReminders', label: 'Workout reminders', description: 'Remind me to log workouts' },
  { key: 'mealReminders', label: 'Meal reminders', description: 'Remind me to log meals' },
];

/* Shared classes for the selectable option buttons (theme + units) */
const optionActive = 'border-lime-400 bg-lime-50 dark:bg-lime-400/10';
const optionIdle =
  'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
      checked ? 'bg-lime-400' : 'bg-gray-300 dark:bg-gray-700'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const Settings = () => {
  const [prefs, setPrefs] = useState(getPreferences());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // Single source of truth for the theme: the same state the navbar toggle uses
  const { theme, setTheme } = useTheme();

  const updatePrefs = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePreferences(next);
    toast.success('Preference saved.');
  };

  const updateNotification = (key) => {
    const next = {
      ...prefs,
      notifications: { ...prefs.notifications, [key]: !prefs.notifications[key] },
    };
    setPrefs(next);
    savePreferences(next);
  };

  const handleReset = () => {
    localStorage.removeItem('fittrack:preferences');
    const defaults = getPreferences();
    setPrefs(defaults);
    setTheme(defaults.theme);
    setShowResetConfirm(false);
    toast.info('Settings reset to defaults.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize how FitTrack looks and behaves for you.
        </p>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = theme === option.key;
            return (
              <button
                key={option.key}
                onClick={() => {
                  setTheme(option.key);
                  updatePrefs({ theme: option.key }); // keeps the saved preferences in step
                }}
                className={`flex flex-col items-center gap-2 py-4 rounded-lg border-2 transition-colors ${
                  active ? optionActive : optionIdle
                }`}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? 'text-lime-600 dark:text-lime-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    active
                      ? 'text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Units */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ruler size={16} className="text-gray-400 dark:text-gray-500" />
          <h3 className="text-sm font-semibold text-black dark:text-white">Units of Measurement</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updatePrefs({ units: 'metric' })}
            className={`py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              prefs.units === 'metric'
                ? `${optionActive} text-black dark:text-white`
                : `${optionIdle} text-gray-600 dark:text-gray-400`
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            onClick={() => updatePrefs({ units: 'imperial' })}
            className={`py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              prefs.units === 'imperial'
                ? `${optionActive} text-black dark:text-white`
                : `${optionIdle} text-gray-600 dark:text-gray-400`
            }`}
          >
            Imperial (lb, in)
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-gray-400 dark:text-gray-500" />
          <h3 className="text-sm font-semibold text-black dark:text-white">Notification Preferences</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {NOTIFICATION_TOGGLES.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">{toggle.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{toggle.description}</p>
              </div>
              <Toggle
                checked={prefs.notifications[toggle.key]}
                onChange={() => updateNotification(toggle.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <RotateCcw size={14} />
          Reset to defaults
        </button>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset settings?"
        message="This restores theme, units, and notification preferences to their defaults."
        confirmLabel="Reset"
        danger
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default Settings;