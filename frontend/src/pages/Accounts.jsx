import { useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import { AddDetectedSession } from '../../wailsjs/go/services/AuthService';
import { LoadSessions } from '../../wailsjs/go/services/SessionStore';
import { HiOutlineCheckCircle, HiViewGrid, HiViewList, HiPlus, HiPencil } from 'react-icons/hi';
import styles from './Accounts.module.css';
import { ViewModeContext } from '../context/ViewModeContext';
import { SwitchAccount } from "../../wailsjs/go/services/SwitchService";
import { STORAGE_KEYS } from "../constants/storageKeys";
import CustomizeAvatarModal from '../components/modals/CustomizeAvatarModal';
import { SelectAndSaveAvatar, RemoveAvatar } from "../../wailsjs/go/services/AvatarService";
import { useAvatarCache } from '../context/AvatarCacheContext';
import { getBorderThickness } from '../components/modals/CustomizeAvatarModal/avatarUtils';
import SuccessSprout from '../components/SuccessSprout';

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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBorder, setShowBorder] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
    return stored !== null ? stored === 'true' : true;
  });
  const [borderThickness, setBorderThickness] = useState(getBorderThickness);
  const [lastSwitchedId, setLastSwitchedId] = useState(null);
  const { cacheVersion } = useAvatarCache();

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  useEffect(() => {
    const loadBorder = () => {
      const storedBorder = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
      if (storedBorder !== null) setShowBorder(storedBorder === 'true');
      setBorderThickness(getBorderThickness());
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


  async function handleSwitchAccount(session) {
    try {
      await SwitchAccount(session);
      // toast.success(`Switched to account: ${session.alias || session.username || session.userId}`, { id: "switch-account" });
      setActiveLoginSession(session);
      setLastSwitchedId(session.userId);

      // Reset after animation
      setTimeout(() => {
        setLastSwitchedId(null);
      }, 2500);
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
                          style={{
                            background: activeSession.avatarColor || undefined,
                            padding: showBorder ? `${borderThickness}px` : undefined
                          }}
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
                          {lastSwitchedId === activeSession.userId && <SuccessSprout key={activeSession.userId} />}
                        </div>

                        {isNewSession && (
                          <button
                            className={styles.addDetectedButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept();
                            }}
                          >
                            <HiPlus />
                            <span>Add to Switcher</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.activeAccountSide}>
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

                        return (
                          <div
                            key={session.userId}
                            className={styles.listItem}
                            onClick={() => handleSwitchAccount(session)}
                          >
                            <div className={styles.avatarWrapper}>
                              <div
                                className={`${styles.avatar} ${!showBorder ? styles.avatarNoBorder : ''}`}
                                style={{
                                  background: session.avatarColor || undefined,
                                  padding: showBorder ? '2px' : 0
                                }}
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
                            </div>

                            <div className={styles.itemOverlay}>
                              <span>click to switch</span>
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
      )
      }


      {
        showAvatarModal && (
          <CustomizeAvatarModal
            username={activeSession?.alias || activeSession?.username || activeSession?.userId}
            userId={activeSession?.userId}
            currentAvatarImage={activeSession?.avatarImage}
            currentAvatarColor={activeSession?.avatarColor}
            isLocked={isNewSession}
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
        )
      }
    </div >
  );
}
