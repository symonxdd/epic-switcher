import { useRef, useState, useEffect } from "react";
import {
  HiOutlineClipboardCopy,
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLightBulb,
} from "react-icons/hi";
import AliasInput from "../components/AliasInput";
import toast from "react-hot-toast";
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
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const displayName =
    session?.alias || session?.username || session?.userId || userId;
  const copyDisplayNameValue =
    session?.alias || session?.username || session?.userId || userId;
  const metaLineValue = session?.alias
    ? session?.username || session?.userId
    : session?.userId || userId;

  // Handle clicking outside alias input
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.aliasIconButton}`)
      ) {
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`, { id: "copy-to-clipboard" });
    } catch {
      toast.error("Failed to copy", { id: "copy-error" });
    }
  };

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const handleAliasEdit = (e) => {
    e.stopPropagation();
    setIsEditing((prev) => !prev);
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
      {/* Avatar */}
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>{getFirstVisibleChar(displayName)}</div>

        {isActive && (
          <div className={styles.tooltipWrapper}>
            <HiOutlineCheckCircle className={styles.activeIcon} />
            <div className={styles.tooltip}>This is the active session.</div>
          </div>
        )}
      </div>

      {/* Text block */}
      <div className={styles.textBlock}>
        <div className={styles.inlineRow}>
          <div className={styles.displayName}>{displayName}</div>
          <button
            type="button"
            className={styles.iconButton}
            title="Copy display name"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(copyDisplayNameValue);
            }}
          >
            <HiOutlineClipboardCopy />
          </button>
        </div>

        <div className={styles.inlineRow}>
          <div className={styles.metaLine}>{metaLineValue}</div>
          <button
            type="button"
            className={styles.iconButton}
            title="Copy ID"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(metaLineValue);
            }}
          >
            <HiOutlineClipboardCopy />
          </button>
        </div>
      </div>

      {/* Actions */}
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
              <HiOutlineLightBulb />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
