import { createContext } from 'react';

/*
  value shape:
  {
    theme: 'light' | 'dark' | 'system',   // what the user picked
    resolvedTheme: 'light' | 'dark',      // what is actually showing
    setTheme: (theme) => void,
  }
*/
const ThemeContext = createContext(null);

export default ThemeContext;