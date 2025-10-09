import { createContext, useState, useEffect } from 'react';
import { SyncCurrentLoginSession } from '../../wailsjs/go/services/AuthService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        await SyncCurrentLoginSession();
        setIsLoggedIn(true);
      } catch (err) {
        console.error("❌ No valid login found:", err);
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
