import { createContext, useState, useEffect } from 'react';
import { SyncUsernames } from '../../wailsjs/go/services/LogReaderService';
import { LoadSessions, UpdateAlias } from '../../wailsjs/go/services/SessionStore';

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function initSessions() {
      try {
        console.log("🧭 A. Filling usernames from logs...");
        await SyncUsernames(false);

        console.log("📦 B. Loading sessions...");
        const loaded = await LoadSessions();
        setSessions(loaded || []);

        console.log(`✅ Loaded ${loaded?.length} sessions.`);
        console.log(`Sessions:`, loaded);
      } catch (err) {
        console.error("❌ Failed to init sessions:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initSessions();
  }, []);

  // Focus listener
  useEffect(() => {
    async function handleFocus() {
      try {
        const updated = await SyncUsernames(false);
        const loaded = await LoadSessions();
        setSessions(loaded || []);
        // if (updated) {
        // const loaded = await LoadSessions();
        // setSessions(loaded || []);
        // console.log("🔄 JSON store changed; executed LoadSessions on window focus.");
        // }
      } catch (err) {
        console.error("❌ Failed to sync usernames on focus:", err);
      }
    }

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  async function onAliasChange(userId, newAlias) {
    try {
      await UpdateAlias(userId, newAlias);
      setSessions(prev =>
        prev.map(session =>
          session.userId === userId ? { ...session, alias: newAlias } : session
        )
      );
    } catch (err) {
      console.error("❌ Failed to update alias:", err);
    }
  }

  return (
    <SessionContext.Provider value={{ sessions, setSessions, isLoading, onAliasChange }}>
      {children}
    </SessionContext.Provider>
  );
}
