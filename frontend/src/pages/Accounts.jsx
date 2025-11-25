import { useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import { AddDetectedSession, IgnoreDetectedSession, MoveAsideActiveSession } from '../../wailsjs/go/services/AuthService';
import { LoadSessions } from '../../wailsjs/go/services/SessionStore';
import { HiOutlineCheckCircle, HiViewGrid, HiViewList, HiPlus } from 'react-icons/hi';
import styles from './Accounts.module.css';
import { ViewModeContext } from '../context/ViewModeContext';
import { SwitchAccount } from "../../wailsjs/go/services/SwitchService";
import AddAccountModal from "../components/modals/AddAccountModal";
import HintMessage from "../components/HintMessage";
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

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  useEffect(() => {
    const storedHideUserIds = localStorage.getItem(STORAGE_KEYS.HIDE_USER_IDS);
    setHideUserIds(storedHideUserIds === "true");
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

  async function handleAddMainAction() {
    try {
      await MoveAsideActiveSession();
      toast.success("Epic Games Launcher restarted — log in with your other account.", { id: "move-aside-active-session" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to move aside active session.", { id: "move-aside-error" });
    }
  }

  function handleAddCancel() {
    setShowAddModal(false);
  }

  async function handleSwitchAccount(session) {
    try {
      await SwitchAccount(session);
      toast.success(`Switched to account: ${session.alias || session.username || session.userId}`, { id: "switch-account" });
      setActiveLoginSession(session);
    } catch (err) {
      console.error(err);
      toast.error("Failed to switch account.", { id: "switch-account-error" });
    }
  }

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const activeUserId = activeLoginSession?.userId || null;

  // Merge activeLoginSession with session data to get username/alias
  let activeSession = activeUserId
    ? sessions.find(s => s.userId === activeUserId) || activeLoginSession
    : null;

  // Check if the currently active session is the new detected session
  const isNewSession = newLoginSession && activeLoginSession && newLoginSession.userId === activeLoginSession.userId;

  // If it's a new session, merge the username from newLoginUsername
  if (isNewSession && activeSession) {
    activeSession = { ...activeSession, username: newLoginUsername || activeSession.username };
  }

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="Accounts" />

      {!isLoading && (
        <>
          {sessions.length === 0 && !activeLoginSession ? (
            <div className={styles.noActiveAccountMessage}>
              <div className={styles.noActiveAccountText}>
                Log into Epic Games Launcher to get started
              </div>
            </div>
          ) : (
            <>
              {/* Active Account Section */}
              {activeSession && (
                <div className={styles.activeAccountSection}>
                  <div className={styles.activeAccountCard}>
                    <div className={styles.activeAccountAvatar}>
                      {getFirstVisibleChar(
                        activeSession.alias || activeSession.username || activeSession.userId
                      )}
                    </div>
                    <div className={styles.activeAccountInfo}>
                      <div className={styles.activeAccountName}>
                        {activeSession.alias || activeSession.username || activeSession.userId}
                      </div>
                      {!hideUserIds && (
                        <div className={styles.activeAccountMeta}>
                          {activeSession.alias
                            ? activeSession.username || activeSession.userId
                            : activeSession.userId}
                        </div>
                      )}
                    </div>

                    <div className={styles.activeAccountRight}>
                      {isNewSession && (
                        <button
                          className={styles.addDetectedButton}
                          onClick={handleAccept}
                          title="Add this account to your list"
                        >
                          <HiPlus />
                          <span>Add</span>
                        </button>
                      )}
                      <div className={styles.activeAccountBadge}>
                        <HiOutlineCheckCircle />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Non-Active Accounts List */}
              {sessions.filter(s => s.userId !== activeUserId).length > 0 && (
                <>
                  <div className={styles.subtitleRow}>
                    <div className={styles.subtitleWithIcon}>
                      <div className={styles.subtitle}>Switch to another account</div>
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
                    className={`${styles.listContainer} ${viewMode === 'grid' ? styles.gridView : styles.listView}`}
                  >
                    {sessions
                      .filter(s => s.userId !== activeUserId)
                      .map((session) => {
                        const displayName = session.alias || session.username || session.userId;
                        const metaLineValue = session.alias ? (session.username || session.userId) : session.userId;

                        const handleMouseMove = (e) => {
                          const card = e.currentTarget;
                          const rect = card.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;

                          const glow = card.querySelector(`.${styles.listItem}::after`);
                          if (card) {
                            card.style.setProperty('--mouse-x', `${x}px`);
                            card.style.setProperty('--mouse-y', `${y}px`);
                          }
                        };

                        return (
                          <div
                            key={session.userId}
                            className={styles.listItem}
                            onClick={() => handleSwitchAccount(session)}
                            onMouseMove={handleMouseMove}
                          >
                            <div className={styles.avatarWrapper}>
                              <div className={styles.avatar}>
                                {getFirstVisibleChar(displayName)}
                              </div>
                            </div>

                            <div className={styles.textBlock}>
                              <div className={styles.inlineRow}>
                                <div className={styles.displayName}>{displayName}</div>
                              </div>

                              {!hideUserIds && (
                                <div className={styles.inlineRow}>
                                  <div className={styles.metaLine}>{metaLineValue}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {/* Only Active Account, No Others */}
              {sessions.length > 0 && sessions.filter(s => s.userId !== activeUserId).length === 0 && (
                <div className={styles.noOtherAccountsMessage}>
                  <div className={styles.addTooltipWrapper}>
                    <HiPlus className={styles.addIcon} onClick={() => setShowAddModal(true)} />
                    <div className={styles.tooltip}>Add new account</div>
                  </div>
                  <div className={styles.noOtherAccountsText}>
                    No other accounts available. Click the + icon to add one.
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showAddModal && (
        <AddAccountModal onMoveAside={handleAddMainAction} onCancel={handleAddCancel} />
      )}

      {sessions.length > 0 && <HintMessage />}
    </div>
  );
}
