import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import useTheme from './useTheme';

const OPTIONS = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
];

/**
 * variant="segmented"  three buttons (Light / Dark / System), good for menus and pages
 * variant="icon"       one button that flips between light and dark (shows the icon of
 *                      the mode you will switch TO). Styled like the header buttons in
 *                      Layout. "System" stays available in the segmented control / Settings.
 */
const ThemeToggle = ({ variant = 'segmented', className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (variant === 'icon') {
    const isDark = resolvedTheme === 'dark';
    const Icon = isDark ? Sun : Moon;
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`p-2 rounded-lg text-white hover:text-lime-400 hover:bg-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${className}`}
        title={label}
        aria-label={label}
      >
        <Icon size={20} />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = theme === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              active
                ? 'bg-lime-400 text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Icon size={14} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;