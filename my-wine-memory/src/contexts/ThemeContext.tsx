import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme, ThemeContextType } from './ThemeTypes';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // システムのダークモード設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // テーマが変更されたらローカルストレージに保存
    localStorage.setItem('theme', theme);
    
    // HTMLのdata-theme属性を更新
    document.documentElement.setAttribute('data-theme', theme);
    
    // bodyのクラスを更新（既存のCSSとの互換性のため）
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

