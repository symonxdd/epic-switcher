import { useContext, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { SessionContext } from '../context/SessionContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineLightBulb,
  HiViewGrid,
  HiViewList,
  HiOutlineCheckCircle,
  HiOutlineClipboardCopy,
} from 'react-icons/hi';
import styles from './Manage.module.css';
import { ViewModeContext } from '../context/ViewModeContext';
import HintMessage from "../components/HintMessage";
import ListSeparator from '../components/ListSeparator';
import AliasInput from '../components/AliasInput';

export default function Manage() {
  const { sessions, isLoading, onAliasChange } = useContext(SessionContext);
  const { activeLoginSession } = useContext(AuthContext);
  const { viewMode, setViewMode } = useContext(ViewModeContext);

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
      <PageHeader title="Manage" />

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
                  <div className={styles.subtitle}>Create an alias</div>
                  <div className={styles.infoTooltipWrapper}>
                    <HiOutlineLightBulb className={styles.infoIcon} />
                    <div className={styles.tooltip}>
                      Aliases are only used within this app — they don't affect your Epic Games account.<br />
                      Changes are auto-saved 😌
                    </div>
                  </div>
                </div>

                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeToggle : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <HiViewList />
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
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
                      >
                        <div className={styles.avatarWrapper}>
                          <div className={styles.avatar}>{displayName[0].toUpperCase()}</div>
                          {isActive && (
                            <div className={styles.checkTooltipWrapper}>
                              <HiOutlineCheckCircle className={styles.activeIcon} />
                              <div className={styles.tooltip}>
                                This is the active session.
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={styles.textBlock}>
                          <div className={styles.inlineRow}>
                            <div className={styles.displayName}>{session.username || session.userId}</div>
                            <button
                              className={styles.iconButton}
                              title="Copy username"
                              onClick={() => copyToClipboard(session.username || session.userId)}
                            >
                              <HiOutlineClipboardCopy />
                            </button>
                          </div>

                          <AliasInput
                            userId={session.userId}
                            alias={session.alias}
                            onAliasChange={onAliasChange}
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {sessions.length > 0 && <HintMessage />}
    </>
  );
}
