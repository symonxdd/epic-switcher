import { useState, useEffect } from "react";
import { HiOutlineLightBulb, HiOutlineCheckCircle, HiViewList, HiViewGrid } from "react-icons/hi";
import toast from "react-hot-toast";
import styles from "./IgnoredSessionsTab.module.css";
import { Load, Unignore } from "../../../wailsjs/go/services/IgnoreListStore";
import UnignoreModal from "../modals/UnignoreModal";

export default function IgnoredSessionsTab({ isLoading, activeLoginSession }) {
  const [ignoredIds, setIgnoredIds] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const activeUserId = activeLoginSession?.userId || null;

  useEffect(() => {
    async function fetchIgnored() {
      try {
        const loaded = await Load();
        setIgnoredIds(loaded || []);
      } catch (err) {
        console.error("Failed to load ignored sessions:", err);
      }
    }
    fetchIgnored();
  }, []);

  async function handleUnignore(userId) {
    try {
      await Unignore(userId);
      toast.success("Account un-ignored successfully");
      setIgnoredIds((prev) => prev.filter((id) => id !== userId));
      setSelectedId(null);
    } catch (err) {
      console.error("Failed to un-ignore account:", err);
      toast.error("Failed to un-ignore account");
    }
  }

  if (isLoading) return null;

  if (!ignoredIds.length) {
    return <div className={styles.noSessionsMessage}>No ignored sessions</div>;
  }

  return (
    <>
      {/* --- Title Row --- */}
      <div className={styles.subtitleRow}>
        <div className={styles.subtitleWithIcon}>
          <div className={styles.subtitle}>Revert an ignored account</div>
          <div className={styles.addTooltipWrapper}>
            <HiOutlineLightBulb className={styles.addIcon} />
            <div className={styles.tooltip}>
              These are accounts you previously chose to ignore.
              Click one to un-ignore it.
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
        className={`${styles.listContainer} ${viewMode === "grid" ? styles.gridView : styles.listView
          }`}
      >
        {ignoredIds.map((userId) => {
          const isActive = userId === activeUserId;

          return (
            <div
              key={userId}
              className={`${styles.listItem} ${isActive ? styles.activeItem : ""}`}
              onClick={() => setSelectedId(userId)}
            >
              <div className={styles.textBlock}>
                <div className={styles.inlineRow}>
                  {isActive && (
                    <div className={styles.tooltipWrapper}>
                      <HiOutlineCheckCircle className={styles.activeIcon} />
                      <div className={styles.tooltip}>This is the active session.</div>
                    </div>
                  )}
                  <div className={styles.displayName}>{userId}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedId && (
        <UnignoreModal
          userId={selectedId}
          onConfirm={() => handleUnignore(selectedId)}
          onCancel={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
