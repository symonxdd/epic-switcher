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
    setActiveLoginSession,
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
    toast.success("Account added!", { id: "add-account" });
    setNewLoginSession(null);
  }

  async function handleIgnore() {
    await IgnoreDetectedSession(newLoginSession.userId);
    toast.success("Will not ask again for this account.", { id: "ignore-account" });
    setNewLoginSession(null);
  }

  async function handleDismiss() {
    setNewLoginSession(null);
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`, { id: "copy-to-clipboard" });
    } catch (err) {
      toast.error('Failed to copy', { id: "copy-error" });
    }
  }

  async function handleAddMainAction() {
    try {
      await MoveAsideActiveSession()
      toast.success("Epic Games Launcher restarted — log in with your other account.", { id: "move-aside-active-session" })
      setShowAddModal(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to move aside active session.", { id: "move-aside-error" })
    }
  }

  function handleAddCancel() {
    setShowAddModal(false);
  }

  async function handleSwitchAccount(session) {
    try {
      await SwitchAccount(session)
      toast.success(`Switched to account: ${session.username || session.userId}`, { id: "switch-account" })
      setActiveLoginSession(session);
    } catch (err) {
      console.error(err)
      toast.error("Failed to switch account.", { id: "switch-account-error" })
    }
  }

  function getFirstVisibleChar(str) {
    if (!str) return "";

    // Create a segmenter that splits text into user-visible characters (graphemes)
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

    // Get the first grapheme (this safely handles emojis, flags, skin tones, etc.)
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";

    // If it's an emoji, don't uppercase it; if it's text, you can.
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
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
                {sessions.map((session) => {
                  const displayName = session.alias || session.username || session.userId;
                  const isActive = session.userId === activeUserId;

                  const copyDisplayNameValue = session.alias
                    ? session.alias
                    : (session.username || session.userId);

                  const copyDisplayNameTitle = session.alias
                    ? `Copy alias`
                    : (session.username
                      ? `Copy username`
                      : `Copy ID`);

                  const metaLineValue = session.alias ? (session.username || session.userId) : session.userId;
                  const metaLineTitle = session.alias
                    ? (session.username ? `Copy username` : `Copy ID`)
                    : `Copy ID`;

                  return (
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
                        <div className={styles.avatar}>
                          {getFirstVisibleChar(displayName)}
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
                          <div className={styles.displayName}>{displayName}</div>
                          {!hideCopyButtons && (
                            <button
                              type="button"
                              className={styles.iconButton}
                              title={copyDisplayNameTitle}
                              aria-label={copyDisplayNameTitle}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(copyDisplayNameValue);
                              }}
                            >
                              <HiOutlineClipboardCopy />
                            </button>
                          )}
                        </div>

                        {!hideUserIds && (
                          <div className={styles.inlineRow}>
                            <div className={styles.metaLine}>{metaLineValue}</div>
                            {!hideCopyButtons && (
                              <button
                                type="button"
                                className={styles.iconButton}
                                title={metaLineTitle}
                                aria-label={metaLineTitle}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(metaLineValue);
                                }}
                              >
                                <HiOutlineClipboardCopy />
                              </button>
                            )}
                          </div>
                        )}
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
