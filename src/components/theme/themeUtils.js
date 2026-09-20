/* Shared theme helpers (no React in here so index.html / tests can reuse the logic) */

export const THEMES = ['light', 'dark', 'system'];
export const DEFAULT_THEME = 'system';

/* Own key, so the theme never depends on the shape of the preferences object */
export const THEME_STORAGE_KEY = 'fittrack:theme';
/* Older key written by Settings/utils/preferences. Read once as a fallback. */
export const LEGACY_PREFS_KEY = 'fittrack:preferences';

export const isValidTheme = (value) => THEMES.includes(value);

export const getSystemPrefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/* 'system' -> 'light' | 'dark' depending on the OS setting */
export const resolveTheme = (theme, systemDark = getSystemPrefersDark()) => {
  if (theme === 'system') return systemDark ? 'dark' : 'light';
  return theme === 'dark' ? 'dark' : 'light';
};

export const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidTheme(stored)) return stored;

    const legacy = JSON.parse(localStorage.getItem(LEGACY_PREFS_KEY) || 'null');
    if (legacy && isValidTheme(legacy.theme)) return legacy.theme;
  } catch {
    /* storage blocked or corrupt JSON: fall through to default */
  }
  return DEFAULT_THEME;
};

export const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore (private mode / quota) */
  }
};

/* Puts the `dark` class on <html> (what Tailwind's dark: variant reads)
   and tells the browser to draw native controls/scrollbars to match. */
export const applyResolvedTheme = (resolved) => {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
};