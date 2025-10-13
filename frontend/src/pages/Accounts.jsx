import { useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import { AddDetectedSession, IgnoreDetectedSession } from '../../wailsjs/go/services/AuthService';
import { LoadSessions } from '../../wailsjs/go/services/SessionStore';
import { HiOutlineClipboardCopy, HiOutlineCheckCircle, HiViewGrid, HiViewList } from 'react-icons/hi';
import styles from './Accounts.module.css';
import { ViewModeContext } from '../context/ViewModeContext';

export default function Accounts() {
  const location = useLocation();
  const { sessions, setSessions, isLoading } = useContext(SessionContext);
  const {
    activeLoginSession,
    newLoginSession,
    setNewLoginSession,
    newLoginUsername,
    checkLoginStatus,
  } = useContext(AuthContext);

  const { viewMode, setViewMode } = useContext(ViewModeContext);

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  async function handleAccept() {
    const sessionToSave = { ...newLoginSession, username: newLoginUsername || "" };
    await AddDetectedSession(sessionToSave);
    const loaded = await LoadSessions();
    setSessions(loaded || []);
    toast.success("Account added!");
    setNewLoginSession(null);
  }

  async function handleIgnore() {
    await IgnoreDetectedSession(newLoginSession.userId);
    toast.success("Will not ask again for this account.");
    setNewLoginSession(null);
  }

  async function handleDismiss() {
    setNewLoginSession(null);
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const activeUserId = activeLoginSession?.userId || null;

  return (
    <>
      <PageHeader title="Accounts" />

      {!isLoading && (
        <>
          {sessions.length === 0 ? (
            <div className={styles.noSessionsMessage}>
              No saved sessions found
            </div>
          ) : (
            <>
              <div className={styles.subtitleRow}>
                <div className={styles.subtitle}>Select account</div>
                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeToggle : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <HiViewList />
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <HiViewGrid />
                  </button>
                </div>
              </div>

              <div
                className={`${styles.listContainer} ${viewMode === 'grid' ? styles.gridView : styles.listView
                  }`}
              >
                {sessions.map((session) => {
                  const displayName = session.alias || session.username || session.userId;
                  const isActive = session.userId === activeUserId;

                  return (
                    <div
                      key={session.userId}
                      className={`${styles.listItem} ${isActive ? styles.activeItem : ''}`}
                    >
                      <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                          {displayName[0].toUpperCase()}
                        </div>
                        {isActive && (
                          <div className={styles.tooltipWrapper}>
                            <HiOutlineCheckCircle className={styles.activeIcon} />
                            <div className={styles.tooltip}>
                              This is the active session.
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.textBlock}>
                        <div className={styles.inlineRow}>
                          <div className={styles.displayName}>
                            {displayName}
                          </div>
                          <button
                            className={styles.iconButton}
                            title="Copy username"
                            onClick={() => copyToClipboard(displayName)}
                          >
                            <HiOutlineClipboardCopy />
                          </button>
                        </div>

                        <div className={styles.inlineRow}>
                          <div className={styles.metaLine}>
                            {session.userId}
                          </div>
                          <button
                            className={styles.iconButton}
                            title="Copy ID"
                            onClick={() => copyToClipboard(session.userId)}
                          >
                            <HiOutlineClipboardCopy />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {newLoginSession && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>New Account Detected</h3>
            <div className={styles.modalNote}>
              This is the account that's logged in at the moment in the Epic Games Launcher.
            </div>

            {newLoginUsername && (
              <div className={styles.modalUsername}>
                Username: {newLoginUsername}
              </div>
            )}
            <div className={styles.modalUserId}>
              User ID: {newLoginSession.userId}
            </div>

            <div className={styles.modalButtons}>
              <div className={styles.modalButtonRow}>
                <button className={styles.primaryButton} onClick={handleAccept}>
                  Add Account
                </button>
                <button className={styles.secondaryButton} onClick={handleDismiss}>
                  Not now
                </button>
              </div>
              <button className={styles.ghostButton} onClick={handleIgnore}>
                Don't ask again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
