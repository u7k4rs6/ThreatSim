import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { setGlobalProgressCallback } from '../utils/dataStorage';

interface ProgressContextType {
  progressVersion: number;
  updateProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progressVersion, setProgressVersion] = useState(0);

  const updateProgress = useCallback(() => {
    setProgressVersion(prevVersion => prevVersion + 1);
    console.log('🔄 Progress updated, new version:', progressVersion + 1);
  }, [progressVersion]);

  // Set up the global callback when the provider mounts
  useEffect(() => {
    setGlobalProgressCallback(updateProgress);
    console.log('🔗 Global progress callback registered');
    
    return () => {
      setGlobalProgressCallback(() => {});
    };
  }, [updateProgress]);

  const value: ProgressContextType = {
    progressVersion,
    updateProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
