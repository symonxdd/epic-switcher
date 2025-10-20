import { useContext } from "react";
import {
  HiOutlineLightBulb,
  HiViewGrid,
  HiViewList,
  HiOutlineCheckCircle,
  HiOutlineClipboardCopy,
} from "react-icons/hi";
import { ViewModeContext } from "../../context/ViewModeContext";
import AliasInput from "../AliasInput";
import styles from "./AliasesTab.module.css";

export default function AliasesTab({
  sessions,
  isLoading,
  activeLoginSession,
  activeUserId,
  onAliasChange,
  copyToClipboard,
}) {
  const { viewMode, setViewMode } = useContext(ViewModeContext);

  if (isLoading) return null;

  // Show "no sessions" message logic (same as old Manage.jsx)
  if (sessions.length === 0) {
    return (
      <div className={styles.noSessionsMessage}>
        {activeLoginSession ? (
          <div>No saved sessions found</div>
        ) : (
          <div className={styles.extraMessage}>
            Log in to Epic Games Launcher to get started
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Subtitle row (Create an alias + info icon + view toggles) */}
      <div className={styles.subtitleRow}>
        <div className={styles.subtitleWithIcon}>
          <div className={styles.subtitle}>Create an alias</div>

          <div className={styles.infoTooltipWrapper}>
            <HiOutlineLightBulb className={styles.infoIcon} />
            <div className={styles.tooltip}>
              Aliases are only used within this app — they don't affect your Epic
              Games account.
              <br />
              Changes are auto-saved 😌
            </div>
          </div>
        </div>

        {/* View toggle buttons */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === "list" ? styles.activeToggle : ""
              }`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <HiViewList />
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === "grid" ? styles.activeToggle : ""
              }`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <HiViewGrid />
          </button>
        </div>
      </div>

      {/* Sessions list/grid */}
      <div
        className={`${styles.listContainer} ${viewMode === "grid" ? styles.gridView : styles.listView
          }`}
      >
        {sessions.map((session) => {
          const isActive = session.userId === activeUserId;

          return (
            <div
              key={session.userId}
              className={`${styles.listItem} ${isActive ? styles.activeItem : ""
                }`}
            >
              <div className={styles.textBlock}>
                <div className={styles.inlineRow}>
                  <div className={styles.displayNameWrapper}>
                    {isActive && (
                      <div className={styles.checkTooltipWrapper}>
                        <HiOutlineCheckCircle className={styles.activeIcon} />
                        <div className={styles.tooltip}>
                          This is the active session.
                        </div>
                      </div>
                    )}
                    <div className={styles.displayName}>
                      {session.username || session.userId}
                    </div>
                  </div>

                  <button
                    className={styles.iconButton}
                    title="Copy username"
                    onClick={() =>
                      copyToClipboard(session.username || session.userId)
                    }
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
          );
        })}
      </div>
    </>
  );
}
