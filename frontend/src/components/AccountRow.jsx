import { useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import styles from "./AccountRow.module.css";
import EditAliasModal from "./modals/EditAliasModal";
import { useAvatarCache } from "../context/AvatarCacheContext";

export default function AccountRow({
  session,
  isActive,
  onAliasChange,
  onDeleteSession,
}) {
  const [showAliasModal, setShowAliasModal] = useState(false);
  const { cacheVersion } = useAvatarCache();

  const displayName =
    session?.alias || session?.username || session?.userId;

  const metaLineValue = session?.alias
    ? session?.username || session?.userId
    : session?.userId;

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const handleAliasEdit = (e) => {
    e.stopPropagation();
    setShowAliasModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteSession?.(session.userId);
  };

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.listItem}>
        <div className={styles.avatarWrapper}>
          <div
            className={styles.avatar}
            style={session?.avatarColor ? { background: session.avatarColor } : {}}
          >
            {session?.avatarImage ? (
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
            <div className={`${styles.displayName} ${styles.selectableText}`}>{displayName}</div>
          </div>

          <div className={styles.inlineRow}>
            <div className={`${styles.metaLine} ${styles.selectableText}`}>{metaLineValue}</div>
          </div>
        </div>

        <div className={styles.actionsWrapper}>
          <>
            {isActive && (
              <div className={styles.activeAccountBadge}>
                <HiOutlineCheckCircle />
                <span>Currently logged in</span>
              </div>
            )}


            <button
              type="button"
              className={`${styles.editAliasButton} ${session.alias ? styles.hasAlias : ""}`}
              onClick={handleAliasEdit}
            >
              <HiOutlinePencil />
              <span>Edit nickname</span>
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={handleDelete}
            >
              <HiOutlineTrash />
            </button>

            {showAliasModal && (
              <EditAliasModal
                userId={session.userId}
                currentAlias={session.alias}
                onAliasChange={onAliasChange}
                onClose={() => setShowAliasModal(false)}
              />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
