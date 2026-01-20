import { useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import { AddDetectedSession, IgnoreDetectedSession } from '../../wailsjs/go/services/AuthService';
import { LoadSessions } from '../../wailsjs/go/services/SessionStore';
import { HiOutlineCheckCircle, HiViewGrid, HiViewList, HiPlus, HiPencil } from 'react-icons/hi';
import styles from './Accounts.module.css';
import { ViewModeContext } from '../context/ViewModeContext';
import { SwitchAccount } from "../../wailsjs/go/services/SwitchService";
import HintMessage from "../components/HintMessage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import CustomizeAvatarModal from '../components/modals/CustomizeAvatarModal';
import { SelectAndSaveAvatar, RemoveAvatar } from "../../wailsjs/go/services/AvatarService";
import { useAvatarCache } from '../context/AvatarCacheContext';

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
  const [hideUserIds, setHideUserIds] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBorder, setShowBorder] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
    return stored !== null ? stored === 'true' : true;
  });
  const { cacheVersion } = useAvatarCache();

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  useEffect(() => {
    const storedHideUserIds = localStorage.getItem(STORAGE_KEYS.HIDE_USER_IDS);
    setHideUserIds(storedHideUserIds === "true");

    const loadBorder = () => {
      const storedBorder = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
      if (storedBorder !== null) setShowBorder(storedBorder === 'true');
    };

    window.addEventListener('storage', loadBorder);
    return () => window.removeEventListener('storage', loadBorder);
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

  async function handleAvatarClick() {
    setShowAvatarModal(true);
  }

  async function handleAvatarSelect() {
    if (!activeSession) return;
    try {
      const filename = await SelectAndSaveAvatar(activeSession.userId);
      if (filename) {
        // Update local state immediately
        setSessions(prev => prev.map(s =>
          s.userId === activeSession.userId ? { ...s, avatarImage: filename } : s
        ));
        toast.success("Avatar updated!", { id: "avatar-success" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar.", { id: "avatar-error" });
    } finally {
      // Modal remains open as requested
    }
  }

  async function handleAvatarRemove() {
    if (!activeSession) return;
    try {
      await RemoveAvatar(activeSession.userId);
      // Update local state immediately
      setSessions(prev => prev.map(s =>
        s.userId === activeSession.userId ? { ...s, avatarImage: "" } : s
      ));
      // toast.success("Avatar cleared!", { id: "avatar-success" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear avatar.", { id: "avatar-error" });
    } finally {
      // Modal remains open as requested
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

  console.log("Active Session:", activeSession);

  // If it's a new session, merge the username from newLoginUsername
  if (isNewSession && activeSession) {
    activeSession = { ...activeSession, username: newLoginUsername || activeSession.username };
  }

  // Calculate non-active accounts count and label
  const nonActiveAccountsCount = sessions.filter(s => s.userId !== activeUserId).length;
  const accountsLabel = "Select an account to switch";

  return (
    <div className={styles.pageWrapper}>

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
              {/* Not Logged In Section */}
              {!activeSession && (
                <div className={styles.notLoggedInSection}>
                  <div className={styles.notLoggedInCard}>
                    <div className={styles.notLoggedInInfo}>
                      <div className={styles.notLoggedInName}>
                        Not logged in
                      </div>
                      <div className={styles.notLoggedInMeta}>
                        Select an account from the list, or login with a different one in the Epic Games Launcher
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Account Section */}
              {activeSession && (
                <div className={styles.activeAccountSection}>
                  <div className={styles.activeAccountContent}>
                    <div className={styles.avatarLabelGroup}>
                      <div className={styles.activeAvatarWrapper} onClick={handleAvatarClick}>
                        <div
                          className={`${styles.activeAccountAvatar} ${!showBorder ? styles.activeAccountAvatarNoBorder : ''}`}
                          style={activeSession.avatarColor ? { background: activeSession.avatarColor } : {}}
                        >
                          {activeSession.avatarImage ? (
                            <img
                              src={`/avatar-thumb/${activeSession.avatarImage}?v=${cacheVersion}`}
                              alt=""
                              className={styles.customAvatarImage}
                            />
                          ) : (
                            getFirstVisibleChar(
                              activeSession.alias || activeSession.username || activeSession.userId
                            )
                          )}
                          <div className={styles.avatarOverlay}>
                            <HiPencil />
                          </div>
                        </div>

                        <div className={styles.activeAccountBadge} onClick={(e) => e.stopPropagation()}>
                          <HiOutlineCheckCircle />
                          <span>Currently logged in</span>
                        </div>
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
                    </div>

                    <div className={styles.activeAccountSide}>
                      {isNewSession && (
                        <button
                          className={styles.addDetectedButton}
                          onClick={handleAccept}
                        >
                          <HiPlus />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Non-Active Accounts List */}
              {nonActiveAccountsCount > 0 && (
                <>
                  <div className={styles.subtitleRow}>
                    <div className={styles.subtitleWithIcon}>
                      <div className={styles.subtitle}>{accountsLabel}</div>
                    </div>

                    {nonActiveAccountsCount >= 2 && (
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
                    )}
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
                              <div
                                className={`${styles.avatar} ${!showBorder ? styles.avatarNoBorder : ''}`}
                                style={session.avatarColor ? { background: session.avatarColor } : {}}
                              >
                                {session.avatarImage ? (
                                  <img
                                    src={`/avatar-thumb/${session.avatarImage}?v=${cacheVersion}`}
                                    alt=""
                                    className={styles.customAvatarImage}
                                  />
                                ) : (
                                  getFirstVisibleChar(displayName)
                                )}
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
                  <div className={styles.noOtherAccountsText}>
                    No other accounts available.
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {sessions.length > 0 && <HintMessage />}

      {showAvatarModal && (
        <CustomizeAvatarModal
          username={activeSession?.alias || activeSession?.username || activeSession?.userId}
          userId={activeSession?.userId}
          currentAvatarImage={activeSession?.avatarImage}
          currentAvatarColor={activeSession?.avatarColor}
          onSelect={handleAvatarSelect}
          onRemove={handleAvatarRemove}
          onCancel={() => setShowAvatarModal(false)}
          onAvatarChange={(filename) => {
            setSessions(prev => prev.map(s =>
              s.userId === activeSession?.userId ? { ...s, avatarImage: filename } : s
            ));
            // setShowAvatarModal(false); // Do not close automatically
          }}
          onColorChange={(color) => {
            setSessions(prev => prev.map(s =>
              s.userId === activeSession?.userId ? { ...s, avatarColor: color } : s
            ));
          }}
        />
      )}
    </div>
  );
}
