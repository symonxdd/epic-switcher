import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SyncUsernames } from '../../wailsjs/go/services/LogReaderService';
import { LoadSessions, UpdateAlias } from '../../wailsjs/go/services/SessionStore';
import { SelectAndSaveAvatar, RemoveAvatar } from '../../wailsjs/go/services/AvatarService';

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

  // Reload when the backend changed stored sessions outside this context
  useEffect(() => {
    async function handleSessionsUpdated() {
      try {
        const loaded = await LoadSessions();
        setSessions(loaded || []);
      } catch (err) {
        console.error("❌ Failed to reload sessions:", err);
      }
    }

    window.addEventListener('sessions-updated', handleSessionsUpdated);
    return () => window.removeEventListener('sessions-updated', handleSessionsUpdated);
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

  // Merges fields into one session in local state, after the backend saved them
  function updateSessionLocally(userId, fields) {
    setSessions(prev =>
      prev.map(session =>
        session.userId === userId ? { ...session, ...fields } : session
      )
    );
  }

  // Avatar actions shared by the Accounts and Manage pages
  async function selectAvatar(userId) {
    try {
      const filename = await SelectAndSaveAvatar(userId);
      if (filename) {
        updateSessionLocally(userId, { avatarImage: filename });
        toast.success("Avatar updated!", { id: "avatar-success" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar.", { id: "avatar-error" });
    }
  }

  async function removeAvatar(userId) {
    try {
      await RemoveAvatar(userId);
      updateSessionLocally(userId, { avatarImage: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear avatar.", { id: "avatar-error" });
    }
  }

  return (
    <SessionContext.Provider value={{ sessions, setSessions, isLoading, onAliasChange, updateSessionLocally, selectAvatar, removeAvatar }}>
      {children}
    </SessionContext.Provider>
  );
}
