import { useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import { AddDetectedSession, IgnoreDetectedSession, MoveAsideActiveSession } from '../../wailsjs/go/services/AuthService';
import { LoadSessions } from '../../wailsjs/go/services/SessionStore';
import { HiOutlineClipboardCopy, HiOutlineCheckCircle, HiViewGrid, HiViewList, HiPlus } from 'react-icons/hi';
import styles from './Accounts.module.css';
import { ViewModeContext } from '../context/ViewModeContext';
import { SwitchAccount } from "../../wailsjs/go/services/SwitchService";
import AddAccountModal from "../components/modals/AddAccountModal";
import NewAccountModal from "../components/modals/NewAccountModal";
import HintMessage from "../components/HintMessage";
import ListSeparator from '../components/ListSeparator';
import { STORAGE_KEYS } from "../constants/storageKeys";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [hideUserIds, setHideUserIds] = useState(false);
  const [hideCopyButtons, setHideCopyButtons] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  useEffect(() => {
    const storedHideUserIds = localStorage.getItem(STORAGE_KEYS.HIDE_USER_IDS);
    setHideUserIds(storedHideUserIds === "true");

    const storedHideCopyButtons = localStorage.getItem(STORAGE_KEYS.HIDE_COPY_BUTTONS);
    setHideCopyButtons(storedHideCopyButtons === "true");
  }, []);

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
  }

  async function handleAddMainAction() {
    try {
      await MoveAsideActiveSession()
      toast.success("Epic Games Launcher restarted — log in with your other account.")
      setShowAddModal(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to move aside active session.")
    }
  }

  function handleAddCancel() {
    setShowAddModal(false);
  }

  async function handleSwitchAccount(session) {
    try {
      await SwitchAccount(session)
      toast.success(`Switched to account: ${session.username || session.userId}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to switch account.")
    }
  }

  const activeUserId = activeLoginSession?.userId || null;

  return (
    <>
      <PageHeader title="Accounts" />

      {!isLoading && (
        <>
          {sessions.length === 0 ? (
            <div className={styles.noSessionsMessage}>
              {activeLoginSession ? (
                <div>No saved sessions found</div>
              ) : (
                <div className={styles.extraMessage}>
                  Log in to Epic Games Launcher to get started
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.subtitleRow}>
                <div className={styles.subtitleWithIcon}>
                  <div className={styles.subtitle}>Select account</div>
                  <div className={styles.addTooltipWrapper}>
                    <HiPlus className={styles.addIcon} onClick={() => setShowAddModal(true)} />
                    <div className={styles.tooltip}>Add new account</div>
                  </div>
                </div>

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
                {sessions.map((session, index) => {
                  const displayName = session.alias || session.username || session.userId;
                  const isActive = session.userId === activeUserId;

                  return (
                    <>
                      <div
                        key={session.userId}
                        className={`${styles.listItem} ${isActive ? styles.activeItem : ''}`}
                        onClick={() => {
                          if (!isActive) {
                            handleSwitchAccount(session);
                          }
                        }}
                      >
                        <div className={styles.avatarWrapper}>
                          <div className={styles.avatar}>{displayName[0].toUpperCase()}</div>
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
                            <div className={styles.displayName}>{displayName}</div>
                            {!hideCopyButtons && (
                              <button
                                type="button"
                                className={styles.iconButton}
                                title="Copy username"
                                aria-label={`Copy username ${displayName}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(displayName);
                                }}
                              >
                                <HiOutlineClipboardCopy />
                              </button>
                            )}
                          </div>

                          {!hideUserIds && (
                            <div className={styles.inlineRow}>
                              <div className={styles.metaLine}>{session.userId}</div>
                              {!hideCopyButtons && (
                                <button
                                  type="button"
                                  className={styles.iconButton}
                                  title="Copy ID"
                                  aria-label={`Copy ID ${session.userId}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(session.userId);
                                  }}
                                >
                                  <HiOutlineClipboardCopy />
                                </button>
                              )}

                            </div>
                          )}
                        </div>
                      </div>

                      {/* {viewMode === 'list' && index < sessions.length - 1 && <ListSeparator />} */}
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {newLoginSession && (
        <NewAccountModal
          newLoginUsername={newLoginUsername}
          newLoginSession={newLoginSession}
          onAccept={handleAccept}
          onIgnore={handleIgnore}
          onDismiss={handleDismiss}
        />
      )}

      {showAddModal && (
        <AddAccountModal
          onMoveAside={handleAddMainAction}
          onCancel={handleAddCancel}
        />
      )}

      {sessions.length > 0 && <HintMessage />}
    </>
  );
}
