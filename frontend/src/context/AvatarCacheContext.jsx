import { createContext, useContext, useState } from 'react';

const AvatarCacheContext = createContext();

export function AvatarCacheProvider({ children }) {
  // Initialize with current timestamp so first load is unique
  const [cacheVersion, setCacheVersion] = useState(() => Date.now());

  // Call this after any avatar file changes on disk
  const invalidateCache = () => {
    setCacheVersion(Date.now());
  };

  return (
    <AvatarCacheContext.Provider value={{ cacheVersion, invalidateCache }}>
      {children}
    </AvatarCacheContext.Provider>
  );
}

// Hook for easy consumption
export function useAvatarCache() {
  return useContext(AvatarCacheContext);
}
