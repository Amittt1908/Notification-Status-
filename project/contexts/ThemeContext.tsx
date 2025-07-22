import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#F1F5F9',
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}