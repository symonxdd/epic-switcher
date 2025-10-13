import { createContext, useState, useEffect } from 'react';

export const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('list'); // default

  // On mount, load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('viewMode');
    if (saved === 'list' || saved === 'grid') {
      setViewMode(saved);
    }
  }, []);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};
