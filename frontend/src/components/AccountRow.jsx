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
  onAliasChange,
  onDeleteSession,
  onUnignoreClick,
  isEditing = false,
  onEditToggle,
  onCloseEdit,
  onMouseMove,
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
        !e.target.closest(`.${styles.iconButton}`)
      ) {
        onCloseEdit?.();
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [onCloseEdit, isEditing]);

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
    // Close the alias input if it's open
    if (isEditing) {
      onCloseEdit?.();
    }
    onDeleteSession?.(session.userId);
  };

  const handleUnignore = (e) => {
    e.stopPropagation();
    onUnignoreClick?.(userId);
  };

  return (
    <div
      className={`${styles.listItem} ${isIgnored ? styles.ignoredRow : ""}`}
      onMouseMove={onMouseMove}
    >
      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatar}
          style={session?.avatarColor ? { background: session.avatarColor } : {}}
        >
          {session?.avatarImage ? (
            <img
              src={`/avatar-full/${session.avatarImage}`}
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
        {!isIgnored ? (
          <>
            {isActive && (
              <div className={styles.activeBadge}>
                <HiOutlineCheckCircle />
                <span>Active</span>
              </div>
            )}

            <button
              type="button"
              className={`${styles.iconButton} ${session.alias ? styles.hasAlias : ""}`}
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
                className={styles.aliasInputContainer}
              >
                <AliasInput
                  userId={session.userId}
                  alias={session.alias}
                  onAliasChange={onAliasChange}
                  autoFocus={true}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.rightControls}>
            <div className={styles.ignoredPill}>ignored</div>
            <div className={styles.tooltipWrapperLeft}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.ignoredIconButton}`}
                onClick={handleUnignore}
              >
                <HiOutlineXCircle />
              </button>
              <div className={styles.tooltipLeft}>Un-ignore this account</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
