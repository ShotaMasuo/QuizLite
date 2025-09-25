import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppSettings } from '../../services/types';

interface AppContextValue {
  settings: AppSettings | null;
  setSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings | null>(null);

  const setSettings = (partial: Partial<AppSettings>) => {
    setSettingsState(current => ({
      subject: 'english',
      mode: 'input',
      total: 5,
      ...current,
      ...partial,
    } as AppSettings));
  };

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
};