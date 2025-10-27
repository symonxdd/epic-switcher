import { useRef, useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineXCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import AliasInput from "../components/AliasInput";
import styles from "./AccountRow.module.css";

export default function AccountRow({
  session,
  userId,
  isActive,
  isIgnored = false,
  isAltRow = false,
  onAliasChange,
  onDeleteSession,
  onUnignoreClick,
  isEditing = false,
  onEditToggle,
  onCloseEdit,
}) {
  const inputRef = useRef(null);

  const displayName =
    session?.alias || session?.username || session?.userId || userId;

  const metaLineValue = session?.alias
    ? session?.username || session?.userId
    : session?.userId || userId;

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.aliasIconButton}`)
      ) {
        onCloseEdit?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCloseEdit]);

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const handleAliasEdit = (e) => {
    e.stopPropagation();
    onEditToggle?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteSession?.(session.userId);
  };

  const handleUnignore = (e) => {
    e.stopPropagation();
    onUnignoreClick?.(userId);
  };

  return (
    <div
      className={`${styles.listItem} 
        ${isIgnored ? styles.ignoredRow : ""}
        ${isAltRow ? styles.altRowDark : styles.altRowLight}`}
    >
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>{getFirstVisibleChar(displayName)}</div>

        {isActive && (
          <div className={styles.tooltipWrapper}>
            <HiOutlineCheckCircle className={styles.activeIcon} />
            <div className={styles.tooltip}>This is the active session.</div>
          </div>
        )}
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
        {!isIgnored ? (
          <>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.aliasIconButton}`}
              title="Edit alias"
              onClick={handleAliasEdit}
            >
              <HiOutlinePencil />
            </button>

            <button
              type="button"
              className={styles.iconButton}
              title="Delete session"
              onClick={handleDelete}
            >
              <HiOutlineTrash />
            </button>

            {isEditing && (
              <div
                ref={inputRef}
                className={`${styles.aliasInputContainer} ${styles.slideUp}`}
              >
                <AliasInput
                  userId={session.userId}
                  alias={session.alias}
                  onAliasChange={onAliasChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.rightControls}>
            <div className={styles.ignoredPill}>ignored</div>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.ignoredIconButton}`}
              title="Un-ignore"
              onClick={handleUnignore}
            >
              <HiOutlineXCircle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
