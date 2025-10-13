import { createContext, useState, useEffect, useCallback } from 'react';
import { GetCurrentLoginSession, DetectNewLoginSession, CheckIfSessionIsNew } from '../../wailsjs/go/services/AuthService';
import { GetUsernameForUserID } from '../../wailsjs/go/services/LogReaderService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLoginSession, setActiveLoginSession] = useState(null);   // currently logged in account
  const [newLoginSession, setNewLoginSession] = useState(null);         // only if new account detected
  const [newLoginUsername, setNewLoginUsername] = useState("");

  const checkLoginStatus = useCallback(async () => {
    try {
      console.log("🔑 Checking Epic login state...");

      // 1. Always detect current session for active state
      const currentSession = await GetCurrentLoginSession();
      if (currentSession && currentSession.userId) {
        setActiveLoginSession(currentSession);
        setIsLoggedIn(true);

        const isNew = await CheckIfSessionIsNew(currentSession.userId);
        setNewLoginSession(isNew ? currentSession : null);
      } else {
        setActiveLoginSession(null);
        setIsLoggedIn(false);
        setNewLoginSession(null);
      }

      // 2. Then detect if it's a *new* login
      const newSession = await DetectNewLoginSession();
      if (newSession && newSession.userId) {
        setNewLoginSession(newSession);
      } else {
        setNewLoginSession(null);
      }
    } catch (err) {
      console.error("❌ Login detection error:", err);
      setIsLoggedIn(false);
      setActiveLoginSession(null);
      setNewLoginSession(null);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
    const handleFocus = () => checkLoginStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkLoginStatus]);

  // When newLoginSession changes, try to fetch its username
  useEffect(() => {
    async function fetchUsername() {
      if (newLoginSession?.userId) {
        try {
          const uname = await GetUsernameForUserID(newLoginSession.userId);
          setNewLoginUsername(uname);
        } catch (err) {
          console.warn("⚠️ No username found in logs for this user:", err);
          setNewLoginUsername("");
        }
      } else {
        setNewLoginUsername("");
      }
    }
    fetchUsername();
  }, [newLoginSession]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        activeLoginSession,
        newLoginSession,
        setNewLoginSession,
        newLoginUsername,
        checkLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
