import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: string;
  soundVolume: number;
  autoAnalysis: boolean;
  saveHistory: boolean;
  theme: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

const defaultSettings: Settings = {
  notifications: true,
  soundEffects: true,
  darkMode: false,
  language: "pt-BR",
  soundVolume: 30,
  autoAnalysis: false,
  saveHistory: true,
  theme: "gold",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('deffy-settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply theme colors
  useEffect(() => {
    const root = document.documentElement;
    
    switch (settings.theme) {
      case 'blue':
        root.style.setProperty('--primary', '217 91% 60%');
        root.style.setProperty('--primary-glow', '217 91% 70%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        break;
      case 'purple':
        root.style.setProperty('--primary', '271 81% 56%');
        root.style.setProperty('--primary-glow', '271 81% 66%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        break;
      case 'green':
        root.style.setProperty('--primary', '142 76% 36%');
        root.style.setProperty('--primary-glow', '142 76% 46%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        break;
      default: // gold
        root.style.setProperty('--primary', '48 100% 50%');
        root.style.setProperty('--primary-glow', '48 100% 60%');
        root.style.setProperty('--primary-foreground', '0 0% 0%');
    }
  }, [settings.theme]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Request notification permission
  useEffect(() => {
    if (settings.notifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.notifications]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('deffy-settings', JSON.stringify(defaultSettings));
  };

  const saveSettings = () => {
    localStorage.setItem('deffy-settings', JSON.stringify(settings));
  };

  // Auto-save on settings change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('deffy-settings', JSON.stringify(settings));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
