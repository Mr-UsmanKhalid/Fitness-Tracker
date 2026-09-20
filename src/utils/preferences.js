const STORAGE_KEY = 'fittrack:preferences';

const DEFAULTS = {
  theme: 'light', // 'light' | 'dark' | 'system'
  units: 'metric', // 'metric' | 'imperial'
  notifications: {
    email: true,
    push: true,
    workoutReminders: true,
    mealReminders: false,
  },
};

export const getPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
};

export const savePreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) - fail silently
  }
};

/**
 * Applies the theme to the document immediately. Call this on app load
 * and whenever the user changes the theme setting.
 * Assumes Tailwind's `class` dark mode strategy (darkMode: 'class' in
 * tailwind.config.js) - if your project uses the default 'media' strategy,
 * this won't do anything and you should switch to 'class'.
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  root.classList.toggle('dark', resolved === 'dark');
};

/** Convenience: kg <-> lb, cm <-> in, based on the saved unit preference. */
export const convertWeight = (value, toUnit) => {
  if (value == null) return value;
  return toUnit === 'imperial' ? value * 2.20462 : value / 2.20462;
};

export const convertLength = (value, toUnit) => {
  if (value == null) return value;
  return toUnit === 'imperial' ? value / 2.54 : value * 2.54;
};