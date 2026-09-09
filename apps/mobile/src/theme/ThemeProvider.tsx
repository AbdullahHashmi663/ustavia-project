import { createContext, useContext, type PropsWithChildren } from 'react';
import { theme as tokens, type Theme } from '@ustavia/shared';

const ThemeContext = createContext<Theme>(tokens);

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
