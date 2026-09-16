import { createContext, useContext, type PropsWithChildren } from 'react';
import { appTheme, type AppTheme } from './tokens';

const ThemeContext = createContext<AppTheme>(appTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={appTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

export type Theme = AppTheme;
export type { AppTheme };
