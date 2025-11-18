import React, { createContext, useEffect } from 'react';
import type { ReactNode } from 'react';

// Dark mode only - simplified theme context
export interface ThemeContextType {
  theme: 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Force dark theme on mount
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.className = 'dark-theme';

    // Clean up any light theme artifacts from localStorage
    localStorage.removeItem('theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
