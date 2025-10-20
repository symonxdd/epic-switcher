import { useState, useEffect, useContext } from "react";
import { HiOutlineLightBulb, HiOutlineCheckCircle, HiViewList, HiViewGrid } from "react-icons/hi";
import toast from "react-hot-toast";
import { ViewModeContext } from "../../context/ViewModeContext";
import styles from "./DeleteSessionTab.module.css";
import { LoadSessions, DeleteSession } from "../../../wailsjs/go/services/SessionStore";
import DeleteSessionModal from "../modals/DeleteSessionModal";

export default function DeleteSessionTab({ isLoading, activeUserId }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const { viewMode, setViewMode } = useContext(ViewModeContext);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const loaded = await LoadSessions();
        setSessions(loaded || []);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    }
    fetchSessions();
  }, []);

  async function handleDelete(userId) {
    try {
      await DeleteSession(userId);
      toast.success("Session deleted successfully");
      setSessions((prev) => prev.filter((s) => s.userId !== userId));
      setSelectedSession(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete session");
    }
  }

  if (isLoading) return null;

  if (!sessions.length) {
    return <div className={styles.noSessionsMessage}>No sessions available</div>;
  }

  return (
    <>
      {/* --- Title Row --- */}
      <div className={styles.subtitleRow}>
        <div className={styles.subtitleWithIcon}>
          <div className={styles.subtitle}>Delete a saved session</div>
          <div className={styles.addTooltipWrapper}>
            <HiOutlineLightBulb className={styles.addIcon} />
            <div className={styles.tooltip}>
              These are the accounts currently saved on your device. Click one to delete it.
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === "list" ? styles.activeToggle : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <HiViewList />
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === "grid" ? styles.activeToggle : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <HiViewGrid />
          </button>
        </div>
      </div>

      {/* --- List/Grid --- */}
      <div
        className={`${styles.listContainer} ${viewMode === "grid" ? styles.gridView : styles.listView}`}
      >
        {sessions.map((session) => {
          const isActive = session.userId === activeUserId;
          const displayName = session.alias || session.username || session.userId;

          return (
            <div
              key={session.userId}
              className={`${styles.listItem} ${isActive ? styles.activeItem : ""}`}
              onClick={() => setSelectedSession(session)}
            >
              <div className={styles.textBlock}>
                {/* ✅ Inline row: checkmark + displayName */}
                <div className={styles.inlineRow}>
                  {isActive && (
                    <div className={styles.tooltipWrapper}>
                      <HiOutlineCheckCircle className={styles.activeIcon} />
                      <div className={styles.tooltip}>This is the active session.</div>
                    </div>
                  )}
                  <div className={styles.displayName}>{displayName}</div>
                </div>

                {/* UserID row */}
                <div className={styles.inlineRow}>
                  <div className={styles.metaLine}>{session.userId}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedSession && (
        <DeleteSessionModal
          session={selectedSession}
          onConfirm={() => handleDelete(selectedSession.userId)}
          onCancel={() => setSelectedSession(null)}
        />
      )}
    </>
  );
}
