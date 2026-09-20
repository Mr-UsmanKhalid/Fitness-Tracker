import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import ThemeContext from './ThemeContext';
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  getStoredTheme,
  getSystemPrefersDark,
  isValidTheme,
  resolveTheme,
  storeTheme,
} from './themeUtils';

const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  const resolvedTheme = resolveTheme(theme, systemDark);

  /* Keep <html class="dark"> in sync before the browser paints */
  useLayoutEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  /* Follow the OS setting live (matters when theme === 'system') */
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    setSystemDark(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  /* Keep other open tabs in sync */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_STORAGE_KEY && isValidTheme(e.newValue)) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) return;
    setThemeState(next);
    storeTheme(next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;